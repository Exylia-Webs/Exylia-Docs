"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { useState } from "react";
import { dict } from "@/content/dictionary";
import type { Lang } from "@/content/registry";

const EASE = [0.16, 1, 0.3, 1] as const;

export function DocHeader({
  lang,
  plugin,
  group,
  title,
  description,
  badge,
  minutes,
  index,
  total,
  markdown,
}: {
  lang: Lang;
  plugin: { id: string; name: string };
  group: string;
  title: string;
  description?: string;
  badge?: string;
  minutes: number;
  index: number;
  total: number;
  markdown: string;
}) {
  const t = dict.docs;
  return (
    <header className="pb-10">
      <m.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[12.5px]"
      >
        <Link href={`/${lang}/docs/${plugin.id}`} className="text-white/40 transition-colors hover:text-white">
          {plugin.name}
        </Link>
        <span className="text-white/15">/</span>
        <span className="text-[rgb(var(--accent))]">{group}</span>
        {badge && (
          <span className="rounded-full border border-[rgb(var(--accent)/0.25)] px-2 py-0.5 text-[9.5px] tracking-[0.14em] text-accent">
            {badge}
          </span>
        )}
      </m.div>

      <m.h1
        initial={false}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.75, delay: 0.06, ease: EASE }}
        className="mt-5 font-display text-[clamp(2rem,4.4vw,2.9rem)] font-medium leading-[1.05] tracking-tight2 text-white"
      >
        {title}
      </m.h1>

      {description && (
        <m.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
          className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/45"
        >
          {description}
        </m.p>
      )}

      <m.div
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.24 }}
        className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-[12.5px] text-white/35"
      >
        <span className="flex items-center gap-2">
          <span className="relative h-1 w-16 overflow-hidden rounded-full bg-white/[0.08]">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[rgb(var(--accent))] to-white"
              style={{ width: `${(index / total) * 100}%` }}
            />
          </span>
          {t.pageOf[lang].replace("{i}", String(index)).replace("{n}", String(total))}
        </span>
        <span>{t.readTime[lang].replace("{n}", String(minutes))}</span>
        <CopyPage markdown={markdown} lang={lang} />
      </m.div>

      <m.span
        initial={false}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, delay: 0.22, ease: EASE }}
        className="mt-7 block h-px w-full origin-left bg-gradient-to-r from-[rgb(var(--accent)/0.5)] via-white/[0.08] to-transparent"
      />
    </header>
  );
}

/** The whole page as Markdown, ready to paste into an AI. */
function CopyPage({ markdown, lang }: { markdown: string; lang: Lang }) {
  const [copied, setCopied] = useState(false);
  const t = dict.docs;
  return (
    <button
      type="button"
      title={t.copyPageHint[lang]}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(markdown);
        } catch {
          return;
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className={`ml-auto inline-flex h-7 items-center gap-1.5 rounded-full border px-3 transition-colors ${
        copied ? "border-[#8fffc1]/30 text-[#8fffc1]" : "border-white/10 text-white/45 hover:border-white/25 hover:text-white"
      }`}
    >
      <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" aria-hidden>
        {copied ? (
          <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <>
            <rect x="5.5" y="5.5" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10.5 3.6A1.6 1.6 0 009 2.5H4.6A2.1 2.1 0 002.5 4.6V9c0 .7.45 1.3 1.1 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </>
        )}
      </svg>
      {copied ? t.copied[lang] : t.copyPage[lang]}
    </button>
  );
}

/** Fades the compiled MDX in once, without touching its layout. */
export function ArticleFade({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
    >
      {children}
    </m.div>
  );
}
