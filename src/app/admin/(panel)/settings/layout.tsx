import type { ReactNode } from "react";
import { ICONS } from "@exylia-webs/ui";
import { aiStatus, PlatformSettingsShell, SettingsStatus } from "@exylia-webs/ui/admin";
import { fill } from "@/content/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { adminText } from "@/lib/admin-i18n";
import { platformState } from "@/lib/platform";

/**
 * Platform settings, stored in the database (lib/platform.ts): changes apply within seconds, with
 * no environment edit and no restart. The hero, then the page list beside (or above, on a phone) the open page.
 */
export default async function PlatformSettingsLayout({ children }: { children: ReactNode }) {
  const [, { a }, state] = await Promise.all([requireAdmin(), adminText(), platformState()]);
  const t = a.settings;
  const base = "/admin/settings/";
  const { ai } = state.settings;
  const status = aiStatus(ai);
  return (
    <PlatformSettingsShell
      groups={[
        {
          title: t.nav.ai,
          items: [
            { href: base, exact: true, label: t.ai.title, icon: ICONS.ai },
            { href: `${base}answers/`, label: t.answers.title, icon: ICONS.sliders },
          ],
        },
      ]}
      facts={[{ label: t.ai.title, value: <SettingsStatus status={status}>{fill(t.ai.status[status], { model: `${ai.provider}:${ai.model}` })}</SettingsStatus> }]}
      updatedAt={state.updatedAt}
      editor={state.updatedByName}
      storageKey="docs:admin-settings-nav"
    >
      {children}
    </PlatformSettingsShell>
  );
}
