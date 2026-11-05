import { createHmac, timingSafeEqual } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { BlockList, isIP } from "node:net";
import { SITE } from "@/content/registry";

/**
 * What stands between an anonymous visitor and the AI bill: the real client address, per-address
 * rate limits, a monthly token cap for everyone together, a same-origin check and an optional
 * Turnstile pass. No database here: the cap is a small JSON file on a volume, the rate limits live
 * in memory.
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

/**
 * Tokens spent this month by every visitor together, kept in `<dir>/assistant-usage.json` so a
 * restart or a redeploy does not reset the cap (mount a volume there). Written atomically (temp
 * file and rename) after every model call. Without a writable directory it counts in memory and
 * says so once.
 * ponytail: one process owns the file; concurrent requests may each pass the check just before the
 * cap and overshoot it by a few calls' worth (bounded by AI_MAX_TOKENS × steps). Two replicas would
 * need Redis or a database instead.
 */
export class UsageStore {
  private state = { month: "", tokens: 0 };
  private loaded = false;
  private warned = false;
  private readonly file: string | null;
  constructor(file: string | null) {
    this.file = file;
  }

  private load() {
    if (this.loaded) return;
    this.loaded = true;
    if (!this.file) return;
    try {
      const saved = JSON.parse(fs.readFileSync(this.file, "utf8")) as { month?: unknown; tokens?: unknown };
      if (typeof saved.month === "string" && typeof saved.tokens === "number" && saved.tokens >= 0) this.state = { month: saved.month, tokens: saved.tokens };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") console.error("assistant usage file unreadable, starting from 0", error);
    }
  }

  used(month = monthOf()): number {
    this.load();
    return this.state.month === month ? this.state.tokens : 0;
  }

  charge(tokens: number, month = monthOf()): void {
    const amount = Math.max(0, Math.ceil(tokens));
    if (!amount) return;
    this.state = { month, tokens: this.used(month) + amount };
    if (!this.file) return;
    try {
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      const temp = `${this.file}.${process.pid}.tmp`;
      fs.writeFileSync(temp, JSON.stringify(this.state));
      fs.renameSync(temp, this.file);
    } catch (error) {
      if (!this.warned) console.error(`assistant usage not persisted to ${this.file}: counting in memory until it is writable`, error);
      this.warned = true;
    }
  }
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
