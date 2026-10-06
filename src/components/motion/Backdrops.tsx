"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* A single, restrained ambient wash — one accent, softly drifting. */
export function Aurora({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div
        className="absolute left-1/2 top-[-20%] h-[70vw] w-[70vw] -translate-x-1/2 rounded-full opacity-[0.5] blur-[130px] animate-drift will-anim"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(124,92,255,0.20), transparent 62%)",
        }}
      />
    </div>
  );
}

/* Parallax wrapper — subtle translate driven by scroll. */
export function Parallax({
  children,
  distance = 60,
  className,
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <m.div ref={ref} style={{ y, willChange: "transform" }} className={className}>
      {children}
    </m.div>
  );
}

/* Thin decorative hairline with a slow travelling highlight. */
export function Beam({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-px w-full overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0 bg-white/8" />
      <m.div
        className="absolute top-0 h-px w-1/4 bg-gradient-to-r from-transparent via-[rgb(var(--accent))]/70 to-transparent"
        animate={{ x: ["-40%", "360%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
