"use client";

import Link from "next/link";
import { AnimatePresence, m, useSpring } from "framer-motion";
import { useMemo, useState } from "react";
import {
  groupByCategory,
  pageCount,
  plugins,
  type Lang,
  type Plugin,
} from "@/content/registry";
import { dict } from "@/content/dictionary";
import { Reveal } from "@/components/motion/Primitives";
import { Ink } from "./fx/Ink";
import { PluginBanner } from "@/components/PluginBanner";

const EASE = [0.16, 1, 0.3, 1] as const;

const STATUS_TONE = {
  stable: "text-accent border-[rgb(var(--accent))]/30",
  beta: "text-white/60 border-white/20",
  soon: "text-white/25 border-white/10",
} as const;

const STATUS_LABEL = {
  stable: dict.landing.statusStable,
  beta: dict.landing.statusBeta,
  soon: dict.landing.statusSoon,
} as const;

/** Everything a filter can match on, built once per language. */
function haystack(plugin: Plugin, lang: Lang): string {
  return [
    plugin.name,
    plugin.tagline[lang],
    plugin.summary[lang],
    plugin.category[lang],
    ...plugin.tags.map((tag) => tag[lang]),
  ]
    .join(" ")
    .toLowerCase();
}

export function Catalog({ lang }: { lang: Lang }) {
  const l = dict.landing;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [all, setAll] = useState(false);

  const index = useMemo(
    () => plugins.map((plugin) => ({ plugin, text: haystack(plugin, lang) })),
    [lang],
  );

  /** The chips: every category that exists, in catalogue order, with counts. */
  const chips = useMemo(() => groupByCategory(), []);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return index
      .filter(({ plugin, text }) => {
        if (category && plugin.category.en !== category) return false;
        return needle === "" || text.includes(needle);
      })
      .map(({ plugin }) => plugin);
  }, [index, query, category]);

  /* Browsing everything shows a first screenful; a search or a category
     shows every match, since the reader already narrowed it down. */
  const narrowed = query.trim() !== "" || category !== null;
  const LIMIT = 12;
  const shown = narrowed || all ? matches : matches.slice(0, LIMIT);

  return (
    <section id="plugins" className="relative py-24 sm:py-32">
      <div className="relative mx-auto max-w-content px-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-white/20" />
            <span className="eyebrow">{l.catalogKicker[lang]}</span>
          </div>
          <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1] tracking-[-0.04em] text-white">
            {l.catalogTitleLead[lang]} <Ink word={l.ink.catalog[lang]} className="text-[1.15em]" />
          </h2>
          <Reveal delay={0.12}>
            <p className="mt-5 text-[15.5px] leading-relaxed text-white/45">
              {l.catalogLead[lang]}
            </p>
          </Reveal>
        </div>

        {/* ---------------- Filter bar ---------------- */}
        <Reveal delay={0.16}>
          <div className="mt-12 flex flex-col gap-5 border-t hair pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <label className="group flex h-11 flex-1 items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 transition-colors focus-within:border-white/25">
                <svg className="h-3.5 w-3.5 shrink-0 text-white/30" viewBox="0 0 16 16" fill="none">
                  <circle cx="7.2" cy="7.2" r="4.4" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10.6 10.6L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={l.filterPlaceholder[lang]}
                  className="w-full bg-transparent text-base text-white placeholder:text-white/28 sm:text-[14px] focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label={l.filterClear[lang]}
                    className="shrink-0 text-white/30 transition-colors hover:text-white"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </label>

              <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-white/28">
                {matches.length}{" "}
                {matches.length === 1 ? l.resultsOne[lang] : l.resultsMany[lang]}
              </span>
            </div>

            <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 scroll-thin sm:mx-0 sm:flex-wrap sm:px-0">
              <Chip
                active={category === null}
                onClick={() => setCategory(null)}
                label={l.filterAll[lang]}
                count={plugins.length}
              />
              {chips.map((group) => (
                <Chip
                  key={group.key}
                  active={category === group.key}
                  onClick={() => setCategory(category === group.key ? null : group.key)}
                  label={group.label[lang]}
                  count={group.plugins.length}
                />
              ))}
            </div>
          </div>
        </Reveal>

        {/* ---------------- Results ---------------- */}
        {matches.length === 0 && (
          <p className="mt-16 text-center text-[14.5px] text-white/35">
            {l.filterEmpty[lang]} — <span className="text-white/60">{query}</span>
          </p>
        )}

        {category && (
          <p className="mt-8 text-[14px] text-white/40">{dict.categories[category]?.[lang]}</p>
        )}
        <IndexList plugins={shown} lang={lang} />

        {!narrowed && matches.length > LIMIT && (
          <div className="relative mt-10 flex justify-center">
            {!all && <div className="pointer-events-none absolute inset-x-0 -top-48 h-48 bg-gradient-to-b from-transparent to-ink-950" />}
            <button
              onClick={() => setAll(!all)}
              className="relative inline-flex h-11 items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-5 text-[14px] text-white/75 transition-colors hover:border-white/30 hover:text-white"
            >
              {all ? l.showLess[lang] : l.showAll[lang].replace("{n}", String(matches.length))}
              <svg className={`h-3 w-3 transition-transform duration-500 ${all ? "rotate-180" : ""}`} viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Chip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative isolate shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors ${
        active ? "border-transparent text-white" : "border-white/[0.08] text-white/45 hover:border-white/20 hover:text-white/80"
      }`}
    >
      {active && (
        <m.span
          layoutId="catalog-pill"
          transition={{ type: "spring", stiffness: 420, damping: 36 }}
          className="absolute inset-0 -z-10 rounded-full border border-[#b48fd9]/40 bg-[#8a51c4]/25"
        />
      )}
      {label}
      <span className={`ml-2 font-mono text-[10px] ${active ? "text-[#e7cfff]" : "text-white/25"}`}>
        {count}
      </span>
    </button>
  );
}

/**
 * The catalogue as an editorial index: one large row per plugin. On a mouse,
 * a banner follows the cursor and shows the row under it; on touch each row
 * carries a small thumbnail instead.
 */
function IndexList({ plugins: list, lang }: { plugins: Plugin[]; lang: Lang }) {
  const l = dict.landing;
  const [active, setActive] = useState<Plugin | null>(null);
  const x = useSpring(0, { stiffness: 260, damping: 30, mass: 0.6 });
  const y = useSpring(0, { stiffness: 260, damping: 30, mass: 0.6 });

  return (
    <div
      className="relative mt-8"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <div className="hidden grid-cols-[4rem_9.5rem_1fr_12rem_7rem_6rem] border-b hair pb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/25 md:grid">
        <span>#</span>
        <span className="col-span-2">{l.colPlugin[lang]}</span>
        <span>{l.colCategory[lang]}</span>
        <span>{l.colPages[lang]}</span>
        <span className="text-right">{l.colStatus[lang]}</span>
      </div>

      <ul className="[&:hover>li]:opacity-45 [&>li:hover]:!opacity-100">
        {list.map((plugin, i) => {
          const ready = plugin.nav.length > 0;
          const row = (
            <>
              <span className="hidden font-mono text-[11px] text-white/25 md:block">{String(i + 1).padStart(2, "0")}</span>
              <PluginBanner plugin={plugin} rounded="rounded-md" className="h-9 w-[72px] shrink-0 transition-[transform,box-shadow] duration-500 group-hover:scale-[1.04] group-hover:shadow-[0_18px_40px_-18px_rgba(138,81,196,0.8)] md:h-[68px] md:w-[136px]" />
              <span className="min-w-0">
                <span className="index-name block truncate font-display text-[clamp(1.25rem,2.4vw,2rem)] font-medium leading-tight tracking-[-0.03em] text-white/85 transition-[transform,color] duration-500 [transition-timing-function:cubic-bezier(.16,1,.3,1)]">
                  {plugin.name}
                </span>
                <span className="index-name mt-0.5 block truncate text-[13px] text-white/40 transition-transform delay-[40ms] duration-500 [transition-timing-function:cubic-bezier(.16,1,.3,1)]">
                  {plugin.tagline[lang]}
                </span>
              </span>
              <span className="hidden truncate text-[13px] text-white/45 md:block">{plugin.category[lang]}</span>
              <span className="hidden font-mono text-[12px] tabular-nums text-white/40 md:block">
                {ready ? pageCount(plugin) : "—"}
              </span>
              <span className="flex items-center justify-end gap-3">
                <span className={`hidden rounded-full border px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] sm:inline ${STATUS_TONE[plugin.status]}`}>
                  {STATUS_LABEL[plugin.status][lang]}
                </span>
                {ready && (
                  <svg className="h-4 w-4 -translate-x-2 text-[#b48fd9] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </>
          );
          const cls =
            "index-row group grid grid-cols-[72px_1fr_auto] items-center gap-4 border-b hair py-4 md:grid-cols-[4rem_9.5rem_1fr_12rem_7rem_6rem] md:gap-0 md:py-4";
          return (
            <m.li
              key={plugin.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-4% 0px" }}
              transition={{ duration: 0.6, delay: Math.min(i % 12, 6) * 0.04, ease: EASE }}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(plugin)}
              className="transition-opacity duration-300"
            >
              {ready ? (
                <Link href={`/${lang}/docs/${plugin.id}`} className={cls}>
                  {row}
                </Link>
              ) : (
                <a href={plugin.purchase ?? plugin.download ?? "#"} target="_blank" rel="noopener noreferrer" className={`${cls} opacity-60`}>
                  {row}
                </a>
              )}
            </m.li>
          );
        })}
      </ul>

      {/* The floating preview: fixed to the viewport, eased after the cursor. */}
      <m.div style={{ x, y }} className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block" aria-hidden>
        <div className="absolute left-5 top-5 w-[300px]">
        <AnimatePresence>
          {active && (
            <m.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute inset-x-0 top-0 overflow-hidden rounded-xl border border-white/10 bg-ink-950 shadow-[0_30px_80px_-20px_rgba(138,81,196,0.7)]"
            >
              <PluginBanner plugin={active} rounded="rounded-none" className="aspect-[2/1] w-full border-0" />
              <p className="px-3.5 py-2.5 line-clamp-3 text-[12.5px] leading-snug text-white/55">{active.summary[lang]}</p>
            </m.div>
          )}
        </AnimatePresence>
        </div>
      </m.div>
    </div>
  );
}
