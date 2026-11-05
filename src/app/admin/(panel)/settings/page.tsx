import type { Metadata } from "next";
import { ActionForm, Checkbox, ChoiceCards, ProviderProfiles, SettingRow, SettingsSection, StatusBadge, Switch, TextInput } from "@exylia-webs/ui";
import { fill } from "@/content/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { adminText } from "@/lib/admin-i18n";
import { platform } from "@/lib/platform";
import { AI_PROVIDERS, profileView } from "@/lib/platform-settings";
import { saveAi, testAi } from "./actions";
import { aiStatus, DEFAULT_URL, PROVIDER_ICON, TestButton, tone } from "./parts";

export async function generateMetadata(): Promise<Metadata> {
  const { a } = await adminText();
  return { title: a.settings.meta };
}

/** Platform settings › AI provider: the model behind the docs assistant, and its connection. */
export default async function AiProviderSettingsPage() {
  const [, { a }, { ai }] = await Promise.all([requireAdmin(), adminText(), platform()]);
  const t = a.settings;
  const status = aiStatus(ai);
  return (
    <ActionForm action={saveAi} saveBar>
      <input type="hidden" name="section" value="ai" />
      <ProviderProfiles fields={["model", "apiKey", "baseUrl"]} profiles={profileView(ai.profiles)} />
      <SettingsSection
        id="ai"
        title={t.ai.title}
        description={t.ai.hint}
        tip={t.ai.enabledHint}
        action={
          <>
            <StatusBadge tone={tone(status)}>{fill(t.ai.status[status], { model: `${ai.provider}:${ai.model}` })}</StatusBadge>
            <Switch variant="bare" name="enabled" label={t.ai.enabled} defaultChecked={ai.enabled} />
          </>
        }
        footer={<TestButton action={testAi} label={t.ai.test.button} hint={t.ai.test.hint} />}
      >
        <SettingRow label={t.ai.provider} tip={t.ai.providerHint} stack>
          <ChoiceCards name="provider" label={t.ai.provider} columns={4} defaultValue={ai.provider} options={AI_PROVIDERS.map((value) => ({ value, title: t.ai.providers[value], icon: PROVIDER_ICON[value] }))} />
        </SettingRow>
        <SettingRow label={t.ai.model} tip={t.ai.modelHint}>
          <TextInput name="model" defaultValue={ai.model} maxLength={200} aria-label={t.ai.model} placeholder="gpt-4.1-mini · qwen2.5:14b" mono className="sm:w-80" />
        </SettingRow>
        <SettingRow
          label={t.ai.apiKey}
          tip={t.ai.apiKeyHint}
          description={
            <span data-key-saved hidden={!ai.apiKey}>
              {t.ai.apiKeySaved}
            </span>
          }
        >
          <span className="block space-y-2 sm:w-80">
            <TextInput name="apiKey" type="password" autoComplete="off" aria-label={t.ai.apiKey} placeholder={ai.apiKey ? "••••••••••••" : "sk-…"} data-empty-placeholder="sk-…" mono />
            <label data-key-saved hidden={!ai.apiKey} className="flex w-fit cursor-pointer items-center gap-2 text-ui-sm text-ink-3">
              <Checkbox name="clearKey" />
              {t.ai.clearKey}
            </label>
          </span>
        </SettingRow>
        <SettingRow label={t.ai.baseUrl} tip={fill(t.ai.baseUrlHint, { defaults: Object.entries(DEFAULT_URL).map(([key, url]) => `${key}: ${url}`).join(" · ") })}>
          <TextInput name="baseUrl" type="url" defaultValue={ai.baseUrl} aria-label={t.ai.baseUrl} placeholder={t.ai.baseUrlPlaceholder} mono className="sm:w-80" />
        </SettingRow>
      </SettingsSection>
    </ActionForm>
  );
}
