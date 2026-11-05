"use client";

/**
 * The docs assistant: the design system's AssistantPanel (the same launcher and sheet as every
 * Exylia app), read-only, with the docs' copy. The turn runs on `/api/assistant/` (`runAssistant` +
 * `assistantStream` from @exylia-webs/ui/assistant) behind a Turnstile check.
 *
 * The public docs are Tailwind 3 and do not load the design system's stylesheet, so the panel
 * brings its own (`./assistant.css`, Tailwind 4, scoped to `.exy-ds` by scripts/postcss-tailwind.cjs)
 * and its sheet portals into that element. next-intl is given only here, with the `ui` strings.
 */
import { AssistantPanel, type AssistantBody } from "@exylia-webs/ui/assistant/panel";
import { uiMessages } from "@exylia-webs/ui/messages";
import { NextIntlClientProvider } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { dict } from "@/content/dictionary";
import type { Lang } from "@/content/registry";
import "./assistant.css";

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
 * wait for its current token. It lives in the open panel: `box` is its element's ref, and a closed
 * panel drops the widget with it. Off when the site has no key.
 */
function useTurnstile(siteKey: string | null) {
  const [element, box] = useState<HTMLDivElement | null>(null);
  const token = useRef<string | null>(null);
  const widget = useRef<string | null>(null);
  const waiters = useRef<((value: string | null) => void)[]>([]);

  const settle = useCallback((value: string | null) => {
    token.current = value;
    for (const wake of waiters.current.splice(0)) wake(value);
  }, []);

  useEffect(() => {
    if (!siteKey || !element) return;
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !window.turnstile) return;
        widget.current = window.turnstile.render(element, {
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
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
      token.current = null;
    };
  }, [siteKey, element, settle]);

  /** The current token, waiting for one up to 30 s; `fresh` throws the used one away first. */
  const get = useCallback(
    async (fresh = false): Promise<string | null> => {
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
    },
    [siteKey],
  );

  return { box, get };
}

const COPY = ["open", "title", "newChat", "messages", "placeholder", "send", "hint", "emptyTitle", "empty", "suggestions", "you", "thinking", "retry", "failed"] as const;

/** A refused turn as the stream the panel reads: one error event, shown with a Retry. */
const refusal = (message: string) => new Response(`${JSON.stringify({ type: "error", message })}\n`, { headers: { "content-type": "application/x-ndjson" } });

export default function DocsAssistant({ lang, plugin, pluginName, turnstileSiteKey }: { lang: Lang; plugin?: string; pluginName?: string; turnstileSiteKey: string | null }) {
  const t = dict.assistant;
  const [scope, setScope] = useState<HTMLDivElement | null>(null);
  const turnstile = useTurnstile(turnstileSiteKey);

  const messages = useMemo(() => {
    const ui = uiMessages[lang] ?? uiMessages.en!;
    return { ui: { ...ui, assistant: { ...ui.assistant, ...Object.fromEntries(COPY.map((key) => [key, t[key][lang]])) } } };
  }, [lang, t]);

  const request = async (body: AssistantBody) => {
    const send = async (token: string | null) =>
      fetch(`/api/assistant/?${new URLSearchParams({ lang, ...(plugin ? { plugin } : {}) })}`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json", ...(token ? { "x-turnstile-token": token } : {}) },
        body: JSON.stringify({ history: body.history, message: body.message }),
      });
    let response = await send(await turnstile.get());
    // The pass expired, or the token was already spent: one fresh challenge, then give up.
    if (response.status === 403 && turnstileSiteKey && (await response.clone().json().catch(() => null))?.error === "challenge") response = await send(await turnstile.get(true));
    if (response.ok) return response;
    const code = ((await response.json().catch(() => null)) as { error?: string } | null)?.error;
    return refusal(code === "rate" ? t.rate[lang] : code === "quota" ? t.quota[lang] : code === "challenge" ? t.challenge[lang] : t.failed[lang]);
  };

  const suggestions = pluginName ? t.forPlugin[lang].map((s) => s.replace("{plugin}", pluginName)) : [...t.general[lang]];

  return (
    <div ref={setScope} className="exy-ds dark contents">
      <NextIntlClientProvider locale={lang} messages={messages} timeZone="UTC">
        <AssistantPanel endpoint="/api/assistant/" request={request} storageKey={`exylia-docs-assistant:${lang}`} suggestions={suggestions} container={scope}>
          {/* Turnstile draws here only when Cloudflare needs the visitor to click. */}
          <div ref={turnstile.box} />
        </AssistantPanel>
      </NextIntlClientProvider>
    </div>
  );
}
