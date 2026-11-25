"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { LanguageSelect, ThemeToggle } from "@exylia-webs/ui";
import { LandingBrand, SiteHeader } from "@exylia-webs/ui/site";
import { SearchDialog, useSearchHotkey } from "./Search";
import { LANGS, SITE, translateSlug, type Lang } from "@/content/registry";
import { dict } from "@/content/dictionary";
import { rememberLang } from "@/lib/lang";

/**
 * Switches language without losing the page: on a doc page the slug is translated through the
 * registry, so the reader lands on the same page in the other language instead of the index.
 */
function useSwitchLang(lang: Lang) {
  const router = useRouter();
  return (next: string) => {
    if (next === lang || !LANGS.includes(next as Lang)) return;
    rememberLang(next as Lang);
    const parts = window.location.pathname.split("/").filter(Boolean);
    // [lang, "docs", plugin, slug?]
    if (parts[1] === "docs" && parts[2]) {
      const slug = parts[3];
      const translated = slug ? translateSlug(parts[2], slug, lang, next as Lang) : null;
      router.push(`/${next}/docs/${parts[2]}${translated ? `/${translated}` : ""}`);
      return;
    }
    router.push(`/${next}${window.location.hash}`);
  };
}

export function Nav({ lang }: { lang: Lang }) {
  const links = [
    { label: dict.nav.plugins[lang], href: `/${lang}#plugins` },
    { label: dict.nav.ecosystem[lang], href: `/${lang}#estructura` },
  ];
  const [search, setSearch] = useState(false);
  const switchLang = useSwitchLang(lang);
  useSearchHotkey(useCallback(() => setSearch(true), []));

  const searchButton = (
    <button
      type="button"
      onClick={() => setSearch(true)}
      className="focus-ring flex h-9 w-full items-center gap-2.5 rounded-lg border border-line bg-paper px-3 text-ui-sm text-ink-3 transition-colors hover:border-line-2 hover:text-ink"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="7.2" cy="7.2" r="4.4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10.6 10.6L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span>{dict.nav.search[lang]}</span>
      <kbd className="ml-auto hidden rounded border border-line px-1.5 py-0.5 font-mono text-ui-xs text-ink-3 sm:block">⌘K</kbd>
    </button>
  );
  const linkCls = "rounded-lg px-2 py-1.5 text-ui-sm text-ink-3 transition-colors hover:text-ink";

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50">
        <p className="border-b border-line bg-canvas px-6 py-1.5 text-center text-ui-sm text-ink-3">{dict.nav.aiNotice[lang]}</p>
        <SiteHeader
          className="relative"
          menuLabel={dict.nav.menu[lang]}
          brand={<LandingBrand name="Exylia Docs" href={`/${lang}`} />}
          search={searchButton}
          nav={
            <>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              ))}
              <a href={SITE.discord} target="_blank" rel="noopener noreferrer" className={linkCls}>
                Discord
              </a>
              <LanguageSelect locales={LANGS} locale={lang} onChange={switchLang} />
            </>
          }
          controls={<ThemeToggle />}
          menu={
            <>
              {searchButton}
              {links.map((l) => (
                <Link key={l.href} href={l.href} className={`${linkCls} py-3`}>
                  {l.label}
                </Link>
              ))}
              <a href={SITE.discord} target="_blank" rel="noopener noreferrer" className={`${linkCls} py-3`}>
                Discord ↗
              </a>
              <LanguageSelect locales={LANGS} locale={lang} onChange={switchLang} />
            </>
          }
        />
      </div>

      <SearchDialog lang={lang} open={search} onClose={() => setSearch(false)} />
    </>
  );
}
