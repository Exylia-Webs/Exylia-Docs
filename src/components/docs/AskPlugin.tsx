"use client";

import { m } from "framer-motion";
import { useState } from "react";
import { askAssistant, useAssistantStatus } from "@/components/assistant/AssistantLauncher";
import { dict } from "@/content/dictionary";
import type { Lang } from "@/content/registry";

/**
 * The first question on a plugin's cover: what the reader came for, in their words. It opens the
 * docs assistant (already scoped to this plugin) with the question asked. Hidden when the
 * assistant is off.
 */
export function AskPlugin({ name, lang }: { name: string; lang: Lang }) {
  const on = useAssistantStatus()?.enabled;
  const [text, setText] = useState("");
  if (!on) return null;
  const t = dict.assistant;
  const send = (message: string) => {
    if (!message.trim()) return;
    askAssistant(message.trim());
    setText("");
  };

  return (
    <m.section
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="relative mt-10 overflow-hidden rounded-2xl border border-accent/30 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--accent)_14%,transparent),color-mix(in_oklab,var(--accent)_2%,transparent)_60%)] p-5 sm:p-6"
    >
      <span className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgba(170,118,222,0.3),transparent)] blur-2xl" />
      <h2 className="relative font-display text-[clamp(1.2rem,2.4vw,1.5rem)] font-medium tracking-tight text-ink">
        {t.askTitle[lang].replace("{plugin}", name)}
      </h2>
      <p className="relative mt-1.5 max-w-xl text-ui-sm leading-relaxed text-ink-3">{t.askLead[lang]}</p>

      <form
        onSubmit={(e) => (e.preventDefault(), send(text))}
        className="relative mt-5 flex h-12 items-center gap-2 rounded-full border border-line bg-canvas/70 pl-5 pr-1.5 transition-colors focus-within:border-accent/60"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.askPlaceholder[lang]}
          aria-label={t.askTitle[lang].replace("{plugin}", name)}
          className="min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-ink-3 focus:outline-none sm:text-ui-base"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-ink px-4 text-ui-sm font-medium text-canvas transition-opacity disabled:opacity-40"
        >
          {t.askSend[lang]}
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>

      <div className="relative mt-3 flex flex-wrap gap-2">
        {t.forPlugin[lang].map((s) => {
          const q = s.replace("{plugin}", name);
          return (
            <button
              key={q}
              type="button"
              onClick={() => send(q)}
              className="rounded-full border border-line px-3 py-1.5 text-ui-sm text-ink-3 transition-colors hover:border-line-2 hover:text-ink"
            >
              {q}
            </button>
          );
        })}
      </div>
    </m.section>
  );
}
