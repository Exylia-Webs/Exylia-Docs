"use client";

import { useEffect, useRef, useState } from "react";
import { useSeen } from "./Ink";

/** A number that counts up once it scrolls into view. Server HTML has the final value. */
export function CountUp({ to, duration = 1600, className = "" }: { to: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useSeen(ref);
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    if (!seen) {
      setValue((v) => (v === null && !matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : v));
      return;
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setValue(to);
    const start = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const k = Math.min(1, (now - start) / duration);
      setValue(Math.round(to * (1 - Math.pow(1 - k, 4))));
      if (k < 1) raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {(value ?? to).toLocaleString("en-US")}
    </span>
  );
}
