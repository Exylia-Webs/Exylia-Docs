import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/docs/Sidebar";
import { getNav } from "@/lib/docs";
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
    <>
      <ScrollProgress />
      <Nav lang={lang} />

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div
          className="absolute left-1/2 top-[-30%] h-[60vw] w-[60vw] -translate-x-1/2 rounded-full opacity-40 blur-[140px]"
          style={{ background: "radial-gradient(circle, rgba(124,92,255,0.13), transparent 62%)" }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-docs gap-10 px-6 pt-[132px]">
        <Sidebar plugin={entry} sections={getNav(resolved.plugin, lang)} lang={lang} />
        <main className="min-w-0 flex-1 pb-8">{children}</main>
      </div>

      <Footer lang={lang} />
    </>
  );
}
