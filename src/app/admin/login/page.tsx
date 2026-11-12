import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppFrame, LoginButton, LoginPanel } from "@exylia-webs/ui";
import { LOCALES } from "@/i18n/request";
import { currentAdmin } from "@/lib/admin-auth";
import { adminText } from "@/lib/admin-i18n";
import { safeAdminRedirect } from "@/lib/admin-rules";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { a } = await adminText();
  return { title: a.login.meta };
}

/** The super admin login: one Discord button. Anybody not in SUPER_ADMIN_DISCORD_IDS is told they have no access. */
export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ redirect?: string; error?: string }> }) {
  const params = await searchParams;
  const target = safeAdminRedirect(params.redirect);
  if (await currentAdmin()) redirect(target);
  const { a } = await adminText();
  const t = a.login;
  return (
    <AppFrame product="docs" locales={LOCALES}>
      <div className="flex justify-center py-10">
        <LoginPanel eyebrow={t.eyebrow} title={t.title} description={t.description} error={params.error} errors={t.errors} legal={false}>
          <LoginButton href={`/api/admin/auth/discord/?redirect=${encodeURIComponent(target)}`} provider="discord">
            {t.discord}
          </LoginButton>
        </LoginPanel>
      </div>
    </AppFrame>
  );
}
