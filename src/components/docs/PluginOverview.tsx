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

  const facts = [
    { label: f.version[lang], value: `v${plugin.version}` },
    { label: f.minecraft[lang], value: plugin.minecraft },
    { label: f.category[lang], value: plugin.category[lang] },
    { label: f.pages[lang], value: String(pageCount) },
  ];

  return (
    <div className="pb-6">
      <header className="pb-12">
        <m.div
          initial={{ opacity: 0, scale: 1.01 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative mb-10"
        >
          {/* The banner's own light, spilling under it. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={plugin.banner}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-x-[6%] -bottom-10 top-8 h-[calc(100%-2rem+2.5rem)] w-[88%] object-cover opacity-50 blur-[60px] saturate-150"
          />
          <PluginBanner
            plugin={plugin}
            priority
            rounded="rounded-xl"
            className="relative aspect-[2/1] w-full shadow-[0_40px_120px_-50px_rgba(0,0,0,0.9)] sm:aspect-[3/1]"
          />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex items-center gap-3"
        >
          <span className="h-px w-6 bg-[rgb(var(--accent))]/50" />
          <span className="eyebrow">{dict.docs.documentation[lang]}</span>
        </m.div>

        <m.h1
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.06, ease: EASE }}
          className="mt-5 font-display text-[clamp(2.3rem,5.4vw,3.6rem)] font-medium leading-[1.02] tracking-tight2 text-white"
        >
          {plugin.name}
        </m.h1>

        <m.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
          className="mt-4 max-w-2xl text-[16.5px] leading-relaxed text-white/50"
        >
          {plugin.summary[lang]}
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.26, ease: EASE }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <Link
              href={resume ? `/${lang}/docs/${resume.plugin}/${resume.slug}` : firstHref}
              className="group inline-flex h-11 max-w-[80vw] items-center gap-2.5 rounded-full bg-white px-5 text-[14px] font-medium text-ink-950 transition-colors hover:bg-[#f1efff]"
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 flex items-center gap-3 font-mono text-[11px] tracking-wide text-white/35"
        >
          <span className="relative h-1 w-32 overflow-hidden rounded-full bg-white/[0.08]">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#8a51c4] to-[#8fffc1] transition-[width] duration-700"
              style={{ width: `${(done / pageCount) * 100}%` }}
            />
          </span>
          {done === pageCount
            ? dict.docs.allRead[lang]
            : (done > 0 ? dict.docs.progress : dict.docs.progressNone)[lang].replace("{n}", String(done)).replace("{total}", String(pageCount))}
        </m.div>

        <AskPlugin name={plugin.name} lang={lang} />

        <m.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.34 }}
          className="mt-10 grid grid-cols-2 gap-px border-l border-t hair sm:grid-cols-4"
        >
          {facts.map((fact) => (
            <div key={fact.label} className="border-b border-r hair px-4 py-3.5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/28">
                {fact.label}
              </dt>
              <dd className="mt-1.5 font-display text-[15px] font-medium text-white">{fact.value}</dd>
            </div>
          ))}
        </m.dl>
      </header>

      {quick.length > 0 && (
        <section className="mb-16">
          <p className="eyebrow">{dict.docs.quick[lang]}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {quick.map((page) => (
              <Link
                key={page.slug}
                href={`/${lang}/docs/${page.plugin}/${page.slug}`}
                className="group inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 text-[13.5px] text-white/70 transition-all duration-300 hover:border-[#aa76de]/50 hover:bg-[#8a51c4]/10 hover:text-white"
              >
                {page.title}
                <svg className="h-3 w-3 text-white/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#e7cfff]" viewBox="0 0 16 16" fill="none" aria-hidden>
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6% 0px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="grid gap-4 border-t border-white/[0.07] py-10 md:grid-cols-[200px_1fr] md:gap-10"
            >
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/30">
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
                            isRead ? "border-[#8fffc1]/30 bg-[#8fffc1]/10" : "border-white/12 text-white/35 group-hover:border-[#aa76de]/60 group-hover:text-white"
                          }`}
                        >
                          {isRead ? <ReadTick className="h-2.5 w-2.5" /> : flat.indexOf(page) + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={`block font-display text-[15px] font-medium transition-colors ${isRead ? "text-white/60" : "text-white"} group-hover:text-white`}>
                            {page.title}
                            {page.badge && (
                              <span className="ml-2 rounded border border-[rgb(var(--accent))]/25 px-1.5 py-px align-middle font-mono text-[9px] uppercase tracking-[0.12em] text-accent">
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
