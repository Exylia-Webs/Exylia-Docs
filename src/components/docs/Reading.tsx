"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Which pages of a plugin this reader has finished, kept in localStorage by the
 * page's stable id (the same in every language). A page counts as read once
 * its end scrolls into view. Per-browser on purpose: nothing to sign in to.
 */
const EVENT = "exylia-read";
const key = (plugin: string) => `exylia-read:${plugin}`;
const EMPTY: string[] = [];
const cache = new Map<string, { raw: string | null; ids: string[] }>();

function readIds(plugin: string): string[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key(plugin));
  } catch {
    return EMPTY;
  }
  const hit = cache.get(plugin);
  if (hit && hit.raw === raw) return hit.ids;
  let ids = EMPTY;
  try {
    ids = raw ? (JSON.parse(raw) as string[]) : EMPTY;
  } catch {}
  cache.set(plugin, { raw, ids });
  return ids;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** The ids read so far; empty on the server and before hydration. */
export function useReadPages(plugin: string): string[] {
  return useSyncExternalStore(subscribe, () => readIds(plugin), () => EMPTY);
}

function markRead(plugin: string, id: string) {
  const ids = readIds(plugin);
  if (ids.includes(id)) return;
  try {
    localStorage.setItem(key(plugin), JSON.stringify([...ids, id]));
  } catch {
    return;
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Invisible marker at the end of an article: seeing it marks the page read. */
export function ReadMarker({ plugin, id }: { plugin: string; id: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Also when it is already above the screen: a jump to the end skips past it.
    const io = new IntersectionObserver(([e]) => (e.isIntersecting || e.boundingClientRect.top < 0) && markRead(plugin, id));
    io.observe(el);
    return () => io.disconnect();
  }, [plugin, id]);
  return <span ref={ref} aria-hidden className="block h-px" />;
}

/** ← and → walk the reading order, unless the reader is typing somewhere. */
export function KeyNav({ previous, next }: { previous?: string; next?: string }) {
  const router = useRouter();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable=true]")) return;
      const href = e.key === "ArrowLeft" ? previous : e.key === "ArrowRight" ? next : undefined;
      if (href) router.push(href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previous, next, router]);
  return null;
}

/** A small tick shown next to a page the reader has finished. */
export function ReadTick({ className = "" }: { className?: string }) {
  return (
    <svg className={`h-3 w-3 shrink-0 text-[#8fffc1]/70 ${className}`} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
