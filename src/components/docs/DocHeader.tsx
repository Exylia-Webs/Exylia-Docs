"use client";

import { m } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export function DocHeader({
  group,
  title,
  description,
  badge,
}: {
  group: string;
  title: string;
  description?: string;
  badge?: string;
}) {
  return (
    <header className="pb-10">
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex items-center gap-3"
      >
        <span className="h-px w-6 bg-[rgb(var(--accent))]/50" />
        <span className="eyebrow">{group}</span>
        {badge && (
          <span className="rounded-full border border-[rgb(var(--accent))]/25 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-accent">
            {badge}
          </span>
        )}
      </m.div>

      <m.h1
        initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.75, delay: 0.06, ease: EASE }}
        className="mt-5 font-display text-[clamp(2rem,4.4vw,2.9rem)] font-medium leading-[1.05] tracking-tight2 text-white"
      >
        {title}
      </m.h1>

      {description && (
        <m.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
          className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/45"
        >
          {description}
        </m.p>
      )}

      <m.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, delay: 0.22, ease: EASE }}
        className="mt-9 block h-px w-full origin-left bg-white/[0.08]"
      />
    </header>
  );
}

/** Fades the compiled MDX in once, without touching its layout. */
export function ArticleFade({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
    >
      {children}
    </m.div>
  );
}
