import type { Metadata } from "next";
import { PageHeader } from "@exylia-webs/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { adminText } from "@/lib/admin-i18n";
import { AuditList } from "../AuditList";
import { pageHref, parsePage } from "../paging";

export async function generateMetadata(): Promise<Metadata> {
  const { a } = await adminText();
  return { title: a.audit.meta };
}

/** Every change made from this panel, newest first. */
export default async function AdminAudit({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const [, { a }, params] = await Promise.all([requireAdmin(), adminText(), searchParams]);
  return (
    <>
      <PageHeader kicker={a.eyebrow} title={a.audit.title} description={a.audit.description} />
      <AuditList page={parsePage(params.page)} href={(n) => pageHref("/admin/audit/", n)} />
    </>
  );
}
