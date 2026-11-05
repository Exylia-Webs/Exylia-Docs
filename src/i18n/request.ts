import { uiMessages } from "@exylia-webs/ui/messages";
import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { LANGS, type Lang } from "@/content/registry";

/**
 * next-intl, for the admin panel only: the design system's components read their own strings
 * (`ui`) through it. The panel's strings are Docs' own dictionary (content/admin.ts), in the
 * language picked here: the shared NEXT_LOCALE cookie, else the browser's, else English. The
 * public docs never call next-intl; their language is the path's.
 */
export const LOCALES = LANGS;

const isLang = (value: string | undefined): value is Lang => LANGS.includes(value as Lang);

/** The first Accept-Language entry (by q) whose base language the docs offer. */
export function negotiate(header: string | null): Lang {
  const ranked = (header ?? "")
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { base: (tag ?? "").toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { base } of ranked) if (isLang(base)) return base;
  return "en";
}

export default getRequestConfig(async () => {
  const chosen = (await cookies()).get("NEXT_LOCALE")?.value;
  const locale = isLang(chosen) ? chosen : negotiate((await headers()).get("accept-language"));
  // UTC like every date the panel prints (months and days are UTC).
  return { locale, timeZone: "UTC", messages: { ui: uiMessages[locale] } };
});
