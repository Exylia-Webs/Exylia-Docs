"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { dict } from "@/content/dictionary";
import { DEFAULT_LANG, LANGS, type Lang } from "@/content/registry";
import { DotField, ParticleWord } from "@exylia-webs/ui/site";

/** The static 404 is one file for every path, so it picks its language from the URL (or the browser) once it runs. */
export function NotFoundBody() {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  useEffect(() => {
    const seg = location.pathname.split("/")[1];
    const guess = (LANGS as readonly string[]).includes(seg) ? seg : navigator.language.slice(0, 2);
    if ((LANGS as readonly string[]).includes(guess)) setLang(guess as Lang);
  }, []);
  const t = dict.notFound;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <DotField />
      <div className="relative z-[1] flex w-full flex-col items-center">
        <ParticleWord word="404" className="h-[clamp(8rem,26vw,18rem)] w-full max-w-3xl" />
        <span className="eyebrow mt-2">{t.kicker[lang]}</span>
        <h1 className="mt-5 font-display text-[clamp(2rem,5vw,3.2rem)] font-medium tracking-tight2 text-white">{t.title[lang]}</h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/45">{t.body[lang]}</p>
        <Link
          href={`/${lang}/`}
          className="mt-9 inline-flex h-11 items-center rounded-full bg-white px-5 text-[14px] font-medium text-black transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          {t.back[lang]}
        </Link>
      </div>
    </main>
  );
}
