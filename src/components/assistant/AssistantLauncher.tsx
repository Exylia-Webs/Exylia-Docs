"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Lang } from "@/content/registry";

/** The panel's code only downloads once the server says the assistant is on. */
const DocsAssistant = dynamic(() => import("./DocsAssistant"), { ssr: false, loading: () => null });

type Status = { enabled: true; turnstileSiteKey: string | null };

/** One status request per page load, shared by every mount (a plugin change remounts the layout). */
let status: Promise<Status | null> | undefined;

function loadStatus(): Promise<Status | null> {
  status ??= fetch("/api/assistant/", { cache: "no-store" })
    .then((response) => (response.ok ? (response.json() as Promise<Status>) : null))
    .catch(() => null);
  return status;
}

/** The server's assistant status, null while unknown or when it is off. */
export function useAssistantStatus(): Status | null {
  const [state, setState] = useState<Status | null>(null);
  useEffect(() => {
    let live = true;
    void loadStatus().then((value) => live && setState(value));
    return () => {
      live = false;
    };
  }, []);
  return state;
}

/** Opens the assistant panel with this question already asked (the panel listens for it). */
export const askAssistant = (message: string) => window.dispatchEvent(new CustomEvent("exylia-assistant:ask", { detail: { message } }));

/**
 * Mounts the docs assistant when the server has it on. The pages stay static and never know: a
 * site without `AI_MODEL` answers this status with 404 and nothing is drawn.
 */
export function AssistantLauncher({ lang, plugin, pluginName }: { lang: Lang; plugin?: string; pluginName?: string }) {
  const state = useAssistantStatus();
  if (!state?.enabled) return null;
  return <DocsAssistant lang={lang} plugin={plugin} pluginName={pluginName} turnstileSiteKey={state.turnstileSiteKey} />;
}
