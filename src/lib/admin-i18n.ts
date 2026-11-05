import { cache } from "react";
import { getLocale } from "next-intl/server";
import { adminDict, adminStrings } from "@/content/admin";
import type { Lang } from "@/content/registry";

/** The admin panel's strings in this request's language (src/i18n/request.ts), once per request. */
export const adminText = cache(async () => {
  const lang = (await getLocale()) as Lang;
  return { lang, a: adminStrings(adminDict, lang) };
});
