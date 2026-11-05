import { Collapsible, EmptyState, Glyph, ICONS, Pager, Panel, ServerTable } from "@exylia-webs/ui";
import { adminText } from "@/lib/admin-i18n";
import { prisma } from "@/lib/db";
import { Ago, PersonCell } from "./cells";
import { PAGE_SIZE } from "./paging";

/** The same mapping as every Exylia admin log (Tickets'), so an action reads alike across panels. */
const ICON_BY_AREA: Record<string, string> = {
  workspace: ICONS.workspaces,
  account: ICONS.accounts,
  member: ICONS.accounts,
  invite: ICONS.accounts,
  settings: ICONS.settings,
  bot: ICONS.bots,
  server: ICONS.servers,
  ai: ICONS.ai,
  credits: ICONS.ai,
  knowledge: ICONS.ai,
  decider: ICONS.shield,
  job: ICONS.activity,
  webhook: ICONS.webhook,
  apikey: ICONS.api,
  api: ICONS.api,
};
const BAD = new Set(["delete", "purge", "suspend", "ban", "revoke", "remove"]);
const OK = new Set(["restore", "unsuspend", "unban", "create", "grant"]);

/** An action's icon by its first segment (`settings.ai` -> settings), toned by its last: red when it takes away, green when it gives. */
export function auditIcon(action: string): { d: string; tone: string } {
  const parts = action.split(".");
  const verb = parts.at(-1) ?? "";
  return { d: ICON_BY_AREA[parts[0] ?? ""] ?? ICONS.audit, tone: BAD.has(verb) ? "text-bad" : OK.has(verb) ? "text-ok" : "text-ink-4" };
}

/** The admin log, newest first, 50 a page. */
export async function AuditList({ page, href }: { page: number; href: (page: number) => string }) {
  const [{ a }, total, events] = await Promise.all([
    adminText(),
    prisma.adminAuditEvent.count(),
    prisma.adminAuditEvent.findMany({ orderBy: [{ createdAt: "desc" }, { id: "desc" }], skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
  ]);
  const t = a.auditList;
  const actions: Record<string, string> = t.actions;
  const targets: Record<string, string> = t.targets;
  return (
    <Panel className="overflow-hidden px-2">
      {events.length === 0 ? (
        <EmptyState compact icon={ICONS.audit} title={t.emptyTitle} description={t.emptyDescription} />
      ) : (
        <ServerTable
          columns={[
            { key: "when", header: t.when, className: "whitespace-nowrap" },
            { key: "actor", header: t.actor },
            { key: "action", header: t.action, mobile: "title" },
            { key: "target", header: t.target },
            { key: "details", header: t.details },
          ]}
          rows={events.map((event) => {
            const icon = auditIcon(event.action);
            return {
              id: event.id,
              cells: {
                when: <Ago date={event.createdAt} never="" />,
                actor: <PersonCell name={event.actorName} />,
                action: (
                  <span className="flex items-center gap-2">
                    <Glyph d={icon.d} className={`h-4 w-4 shrink-0 ${icon.tone}`} />
                    {actions[event.action] ?? event.action}
                  </span>
                ),
                target: targets[event.targetLabel] ?? event.targetLabel,
                details: event.meta ? (
                  <span className="block min-w-0 max-w-md">
                    <Collapsible title={<span className="text-ui-sm text-ink-3">{t.meta}</span>}>
                      <pre className="max-h-60 overflow-auto rounded-lg bg-well p-2 font-mono text-ui-xs whitespace-pre-wrap [overflow-wrap:anywhere] text-ink-3">{JSON.stringify(event.meta, null, 2)}</pre>
                    </Collapsible>
                  </span>
                ) : null,
              },
            };
          })}
        />
      )}
      <Pager numbered base={1} page={page} pageSize={PAGE_SIZE} total={total} href={href} />
    </Panel>
  );
}
