"use client";

import {
  m,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode, type CSSProperties } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------------- Reveal: fade + rise on scroll ---------------- */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "span" | "li" | "section";
  once?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-12% 0px -12% 0px" });
  const MC = m[as];
  return (
    <MC
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE, delay }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </MC>
  );
}

/* ---------------- BlurIn: blur + fade ---------------- */
export function BlurIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <m.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, filter: "blur(14px)", y: 16 }}
      animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
      transition={{ duration: 1, ease: EASE, delay }}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </m.div>
  );
}

/**
 * Split a string into animated words.
 *
 * Pure CSS (`.word-in` in globals.css): headlines are usually the largest paint,
 * and a JavaScript-driven fade would keep them invisible until hydration.
 */
export function AnimatedWords({
  text,
  className,
  wordClassName,
  gradientLast,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  gradientLast?: boolean;
}) {
  const words = text.split(" ");
  return (
    <span className={className} style={{ display: "inline-block" }}>
      {words.map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden" }}>
          <span
            className={`word-in ${wordClassName ?? ""} ${
              gradientLast && i === words.length - 1 ? "accent-ink" : ""
            }`}
            style={{ paddingRight: "0.25em", animationDelay: `${0.1 + i * 0.08}s` }}
          >
            {w}
          </span>
        </span>
      ))}
    </span>
  );
}

/* ---------------- Magnetic: soft pointer spotlight ---------------- */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(50);
  const y = useMotionValue(50);
  const sx = useSpring(x, { stiffness: 180, damping: 24, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 180, damping: 24, mass: 0.35 });
  const glowOpacity = useMotionValue(0);
  const sGlowOpacity = useSpring(glowOpacity, { stiffness: 180, damping: 24, mass: 0.35 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width) * 100);
    y.set(((e.clientY - r.top) / r.height) * 100);
    glowOpacity.set(1);
  }

  function reset() {
    x.set(50);
    y.set(50);
    glowOpacity.set(0);
  }

  return (
    <m.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => glowOpacity.set(1)}
      onMouseLeave={reset}
      style={{ "--pointer-x": sx, "--pointer-y": sy } as CSSProperties}
      className={`group/pointer relative overflow-visible ${className ?? ""}`}
    >
      <m.span
        aria-hidden
        className="pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(circle_at_var(--pointer-x)_var(--pointer-y),rgba(124,92,255,0.3),transparent_42%)] blur-xl"
        style={{ opacity: sGlowOpacity }}
      />
      {children}
    </m.div>
  );
}

/* ---------------- Tilt: 3D pointer tilt for cards ---------------- */
export function Tilt({
  children,
  className,
  max = 8,
  style,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max);
    rx.set(-py * max);
  }
  function reset() {
    rx.set(0);
    ry.set(0);
  }
  return (
    <m.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900, transformStyle: "preserve-3d", ...style }}
    >
      {children}
    </m.div>
  );
}

/* ---------------- Floating element ---------------- */
export function Floating({
  children,
  amplitude = 12,
  duration = 7,
  delay = 0,
  className,
}: {
  children: ReactNode;
  amplitude?: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      style={{ willChange: "transform" }}
    >
      {children}
    </m.div>
  );
}

/* ---------------- TextReveal: line masked clip-up reveal ---------------- */
export function TextReveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "span" | "h2" | "h3" | "p";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const MC = m[as];
  return (
    <span ref={ref} style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.08em" }}>
      <MC
        className={className}
        initial={{ y: "115%", opacity: 0 }}
        animate={inView ? { y: "0%", opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: EASE, delay }}
        style={{ display: "inline-block", willChange: "transform" }}
      >
        {children}
      </MC>
    </span>
  );
}

/* ---------------- LineReveal: an animated hairline that draws in ---------------- */
export function LineReveal({ delay = 0, className = "" }: { delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <m.span
      ref={ref}
      className={`block h-px w-full origin-left bg-white/10 ${className}`}
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration: 1, ease: EASE, delay }}
      style={{ willChange: "transform" }}
    />
  );
}

/* ---------------- Reveal char-level stagger ---------------- */
export function AnimatedChars({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const chars = Array.from(text);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return (
    <m.span
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{ show: { transition: { staggerChildren: 0.025, delayChildren: delay } } }}
      style={{ display: "inline-block" }}
    >
      {chars.map((c, i) => (
        <m.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: "0.5em" },
            show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
          }}
          style={{ display: "inline-block", whiteSpace: c === " " ? "pre" : "normal", willChange: "transform" }}
        >
          {c}
        </m.span>
      ))}
    </m.span>
  );
}

/* ---------------- Scroll-linked parallax hook ---------------- */
export function useParallax(distance = 60) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [distance, -distance]), {
    stiffness: 80,
    damping: 20,
    mass: 0.4,
  });
  return { ref, y };
}

/* ---------------- HoverCard: lift + settle on hover ---------------- */
export function HoverLift({
  children,
  className,
  lift = -4,
}: {
  children: ReactNode;
  className?: string;
  lift?: number;
}) {
  return (
    <m.div
      className={className}
      whileHover={{ y: lift }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ willChange: "transform" }}
    >
      {children}
    </m.div>
  );
}

export { EASE };
