import Link from "next/link";
import type { DocMeta } from "@/lib/docs";
import { dict } from "@/content/dictionary";
import type { Lang } from "@/content/registry";

const Arrow = ({ back = false }: { back?: boolean }) => (
  <svg className={`h-3.5 w-3.5 transition-transform duration-300 ${back ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="inline-grid h-5 min-w-5 place-items-center rounded border border-line bg-hover px-1 font-mono text-ui-xs text-ink-3">
    {children}
  </kbd>
);

/** Previous / next in the reading order: the next page leads, with what it covers. */
export function Pager({ previous, next, lang }: { previous: DocMeta | null; next: DocMeta | null; lang: Lang }) {
  if (!previous && !next) return null;
  const href = (d: DocMeta) => `/${lang}/docs/${d.plugin}/${d.slug}`;

  return (
    <nav className="mt-16">
      <div className="grid gap-3 sm:grid-cols-[1fr_1.6fr]">
        {previous ? (
          <Link
            href={href(previous)}
            className="group flex flex-col justify-between gap-6 rounded-2xl border border-line p-5 transition-colors duration-200 hover:border-line-2 hover:bg-hover"
          >
            <span className="flex items-center gap-2 text-ui-sm text-ink-3">
              <Arrow back />
              {dict.docs.previous[lang]}
            </span>
            <span className="font-display text-ui-lg font-medium text-ink-2 transition-colors group-hover:text-ink">{previous.title}</span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}

        {next && (
          <Link
            href={href(next)}
            className="group rounded-2xl border border-line bg-hover p-6 transition-colors duration-200 hover:border-accent/50 hover:bg-accent/6"
          >
            <span className="flex items-center justify-between gap-2 text-ui-sm text-ink-3">
              <span>
                {dict.docs.next[lang]} · {next.group}
              </span>
              <span className="text-ink-2 transition-colors group-hover:text-ink">
                <Arrow />
              </span>
            </span>
            <span className="mt-4 block font-display text-[clamp(1.25rem,2.4vw,1.6rem)] font-medium tracking-tight text-ink">{next.title}</span>
            {next.description && <span className="mt-1.5 block max-w-lg text-ui-sm leading-relaxed text-ink-3">{next.description}</span>}
          </Link>
        )}
      </div>

      <p className="mt-4 hidden items-center justify-end gap-1.5 text-ui-sm text-ink-3 lg:flex">
        <Kbd>←</Kbd>
        <Kbd>→</Kbd>
        <span className="ml-1">{dict.docs.keysHint[lang]}</span>
      </p>
    </nav>
  );
}
