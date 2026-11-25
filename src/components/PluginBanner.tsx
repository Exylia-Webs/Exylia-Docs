"use client";

import { useState } from "react";
import type { Plugin } from "@/content/registry";

/**
 * A plugin's key art, with the monogram as its fallback.
 *
 * Every plugin declares a banner URL whether or not the file has been uploaded
 * yet, so the load error is the normal path for anything new: the component
 * swaps to a tinted monogram of the same shape, which keeps the grid aligned
 * instead of collapsing a card the day a banner is missing.
 */
export function PluginBanner({
  plugin,
  className = "",
  rounded = "rounded-lg",
  priority = false,
}: {
  plugin: Plugin;
  className?: string;
  rounded?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const monogram = plugin.name.replace("Exylia", "").slice(0, 2).toUpperCase();

  return (
    <span
      style={{ containerType: "inline-size" }}
      className={`relative block overflow-hidden ${rounded} border border-line bg-paper ${className}`}
    >
      {failed ? (
        <span className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_70%)]">
          <span className="font-display text-[clamp(0.9rem,7cqw,2.4rem)] font-semibold tracking-tight2 text-ink-2">
            {monogram}
          </span>
        </span>
      ) : (
        <img
          src={plugin.banner}
          alt=""
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </span>
  );
}
