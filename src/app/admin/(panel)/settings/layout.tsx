import type { ReactNode } from "react";
import { getFormatter } from "next-intl/server";
import { ICONS, SettingsShell, StatusBadge } from "@exylia-webs/ui";
import { fill } from "@/content/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { adminText } from "@/lib/admin-i18n";
import { platformState } from "@/lib/platform";
import { aiStatus, tone } from "./parts";

/**
 * Platform settings, stored in the database (lib/platform.ts): changes apply within seconds, with
 * no environment edit and no restart. The hero, then the page list beside (or above, on a phone) the open page.
 */
export default async function PlatformSettingsLayout({ children }: { children: ReactNode }) {
  const [, { a }, format, state] = await Promise.all([requireAdmin(), adminText(), getFormatter(), platformState()]);
  const t = a.settings;
  const base = "/admin/settings/";
  const { ai } = state.settings;
  const status = aiStatus(ai);
  return (
    <SettingsShell
      hero={{
        icon: ICONS.settings,
        title: t.title,
        status: <StatusBadge tone="neutral">{t.eyebrow}</StatusBadge>,
        facts: [
          { label: t.ai.title, value: <StatusBadge tone={tone(status)}>{fill(t.ai.status[status], { model: `${ai.provider}:${ai.model}` })}</StatusBadge> },
          {
            label: t.lastChanged,
            value: state.updatedAt ? fill(t.lastChangedValue, { ago: format.relativeTime(state.updatedAt, new Date()), name: state.updatedByName ?? t.unknownEditor }) : t.neverChanged,
          },
        ],
        children: t.description,
      }}
      groups={[
        {
          title: t.nav.ai,
          items: [
            { href: base, exact: true, label: t.ai.title, icon: ICONS.ai },
            { href: `${base}answers/`, label: t.answers.title, icon: ICONS.sliders },
          ],
        },
      ]}
      label={t.title}
      storageKey="docs:admin-settings-nav"
    >
      {children}
    </SettingsShell>
  );
}
