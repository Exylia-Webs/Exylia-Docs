"use client";

import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, m } from "framer-motion";
import { PreBoundary } from "./CopyableCode";
import { dict } from "@/content/dictionary";
import type { Lang } from "@/content/registry";

/**
 * The `<pre>` every fenced code block renders into.
 *
 * Client-side only for the copy button: the highlighting itself is done at
 * build time by rehype-pretty-code, so nothing here re-renders the code.
 */
export function CodeBlock({
  children,
  lang = "en",
  ...props
}: {
  children?: ReactNode;
  lang?: Lang;
}) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = ref.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="group/code relative">
      <pre ref={ref} {...props}>
        <PreBoundary value={true}>{children}</PreBoundary>
      </pre>

      <button
        onClick={copy}
        aria-label={dict.docs.copy[lang]}
        className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-ink-900/80 text-white/40 opacity-0 backdrop-blur transition-all duration-300 hover:border-white/25 hover:text-white group-hover/code:opacity-100"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <m.svg
              key="ok"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="h-3.5 w-3.5 text-accent"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </m.svg>
          ) : (
            <m.svg
              key="copy"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="h-3.5 w-3.5"
              viewBox="0 0 16 16"
              fill="none"
            >
              <rect x="5.5" y="5.5" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10.5 3.6A1.6 1.6 0 009 2.5H4.6A2.1 2.1 0 002.5 4.6V9c0 .7.45 1.3 1.1 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </m.svg>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
