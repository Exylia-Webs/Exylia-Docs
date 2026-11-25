"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { m } from "motion/react"; // domain animation (layoutId indicators, springs) the library helpers do not express; shares ThemeProvider's LazyMotion
import { detectLang } from "@/lib/lang";
import { dict } from "@/content/dictionary";
import { LANGS } from "@/content/registry";

export function LanguageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${detectLang()}`);
  }, [router]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-6">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade" />

      <m.span
        className="relative h-8 w-px bg-gradient-to-b from-accent to-transparent"
        animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "top" }}
      />

      <p className="eyebrow relative">{dict.redirect.detecting.en}</p>

      {/* Works with JavaScript disabled, and as a manual escape hatch. */}
      <noscript>
        <div className="relative flex gap-3">
          {LANGS.map((code) => (
            <a
              key={code}
              href={`/${code}`}
              className="inline-flex h-10 items-center rounded-full border border-line-2 px-4 text-ui-sm text-ink"
            >
              {dict.redirect.manual[code]}
            </a>
          ))}
        </div>
      </noscript>

      <div className="relative flex gap-3">
        {LANGS.map((code) => (
          <Link
            key={code}
            href={`/${code}`}
            className="font-mono text-ui-xs uppercase tracking-[0.16em] text-ink-3 transition-colors hover:text-ink"
          >
            {code}
          </Link>
        ))}
      </div>
    </main>
  );
}
