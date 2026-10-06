"use client";

import { m, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Logo } from "./Logo";
import { SearchDialog, useSearchHotkey } from "./Search";
import { SITE, type Lang } from "@/content/registry";
import { dict } from "@/content/dictionary";
import { LangToggle } from "./LangToggle";

export function Nav({ lang }: { lang: Lang }) {
  const links = [
    { label: dict.nav.plugins[lang], href: `/${lang}#plugins` },
    { label: dict.nav.ecosystem[lang], href: `/${lang}#ecosistema` },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 16));
  useSearchHotkey(useCallback(() => setSearch(true), []));

  return (
    <>
      <m.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled ? "glass-nav border-b border-white/[0.06]" : "border-b border-transparent"
        }`}
      >
        <div className="border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl">
          <p className="mx-auto flex max-w-docs items-center justify-center gap-2 px-6 py-1.5 text-center font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/40">
            <svg className="h-3 w-3 shrink-0 text-white/30" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2.2l1.3 3.4L12.7 7l-3.4 1.4L8 11.8 6.7 8.4 3.3 7l3.4-1.4L8 2.2z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path d="M12.4 11.2l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5.5-1.3z" fill="currentColor" />
            </svg>
            {dict.nav.aiNotice[lang]}
          </p>
        </div>

        <nav className="mx-auto flex max-w-docs items-center justify-between gap-6 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href={`/${lang}`} className="group shrink-0">
              <Logo className="h-7" />
            </Link>
            <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/30 sm:block">
              {dict.nav.docsSuffix[lang]}
            </span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((l) => {
              const active = l.href.startsWith("/docs") && pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`group relative py-1 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors hover:text-white ${
                    active ? "text-white" : "text-white/45"
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-[rgb(var(--accent))] transition-all duration-300 ease-out group-hover:w-full ${
                      active ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearch(true)}
              className="group flex h-9 items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] pl-3 pr-2 text-white/40 transition-colors hover:border-white/25 hover:text-white/80"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                <circle cx="7.2" cy="7.2" r="4.4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.6 10.6L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="hidden text-[13px] sm:block">{dict.nav.search[lang]}</span>
              <kbd className="hidden rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/30 sm:block">
                ⌘K
              </kbd>
            </button>

            <LangToggle lang={lang} />

            <a
              href={SITE.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-9 items-center rounded-full border border-white/15 px-4 text-[13px] font-medium text-white/85 transition-colors hover:border-white/35 hover:text-white lg:inline-flex"
            >
              Discord
            </a>

            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={dict.nav.menu[lang]}
              className="flex h-9 w-9 items-center justify-center md:hidden"
            >
              <div className="flex flex-col gap-1.5">
                <span className={`h-px w-5 bg-white transition-all ${open ? "translate-y-[7px] rotate-45" : ""}`} />
                <span className={`h-px w-5 bg-white transition-all ${open ? "opacity-0" : ""}`} />
                <span className={`h-px w-5 bg-white transition-all ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
              </div>
            </button>
          </div>
        </nav>

        {open && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="glass-nav overflow-hidden border-t border-white/[0.06] md:hidden"
          >
            <div className="px-6 py-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-mono text-[13px] uppercase tracking-[0.12em] text-white/60 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
              <a
                href={SITE.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-3 font-mono text-[13px] uppercase tracking-[0.12em] text-white/60 hover:text-white"
              >
                Discord ↗
              </a>
            </div>
          </m.div>
        )}
      </m.header>

      <SearchDialog lang={lang} open={search} onClose={() => setSearch(false)} />
    </>
  );
}
