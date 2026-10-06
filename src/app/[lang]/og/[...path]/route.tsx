import { OG, Panel, PanelHead, Rows, Stats, ogImage, truncate } from "@exylia-webs/ui/og";
import { getAllDocParams, readDoc } from "@/lib/docs";
import { LANGS, SITE, documentedPlugins, getPlugin, pageCount, toLang, type Lang } from "@/content/registry";
import { dict } from "@/content/dictionary";

/**
 * Link previews, exported as static PNGs like the search index: `/<lang>/og/index.png` for the
 * landing, `/<lang>/og/<plugin>.png` for a plugin and `/<lang>/og/<plugin>/<slug>.png` for a page,
 * each showing what that link is about. Pages point at them through `ogImageFor` (lib/og.ts).
 */
export const dynamic = "force-static";

const HOST = "docs.exylia.net";
const ACCENT = OG.info;
const base = { product: "Docs", accent: ACCENT, host: HOST };

export function generateStaticParams() {
  return [
    ...LANGS.map((lang) => ({ lang, path: ["index.png"] })),
    ...LANGS.flatMap((lang) => documentedPlugins.map((p) => ({ lang, path: [`${p.id}.png`] }))),
    ...getAllDocParams().map(({ lang, plugin, slug }) => ({ lang, path: [plugin, `${slug}.png`] })),
  ];
}

const T = {
  en: { pages: "Pages", plugins: "Plugins", languages: "Languages", version: "Version", minecraft: "Minecraft", onPage: "On this page", contents: "Contents" },
  es: { pages: "Páginas", plugins: "Plugins", languages: "Idiomas", version: "Versión", minecraft: "Minecraft", onPage: "En esta página", contents: "Contenido" },
};

function landing(lang: Lang) {
  const l = dict.landing;
  const t = T[lang];
  const pages = documentedPlugins.reduce((n, p) => n + pageCount(p), 0);
  return ogImage({
    ...base,
    path: `/${lang}`,
    badge: l.kicker[lang],
    eyebrow: "Minecraft plugins",
    title: `${l.line1[lang]} ${l.line2[lang]} ${l.line3[lang]}`,
    subtitle: l.lead[lang],
    panel: (
      <Panel accent={ACCENT}>
        <PanelHead label={SITE.name} dot={ACCENT} right={LANGS.join(" · ")} />
        <Stats
          items={[
            { label: t.plugins, value: String(documentedPlugins.length) },
            { label: t.pages, value: String(pages) },
            { label: t.languages, value: String(LANGS.length) },
          ]}
        />
        <Rows accent={ACCENT} items={documentedPlugins.slice(0, 3).map((p) => ({ label: p.name, sub: p.tagline[lang], value: `v${p.version}` }))} />
      </Panel>
    ),
  });
}

function plugin(lang: Lang, id: string) {
  const p = getPlugin(id);
  if (!p) return landing(lang);
  const t = T[lang];
  return ogImage({
    ...base,
    path: `/${lang}/docs/${p.id}`,
    badge: p.status === "stable" ? `v${p.version}` : `${p.status} · v${p.version}`,
    eyebrow: p.category[lang],
    title: p.name,
    subtitle: p.summary[lang],
    chips: p.tags.slice(0, 4).map((tag) => tag[lang]),
    panel: (
      <Panel accent={ACCENT}>
        <PanelHead label={t.contents} dot={ACCENT} right={`${pageCount(p)} ${t.pages.toLowerCase()}`} />
        <Stats
          items={[
            { label: t.version, value: p.version },
            { label: t.minecraft, value: p.minecraft },
            { label: t.pages, value: String(pageCount(p)) },
          ]}
        />
        <Rows accent={ACCENT} items={p.nav.slice(0, 3).map((group) => ({ label: group.label[lang], sub: group.pages.length === 1 ? `1 ${t.pages.toLowerCase().replace(/s$/, "")}` : `${group.pages.length} ${t.pages.toLowerCase()}`, value: "" }))} />
      </Panel>
    ),
  });
}

function page(lang: Lang, id: string, slug: string) {
  const p = getPlugin(id);
  const doc = p ? readDoc(id, lang, slug) : null;
  if (!p || !doc) return plugin(lang, id);
  const t = T[lang];
  const sections = doc.headings.filter((h) => h.level === 2);
  return ogImage({
    ...base,
    path: `/${lang}/docs/${p.id}/${doc.slug}`,
    badge: `${p.name} · v${p.version}`,
    eyebrow: doc.group || p.name,
    title: doc.title,
    subtitle: doc.description || p.summary[lang],
    chips: doc.badge ? [doc.badge] : undefined,
    panel: sections.length ? (
      <Panel accent={ACCENT}>
        <PanelHead label={t.onPage} dot={ACCENT} right={`${sections.length}`} />
        <Rows accent={ACCENT} items={sections.slice(0, 5).map((h) => ({ label: truncate(h.text, 26), value: "" }))} />
      </Panel>
    ) : undefined,
  });
}

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string; path: string[] }> }) {
  const { lang: raw, path } = await params;
  const lang = toLang(raw);
  const [first = "", second] = path;
  if (second) return page(lang, first, second.replace(/\.png$/, ""));
  const id = first.replace(/\.png$/, "");
  return id === "index" ? landing(lang) : plugin(lang, id);
}
