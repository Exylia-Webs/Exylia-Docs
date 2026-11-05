import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "node:crypto";
import type { Prisma } from "@/generated/prisma/client";
import type { Admin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { type AiSettings, type PlatformSettings, platformSchema, readPlatform, seedFromEnv, type StoredSecret } from "@/lib/platform-settings";

/**
 * The PlatformSettings row, read through a short in-process cache: a save clears it here, and
 * other replicas pick the change up within CACHE_MS, so nothing needs a restart. Before the first
 * save (or while the database cannot be read) the settings come from the AI_* variables.
 */

const ROW = "platform";
const CACHE_MS = 10_000;

export type PlatformState = { settings: PlatformSettings; updatedAt: Date | null; updatedByName: string | null };

let cached: { at: number; value: Promise<PlatformState> } | null = null;
let warned = false;

function fromEnv(): PlatformSettings {
  const { settings, error } = seedFromEnv(process.env);
  if (error && !warned) {
    warned = true;
    console.error(`AI assistant off: ${error}`);
  }
  return settings;
}

/** The row as stored, or the environment before the first save. Throws when the database does. */
async function read(): Promise<PlatformState> {
  const row = await prisma.platformSettings.findUnique({ where: { id: ROW } });
  if (!row) return { settings: fromEnv(), updatedAt: null, updatedByName: null };
  return { settings: readPlatform(row.data), updatedAt: row.updatedAt, updatedByName: row.updatedByName };
}

async function load(): Promise<PlatformState> {
  try {
    return await read();
  } catch (error) {
    console.error("platform settings unreadable, using the environment", error instanceof Error ? error.message : error);
    return { settings: fromEnv(), updatedAt: null, updatedByName: null };
  }
}

export function platformState(): Promise<PlatformState> {
  const now = Date.now();
  if (!cached || now - cached.at > CACHE_MS) cached = { at: now, value: load() };
  return cached.value;
}

export const platform = async () => (await platformState()).settings;

export class NoMasterKey extends Error {}

/** A 32-byte AES key from SECRET_KEY for one scope, so a ciphertext copied elsewhere never opens. */
function keyFor(scope: string): Buffer {
  const secret = process.env.SECRET_KEY?.trim();
  if (!secret || secret.length < 32) throw new NoMasterKey("SECRET_KEY must be set, at least 32 characters");
  return Buffer.from(hkdfSync("sha256", secret, "exylia-docs/seal", scope, 32));
}

/** `v1:` + base64(iv[12] | tag[16] | ciphertext), AES-256-GCM. */
export function sealSecret(plain: string, scope = "platform"): { enc: string } {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keyFor(scope), iv);
  const body = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return { enc: `v1:${Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64")}` };
}

/** The plain key, or "" when there is none or it does not open (tampered, another SECRET_KEY). */
export function openSecret(secret: StoredSecret, scope = "platform"): string {
  if (!secret) return "";
  if ("plain" in secret) return secret.plain;
  try {
    if (!secret.enc.startsWith("v1:")) return "";
    const raw = Buffer.from(secret.enc.slice(3), "base64");
    const decipher = createDecipheriv("aes-256-gcm", keyFor(scope), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    return Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
  } catch {
    return "";
  }
}

/** Every key of the AI section sealed: the env key a seed carried is never written to the row in the clear. */
function sealAll(ai: AiSettings): AiSettings {
  const seal = (secret: StoredSecret): StoredSecret => (secret && "plain" in secret ? sealSecret(secret.plain) : secret);
  return { ...ai, apiKey: seal(ai.apiKey), profiles: Object.fromEntries(Object.entries(ai.profiles).map(([provider, profile]) => [provider, { ...profile, apiKey: seal(profile.apiKey) }])) };
}

export type AdminEvent = { action: string; targetType: string; targetId?: string | null; targetLabel: string; meta?: Prisma.InputJsonValue };

/** The create of one admin log row, for a batch `$transaction([...])` with the change it records. */
export const adminAudit = (admin: Admin, event: AdminEvent) => prisma.adminAuditEvent.create({ data: { actorId: admin.discordId, actorName: admin.username, ...event } });

/**
 * Writes one section (already validated), keeping the others as stored, and `audit` (the admin
 * log row, from the section before and after) in the same transaction. Throws NoMasterKey when a
 * key would have to be sealed without SECRET_KEY.
 */
export async function savePlatform(ai: AiSettings, admin: Admin, audit: (before: AiSettings, after: AiSettings) => AdminEvent | null) {
  // Strict read: a database hiccup must never let the environment overwrite saved settings.
  const current = (await read()).settings;
  const data = platformSchema.parse({ ...current, ai: sealAll(ai) });
  const event = audit(current.ai, data.ai);
  await prisma.$transaction([
    prisma.platformSettings.upsert({
      where: { id: ROW },
      create: { id: ROW, data, updatedById: admin.discordId, updatedByName: admin.username },
      update: { data, updatedById: admin.discordId, updatedByName: admin.username },
    }),
    ...(event ? [adminAudit(admin, event)] : []),
  ]);
  cached = null;
}
