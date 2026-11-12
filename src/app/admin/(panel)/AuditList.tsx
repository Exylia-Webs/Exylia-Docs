import { AuditTable, PAGE_SIZE } from "@exylia-webs/ui/admin";
import { adminText } from "@/lib/admin-i18n";
import { prisma } from "@/lib/db";

/** The admin log, newest first, 50 a page. */
export async function AuditList({ page, href }: { page: number; href: (page: number) => string }) {
  const [{ a }, total, rows] = await Promise.all([
    adminText(),
    prisma.adminAuditEvent.count(),
    prisma.adminAuditEvent.findMany({ orderBy: [{ createdAt: "desc" }, { id: "desc" }], skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
  ]);
  const actions: Record<string, string> = a.auditList.actions;
  const targets: Record<string, string> = a.auditList.targets;
  return (
    <AuditTable
      actorHref="none"
      actionLabel={(action) => actions[action] ?? action}
      paging={{ page, total, href }}
      events={rows.map((e) => ({
        id: e.id,
        createdAt: e.createdAt,
        action: e.action,
        targetType: e.targetType,
        targetId: e.targetId,
        targetLabel: targets[e.targetLabel] ?? e.targetLabel,
        reason: null,
        meta: e.meta,
        actor: { id: e.actorId, username: e.actorName },
      }))}
    />
  );
}
