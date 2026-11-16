"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type Preview = { plugin: string; group: string; title: string; section?: string; description: string };

const WIDTH = 320;

/**
 * A link to another docs page that shows where it goes before the reader leaves: the page's title,
 * the section the anchor points at, and its description. Hover-capable pointers and keyboard focus
 * only; on touch the link just navigates.
 */
export function PreviewLink({ href, preview, children }: { href: string; preview: Preview; children?: ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [at, setAt] = useState<{ left: number; top: number; above: boolean } | null>(null);

  const show = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const above = r.bottom + 180 > innerHeight;
      setAt({
        left: Math.max(16, Math.min(r.left, innerWidth - WIDTH - 16)),
        top: above ? r.top - 8 : r.bottom + 8,
        above,
      });
    }, 280);
  };
  const hide = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAt(null), 120);
  };

  useEffect(() => {
    if (!at) return;
    const close = () => setAt(null);
    addEventListener("scroll", close, { passive: true, once: true });
    return () => removeEventListener("scroll", close);
  }, [at]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const hover = () => matchMedia("(hover: hover)").matches && show();

  return (
    <>
      <Link ref={ref} href={href} onPointerEnter={hover} onPointerLeave={hide} onFocus={show} onBlur={hide}>
        {children}
      </Link>
      {at && (
        <span
          role="tooltip"
          onPointerEnter={() => clearTimeout(timer.current)}
          onPointerLeave={hide}
          style={{ left: at.left, top: at.top, width: WIDTH, transform: at.above ? "translateY(-100%)" : undefined }}
          className="not-prose fixed z-50 block rounded-xl border border-white/10 bg-[#0d0d11] p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]"
        >
          <span className="block text-[12px] text-white/40">
            {preview.plugin} · {preview.group}
          </span>
          <span className="mt-1 block text-[15px] font-medium leading-snug text-white">
            {preview.title}
            {preview.section && <span className="text-[rgb(var(--accent))]"> › {preview.section}</span>}
          </span>
          {preview.description && <span className="mt-1.5 block text-[13px] leading-relaxed text-white/50">{preview.description}</span>}
        </span>
      )}
    </>
  );
}
