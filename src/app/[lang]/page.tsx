import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { DotField } from "@/components/fx/DotField";
import { Hero } from "@/components/landing/Hero";
import { Catalog } from "@/components/landing/Catalog";
import { HowToRead } from "@/components/landing/HowToRead";
import { LANGS, toLang } from "@/content/registry";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function LandingPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = toLang((await params).lang);

  return (
    <>
      <div aria-hidden className="tint-wash" />
      <DotField />
      <Nav lang={lang} />
      <div className="relative z-[1]">
        <main>
          <Hero lang={lang} />
          <Catalog lang={lang} />
          <HowToRead lang={lang} />
        </main>
        <Footer lang={lang} />
      </div>
    </>
  );
}
