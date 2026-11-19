import { SiteFooter } from "@exylia-webs/ui/site";
import { SITE, type Lang } from "@/content/registry";
import { dict } from "@/content/dictionary";
import { Logo } from "./Logo";

// The hub's privacy policy covers this site too: it collects nothing beyond it.
const HUB_LEGAL = "https://hub.exylia.net";

export function Footer({ lang, tinted = false }: { lang: Lang; tinted?: boolean }) {
  const f = dict.footer;
  return (
    <SiteFooter
      logo={<Logo className="h-7" />}
      blurb={f.blurb[lang]}
      links={[
        { href: SITE.discord, label: f.support[lang], hint: f.supportHint[lang] },
        { href: SITE.store, label: f.store[lang], hint: f.storeHint[lang] },
        { href: SITE.modrinth, label: "Modrinth", hint: f.modrinthHint[lang] },
        { href: SITE.hub, label: "Exylia Hub", hint: f.hubHint[lang] },
      ]}
      labels={{ services: f.services[lang], allServices: f.allServices[lang], legal: f.legal[lang], privacy: f.privacy[lang], madeWith: f.madeWith[lang] }}
      legalHref={`${HUB_LEGAL}/${lang}/legal`}
      privacyHref={`${HUB_LEGAL}/${lang}/legal/privacy`}
      allServicesHref={SITE.hub}
      width="max-w-docs"
      tinted={tinted}
    />
  );
}
