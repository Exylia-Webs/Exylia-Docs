import { DocsLanding } from "@/components/landing/DocsLanding";
import { LANGS, toLang } from "@/content/registry";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function LandingPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = toLang((await params).lang);
  return <DocsLanding lang={lang} />;
}
