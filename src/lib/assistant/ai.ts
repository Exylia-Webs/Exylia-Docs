import { type AssistantSend, readAssistantBody } from "@exylia-webs/ui/assistant";
import { openSecret, platform } from "@/lib/platform";
import { type AiConfig, aiConfigFrom, turnstileKeys } from "@/lib/platform-settings";

export type { AiConfig };

let warned = false;

/**
 * The platform AI the docs assistant runs on: the `ai` section of the platform settings
 * (/admin/settings), read through their short cache; before the first save, the AI_* variables.
 * Off, without a model, or without the key its provider needs: null (no button, the route answers
 * 404). The Turnstile keys stay in the environment; only one of them set turns it off too, as before.
 */
export async function aiConfig(): Promise<AiConfig | null> {
  const { ai } = await platform();
  const { keys, error } = turnstileKeys(process.env);
  if (error) {
    if (!warned) console.error(`AI assistant off: ${error}`);
    warned = true;
    return null;
  }
  return aiConfigFrom(ai, openSecret(ai.apiKey), keys);
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
