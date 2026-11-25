import { LandingBrand, LandingFooter } from "@exylia-webs/ui/site";
import { SITE, type Lang } from "@/content/registry";
import { dict } from "@/content/dictionary";

// The hub's privacy policy covers this site too: it collects nothing beyond it.
const HUB_LEGAL = "https://hub.exylia.net";

export function Footer({ lang }: { lang: Lang; tinted?: boolean }) {
  const f = dict.footer;
  return (
    <LandingFooter
      brand={<LandingBrand name="Exylia Docs" href={`/${lang}`} />}
      blurb={f.blurb[lang]}
      links={[
        { href: SITE.discord, label: f.support[lang] },
        { href: SITE.store, label: f.store[lang] },
        { href: SITE.modrinth, label: "Modrinth" },
        { href: SITE.hub, label: "Exylia Hub" },
        { href: `${HUB_LEGAL}/${lang}/legal`, label: f.legal[lang] },
        { href: `${HUB_LEGAL}/${lang}/legal/privacy`, label: f.privacy[lang] },
      ]}
      legal={f.madeWith[lang]}
    />
  );
}
