"use client";

/**
 * The docs assistant: a round launcher at the bottom right and a chat panel above it. The turn runs
 * on `/api/assistant/` (`runAssistant` + `assistantStream` from @exylia-webs/ui/assistant) and is
 * read here as it streams, so each search shows up live. Read-only: there is nothing to approve.
 *
 * Not the design system's `AssistantPanel`: that sheet is drawn with the app frame's Tailwind 4
 * tokens and next-intl, neither of which this site loads, and its copy is about proposing changes.
 * The protocol, history and Markdown renderer are the shared ones.
 */
import { Markdown } from "@exylia-webs/ui";
import { type AssistantEvent, type AssistantMessage, readAssistantEvents } from "@exylia-webs/ui/assistant";
import { useRouter } from "next/navigation";
import { type FormEvent, type KeyboardEvent, type MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { dict } from "@/content/dictionary";
import type { Lang } from "@/content/registry";

type Body = { history: AssistantMessage[]; message?: string };
type Live = Extract<AssistantEvent, { type: "step" | "text" }>;
type Failure = { message: string; retry: Body | null };
type Shown = Exclude<AssistantMessage, { role: "tool" }>;

declare global {
  interface Window {
    turnstile?: {
      render(element: HTMLElement, options: Record<string, unknown>): string;
      reset(id: string): void;
      remove(id: string): void;
    };
  }
}

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let turnstileScript: Promise<void> | undefined;

function loadTurnstile(): Promise<void> {
  turnstileScript ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      turnstileScript = undefined;
      reject(new Error("turnstile"));
    };
    document.head.appendChild(script);
  });
  return turnstileScript;
}

/**
 * An invisible Turnstile widget (it only shows when Cloudflare wants an interaction) and a way to
 * wait for its current token. Off when the site has no key.
 */
function useTurnstile(siteKey: string | null, active: boolean) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const token = useRef<string | null>(null);
  const waiters = useRef<((value: string | null) => void)[]>([]);

  const settle = (value: string | null) => {
    token.current = value;
    for (const wake of waiters.current.splice(0)) wake(value);
  };

  useEffect(() => {
    if (!siteKey || !active || widget.current) return;
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !box.current || !window.turnstile) return;
        widget.current = window.turnstile.render(box.current, {
          sitekey: siteKey,
          appearance: "interaction-only",
          callback: (value: string) => settle(value),
          "expired-callback": () => (token.current = null),
          "error-callback": () => settle(null),
        });
      })
      .catch(() => settle(null));
    return () => {
      cancelled = true;
    };
  }, [siteKey, active]);

  useEffect(
    () => () => {
      if (widget.current) window.turnstile?.remove(widget.current);
    },
    [],
  );

  /** The current token, waiting for one up to 30 s; `fresh` throws the used one away first. */
  const get = useCallback(async (fresh = false): Promise<string | null> => {
    if (!siteKey) return null;
    if (fresh) {
      token.current = null;
      if (widget.current) window.turnstile?.reset(widget.current);
    }
    if (token.current) return token.current;
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(null), 30_000);
      waiters.current.push((value) => {
        clearTimeout(timer);
        resolve(value);
      });
    });
  }, [siteKey]);

  return { box, get };
}

const Sparkle = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d="M10 2.5l1.6 4.4a2 2 0 001.2 1.2l4.4 1.6-4.4 1.6a2 2 0 00-1.2 1.2L10 17.5l-1.6-4.4a2 2 0 00-1.2-1.2L2.8 10.3l4.4-1.6a2 2 0 001.2-1.2L10 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export default function DocsAssistant({ lang, plugin, pluginName, turnstileSiteKey }: { lang: Lang; plugin?: string; pluginName?: string; turnstileSiteKey: string | null }) {
  const t = dict.assistant;
  const router = useRouter();
  const storageKey = `exylia-docs-assistant:${lang}`;
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<AssistantMessage[]>([]);
  const [busy, setBusy] = useState<"send" | "verify" | null>(null);
  const [live, setLive] = useState<Live[]>([]);
  const [outgoing, setOutgoing] = useState<string | null>(null);
  const [failure, setFailure] = useState<Failure | null>(null);
  const [draft, setDraft] = useState("");
  const composer = useRef<HTMLTextAreaElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);
  const turnstile = useTurnstile(turnstileSiteKey, open);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? "null") as { history?: AssistantMessage[] } | null;
      if (Array.isArray(saved?.history)) setHistory(saved.history);
    } catch {
      // A corrupt entry starts a new conversation.
    }
    loaded.current = true;
  }, [storageKey]);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      if (history.length) sessionStorage.setItem(storageKey, JSON.stringify({ history }));
      else sessionStorage.removeItem(storageKey);
    } catch {
      // Storage full or disabled: the conversation just does not survive a reload.
    }
  }, [storageKey, history]);

  useEffect(() => {
    if (open) composer.current?.focus();
  }, [open]);

  useEffect(() => {
    const element = scroller.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [history, live, outgoing, busy, failure, open]);

  const close = () => {
    setOpen(false);
    launcher.current?.focus();
  };

  const post = async (body: Body, token: string | null) =>
    fetch(`/api/assistant/?${new URLSearchParams({ lang, ...(plugin ? { plugin } : {}) })}`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json", ...(token ? { "x-turnstile-token": token } : {}) },
      body: JSON.stringify(body),
    });

  const exchange = async (body: Body) => {
    setBusy(turnstileSiteKey ? "verify" : "send");
    setFailure(null);
    setLive([]);
    let done: AssistantMessage[] | null = null;
    let error: string | null = null;
    try {
      let response = await post(body, await turnstile.get());
      // The pass expired, or the token was already spent: one fresh challenge, then give up.
      if (response.status === 403 && turnstileSiteKey && (await response.clone().json().catch(() => null))?.error === "challenge") {
        setBusy("verify");
        response = await post(body, await turnstile.get(true));
      }
      setBusy("send");
      if (!response.ok) {
        const code = ((await response.json().catch(() => null)) as { error?: string } | null)?.error;
        error = code === "rate" ? t.rate[lang] : code === "quota" ? t.quota[lang] : code === "challenge" ? t.challenge[lang] : t.failed[lang];
      } else {
        for await (const event of readAssistantEvents(response)) {
          if (event.type === "step" || event.type === "text") setLive((list) => [...list, event]);
          else if (event.type === "error") error = event.message;
          else if (event.type === "done") done = event.history;
        }
      }
    } catch {
      error ??= t.failed[lang];
    }
    if (done) {
      setHistory(done);
      setOutgoing(null);
    }
    if (error || !done) setFailure({ message: error ?? t.failed[lang], retry: done ? { history: done } : body });
    setLive([]);
    setBusy(null);
  };

  const ask = (text: string) => {
    const message = text.trim();
    if (!message || busy) return;
    setDraft("");
    setOutgoing(message);
    void exchange({ history, message });
  };

  const reset = () => {
    setHistory([]);
    setFailure(null);
    setOutgoing(null);
    composer.current?.focus();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    ask(draft);
  };
  const onKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    ask(draft);
  };

  /** Links to this site's pages navigate in place, so the conversation stays open beside them. */
  const onLink = (event: MouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as HTMLElement).closest("a");
    const href = anchor?.getAttribute("href");
    if (!href?.startsWith("/") || href.startsWith("//") || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    router.push(href);
    // On a phone the panel covers the page the link opens.
    if (window.matchMedia("(max-width: 639px)").matches) setOpen(false);
  };

  const shown = history.filter((message): message is Shown => message.role !== "tool" && message.text.trim() !== "");
  const empty = !shown.length && !outgoing && !busy;
  const suggestions = pluginName ? t.forPlugin[lang].map((s) => s.replace("{plugin}", pluginName)) : t.general[lang];

  return (
    <>
      <button
        ref={launcher}
        type="button"
        aria-label={t.open[lang]}
        aria-expanded={open}
        aria-controls="docs-assistant"
        onClick={() => (open ? close() : setOpen(true))}
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-[55] flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-exy-violet text-white shadow-lg shadow-black/50 transition-transform duration-150 hover:bg-exy-indigo focus:outline-none focus-visible:ring-2 focus-visible:ring-exy-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 active:scale-95"
      >
        <Sparkle className="h-5 w-5" />
        {busy && !open ? <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-white" aria-hidden /> : null}
      </button>

      {open ? (
        <section
          id="docs-assistant"
          role="dialog"
          aria-label={t.title[lang]}
          onKeyDown={(event) => event.key === "Escape" && close()}
          className="assistant-in fixed inset-x-0 bottom-0 z-[56] flex h-[85dvh] flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-ink-900/95 shadow-2xl shadow-black/60 backdrop-blur-2xl sm:inset-x-auto sm:bottom-[5.25rem] sm:right-5 sm:h-[min(640px,calc(100dvh-8rem))] sm:w-[400px] sm:rounded-2xl"
        >
          <header className="flex items-center gap-2.5 border-b border-white/[0.07] px-4 py-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-exy-violet/15 text-exy-glow">
              <Sparkle className="h-4 w-4" />
            </span>
            <h2 className="min-w-0 flex-1 truncate font-display text-[15px] font-medium text-white">{t.title[lang]}</h2>
            {shown.length || outgoing ? (
              <button type="button" onClick={reset} disabled={busy !== null} className="rounded-md px-2 py-1 text-[12.5px] text-white/50 transition-colors hover:bg-white/[0.05] hover:text-white disabled:opacity-40">
                {t.newChat[lang]}
              </button>
            ) : null}
            <button type="button" onClick={close} aria-label={t.close[lang]} className="rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white">
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div ref={scroller} role="log" aria-label={t.messages[lang]} onClick={onLink} className="scroll-thin min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-4">
              {empty ? (
                <div className="flex flex-col gap-3 py-4">
                  <p className="font-display text-[17px] font-medium text-white">{t.emptyTitle[lang]}</p>
                  <p className="text-[13.5px] leading-relaxed text-white/50">{t.empty[lang]}</p>
                  <ul className="mt-1 flex flex-col gap-1.5" aria-label={t.suggestions[lang]}>
                    {suggestions.map((suggestion) => (
                      <li key={suggestion}>
                        <button
                          type="button"
                          onClick={() => ask(suggestion)}
                          className="w-full rounded-lg border border-white/[0.08] px-3 py-2 text-left text-[13.5px] text-white/65 transition-colors hover:border-exy-violet/40 hover:bg-exy-violet/[0.08] hover:text-white"
                        >
                          {suggestion}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {shown.map((message, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: messages have no id; the list only grows at its end.
                <Bubble key={index} message={message} you={t.you[lang]} assistant={t.title[lang]} />
              ))}
              {outgoing ? <Bubble message={{ role: "user", text: outgoing }} you={t.you[lang]} assistant={t.title[lang]} /> : null}
              {live.map((event, index) =>
                event.type === "text" ? (
                  // biome-ignore lint/suspicious/noArrayIndexKey: live events only grow at their end.
                  <Bubble key={index} message={{ role: "assistant", text: event.text, calls: [] }} you={t.you[lang]} assistant={t.title[lang]} />
                ) : (
                  // biome-ignore lint/suspicious/noArrayIndexKey: live events only grow at their end.
                  <p key={index} className="flex items-center gap-2 text-[12.5px] text-white/40">
                    <svg className="h-3.5 w-3.5 text-emerald-400/80" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {event.label ?? event.name}
                  </p>
                ),
              )}
              <div aria-live="polite" className="contents">
                {busy ? (
                  <p className="flex items-center gap-2 text-[13px] text-white/45">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-white/15 border-t-exy-glow" aria-hidden />
                    {busy === "verify" ? t.verifying[lang] : t.thinking[lang]}
                  </p>
                ) : null}
                {failure ? (
                  <div role="alert" className="flex flex-wrap items-center gap-2 rounded-lg border border-red-400/25 bg-red-500/[0.08] px-3 py-2 text-[13px] text-red-200">
                    <span className="min-w-0 flex-1">{failure.message}</span>
                    {failure.retry ? (
                      <button type="button" onClick={() => failure.retry && void exchange(failure.retry)} className="rounded-md border border-red-300/30 px-2 py-0.5 text-[12px] hover:bg-red-400/10">
                        {t.retry[lang]}
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
              {/* Turnstile draws here only when Cloudflare needs the visitor to click. */}
              <div ref={turnstile.box} />
            </div>
          </div>

          <form onSubmit={submit} className="border-t border-white/[0.07] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={composer}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={onKey}
                rows={1}
                maxLength={4000}
                disabled={busy !== null}
                placeholder={t.placeholder[lang]}
                aria-label={t.placeholder[lang]}
                className="max-h-36 min-h-[40px] min-w-0 flex-1 resize-none rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-base text-white [field-sizing:content] placeholder:text-white/30 focus:border-exy-violet/50 focus:outline-none disabled:opacity-60 sm:text-[14px]"
              />
              <button
                type="submit"
                aria-label={t.send[lang]}
                disabled={busy !== null || !draft.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-exy-violet text-white transition-colors hover:bg-exy-indigo focus:outline-none focus-visible:ring-2 focus-visible:ring-exy-glow disabled:opacity-40"
              >
                {busy === "send" ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M2.5 8h10M8.5 3.5L13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-1.5 px-1 text-[11.5px] leading-snug text-white/30">{t.hint[lang]}</p>
          </form>
        </section>
      ) : null}
    </>
  );
}

function Bubble({ message, you, assistant }: { message: Shown; you: string; assistant: string }) {
  if (message.role === "user") {
    return (
      <div className="ml-auto max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-exy-violet/[0.16] px-3.5 py-2 text-[14px] text-white">
        <span className="sr-only">{you}: </span>
        {message.text}
      </div>
    );
  }
  return (
    <div className="assistant-md min-w-0">
      <span className="sr-only">{assistant}: </span>
      <Markdown source={message.text} />
    </div>
  );
}
