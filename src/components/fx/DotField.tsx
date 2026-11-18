"use client";

import { useEffect, useRef } from "react";

/**
 * A field of dots behind the top of the page, as wide as the window. A slow swell runs through it,
 * the cursor parts it and lights it up, and a click sends a ring through it. With no mouse (phones) a
 * soft light wanders by itself. Fixed to the viewport so it is never cut by a column; it fades as the
 * page scrolls away and stops drawing once gone. Reduced motion: a still field.
 */
export function DotField({ tinted = false, className = "z-0" }: { tinted?: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const GAP = 26;
    const R = 170;
    let rgb = "235,235,242";
    if (tinted) {
      const a = getComputedStyle(canvas).getPropertyValue("--accent").trim().split(/\s+/);
      // Lifted toward white: the raw plugin colour is too dark to read as dots on the dark page.
      if (a.length === 3) rgb = a.map((c) => Math.round(+c + (255 - +c) * 0.4)).join(",");
    }

    let w = 0, h = 0, dpr = 1;
    let bx = new Float32Array(0), by = bx, ox = bx, oy = bx, vx = bx, vy = bx, lit = bx;
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth;
      h = innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const cols = Math.ceil(w / GAP) + 1, rows = Math.ceil(h / GAP) + 1, n = cols * rows;
      [bx, by, ox, oy, vx, vy, lit] = Array.from({ length: 7 }, () => new Float32Array(n));
      const x0 = (w - (cols - 1) * GAP) / 2;
      for (let i = 0; i < n; i++) {
        bx[i] = x0 + (i % cols) * GAP;
        by[i] = Math.floor(i / cols) * GAP + GAP / 2;
      }
    };

    // Cursor (eased), autopilot until a real mouse shows up, and the rings from clicks.
    const m = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, real: false };
    const rings: { x: number; y: number; t: number }[] = [];
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      m.real = true;
      m.tx = e.clientX;
      m.ty = e.clientY;
    };
    const down = (e: PointerEvent) => {
      if (fade > 0.05) rings.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (rings.length > 4) rings.shift();
    };
    const leave = () => {
      m.real = false;
    };

    let fade = 1;
    const scroll = () => {
      fade = Math.max(0, 1 - scrollY / (h * 0.9));
      canvas.style.opacity = String(fade);
    };

    const draw = (now: number) => {
      const t = now / 1000;
      if (!m.real) {
        m.tx = w * (0.5 + 0.32 * Math.sin(t * 0.23));
        m.ty = h * (0.42 + 0.22 * Math.sin(t * 0.31 + 1.3));
      }
      m.x += (m.tx - m.x) * (m.real ? 0.18 : 0.04);
      m.y += (m.ty - m.y) * (m.real ? 0.18 : 0.04);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // A soft light under the cursor.
      const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, R * 2.2);
      g.addColorStop(0, `rgba(${rgb},${m.real ? 0.07 : 0.045})`);
      g.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const live = rings.filter((r) => now - r.t < 1800);
      for (let i = 0; i < bx.length; i++) {
        const x = bx[i], y = by[i];
        // The swell: two slow waves crossing.
        const wave = Math.sin(x * 0.011 + t * 0.9) * Math.cos(y * 0.013 - t * 0.6);
        let fx = 0, fy = 0, glow = 0;

        const dx = x + ox[i] - m.x, dy = y + oy[i] - m.y, d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1, k = 1 - d / R;
          fx += (dx / d) * k * k * 5;
          fy += (dy / d) * k * k * 5;
          glow = k;
        }
        for (const r of live) {
          const age = (now - r.t) / 1000, rad = age * 620;
          const rx = x - r.x, ry = y - r.y, d = Math.hypot(rx, ry) || 1, band = 1 - Math.abs(d - rad) / 46;
          if (band > 0) {
            const k = band * (1 - age / 1.8);
            fx += (rx / d) * k * 9;
            fy += (ry / d) * k * 9;
            glow = Math.max(glow, k);
          }
        }

        // Spring back home, damped.
        vx[i] = (vx[i] + fx - ox[i] * 0.06) * 0.84;
        vy[i] = (vy[i] + fy - oy[i] * 0.06) * 0.84;
        ox[i] += vx[i];
        oy[i] += vy[i];
        lit[i] += (glow - lit[i]) * 0.12;

        const l = lit[i];
        const a = 0.13 + (wave + 1) * 0.1 + l * 0.8;
        const s = 1.1 + (wave + 1) * 0.35 + l * 1.9;
        ctx.fillStyle = `rgba(${rgb},${a.toFixed(3)})`;
        ctx.fillRect(x + ox[i] + wave * 3 - s / 2, y + oy[i] + wave * 3 - s / 2, s, s);
      }
    };

    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (fade > 0 && !document.hidden) draw(now);
    };

    const resize = () => {
      size();
      if (still) draw(0);
    };
    size();
    scroll();
    addEventListener("resize", resize);
    addEventListener("scroll", scroll, { passive: true });
    if (still) {
      draw(0);
    } else {
      addEventListener("pointermove", move, { passive: true });
      addEventListener("pointerdown", down, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("scroll", scroll);
      removeEventListener("pointermove", move);
      removeEventListener("pointerdown", down);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [tinted]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none fixed inset-0 h-full w-full [mask-image:linear-gradient(to_bottom,#000_55%,transparent)] ${className}`}
    />
  );
}
