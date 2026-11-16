"use client";

import { m, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import type { Heading } from "@/lib/docs";
import { dict } from "@/content/dictionary";
import type { Lang } from "@/content/registry";

/**
 * The right rail: section links with the current one tracked on scroll, a
 * rail that fills as the article is read, and the minutes left to the end.
 */
export function Toc({ headings, minutes, lang }: { headings: Heading[]; minutes: number; lang: Lang }) {
  const [active, setActive] = useState<string>("");
  const [left, setLeft] = useState(minutes);
  const progress = useMotionValue(0);
  const fill = useSpring(progress, { stiffness: 220, damping: 34, restDelta: 0.001 });

  // How far through the article the reader is: 0 at its top, 1 when its end reaches the bottom of the screen.
  useEffect(() => {
    const article = document.querySelector<HTMLElement>("article[data-doc]");
    if (!article) return;
    const update = () => {
      const b = article.getBoundingClientRect();
      const v = Math.min(1, Math.max(0, (140 - b.top) / Math.max(1, b.height - innerHeight + 140)));
      progress.set(v);
      setLeft(Math.ceil(minutes * (1 - v)));
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, [minutes, progress]);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -68% 0px", threshold: [0, 1] },
    );
    headings
      .map((h) => document.getElementById(h.id))
      .filter((n): n is HTMLElement => n !== null)
      .forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;
  const t = dict.docs;

  return (
    <aside className="sticky top-[124px] hidden max-h-[calc(100vh-9.75rem)] w-[220px] shrink-0 overflow-y-auto scroll-thin pb-16 xl:block 2xl:w-[260px]">
      <p className="eyebrow mb-4">{t.onThisPage[lang]}</p>
      <div className="relative">
        <span className="absolute bottom-0 left-0 top-0 w-px bg-white/[0.07]" />
        <m.span
          style={{ scaleY: fill }}
          className="absolute bottom-0 left-0 top-0 w-px origin-top bg-[rgb(var(--accent))]"
        />
        <ul className="flex flex-col">
          {headings.map((h) => {
            const isActive = active === h.id;
            return (
              <li key={h.id} className="relative">
                {isActive && (
                  <m.span
                    layoutId="toc-active"
                    className="absolute -left-[2.5px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[rgb(var(--accent))] shadow-[0_0_10px_2px_rgb(var(--accent)/0.6)]"
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                <a
                  href={`#${h.id}`}
                  className={`block py-[5px] pr-2 text-[12.5px] leading-snug transition-colors duration-200 ${
                    h.level === 3 ? "pl-7" : "pl-4"
                  } ${isActive ? "text-white" : "text-white/35 hover:text-white/70"}`}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4 text-[12.5px] text-white/30">
        <span>{left > 0 ? t.minutesLeft[lang].replace("{n}", String(left)) : t.done[lang]}</span>
        <a href="#top" onClick={(e) => (e.preventDefault(), scrollTo({ top: 0, behavior: "smooth" }))} className="transition-colors hover:text-white">
          {t.toTop[lang]} ↑
        </a>
      </div>
    </aside>
  );
}
