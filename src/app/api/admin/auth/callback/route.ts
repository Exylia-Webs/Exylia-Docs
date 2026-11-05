import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminCookie, ADMIN_SESSION_TTL_MS, completeLogin, cookieOptions, createAdminSession, publicUrl, readState, stateCookie } from "@/lib/admin-auth";
import { safeAdminRedirect } from "@/lib/admin-rules";

export const dynamic = "force-dynamic";

/** Discord sends the admin back here: a session for a super admin, "no access" for anybody else. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const base = publicUrl();
  const stored = readState((await cookies()).get(stateCookie())?.value);
  let target = new URL("/admin/login/?error=failed", base);
  let token: string | null = null;
  if (url.searchParams.get("error")) {
    target = new URL("/admin/login/?error=cancelled", base);
  } else {
    try {
      const user = await completeLogin(stored, url.searchParams.get("state"), url.searchParams.get("code"));
      token = await createAdminSession(user);
      target = new URL(token ? safeAdminRedirect(stored?.redirectTo) : "/admin/login/?error=denied", base);
    } catch (error) {
      console.warn("admin login failed", error instanceof Error ? error.message : error);
    }
  }
  const response = NextResponse.redirect(target);
  if (token) response.cookies.set(adminCookie(), token, cookieOptions(ADMIN_SESSION_TTL_MS));
  // The state is single use whatever happened.
  response.cookies.set(stateCookie(), "", cookieOptions(0));
  return response;
}
