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
  <kbd className="inline-grid h-5 min-w-5 place-items-center rounded border border-white/12 bg-white/[0.03] px-1 font-mono text-[10px] text-white/50">
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
            className="group flex flex-col justify-between gap-6 rounded-2xl border border-white/[0.07] p-5 transition-colors duration-300 hover:border-white/15 hover:bg-white/[0.02]"
          >
            <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/30">
              <Arrow back />
              {dict.docs.previous[lang]}
            </span>
            <span className="font-display text-[15px] font-medium text-white/60 transition-colors group-hover:text-white">{previous.title}</span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}

        {next && (
          <Link
            href={href(next)}
            className="group relative overflow-hidden rounded-2xl border border-[rgb(var(--accent))]/30 bg-[linear-gradient(135deg,rgb(var(--accent)/0.14),rgb(var(--accent)/0.02)_60%)] p-6 transition-all duration-500 hover:border-[rgb(var(--accent))]/60 hover:shadow-[0_30px_80px_-40px_rgb(var(--accent)/0.9)]"
          >
            <span className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(closest-side,rgba(170,118,222,0.35),transparent)] opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative flex items-center justify-between gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[rgb(var(--accent))]">
              <span>
                {dict.docs.next[lang]} · {next.group}
              </span>
              <span className="text-white/60 transition-colors group-hover:text-white">
                <Arrow />
              </span>
            </span>
            <span className="relative mt-5 block font-display text-[clamp(1.25rem,2.4vw,1.6rem)] font-medium tracking-tight text-white">{next.title}</span>
            {next.description && <span className="relative mt-2 block max-w-lg text-[13.5px] leading-relaxed text-white/45">{next.description}</span>}
          </Link>
        )}
      </div>

      <p className="mt-4 hidden items-center justify-end gap-1.5 font-mono text-[10.5px] text-white/25 lg:flex">
        <Kbd>←</Kbd>
        <Kbd>→</Kbd>
        <span className="ml-1">{dict.docs.keysHint[lang]}</span>
      </p>
    </nav>
  );
}
