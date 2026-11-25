import type { Metadata } from "next";
import { AiProviderSettings } from "@exylia-webs/ui/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { adminText } from "@/lib/admin-i18n";
import { platform } from "@/lib/platform";
import { AI_PROVIDERS, profileView } from "@/lib/platform-settings";
import { saveAi, testAi } from "./actions";

export async function generateMetadata(): Promise<Metadata> {
  const { a } = await adminText();
  return { title: a.settings.meta };
}

/** The providers' own endpoints, used when the base URL is empty (the assistant core's defaults). */
const DEFAULT_URL = { openai: "https://api.openai.com/v1", ollama: "http://localhost:11434/v1", openrouter: "https://openrouter.ai/api/v1", anthropic: "https://api.anthropic.com/v1" };

/** Platform settings › AI provider: the model behind the docs assistant, and its connection. */
export default async function AiProviderSettingsPage() {
  const [, { a }, { ai }] = await Promise.all([requireAdmin(), adminText(), platform()]);
  return <AiProviderSettings action={saveAi} test={testAi} hidden={{ section: "ai" }} ai={ai} providers={AI_PROVIDERS} defaultUrls={DEFAULT_URL} profiles={profileView(ai.profiles)} baseUrlPlaceholder={a.settings.ai.baseUrlPlaceholder} />;
}
