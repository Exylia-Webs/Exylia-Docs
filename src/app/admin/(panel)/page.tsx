import type { Metadata } from "next";
import { getFormatter } from "next-intl/server";
import { StatusBadge } from "@exylia-webs/ui";
import { AdminOverview } from "@exylia-webs/ui/admin";
import { fill } from "@/content/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { adminText } from "@/lib/admin-i18n";
import { monthOf } from "@/lib/assistant/guard";
import { platform } from "@/lib/platform";
import { aiStatus, tone } from "./settings/parts";
import { monthTotals } from "./usage-rows";

export async function generateMetadata(): Promise<Metadata> {
  const { a } = await adminText();
  return { title: a.overview.meta };
}

/** The assistant this month at a glance, and what needs a look. */
export default async function AdminOverviewPage() {
  const month = monthOf();
  const [, { a }, format, { ai }, totals] = await Promise.all([requireAdmin(), adminText(), getFormatter(), platform(), monthTotals(month)]);
  const t = a.overview;
  const n = (value: bigint | number) => format.number(Number(value));
  const status = aiStatus(ai);
  const alerts = [
    { count: status === "on" && Number(totals.tokens) >= ai.monthlyTokens ? 1 : 0, label: t.alerts.spent, href: "/admin/settings/answers/" },
    { count: totals.quotaHits, label: t.alerts.quota, href: "/admin/usage/" },
    { count: status !== "on" ? 1 : 0, label: status === "off" ? t.alerts.aiOff : t.alerts.aiIncomplete, href: "/admin/settings/" },
  ];
  return (
    <AdminOverview
      title={t.title}
      description={
        <span className="flex flex-wrap items-center gap-2">
          {fill(t.description, { month })}
          <StatusBadge tone={tone(status)}>{fill(a.settings.ai.status[status], { model: `${ai.provider}:${ai.model}` })}</StatusBadge>
        </span>
      }
      facts={[
        { label: t.calls, value: n(totals.calls) },
        { label: t.tokens, value: n(totals.tokens) },
        { label: t.hits, value: n(totals.quotaHits) },
        { label: t.cap, value: n(ai.monthlyTokens) },
      ]}
      alerts={alerts}
    />
  );
}
