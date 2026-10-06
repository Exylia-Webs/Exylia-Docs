"use client";

import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import { LANGS, translateSlug, type Lang } from "@/content/registry";
import { rememberLang } from "@/lib/lang";

/**
 * Switches language without losing the page.
 *
 * The path is rebuilt rather than replaced: on a doc page the slug is
 * translated through the registry, so the reader lands on the same page in the
 * other language instead of being dropped at the index.
 */
export function LangToggle({ lang }: { lang: Lang }) {
  const router = useRouter();

  function switchTo(next: Lang) {
    if (next === lang) return;
    rememberLang(next);

    const parts = window.location.pathname.split("/").filter(Boolean);
    // [lang, "docs", plugin, slug?]
    if (parts[1] === "docs" && parts[2]) {
      const slug = parts[3];
      const translated = slug ? translateSlug(parts[2], slug, lang, next) : null;
      const tail = translated ? `/${translated}` : "";
      router.push(`/${next}/docs/${parts[2]}${tail}`);
      return;
    }

    const hash = window.location.hash;
    router.push(`/${next}${hash}`);
  }

  return (
    <div className="relative flex items-center rounded-full border border-white/10 bg-white/[0.02] p-0.5">
      {LANGS.map((code) => {
        const active = code === lang;
        return (
          <button
            key={code}
            onClick={() => switchTo(code)}
            aria-label={code === "en" ? "English" : "Español"}
            aria-current={active}
            className={`relative z-10 rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors duration-300 ${
              active ? "text-white" : "text-white/35 hover:text-white/70"
            }`}
          >
            {active && (
              <m.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-white/[0.08]"
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            {code}
          </button>
        );
      })}
    </div>
  );
}
