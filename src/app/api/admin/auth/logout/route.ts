import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminCookie, cookieOptions, publicUrl, revokeAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/** POST only; SameSite=Lax already blocks a cross-site form post. Revokes the row, so a copied cookie dies too. */
export async function POST() {
  await revokeAdminSession((await cookies()).get(adminCookie())?.value);
  const response = NextResponse.redirect(new URL("/admin/login/", publicUrl()), { status: 303 });
  response.cookies.set(adminCookie(), "", cookieOptions(0));
  return response;
}
