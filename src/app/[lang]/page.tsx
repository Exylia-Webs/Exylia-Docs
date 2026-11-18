import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { DotField } from "@/components/fx/DotField";
import { Hero } from "@/components/landing/Hero";
import { BannerWall } from "@/components/landing/BannerWall";
import { Catalog } from "@/components/landing/Catalog";
import { HowToRead } from "@/components/landing/HowToRead";
import { LANGS, plugins, toLang } from "@/content/registry";

/** Banners actually uploaded, checked once at build: the wall shows key art only, never a monogram. */
const uploaded = Promise.all(
  plugins.map((p) =>
    fetch(p.banner, { method: "HEAD", cache: "force-cache", signal: AbortSignal.timeout(4000) })
      .then((r) => (r.ok ? p.id : null))
      .catch(() => p.id), // offline build: keep it, the tile falls back to its monogram
  ),
).then((ids) => ids.filter((id): id is string => id !== null));

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function LandingPage({ params }: { params: Promise<{ lang: string }> }) {
  const [lang, ids] = [toLang((await params).lang), await uploaded];

  return (
    <>
      <div aria-hidden className="tint-wash" />
      <DotField />
      <Nav lang={lang} />
      <div className="relative z-[1]">
        <main>
          <Hero lang={lang} />
          <BannerWall lang={lang} ids={ids} />
          <Catalog lang={lang} />
          <HowToRead lang={lang} />
        </main>
        <Footer lang={lang} />
      </div>
    </>
  );
}
