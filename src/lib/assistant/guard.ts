import { createHmac, timingSafeEqual } from "node:crypto";
import fs from "node:fs";
import { BlockList, isIP } from "node:net";
import { SITE } from "@/content/registry";

/**
 * What stands between an anonymous visitor and the AI bill: the real client address, per-address
 * rate limits, a monthly token cap for everyone together, a same-origin check and an optional
 * Turnstile pass. The cap lives in the database (AssistantUsage), the rate limits in memory.
 */

// --- Client address (copied from Exylia-Utils) ----------------------------------------------------

// ponytail: Cloudflare's published ranges (cloudflare.com/ips), copied by hand; refresh when they change.
const CLOUDFLARE = new BlockList();
for (const range of ["173.245.48.0/20", "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22", "141.101.64.0/18", "108.162.192.0/18", "190.93.240.0/20", "188.114.96.0/20", "197.234.240.0/22", "198.41.128.0/17", "162.158.0.0/15", "104.16.0.0/13", "104.24.0.0/14", "172.64.0.0/13", "131.0.72.0/22"]) {
  const [net, bits] = range.split("/");
  CLOUDFLARE.addSubnet(net!, Number(bits), "ipv4");
}
for (const range of ["2400:cb00::/32", "2606:4700::/32", "2803:f800::/32", "2405:b500::/32", "2405:8100::/32", "2a06:98c0::/29", "2c0f:f248::/32"]) {
  const [net, bits] = range.split("/");
  CLOUDFLARE.addSubnet(net!, Number(bits), "ipv6");
}

const fromCloudflare = (ip: string) => {
  const version = isIP(ip);
  return version !== 0 && CLOUDFLARE.check(ip, version === 4 ? "ipv4" : "ipv6");
};

/**
 * The address a request came from. The rightmost forwarded hop is the one our reverse proxy
 * (Traefik) saw, the only one nobody can forge; Cloudflare's header counts only when that hop is
 * Cloudflare. Anything that is not an IP address is treated as unknown.
 */
export function clientIp(headers: Headers): string {
  const hop = headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() || headers.get("x-real-ip")?.trim() || "";
  if (!isIP(hop)) return "unknown";
  const cloudflare = headers.get("cf-connecting-ip")?.trim() ?? "";
  return isIP(cloudflare) && fromCloudflare(hop) ? cloudflare : hop;
}

// --- Request shape ---------------------------------------------------------------------------------

/** Only this site's own pages may call: a browser sends Origin on every POST, and Sec-Fetch-Site when it knows. */
export function sameOrigin(headers: Headers): boolean {
  const site = headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return false;
  const origin = headers.get("origin");
  if (!origin) return false;
  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }
  const own = headers.get("x-forwarded-host")?.split(",")[0]?.trim() || headers.get("host");
  return host === own || host === new URL(SITE.url).host;
}

/** The body as text up to `maxBytes`, streamed so an oversized body is never buffered; null when larger. */
export async function readCapped(request: Request, maxBytes: number): Promise<string | null> {
  if (Number(request.headers.get("content-length") ?? 0) > maxBytes) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}

// --- Rate limits -----------------------------------------------------------------------------------

/**
 * Fixed windows per key: `limit` requests a `windowMs`.
 * ponytail: per-process memory, so a restart forgets them and two replicas would each allow the
 * limit; fine for the one container this site runs as. Move to Redis if it ever scales out. The map
 * is swept of expired windows once it passes 10 000 keys, so memory stays bounded.
 */
export class RateLimiter {
  private hits = new Map<string, { count: number; resetAt: number }>();
  readonly limit: number;
  readonly windowMs: number;
  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  /** Whether `key` has used this window up (without counting a new hit). */
  exceeded(key: string, now = Date.now()): boolean {
    const entry = this.hits.get(key);
    return Boolean(entry && entry.resetAt > now && entry.count >= this.limit);
  }

  hit(key: string, now = Date.now()): void {
    const entry = this.hits.get(key);
    if (entry && entry.resetAt > now) {
      entry.count++;
      return;
    }
    if (this.hits.size > 10_000) for (const [k, v] of this.hits) if (v.resetAt <= now) this.hits.delete(k);
    this.hits.set(key, { count: 1, resetAt: now + this.windowMs });
  }
}

/** Every limiter must have room; then the request counts against all of them. */
export function allow(key: string, limiters: RateLimiter[], now = Date.now()): boolean {
  if (limiters.some((limiter) => limiter.exceeded(key, now))) return false;
  for (const limiter of limiters) limiter.hit(key, now);
  return true;
}

// --- Monthly token cap -----------------------------------------------------------------------------

/** `2026-11`, in UTC. */
export const monthOf = (date = new Date()) => date.toISOString().slice(0, 7);
/** `2026-11-05`, in UTC. */
export const dayOf = (date = new Date()) => date.toISOString().slice(0, 10);

/** What the cap needs of the Prisma client, so a test can stand in for it. */
export type UsageDb = {
  $queryRaw<T = unknown>(query: TemplateStringsArray, ...values: unknown[]): Promise<T>;
  $executeRaw(query: TemplateStringsArray, ...values: unknown[]): Promise<number>;
};

/** Tokens every visitor together has spent in `month`. */
export async function usedTokens(db: UsageDb, month = monthOf()): Promise<number> {
  const rows = await db.$queryRaw<{ tokens: bigint | number }[]>`SELECT "tokens" FROM "AssistantUsage" WHERE "month" = ${month}`;
  return Number(rows[0]?.tokens ?? 0);
}

/**
 * Adds one model call's tokens to its month and its day in one statement, each an atomic upsert:
 * concurrent calls on any number of instances add up instead of overwriting each other, and the
 * first call of a month (or a day) creates its row.
 */
export async function chargeTokens(db: UsageDb, tokens: number, now = new Date()): Promise<void> {
  const amount = Math.max(0, Math.ceil(tokens));
  if (!amount) return;
  await db.$executeRaw`WITH month AS (
      INSERT INTO "AssistantUsage" ("month", "tokens", "calls", "updatedAt") VALUES (${monthOf(now)}, ${amount}, 1, NOW())
      ON CONFLICT ("month") DO UPDATE SET "tokens" = "AssistantUsage"."tokens" + EXCLUDED."tokens", "calls" = "AssistantUsage"."calls" + 1, "updatedAt" = NOW()
    )
    INSERT INTO "AssistantUsageDay" ("day", "tokens", "calls", "updatedAt") VALUES (${dayOf(now)}::date, ${amount}, 1, NOW())
    ON CONFLICT ("day") DO UPDATE SET "tokens" = "AssistantUsageDay"."tokens" + EXCLUDED."tokens", "calls" = "AssistantUsageDay"."calls" + 1, "updatedAt" = NOW()`;
}

/** Counts a question refused by the spent cap, on its month and its day, for the admin panel. */
export async function recordQuotaHit(db: UsageDb, now = new Date()): Promise<void> {
  await db.$executeRaw`WITH month AS (
      INSERT INTO "AssistantUsage" ("month", "quotaHits", "updatedAt") VALUES (${monthOf(now)}, 1, NOW())
      ON CONFLICT ("month") DO UPDATE SET "quotaHits" = "AssistantUsage"."quotaHits" + 1
    )
    INSERT INTO "AssistantUsageDay" ("day", "quotaHits", "updatedAt") VALUES (${dayOf(now)}::date, 1, NOW())
    ON CONFLICT ("day") DO UPDATE SET "quotaHits" = "AssistantUsageDay"."quotaHits" + 1`;
}

/**
 * The month's count the assistant kept in `<AI_DATA_DIR>/assistant-usage.json` before the
 * database: when it is this month's, it becomes the month's row, unless one already exists (the
 * insert does nothing then, so importing twice, or from two instances, never counts it twice).
 * Its tokens have no day, so the daily table leaves them out.
 */
export async function importUsageFile(db: UsageDb, file: string, month = monthOf()): Promise<void> {
  let saved: { month?: unknown; tokens?: unknown };
  try {
    saved = JSON.parse(fs.readFileSync(file, "utf8")) as typeof saved;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") console.error("assistant usage file unreadable, not imported", error);
    return;
  }
  if (saved.month !== month || typeof saved.tokens !== "number" || !(saved.tokens > 0)) return;
  await db.$executeRaw`INSERT INTO "AssistantUsage" ("month", "tokens", "updatedAt") VALUES (${month}, ${Math.ceil(saved.tokens)}, NOW()) ON CONFLICT ("month") DO NOTHING`;
}

// --- Turnstile -------------------------------------------------------------------------------------

export const PASS_COOKIE = "docs_ai_pass";
/** How long one solved challenge lets an address keep asking. */
export const PASS_SECONDS = 60 * 60;

const sign = (secret: string, ip: string, expires: number) => createHmac("sha256", secret).update(`docs-ai-pass|${ip}|${expires}`).digest("base64url");

/** A pass for this address until `expires` (seconds since the epoch), as the cookie value. */
export function issuePass(secret: string, ip: string, now = Date.now()): string {
  const expires = Math.floor(now / 1000) + PASS_SECONDS;
  return `${expires}.${sign(secret, ip, expires)}`;
}

export function validPass(secret: string, ip: string, value: string | undefined, now = Date.now()): boolean {
  const [raw, signature] = value?.split(".") ?? [];
  const expires = Number(raw);
  if (!signature || !Number.isInteger(expires) || expires * 1000 <= now) return false;
  const expected = Buffer.from(sign(secret, ip, expires));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** Asks Cloudflare whether a Turnstile token is good. Any failure to ask is a no. */
export async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  if (!token || token.length > 2048) return false;
  try {
    const body = new URLSearchParams({ secret, response: token, ...(ip !== "unknown" ? { remoteip: ip } : {}) });
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body, signal: AbortSignal.timeout(5_000), cache: "no-store" });
    const result = (await response.json()) as { success?: unknown };
    return result.success === true;
  } catch {
    return false;
  }
}
