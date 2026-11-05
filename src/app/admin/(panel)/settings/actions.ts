"use server";

import { buildAssistantRequest, readAssistantTurn } from "@exylia-webs/ui/assistant";
import type { ActionState } from "@exylia-webs/ui";
import { fill } from "@/content/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { adminText } from "@/lib/admin-i18n";
import { aiSend } from "@/lib/assistant/ai";
import { NoMasterKey, openSecret, platform, savePlatform, sealSecret } from "@/lib/platform";
import { aiSchema, changedKeys, switchProvider, turnstileKeys } from "@/lib/platform-settings";

const text = (form: FormData, name: string) => String(form.get(name) ?? "").trim();
const number = (form: FormData, name: string) => Number(form.get(name));
const flag = (form: FormData, name: string) => form.get(name) === "on";

/** Validates and saves the AI section, with its audit row (names of the changed fields, never values) in the same transaction. */
async function save(input: unknown): Promise<ActionState> {
  const admin = await requireAdmin();
  const t = (await adminText()).a.settings;
  const parsed = aiSchema.safeParse(input);
  if (!parsed.success) return { error: fill(t.errors.invalid, { field: String(parsed.error.issues[0]?.path[0] ?? "") }) };
  try {
    await savePlatform(parsed.data, admin, (before, after) => {
      const changed = changedKeys(before, after);
      return changed.length ? { action: "settings.ai", targetType: "settings", targetId: "ai", targetLabel: "ai", meta: { changed } } : null;
    });
  } catch (error) {
    if (error instanceof NoMasterKey) return { error: t.errors.noMasterKey };
    throw error;
  }
  return { ok: t.saved };
}

/** `ai` (provider) and `answers`: each page saves only its own fields over the section as stored. A disabled Turnstile switch (no keys) posts nothing and keeps what is stored. */
export async function saveAi(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const current = (await platform()).ai;
  if (form.get("section") === "answers") {
    const turnstile = turnstileKeys(process.env).keys ? flag(form, "turnstile") : current.turnstile;
    return save({ ...current, maxTokens: number(form, "maxTokens"), timeoutSeconds: number(form, "timeoutSeconds"), monthlyTokens: number(form, "monthlyTokens"), turnstile });
  }
  // The key is never sent back to the browser: empty keeps the provider's stored one, the box clears it.
  const provider = text(form, "provider");
  const { profiles, apiKey: kept } = switchProvider(current, provider);
  const typed = text(form, "apiKey");
  let apiKey = kept;
  if (flag(form, "clearKey")) apiKey = null;
  else if (typed) {
    try {
      apiKey = sealSecret(typed);
    } catch (error) {
      if (error instanceof NoMasterKey) return { error: (await adminText()).a.settings.errors.noMasterKey };
      throw error;
    }
  }
  return save({ ...current, enabled: flag(form, "enabled"), provider, model: text(form, "model"), apiKey, baseUrl: text(form, "baseUrl"), profiles });
}

/** One tiny call with the saved settings (switched on or not): do the key, URL and model work? */
export async function testAi(): Promise<ActionState> {
  await requireAdmin();
  const t = (await adminText()).a.settings.ai.test;
  const { ai } = await platform();
  if (!ai.model) return { error: t.noModel };
  const apiKey = openSecret(ai.apiKey);
  const model = { provider: ai.provider, model: ai.model, apiKey, baseUrl: ai.baseUrl, maxTokens: 64 };
  const request = buildAssistantRequest({ model, system: "You check that an API connection works.", history: [{ role: "user", text: "Answer with exactly: ok" }], tools: [] });
  const started = Date.now();
  try {
    const body = await aiSend({ model, timeoutMs: ai.timeoutSeconds * 1000, monthlyTokens: 0, turnstile: null })(request);
    const ms = Date.now() - started;
    const answer = readAssistantTurn(ai.provider, body).text.trim();
    return answer ? { ok: fill(t.ok, { ms, answer: answer.slice(0, 80) }) } : { error: fill(t.empty, { ms }) };
  } catch (error) {
    // aiSend's errors are already redacted of the key.
    return { error: fill(t.failed, { reason: error instanceof Error ? error.message : String(error) }) };
  }
}
