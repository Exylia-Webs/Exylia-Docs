"use client";

import { useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { promptText, type PromptId } from "@/content/aiPrompts";
import { dict } from "@/content/dictionary";
import type { Lang } from "@/content/registry";

function Sparkle({ className, d }: { className: string; d: string }) {
  return <path className={className} d={d} fill="currentColor" />;
}

/**
 * The block that hands a server owner the whole prompt for one plugin.
 *
 * The owner writes only the idea; everything around it — the step language,
 * the limits, the shipped examples — is one literal from `aiPrompts.ts`, so
 * what reaches the clipboard is byte for byte what the compiler documents.
 */
export function AiPrompt({ id, lang = "en" }: { id: PromptId; lang?: Lang }) {
  const [idea, setIdea] = useState("");
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLTextAreaElement>(null);

  const ready = idea.trim().length > 0;
  const text = promptText(id, idea);
  const lines = text.split("\n").length;
  const locale = lang === "es" ? "es-ES" : "en-GB";

  async function copy() {
    if (!ready) {
      box.current?.focus();
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  }

  return (
    <m.div
      initial={false}
      animate={{
        borderColor: ready ? "rgb(var(--accent) / 0.5)" : "rgb(var(--accent) / 0.22)",
      }}
      transition={{ duration: 0.4 }}
      className="not-prose relative my-8 overflow-hidden rounded-2xl border bg-[linear-gradient(160deg,rgba(124,92,255,0.10),rgba(124,92,255,0.02)_55%,transparent)]"
    >
      <AnimatePresence>
        {ready && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(var(--accent)),transparent)]"
          />
        )}
      </AnimatePresence>

      <div className="p-6">
        <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[rgb(var(--accent))]">
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
            <Sparkle
              className="animate-pulse [animation-duration:3.2s]"
              d="M9.4 1.6l.85 2.3 2.3.85-2.3.85-.85 2.3-.85-2.3-2.3-.85 2.3-.85.85-2.3z"
            />
            <Sparkle
              className="opacity-70 animate-pulse [animation-duration:2.4s] [animation-delay:.5s]"
              d="M4.3 8.2l.55 1.5 1.5.55-1.5.55-.55 1.5-.55-1.5-1.5-.55 1.5-.55.55-1.5z"
            />
            <Sparkle
              className="opacity-45 animate-pulse [animation-duration:2.8s] [animation-delay:1.1s]"
              d="M11.6 10.4l.4 1.1 1.1.4-1.1.4-.4 1.1-.4-1.1-1.1-.4 1.1-.4.4-1.1z"
            />
          </svg>
          {dict.ai.kicker[lang]}
        </span>
        <h3 className="mt-2 font-display text-[19px] font-medium tracking-tightish text-white">
          {dict.ai.title[lang]}
        </h3>
        <p className="mt-1.5 max-w-xl text-[14px] leading-relaxed text-white/45">
          {dict.ai.lead[lang]}
        </p>

        <textarea
          ref={box}
          value={idea}
          onChange={(e) => {
            setIdea(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          rows={3}
          spellCheck={false}
          placeholder={dict.ai.placeholder[lang]}
          className="mt-5 block max-h-64 w-full resize-none rounded-xl border border-white/10 bg-ink-950/50 px-4 py-3.5 text-[14px] leading-relaxed text-white/85 outline-none transition-all duration-300 placeholder:text-white/22 focus:border-[rgb(var(--accent))]/55 focus:bg-ink-950/70 focus:shadow-[0_0_0_4px_rgba(124,92,255,0.10)]"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={ready ? "ready" : "hint"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-2 font-mono text-[11px] ${
                ready ? "text-[rgb(var(--accent))]" : "text-white/30"
              }`}
            >
              <m.span
                animate={ready ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`h-1.5 w-1.5 rounded-full ${ready ? "bg-[rgb(var(--accent))]" : "bg-white/20"}`}
              />
              {ready
                ? `${dict.ai.ready[lang]} · ${lines.toLocaleString(locale)} ${dict.ai.lines[lang]}`
                : dict.ai.hint[lang]}
            </m.span>
          </AnimatePresence>

          <m.button
            onClick={copy}
            whileTap={{ scale: 0.97 }}
            animate={{ opacity: ready ? 1 : 0.45 }}
            className="group relative inline-flex shrink-0 items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-[rgb(var(--accent))]/40 bg-[rgb(var(--accent))]/12 px-5 py-3 font-display text-[14.5px] font-medium text-white transition-colors duration-300 hover:border-[rgb(var(--accent))]/70 hover:bg-[rgb(var(--accent))]/20"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <m.span
                  key="ok"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-2.5"
                >
                  <svg className="h-4 w-4 text-[rgb(var(--accent))]" viewBox="0 0 16 16" fill="none">
                    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {dict.ai.copied[lang]}
                </m.span>
              ) : (
                <m.span
                  key="copy"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-2.5"
                >
                  <svg className="h-4 w-4 text-white/60" viewBox="0 0 16 16" fill="none">
                    <rect x="5.5" y="5.5" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M10.5 3.6A1.6 1.6 0 009 2.5H4.6A2.1 2.1 0 002.5 4.6V9c0 .7.45 1.3 1.1 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  {dict.ai.copy[lang]}
                </m.span>
              )}
            </AnimatePresence>
          </m.button>
        </div>
      </div>

      <div className="flex items-center justify-end border-t border-[rgb(var(--accent))]/15 px-6 py-3">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/35 transition-colors duration-300 hover:text-white"
        >
          {open ? dict.ai.hide[lang] : dict.ai.show[lang]}
          <svg
            className={`h-3 w-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            viewBox="0 0 16 16"
            fill="none"
          >
            <path d="M4 6.5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-[rgb(var(--accent))]/15"
          >
            <pre className="max-h-[26rem] overflow-auto bg-ink-950/60 px-6 py-5 font-mono text-[12px] leading-relaxed text-white/45">
              {text}
            </pre>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}
