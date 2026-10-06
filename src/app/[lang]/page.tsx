import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/landing/Hero";
import { Catalog } from "@/components/landing/Catalog";
import { Ecosystem } from "@/components/landing/Ecosystem";
import { CTA } from "@/components/landing/CTA";
import { LANGS, toLang } from "@/content/registry";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function LandingPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = toLang((await params).lang);

  return (
    <>
      <ScrollProgress />
      <Nav lang={lang} />
      <main className="relative">
        <Hero lang={lang} />
        <Catalog lang={lang} />
        <Ecosystem lang={lang} />
        <CTA lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
