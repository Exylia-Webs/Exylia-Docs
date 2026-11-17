import type { Metadata } from "next";
import { ogImageFor } from "@/lib/og";
import { notFound } from "next/navigation";
import { Mdx } from "@/lib/mdx";
import { Toc } from "@/components/docs/Toc";
import { Pager } from "@/components/docs/Pager";
import { MobileNav } from "@/components/docs/Sidebar";
import { ArticleFade, DocHeader } from "@/components/docs/DocHeader";
import { getAllDocParams, getFlatNav, getNav, getNeighbours, readDoc } from "@/lib/docs";
import { KeyNav, ReadMarker } from "@/components/docs/Reading";
import { LANGS, SITE, getPlugin, toLang, translateSlug } from "@/content/registry";
import { dict } from "@/content/dictionary";
import { buildConfigMap, noteFor } from "@/lib/config-map";
import { ConfigExplorer } from "@/components/docs/ConfigExplorer";
import { toPlainText } from "@/lib/assistant/docs-tools";

type Params = Promise<{ lang: string; plugin: string; slug: string }>;

export function generateStaticParams() {
  return getAllDocParams();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolved = await params;
  const lang = toLang(resolved.lang);
  const doc = readDoc(resolved.plugin, lang, resolved.slug);
  const entry = getPlugin(resolved.plugin);
  if (!doc || !entry) return {};

  // Every language's URL for this same page, so a search engine pairs them.
  const languages = Object.fromEntries(
    LANGS.map((code) => {
      const slug = code === lang ? doc.slug : translateSlug(entry.id, doc.slug, lang, code);
      return [code, slug ? `/${code}/docs/${entry.id}/${slug}` : `/${code}/docs/${entry.id}`];
    }),
  );

  return {
    title: `${doc.title} — ${entry.name}`,
    description: doc.description || entry.summary[lang],
    alternates: { canonical: `/${lang}/docs/${entry.id}/${doc.slug}`, languages },
    openGraph: { ...ogImageFor(lang, entry.id, doc.slug).openGraph, title: `${doc.title} — ${entry.name}`, description: doc.description || entry.summary[lang] },
    twitter: ogImageFor(lang, entry.id, doc.slug).twitter,
  };
}

export default async function DocPage({ params }: { params: Params }) {
  const resolved = await params;
  const lang = toLang(resolved.lang);
  const entry = getPlugin(resolved.plugin);
  const doc = readDoc(resolved.plugin, lang, resolved.slug);
  if (!entry || !doc) notFound();

  const sections = getNav(resolved.plugin, lang);
  const { previous, next } = getNeighbours(resolved.plugin, lang, resolved.slug);
  const flat = getFlatNav(resolved.plugin, lang);
  const index = flat.findIndex((d) => d.slug === doc.slug) + 1;
  const minutes = Math.max(1, Math.round(doc.body.split(/\s+/).length / 200));
  const markdown = `# ${doc.title}\n\n${doc.description ? `${doc.description}\n\n` : ""}${toPlainText(doc.body, lang, entry.id)}\n\nSource: ${SITE.url}/${lang}/docs/${entry.id}/${doc.slug}\n`;
  const config = buildConfigMap(doc.body);
  const explorer = config?.files.map((f) => ({
    name: f.name,
    lines: f.lines.map((l) => (l.path ? { ...l, note: noteFor(config, l.path, l.anchor) } : l)),
  }));
  const to = (d: typeof previous) => (d ? `/${lang}/docs/${d.plugin}/${d.slug}` : undefined);

  return (
    <>
      <MobileNav plugin={entry} sections={sections} title={doc.title} lang={lang} />

      <div className="flex gap-12">
        <article data-doc className="min-w-0 max-w-4xl flex-1 pb-4 2xl:max-w-[68rem]">
          <KeyNav previous={to(previous)} next={to(next)} />
          <DocHeader
            lang={lang}
            plugin={{ id: entry.id, name: entry.name }}
            group={doc.group || entry.name}
            title={doc.title}
            description={doc.description}
            badge={doc.badge}
            updated={doc.updated}
            minutes={minutes}
            index={index}
            total={flat.length}
            markdown={markdown}
          />

          <ArticleFade>
            {explorer && <ConfigExplorer files={explorer} lang={lang} />}
            <div className="prose-docs">
              <Mdx source={doc.body} lang={lang} plugin={entry.id} />
            </div>
          </ArticleFade>

          <ReadMarker plugin={entry.id} id={doc.id} />
          <Pager previous={previous} next={next} lang={lang} />

          <p className="mt-10 text-[13px] text-white/30">
            {dict.docs.missing[lang]}{" "}
            <a
              href={SITE.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/45 underline decoration-white/15 underline-offset-4 transition-colors hover:text-white"
            >
              {dict.docs.missingLink[lang]}
            </a>
          </p>
        </article>

        <Toc headings={doc.headings} minutes={minutes} lang={lang} />
      </div>
    </>
  );
}
