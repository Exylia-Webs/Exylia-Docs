import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/docs/Sidebar";
import { AssistantLauncher } from "@/components/assistant/AssistantLauncher";
import { getNav } from "@/lib/docs";
import { TINTS } from "@/content/tints";
import { documentedPlugins, LANGS, getPlugin, toLang } from "@/content/registry";

export function generateStaticParams() {
  return LANGS.flatMap((lang) => documentedPlugins.map((plugin) => ({ lang, plugin: plugin.id })));
}

export default async function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string; plugin: string }>;
}) {
  const resolved = await params;
  const lang = toLang(resolved.lang);
  const entry = getPlugin(resolved.plugin);
  if (!entry || entry.nav.length === 0) notFound();

  return (
    <div style={{ "--accent": TINTS[entry.id] ?? "124 92 255" } as React.CSSProperties}>
      <ScrollProgress />
      <Nav lang={lang} />

      {/* The plugin's own colour, from its banner (scripts/tints.py), behind the top of every page. */}
      <div aria-hidden className="tint-wash is-docs" />

      <div className="relative z-[1] mx-auto flex w-full max-w-docs gap-10 px-6 pt-[132px]">
        <Sidebar plugin={entry} sections={getNav(resolved.plugin, lang)} lang={lang} />
        <main className="min-w-0 flex-1 pb-8">{children}</main>
      </div>

      <div className="relative z-[1]">
        <Footer lang={lang} tinted />
      </div>
      <AssistantLauncher lang={lang} plugin={entry.id} pluginName={entry.name} />
    </div>
  );
}
