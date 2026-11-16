"use client";

import Link from "next/link";
import { m, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AnimatedWords } from "@/components/motion/Primitives";
import { PluginBanner } from "@/components/PluginBanner";
import { SearchDialog } from "@/components/Search";
import { dict } from "@/content/dictionary";
import { documentedPlugins, pageCount, plugins, type Lang } from "@/content/registry";
import { Ink } from "./fx/Ink";
import { Nebula } from "./fx/Nebula";

export const TOTAL_PAGES = documentedPlugins.reduce((n, plugin) => n + pageCount(plugin), 0);
const RING = documentedPlugins.slice(0, 16);
const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ lang }: { lang: Lang }) {
  const l = dict.landing;
  const ref = useRef<HTMLElement>(null);
  const [search, setSearch] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const ringTilt = useTransform(scrollYProgress, [0, 1], [-9, -26]);
  const ringY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const ringScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section ref={ref} id="top" className="relative overflow-hidden pt-32 sm:pt-36">
      <Nebula />
      <div className="noise" />

      <m.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 mx-auto max-w-content px-6 text-center">
        <m.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-4 text-[12.5px] text-white/60 backdrop-blur-md"
        >
          <span className="rounded-full bg-[#8a51c4]/25 px-2 py-0.5 font-mono text-[10.5px] tracking-[0.12em] text-[#e7cfff]">
            {plugins.length}
          </span>
          {l.kicker[lang]}
        </m.p>

        <h1 className="mx-auto mt-7 max-w-6xl font-display text-[clamp(2.5rem,6vw,5.4rem)] font-medium leading-[1] tracking-[-0.045em] text-white">
          <span className="block">
            <AnimatedWords text={l.line1[lang]} />
          </span>
          <span className="block text-white/40">
            <AnimatedWords text={l.line2[lang]} />{" "}
            <Ink word={l.ink.hero[lang]} delay={0.55} className="-ml-[0.1em] text-[1.12em]" />
          </span>
        </h1>

        <m.p
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          className="mx-auto mt-6 max-w-xl text-[16.5px] leading-relaxed text-white/50"
        >
          {l.lead[lang]}
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
          className="mx-auto mt-8 flex max-w-xl flex-col items-stretch gap-3 sm:flex-row sm:items-center"
        >
          <SearchTrigger lang={lang} onOpen={() => setSearch(true)} />
          <a
            href="#plugins"
            className="group inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-[14.5px] font-medium text-white/70 transition-colors hover:text-white"
          >
            {l.ctaPrimary[lang]}
            <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </m.div>
      </m.div>

      <m.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.6, delay: 0.35, ease: EASE }}
        className="relative z-0 -mt-4 sm:-mt-24"
      >
        <m.div style={{ y: ringY, scale: ringScale }}>
          <BannerRing lang={lang} tilt={ringTilt} />
        </m.div>
      </m.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-b from-transparent to-ink-950" />
      <SearchDialog lang={lang} open={search} onClose={() => setSearch(false)} />
    </section>
  );
}

/**
 * The hero's main call to action is the search itself: it types real
 * questions people ask, and a click or ⌘K opens the real search.
 */
function SearchTrigger({ lang, onOpen }: { lang: Lang; onOpen: () => void }) {
  const l = dict.landing;
  const typed = useTypewriter(l.searchExamples[lang]);
  const [mac, setMac] = useState(true);
  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);

  return (
    <button
      onClick={onOpen}
      className="search-trigger group relative flex h-14 flex-1 items-center gap-3 rounded-full pl-5 pr-2 text-left"
    >
      <svg className="h-4 w-4 shrink-0 text-[#b48fd9]" viewBox="0 0 16 16" fill="none">
        <circle cx="7.2" cy="7.2" r="4.4" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10.6 10.6L13.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="min-w-0 flex-1 truncate text-[15px] text-white/45">
        <span className="sr-only">{l.searchLabel[lang].replace("{n}", String(TOTAL_PAGES))}</span>
        <span aria-hidden className="text-white/80">{typed}</span>
        <span aria-hidden className="caret ml-px inline-block h-[1.05em] w-px translate-y-[0.2em] bg-[#b48fd9]" />
      </span>
      <kbd className="hidden shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-white/45 sm:block">
        {mac ? "⌘" : "Ctrl"} K
      </kbd>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-ink-950 transition-transform duration-500 [transition-timing-function:cubic-bezier(.16,1,.3,1)] group-hover:scale-105">
        <svg className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}

/** Types each example, holds it, erases it, moves on. Static first example under reduced motion. */
function useTypewriter(examples: readonly string[]) {
  const [text, setText] = useState(examples[0]);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
    id = setTimeout(step, 1400);
    return () => clearTimeout(id);
  }, [examples]);
  return text;
}

/**
 * Sixteen plugins' key art on a slowly turning ring, seen from just above.
 * Pure CSS 3D (`.ring` in globals.css); hovering pauses it, every card opens
 * its documentation, and scrolling tips the ring towards the reader.
 */
function BannerRing({ lang, tilt }: { lang: Lang; tilt: MotionValue<number> }) {
  const rotateX = useTransform(tilt, (v) => `${v}deg`);
  return (
    <div className="ring-stage" aria-label={dict.landing.ringLabel[lang]}>
      <m.div className="ring-tilt" style={{ rotateX }}>
        <ul className="ring" style={{ ["--n" as string]: RING.length }}>
          {RING.map((plugin, i) => (
            <li key={plugin.id} className="ring-card" style={{ ["--i" as string]: i }}>
              <Link href={`/${lang}/docs/${plugin.id}`} className="ring-face" tabIndex={-1}>
                <PluginBanner plugin={plugin} rounded="rounded-[14px]" priority={i < 4} className="h-full w-full border-white/10" />
                <span className="ring-label">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#b48fd9]">{plugin.category[lang]}</span>
                  <span className="mt-0.5 block text-[13px] font-medium text-white">{plugin.name}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </m.div>
    </div>
  );
}
