import type { ReactNode } from "react";
import type { Lang } from "@/content/registry";
import { CopyableCode } from "./CopyableCode";

/**
 * A full `%placeholder%` or an Exylia permission node such as `exyliaffa.commands.join`.
 * Anything else — `true`, `config.yml`, a prose word — stays a plain `<code>`.
 */
const COPYABLE = /^(%[^%\s]+%|exylia[a-z0-9]*(?:\.[a-z0-9_*<>-]+)+)$/;

/** Inline code is highlighted at build time, so the text can be nested in spans. */
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

/** A server component: plain `<code>` ships no JavaScript; only copyable values hydrate. */
export function InlineCode({
  children,
  className,
  lang = "en",
  ...props
}: {
  children?: ReactNode;
  className?: string;
  lang?: Lang;
}) {
  const value = textOf(children).trim();

  if (!COPYABLE.test(value))
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );

  return (
    <CopyableCode className={className} value={value} lang={lang} {...props}>
      {children}
    </CopyableCode>
  );
}
