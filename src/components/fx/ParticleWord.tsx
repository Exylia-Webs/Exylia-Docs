"use client";

import { useEffect, useRef } from "react";

/**
 * A word drawn with a few thousand particles: they gather from a scattered
 * cloud when the canvas scrolls into view, the cursor pushes them aside and
 * they settle back. 2D canvas, sampled from the word rendered in the display
 * font. Under reduced motion the word is drawn settled, once.
 */
export function ParticleWord({ word, tinted = false, className = "" }: { word: string; tinted?: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = false;
    let started = false;
    let px: Float32Array, py: Float32Array, tx: Float32Array, ty: Float32Array, vx: Float32Array, vy: Float32Array, hue: Uint8Array;
    let count = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(devicePixelRatio, 2);
    const mouse = { x: -9999, y: -9999 };
    // Silver by default; under a plugin, white at the top of the letters fading into its colour.
    const accent = tinted ? getComputedStyle(canvas).getPropertyValue("--accent").trim().split(/\s+/).map(Number) : null;
    const palette = accent?.length === 3
      ? [0, 0.25, 0.5, 0.75, 1].map((t) => `rgb(${accent.map((c) => Math.round(255 + (c - 255) * t)).join(",")})`)
      : ["#ffffff", "#e4e4ea", "#c2c2cc", "#9a9aa6", "#6e6e7a"];

    const build = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const o = off.getContext("2d")!;
      const family = getComputedStyle(canvas).fontFamily;
      let size = h * 0.92;
      o.font = `600 ${size}px ${family}`;
      const fit = (w * 0.96) / o.measureText(word).width;
      if (fit < 1) size *= fit;
      o.font = `600 ${size}px ${family}`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillText(word, w / 2, h * 0.54);
      const data = o.getImageData(0, 0, w, h).data;
      const gap = w < 700 ? 3 : 4;
      const pts: number[] = [];
      for (let y = 0; y < h; y += gap) for (let x = 0; x < w; x += gap) if (data[(y * w + x) * 4 + 3] > 140) pts.push(x, y);
      count = pts.length / 2;
      px = new Float32Array(count);
      py = new Float32Array(count);
      tx = new Float32Array(count);
      ty = new Float32Array(count);
      vx = new Float32Array(count);
      vy = new Float32Array(count);
      hue = new Uint8Array(count);
      for (let i = 0; i < count; i++) {
        tx[i] = pts[i * 2] + (Math.random() - 0.5) * gap * 0.8;
        ty[i] = pts[i * 2 + 1] + (Math.random() - 0.5) * gap * 0.8;
        const a = Math.random() * Math.PI * 2;
        const r = (0.4 + Math.random()) * w * 0.6;
        px[i] = reduced ? tx[i] : w / 2 + Math.cos(a) * r;
        py[i] = reduced ? ty[i] : h / 2 + Math.sin(a) * r * 0.6;
        // Light at the top of the letters, deepest at the foot.
        hue[i] = Math.min(4, Math.floor((ty[i] / h) * 5 + Math.random() * 0.8));
      }
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (let k = 0; k < palette.length; k++) {
        ctx.fillStyle = palette[k];
        for (let i = 0; i < count; i++) if (hue[i] === k) ctx.fillRect(px[i], py[i], 1.8, 1.8);
      }
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const R = 90;
      for (let i = 0; i < count; i++) {
        const dx = px[i] - mouse.x;
        const dy = py[i] - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const f = (1 - Math.sqrt(d2) / R) * 2.2;
          const d = Math.sqrt(d2) || 1;
          vx[i] += (dx / d) * f;
          vy[i] += (dy / d) * f;
        }
        vx[i] = (vx[i] + (tx[i] - px[i]) * 0.028) * 0.86;
        vy[i] = (vy[i] + (ty[i] - py[i]) * 0.028) * 0.86;
        px[i] += vx[i];
        py[i] += vy[i];
      }
      draw();
    };

    const start = () => {
      if (started) return;
      started = true;
      build();
      if (reduced) return draw();
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) document.fonts.ready.then(start);
    });
    io.observe(canvas);
    const onMove = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      mouse.x = e.clientX - b.left;
      mouse.y = e.clientY - b.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    const ro = new ResizeObserver(() => {
      if (!started || canvas.clientWidth === w) return;
      build();
      if (reduced) draw();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [word, tinted]);

  return <canvas ref={ref} aria-hidden className={`block w-full font-display ${className}`} />;
}
