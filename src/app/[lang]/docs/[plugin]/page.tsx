import type { Metadata } from "next";
import { ogImageFor } from "@/lib/og";
import { notFound } from "next/navigation";
import { MobileNav } from "@/components/docs/Sidebar";
import { PluginOverview } from "@/components/docs/PluginOverview";
import { getFlatNav, getNav } from "@/lib/docs";
import { documentedPlugins, LANGS, getPlugin, toLang } from "@/content/registry";
import { dict } from "@/content/dictionary";

type Params = Promise<{ lang: string; plugin: string }>;

export function generateStaticParams() {
  return LANGS.flatMap((lang) => documentedPlugins.map((plugin) => ({ lang, plugin: plugin.id })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolved = await params;
  const lang = toLang(resolved.lang);
  const entry = getPlugin(resolved.plugin);
  if (!entry) return {};
  return {
    title: entry.name,
    description: entry.summary[lang],
    alternates: {
      canonical: `/${lang}/docs/${entry.id}`,
      languages: Object.fromEntries(LANGS.map((code) => [code, `/${code}/docs/${entry.id}`])),
    },
    openGraph: { ...ogImageFor(lang, entry.id).openGraph, title: entry.name, description: entry.summary[lang] },
    twitter: ogImageFor(lang, entry.id).twitter,
  };
}

export default async function PluginIndexPage({ params }: { params: Params }) {
  const resolved = await params;
  const lang = toLang(resolved.lang);
  const entry = getPlugin(resolved.plugin);
  if (!entry) notFound();

  const sections = getNav(resolved.plugin, lang);
  const first = getFlatNav(resolved.plugin, lang)[0];

  return (
    <>
      <MobileNav plugin={entry} sections={sections} title={dict.docs.index[lang]} lang={lang} />
      <PluginOverview
        plugin={entry}
        sections={sections}
        lang={lang}
        firstHref={`/${lang}/docs/${entry.id}/${first.slug}`}
      />
    </>
  );
}
