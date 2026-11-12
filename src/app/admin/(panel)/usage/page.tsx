import type { Metadata } from "next";
import { getFormatter } from "next-intl/server";
import { ICONS } from "@exylia-webs/ui";
import { AdminHeader, AdminTable, LimitBar } from "@exylia-webs/ui/admin";
import { fill } from "@/content/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { adminText } from "@/lib/admin-i18n";
import { monthOf } from "@/lib/assistant/guard";
import { platform } from "@/lib/platform";
import { dayRows } from "../usage-rows";

export async function generateMetadata(): Promise<Metadata> {
  const { a } = await adminText();
  return { title: a.usage.meta };
}

/** The assistant's use each day this month (at most 31 rows, so no pages), against the monthly cap. */
export default async function AdminUsage() {
  const month = monthOf();
  const [, { a }, format, { ai }, { days, imported }] = await Promise.all([requireAdmin(), adminText(), getFormatter(), platform(), dayRows(month)]);
  const t = a.usage;
  const n = (value: bigint | number) => format.number(Number(value));
  const cap = ai.monthlyTokens;
  return (
    <>
      <AdminHeader title={t.title} description={fill(t.description, { month })} />
      <AdminTable
        empty={{ icon: ICONS.ai, title: t.emptyTitle, description: t.emptyDescription }}
        columns={[
          { key: "day", header: t.day, mobile: "title", className: "whitespace-nowrap" },
          { key: "tokens", header: t.tokens, className: "tabular" },
          { key: "sofar", header: t.sofar },
          { key: "calls", header: t.calls, className: "tabular" },
          { key: "hits", header: t.hits, className: "tabular" },
        ]}
        rows={days.map((row) => {
          const sofar = Number(row.sofar);
          return {
            id: row.day.toISOString(),
            cells: {
              day: format.dateTime(row.day, { day: "numeric", month: "short", weekday: "short" }),
              tokens: n(row.tokens),
              sofar: <LimitBar value={sofar} limit={cap} />,
              calls: n(row.calls),
              hits: row.quotaHits ? <span className="text-warn">{n(row.quotaHits)}</span> : n(0),
            },
          };
        })}
      />
      {imported > 0n ? <p className="mt-3 text-ui-sm text-ink-4">{fill(t.imported, { tokens: n(imported) })}</p> : null}
    </>
  );
}
