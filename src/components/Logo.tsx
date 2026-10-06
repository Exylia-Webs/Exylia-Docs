"use client";

import Image from "next/image";
import { m } from "framer-motion";

const OFFICIAL_LOGO = "/exylia-mark.webp";

export function Logo({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <m.div
        className="relative aspect-square h-full shrink-0"
        animate={{ y: [0, -1, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src={OFFICIAL_LOGO}
          alt="Exylia"
          fill
          sizes="28px"
          className="object-contain"
          priority
        />
      </m.div>
      <span className="font-display text-[16px] font-semibold tracking-tight2 text-white">
        Exylia
      </span>
    </div>
  );
}
