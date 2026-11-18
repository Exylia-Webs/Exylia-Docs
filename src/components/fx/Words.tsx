"use client";

import { useLayoutEffect, useRef, type ElementType, type ReactNode, type RefObject } from "react";

/** Marks the element `data-armed` before paint and `data-in` once it scrolls into view; CSS does the rest. */
export function useSeen(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.armed = "";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.in = "";
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}

/**
 * A heading that arrives word by word when it scrolls into view. `*word*` in the text is the
 * accent: set in the italic serif. The text is plain and readable without JavaScript; the words are
 * only hidden once this runs, right before paint, and only if they have not been seen yet.
 */
export function Words({ text, as: Tag = "h2", className = "", accent = "" }: { text: string; as?: ElementType; className?: string; accent?: string }) {
  const ref = useRef<HTMLElement>(null);
  useSeen(ref);

  let i = 0;
  return (
    <Tag ref={ref} className={`words ${className}`}>
      {text.split(/(\*[^*]+\*|\n)/).map((part, pi) => {
        if (part === "\n") return <br key={pi} />;
        const em = part.startsWith("*") && part.endsWith("*");
        const words = (em ? part.slice(1, -1) : part).split(/(\s+)/);
        return words.map((w, wi) =>
          /^\s*$/.test(w) ? (
            w
          ) : (
            <span key={`${pi}-${wi}`} className="w" style={{ ["--wd" as string]: i++ }}>
              {em ? <em className={`font-serif font-normal italic tracking-[-0.01em] ${accent}`}>{w}</em> : w}
            </span>
          ),
        );
      })}
    </Tag>
  );
}

/** A list whose children rise in one after another when it scrolls into view (.stagger, children set --i). */
export function Stagger({
  as: Tag = "ul",
  className = "",
  children,
  ...rest
}: { as?: ElementType; className?: string; children: ReactNode } & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  useSeen(ref);
  return (
    <Tag ref={ref} className={`stagger ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
