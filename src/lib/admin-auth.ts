// Super admin sign-in to /admin (copied from Exylia-Utils): Discord OAuth2 (PKCE, state in an
// HttpOnly cookie) for the ids in SUPER_ADMIN_DISCORD_IDS, then a random token in an HttpOnly
// cookie with only its SHA-256 in AdminSession. Over HTTPS the `__Host-` prefix stops a sibling
// *.exylia.net from planting either. The public docs and their assistant never read any of this.
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { SITE } from "@/content/registry";
import { isSuperAdmin } from "@/lib/admin-rules";
import { prisma } from "@/lib/db";

export const ADMIN_SESSION_TTL_MS = 7 * 24 * 60 * 60_000;
export const STATE_TTL_MS = 10 * 60_000;

/** The address the site is served on: PUBLIC_URL (e.g. http://localhost:3010 in dev), else the docs' own. */
export const publicUrl = () => (process.env.PUBLIC_URL?.trim() || SITE.url).replace(/\/+$/, "");

const sha256 = (value: string) => createHash("sha256").update(value, "utf8").digest("hex");
const secure = () => publicUrl().startsWith("https://");
const named = (base: string) => (secure() ? `__Host-${base}` : base);
export const adminCookie = () => named("docs_admin");
export const stateCookie = () => named("docs_admin_oauth");

/** Lax, not Strict: the OAuth callback is a top-level navigation from discord.com. */
export const cookieOptions = (maxAgeMs: number) => ({ httpOnly: true, secure: secure(), sameSite: "lax" as const, path: "/", maxAge: Math.floor(maxAgeMs / 1000) });

export const discordConfigured = () => Boolean(process.env.DISCORD_CLIENT_ID?.trim() && process.env.DISCORD_CLIENT_SECRET?.trim());
const allowed = (discordId: string) => isSuperAdmin(discordId, process.env.SUPER_ADMIN_DISCORD_IDS);
/** With the trailing slash every docs path has, so Discord's redirect lands without a hop. */
export const redirectUri = () => `${publicUrl()}/api/admin/auth/callback/`;

export type OAuthState = { state: string; verifier: string; redirectTo: string; createdAt: number };

export function authorizationUrl(redirectTo: string): { url: string; cookie: string } {
  const state: OAuthState = { state: randomBytes(32).toString("base64url"), verifier: randomBytes(48).toString("base64url"), redirectTo, createdAt: Date.now() };
  const url = new URL("https://discord.com/oauth2/authorize");
  url.searchParams.set("client_id", process.env.DISCORD_CLIENT_ID!.trim());
  url.searchParams.set("redirect_uri", redirectUri());
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "identify");
  url.searchParams.set("state", state.state);
  url.searchParams.set("code_challenge", createHash("sha256").update(state.verifier).digest("base64url"));
  url.searchParams.set("code_challenge_method", "S256");
  return { url: url.toString(), cookie: Buffer.from(JSON.stringify(state)).toString("base64url") };
}

export function readState(cookie: string | undefined): OAuthState | null {
  if (!cookie) return null;
  try {
    return JSON.parse(Buffer.from(cookie, "base64url").toString("utf8")) as OAuthState;
  } catch {
    return null;
  }
}

const discordUser = z.object({ id: z.string().regex(/^\d{17,20}$/), username: z.string(), global_name: z.string().nullish(), avatar: z.string().nullish() });
export type DiscordUser = z.infer<typeof discordUser>;

/** Checks the state, trades the code (with the PKCE verifier) and reads who signed in. Throws on any mismatch. */
export async function completeLogin(stored: OAuthState | null, state: string | null, code: string | null): Promise<DiscordUser> {
  if (!stored || !state || !code) throw new Error("missing state or code");
  if (Date.now() - stored.createdAt > STATE_TTL_MS) throw new Error("state expired");
  const a = Buffer.from(stored.state);
  const b = Buffer.from(state);
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error("state mismatch");
  const credentials = Buffer.from(`${process.env.DISCORD_CLIENT_ID!.trim()}:${process.env.DISCORD_CLIENT_SECRET!.trim()}`).toString("base64");
  const token = await fetch("https://discord.com/api/v10/oauth2/token", {
    method: "POST",
    headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri(), code_verifier: stored.verifier }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!token.ok) throw new Error(`token exchange failed: ${token.status}`);
  const { access_token } = z.object({ access_token: z.string() }).parse(await token.json());
  // Only to read the id and name; never kept.
  const me = await fetch("https://discord.com/api/v10/users/@me", { headers: { Authorization: `Bearer ${access_token}` }, signal: AbortSignal.timeout(10_000) });
  if (!me.ok) throw new Error(`profile fetch failed: ${me.status}`);
  return discordUser.parse(await me.json());
}

/** A new admin sign-in, or null when this Discord account is not a super admin. */
export async function createAdminSession(user: DiscordUser): Promise<string | null> {
  if (!allowed(user.id)) return null;
  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  // Docs has no sweep job: a sign-in (rare) clears the dead rows instead.
  await prisma.$transaction([
    prisma.adminSession.deleteMany({ where: { OR: [{ expiresAt: { lte: now } }, { revokedAt: { not: null } }] } }),
    prisma.adminSession.create({
      data: {
        tokenHash: sha256(token),
        discordId: user.id,
        username: user.global_name ?? user.username,
        avatarUrl: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64` : null,
        expiresAt: new Date(now.getTime() + ADMIN_SESSION_TTL_MS),
      },
    }),
  ]);
  return token;
}

export async function revokeAdminSession(token: string | undefined) {
  if (!token) return;
  await prisma.adminSession.updateMany({ where: { tokenHash: sha256(token), revokedAt: null }, data: { revokedAt: new Date() } });
}

export type Admin = { discordId: string; username: string; avatarUrl: string | null };

/**
 * The signed-in super admin for this request, or null. The id is checked against the env list on
 * every request, so removing it from SUPER_ADMIN_DISCORD_IDS locks the account out at once.
 */
export const currentAdmin = cache(async (): Promise<Admin | null> => {
  const token = (await cookies()).get(adminCookie())?.value;
  if (!token) return null;
  const session = await prisma.adminSession.findUnique({ where: { tokenHash: sha256(token) }, select: { discordId: true, username: true, avatarUrl: true, expiresAt: true, revokedAt: true } });
  if (!session || session.revokedAt || session.expiresAt.getTime() <= Date.now() || !allowed(session.discordId)) return null;
  return { discordId: session.discordId, username: session.username, avatarUrl: session.avatarUrl };
});

/** For the admin layout, pages and every admin server action: signed-in super admin, or off to the login. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login/");
  return admin;
}
