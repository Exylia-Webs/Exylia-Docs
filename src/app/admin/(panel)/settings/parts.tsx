import { ActionButton, ICONS, InfoTip } from "@exylia-webs/ui";
import type { AiSettings } from "@/lib/platform-settings";

/** Each provider's card icon, as on Tickets' AI provider page. */
export const PROVIDER_ICON = { openai: ICONS.sparkle, ollama: ICONS.servers, openrouter: ICONS.globe, anthropic: ICONS.brain } as const;

/** The providers' own endpoints, used when the base URL is empty (the assistant core's defaults). */
export const DEFAULT_URL = { openai: "https://api.openai.com/v1", ollama: "http://localhost:11434/v1", openrouter: "https://openrouter.ai/api/v1", anthropic: "https://api.anthropic.com/v1" } as const;

export const aiStatus = (ai: AiSettings) => (!ai.enabled ? "off" : !ai.model ? "incomplete" : "on");

/** The status badge's tone for a section switched on, half set up, or off. */
export const tone = (status: string) => (status === "on" ? "success" : status === "incomplete" ? "warning" : "neutral");

/** A section's connection test, with what it checks. */
export function TestButton({ action, label, hint }: { action: Parameters<typeof ActionButton>[0]["action"]; label: string; hint: string }) {
  return (
    <span className="flex flex-wrap items-center gap-2">
      <ActionButton action={action}>{label}</ActionButton>
      <InfoTip>{hint}</InfoTip>
    </span>
  );
}
