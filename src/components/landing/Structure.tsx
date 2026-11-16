"use client";

import { m, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { dict } from "@/content/dictionary";
import { documentedPlugins, type Lang } from "@/content/registry";
import { Ink } from "./fx/Ink";

const EASE = [0.16, 1, 0.3, 1] as const;
/** The plugin the window shows: the first documented one, with its real sidebar. */
const SAMPLE = documentedPlugins[0];

const label = (slug: string) => slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

/**
 * "Learn to read it once": the section pins while the reader scrolls through
 * the four parts every plugin shares, and a docs window follows along,
 * highlighting that part of a real plugin's sidebar.
 */
export function Structure({ lang }: { lang: Lang }) {
  const l = dict.landing;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  const steps = l.structureSteps;
  useMotionValueEvent(scrollYProgress, "change", (v) => setStep(Math.min(steps.length - 1, Math.floor(v * steps.length))));
  const line = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const group = SAMPLE?.nav[step];

  return (
    <section ref={ref} id="estructura" className="relative h-[320vh]" aria-label={l.structureKicker[lang]}>
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden py-24">
        <div className="mx-auto grid w-full max-w-content items-center gap-12 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="eyebrow">{l.structureKicker[lang]}</p>
            <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1] tracking-[-0.04em] text-white">
              {l.structureTitle[lang]} <Ink word={l.ink.structure[lang]} className="text-[1.12em]" />
            </h2>
            <p className="mt-6 max-w-md text-[15.5px] leading-relaxed text-white/50">{l.structureLead[lang]}</p>

            <ol className="relative mt-10 max-w-md">
              <span className="absolute bottom-2 left-[11px] top-2 w-px bg-white/10" />
              <m.span style={{ height: line }} className="absolute left-[11px] top-2 w-px bg-gradient-to-b from-[#e7cfff] to-[#8a51c4]" />
              {steps.map((s, i) => (
                <li key={s.title.en} className="relative pb-6 pl-10 last:pb-0">
                  <span
                    className={`absolute left-0 top-0.5 grid h-[23px] w-[23px] place-items-center rounded-full border font-mono text-[10px] transition-all duration-500 ${
                      i <= step ? "border-[#b48fd9] bg-[#8a51c4] text-white" : "border-white/15 bg-ink-950 text-white/40"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <h3 className={`text-[16px] font-medium transition-colors duration-500 ${i === step ? "text-white" : "text-white/35"}`}>
                    {s.title[lang]}
                  </h3>
                  <div
                    className={`grid transition-all duration-700 [transition-timing-function:cubic-bezier(.16,1,.3,1)] ${
                      i === step ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <p className="overflow-hidden pt-1.5 text-[14px] leading-relaxed text-white/50">{s.body[lang]}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {SAMPLE && (
            <div className="relative hidden lg:block" aria-hidden>
              <div className="absolute -inset-10 rounded-[40px] bg-[radial-gradient(closest-side,rgba(138,81,196,0.28),transparent)] blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10]/90 shadow-[0_40px_120px_-40px_rgba(138,81,196,0.6)] backdrop-blur">
                <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="ml-3 truncate font-mono text-[11px] text-white/30">
                    docs.exylia.net/{lang}/docs/{SAMPLE.id}
                  </span>
                </div>
                <div className="grid grid-cols-[170px_1fr] sm:grid-cols-[200px_1fr]">
                  <nav className="border-r border-white/[0.06] p-4 text-[12.5px]">
                    <p className="mb-3 font-medium text-white">{SAMPLE.name}</p>
                    {SAMPLE.nav.map((g, i) => (
                      <div
                        key={g.label.en}
                        className={`mb-2 rounded-lg px-2 py-1.5 transition-all duration-500 ${i === step ? "bg-[#8a51c4]/15" : ""}`}
                      >
                        <p className={`font-mono text-[9.5px] uppercase tracking-[0.16em] ${i === step ? "text-[#e7cfff]" : "text-white/25"}`}>
                          {g.label[lang]}
                        </p>
                        {i === step && (
                          <ul className="mt-1.5 space-y-1">
                            {g.pages.slice(0, 5).map((p, j) => (
                              <li key={p.id} className={j === 0 ? "text-white" : "text-white/40"}>
                                {label(p.slugs[lang])}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </nav>
                  <m.div key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="p-5 sm:p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#b48fd9]">{group?.label[lang]}</p>
                    <p className="mt-2 font-display text-[20px] font-medium tracking-tight text-white">
                      {group && label(group.pages[0].slugs[lang])}
                    </p>
                    <div className="mt-4 space-y-2">
                      <span className="block h-2 w-[92%] rounded-full bg-white/[0.07]" />
                      <span className="block h-2 w-[80%] rounded-full bg-white/[0.07]" />
                      <span className="block h-2 w-[86%] rounded-full bg-white/[0.07]" />
                    </div>
                    <div className="mt-5 rounded-lg border border-white/[0.06] bg-black/30 p-3 font-mono text-[11px] leading-relaxed">
                      <StepSnippet step={step} />
                    </div>
                    <div className="mt-4 space-y-2">
                      <span className="block h-2 w-[70%] rounded-full bg-white/[0.07]" />
                      <span className="block h-2 w-[54%] rounded-full bg-white/[0.07]" />
                    </div>
                  </m.div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** A plausible line of what each part contains: a command, a key, a flow, a table row. */
function StepSnippet({ step }: { step: number }) {
  const k = "text-[#b48fd9]";
  const v = "text-[#8fffc1]";
  const d = "text-white/35";
  if (step === 0)
    return (
      <>
        <span className={d}>$</span> <span className="text-white/80">cp</span> ExyliaFFA.jar <span className={k}>plugins/</span>
        <br />
        <span className={d}>[Server] ExyliaFFA enabled</span> <span className={v}>✓</span>
      </>
    );
  if (step === 1)
    return (
      <>
        <span className={k}>kill-streaks</span>: <br />
        &nbsp;&nbsp;<span className={k}>reset-on-death</span>: <span className={v}>true</span>
        <br />
        &nbsp;&nbsp;<span className={k}>break-min-streak</span>: <span className={v}>3</span> <span className={d}># default</span>
      </>
    );
  if (step === 2)
    return (
      <>
        <span className="text-white/70">kill</span> <span className={d}>→</span> <span className={k}>streak +1</span> <span className={d}>→</span>{" "}
        <span className={v}>killstreaks.yml rung</span>
        <br />
        <span className={d}>3 kills on the same player stop counting</span>
      </>
    );
  return (
    <>
      <span className={k}>/ffa join</span> <span className={d}>·</span> <span className="text-white/60">exyliaffa.commands.join</span>
      <br />
      <span className={k}>%exyliaffa_current_streak%</span> <span className={d}>·</span> <span className={v}>7</span>
    </>
  );
}
