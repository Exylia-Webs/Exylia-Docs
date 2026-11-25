import type { Metadata } from "next";
import { AdminHeader, AuditList, pageHref, parsePage } from "@exylia-webs/ui/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { adminText } from "@/lib/admin-i18n";
import { prisma } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  const { a } = await adminText();
  return { title: a.audit.meta };
}

/** Every change made from this panel, newest first. */
export default async function AdminAudit({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const [, { a }, params] = await Promise.all([requireAdmin(), adminText(), searchParams]);
  const targets: Record<string, string> = a.auditList.targets;
  return (
    <>
      <AdminHeader title={a.audit.title} description={a.audit.description} />
      <AuditList
        actorHref="none"
        page={parsePage(params.page)}
        href={(n) => pageHref("/admin/audit/", {}, n)}
        query={async ({ skip, take }) => {
          const [total, rows] = await Promise.all([prisma.adminAuditEvent.count(), prisma.adminAuditEvent.findMany({ orderBy: [{ createdAt: "desc" }, { id: "desc" }], skip, take })]);
          return {
            total,
            target: (e) => targets[e.targetLabel],
            events: rows.map((e) => ({ id: e.id, createdAt: e.createdAt, action: e.action, targetType: e.targetType, targetId: e.targetId, targetLabel: e.targetLabel, reason: null, meta: e.meta, actor: { id: e.actorId, username: e.actorName } })),
          };
        }}
      />
    </>
  );
}
