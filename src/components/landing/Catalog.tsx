"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  groupByCategory,
  pageCount,
  plugins,
  type Lang,
  type Plugin,
} from "@/content/registry";
import { dict } from "@/content/dictionary";
import { Reveal, TextReveal } from "@/components/motion/Primitives";
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

  /* A search reads better as one flat list of hits; browsing reads better
     grouped, which is the whole point of the categories. */
  const searching = query.trim() !== "";
  const groups = searching ? [] : groupByCategory(matches);

  return (
    <section id="plugins" className="relative py-24 sm:py-32">
      <div className="relative mx-auto max-w-content px-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-white/20" />
            <span className="eyebrow">{l.catalogKicker[lang]}</span>
          </div>
          <h2 className="mt-6 font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-medium leading-[1.05] tracking-tight2 text-white">
            <TextReveal delay={0.05}>{l.catalogTitle[lang]}</TextReveal>
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
                  className="w-full bg-transparent text-[14px] text-white placeholder:text-white/28 focus:outline-none"
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

        {searching ? (
          <Grid plugins={matches} lang={lang} />
        ) : (
          <div className="mt-6 flex flex-col gap-16">
            {groups.map((group) => (
              <section key={group.key}>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b hair pb-4">
                  <h3 className="font-display text-[19px] font-medium tracking-tightish text-white">
                    {group.label[lang]}
                  </h3>
                  <span className="font-mono text-[10.5px] text-white/22">
                    {String(group.plugins.length).padStart(2, "0")}
                  </span>
                  <p className="w-full text-[13.5px] leading-relaxed text-white/35 sm:w-auto sm:flex-1">
                    {dict.categories[group.key]?.[lang]}
                  </p>
                </div>
                <Grid plugins={group.plugins} lang={lang} compact />
              </section>
            ))}
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
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors ${
        active
          ? "border-[rgb(var(--accent))]/40 bg-[rgb(var(--accent))]/10 text-white"
          : "border-white/[0.08] bg-white/[0.015] text-white/45 hover:border-white/20 hover:text-white/80"
      }`}
    >
      {label}
      <span className={`ml-2 font-mono text-[10px] ${active ? "text-accent" : "text-white/25"}`}>
        {count}
      </span>
    </button>
  );
}

function Grid({
  plugins: list,
  lang,
  compact = false,
}: {
  plugins: Plugin[];
  lang: Lang;
  compact?: boolean;
}) {
  return (
    <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${compact ? "mt-6" : "mt-10"}`}>
      {list.map((plugin, i) => (
        <PluginCard key={plugin.id} plugin={plugin} index={i} lang={lang} />
      ))}
    </div>
  );
}

function PluginCard({ plugin, index, lang }: { plugin: Plugin; index: number; lang: Lang }) {
  const ready = plugin.nav.length > 0;
  const pages = pageCount(plugin);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 0.55, delay: Math.min(index, 5) * 0.05, ease: EASE }}
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.012] transition-colors duration-300 ${
        ready ? "hover:border-white/20 hover:bg-white/[0.03]" : "opacity-60"
      }`}
    >
      <div className="relative">
        <PluginBanner
          plugin={plugin}
          rounded="rounded-none"
          className="aspect-[2/1] w-full border-x-0 border-t-0"
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-ink-950/85 to-transparent" />
        <span
          className={`absolute right-3 top-3 rounded-full border bg-ink-950/70 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] backdrop-blur-sm ${
            STATUS_TONE[plugin.status]
          }`}
        >
          {STATUS_LABEL[plugin.status][lang]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h4 className="font-display text-[16px] font-medium tracking-tightish text-white">
          {plugin.name}
        </h4>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/45">
          {plugin.tagline[lang]}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {plugin.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.en}
              className="rounded-full border border-white/[0.07] bg-white/[0.015] px-2.5 py-0.5 font-mono text-[10px] tracking-wide text-white/35"
            >
              {tag[lang]}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="font-mono text-[10.5px] tracking-wide text-white/25">
            v{plugin.version} ·{" "}
            {ready
              ? `${pages} ${dict.landing.docsPages[lang]}`
              : dict.landing.unpublished[lang]}
          </span>

          {(plugin.purchase ?? plugin.download) && (
            <a
              href={plugin.purchase ?? plugin.download}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 shrink-0 rounded-full border border-white/12 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50 transition-colors hover:border-white/35 hover:text-white"
            >
              {(plugin.purchase ? dict.landing.buy : dict.landing.download)[lang]} ↗
            </a>
          )}
        </div>
      </div>

      {/* The card itself is the link to the documentation; the buy button sits
          above it so the two targets never nest. */}
      {ready && (
        <Link
          href={`/${lang}/docs/${plugin.id}`}
          aria-label={plugin.name}
          className="absolute inset-0 z-0"
        />
      )}
    </motion.article>
  );
}
