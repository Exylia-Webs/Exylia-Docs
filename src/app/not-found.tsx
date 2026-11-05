import Link from "next/link";
// The docs' stylesheet (Tailwind 3), loaded by the public pages only: the admin panel has its own.
import "./globals.css";
import { dict } from "@/content/dictionary";
import { DEFAULT_LANG } from "@/content/registry";

/**
 * The 404, which cannot know its language.
 *
 * A static export serves one `404.html` for every unmatched path, including
 * paths with no language segment, so it reads in the fallback language and
 * sends the visitor to the root, where detection runs again.
 */
export default function NotFound() {
  const t = dict.notFound;
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade" />
      <span className="eyebrow relative">{t.kicker[DEFAULT_LANG]}</span>
      <h1 className="relative mt-6 font-display text-[clamp(2.2rem,6vw,3.6rem)] font-medium tracking-tight2 text-white">
        {t.title[DEFAULT_LANG]}
      </h1>
      <p className="relative mt-4 max-w-md text-[15px] leading-relaxed text-white/45">
        {t.body[DEFAULT_LANG]}
      </p>
      <Link
        href="/"
        className="relative mt-9 inline-flex h-11 items-center rounded-full border border-white/15 px-5 text-[14px] font-medium text-white/85 transition-colors hover:border-white/35 hover:text-white"
      >
        {t.back[DEFAULT_LANG]}
      </Link>
    </main>
  );
}
