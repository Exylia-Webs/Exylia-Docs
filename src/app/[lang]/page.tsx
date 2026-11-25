import { XsThemeBridge } from "@/components/landing/site/XsThemeBridge";
import { DocsLanding } from "@/components/landing/site/landing";
import { xsFonts } from "@exylia-webs/ui/site";
import { LANGS, toLang } from "@/content/registry";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function LandingPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = toLang((await params).lang);
  return (
    <div className={xsFonts} suppressHydrationWarning>
      <XsThemeBridge />
      <DocsLanding lang={lang} />
    </div>
  );
}
