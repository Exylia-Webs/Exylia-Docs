"use client";

import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { ICONS, NotFoundView } from "@exylia-webs/ui";
import { uiMessages } from "@exylia-webs/ui/messages";
import { DEFAULT_LANG, LANGS, type Lang } from "@/content/registry";

/** The 404 is one file for every path, so it picks its language from the URL (or the browser) once it runs. */
export function NotFoundBody() {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  useEffect(() => {
    const seg = location.pathname.split("/")[1];
    const guess = (LANGS as readonly string[]).includes(seg) ? seg : navigator.language.slice(0, 2);
    if ((LANGS as readonly string[]).includes(guess)) setLang(guess as Lang);
  }, []);
  return (
    <NextIntlClientProvider locale={lang} messages={{ ui: uiMessages[lang] }} timeZone="UTC">
      <NotFoundView icon={ICONS.globe} homeHref={`/${lang}/`} />
    </NextIntlClientProvider>
  );
}
