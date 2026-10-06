"use client";

import { m } from "framer-motion";
import { Reveal, TextReveal, LineReveal } from "@/components/motion/Primitives";
import { dict } from "@/content/dictionary";
import type { Lang } from "@/content/registry";

export function Ecosystem({ lang }: { lang: Lang }) {
  const l = dict.landing;
  return (
    <section id="ecosistema" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute right-[-10%] top-1/3 h-[46vw] w-[46vw] rounded-full opacity-40 blur-[130px] animate-drift"
          style={{ background: "radial-gradient(circle, rgba(124,92,255,0.13), transparent 65%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-content px-6">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-white/20" />
              <span className="eyebrow">{l.approachKicker[lang]}</span>
            </div>
            <h2 className="mt-6 font-display text-[clamp(1.9rem,4.4vw,3rem)] font-medium leading-[1.05] tracking-tight2 text-white">
              <TextReveal delay={0.05}>{l.approachTitle1[lang]}</TextReveal>
              <br />
              <TextReveal delay={0.14} className="text-white/35">
                {l.approachTitle2[lang]}
              </TextReveal>
              <br />
              <TextReveal delay={0.22}>{l.approachTitle3[lang]}</TextReveal>
            </h2>
            <Reveal delay={0.3}>
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/45">
                {l.approachLead[lang]}
              </p>
            </Reveal>
            <Reveal delay={0.38}>
              <div className="mt-8 max-w-sm">
                <LineReveal delay={0.5} />
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col">
            {l.principles.map((item, i) => (
              <m.div
                key={item.title.en}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="group relative border-t hair py-7 transition-colors duration-500 last:border-b"
              >
                <span className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-[rgb(var(--accent))]/60 transition-all duration-700 group-hover:w-full" />
                <div className="flex gap-6">
                  <span className="mt-1 font-mono text-[11px] tracking-[0.18em] text-white/22 transition-colors duration-500 group-hover:text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-[17px] font-medium tracking-tightish text-white">
                      {item.title[lang]}
                    </h3>
                    <p className="mt-2 max-w-lg text-[14.5px] leading-relaxed text-white/42">
                      {item.body[lang]}
                    </p>
                  </div>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
