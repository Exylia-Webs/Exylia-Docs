import path from "node:path";
import { type AssistantEvent, assistantStream, assistantSystemPrompt, parseAssistantRequest, runAssistant } from "@exylia-webs/ui/assistant";
import { dict } from "@/content/dictionary";
import { getPlugin, toLang } from "@/content/registry";
import { aiConfig, aiSend } from "@/lib/assistant/ai";
import { docsKnowledge, docsTools } from "@/lib/assistant/docs-tools";
import { PASS_COOKIE, PASS_SECONDS, RateLimiter, allow, chargeTokens, clientIp, importUsageFile, issuePass, readCapped, recordQuotaHit, sameOrigin, usedTokens, validPass, verifyTurnstile } from "@/lib/assistant/guard";
import { prisma } from "@/lib/db";

/**
 * `/api/assistant/`: the public docs assistant. `GET` tells the page whether it is on (and the
 * Turnstile site key); `POST` runs one turn, read-only tools only, and streams it as NDJSON
 * (`assistantStream`). Off (switched off in /admin/settings, or before the first save no `AI_MODEL`
 * or a bad configuration): both answer 404.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** History, tool results and the new message together; core caps each part well under this. */
const MAX_BODY_BYTES = 512 * 1024;
const MAX_STEPS = 6;

const perMinute = new RateLimiter(10, 60_000);
const perDay = new RateLimiter(50, 24 * 60 * 60_000);
const usageFile = path.join(process.env.AI_DATA_DIR?.trim() || path.join(process.cwd(), "data"), "assistant-usage.json");

let imported: Promise<void> | null = null;
/** This month's tokens; the first read of the process imports the old JSON count first, once. */
async function spent(): Promise<number> {
  imported ??= importUsageFile(prisma, usageFile).catch((error: unknown) => console.error("assistant usage file not imported", error));
  await imported;
  return usedTokens(prisma);
}
const quotaHit = () => recordQuotaHit(prisma).catch((error: unknown) => console.error("assistant quota hit not recorded", error));

type ErrorCode = "off" | "origin" | "json" | "rate" | "challenge" | "too_large" | "bad_request" | "quota";
const fail = (status: number, error: ErrorCode, headers?: Record<string, string>) => Response.json({ error }, { status, headers: { "cache-control": "no-store", ...headers } });

export async function GET() {
  const config = await aiConfig();
  if (!config) return fail(404, "off");
  return Response.json({ enabled: true, turnstileSiteKey: config.turnstile?.siteKey ?? null }, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  const config = await aiConfig();
  if (!config) return fail(404, "off");
  if (!sameOrigin(request.headers)) return fail(403, "origin");
  if (!/^application\/json\s*(;|$)/i.test(request.headers.get("content-type") ?? "")) return fail(415, "json");

  const ip = clientIp(request.headers);
  if (!allow(ip, [perMinute, perDay])) return fail(429, "rate", { "retry-after": "60" });

  // A solved challenge buys this address an hour of questions (a signed cookie), not one request.
  let pass: string | null = null;
  if (config.turnstile) {
    const cookie = /(?:^|;\s*)docs_ai_pass=([^;]+)/.exec(request.headers.get("cookie") ?? "")?.[1];
    if (!validPass(config.turnstile.secretKey, ip, cookie)) {
      if (!(await verifyTurnstile(config.turnstile.secretKey, request.headers.get("x-turnstile-token") ?? "", ip))) return fail(403, "challenge");
      pass = issuePass(config.turnstile.secretKey, ip);
    }
  }

  const raw = await readCapped(request, MAX_BODY_BYTES);
  if (raw === null) return fail(413, "too_large");
  let parsed: ReturnType<typeof parseAssistantRequest>;
  try {
    parsed = parseAssistantRequest(JSON.parse(raw));
  } catch {
    return fail(400, "bad_request");
  }
  if ((await spent()) >= config.monthlyTokens) {
    await quotaHit();
    return fail(429, "quota");
  }

  const url = new URL(request.url);
  const lang = toLang(url.searchParams.get("lang") ?? undefined);
  const plugin = getPlugin(url.searchParams.get("plugin") ?? "")?.id;
  const text = dict.assistant;
  const system = assistantSystemPrompt({ product: "Exylia Docs", knowledge: docsKnowledge(lang, plugin), user: "An anonymous visitor of the public documentation site. They are not signed in and have no workspace: you only read the docs for them.", locale: lang });

  // Charges still on their way count before the next call is allowed.
  const charges: Promise<void>[] = [];
  const events = runAssistant({
    ...parsed,
    model: config.model,
    system,
    tools: docsTools(lang),
    send: aiSend(config),
    maxSteps: MAX_STEPS,
    beforeCall: async () => {
      await Promise.all(charges);
      if ((await spent()) >= config.monthlyTokens) {
        await quotaHit();
        throw new Error(text.quota[lang]);
      }
    },
    onUsage: (used) => {
      charges.push(chargeTokens(prisma, used.inputTokens + used.outputTokens).catch((error: unknown) => console.error("assistant usage not charged", error)));
    },
  });
  const response = assistantStream(publicErrors(events, { quota: text.quota[lang], steps: text.steps[lang], failed: text.failed[lang] }));
  if (pass) response.headers.append("set-cookie", `${PASS_COOKIE}=${pass}; Path=/api/assistant; Max-Age=${PASS_SECONDS}; HttpOnly; SameSite=Strict${url.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https" ? "; Secure" : ""}`);
  return response;
}

/**
 * The run's events with every error made safe to show: the provider's text (statuses, its own
 * messages) goes to the log, the visitor reads one of ours.
 */
async function* publicErrors(events: AsyncGenerator<AssistantEvent>, messages: { quota: string; steps: string; failed: string }): AsyncGenerator<AssistantEvent> {
  for await (const event of events) {
    if (event.type !== "error") {
      yield event;
      continue;
    }
    if (event.message === messages.quota) yield event;
    else if (event.message.startsWith("The assistant took too many steps")) yield { type: "error", message: messages.steps };
    else {
      console.error(`assistant: ${event.message}`);
      yield { type: "error", message: messages.failed };
    }
  }
}
