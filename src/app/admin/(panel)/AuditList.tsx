import { getTranslations } from "next-intl/server";
import { Collapsible, Glyph, ICONS } from "@exylia-webs/ui";
import { AdminTable, Ago, auditIcon, PAGE_SIZE, PersonCell } from "@exylia-webs/ui/admin";
import { adminText } from "@/lib/admin-i18n";
import { prisma } from "@/lib/db";

/** The admin log, newest first, 50 a page. */
export async function AuditList({ page, href }: { page: number; href: (page: number) => string }) {
  const [{ a }, u, total, events] = await Promise.all([
    adminText(),
    getTranslations("ui.admin.audit"),
    prisma.adminAuditEvent.count(),
    prisma.adminAuditEvent.findMany({ orderBy: [{ createdAt: "desc" }, { id: "desc" }], skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
  ]);
  const actions: Record<string, string> = a.auditList.actions;
  const targets: Record<string, string> = a.auditList.targets;
  return (
    <AdminTable
      empty={{ icon: ICONS.audit, title: u("emptyTitle"), description: u("emptyDescription") }}
      paging={{ page, total, href }}
      columns={[
        { key: "when", header: u("when"), className: "whitespace-nowrap" },
        { key: "actor", header: u("actor") },
        { key: "action", header: u("action"), mobile: "title" },
        { key: "target", header: u("target") },
        { key: "details", header: u("details") },
      ]}
      rows={events.map((event) => {
        const icon = auditIcon(event.action);
        return {
          id: event.id,
          cells: {
            when: <Ago date={event.createdAt} never="" />,
            actor: <PersonCell account={{ id: event.actorId, username: event.actorName }} href={null} />,
            action: (
              <span className="flex items-center gap-2">
                <Glyph d={icon.d} className={`h-4 w-4 shrink-0 ${icon.tone}`} />
                {actions[event.action] ?? event.action}
              </span>
            ),
            target: targets[event.targetLabel] ?? event.targetLabel,
            details: event.meta ? (
              <span className="block min-w-0 max-w-md">
                <Collapsible title={<span className="text-ui-sm text-ink-3">{u("meta")}</span>}>
                  <pre className="max-h-60 overflow-auto rounded-lg bg-well p-2 font-mono text-ui-xs whitespace-pre-wrap [overflow-wrap:anywhere] text-ink-3">{JSON.stringify(event.meta, null, 2)}</pre>
                </Collapsible>
              </span>
            ) : null,
          },
        };
      })}
    />
  );
}
