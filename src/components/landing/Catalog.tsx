"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { morphTo } from "@/lib/banner-morph";
import { groupByCategory, pageCount, plugins, type Lang, type Plugin } from "@/content/registry";
import { dict } from "@/content/dictionary";
import { Stagger, Words } from "@/components/fx/Words";
import { TINTS } from "@/content/tints";
import { PluginBanner } from "@/components/PluginBanner";

/** Everything a filter can match on, built once per language. */
function haystack(plugin: Plugin, lang: Lang): string {
  return [plugin.name, plugin.tagline[lang], plugin.summary[lang], plugin.category[lang], ...plugin.tags.map((tag) => tag[lang])]
    .join(" ")
    .toLowerCase();
}

/** The page wears the colour of the plugin under the cursor (see .tint-wash). */
function tint(id: string | null) {
  const root = document.documentElement;
  if (id && TINTS[id]) {
    root.style.setProperty("--accent", TINTS[id]);
    root.classList.add("tinted");
  } else {
    root.style.removeProperty("--accent");
    root.classList.remove("tinted");
  }
}

export function Catalog({ lang }: { lang: Lang }) {
  const l = dict.landing;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [all, setAll] = useState(false);

  const index = useMemo(() => plugins.map((plugin) => ({ plugin, text: haystack(plugin, lang) })), [lang]);
  const chips = useMemo(() => groupByCategory(), []);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return index
      .filter(({ plugin, text }) => (!category || plugin.category.en === category) && (needle === "" || text.includes(needle)))
      .map(({ plugin }) => plugin);
  }, [index, query, category]);

  useEffect(() => () => tint(null), []);

  /* Browsing everything shows a first screenful; a search or a category shows every match. */
  const narrowed = query.trim() !== "" || category !== null;
  const LIMIT = 12;
  const shown = narrowed || all ? matches : matches.slice(0, LIMIT);

  return (
    <section id="plugins" className="mx-auto max-w-content scroll-mt-24 px-6 pb-24 sm:pb-32">
      <span className="chip-n">
        <b>01</b>
        {l.catalogKicker[lang]}
      </span>
      <div className="mb-10 mt-6 grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
        <Words
          text={l.catalogHeading[lang]}
          className="font-display text-[clamp(2.2rem,4.6vw,3.9rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-white"
          accent="text-[1.08em]"
        />
        <p className="max-w-md text-[15.5px] leading-relaxed text-white/45 md:justify-self-end">{l.catalogLead[lang]}</p>
      </div>
      <div className="flex flex-col gap-4 border-t hair pt-6">
        <label className="flex h-11 flex-1 items-center gap-3 rounded-full border border-white/[0.08] px-4 transition-colors duration-150 focus-within:border-white/30 sm:w-80">
          <svg className="h-3.5 w-3.5 shrink-0 text-white/30" viewBox="0 0 16 16" fill="none" aria-hidden>
            <circle cx="7.2" cy="7.2" r="4.4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.6 10.6L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={l.filterPlaceholder[lang]}
            className="w-full bg-transparent text-base text-white placeholder:text-white/30 focus:outline-none sm:text-[14px]"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label={l.filterClear[lang]} className="shrink-0 text-white/30 hover:text-white">
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </label>
        <div className="-mx-6 flex gap-1.5 overflow-x-auto px-6 pb-1 scroll-thin sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0">
          <Chip active={category === null} onClick={() => setCategory(null)} label={l.filterAll[lang]} count={plugins.length} />
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

      {matches.length === 0 && (
        <p className="mt-16 text-center text-[14.5px] text-white/35">
          {l.filterEmpty[lang]} — <span className="text-white/60">{query}</span>
        </p>
      )}

      <Stagger
        onPointerLeave={() => tint(null)}
        className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 [@media(hover:hover)]:[&:hover>li]:opacity-40 [&>li:hover]:!opacity-100"
      >
        {shown.map((plugin, i) => (
          <li
            key={plugin.id}
            style={{ ["--i" as string]: i % LIMIT }}
            className="min-w-0 transition-opacity duration-200"
          >
            <Card plugin={plugin} lang={lang} priority={i < 3} />
          </li>
        ))}
      </Stagger>

      {!narrowed && matches.length > LIMIT && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setAll(!all)}
            className="h-11 rounded-full border border-white/12 px-5 text-[14px] text-white/75 transition-colors duration-150 hover:border-white/30 hover:text-white"
          >
            {all ? l.showLess[lang] : l.showAll[lang].replace("{n}", String(matches.length))}
          </button>
        </div>
      )}
    </section>
  );
}

/** The banner tilts a few degrees toward the cursor, with a light under it (.lean). */
function lean(e: React.PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget, r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--mx", `${x * 100}%`);
  el.style.setProperty("--my", `${y * 100}%`);
  el.style.setProperty("--rx", `${(0.5 - y) * 7}deg`);
  el.style.setProperty("--ry", `${(x - 0.5) * 9}deg`);
}
function unlean(e: React.PointerEvent<HTMLElement>) {
  e.currentTarget.style.removeProperty("--rx");
  e.currentTarget.style.removeProperty("--ry");
}

function Card({ plugin, lang, priority }: { plugin: Plugin; lang: Lang; priority: boolean }) {
  const l = dict.landing;
  const router = useRouter();
  const ready = plugin.nav.length > 0;
  const href = `/${lang}/docs/${plugin.id}/`;
  const body = (
    <>
      <span data-banner onPointerMove={lean} onPointerLeave={unlean} className="lean relative block overflow-hidden rounded-xl">
        <PluginBanner
          plugin={plugin}
          priority={priority}
          rounded="rounded-xl"
          className="aspect-[2/1] w-full transition-transform duration-200 ease-out group-hover:scale-[1.02]"
        />
      </span>
      <span className="mt-4 flex items-baseline justify-between gap-4">
        <span className="truncate text-[19px] font-medium tracking-[-0.02em] text-white">{plugin.name}</span>
        <span className="shrink-0 text-[12px] tabular-nums text-white/35">
          {ready ? `${pageCount(plugin)} ${l.docsPages[lang]}` : l.statusSoon[lang]}
        </span>
      </span>
      <span className="mt-1 block truncate text-[14px] text-white/45">{plugin.tagline[lang]}</span>
    </>
  );
  const on = { onPointerEnter: () => tint(plugin.id), onFocus: () => tint(plugin.id) };
  return ready ? (
    <Link
      href={href}
      className="group block"
      onClick={(e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        morphTo(e.currentTarget.querySelector<HTMLElement>("[data-banner]")!, () => router.push(href));
      }}
      {...on}
    >
      {body}
    </Link>
  ) : (
    <a href={plugin.purchase ?? plugin.download ?? "#"} target="_blank" rel="noopener noreferrer" className="group block opacity-70" {...on}>
      {body}
    </a>
  );
}

function Chip({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] transition-colors duration-150 ${
        active ? "bg-white text-black" : "text-white/45 hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      {label}
      <span className={`ml-1.5 text-[11px] tabular-nums ${active ? "text-black/45" : "text-white/25"}`}>{count}</span>
    </button>
  );
}
