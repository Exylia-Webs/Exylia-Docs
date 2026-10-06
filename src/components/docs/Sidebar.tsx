"use client";

import { AnimatePresence, m } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavSection } from "@/lib/docs";
import { groupByCategory, type Lang, type Plugin } from "@/content/registry";
import { dict } from "@/content/dictionary";
import { PluginBanner } from "@/components/PluginBanner";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------------- Plugin switcher ---------------- */

function PluginSwitcher({ current, lang }: { current: Plugin; lang: Lang }) {
  const [open, setOpen] = useState(false);
  const groups = groupByCategory();

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.015] p-2 text-left transition-colors hover:border-white/15 hover:bg-white/[0.03]"
      >
        <PluginBanner plugin={current} rounded="rounded-md" className="h-9 w-[72px] shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-[13.5px] font-medium text-white">
            {current.name}
          </span>
          <span className="block font-mono text-[10px] tracking-wide text-white/30">
            v{current.version}
          </span>
        </span>
        <m.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="mr-1 h-3 w-3 shrink-0 text-white/30"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path d="M4 6.5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </m.svg>
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[62vh] overflow-y-auto scroll-thin rounded-lg border border-white/10 bg-ink-900/95 p-1.5 backdrop-blur-xl"
          >
            {groups.map((group) => (
              <div key={group.key} className="mb-1 last:mb-0">
                <p className="eyebrow px-2 pb-1.5 pt-2">{group.label[lang]}</p>
                {group.plugins.map((p) => {
                  const ready = p.nav.length > 0;
                  const active = p.id === current.id;
                  const content = (
                    <>
                      <PluginBanner
                        plugin={p}
                        rounded="rounded"
                        className={`h-8 w-[64px] shrink-0 transition-opacity ${ready ? "" : "opacity-40"}`}
                      />
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-[12.5px] ${
                            active ? "text-white" : ready ? "text-white/70" : "text-white/30"
                          }`}
                        >
                          {p.name}
                        </span>
                        <span className="block truncate font-mono text-[9.5px] tracking-wide text-white/25">
                          {ready ? `v${p.version}` : dict.docs.soon[lang]}
                        </span>
                      </span>
                      {active && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]" />}
                    </>
                  );
                  const shell = `flex items-center gap-2.5 rounded-md p-1.5 transition-colors ${
                    active ? "bg-white/[0.05]" : "hover:bg-white/[0.04]"
                  }`;
                  return ready ? (
                    <Link key={p.id} href={`/${lang}/docs/${p.id}`} onClick={() => setOpen(false)} className={shell}>
                      {content}
                    </Link>
                  ) : (
                    <span key={p.id} className={`${shell} cursor-default`}>
                      {content}
                    </span>
                  );
                })}
              </div>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Nav tree ---------------- */

function NavTree({
  sections,
  lang,
  onNavigate,
}: {
  sections: NavSection[];
  lang: Lang;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-8">
      {sections.map((section, si) => (
        <m.div
          key={section.label}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.04 * si, ease: EASE }}
        >
          <p className="eyebrow mb-3 pl-3">{section.label}</p>
          <ul className="flex flex-col border-l hair">
            {section.pages.map((page) => {
              const href = `/${lang}/docs/${page.plugin}/${page.slug}`;
              const active = pathname === href || pathname === `${href}/`;
              return (
                <li key={page.slug} className="relative">
                  {active && (
                    <m.span
                      layoutId="sidebar-active"
                      className="absolute -left-px top-0 h-full w-px bg-[rgb(var(--accent))]"
                      transition={{ duration: 0.32, ease: EASE }}
                    />
                  )}
                  <Link
                    href={href}
                    onClick={onNavigate}
                    className={`group flex items-center justify-between gap-2 py-[7px] pl-3 pr-2 text-[13.5px] transition-colors duration-200 ${
                      active ? "text-white" : "text-white/42 hover:text-white/80"
                    }`}
                  >
                    <span className="truncate">{page.title}</span>
                    {page.badge && (
                      <span className="shrink-0 rounded border border-[rgb(var(--accent))]/25 px-1.5 py-px font-mono text-[9px] uppercase tracking-[0.12em] text-accent">
                        {page.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </m.div>
      ))}
    </nav>
  );
}

/* ---------------- Desktop rail + mobile drawer ---------------- */

export function Sidebar({
  plugin,
  sections,
  lang,
}: {
  plugin: Plugin;
  sections: NavSection[];
  lang: Lang;
}) {
  return (
    <aside className="sticky top-[124px] hidden max-h-[calc(100vh-9.75rem)] w-[248px] shrink-0 overflow-y-auto scroll-thin pb-16 pr-4 lg:block">
      <PluginSwitcher current={plugin} lang={lang} />
      <div className="mt-8">
        <NavTree sections={sections} lang={lang} />
      </div>
    </aside>
  );
}

export function MobileNav({
  plugin,
  sections,
  title,
  lang,
}: {
  plugin: Plugin;
  sections: NavSection[];
  title: string;
  lang: Lang;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="sticky top-[93px] z-40 -mx-6 mb-8 border-b border-white/[0.06] bg-ink-950/85 px-6 py-3 backdrop-blur-xl lg:hidden">
        <button onClick={() => setOpen(true)} className="flex items-center gap-2.5 text-white/60">
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
            <path d="M2.5 4h11M2.5 8h11M2.5 12h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em]">{plugin.name}</span>
          <span className="text-white/20">/</span>
          <span className="truncate text-[13px] text-white/80">{title}</span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            className="fixed inset-0 z-[70] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <m.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute inset-y-0 left-0 w-[86%] max-w-[320px] overflow-y-auto scroll-thin border-r border-white/[0.07] bg-ink-900/95 p-6 pt-8 backdrop-blur-2xl"
            >
              <PluginSwitcher current={plugin} lang={lang} />
              <div className="mt-8">
                <NavTree sections={sections} lang={lang} onNavigate={() => setOpen(false)} />
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
