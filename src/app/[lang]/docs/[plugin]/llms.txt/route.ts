import { notFound } from "next/navigation";
import { LANGS, SITE, documentedPlugins, getPlugin, toLang } from "@/content/registry";
import { getNav, readDoc } from "@/lib/docs";
import { toPlainText } from "@/lib/assistant/docs-tools";

export const dynamic = "force-static";

export function generateStaticParams() {
  return LANGS.flatMap((lang) => documentedPlugins.map((p) => ({ lang, plugin: p.id })));
}

/** One plugin's whole documentation as Markdown, in reading order, for outside models and crawlers. */
export async function GET(_: Request, { params }: { params: Promise<{ lang: string; plugin: string }> }) {
  const { lang: raw, plugin } = await params;
  const lang = toLang(raw);
  const entry = getPlugin(plugin);
  if (!entry?.nav.length) notFound();
  const pages = getNav(plugin, lang).flatMap((section) =>
    section.pages.map((meta) => {
      const doc = readDoc(meta.plugin, lang, meta.slug);
      const url = `${SITE.url}/${lang}/docs/${meta.plugin}/${meta.slug}/`;
      return doc ? `# ${doc.title}\n\nSection: ${section.label} · ${url}\n\n${doc.description}\n\n${toPlainText(doc.body, lang, meta.plugin)}` : "";
    }),
  );
  const head = `# ${entry.name} ${entry.version}\n\n> ${entry.summary[lang]}\n\nMinecraft ${entry.minecraft}.`;
  return new Response([head, ...pages].join("\n\n---\n\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
