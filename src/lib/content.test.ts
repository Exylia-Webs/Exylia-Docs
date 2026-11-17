import assert from "node:assert/strict";
import { test } from "node:test";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import { getAllDocParams, readDoc } from "./docs";
import { readPluginData, type DataKind } from "./plugin-data";

/**
 * Every page in the registry exists, compiles as MDX, links only to pages that exist, and every
 * `<Commands />`/`<Permissions />`/`<Placeholders />` has rows in `data.json`.
 * `DOCS_PLUGIN=exyliaffa pnpm test` checks one plugin (the whole site takes a while).
 */
const only = process.env.DOCS_PLUGIN?.split(",");
const params = getAllDocParams().filter((p) => !only || only.includes(p.plugin));
const exists = new Set(getAllDocParams().map((p) => `${p.plugin}/${p.slug}`));

test("docs pages compile, link to real pages and find their data", async () => {
  const problems: string[] = [];
  for (const { lang, plugin, slug } of params) {
    const where = `content/${plugin}/${lang}/${slug}.mdx`;
    const doc = readDoc(plugin, lang, slug);
    if (!doc) {
      problems.push(`${where}: missing (declared in the registry)`);
      continue;
    }
    try {
      await serialize(doc.body, { mdxOptions: { remarkPlugins: [remarkGfm] } });
    } catch (e) {
      problems.push(`${where}: ${(e as Error).message.split("\n")[0]}`);
    }
    for (const m of doc.body.matchAll(/\]\(\/docs\/([^/#)\s]+)\/([^/#)\s]+)\/?(?:#([^)]*))?\)|href="\/docs\/([^/#"]+)\/([^/#"]+)\/?(?:#([^"]*))?"/g)) {
      const [p, s, anchor] = [m[1] ?? m[4], m[2] ?? m[5], m[3] ?? m[6]];
      if (!exists.has(`${p}/${s}`)) problems.push(`${where}: broken link /docs/${p}/${s}`);
      else if (anchor && !anchor.startsWith("row-") && !readDoc(p, lang, s)?.headings.some((h) => h.id === decodeURIComponent(anchor)))
        problems.push(`${where}: no heading #${anchor} in /docs/${p}/${s}`);
    }
    for (const m of doc.body.matchAll(/<(Commands|Permissions|Placeholders)\b([^>]*)\/>/g)) {
      const from = /from="([^"]+)"/.exec(m[2])?.[1] ?? plugin;
      const group = /group="([^"]+)"/.exec(m[2])?.[1];
      const rows = readPluginData(from)?.[m[1].toLowerCase() as DataKind]?.filter((r) => !group || r.group === group);
      if (!rows?.length) problems.push(`${where}: <${m[1]}${group ? ` group="${group}"` : ""} /> has no rows in content/${from}/data.json`);
    }
  }
  assert.deepEqual(problems, []);
});
