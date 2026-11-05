/** The /admin rules that need no database nor request, so a test can check them alone. */

/** SUPER_ADMIN_DISCORD_IDS: comma-separated Discord ids, blanks dropped. */
export const parseAdminIds = (raw: string | undefined) => new Set((raw ?? "").split(",").map((id) => id.trim()).filter(Boolean));

const inAdmin = (path: string) => path === "/admin" || path.startsWith("/admin/") || path.startsWith("/admin?");

/** Whether this Discord id may use /admin. An empty list lets nobody in. */
export const isSuperAdmin = (discordId: string | null | undefined, raw: string | undefined) => !!discordId && parseAdminIds(raw).has(discordId);

/**
 * Same-origin /admin paths only, so the login is never an open redirect. Control characters and
 * backslashes are refused outright (a URL parser drops a tab, so `/\t/evil.com` would become `//evil.com`).
 * The docs end every path in a slash (trailingSlash), so the default does too.
 */
export function safeAdminRedirect(value: string | null | undefined): string {
  if (!value || !inAdmin(value) || /[\\\u0000-\u001f\u007f]/.test(value)) return "/admin/";
  const base = "http://origin.invalid";
  try {
    const url = new URL(value, base);
    if (url.origin !== base || !inAdmin(url.pathname) || url.pathname.startsWith("/admin/login")) return "/admin/";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/admin/";
  }
}
