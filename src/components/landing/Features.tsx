"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { dict } from "@/content/dictionary";
import { documentedPlugins, plugins, type Lang } from "@/content/registry";
import { CountUp } from "./fx/CountUp";
import { Ink, useSeen } from "./fx/Ink";
import { TOTAL_PAGES } from "./Hero";

const EASE = [0.16, 1, 0.3, 1] as const;

const reveal = (i: number) => ({
  initial: { opacity: 0, y: 30, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-10% 0px" },
  transition: { duration: 0.9, delay: i * 0.08, ease: EASE },
});

/** Four things the docs do, each shown working rather than described. */
export function Features({ lang }: { lang: Lang }) {
  const l = dict.landing;
  return (
    <section className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-content px-6">
        <p className="eyebrow">{l.featuresKicker[lang]}</p>
        <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1] tracking-[-0.04em] text-white">
          {l.featuresTitle[lang]} <Ink word={l.ink.features[lang]} className="text-[1.12em]" />
        </h2>

        <div className="mt-14 grid gap-4 md:grid-cols-6">
          <Card i={0} className="md:col-span-4" title={l.featureSearch.title[lang]} body={l.featureSearch.body[lang]}>
            <SearchDemo lang={lang} />
          </Card>
          <Card i={1} className="md:col-span-2" title={l.featureLangs.title[lang]} body={l.featureLangs.body[lang]}>
            <LangFlip />
          </Card>
          <Card i={2} className="md:col-span-3" title={l.featureAssistant.title[lang]} body={l.featureAssistant.body[lang]}>
            <AssistantDemo lang={lang} />
          </Card>
          <Card i={3} className="md:col-span-3" title={l.featureCopy.title[lang]} body={l.featureCopy.body[lang]}>
            <CopyDemo lang={lang} />
          </Card>
        </div>
      </div>
    </section>
  );
}

function Card({ i, className, title, body, children }: { i: number; className: string; title: string; body: string; children: React.ReactNode }) {
  return (
    <m.article
      {...reveal(i)}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-b from-white/[0.035] to-white/[0.01] p-6 transition-colors duration-500 hover:border-white/15 sm:p-7 ${className}`}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#8a51c4]/0 blur-3xl transition-colors duration-700 group-hover:bg-[#8a51c4]/20" />
      <div className="relative flex min-h-[170px] flex-1 items-center justify-center" aria-hidden>
        {children}
      </div>
      <h3 className="relative mt-6 text-[17px] font-medium text-white">{title}</h3>
      <p className="relative mt-1.5 text-[14px] leading-relaxed text-white/45">{body}</p>
    </m.article>
  );
}

/** Real page titles flowing past, filtered by a query being typed. */
function SearchDemo({ lang }: { lang: Lang }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useSeen(ref);
  const queries = lang === "es" ? ["arena", "kit", "permiso"] : ["arena", "kit", "permission"];
  const [qi, setQi] = useState(0);
  useEffect(() => {
    if (!seen || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setQi((n) => (n + 1) % queries.length), 2600);
    return () => clearInterval(id);
  }, [seen, queries.length]);
  const q = queries[qi];
  const hits = documentedPlugins
    .flatMap((p) => p.nav.flatMap((g) => g.pages.map((page) => ({ plugin: p.name, slug: page.slugs[lang] }))))
    .filter((h) => h.slug.includes(q.slice(0, 4)))
    .slice(0, 3);

  return (
    <div ref={ref} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b0b10] p-2 shadow-[0_30px_80px_-30px_rgba(138,81,196,0.6)]">
      <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-3 pb-2.5 pt-1.5 text-[14px]">
        <svg className="h-3.5 w-3.5 text-[#b48fd9]" viewBox="0 0 16 16" fill="none">
          <circle cx="7.2" cy="7.2" r="4.4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10.6 10.6L13.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <AnimatePresence mode="wait">
          <m.span key={q} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="text-white">
            {q}
          </m.span>
        </AnimatePresence>
        <kbd className="ml-auto rounded border border-white/10 px-1.5 font-mono text-[10px] text-white/35">esc</kbd>
      </div>
      <ul className="min-h-[124px] pt-1.5">
        <AnimatePresence mode="popLayout">
          {hits.map((h, i) => (
            <m.li
              key={q + h.plugin + h.slug}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-[13px] ${i === 0 ? "bg-[#8a51c4]/15 text-white" : "text-white/55"}`}
            >
              <span className="capitalize">{h.slug.replace(/-/g, " ")}</span>
              <span className="font-mono text-[10.5px] text-white/30">{h.plugin}</span>
            </m.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

/** The same heading flipping between the two languages. */
function LangFlip() {
  const [es, setEs] = useState(false);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setEs((v) => !v), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="text-center">
      <div className="mx-auto inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1 font-mono text-[11px]">
        {["EN", "ES"].map((code, i) => (
          <span key={code} className={`relative rounded-full px-3 py-1 ${(i === 1) === es ? "text-white" : "text-white/35"}`}>
            {(i === 1) === es && (
              <m.span layoutId="lang-pill" className="absolute inset-0 -z-10 rounded-full bg-[#8a51c4]/40" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
            )}
            {code}
          </span>
        ))}
      </div>
      <div className="relative isolate mt-6 h-[2.6em] overflow-hidden font-display text-[26px] font-medium tracking-tight text-white">
        <AnimatePresence mode="popLayout" initial={false}>
          <m.p
            key={String(es)}
            initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-100%", opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {es ? "Primeros pasos" : "First steps"}
            <span className="block text-[13px] font-normal text-white/35">{es ? "/es/docs/exyliaffa/primeros-pasos" : "/en/docs/exyliaffa/first-steps"}</span>
          </m.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** A question, then the answer typed out with the page it comes from. */
function AssistantDemo({ lang }: { lang: Lang }) {
  const a = dict.landing.featureAssistant;
  const ref = useRef<HTMLDivElement>(null);
  const seen = useSeen(ref);
  const answer = a.answer[lang];
  const [n, setN] = useState(answer.length);
  useEffect(() => {
    if (!seen || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setN(i);
      if (i >= answer.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [seen, answer]);

  return (
    <div ref={ref} className="flex w-full max-w-sm flex-col gap-3 text-[13.5px]">
      <p className="self-end rounded-2xl rounded-br-md bg-white/[0.07] px-4 py-2.5 text-white/80">{a.question[lang]}</p>
      <div className="self-start rounded-2xl rounded-bl-md border border-[#b48fd9]/25 bg-[#8a51c4]/10 px-4 py-3 text-white/85">
        {answer.slice(0, n)}
        {n < answer.length && <span className="caret ml-px inline-block h-[1em] w-px translate-y-[0.15em] bg-[#b48fd9]" />}
        <m.span
          initial={false}
          animate={{ opacity: n >= answer.length ? 1 : 0 }}
          className="mt-2.5 flex items-center gap-1.5 font-mono text-[10.5px] text-[#b48fd9]"
        >
          ↳ ExyliaFFA · Kits
        </m.span>
      </div>
    </div>
  );
}

/** A real command with a copy button that clicks itself now and then. */
function CopyDemo({ lang }: { lang: Lang }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }, 3200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="w-full max-w-sm space-y-2 font-mono text-[12.5px]">
      {[
        ["/ffa join", "exyliaffa.commands.join"],
        ["/ffa stats", "exyliaffa.commands.stats"],
      ].map(([cmd, perm], i) => (
        <div key={cmd} className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-black/30 px-4 py-3">
          <span>
            <span className="text-[#b48fd9]">{cmd}</span>
            <span className="ml-3 text-white/30">{perm}</span>
          </span>
          {i === 0 && (
            <span className={`rounded-md px-2 py-0.5 text-[10.5px] transition-colors duration-300 ${copied ? "bg-[#8fffc1]/15 text-[#8fffc1]" : "bg-white/[0.06] text-white/45"}`}>
              {copied ? `✓ ${dict.landing.featureCopy.copied[lang]}` : "copy"}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/** Full-bleed violet band with the three numbers, counting up when reached. */
export function Stats({ lang }: { lang: Lang }) {
  const l = dict.landing;
  const items = [
    { n: plugins.length, label: l.statPlugins[lang] },
    { n: TOTAL_PAGES, label: l.statPages[lang] },
    { n: 2, label: l.statLangs[lang] },
  ];
  return (
    <section className="px-3 sm:px-4">
      <m.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.1, ease: EASE }}
        className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#8a51c4,#aa76de_55%,#b48fd9)] px-6 py-16 sm:py-20"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_0%,rgba(255,255,255,0.25),transparent_60%)]" />
        <div className="noise opacity-40" />
        <div className="relative mx-auto grid max-w-content gap-10 text-center sm:grid-cols-3">
          {items.map((it) => (
            <div key={it.label}>
              <CountUp to={it.n} className="block font-display text-[clamp(3.5rem,9vw,7rem)] font-medium leading-none tracking-[-0.05em] text-white" />
              <span className="mt-3 block text-[14px] font-medium uppercase tracking-[0.18em] text-white/75">{it.label}</span>
            </div>
          ))}
        </div>
        <p className="relative mt-12 text-center text-[15px] text-white/80">{l.statsLead[lang]}</p>
      </m.div>
    </section>
  );
}
