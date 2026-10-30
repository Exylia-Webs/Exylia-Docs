import Link from "next/link";
import type { ReactNode } from "react";
import { CodeBlock } from "./CodeBlock";
import { InlineCode } from "./InlineCode";
import { AiPrompt } from "./AiPrompt";
import type { Lang } from "@/content/registry";

/* ---------------- Callout ---------------- */

const CALLOUT = {
  note: {
    accent: "rgba(124,92,255,0.55)",
    tint: "rgba(124,92,255,0.05)",
    label: "Nota",
    icon: (
      <path d="M8 5.2v.1M8 7.4v3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    ),
  },
  tip: {
    accent: "rgba(120,220,170,0.5)",
    tint: "rgba(120,220,170,0.04)",
    label: "Consejo",
    icon: (
      <path d="M6.4 12h3.2M6.6 9.6a3.2 3.2 0 112.8 0v1.1H6.6V9.6z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  warning: {
    accent: "rgba(255,190,90,0.5)",
    tint: "rgba(255,190,90,0.04)",
    label: "Atención",
    icon: (
      <path d="M8 4.6v4M8 11.1v.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    ),
  },
  danger: {
    accent: "rgba(255,110,110,0.5)",
    tint: "rgba(255,110,110,0.04)",
    label: "Importante",
    icon: (
      <path d="M8 4.6v4M8 11.1v.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    ),
  },
} as const;

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: keyof typeof CALLOUT;
  title?: string;
  children: ReactNode;
}) {
  const style = CALLOUT[type];
  return (
    <div
      className="not-prose my-6 flex gap-3.5 rounded-xl border p-4 pr-5"
      style={{ borderColor: style.accent.replace("0.5", "0.22"), background: style.tint }}
    >
      <svg
        className="mt-0.5 h-4 w-4 shrink-0"
        style={{ color: style.accent }}
        viewBox="0 0 16 16"
        fill="none"
      >
        <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
        {style.icon}
      </svg>
      <div className="min-w-0 text-[14.5px] leading-relaxed text-white/58">
        <span
          className="mb-1 block font-mono text-[10.5px] uppercase tracking-[0.18em]"
          style={{ color: style.accent }}
        >
          {title ?? style.label}
        </span>
        <div className="prose-docs [&>*:first-child]:mt-0">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- Cards ---------------- */

export function Cards({ children }: { children: ReactNode }) {
  return <div className="not-prose my-7 grid grid-cols-1 gap-px border-l border-t hair sm:grid-cols-2">{children}</div>;
}

export function Card({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children?: ReactNode;
}) {
  // Cards are written in MDX with language-less hrefs; MdxLink prefixes them.
  const body = (
    <>
      <span className="pointer-events-none absolute right-0 top-0 h-0 w-0 border-r-2 border-t-2 border-[rgb(var(--accent))]/0 transition-all duration-300 group-hover:h-4 group-hover:w-4 group-hover:border-[rgb(var(--accent))]/50" />
      <span className="flex items-center gap-2 font-display text-[15px] font-medium text-white">
        {title}
        {href && (
          <svg className="h-3 w-3 text-white/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {children && <span className="mt-2 block text-[13.5px] leading-relaxed text-white/45">{children}</span>}
    </>
  );

  const className =
    "group relative block border-b border-r hair px-5 py-5 transition-colors duration-300 hover:bg-white/[0.02]";

  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

/* ---------------- Steps ---------------- */

export function Steps({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-7 [counter-reset:step] border-l hair pl-0">
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

export function Step({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="relative pb-8 pl-8 last:pb-0 [counter-increment:step]">
      <span className="absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-white/12 bg-ink-950 font-mono text-[11px] text-accent before:content-[counter(step)]" />
      <h4 className="font-display text-[15px] font-medium tracking-tightish text-white">{title}</h4>
      <div className="prose-docs mt-2 text-[14.5px]">{children}</div>
    </div>
  );
}

/* ---------------- Small pieces ---------------- */

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="not-prose inline-flex items-center rounded-full border border-white/12 bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/55">
      {children}
    </span>
  );
}

/** Key/value block for things that are not really a table. */
export function Field({
  name,
  type,
  defaultValue,
  children,
}: {
  name: string;
  type?: string;
  defaultValue?: string;
  children: ReactNode;
}) {
  return (
    <div className="not-prose border-b hair py-4 last:border-b-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <code className="font-mono text-[13px] text-[#cfc9ff]">{name}</code>
        {type && <span className="font-mono text-[11px] tracking-wide text-white/30">{type}</span>}
        {defaultValue !== undefined && (
          <span className="font-mono text-[11px] text-white/30">
            por defecto <span className="text-white/55">{defaultValue}</span>
          </span>
        )}
      </div>
      <div className="prose-docs mt-1.5 text-[14px]">{children}</div>
    </div>
  );
}

/**
 * Links inside MDX are written without a language, as `/docs/exyliaffa/arenas`.
 * Prefixing them here means the same file works in both languages and a
 * translator never has to remember to rewrite a path.
 */
function withLang(href: string, lang: Lang): string {
  return href.startsWith("/docs/") ? `/${lang}${href}` : href;
}

export function createMdxComponents(lang: Lang) {
  return {
    pre: (props: { children?: ReactNode }) => <CodeBlock {...props} lang={lang} />,
    code: (props: { children?: ReactNode }) => <InlineCode {...props} lang={lang} />,
    table: (props: { children?: ReactNode }) => (
      <div className="table-wrap">
        <table {...props} />
      </div>
    ),
    a: ({ href = "", ...props }: { href?: string; children?: ReactNode }) => {
      if (href.startsWith("#")) return <a href={href} {...props} />;
      if (href.startsWith("/")) return <Link href={withLang(href, lang)} {...props} />;
      return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
    },
    Callout,
    Cards,
    Card: ({ href, ...rest }: { title: string; href?: string; children?: ReactNode }) => (
      <Card {...rest} href={href ? withLang(href, lang) : undefined} />
    ),
    Steps,
    Step,
    Badge,
    Field,
    AiPrompt: (props: { id: Parameters<typeof AiPrompt>[0]["id"] }) => (
      <AiPrompt {...props} lang={lang} />
    ),
  };
}
