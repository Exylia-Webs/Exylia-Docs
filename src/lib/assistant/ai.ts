import { type AssistantModel, type AssistantProvider, type AssistantSend, readAssistantBody } from "@exylia-webs/ui/assistant";

/**
 * The platform AI the docs assistant runs on, from the environment only (copied from Exylia-Utils
 * and adapted: no zod here). `AI_MODEL` unset turns the assistant off (no panel, the route answers
 * 404); a configuration that does not parse turns it off too, saying why in the log once.
 */

export type AiConfig = {
  model: AssistantModel;
  timeoutMs: number;
  /** Tokens (in and out) every visitor together may spend a calendar month (UTC). */
  monthlyTokens: number;
  /** Cloudflare Turnstile, when both keys are set. */
  turnstile: { siteKey: string; secretKey: string } | null;
};

const PROVIDERS: AssistantProvider[] = ["openai", "ollama", "openrouter", "anthropic"];

/** Parses the variables; `null` with the problems when they are set but wrong, `null` without when the assistant is simply off. */
export function parseAiEnv(source: Record<string, string | undefined>): { config: AiConfig | null; problems: string[] } {
  // Coolify writes a variable left blank as "": the same as unset.
  const env = (key: string) => source[key]?.trim() || undefined;
  const model = env("AI_MODEL");
  if (!model) return { config: null, problems: [] };
  const problems: string[] = [];
  const number = (key: string, fallback: number, min: number, max: number, integer = true) => {
    const raw = env(key);
    if (raw === undefined) return fallback;
    const value = Number(raw);
    if (!Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) problems.push(`${key}: expected ${integer ? "an integer" : "a number"} from ${min} to ${max}`);
    return value;
  };

  const provider = (env("AI_PROVIDER") ?? "openai") as AssistantProvider;
  if (!PROVIDERS.includes(provider)) problems.push(`AI_PROVIDER: one of ${PROVIDERS.join(", ")}`);
  const baseUrl = env("AI_BASE_URL") ?? "";
  if (baseUrl) {
    try {
      const url = new URL(baseUrl);
      if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
      if (url.username || url.password) problems.push("AI_BASE_URL: no credentials in the URL, use AI_API_KEY");
    } catch {
      problems.push("AI_BASE_URL: an http(s) URL");
    }
  }
  const apiKey = env("AI_API_KEY") ?? "";
  if (!apiKey && provider !== "ollama") problems.push("AI_API_KEY: required for every provider but ollama");
  if (model.length > 200) problems.push("AI_MODEL: at most 200 characters");
  const maxTokens = number("AI_MAX_TOKENS", 1024, 64, 64_000);
  const timeoutSeconds = number("AI_TIMEOUT_SECONDS", 60, 1, 600, false);
  const monthlyTokens = number("AI_MONTHLY_TOKENS", 2_000_000, 0, Number.MAX_SAFE_INTEGER);

  const siteKey = env("TURNSTILE_SITE_KEY");
  const secretKey = env("TURNSTILE_SECRET_KEY");
  if (Boolean(siteKey) !== Boolean(secretKey)) problems.push("TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY: set both or neither");

  if (problems.length) return { config: null, problems };
  return {
    config: {
      model: { provider, model, apiKey, baseUrl, maxTokens },
      timeoutMs: timeoutSeconds * 1000,
      monthlyTokens,
      turnstile: siteKey && secretKey ? { siteKey, secretKey } : null,
    },
    problems,
  };
}

let cached: { config: AiConfig | null } | undefined;

/** The configuration of this process, read once. */
export function aiConfig(): AiConfig | null {
  if (cached) return cached.config;
  const { config, problems } = parseAiEnv(process.env);
  if (problems.length) console.error(`AI assistant off: ${problems.join("; ")}`);
  cached = { config };
  return config;
}

/** Keys, bearer tokens and the configured secret out of a provider's error text. */
export function redactError(text: string, secrets: string[]): string {
  let out = text;
  for (const secret of secrets) if (secret.length >= 4) out = out.split(secret).join("[redacted]");
  return out
    .replace(/\b(sk|pk|rk|or)-[A-Za-z0-9_-]{8,}/g, "[redacted]")
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/([?&](key|api_key|token)=)[^&\s]+/gi, "$1[redacted]");
}

const RETRIED = new Set([429, 500, 502, 503, 504]);
const ATTEMPTS = 3;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * POSTs one model turn and reads the answer (JSON, or the SSE some gateways send regardless). A
 * non-2xx throws with its status first, so the loop can tell a model without tool calling (a 4xx
 * naming tools) and fall back to answering from the knowledge. Busy answers (429, 5xx) are retried
 * twice with exponential backoff and jitter, honouring a short Retry-After. The text of these
 * errors stays on the server: the route shows the visitor a generic message.
 */
export function aiSend(config: AiConfig, fetcher: typeof fetch = fetch): AssistantSend {
  const secrets = [config.model.apiKey];
  return async (request) => {
    for (let attempt = 1; ; attempt++) {
      let response: Response;
      try {
        response = await fetcher(request.url, { method: "POST", headers: request.headers, body: JSON.stringify(request.body), signal: AbortSignal.timeout(config.timeoutMs), redirect: "error", cache: "no-store" });
      } catch (error) {
        const timeout = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
        throw new Error(timeout ? `The AI provider did not answer within ${config.timeoutMs / 1000} s` : "The AI provider could not be reached");
      }
      const text = await response.text();
      if (response.ok) {
        const body = readAssistantBody(text);
        if (body === null) throw new Error("The AI provider sent an answer that is not JSON");
        return body;
      }
      if (attempt < ATTEMPTS && RETRIED.has(response.status)) {
        const after = Number(response.headers.get("retry-after"));
        const backoff = 500 * 2 ** (attempt - 1);
        await sleep(Number.isFinite(after) && after > 0 && after <= 5 ? after * 1000 : backoff + Math.random() * backoff);
        continue;
      }
      throw new Error(`${response.status} from the AI provider: ${redactError(errorText(text), secrets)}`);
    }
  };
}

function errorText(text: string): string {
  try {
    const body = JSON.parse(text) as { error?: { message?: unknown } | string; message?: unknown };
    const message = typeof body.error === "string" ? body.error : (body.error?.message ?? body.message);
    if (typeof message === "string") return message.slice(0, 300);
  } catch {
    // Not JSON: the start of the text.
  }
  return text.slice(0, 300) || "no details";
}
