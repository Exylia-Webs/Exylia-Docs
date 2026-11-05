import assert from "node:assert/strict";
import { test } from "node:test";
import { aiConfigFrom, changedKeys, platformSchema, profileView, readPlatform, seedFromEnv, switchProvider, turnstileKeys } from "./platform-settings";

test("before the first save the settings come from the AI_* variables, so deploying changes nothing", () => {
  const env = {
    AI_PROVIDER: "openrouter",
    AI_BASE_URL: "",
    AI_API_KEY: " sk-or-abc ",
    AI_MODEL: "openai/gpt-4.1-mini",
    AI_MAX_TOKENS: "2048",
    AI_TIMEOUT_SECONDS: "90",
    AI_MONTHLY_TOKENS: "500000",
    TURNSTILE_SITE_KEY: "site",
    TURNSTILE_SECRET_KEY: "secret",
  };
  const { settings, error } = seedFromEnv(env);
  assert.equal(error, null);
  assert.deepEqual(settings.ai, {
    enabled: true,
    provider: "openrouter",
    model: "openai/gpt-4.1-mini",
    apiKey: { plain: "sk-or-abc" },
    baseUrl: "",
    profiles: {},
    maxTokens: 2048,
    timeoutSeconds: 90,
    monthlyTokens: 500000,
    turnstile: true,
  });
  assert.deepEqual(aiConfigFrom(settings.ai, "sk-or-abc", turnstileKeys(env).keys), {
    model: { provider: "openrouter", model: "openai/gpt-4.1-mini", apiKey: "sk-or-abc", baseUrl: "", maxTokens: 2048 },
    timeoutMs: 90_000,
    monthlyTokens: 500000,
    turnstile: { siteKey: "site", secretKey: "secret" },
  });
});

test("no model, a bad variable or a missing key turns the assistant off, as before", () => {
  const empty = seedFromEnv({ AI_MODEL: "  " });
  assert.equal(empty.settings.ai.enabled, false);
  assert.equal(aiConfigFrom(empty.settings.ai, "", null), null);
  // Defaults match the old env defaults.
  assert.equal(empty.settings.ai.maxTokens, 1024);
  assert.equal(empty.settings.ai.timeoutSeconds, 60);
  assert.equal(empty.settings.ai.monthlyTokens, 2_000_000);
  assert.equal(empty.settings.ai.turnstile, false);

  for (const env of [
    { AI_MODEL: "m", AI_PROVIDER: "gemini", AI_API_KEY: "k" },
    { AI_MODEL: "m", AI_API_KEY: "k", AI_BASE_URL: "ftp://x" },
    { AI_MODEL: "m", AI_API_KEY: "k", AI_BASE_URL: "https://user:pass@x.example" },
    { AI_MODEL: "m", AI_API_KEY: "k", AI_MAX_TOKENS: "lots" },
    { AI_MODEL: "m", AI_API_KEY: "k", AI_TIMEOUT_SECONDS: "0" },
    { AI_MODEL: "m", AI_API_KEY: "k", AI_MONTHLY_TOKENS: "-1" },
  ]) {
    const bad = seedFromEnv(env);
    assert.ok(bad.error, JSON.stringify(env));
    assert.equal(aiConfigFrom(bad.settings.ai, "k", null), null, JSON.stringify(env));
  }

  const keyless = seedFromEnv({ AI_MODEL: "gpt-4.1-mini" });
  assert.equal(aiConfigFrom(keyless.settings.ai, "", null), null);
  const ollama = seedFromEnv({ AI_MODEL: "qwen3", AI_PROVIDER: "ollama", AI_BASE_URL: "http://ollama:11434" });
  assert.deepEqual(aiConfigFrom(ollama.settings.ai, "", null), { model: { provider: "ollama", model: "qwen3", apiKey: "", baseUrl: "http://ollama:11434", maxTokens: 1024 }, timeoutMs: 60_000, monthlyTokens: 2_000_000, turnstile: null });
});

test("Turnstile: both keys or neither, and only while switched on", () => {
  assert.deepEqual(turnstileKeys({}), { keys: null, error: null });
  assert.match(turnstileKeys({ TURNSTILE_SITE_KEY: "only-one" }).error ?? "", /both or neither/);
  const keys = { siteKey: "s", secretKey: "t" };
  const ai = platformSchema.parse({ ai: { enabled: true, model: "m", turnstile: false } }).ai;
  assert.equal(aiConfigFrom(ai, "k", keys)?.turnstile, null, "switched off in the panel");
  assert.deepEqual(aiConfigFrom({ ...ai, turnstile: true }, "k", keys)?.turnstile, keys);
  assert.equal(aiConfigFrom({ ...ai, turnstile: true }, "k", null)?.turnstile, null, "no keys, nothing to run");
});

test("a broken or foreign row falls back to the defaults, never throws", () => {
  assert.equal(readPlatform({ ai: { provider: "skynet" } }).ai.enabled, false);
  assert.equal(readPlatform(null).ai.provider, "openai");
  assert.equal(readPlatform({}).ai.maxTokens, 1024);
});

test("switching provider keeps each provider's model, URL and key apart", () => {
  const ai = platformSchema.parse({ ai: { enabled: true, provider: "openai", model: "gpt-4.1-mini", apiKey: { enc: "v1:openai" }, baseUrl: "" } }).ai;
  const toOllama = switchProvider(ai, "ollama");
  assert.equal(toOllama.apiKey, null, "the new provider never inherits the old one's key");
  assert.deepEqual(toOllama.profiles, { openai: { model: "gpt-4.1-mini", apiKey: { enc: "v1:openai" }, baseUrl: "" } });

  const onOllama = { ...ai, provider: "ollama" as const, model: "qwen2.5:14b", apiKey: null, baseUrl: "http://gpu:11434/v1", profiles: toOllama.profiles };
  const back = switchProvider(onOllama, "openai");
  assert.deepEqual(back.apiKey, { enc: "v1:openai" }, "switching back finds its key");
  assert.deepEqual(Object.keys(back.profiles), ["ollama"]);
  assert.deepEqual(switchProvider(ai, "openai"), { profiles: ai.profiles, apiKey: ai.apiKey });

  // The form sees values and whether a key is saved, never the key.
  assert.deepEqual(profileView(toOllama.profiles), { openai: { values: { model: "gpt-4.1-mini", baseUrl: "" }, keySaved: true } });
  assert.doesNotMatch(JSON.stringify(profileView(back.profiles)), /enc/);
});

test("the audit names the changed fields only", () => {
  assert.deepEqual(changedKeys({ model: "a", apiKey: { enc: "x" }, maxTokens: 1 }, { model: "b", apiKey: { enc: "y" }, maxTokens: 1 }), ["apiKey", "model"]);
});
