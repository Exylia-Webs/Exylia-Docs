import { z } from "zod";
import type { AssistantModel } from "@exylia-webs/ui/assistant";

/**
 * The platform settings a super admin edits in /admin/settings (one PlatformSettings row, JSON),
 * and how they become the assistant's configuration (mirrors Exylia-Utils). No database here, so a
 * test can check it. Before the first save the row does not exist and the settings start from the
 * AI_* variables, so a deployment that moves to the panel changes nothing until an admin saves.
 */

export const AI_PROVIDERS = ["openai", "ollama", "openrouter", "anthropic"] as const;
export type AiProvider = (typeof AI_PROVIDERS)[number];

/** A key as stored: sealed with SECRET_KEY, or (only before the first save) as AI_API_KEY gives it. */
const secretSchema = z.union([z.object({ enc: z.string() }), z.object({ plain: z.string() })]).nullable();
export type StoredSecret = z.infer<typeof secretSchema>;
/** Empty, or an http(s) URL without credentials in it (the key goes in its own field). */
const optionalUrl = z.union([z.literal(""), z.url({ protocol: /^https?$/ }).refine((value) => !new URL(value).username && !new URL(value).password, "no credentials in the URL")]);

const profileSchema = z.object({ model: z.string().max(200).default(""), apiKey: secretSchema.default(null), baseUrl: optionalUrl.default("") });

export const aiSchema = z.object({
  enabled: z.boolean().default(false),
  provider: z.enum(AI_PROVIDERS).default("openai"),
  model: z.string().trim().max(200).default(""),
  apiKey: secretSchema.default(null),
  /** Empty: the provider's own endpoint. */
  baseUrl: optionalUrl.default(""),
  /** What each other provider last had, so switching back to one finds its model, key and URL. */
  profiles: z.record(z.string(), profileSchema).default({}),
  maxTokens: z.number().int().min(64).max(64_000).default(1024),
  timeoutSeconds: z.number().min(1).max(600).default(60),
  /** Tokens (in and out) every visitor together may spend a calendar month (UTC). 0 refuses every question. */
  monthlyTokens: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER).default(2_000_000),
  /** Cloudflare Turnstile before a question; it only runs while both TURNSTILE_* keys are set. */
  turnstile: z.boolean().default(false),
});

export const platformSchema = z.object({ ai: aiSchema.prefault({}) });
export type PlatformSettings = z.infer<typeof platformSchema>;
export type AiSettings = PlatformSettings["ai"];

const DEFAULTS = (): PlatformSettings => platformSchema.parse({});

type Env = Record<string, string | undefined>;
/** Coolify writes a blank variable as "": the same as unset. */
const read = (env: Env, key: string) => env[key]?.trim() || undefined;

export type TurnstileKeys = { siteKey: string; secretKey: string };

/** The Turnstile keys, which stay in the environment: both, neither, or an error (the assistant goes off, as before). */
export function turnstileKeys(env: Env): { keys: TurnstileKeys | null; error: string | null } {
  const siteKey = read(env, "TURNSTILE_SITE_KEY");
  const secretKey = read(env, "TURNSTILE_SECRET_KEY");
  if (Boolean(siteKey) !== Boolean(secretKey)) return { keys: null, error: "TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY: set both or neither" };
  return { keys: siteKey && secretKey ? { siteKey, secretKey } : null, error: null };
}

/** The settings before the first save, from the AI_* variables (and Turnstile on when its keys are set). */
export function seedFromEnv(env: Env): { settings: PlatformSettings; error: string | null } {
  const number = (key: string) => (read(env, key) === undefined ? undefined : Number(read(env, key)));
  const model = read(env, "AI_MODEL");
  const key = read(env, "AI_API_KEY");
  const parsed = platformSchema.safeParse({
    ai: {
      enabled: Boolean(model),
      provider: read(env, "AI_PROVIDER"),
      model,
      apiKey: key ? { plain: key } : null,
      baseUrl: read(env, "AI_BASE_URL"),
      maxTokens: number("AI_MAX_TOKENS"),
      timeoutSeconds: number("AI_TIMEOUT_SECONDS"),
      monthlyTokens: number("AI_MONTHLY_TOKENS"),
      turnstile: turnstileKeys(env).keys !== null,
    },
  });
  // A configuration that does not parse turns the assistant off, as it did when it lived in env alone.
  if (!parsed.success) return { settings: DEFAULTS(), error: parsed.error.issues.map((issue) => `${issue.path.slice(1).join(".")}: ${issue.message}`).join("; ") };
  return { settings: parsed.data, error: null };
}

/** A stored row; one written by a newer or broken version falls back to the defaults (assistant off). */
export function readPlatform(data: unknown): PlatformSettings {
  const parsed = platformSchema.safeParse(data);
  return parsed.success ? parsed.data : DEFAULTS();
}

/**
 * Switching to `provider`: the current provider's fields go to `profiles` and the new one leaves
 * it. `apiKey` is the key to keep when none is typed: the new provider's own, never the old one's.
 */
export function switchProvider(current: AiSettings, provider: string): Pick<AiSettings, "profiles" | "apiKey"> {
  if (provider === current.provider) return { profiles: current.profiles, apiKey: current.apiKey };
  const { [provider]: next, ...rest } = current.profiles;
  const { model, apiKey, baseUrl } = current;
  return { profiles: { ...rest, [current.provider]: { model, apiKey, baseUrl } }, apiKey: next?.apiKey ?? null };
}

/** The profiles a settings form swaps in: field values and whether a key is saved, never the key. */
export function profileView(profiles: AiSettings["profiles"]) {
  return Object.fromEntries(Object.entries(profiles).map(([provider, { apiKey, ...values }]) => [provider, { values, keySaved: !!apiKey }]));
}

/** Top-level keys whose values differ (compared as JSON). The audit stores names only, never values. */
export function changedKeys(before: Record<string, unknown>, after: Record<string, unknown>): string[] {
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...keys].filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key])).sort();
}

export type AiConfig = {
  model: AssistantModel;
  timeoutMs: number;
  /** Tokens (in and out) every visitor together may spend a calendar month (UTC). */
  monthlyTokens: number;
  /** Cloudflare Turnstile: switched on and both keys set. */
  turnstile: TurnstileKeys | null;
};

/** The assistant's configuration, or null while it is off, has no model, or lacks the key its provider needs. */
export function aiConfigFrom(ai: AiSettings, apiKey: string, turnstile: TurnstileKeys | null): AiConfig | null {
  if (!ai.enabled || !ai.model || (ai.provider !== "ollama" && !apiKey)) return null;
  return {
    model: { provider: ai.provider, model: ai.model, apiKey, baseUrl: ai.baseUrl, maxTokens: ai.maxTokens },
    timeoutMs: ai.timeoutSeconds * 1000,
    monthlyTokens: ai.monthlyTokens,
    turnstile: ai.turnstile ? turnstile : null,
  };
}
