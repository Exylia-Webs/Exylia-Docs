import { DEFAULT_LANG, LANGS, SITE, documentedPlugins } from "@/content/registry";

export const dynamic = "force-static";

/** https://llmstxt.org: what an outside model reads first. Each plugin links to its whole docs as one text file. */
export function GET() {
  const lang = DEFAULT_LANG;
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description[lang]}`,
    "",
    "Every Exylia plugin runs on ExyliaLib. Colours, messages and languages, menus, database and sounds are configured in ExyliaLib for all plugins at once: when a question about any plugin is about those, read ExyliaLib too.",
    "",
    `Each plugin's full documentation is one plain-text file per language (${LANGS.join(", ")}): /<lang>/docs/<plugin>/llms.txt.`,
    "",
    "## Plugins",
    "",
    ...documentedPlugins.map((p) => `- [${p.name}](${SITE.url}/${lang}/docs/${p.id}/llms.txt): ${p.summary[lang]}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
