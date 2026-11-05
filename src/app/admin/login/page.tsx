import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppFrame, buttonClass, Callout } from "@exylia-webs/ui";
import { LOCALES } from "@/i18n/request";
import { currentAdmin } from "@/lib/admin-auth";
import { adminText } from "@/lib/admin-i18n";
import { safeAdminRedirect } from "@/lib/admin-rules";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { a } = await adminText();
  return { title: a.login.meta };
}

const ERRORS = ["denied", "cancelled", "unconfigured", "failed"] as const;

/** The super admin login: one Discord button. Anybody not in SUPER_ADMIN_DISCORD_IDS is told they have no access. */
export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ redirect?: string; error?: string }> }) {
  const params = await searchParams;
  const target = safeAdminRedirect(params.redirect);
  if (await currentAdmin()) redirect(target);
  const { a } = await adminText();
  const t = a.login;
  const error = params.error ? (ERRORS.find((code) => code === params.error) ?? "failed") : null;
  return (
    <AppFrame product="docs" locales={LOCALES}>
      <div className="mx-auto w-full max-w-[400px] py-10">
        <p className="eyebrow mb-4">{t.eyebrow}</p>
        <h1 className="font-display text-ui-3xl leading-tight font-semibold tracking-tightish text-ink">{t.title}</h1>
        <p className="mt-3 text-ui-md leading-relaxed text-ink-3">{t.description}</p>
        {error ? (
          <Callout tone="danger" className="mt-6">
            {t.errors[error]}
          </Callout>
        ) : null}
        <a href={`/api/admin/auth/discord/?redirect=${encodeURIComponent(target)}`} className={`${buttonClass("primary")} mt-8 w-full`}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.6 1.3a18.4 18.4 0 0 0-5.6 0L8.6 3a19.7 19.7 0 0 0-4.9 1.4C.6 9-.3 13.5.1 18a19.9 19.9 0 0 0 6 3l1.3-2.1a12.9 12.9 0 0 1-2-1l.5-.4a14.2 14.2 0 0 0 12.2 0l.5.4c-.6.4-1.3.7-2 1l1.3 2.1a19.8 19.8 0 0 0 6-3c.5-5.2-.9-9.7-3.6-13.6ZM8 15.3c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm8 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z" />
          </svg>
          {t.discord}
        </a>
      </div>
    </AppFrame>
  );
}
