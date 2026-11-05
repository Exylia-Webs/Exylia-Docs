import type { Metadata } from "next";
import { ActionForm, NumberInput, SettingRow, SettingsSection, Switch } from "@exylia-webs/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { adminText } from "@/lib/admin-i18n";
import { platform } from "@/lib/platform";
import { turnstileKeys } from "@/lib/platform-settings";
import { saveAi } from "../actions";

export async function generateMetadata(): Promise<Metadata> {
  const { a } = await adminText();
  return { title: `${a.settings.meta} · ${a.settings.answers.title}` };
}

/** Platform settings › Answers: how each call is made, how much every visitor together may spend a month, and Turnstile. */
export default async function AnswersSettingsPage() {
  const [, { a }, { ai }] = await Promise.all([requireAdmin(), adminText(), platform()]);
  const t = a.settings;
  // The keys stay in the environment: without both, the switch has nothing to run.
  const keys = turnstileKeys(process.env).keys !== null;
  return (
    <ActionForm action={saveAi} saveBar>
      <input type="hidden" name="section" value="answers" />
      <SettingsSection id="answers" title={t.answers.title} description={t.answers.hint}>
        <SettingRow label={t.answers.maxTokens} tip={t.answers.maxTokensHint}>
          <NumberInput name="maxTokens" aria-label={t.answers.maxTokens} defaultValue={ai.maxTokens} min={64} max={64000} unit={t.answers.tokens} required />
        </SettingRow>
        <SettingRow label={t.answers.timeout} tip={t.answers.timeoutHint}>
          <NumberInput name="timeoutSeconds" aria-label={t.answers.timeout} defaultValue={ai.timeoutSeconds} min={1} max={600} unit="s" required />
        </SettingRow>
        <SettingRow label={t.answers.monthlyTokens} tip={t.answers.monthlyTokensHint}>
          <NumberInput name="monthlyTokens" aria-label={t.answers.monthlyTokens} defaultValue={ai.monthlyTokens} min={0} unit={t.answers.tokens} required />
        </SettingRow>
        <SettingRow label={t.answers.turnstile} tip={t.answers.turnstileHint} description={keys ? undefined : t.answers.turnstileNoKeys}>
          <Switch variant="bare" name="turnstile" label={t.answers.turnstile} defaultChecked={ai.turnstile} disabled={!keys} />
        </SettingRow>
      </SettingsSection>
    </ActionForm>
  );
}
