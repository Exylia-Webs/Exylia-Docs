import { monthOf } from "@/lib/assistant/guard";
import { prisma } from "@/lib/db";

export type MonthTotals = { tokens: bigint; calls: number; quotaHits: number };

/** This month's row (the cap's), zeros before its first call. */
export async function monthTotals(month = monthOf()): Promise<MonthTotals> {
  const row = await prisma.assistantUsage.findUnique({ where: { month }, select: { tokens: true, calls: true, quotaHits: true } });
  return row ?? { tokens: 0n, calls: 0, quotaHits: 0 };
}

export type DayRow = { day: Date; tokens: bigint; calls: number; quotaHits: number; sofar: bigint };

/**
 * Each day of `month` that saw a call, newest first, with the month's running total up to it,
 * summed in SQL. `imported` is what the month's row holds beyond its days (the count imported from
 * the old JSON file), and starts the running total.
 */
export async function dayRows(month = monthOf()): Promise<{ days: DayRow[]; imported: bigint }> {
  const start = `${month}-01`;
  const [days, [carried]] = await Promise.all([
    prisma.$queryRaw<DayRow[]>`SELECT "day", "tokens", "calls", "quotaHits", SUM("tokens") OVER (ORDER BY "day")::bigint AS "sofar"
      FROM "AssistantUsageDay" WHERE "day" >= ${start}::date AND "day" < (${start}::date + INTERVAL '1 month') ORDER BY "day" DESC`,
    prisma.$queryRaw<{ imported: bigint }[]>`SELECT GREATEST(COALESCE((SELECT "tokens" FROM "AssistantUsage" WHERE "month" = ${month}), 0)
      - COALESCE((SELECT SUM("tokens") FROM "AssistantUsageDay" WHERE "day" >= ${start}::date AND "day" < (${start}::date + INTERVAL '1 month')), 0), 0)::bigint AS "imported"`,
  ]);
  const imported = carried?.imported ?? 0n;
  return { days: days.map((row) => ({ ...row, sofar: row.sofar + imported })), imported };
}
