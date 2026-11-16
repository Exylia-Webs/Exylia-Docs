"use client";

import Lenis from "lenis";
import { useLayoutEffect } from "react";

/**
 * Inertial wheel scrolling for the landing only. Touch keeps the native scroll,
 * reduced motion keeps everything native, and anything marked
 * `data-lenis-prevent` (the search dialog list) scrolls on its own.
 */
export function SmoothScroll() {
  // Layout effect: its cleanup runs before Next scrolls the next page to the top, so a
  // glide still in flight cannot drag the new page down to where the landing was.
  useLayoutEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -96 } });
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });
    // The docs pages keep native smooth anchors; Lenis does it here, and both would fight.
    document.documentElement.style.scrollBehavior = "auto";
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);
  return null;
}
