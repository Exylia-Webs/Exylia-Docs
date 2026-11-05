import type { Metadata } from "next";
import Link from "next/link";
import { getFormatter } from "next-intl/server";
import { Fact, FactGrid, Glyph, ICONS, PageHeader, Panel, Section, StatusBadge } from "@exylia-webs/ui";
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
export default async function AdminOverview() {
  const month = monthOf();
  const [, { a }, format, { ai }, totals] = await Promise.all([requireAdmin(), adminText(), getFormatter(), platform(), monthTotals(month)]);
  const t = a.overview;
  const n = (value: bigint | number) => format.number(Number(value));
  const status = aiStatus(ai);
  const alerts = [
    { show: status === "on" && Number(totals.tokens) >= ai.monthlyTokens, label: t.alerts.spent, href: "/admin/settings/answers/" },
    { show: totals.quotaHits > 0, label: fill(t.alerts.quota, { count: n(totals.quotaHits) }), href: "/admin/usage/" },
    { show: status !== "on", label: status === "off" ? t.alerts.aiOff : t.alerts.aiIncomplete, href: "/admin/settings/" },
  ].filter((alert) => alert.show);
  return (
    <>
      <PageHeader
        kicker={a.eyebrow}
        title={t.title}
        description={fill(t.description, { month })}
        status={<StatusBadge tone={tone(status)}>{fill(a.settings.ai.status[status], { model: `${ai.provider}:${ai.model}` })}</StatusBadge>}
      />
      <FactGrid cols={4} className="panel px-[18px] py-4">
        <Fact size="lg" label={t.calls} value={n(totals.calls)} />
        <Fact size="lg" label={t.tokens} value={n(totals.tokens)} />
        <Fact size="lg" label={t.hits} value={n(totals.quotaHits)} />
        <Fact size="lg" label={t.cap} value={n(ai.monthlyTokens)} />
      </FactGrid>
      <Section title={t.alerts.title} className="mt-8">
        {alerts.length === 0 ? (
          <p className="flex items-center gap-2 text-ui-base text-ink-3">
            <Glyph d={ICONS.check} className="h-4 w-4 text-ok" />
            {t.alerts.none}
          </p>
        ) : (
          <Panel className="px-[18px]">
            <ul className="divide-y divide-line">
              {alerts.map((alert) => (
                <li key={alert.href}>
                  <Link href={alert.href} className="focus-ring flex min-h-12 items-center justify-between gap-3 px-3 py-3 text-ui-base transition-colors hover:bg-card-2">
                    <span className="min-w-0 text-ink">{alert.label}</span>
                    <Glyph d={ICONS.chevronRight} className="h-4 w-4 text-ink-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </Section>
    </>
  );
}
