"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReducedMotion, useScroll } from "framer-motion";
import {
  ChapterHead, Count, Lines, Rise, Room, Stage, ThemeToggle, display, live, mono, pad,
  siteAccentCss, SERVICE_ACCENTS, useCenterPick, xsCss,
} from "@exylia-webs/ui/site";
import { dict } from "@/content/dictionary";
import { SITE, documentedPlugins, groupByCategory, pageCount, plugins, LANGS, type Lang, type Plugin } from "@/content/registry";
import { loadIndex, prepare, rank, SearchDialog, useSearchHotkey, type Prepared } from "@/components/Search";
import { PluginBanner } from "@/components/PluginBanner";
import { rememberLang } from "@/lib/lang";
import { COPY } from "./copy";
import { FRAG, SHOTS } from "./shader";

const TOTAL_PAGES = documentedPlugins.reduce((n, p) => n + pageCount(p), 0);
const GROUPS = groupByCategory(plugins);
const LIMIT = 12;
// the hub's legal pages cover this site too
const HUB = "https://hub.exylia.net";
const arrow = (c = "→") => <span aria-hidden="true" className="xs-arrow">{c}</span>;
const stress = (s: string) => s.split("*").map((x, i) => (i % 2 ? <b key={i} className="font-semibold text-[var(--amb)]">{x}</b> : x));

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
  const href = (i: number) => `/${lang}/docs/${hits[i].plugin}/${hits[i].slug}`;

  return (
    <div className="relative mt-10 max-w-[34rem]">
      <label className="xs-panel flex items-center gap-3 !rounded-full py-1.5 pl-5 pr-4">
        <svg className="h-4 w-4 shrink-0 text-[var(--ink3)]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7.2" cy="7.2" r="4.4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10.6 10.6L13.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { setFocus(true); load(); }}
          onPointerEnter={load}
          onBlur={() => setTimeout(() => setFocus(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, hits.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
            else if (e.key === "Enter") { e.preventDefault(); if (hits[cursor]) router.push(href(cursor)); }
            else if (e.key === "Escape") setQuery("");
          }}
          placeholder={l.searchExamples[lang][0]}
          aria-label={l.searchLabel[lang].replace("{n}", String(TOTAL_PAGES))}
          className="h-11 min-w-0 flex-1 bg-transparent text-[16px] text-[var(--ink)] outline-none placeholder:text-[var(--ink3)]"
        />
        <span className={`${mono} hidden shrink-0 text-[11px] uppercase tracking-[.12em] text-[var(--ink3)] sm:block`}>
          {TOTAL_PAGES} {s.pages[lang]}
        </span>
      </label>
      {open && (
        <div className="xs-panel absolute inset-x-0 top-full z-30 mt-2 max-h-[46vh] overflow-y-auto !rounded-[18px] p-1.5">
          {!prepared && <p className="px-3 py-5 text-center text-[14px] text-[var(--ink3)]">{s.loading[lang]}</p>}
          {prepared && hits.length === 0 && (
            <p className="px-3 py-5 text-center text-[14px] text-[var(--ink3)]">{s.noResults[lang]} <span className="text-[var(--ink)]">{query}</span></p>
          )}
          {hits.map((hit, i) => (
            <Link key={`${hit.plugin}/${hit.slug}`} href={href(i)} onMouseEnter={() => setCursor(i)}
              className={`xs-row block px-3 py-2.5 ${i === cursor ? "bg-[var(--glass)]" : ""}`}>
              <span className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-[15px] font-medium">{hit.title}</span>
                <span className="text-[12.5px] text-[var(--ink3)]">{hit.pluginName} · {hit.group}</span>
              </span>
              {hit.description && <span className="mt-0.5 line-clamp-1 block text-[13.5px] text-[var(--ink2)]">{hit.description}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function LangSwitch({ lang }: { lang: Lang }) {
  const router = useRouter();
  return (
    <div className={`${mono} flex rounded-full border border-[var(--line)] p-0.5 text-[11.5px] uppercase tracking-[.12em]`} role="group" aria-label="Language">
      {LANGS.map((l) => (
        <button key={l} type="button" aria-pressed={l === lang} lang={l}
          onClick={() => { if (l === lang) return; rememberLang(l); router.push(`/${l}/${location.hash}`); }}
          className={`rounded-full px-2.5 py-1.5 transition-colors ${l === lang ? "bg-[var(--glass)] text-[var(--ink)]" : "text-[var(--ink3)] hover:text-[var(--ink)]"}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

function Wordmark() {
  return (
    <span className="flex items-baseline gap-2.5">
      <span className={`${display} text-[20px] font-[750] tracking-[-.04em]`}>Exylia</span>
      <span className={`${mono} text-[10.5px] uppercase tracking-[.2em] text-[var(--amb)]`}>Docs</span>
    </span>
  );
}

export function DocsLanding({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const l = dict.landing;
  const f = dict.footer;
  const prefers = !!useReducedMotion();
  const [reduced, setReduced] = useState(false);
  // starts false so the server and the first client render match
  useEffect(() => setReduced(prefers), [prefers]);

  const [room, setRoom] = useState(0);
  const [hb, setHb] = useState(-1);
  const [hs, setHs] = useState(-1);
  useEffect(() => { live.hb = hb; }, [hb]);
  useEffect(() => { live.hs = hs; }, [hs]);
  useEffect(() => () => { live.hb = -1; live.hs = -1; }, []);

  const [search, setSearch] = useState(false);
  useSearchHotkey(useCallback(() => setSearch(true), []));

  // catalogue: filter + category chips; each card lights its category's book on the row
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [all, setAll] = useState(false);
  const index = useMemo(
    () => plugins.map((p) => ({ p, text: [p.name, p.tagline[lang], p.summary[lang], p.category[lang], ...p.tags.map((t) => t[lang])].join(" ").toLowerCase() })),
    [lang],
  );
  const catOf = useMemo(() => new Map(GROUPS.map((g, i) => [g.key, i])), []);
  const q = query.trim().toLowerCase();
  const shown = index.filter((x) => (!cat || x.p.category.en === cat) && (!q || x.text.includes(q))).map((x) => x.p);
  const visible = all || q || cat ? shown : shown.slice(0, LIMIT);
  useCenterPick("[data-card]", setHs, `${reduced}${q}${cat}${all}`);
  useCenterPick("[data-feat]", setHb, reduced);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-room],[data-nav]"));
    const io = new IntersectionObserver(
      (e) => e.forEach((x) => x.isIntersecting && setRoom(Number((x.target as HTMLElement).dataset.room ?? (x.target as HTMLElement).dataset.nav))),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((x) => io.observe(x));
    return () => io.disconnect();
  }, [reduced]);

  const bar = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  useEffect(() => scrollYProgress.on("change", (v) => { if (bar.current) bar.current.style.transform = `scaleX(${v})`; }), [scrollYProgress]);

  const hover = (set: (i: number) => void, i: number) => ({
    "data-i": i,
    onPointerEnter: (e: React.PointerEvent) => { if (e.pointerType !== "touch") set(i); },
    onPointerLeave: () => set(-1),
    onFocus: () => set(i),
    onBlur: () => set(-1),
  });

  const card = (p: Plugin) => {
    const i = catOf.get(p.category.en) ?? -1;
    const documented = p.nav.length > 0;
    const body = (
      <>
        <PluginBanner plugin={p} className="aspect-[2/1] w-full" rounded="rounded-[12px]" />
        <span className="mt-4 flex items-baseline justify-between gap-3">
          <span className="min-w-0 truncate text-[16px] font-semibold"><span className="xs-ul">{p.name}</span></span>
          <span className={`${mono} shrink-0 text-[10.5px] uppercase tracking-[.12em] text-[var(--ink3)]`}>
            {documented ? `${pageCount(p)} ${c.pages}` : l.statusSoon[lang]}
          </span>
        </span>
        <span className="mt-1 block truncate text-[14px] text-[var(--ink2)]">{p.tagline[lang]}</span>
      </>
    );
    const cls = "xs-card flex h-full flex-col p-3 pb-4";
    return documented
      ? <Link href={`/${lang}/docs/${p.id}/`} data-card data-on={hs === i ? "1" : undefined} {...hover(setHs, i)} className={cls}>{body}</Link>
      : <a href={p.purchase ?? p.download ?? SITE.store} target="_blank" rel="noopener noreferrer" data-card {...hover(setHs, i)} className={`${cls} opacity-70`}>{body}</a>;
  };

  const figures = [
    [plugins.length, l.statPlugins[lang]],
    [TOTAL_PAGES, l.statPages[lang]],
    [LANGS.length, l.statLangs[lang]],
    [GROUPS.length, c.tools.categories],
  ] as const;
  const [t1, t2] = l.heroTitle[lang].replace("{n}", String(plugins.length)).split("\n");

  return (
    <div className="xs relative min-h-screen overflow-x-clip bg-[var(--bg)] text-[var(--ink)] [font-family:var(--xs-sans)]">
      <style>{xsCss + siteAccentCss(SERVICE_ACCENTS.docs)}</style>
      <a href="#room-1" className="xs-btn solid fixed left-4 top-3 z-[60] -translate-y-24 focus-visible:translate-y-0">{c.skip}</a>
      <div className="fixed inset-0 z-0"><Stage frag={FRAG} spots={10} reduced={reduced} shots={SHOTS} poster="/scene/landing" /></div>
      <div aria-hidden="true" className="xs-grainbox pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        <div className="xs-grain absolute -inset-[20%] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%22.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')]" />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 bg-[var(--hdr)] backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-3 px-4 sm:px-8">
          <Link href={`/${lang}/`} className="xs-link shrink-0"><Wordmark /></Link>
          <nav aria-label={c.chapters[0]} className="mx-auto hidden items-center gap-1 xl:flex">
            {c.chapters.map((ch, i) => (
              <a key={ch} href={`#room-${i + 1}`} aria-current={room === i ? "true" : undefined}
                className={`${mono} rounded-full px-3 py-2 text-[11.5px] uppercase tracking-[.14em] transition-colors ${room === i ? "text-[var(--ink)]" : "text-[var(--ink3)] hover:text-[var(--ink)]"}`}>
                <span className="tabular-nums text-[var(--amb)]">{pad(i + 1)}</span> {ch}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
            <button type="button" onClick={() => setSearch(true)} aria-label={c.searchHint}
              className={`${mono} xs-chip flex items-center gap-2 border border-[var(--line)] bg-[var(--glass)] px-3 py-1.5 text-[11.5px] uppercase tracking-[.12em]`}>
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7.2" cy="7.2" r="4.4" stroke="currentColor" strokeWidth="1.6" />
                <path d="M10.6 10.6L13.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="max-sm:hidden">{c.searchHint}</span><span className="text-[var(--ink3)] max-sm:hidden">⌘K</span>
            </button>
            <LangSwitch lang={lang} />
            <ThemeToggle es={lang === "es"} />
          </div>
        </div>
        <div className="h-px bg-[var(--line)]"><div ref={bar} className="h-px origin-left scale-x-0 bg-[var(--amb)]" /></div>
      </header>
      <SearchDialog lang={lang} open={search} onClose={() => setSearch(false)} />

      <main key={reduced ? "still" : "moving"}>
        <Room id="room-1" index={0} reduced={reduced} className="flex min-h-[100svh] items-center">
          <div className="mx-auto w-full max-w-[90rem] px-4 pb-20 pt-28 sm:px-8 lg:px-16">
            <div className="relative isolate max-w-[44rem]">
              <div aria-hidden="true" className="absolute -inset-x-10 -inset-y-12 -z-10 bg-[radial-gradient(closest-side,var(--scrim),var(--scrim2)_55%,transparent)] sm:-inset-x-20" />
              <p className={`${mono} text-[12px] font-medium uppercase tracking-[.2em]`}><span className="text-[var(--amb)]">01</span> · {l.kicker[lang]}</p>
              <Lines as="h1" onLoad reduced={reduced} delay={0.05} lines={[t1, t2]}
                className={`${display} mt-7 text-[clamp(2.8rem,6.6vw,6rem)] font-[680] leading-[.92] tracking-[-.05em]`} />
              <p style={{ animationDelay: ".45s" }} className="xs-up mt-7 max-w-[34rem] text-[17px] leading-[1.6] text-[var(--ink2)] sm:text-[19px]">
                {l.lead[lang]}
              </p>
              <HeroSearch lang={lang} />
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#room-2" className="xs-btn solid">{l.ctaPrimary[lang]}{arrow("↓")}</a>
                <a href={SITE.store} target="_blank" rel="noopener noreferrer" className="xs-btn ghost">{l.ctaSecondary[lang]}{arrow("↗")}</a>
              </div>
            </div>
          </div>
        </Room>

        <Room id="room-2" index={1} reduced={reduced} className="py-28 sm:py-40">
          <div className="mx-auto max-w-[90rem] px-4 sm:px-8 lg:px-16">
            <div className="lg:ml-auto lg:max-w-[52rem]">
              <ChapterHead n={2} label={c.chapters[1]} lines={c.plugins.lines} lead={c.plugins.lead} reduced={reduced} />
              <Rise reduced={reduced} className="mt-10">
                <label className="xs-panel flex items-center gap-3 !rounded-full py-1 pl-5 pr-2">
                  <span className="sr-only">{l.filterPlaceholder[lang]}</span>
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={l.filterPlaceholder[lang]}
                    className="h-10 min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-[var(--ink3)]" />
                </label>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[{ key: null as string | null, label: l.filterAll[lang], n: plugins.length }, ...GROUPS.map((g) => ({ key: g.key as string | null, label: g.label[lang], n: g.plugins.length }))].map((g) => (
                    <button key={g.label} type="button" aria-pressed={cat === g.key} onClick={() => setCat(g.key)}
                      className={`xs-chip border px-3 py-1.5 text-[13px] ${cat === g.key ? "border-[var(--amb)] text-[var(--ink)]" : "border-[var(--line)] bg-[var(--glass)] text-[var(--ink2)]"}`}>
                      {g.label} <span className={`${mono} text-[11px] text-[var(--ink3)]`}>{g.n}</span>
                    </button>
                  ))}
                </div>
              </Rise>
              {visible.length ? (
                <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {visible.map((p) => <li key={p.id} className="min-w-0">{card(p)}</li>)}
                </ul>
              ) : (
                <p className="mt-8 text-[15px] text-[var(--ink2)]">
                  {l.filterEmpty[lang]} · <button type="button" className="xs-link underline" onClick={() => { setQuery(""); setCat(null); }}>{l.filterClear[lang]}</button>
                </p>
              )}
              {!q && !cat && shown.length > LIMIT && (
                <div className="mt-8">
                  <button type="button" onClick={() => setAll((a) => !a)} className="xs-btn ghost">
                    {all ? l.showLess[lang] : l.showAll[lang].replace("{n}", String(shown.length))}{arrow(all ? "↑" : "↓")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </Room>

        <Room id="room-3" index={2} reduced={reduced} className="py-28 sm:py-40">
          <div className="mx-auto max-w-[90rem] px-4 sm:px-8 lg:px-16">
            <div className="lg:max-w-[44rem]">
              <ChapterHead n={3} label={c.chapters[2]} lines={c.structure.lines} lead={c.structure.lead} reduced={reduced} />
              <ol className="mt-12 space-y-3">
                {l.structureSteps.map((s, i) => (
                  <Rise key={s.title.en} reduced={reduced} delay={i * 0.06}>
                    <li className="xs-well flex gap-5 px-5 py-5">
                      <span className={`${display} text-[34px] font-[700] leading-none tracking-[-.05em] text-[var(--amb)]`}>{i + 1}</span>
                      <span>
                        <span className="block text-[17px] font-semibold">{s.title[lang]}</span>
                        <span className="mt-1.5 block text-[14.5px] leading-[1.55] text-[var(--ink2)]">{s.body[lang]}</span>
                      </span>
                    </li>
                  </Rise>
                ))}
              </ol>
            </div>
          </div>
        </Room>

        <Room id="room-4" index={3} reduced={reduced} className="py-28 sm:py-40">
          <div className="mx-auto max-w-[90rem] px-4 sm:px-8 lg:px-16">
            <div className="lg:ml-auto lg:max-w-[48rem]">
              <ChapterHead n={4} label={c.chapters[3]} lines={c.tools.lines} lead={c.tools.lead} reduced={reduced} />
              <Rise reduced={reduced} className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {figures.map(([v, k]) => (
                  <div key={k} className="xs-well px-4 py-4">
                    <p className={`${display} text-[30px] font-[680] leading-none tracking-[-.04em]`}><Count to={v} reduced={reduced} locale={lang} /></p>
                    <p className={`${mono} mt-2 text-[10.5px] uppercase tracking-[.14em] text-[var(--ink3)]`}>{k}</p>
                  </div>
                ))}
              </Rise>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {c.tools.items.map(([title, body], i) => (
                  <Rise key={title} reduced={reduced} delay={(i % 2) * 0.06}>
                    <div data-feat data-on={hb === i ? "1" : undefined} {...hover(setHb, i)} tabIndex={-1}
                      className="xs-well xs-tile flex h-full gap-4 px-5 py-5">
                      <span className={`${mono} xs-num pt-0.5 text-[12px] tabular-nums text-[var(--ink3)]`}>{pad(i + 1)}</span>
                      <span>
                        <span className="block text-[16.5px] font-semibold">{title}</span>
                        <span className="mt-1.5 block text-[14.5px] leading-[1.55] text-[var(--ink2)]">{body}</span>
                      </span>
                    </div>
                  </Rise>
                ))}
              </div>
            </div>
          </div>
        </Room>

        <Room id="room-5" index={4} reduced={reduced} className="py-28 sm:py-40">
          <div className="mx-auto max-w-[90rem] px-4 sm:px-8 lg:px-16">
            <div className="lg:max-w-[46rem]">
              <ChapterHead n={5} label={c.chapters[4]} lines={c.start.lines} lead={c.start.lead} reduced={reduced} />
              <Rise reduced={reduced} className="mt-12">
                <ul className="space-y-1">
                  {[
                    { href: "#room-2", label: c.start.browse[0], hint: c.start.browse[1], ext: false },
                    { href: SITE.discord, label: f.support[lang], hint: f.supportHint[lang], ext: true },
                    { href: SITE.store, label: f.store[lang], hint: f.storeHint[lang], ext: true },
                    { href: SITE.modrinth, label: "Modrinth", hint: f.modrinthHint[lang], ext: true },
                  ].map((x) => (
                    <li key={x.href}>
                      <a href={x.href} {...(x.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="xs-row flex items-center justify-between gap-4 px-2 py-3">
                        <span className="min-w-0">
                          <span className="block font-semibold"><span className="xs-ul">{x.label}</span></span>
                          <span className="block text-[13.5px] text-[var(--ink3)]">{x.hint}</span>
                        </span>
                        {arrow(x.ext ? "↗" : "↑")}
                      </a>
                    </li>
                  ))}
                  <li>
                    <button type="button" onClick={() => setSearch(true)} className="xs-row flex w-full items-center justify-between gap-4 px-2 py-3 text-left">
                      <span className="min-w-0">
                        <span className="block font-semibold"><span className="xs-ul">{c.start.search[0]}</span></span>
                        <span className="block text-[13.5px] text-[var(--ink3)]">{c.start.search[1]}</span>
                      </span>
                      {arrow()}
                    </button>
                  </li>
                </ul>
              </Rise>
              <Rise reduced={reduced} delay={0.15} className="mt-10 flex flex-wrap gap-3">
                <a href="#room-2" className="xs-btn solid">{l.ctaPrimary[lang]}{arrow("↑")}</a>
                <a href={SITE.store} target="_blank" rel="noopener noreferrer" className="xs-btn ghost">{l.ctaSecondary[lang]}{arrow("↗")}</a>
              </Rise>
            </div>
          </div>
        </Room>
      </main>

      <footer data-nav="4" className="xs-foot relative z-10">
        <div className="mx-auto grid max-w-[90rem] gap-8 px-4 py-12 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-8 lg:px-16">
          <div>
            <Wordmark />
            <p className="mt-3 max-w-[24rem] text-[14px] leading-[1.6] text-[var(--ink2)]">{f.blurb[lang]}</p>
          </div>
          <nav aria-label={f.services[lang]} className="text-[14px]">
            <p className={`${mono} text-[11px] uppercase tracking-[.16em] text-[var(--ink3)]`}>{f.services[lang]}</p>
            <ul className="mt-3 space-y-2">
              <li><a href={SITE.discord} className="xs-pl">{f.support[lang]}</a></li>
              <li><a href={SITE.store} className="xs-pl">BuiltByBit</a></li>
              <li><a href={SITE.modrinth} className="xs-pl">Modrinth</a></li>
              <li><a href={SITE.hub} className="xs-pl">{f.allServices[lang]}</a></li>
            </ul>
          </nav>
          <nav aria-label={f.legal[lang]} className="text-[14px]">
            <p className={`${mono} text-[11px] uppercase tracking-[.16em] text-[var(--ink3)]`}>{f.legal[lang]}</p>
            <ul className="mt-3 space-y-2">
              <li><a href={`${HUB}/${lang}/legal`} className="xs-pl">{f.legal[lang]}</a></li>
              <li><a href={`${HUB}/${lang}/legal/privacy`} className="xs-pl">{f.privacy[lang]}</a></li>
              <li><a href="/llms.txt" className="xs-pl">llms.txt</a></li>
            </ul>
          </nav>
        </div>
        <div className={`${mono} mx-auto flex max-w-[90rem] flex-wrap justify-between gap-2 border-t border-[var(--line)] px-4 py-5 text-[11px] uppercase tracking-[.12em] text-[var(--ink3)] sm:px-8 lg:px-16`}>
          <span suppressHydrationWarning>© {new Date().getFullYear()} Exylia</span>
          <span>{f.madeWith[lang]}</span>
        </div>
      </footer>
    </div>
  );
}
