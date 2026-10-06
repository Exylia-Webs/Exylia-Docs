import type { Metadata } from "next";
import { ogImageFor } from "@/lib/og";
import { notFound } from "next/navigation";
import { DEFAULT_LANG, LANGS, SITE, toLang, type Lang } from "@/content/registry";
import { HtmlLang } from "@/components/HtmlLang";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const lang = toLang((await params).lang);
  const card = ogImageFor(lang);
  return {
    description: SITE.description[lang],
    alternates: {
      canonical: `/${lang}`,
      languages: { ...Object.fromEntries(LANGS.map((code) => [code, `/${code}`])), "x-default": `/${DEFAULT_LANG}` },
    },
    // Replaces the root's openGraph whole (metadata merges shallowly), so it carries everything.
    openGraph: { ...card.openGraph, title: SITE.name, description: SITE.description[lang], locale: lang === "es" ? "es_ES" : "en_US" },
    twitter: card.twitter,
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();

  return (
    <>
      <HtmlLang lang={lang as Lang} />
      {children}
    </>
  );
}
