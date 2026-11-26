"use client";

import Link from "next/link";
import { m } from "motion/react"; // domain animation (layoutId indicators, springs) the library helpers do not express; shares ThemeProvider's LazyMotion
import type { NavSection } from "@/lib/docs";
import type { Lang, Plugin } from "@/content/registry";
import { dict } from "@/content/dictionary";
import { PluginBanner } from "@/components/PluginBanner";
import { SITE } from "@/content/registry";
import { ReadTick, useReadPages } from "./Reading";
import { AskPlugin } from "./AskPlugin";
import { useLayoutEffect } from "react";
import { LandingHead, LandingBento, LandingTile, landingButtonClass } from "@exylia-webs/ui/site";
import "./overview.css";
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
  const steps = sections[0]?.pages.slice(0, 3) ?? [];

  const facts = [
    { label: f.version[lang], value: `v${plugin.version}` },
    { label: f.minecraft[lang], value: plugin.minecraft },
    { label: f.category[lang], value: plugin.category[lang] },
  ];

  const href = (page: { plugin: string; slug: string }) => `/${lang}/docs/${page.plugin}/${page.slug}`;
  const arrow = (
    <svg className="dp-arrow" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="ex-land dp-ov pb-6">
      <header className="dp-hero">
        {/* Ambient light: the banner itself, blurred, glowing out from behind it. */}
        <div className="relative mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={plugin.banner} alt="" aria-hidden className="ambient pointer-events-none absolute inset-0 -z-[1] h-full w-full object-cover" />
          <div style={{ viewTransitionName: BANNER_MORPH }}>
            <PluginBanner
              plugin={plugin}
              priority
              rounded="rounded-xl"
              className="relative aspect-[2/1] w-full shadow-[0_40px_120px_-50px_rgba(0,0,0,0.9)] sm:aspect-[3/1]"
            />
          </div>
        </div>

        <h1 className="disp dp-title">{plugin.name}</h1>
        <p className="muted dp-lead">{plugin.summary[lang]}</p>

        <div className="dp-actions">
          <Link href={resume ? href(resume) : firstHref} className={landingButtonClass("accent", "lg", "dp-start")}>
            <span className="truncate">{resume && done > 0 ? dict.docs.continue[lang].replace("{title}", resume.title) : dict.docs.start[lang]}</span>
            {arrow}
          </Link>
          {(plugin.purchase ?? plugin.download) && (
            <a href={plugin.purchase ?? plugin.download} target="_blank" rel="noopener noreferrer" className={landingButtonClass("paper", "lg")}>
              {(plugin.purchase ? dict.docs.buy : dict.docs.download)[lang]}
              <span aria-hidden>↗</span>
            </a>
          )}
          <a href={SITE.discord} target="_blank" rel="noopener noreferrer" className={landingButtonClass("ghost", "lg")}>
            {dict.docs.support[lang]}
            <span aria-hidden>↗</span>
          </a>
        </div>

        <div className="dp-progress muted">
          <span className="dp-bar">
            <span style={{ width: `${(done / pageCount) * 100}%` }} />
          </span>
          {done === pageCount
            ? dict.docs.allRead[lang]
            : (done > 0 ? dict.docs.progress : dict.docs.progressNone)[lang].replace("{n}", String(done)).replace("{total}", String(pageCount))}
        </div>

        <AskPlugin name={plugin.name} lang={lang} />

        <dl className="dp-facts">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="k muted">{fact.label}</dt>
              <dd className="disp">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {steps.length === 3 && (
        <section className="dp-sec">
          <LandingHead title={dict.docs.stepsTitle[lang].replace(/\*/g, "")} lead={dict.docs.stepsLead[lang]} />
          <LandingBento>
            {steps.map((page, i) => (
              <LandingTile key={page.slug} index={i} span={4} spanMid={4} hue={i === 2 ? "ink" : "paper"} kicker={String(i + 1).padStart(2, "0")} title={page.title}>
                {page.description && <p className="muted">{page.description}</p>}
                <Link href={href(page)} className="dp-cover" aria-label={page.title} />
              </LandingTile>
            ))}
          </LandingBento>
        </section>
      )}

      {flat.some((p) => p.fresh) && (
        <section className="dp-sec">
          <div className="tile h-sunk dp-fresh">
            <p className="k">{dict.docs.news[lang].replace("{v}", plugin.version)}</p>
            <ul>
              {flat
                .filter((p) => p.fresh)
                .map((page) => (
                  <li key={page.slug}>
                    <Link href={href(page)} className="dp-fresh-row">
                      <b>{page.title}</b>
                      <span>{page.description}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      )}

      {quick.length > 0 && (
        <section className="dp-sec">
          <p className="k muted">{dict.docs.quick[lang]}</p>
          <div className="dp-chips">
            {quick.map((page) => (
              <Link key={page.slug} href={href(page)} className={landingButtonClass("paper", "sm")}>
                {page.title}
                {arrow}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="dp-chapters">
        {sections.map((section, si) => {
          const finished = section.pages.every((p) => read.includes(p.id));
          return (
            <section key={section.label} className="tile h-paper dp-chap">
              <div>
                <p className="k l-kick">
                  {dict.docs.chapter[lang]} {String(si + 1).padStart(2, "0")}
                </p>
                <h2 className="disp dp-chap-title">
                  {section.label}
                  {finished && read.length > 0 && <ReadTick className="h-4 w-4" />}
                </h2>
              </div>

              <ol className="l-list">
                {section.pages.map((page) => {
                  const isRead = read.includes(page.id);
                  return (
                    <li key={page.slug}>
                      <Link href={href(page)} className="l-li dp-row" data-read={isRead ? "" : undefined}>
                        <span className="dp-n num">{isRead ? <ReadTick className="h-3 w-3" /> : flat.indexOf(page) + 1}</span>
                        <span className="dp-row-main">
                          <b>
                            {page.title}
                            {page.badge && <span className="tag">{page.badge}</span>}
                          </b>
                          {page.description && <span className="muted">{page.description}</span>}
                        </span>
                        {arrow}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
