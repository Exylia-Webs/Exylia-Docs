import { ThemeScript } from "@exylia-webs/ui/site";
import { DocsLanding } from "@/components/landing/site/landing";
import { xsFonts } from "@/components/landing/site/fonts";
import { LANGS, toLang } from "@/content/registry";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function LandingPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = toLang((await params).lang);
  return (
    <div className={xsFonts} suppressHydrationWarning>
      <ThemeScript />
      <DocsLanding lang={lang} />
    </div>
  );
}
