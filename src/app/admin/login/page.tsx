import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginButton, LoginPanel } from "@exylia-webs/ui";
import { DocsAuthFrame } from "@/components/landing/site/auth-frame";
import { SITE } from "@/content/registry";
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
  const { a, lang } = await adminText();
  const t = a.login;
  const lines = lang === "es" ? ["Cada plugin,", "*documentado*."] : ["Every plugin,", "*documented*."];
  return (
    <DocsAuthFrame lines={lines} lead={SITE.description[lang]}>
      <LoginPanel eyebrow={t.eyebrow} title={t.title} description={t.description} error={params.error} errors={t.errors} legal={false}>
        <LoginButton href={`/api/admin/auth/discord/?redirect=${encodeURIComponent(target)}`} provider="discord">
          {t.discord}
        </LoginButton>
      </LoginPanel>
    </DocsAuthFrame>
  );
}
