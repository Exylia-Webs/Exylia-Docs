import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { type AiConfig, aiSend, redactError } from "./ai";
import { docsTools, findPlugin, parsePageUrl, readPage, searchDocs, toPlainText } from "./docs-tools";
import { RateLimiter, type UsageDb, allow, chargeTokens, clientIp, importUsageFile, issuePass, sameOrigin, usedTokens, validPass } from "./guard";

// --- search_docs -----------------------------------------------------------------------------------

test("search finds the page a question is about", () => {
  const hits = searchDocs("ffa arena regeneration", "en");
  assert.ok(hits.length > 0 && hits.length <= 8);
  assert.equal(hits[0]!.plugin, "exyliaffa");
  assert.match(hits[0]!.url, /^\/en\/docs\/exyliaffa\/[a-z0-9-]+\/$/);
  for (const hit of hits) assert.ok(hit.title && hit.snippet && hit.pluginName);
});

test("search within one plugin only returns that plugin", () => {
  const hits = searchDocs("permissions", "en", "exyliaclans");
  assert.ok(hits.length > 0);
  assert.ok(hits.every((hit) => hit.plugin === "exyliaclans"));
});

test("search folds accents, so Spanish works typed without them", () => {
  const hits = searchDocs("configuracion", "es");
  assert.ok(hits.length > 0);
  assert.ok(hits.every((hit) => hit.url.startsWith("/es/docs/")));
});

test("search with nothing to look for returns nothing", () => {
  assert.deepEqual(searchDocs("  ", "en"), []);
  assert.deepEqual(searchDocs("zzqxjvkw", "en"), []);
});

test("plugins resolve by id, name or short name", () => {
  assert.equal(findPlugin("exyliaffa")?.id, "exyliaffa");
  assert.equal(findPlugin("ExyliaFFA")?.id, "exyliaffa");
  assert.equal(findPlugin("ffa")?.id, "exyliaffa");
  assert.equal(findPlugin("nope"), undefined);
});

// --- read_page -------------------------------------------------------------------------------------

test("read_page returns a published page as text", () => {
  const hit = searchDocs("arenas", "en", "exyliaffa")[0]!;
  const page = readPage({ url: hit.url }, "en");
  assert.ok("text" in page);
  assert.equal(page.url, hit.url);
  assert.ok(page.text.length > 200);
  assert.doesNotMatch(page.text, /<(Callout|Field|Step|Card)\b/);
  // The same page by an absolute URL of this site, and by plugin and slug.
  assert.equal(readPage({ url: `https://docs.exylia.net${hit.url}#x` }, "es").url, hit.url);
  assert.equal(readPage({ plugin: "exyliaffa", slug: hit.url.split("/")[4] }, "en").url, hit.url);
});

test("read_page lists a plugin's pages from its own address", () => {
  const page = readPage({ url: "/es/docs/exyliaffa/" }, "en");
  assert.ok("pages" in page && page.pages.length > 3);
  assert.ok(page.pages.every((p) => p.url.startsWith("/es/docs/exyliaffa/")));
});

test("read_page refuses traversal, other hosts and unknown pages", () => {
  const bad: { url?: string; plugin?: string; slug?: string }[] = [
    { url: "/en/docs/../../package.json" },
    { url: "/en/docs/exyliaffa/..%2F..%2F..%2Fpackage" },
    { url: "/en/docs/exyliaffa/%2e%2e" },
    { url: "../../etc/passwd" },
    { url: "file:///etc/passwd" },
    { url: "https://evil.example/en/docs/exyliaffa/arenas/" },
    { url: "/en/docs/exyliaffa/does-not-exist/" },
    { url: "/fr/docs/exyliaffa/arenas/" },
    { plugin: "exyliaffa", slug: "../../../package" },
    { plugin: "../content", slug: "x" },
    { plugin: "exyliaffa", slug: "api.mdx" },
    {},
  ];
  for (const args of bad) assert.throws(() => readPage(args, "en"), Error, JSON.stringify(args));
});

test("parsePageUrl reads only docs addresses", () => {
  assert.deepEqual(parsePageUrl("/en/docs/exyliaffa/arenas/"), { lang: "en", plugin: "exyliaffa", slug: "arenas" });
  assert.deepEqual(parsePageUrl("/docs/exyliaffa"), { lang: undefined, plugin: "exyliaffa", slug: undefined });
  assert.equal(parsePageUrl("/en/og/index.png"), null);
  assert.equal(parsePageUrl("javascript:alert(1)"), null);
});

test("MDX components become their visible text, code stays verbatim", () => {
  const text = toPlainText(
    ['<Callout type="note" title="Heads up">', "Read [this](/docs/exyliaffa/arenas).", "</Callout>", '<Field name="debug" type="boolean" defaultValue="false">', "Logs more.", "</Field>", "```yaml", '<Callout title="kept">', "```", "Inline `List<UUID>` and <player>."].join("\n"),
    "es",
  );
  assert.match(text, /\*\*Heads up\*\*/);
  assert.match(text, /\(\/es\/docs\/exyliaffa\/arenas\)/);
  assert.match(text, /`debug` \(boolean\) default `false`:/);
  assert.match(text, /<Callout title="kept">/);
  assert.match(text, /`List<UUID>` and <player>/);
  assert.doesNotMatch(text, /<\/Callout>|<\/Field>/);
});

test("every tool is read-only and labelled in the visitor's language", async () => {
  const tools = docsTools("es");
  assert.deepEqual(tools.map((tool) => tool.name).sort(), ["list_plugins", "read_page", "search_docs"]);
  assert.ok(tools.every((tool) => tool.mutates === false && !tool.client && tool.label));
  const list = (await tools.find((tool) => tool.name === "list_plugins")!.run!({})) as { plugins: { url: string }[] };
  assert.ok(list.plugins.length > 10 && list.plugins.every((p) => p.url.startsWith("/es/docs/")));
  await assert.rejects(tools.find((tool) => tool.name === "search_docs")!.run!({ query: "x", plugin: "nope" }));
});

// --- Rate limits and the monthly cap ---------------------------------------------------------------

test("10 a minute and 50 a day per address", () => {
  const minute = new RateLimiter(10, 60_000);
  const day = new RateLimiter(50, 86_400_000);
  let now = 1_000_000;
  for (let i = 0; i < 10; i++) assert.ok(allow("1.2.3.4", [minute, day], now));
  assert.equal(allow("1.2.3.4", [minute, day], now), false);
  assert.ok(allow("5.6.7.8", [minute, day], now), "another address has its own window");
  let allowed = 10;
  for (let i = 0; i < 200; i++) {
    now += 61_000;
    for (let j = 0; j < 10; j++) if (allow("1.2.3.4", [minute, day], now)) allowed++;
  }
  assert.equal(allowed, 50, "the day caps it whatever the minute allows");
  now += 86_400_000;
  assert.ok(allow("1.2.3.4", [minute, day], now), "a new day starts over");
});

/** An in-memory AssistantUsage: each upsert adds to the row atomically, as Postgres' ON CONFLICT does. */
function fakeDb() {
  const months = new Map<string, number>();
  const days = new Map<string, number>();
  const sql: string[] = [];
  const db: UsageDb = {
    async $queryRaw<T>(_query: TemplateStringsArray, month: unknown) {
      return (months.has(month as string) ? [{ tokens: BigInt(months.get(month as string)!) }] : []) as T;
    },
    async $executeRaw(query: TemplateStringsArray, ...values: unknown[]) {
      const text = query.join("?");
      sql.push(text);
      if (text.includes("DO NOTHING")) {
        if (!months.has(values[0] as string)) months.set(values[0] as string, values[1] as number);
      } else if (text.includes('"tokens" = "AssistantUsage"."tokens" + EXCLUDED."tokens"')) {
        const [month, amount, day] = values as [string, number, string];
        months.set(month, (months.get(month) ?? 0) + amount);
        days.set(day, (days.get(day) ?? 0) + amount);
      }
      return 1;
    },
  };
  return { db, months, days, sql };
}

test("the monthly cap adds up concurrent charges atomically, per month and per day", async () => {
  const { db, months, days, sql } = fakeDb();
  const now = new Date("2026-11-05T12:00:00Z");
  assert.equal(await usedTokens(db, "2026-11"), 0);
  await Promise.all([chargeTokens(db, 700.2, now), chargeTokens(db, 400, now)]);
  assert.equal(await usedTokens(db, "2026-11"), 1101);
  assert.equal(days.get("2026-11-05"), 1101);
  assert.equal(sql.length, 2, "one statement per charge, month and day together");
  for (const statement of sql) {
    assert.match(statement, /ON CONFLICT \("month"\) DO UPDATE SET "tokens" = "AssistantUsage"\."tokens" \+ EXCLUDED\."tokens"/);
    assert.match(statement, /ON CONFLICT \("day"\) DO UPDATE SET "tokens" = "AssistantUsageDay"\."tokens" \+ EXCLUDED\."tokens"/);
  }
  await chargeTokens(db, 0, now);
  assert.equal(sql.length, 2, "nothing spent, nothing written");
  assert.equal(await usedTokens(db, "2026-12"), 0, "a new month starts at zero");
  await chargeTokens(db, 5, new Date("2026-12-01T00:00:00Z"));
  assert.equal(months.get("2026-12"), 5);
  assert.equal(months.get("2026-11"), 1101);
});

test("the old JSON count is imported once, only for this month, never over a row", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "docs-ai-"));
  const file = path.join(dir, "assistant-usage.json");
  const { db, months } = fakeDb();
  await importUsageFile(db, file, "2026-11");
  assert.equal(months.size, 0, "no file, nothing to import");
  fs.writeFileSync(file, JSON.stringify({ month: "2026-11", tokens: 1234 }));
  await importUsageFile(db, file, "2026-12");
  assert.equal(months.size, 0, "last month's count is not this month's");
  await importUsageFile(db, file, "2026-11");
  await importUsageFile(db, file, "2026-11");
  assert.equal(await usedTokens(db, "2026-11"), 1234, "a second import changes nothing");
  await chargeTokens(db, 10, new Date("2026-11-20T00:00:00Z"));
  assert.equal(await usedTokens(db, "2026-11"), 1244);
  fs.rmSync(dir, { recursive: true, force: true });
});

// --- Request checks ----------------------------------------------------------------------------------

test("the client address is the proxy's hop, Cloudflare's header only from Cloudflare", () => {
  assert.equal(clientIp(new Headers({ "x-forwarded-for": "6.6.6.6, 9.9.9.9" })), "9.9.9.9");
  assert.equal(clientIp(new Headers({ "x-forwarded-for": "9.9.9.9", "cf-connecting-ip": "6.6.6.6" })), "9.9.9.9");
  assert.equal(clientIp(new Headers({ "x-forwarded-for": "162.158.1.1", "cf-connecting-ip": "8.8.4.4" })), "8.8.4.4");
  assert.equal(clientIp(new Headers({ "x-forwarded-for": "not-an-ip" })), "unknown");
  assert.equal(clientIp(new Headers()), "unknown");
});

test("only this site's own pages may post", () => {
  assert.ok(sameOrigin(new Headers({ origin: "https://docs.exylia.net", host: "docs.exylia.net", "sec-fetch-site": "same-origin" })));
  assert.ok(sameOrigin(new Headers({ origin: "http://localhost:3010", host: "localhost:3010" })));
  assert.equal(sameOrigin(new Headers({ origin: "https://evil.example", host: "docs.exylia.net" })), false);
  assert.equal(sameOrigin(new Headers({ origin: "https://docs.exylia.net", "sec-fetch-site": "cross-site" })), false);
  assert.equal(sameOrigin(new Headers({ host: "docs.exylia.net" })), false, "no Origin, no call");
});

test("a Turnstile pass is bound to its address and expires", () => {
  const now = Date.now();
  const pass = issuePass("secret", "1.2.3.4", now);
  assert.ok(validPass("secret", "1.2.3.4", pass, now));
  assert.equal(validPass("secret", "5.6.7.8", pass, now), false);
  assert.equal(validPass("other", "1.2.3.4", pass, now), false);
  assert.equal(validPass("secret", "1.2.3.4", pass, now + 2 * 3600_000), false);
  assert.equal(validPass("secret", "1.2.3.4", `9999999999.${pass.split(".")[1]}`, now), false);
  assert.equal(validPass("secret", "1.2.3.4", undefined, now), false);
});

// --- Configuration and transport ---------------------------------------------------------------------

test("busy providers are retried, errors keep the status and lose the key", async () => {
  const config: AiConfig = { model: { provider: "openai", model: "m", apiKey: "sk-secretsecretsecret", baseUrl: "", maxTokens: 1024 }, timeoutMs: 5_000, monthlyTokens: 1000, turnstile: null };
  let calls = 0;
  const flaky = (async () => {
    calls++;
    return calls < 3 ? new Response("busy", { status: 503, headers: { "retry-after": "0" } }) : Response.json({ choices: [{ message: { content: "hi" } }] });
  }) as unknown as typeof fetch;
  const body = await aiSend(config, flaky)({ url: "https://x/v1/chat/completions", headers: {}, body: {} });
  assert.equal(calls, 3);
  assert.deepEqual(body, { choices: [{ message: { content: "hi" } }] });

  const leaky = (async () => Response.json({ error: { message: "bad key sk-secretsecretsecret" } }, { status: 401 })) as unknown as typeof fetch;
  await assert.rejects(aiSend(config, leaky)({ url: "https://x", headers: {}, body: {} }), (error: Error) => error.message.startsWith("401 ") && !error.message.includes("secretsecret"));
  assert.equal(redactError("Bearer abc.def key sk-abcdefghijkl", []), "Bearer [redacted] key [redacted]");
});
