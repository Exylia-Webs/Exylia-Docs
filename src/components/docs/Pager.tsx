import Link from "next/link";
import type { DocMeta } from "@/lib/docs";
import { dict } from "@/content/dictionary";
import type { Lang } from "@/content/registry";

/** Previous / next, in the reading order the registry declares. */
export function Pager({
  previous,
  next,
  lang,
}: {
  previous: DocMeta | null;
  next: DocMeta | null;
  lang: Lang;
}) {
  if (!previous && !next) return null;

  return (
    <nav className="mt-16 grid grid-cols-1 gap-px border-t hair pt-px sm:grid-cols-2">
      {previous ? (
        <Link
          href={`/${lang}/docs/${previous.plugin}/${previous.slug}`}
          className="group flex flex-col gap-1.5 border-b border-r hair px-5 py-5 transition-colors duration-300 hover:bg-white/[0.02] sm:border-b-0"
        >
          <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/30">
            <svg className="h-3 w-3 transition-transform duration-300 group-hover:-translate-x-0.5" viewBox="0 0 16 16" fill="none">
              <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {dict.docs.previous[lang]}
          </span>
          <span className="font-display text-[15px] font-medium text-white/70 transition-colors group-hover:text-white">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}

      {next && (
        <Link
          href={`/${lang}/docs/${next.plugin}/${next.slug}`}
          className="group flex flex-col items-end gap-1.5 border-b hair px-5 py-5 text-right transition-colors duration-300 hover:bg-white/[0.02] sm:border-b-0"
        >
          <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/30">
            {dict.docs.next[lang]}
            <svg className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="font-display text-[15px] font-medium text-white/70 transition-colors group-hover:text-white">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
