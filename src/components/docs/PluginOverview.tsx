"use client";

import Link from "next/link";
import { m } from "framer-motion";
import type { NavSection } from "@/lib/docs";
import type { Lang, Plugin } from "@/content/registry";
import { dict } from "@/content/dictionary";
import { Magnetic } from "@/components/motion/Primitives";
import { PluginBanner } from "@/components/PluginBanner";
import { SITE } from "@/content/registry";
import { ReadTick, useReadPages } from "./Reading";
import { AskPlugin } from "./AskPlugin";
import { useLayoutEffect, useRef } from "react";
import { Words, useSeen } from "@/components/fx/Words";
import { DotField } from "@/components/fx/DotField";
import { arrived, BANNER_MORPH } from "@/lib/banner-morph";

const EASE = [0.16, 1, 0.3, 1] as const;
/** The pages people come back to look things up in. */
const QUICK = ["commands", "permissions", "placeholders", "configuration", "api"];

export function PluginOverview({
  plugin,
  sections,
  firstHref,
  lang,
}: {
  plugin: Plugin;
  sections: NavSection[];
  firstHref: string;
  lang: Lang;
}) {
  const flat = sections.flatMap((s) => s.pages);
  const pageCount = flat.length;
  const read = useReadPages(plugin.id);
  const done = flat.filter((p) => read.includes(p.id)).length;
  const resume = flat.find((p) => !read.includes(p.id));
  const quick = flat.filter((p) => QUICK.includes(p.id));
  const f = dict.docs.facts;
  useLayoutEffect(arrived, []);
  const stepsRef = useRef<HTMLOListElement>(null);
  useSeen(stepsRef);
  const steps = sections[0]?.pages.slice(0, 3) ?? [];

  const facts = [
    { label: f.version[lang], value: `v${plugin.version}` },
    { label: f.minecraft[lang], value: plugin.minecraft },
    { label: f.category[lang], value: plugin.category[lang] },
    { label: f.pages[lang], value: String(pageCount) },
  ];

  return (
    <div className="pb-6">
      <header className="relative pb-12">
        <DotField tinted className="-z-10" />
        <div className="relative mb-10" style={{ viewTransitionName: BANNER_MORPH }}>
          <PluginBanner
            plugin={plugin}
            priority
            rounded="rounded-xl"
            className="relative aspect-[2/1] w-full shadow-[0_40px_120px_-50px_rgba(0,0,0,0.9)] sm:aspect-[3/1]"
          />
        </div>

        <m.h1
          initial={false}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.06, ease: EASE }}
          className="font-display text-[clamp(2.3rem,5.4vw,3.6rem)] font-medium leading-[1.02] tracking-tight2 text-white"
        >
          {plugin.name}
        </m.h1>

        <m.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
          className="mt-4 max-w-2xl text-[16.5px] leading-relaxed text-white/50"
        >
          {plugin.summary[lang]}
        </m.p>

        <m.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.26, ease: EASE }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <Link
              href={resume ? `/${lang}/docs/${resume.plugin}/${resume.slug}` : firstHref}
              className="group inline-flex h-11 max-w-[80vw] items-center gap-2.5 rounded-full bg-white px-5 text-[14px] font-medium text-ink-950 transition-colors hover:bg-white/85"
            >
              <span className="truncate">{resume && done > 0 ? dict.docs.continue[lang].replace("{title}", resume.title) : dict.docs.start[lang]}</span>
              <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </Magnetic>

          {(plugin.purchase ?? plugin.download) && (
            <a
              href={plugin.purchase ?? plugin.download}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center rounded-full border border-white/12 px-4 text-[13.5px] font-medium text-white/65 transition-colors hover:border-white/30 hover:text-white"
            >
              {(plugin.purchase ? dict.docs.buy : dict.docs.download)[lang]}
              <span className="ml-2 text-white/25">↗</span>
            </a>
          )}

          <a
            href={SITE.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center rounded-full px-4 text-[13.5px] font-medium text-white/45 transition-colors hover:text-white"
          >
            {dict.docs.support[lang]}
            <span className="ml-2 text-white/25">↗</span>
          </a>
        </m.div>

        <m.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 flex items-center gap-3 text-[12.5px] text-white/35"
        >
          <span className="relative h-1 w-32 overflow-hidden rounded-full bg-white/[0.08]">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[rgb(var(--accent))] to-[#8fffc1] transition-[width] duration-700"
              style={{ width: `${(done / pageCount) * 100}%` }}
            />
          </span>
          {done === pageCount
            ? dict.docs.allRead[lang]
            : (done > 0 ? dict.docs.progress : dict.docs.progressNone)[lang].replace("{n}", String(done)).replace("{total}", String(pageCount))}
        </m.div>

        <AskPlugin name={plugin.name} lang={lang} />

        <m.dl
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.34 }}
          className="mt-10 grid grid-cols-2 gap-px border-l border-t hair sm:grid-cols-4"
        >
          {facts.map((fact) => (
            <div key={fact.label} className="border-b border-r hair px-4 py-3.5">
              <dt className="text-[12.5px] text-white/28">
                {fact.label}
              </dt>
              <dd className="mt-1.5 font-display text-[15px] font-medium text-white">{fact.value}</dd>
            </div>
          ))}
        </m.dl>
      </header>

      {steps.length === 3 && (
        <section className="mb-16">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <Words
              text={dict.docs.stepsTitle[lang]}
              className="font-display text-[clamp(1.8rem,3.6vw,2.6rem)] font-semibold leading-[1] tracking-[-0.04em] text-white"
              accent="text-[1.08em]"
            />
            <p className="text-[14px] text-white/40">{dict.docs.stepsLead[lang]}</p>
          </div>
          <ol ref={stepsRef} className="steps mt-7 grid gap-3 md:grid-cols-3">
            {steps.map((page, i) => (
              <li key={page.slug} style={{ ["--i" as string]: i }}>
                <Link
                  href={`/${lang}/docs/${page.plugin}/${page.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition-colors duration-300 hover:border-[rgb(var(--accent)/0.45)] hover:bg-[rgb(var(--accent)/0.05)]"
                >
                  <span className="flex items-center gap-3">
                    <span className="step-n grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/15 text-[12.5px] font-medium tabular-nums text-white/50">
                      {i + 1}
                    </span>
                    <span className="step-bar h-px flex-1 overflow-hidden bg-white/[0.08]">
                      <span className="block h-full bg-[rgb(var(--accent))]" />
                    </span>
                  </span>
                  <span className="mt-6 block text-[16px] font-medium tracking-[-0.01em] text-white">{page.title}</span>
                  {page.description && <span className="mt-1.5 line-clamp-2 block text-[13.5px] leading-relaxed text-white/45">{page.description}</span>}
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {flat.some((p) => p.fresh) && (
        <section className="mb-16 rounded-2xl border border-[rgb(var(--accent)/0.2)] bg-[rgb(var(--accent)/0.04)] p-5 sm:p-6">
          <p className="eyebrow !text-[rgb(var(--accent))]">{dict.docs.news[lang].replace("{v}", plugin.version)}</p>
          <ul className="mt-3 grid gap-x-8 sm:grid-cols-2">
            {flat
              .filter((p) => p.fresh)
              .map((page) => (
                <li key={page.slug}>
                  <Link href={`/${lang}/docs/${page.plugin}/${page.slug}`} className="group flex items-baseline gap-3 py-2">
                    <span className="text-[14.5px] text-white transition-colors group-hover:text-[rgb(var(--accent))]">{page.title}</span>
                    <span className="min-w-0 truncate text-[13px] text-white/40">{page.description}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      )}

      {quick.length > 0 && (
        <section className="mb-16">
          <p className="eyebrow">{dict.docs.quick[lang]}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {quick.map((page) => (
              <Link
                key={page.slug}
                href={`/${lang}/docs/${page.plugin}/${page.slug}`}
                className="group inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 text-[13.5px] text-white/70 transition-all duration-300 hover:border-[rgb(var(--accent)/0.5)] hover:bg-[rgb(var(--accent)/0.1)] hover:text-white"
              >
                {page.title}
                <svg className="h-3 w-3 text-white/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-col">
        {sections.map((section, si) => {
          const finished = section.pages.every((p) => read.includes(p.id));
          return (
            <m.section
              key={section.label}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6% 0px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="grid gap-4 border-t border-white/[0.07] py-10 md:grid-cols-[200px_1fr] md:gap-10"
            >
              <div>
                <p className="text-[12.5px] text-white/30">
                  {dict.docs.chapter[lang]} {String(si + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 flex items-center gap-2 font-display text-[22px] font-medium tracking-tight text-white">
                  {section.label}
                  {finished && read.length > 0 && <ReadTick className="h-4 w-4" />}
                </h2>
              </div>

              <ol className="flex flex-col">
                {section.pages.map((page) => {
                  const isRead = read.includes(page.id);
                  return (
                    <li key={page.slug}>
                      <Link
                        href={`/${lang}/docs/${page.plugin}/${page.slug}`}
                        className="group -mx-3 flex items-start gap-4 rounded-xl px-3 py-3.5 transition-colors duration-300 hover:bg-white/[0.03]"
                      >
                        <span
                          className={`mt-[3px] grid h-5 w-5 shrink-0 place-items-center rounded-full border font-mono text-[9.5px] transition-colors duration-300 ${
                            isRead ? "border-[#8fffc1]/30 bg-[#8fffc1]/10" : "border-white/12 text-white/35 group-hover:border-[rgb(var(--accent)/0.6)] group-hover:text-white"
                          }`}
                        >
                          {isRead ? <ReadTick className="h-2.5 w-2.5" /> : flat.indexOf(page) + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={`block font-display text-[15px] font-medium transition-colors ${isRead ? "text-white/60" : "text-white"} group-hover:text-white`}>
                            {page.title}
                            {page.badge && (
                              <span className="ml-2 rounded border border-[rgb(var(--accent)/0.25)] px-1.5 py-px align-middle text-[11px] font-medium text-accent">
                                {page.badge}
                              </span>
                            )}
                          </span>
                          {page.description && <span className="mt-1 block text-[13.5px] leading-relaxed text-white/40">{page.description}</span>}
                        </span>
                        <svg className="mt-1.5 h-3.5 w-3.5 shrink-0 -translate-x-1 text-white/0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-white/70" viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </m.section>
          );
        })}
      </div>
    </div>
  );
}
