import { NextResponse } from "next/server";
import { authorizationUrl, cookieOptions, discordConfigured, publicUrl, STATE_TTL_MS, stateCookie } from "@/lib/admin-auth";
import { safeAdminRedirect } from "@/lib/admin-rules";

export const dynamic = "force-dynamic";

/** Starts the super admin login: off to Discord with a fresh state and PKCE verifier in a cookie. */
export async function GET(request: Request) {
  if (!discordConfigured()) return NextResponse.redirect(new URL("/admin/login/?error=unconfigured", publicUrl()));
  const { url, cookie } = authorizationUrl(safeAdminRedirect(new URL(request.url).searchParams.get("redirect")));
  const response = NextResponse.redirect(url);
  response.cookies.set(stateCookie(), cookie, cookieOptions(STATE_TTL_MS));
  return response;
}
