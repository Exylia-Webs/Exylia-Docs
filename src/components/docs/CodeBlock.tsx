"use client";

import { useRef, type ReactNode } from "react";
import { CopyButton } from "@exylia-webs/ui";
import { PreBoundary } from "./CopyableCode";
import { dict } from "@/content/dictionary";
import type { Lang } from "@/content/registry";

/**
 * The `<pre>` every fenced code block renders into.
 *
 * Client-side only for the copy button (library CopyButton): the highlighting itself is done at
 * build time by rehype-pretty-code, so nothing here re-renders the code.
 */
export function CodeBlock({
  children,
  lang = "en",
  ...props
}: {
  children?: ReactNode;
  lang?: Lang;
}) {
  const ref = useRef<HTMLPreElement>(null);
  const language = (props as Record<string, unknown>)["data-language"];
  const label = typeof language === "string" && language !== "text" && language !== "plaintext" ? language : null;

  return (
    <div className="group/code relative">
      {label && (
        <span className="pointer-events-none absolute right-3.5 top-3 text-ui-sm text-ink-3 transition-opacity duration-300 group-hover/code:opacity-0">
          {label}
        </span>
      )}
      <pre ref={ref} {...props}>
        <PreBoundary value={true}>{children}</PreBoundary>
      </pre>

      <CopyButton
        iconOnly
        label={dict.docs.copy[lang]}
        value={() => ref.current?.innerText ?? ""}
        className="absolute right-2.5 top-2.5 opacity-0 transition-opacity duration-300 group-hover/code:opacity-100 focus-visible:opacity-100"
      />
    </div>
  );
}
