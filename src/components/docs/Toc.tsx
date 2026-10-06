"use client";

import { m } from "framer-motion";
import { useEffect, useState } from "react";
import type { Heading } from "@/lib/docs";
import { dict } from "@/content/dictionary";
import type { Lang } from "@/content/registry";

/** The right rail: section links, with the current one tracked on scroll. */
export function Toc({ headings, lang }: { headings: Heading[]; lang: Lang }) {
  const [active, setActive] = useState<string>("");

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

    const nodes = headings
      .map((h) => document.getElementById(h.id))
      .filter((n): n is HTMLElement => n !== null);
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="sticky top-[124px] hidden max-h-[calc(100vh-9.75rem)] w-[220px] shrink-0 overflow-y-auto scroll-thin pb-16 xl:block">
      <p className="eyebrow mb-4">{dict.docs.onThisPage[lang]}</p>
      <ul className="flex flex-col border-l hair">
        {headings.map((h) => {
          const isActive = active === h.id;
          return (
            <li key={h.id} className="relative">
              {isActive && (
                <m.span
                  layoutId="toc-active"
                  className="absolute -left-px top-0 h-full w-px bg-[rgb(var(--accent))]"
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <a
                href={`#${h.id}`}
                className={`block py-[5px] pr-2 text-[12.5px] leading-snug transition-colors duration-200 ${
                  h.level === 3 ? "pl-7" : "pl-3"
                } ${isActive ? "text-white" : "text-white/35 hover:text-white/70"}`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
