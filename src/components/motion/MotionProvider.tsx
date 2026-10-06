"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

const loadFeatures = () => import("./features").then((mod) => mod.default);

/**
 * Every animation renders `m.*`, whose animation code arrives in a separate
 * chunk after hydration instead of in every page's first bundle. `strict`
 * makes a stray `motion.*` fail loudly, since it would pull the full bundle back.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
