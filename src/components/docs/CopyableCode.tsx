"use client";

import { createContext, useContext, useState, type KeyboardEvent, type ReactNode } from "react";
import { dict } from "@/content/dictionary";
import type { Lang } from "@/content/registry";

/** Set by `CodeBlock`, so the `<code>` inside a fenced block stays untouched. */
const InsidePre = createContext(false);

export const PreBoundary = InsidePre.Provider;

/** The click-to-copy chip. Only copyable values become a client component. */
export function CopyableCode({
  children,
  className,
  value,
  lang,
  ...props
}: {
  children?: ReactNode;
  className?: string;
  value: string;
  lang: Lang;
}) {
  const insidePre = useContext(InsidePre);
  const [copied, setCopied] = useState(false);

  if (insidePre)
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    copy();
  }

  return (
    <code
      {...props}
      className={className ? `${className} copyable` : "copyable"}
      data-copied={copied ? "" : undefined}
      role="button"
      tabIndex={0}
      title={copied ? dict.docs.copied[lang] : dict.docs.copyValue[lang]}
      aria-label={`${dict.docs.copyValue[lang]}: ${value}`}
      onClick={copy}
      onKeyDown={onKeyDown}
    >
      {children}
    </code>
  );
}
