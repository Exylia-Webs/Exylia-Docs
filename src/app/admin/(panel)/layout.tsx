import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { AppFrame, buttonClass, Glyph, ICONS, UserMenu } from "@exylia-webs/ui";
import { adminNav } from "@exylia-webs/ui/admin";
import { LOCALES } from "@/i18n/request";
import { requireAdmin } from "@/lib/admin-auth";
import { adminText } from "@/lib/admin-i18n";

export const dynamic = "force-dynamic";

/** "1" while the rail is collapsed to icons; "0" once the "Advanced" fold was opened. Written by the frame. */
const RAIL_COOKIE = "docs_admin_rail";
const FOLD_COOKIE = "docs_admin_fold";

/**
 * The super admin panel (as in Exylia-Utils): the shared AppFrame with one "Admin" group, the
 * product brand and a way back to the docs at the rail's head, no workspace switcher. Guarded here
 * on the server, and again in every page and server action. The way back is a plain link: the
 * docs are another stylesheet and another world, so they load whole.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [admin, jar, { a }, nav] = await Promise.all([requireAdmin(), cookies(), adminText(), getTranslations("ui.admin.nav")]);
  // The docs use trailing slashes, so the shared hrefs get one for the active state to match.
  const shared = adminNav(nav, { omit: ["workspaces", "activity", "accounts", "health", "ai"], product: [{ href: "/admin/usage", label: nav("ai"), icon: "ai" }] });
  const sections = [{ ...shared, items: shared.items.map((item) => ({ ...item, href: `${item.href}/` })) }];
  return (
    <AppFrame
      product="docs"
      locales={LOCALES}
      nav={{ sections, collapsed: jar.get(RAIL_COOKIE)?.value === "1", railCookie: RAIL_COOKIE, folded: jar.get(FOLD_COOKIE)?.value !== "0", foldCookie: FOLD_COOKIE }}
      end={
        <>
          <a href="/" aria-label={a.back} className={buttonClass("secondary", "sm")}>
            <Glyph d={ICONS.arrowLeft} className="h-4 w-4" />
            <span data-frame-label="" className="max-lg:sr-only">
              {a.back}
            </span>
          </a>
          <UserMenu user={admin} locales={LOCALES} logoutAction="/api/admin/auth/logout/" />
        </>
      }
    >
      {children}
    </AppFrame>
  );
}
