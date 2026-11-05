import { cookies } from "next/headers";
import { AppFrame, buttonClass, Glyph, ICONS, type NavSection, UserMenu } from "@exylia-webs/ui";
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
  const [admin, jar, { a }] = await Promise.all([requireAdmin(), cookies(), adminText()]);
  const sections: NavSection[] = [
    {
      title: a.nav.section,
      items: [
        { href: "/admin/", label: a.nav.overview, icon: "dashboard", exact: true },
        { href: "/admin/usage/", label: a.nav.usage, icon: "ai" },
        { href: "/admin/audit/", label: a.nav.audit, icon: "audit" },
        { href: "/admin/settings/", label: a.nav.settings, icon: "settings" },
      ],
    },
  ];
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
