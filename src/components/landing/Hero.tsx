"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { loadIndex, prepare, rank, type Prepared } from "@/components/Search";
import { dict } from "@/content/dictionary";
import { Words } from "@/components/fx/Words";
import { CountUp } from "@/components/fx/CountUp";
import { documentedPlugins, groupByCategory, LANGS, pageCount, plugins, type Lang } from "@/content/registry";

export const TOTAL_PAGES = documentedPlugins.reduce((n, plugin) => n + pageCount(plugin), 0);

/** Type and a search; nothing moves until the reader does. */
export function Hero({ lang }: { lang: Lang }) {
  const l = dict.landing;
  return (
    <section className="mx-auto max-w-content px-6 pb-16 pt-36 sm:pb-24 sm:pt-44">
      <Words
        as="h1"
        text={l.heroTitle[lang].replace("{n}", String(plugins.length))}
        className="font-display text-[clamp(2.9rem,9.2vw,8.75rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-white"
        accent="text-[1.08em] text-white/80"
      />
      <div className="mt-10 grid gap-8 sm:mt-14 md:grid-cols-[1fr_minmax(0,34rem)] md:items-end">
        <p className="max-w-md text-[15.5px] leading-relaxed text-white/45">{l.lead[lang]}</p>
        <HeroSearch lang={lang} />
      </div>
      <dl className="hero-stats mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border hair bg-white/[0.06] sm:grid-cols-4">
        {[
          [plugins.length, l.statPlugins],
          [TOTAL_PAGES, l.statPages],
          [groupByCategory().length, l.statCategories],
          [LANGS.length, l.statLangs],
        ].map(([n, label], i) => (
          <div key={i} style={{ ["--i" as string]: i }} className="bg-[#060608]/90 px-5 py-5 backdrop-blur-sm">
            <dd className="font-display text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-none tracking-[-0.04em] text-white">
              <CountUp to={n as number} />
            </dd>
            <dt className="mt-2 text-[13px] text-white/40">{(label as { [k in Lang]: string })[lang]}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** The real search, inline: the index downloads on first focus and results open under the field. */
function HeroSearch({ lang }: { lang: Lang }) {
  const l = dict.landing;
  const s = dict.search;
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [prepared, setPrepared] = useState<Prepared[] | null>(null);
  const deferred = useDeferredValue(query);

  const load = () => {
    if (!prepared) loadIndex(lang).then((e) => setPrepared(prepare(e))).catch(() => {});
  };

  const hits = useMemo(() => (prepared ? rank(prepared, deferred, 6) : []), [prepared, deferred]);
  useEffect(() => setCursor(0), [query]);

  const open = focus && query.trim() !== "";
  const go = (i: number) => {
    const hit = hits[i];
    if (hit) router.push(`/${lang}/docs/${hit.plugin}/${hit.slug}`);
  };

  return (
    <div className="relative">
      <label className="flex h-14 items-center gap-3 rounded-full border border-white/12 bg-white/[0.03] pl-5 pr-2 transition-colors duration-150 hover:border-white/25 focus-within:border-[rgb(var(--accent))]">
        <svg className="h-4 w-4 shrink-0 text-white/40" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="7.2" cy="7.2" r="4.4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10.6 10.6L13.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setFocus(true);
            load();
          }}
          onPointerEnter={load}
          onBlur={() => setTimeout(() => setFocus(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setCursor((c) => Math.min(c + 1, hits.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setCursor((c) => Math.max(c - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              go(cursor);
            } else if (e.key === "Escape") {
              setQuery("");
            }
          }}
          placeholder={l.searchExamples[lang][0]}
          aria-label={l.searchLabel[lang].replace("{n}", String(TOTAL_PAGES))}
          className="h-14 min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-white/30 focus:outline-none sm:text-[15px]"
        />
        <span className="hidden shrink-0 pr-3 text-[12px] tabular-nums text-white/30 sm:block">
          {TOTAL_PAGES} {s.pages[lang]}
        </span>
      </label>

      {open && (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] z-30 max-h-[46vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0b0b0e] p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] scroll-thin">
          {!prepared && <p className="px-3 py-6 text-center text-[13px] text-white/35">{s.loading[lang]}</p>}
          {prepared && hits.length === 0 && (
            <p className="px-3 py-6 text-center text-[13.5px] text-white/40">
              {s.noResults[lang]} <span className="text-white/75">{query}</span>
            </p>
          )}
          {hits.map((hit, i) => (
            <Link
              key={`${hit.plugin}/${hit.slug}`}
              href={`/${lang}/docs/${hit.plugin}/${hit.slug}`}
              onMouseEnter={() => setCursor(i)}
              className={`block rounded-xl px-3 py-2.5 ${i === cursor ? "bg-white/[0.06]" : ""}`}
            >
              <span className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-[14.5px] font-medium text-white">{hit.title}</span>
                <span className="text-[12px] text-white/35">
                  {hit.pluginName} · {hit.group}
                </span>
              </span>
              {hit.description && <span className="mt-0.5 line-clamp-1 block text-[13px] text-white/45">{hit.description}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
