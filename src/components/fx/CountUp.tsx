"use client";

import { useEffect, useRef, useState } from "react";

/** A number that runs up from zero the first time it is seen. Renders the real value without JS. */
export function CountUp({ to, ms = 1400 }: { to: number; ms?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(to);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    let raf = 0;
    setN(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / ms);
        setN(Math.round(to * (1 - Math.pow(1 - k, 4))));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, ms]);
  return (
    <span ref={ref} className="tabular-nums">
      {n}
    </span>
  );
}
