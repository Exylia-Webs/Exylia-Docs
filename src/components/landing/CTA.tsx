"use client";

import { m } from "framer-motion";
import { SITE, type Lang } from "@/content/registry";
import { dict } from "@/content/dictionary";
import { Magnetic } from "@/components/motion/Primitives";
import { Ink } from "./fx/Ink";

export function CTA({ lang }: { lang: Lang }) {
  const l = dict.landing;
  return (
    <section className="relative overflow-hidden pt-32 sm:pt-44">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(50%_60%_at_50%_100%,rgba(138,81,196,0.3),transparent_70%)]" />

      <div className="relative mx-auto max-w-content px-6 text-center">
        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-10 h-px w-24 bg-gradient-to-r from-transparent via-[rgb(var(--accent))]/60 to-transparent"
        />

        <h2 className="mx-auto max-w-4xl font-display text-[clamp(2.4rem,6.5vw,5.5rem)] font-medium leading-[1] tracking-[-0.045em] text-white">
          {l.ctaTitle[lang]} <Ink word={l.ink.cta[lang]} className="text-[1.12em]" />?
        </h2>

        <m.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed text-white/45"
        >
          {l.ctaLead[lang]}
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic>
            <a
              href={SITE.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-6 text-[14.5px] font-medium text-ink-950 transition-colors hover:bg-[#f1efff]"
            >
              {l.ctaButton[lang]}
              <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </Magnetic>
          <a
            href={SITE.store}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center rounded-full px-5 text-[14.5px] font-medium text-white/60 transition-colors hover:text-white"
          >
            {l.ctaSecondaryLink[lang]}
            <span className="ml-2 text-white/25">↗</span>
          </a>
        </m.div>
      </div>

      <m.p
        aria-hidden
        initial={{ opacity: 0, y: "30%" }}
        whileInView={{ opacity: 1, y: "0%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="wordmark pointer-events-none mt-20 select-none text-center font-display text-[25vw] font-semibold leading-[0.78] tracking-[-0.07em]"
      >
        Exylia
      </m.p>
    </section>
  );
}
