"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { INK } from "./ink-paths";

/** True once the element has scrolled into view; never flips back. */
export function useSeen<T extends Element>(ref: RefObject<T | null>, margin = "0px 0px -12% 0px") {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, seen]);
  return seen;
}

/**
 * An accent word written by hand: the outline is traced first, then the ink
 * fills in. The glyphs are Instrument Serif Italic outlines baked into
 * `ink-paths.ts`, so the word costs no font download and sits on the text's
 * own baseline (the box is the font's ascent to descent, 1.3em tall).
 */
export function Ink({ word, delay = 0, className = "" }: { word: string; delay?: number; className?: string }) {
  const glyph = INK[word];
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useSeen(ref);
  const id = useId().replace(/:/g, "");
  if (!glyph) return <span className={className}>{word}</span>;
  const [x, y, w, h] = glyph.box;

  return (
    <span ref={ref} className={`ink ${className}`} data-on={seen || undefined} style={{ ["--ink-delay" as string]: `${delay}s` }}>
      <span className="sr-only">{word}</span>
      <svg
        aria-hidden
        viewBox={`${x} ${y} ${w} ${h}`}
        style={{ width: `${w / 1000}em`, height: `${h / 1000}em` }}
      >
        <defs>
          <linearGradient id={`ink-${id}`} x1="0" y1="0" x2="1" y2="0.35">
            <stop offset="0%" stopColor="#e7cfff" />
            <stop offset="45%" stopColor="#b48fd9" />
            <stop offset="100%" stopColor="#8a51c4" />
          </linearGradient>
        </defs>
        <path d={glyph.d} pathLength={1} style={{ fill: `url(#ink-${id})` }} />
      </svg>
    </span>
  );
}
