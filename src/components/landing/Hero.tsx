"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, m, useScroll, useTransform } from "framer-motion";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { AnimatedWords } from "@/components/motion/Primitives";
import { loadIndex, prepare, rank, type Prepared } from "@/components/Search";
import { dict } from "@/content/dictionary";
import { documentedPlugins, pageCount, plugins, type Lang } from "@/content/registry";
import { Ink } from "./fx/Ink";

export const TOTAL_PAGES = documentedPlugins.reduce((n, plugin) => n + pageCount(plugin), 0);

// The scene is heavy and client-only; the CSS poster (.galaxy-poster) stands in until it paints.
const Galaxy = dynamic(() => import("./fx/Galaxy"), { ssr: false });

/**
 * A pinned hero: the galaxy of plugins fills the screen, the search above it
 * lights up the stars that answer, and scrolling flies the camera into the
 * disc before the page moves on.
 */
export function Hero({ lang }: { lang: Lang }) {
  const l = dict.landing;
  const ref = useRef<HTMLElement>(null);
  const [hot, setHot] = useState<Set<string>>(() => new Set());
  // While someone searches, the headline steps back so the lit stars can be read.
  const [exploring, setExploring] = useState(false);
  const dim = `transition-[opacity,filter] duration-700 ${exploring ? "opacity-[0.12] blur-[2px]" : ""}`;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const textOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -90]);
  const textBlur = useTransform(scrollYProgress, [0, 0.3], ["blur(0px)", "blur(8px)"]);
  const flightOpacity = useTransform(scrollYProgress, [0.38, 0.55, 0.82, 0.96], [0, 1, 1, 0]);
  const flightY = useTransform(scrollYProgress, [0.38, 0.96], [60, -60]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative h-[210vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="galaxy-poster absolute inset-0" />
        <Galaxy lang={lang} hot={hot} progress={scrollYProgress} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_38%,rgba(5,4,10,0.55),transparent_70%)]" />
        <div className="noise" />

        <m.div
          style={{ opacity: textOpacity, y: textY, filter: textBlur }}
          className="pointer-events-none relative z-20 mx-auto flex h-full max-w-content flex-col items-center px-6 pt-[16vh] text-center sm:pt-[17vh]"
        >
          <div className={dim}>
          <p className="rise inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-4 text-[12.5px] text-white/60 backdrop-blur-md">
            <span className="rounded-full bg-[#8a51c4]/25 px-2 py-0.5 font-mono text-[10.5px] tracking-[0.12em] text-[#e7cfff]">
              {plugins.length}
            </span>
            {l.kicker[lang]}
          </p>

          <h1 className="mx-auto mt-6 max-w-6xl font-display text-[clamp(2.3rem,5vw,4.5rem)] font-medium leading-[1] tracking-[-0.045em] text-white">
            <span className="block">
              <AnimatedWords text={l.line1[lang]} />
            </span>
            <span className="block text-white/45">
              <AnimatedWords text={l.line2[lang]} /> <Ink word={l.ink.hero[lang]} delay={0.55} className="-ml-[0.1em] text-[1.12em]" />
            </span>
          </h1>

          <p className="rise mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-white/55" style={{ ["--d" as string]: "0.45s" }}>
            {l.lead[lang]}
          </p>
          </div>

          <div className="rise pointer-events-auto mt-8 w-full max-w-xl" style={{ ["--d" as string]: "0.6s" }}>
            <HeroSearch lang={lang} onHot={setHot} onExplore={setExploring} />
          </div>
        </m.div>

        <m.div
          style={{ opacity: flightOpacity, y: flightY }}
          className="pointer-events-none absolute inset-x-0 top-[32%] z-20 mx-auto max-w-3xl px-6 text-center"
        >
          <p className="eyebrow">{l.flightKicker[lang]}</p>
          <p className="mt-5 font-display text-[clamp(2rem,4.6vw,3.8rem)] font-medium leading-[1.02] tracking-[-0.04em] text-white">
            {l.flightTitle[lang]}
          </p>
          <p className="mx-auto mt-5 max-w-md text-[15.5px] leading-relaxed text-white/55">{l.flightLead[lang]}</p>
        </m.div>

        <m.div style={{ opacity: hintOpacity }} className={`pointer-events-none absolute inset-x-0 bottom-7 z-20 flex flex-col items-center gap-3 ${exploring || hot.size ? "invisible" : ""}`}>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-white/35 sm:block">{l.galaxyHint[lang]}</span>
          <span className="scroll-hint h-10 w-px bg-gradient-to-b from-white/40 to-transparent" />
        </m.div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-b from-transparent to-ink-950" />
      </div>
    </section>
  );
}

/**
 * The real search, inline: the index downloads on first focus, results open
 * under the field, and every plugin that answers lights up in the galaxy.
 * While empty and idle it types example questions as its placeholder.
 */
function HeroSearch({ lang, onHot, onExplore }: { lang: Lang; onHot: (ids: Set<string>) => void; onExplore: (on: boolean) => void }) {
  const l = dict.landing;
  const s = dict.search;
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [prepared, setPrepared] = useState<Prepared[] | null>(null);
  const typed = useTypewriter(l.searchExamples[lang], !focus && !query);
  const deferred = useDeferredValue(query);

  const load = () => {
    if (!prepared) loadIndex(lang).then((e) => setPrepared(prepare(e))).catch(() => {});
  };

  const wide = useMemo(() => (prepared ? rank(prepared, deferred, 60) : []), [prepared, deferred]);
  const hits = wide.slice(0, 6);

  useEffect(() => {
    const q = deferred.trim().toLowerCase();
    const ids = new Set(wide.map((h) => h.plugin));
    if (q.length > 1)
      for (const p of plugins) if (`${p.name} ${p.category.en} ${p.category[lang]}`.toLowerCase().includes(q)) ids.add(p.id);
    onHot(ids);
  }, [wide, deferred, lang, onHot]);

  useEffect(() => setCursor(0), [query]);

  const open = focus && query.trim() !== "";
  useEffect(() => onExplore(open), [open, onExplore]);
  const go = (i: number) => {
    const hit = hits[i];
    if (hit) router.push(`/${lang}/docs/${hit.plugin}/${hit.slug}`);
  };

  return (
    <div className="relative text-left">
      <label className={`search-trigger group relative flex h-14 items-center gap-3 rounded-full pl-5 pr-2 ${open ? "is-open" : ""}`}>
        <svg className="h-4 w-4 shrink-0 text-[#b48fd9]" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="7.2" cy="7.2" r="4.4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10.6 10.6L13.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="relative min-w-0 flex-1">
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
            aria-label={l.searchLabel[lang].replace("{n}", String(TOTAL_PAGES))}
            className="relative z-10 h-14 w-full bg-transparent text-base text-white focus:outline-none sm:text-[15px]"
          />
          {!query && (
            <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 flex items-center truncate text-base text-white/40 sm:text-[15px]">
              {focus ? s.placeholder[lang] : typed}
              {!focus && <span className="caret ml-px inline-block h-[1.05em] w-px bg-[#b48fd9]" />}
            </span>
          )}
        </span>
        <span className="hidden shrink-0 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/30 sm:block">
          {TOTAL_PAGES} {s.pages[lang]}
        </span>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-ink-950 transition-transform duration-500 [transition-timing-function:cubic-bezier(.16,1,.3,1)] group-hover:scale-105">
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </label>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.985 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
            className="absolute inset-x-0 top-[calc(100%+10px)] z-30 max-h-[46vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0c0a14]/[0.97] p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl scroll-thin"
          >
            {!prepared && <p className="px-3 py-6 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-white/30 animate-pulse">{s.loading[lang]}</p>}
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
                className={`relative flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${i === cursor ? "bg-white/[0.06]" : ""}`}
              >
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${i === cursor ? "bg-[#8fffc1] shadow-[0_0_10px_#8fffc1]" : "bg-white/20"}`} />
                <span className="min-w-0">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-display text-[14.5px] font-medium text-white">{hit.title}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
                      {hit.pluginName} · {hit.group}
                    </span>
                  </span>
                  {hit.description && <span className="mt-0.5 line-clamp-1 block text-[13px] text-white/45">{hit.description}</span>}
                </span>
              </Link>
            ))}
            {hits.length > 0 && (
              <p className="flex items-center gap-4 border-t border-white/[0.06] px-3 pb-1 pt-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
                <span>↑↓ {s.navigate[lang]}</span>
                <span>↵ {s.open[lang]}</span>
                <span className="ml-auto text-[#8fffc1]/70">{l.litCount[lang].replace("{n}", String(new Set(wide.map((h) => h.plugin)).size))}</span>
              </p>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Types each example, holds it, erases it, moves on. Static first example under reduced motion. */
function useTypewriter(examples: readonly string[], running: boolean) {
  const [text, setText] = useState(examples[0]);
  useEffect(() => {
    if (!running || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    let n = 0;
    let erasing = false;
    let id: ReturnType<typeof setTimeout>;
    const step = () => {
      const word = examples[i];
      if (!erasing) {
        n++;
        setText(word.slice(0, n));
        if (n >= word.length) {
          erasing = true;
          id = setTimeout(step, 2200);
          return;
        }
        id = setTimeout(step, 45 + Math.random() * 55);
      } else {
        n--;
        setText(word.slice(0, n));
        if (n <= 0) {
          erasing = false;
          i = (i + 1) % examples.length;
          id = setTimeout(step, 380);
          return;
        }
        id = setTimeout(step, 22);
      }
    };
    setText("");
    id = setTimeout(step, 1600);
    return () => clearTimeout(id);
  }, [examples, running]);
  return text;
}
