"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { NavSection } from "@/lib/docs";
import type { Lang, Plugin } from "@/content/registry";
import { dict } from "@/content/dictionary";
import { Magnetic } from "@/components/motion/Primitives";
import { PluginBanner } from "@/components/PluginBanner";
import { SITE } from "@/content/registry";

const EASE = [0.16, 1, 0.3, 1] as const;

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
  const pageCount = sections.reduce((n, s) => n + s.pages.length, 0);
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
        <motion.div
          initial={{ opacity: 0, scale: 1.01 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-10"
        >
          <PluginBanner
            plugin={plugin}
            priority
            rounded="rounded-xl"
            className="aspect-[2/1] w-full sm:aspect-[3/1]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex items-center gap-3"
        >
          <span className="h-px w-6 bg-[rgb(var(--accent))]/50" />
          <span className="eyebrow">{dict.docs.documentation[lang]}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.06, ease: EASE }}
          className="mt-5 font-display text-[clamp(2.3rem,5.4vw,3.6rem)] font-medium leading-[1.02] tracking-tight2 text-white"
        >
          {plugin.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
          className="mt-4 max-w-2xl text-[16.5px] leading-relaxed text-white/50"
        >
          {plugin.summary[lang]}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.26, ease: EASE }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <Link
              href={firstHref}
              className="group inline-flex h-11 items-center gap-2.5 rounded-full bg-white px-5 text-[14px] font-medium text-ink-950 transition-colors hover:bg-[#f1efff]"
            >
              {dict.docs.start[lang]}
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
        </motion.div>

        <motion.dl
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
        </motion.dl>
      </header>

      <div className="flex flex-col gap-12">
        {sections.map((section, si) => (
          <motion.section
            key={section.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-6% 0px" }}
            transition={{ duration: 0.6, delay: si * 0.04, ease: EASE }}
          >
            <div className="flex items-center gap-4">
              <span className="eyebrow">{section.label}</span>
              <span className="h-px flex-1 bg-white/[0.07]" />
              <span className="font-mono text-[10.5px] text-white/22">
                {String(section.pages.length).padStart(2, "0")}
              </span>
            </div>

            <div className="mt-5 grid gap-px border-l border-t hair sm:grid-cols-2">
              {section.pages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/${lang}/docs/${page.plugin}/${page.slug}`}
                  className="group relative border-b border-r hair px-5 py-4 transition-colors duration-300 hover:bg-white/[0.02]"
                >
                  <span className="pointer-events-none absolute right-0 top-0 h-0 w-0 border-r-2 border-t-2 border-[rgb(var(--accent))]/0 transition-all duration-300 group-hover:h-4 group-hover:w-4 group-hover:border-[rgb(var(--accent))]/50" />
                  <span className="flex items-center gap-2 py-1 font-display text-[14.5px] font-medium text-white">
                    {page.title}
                    <svg className="h-3 w-3 text-white/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {page.description && (
                    <span className="mt-1 block text-[13px] leading-relaxed text-white/40">
                      {page.description}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
