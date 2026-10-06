import type { Metadata } from "next";
import { ogImageFor } from "@/lib/og";
import { notFound } from "next/navigation";
import { Mdx } from "@/lib/mdx";
import { Toc } from "@/components/docs/Toc";
import { Pager } from "@/components/docs/Pager";
import { MobileNav } from "@/components/docs/Sidebar";
import { ArticleFade, DocHeader } from "@/components/docs/DocHeader";
import { getAllDocParams, getNav, getNeighbours, readDoc } from "@/lib/docs";
import { LANGS, SITE, getPlugin, toLang, translateSlug } from "@/content/registry";
import { dict } from "@/content/dictionary";

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

  return (
    <>
      <MobileNav plugin={entry} sections={sections} title={doc.title} lang={lang} />

      <div className="flex gap-12">
        <article className="min-w-0 max-w-4xl flex-1 pb-4">
          <DocHeader
            group={doc.group || entry.name}
            title={doc.title}
            description={doc.description}
            badge={doc.badge}
          />

          <ArticleFade>
            <div className="prose-docs">
              <Mdx source={doc.body} lang={lang} />
            </div>
          </ArticleFade>

          <Pager previous={previous} next={next} lang={lang} />

          <p className="mt-10 font-mono text-[11px] tracking-wide text-white/25">
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

        <Toc headings={doc.headings} lang={lang} />
      </div>
    </>
  );
}
