"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { plugins, type Lang, type Plugin } from "@/content/registry";
import { PluginBanner } from "@/components/PluginBanner";
import { tint } from "./Catalog";

const ROWS = 4;

/**
 * Every plugin's key art on a tilted plane under the hero, rows sliding in opposite directions. The
 * plane straightens as it scrolls up into view and leans a little toward the cursor; a banner under
 * the cursor stops its row and tints the page. Full width: it is the page's own floor, not a card.
 */
export function BannerWall({ lang, ids }: { lang: Lang; ids: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = plugins.filter((p) => ids.includes(p.id));
  const rows = Array.from({ length: ROWS }, (_, r) => shown.filter((_, i) => i % ROWS === r));

  useEffect(() => {
    const el = ref.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const set = (k: string, v: number) => el.style.setProperty(k, v.toFixed(3));
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        // 0 when the wall's top is at the bottom of the window, 1 when its middle reaches the middle.
        set("--p", Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.5 + r.height * 0.5))));
      });
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      set("--mx", e.clientX / innerWidth - 0.5);
      set("--my", e.clientY / innerHeight - 0.5);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="wall relative -mt-6 h-[clamp(22rem,62vw,44rem)] overflow-hidden sm:-mt-10">
      <div className="wall-plane absolute left-1/2 top-1/2 flex w-[180vw] flex-col gap-[clamp(10px,1.4vw,22px)]">
        {rows.map((row, r) => (
          <div key={r} className="wall-row flex w-max gap-[clamp(10px,1.4vw,22px)]" style={{ ["--d" as string]: `${70 + r * 14}s` }} data-rev={r % 2 ? "" : undefined}>
            {[...row, ...row].map((plugin, i) => (
              <Tile key={`${plugin.id}-${i}`} plugin={plugin} lang={lang} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Tile({ plugin, lang }: { plugin: Plugin; lang: Lang }) {
  const ready = plugin.nav.length > 0;
  return (
    <Link
      href={ready ? `/${lang}/docs/${plugin.id}/` : `/${lang}/#plugins`}
      tabIndex={-1}
      onPointerEnter={() => tint(plugin.id)}
      onPointerLeave={() => tint(null)}
      className="wall-tile block w-[clamp(200px,24vw,380px)] shrink-0"
    >
      <PluginBanner plugin={plugin} rounded="rounded-[clamp(10px,1vw,16px)]" className="aspect-[2/1] w-full" />
    </Link>
  );
}
