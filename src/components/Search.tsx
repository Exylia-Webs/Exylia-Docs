"use client";

import { AnimatePresence, m } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import type { SearchEntry } from "@/lib/docs";
import { dict } from "@/content/dictionary";
import type { Lang } from "@/content/registry";

type Hit = SearchEntry & { score: number };

/** An entry with its fields lowercased once, not on every keystroke. */
type Prepared = { entry: SearchEntry; title: string; description: string; sections: string[] };

const prepare = (entries: SearchEntry[]): Prepared[] =>
  entries.map((entry) => ({
    entry,
    title: entry.title.toLowerCase(),
    description: entry.description.toLowerCase(),
    sections: entry.sections.map((s) => s.text.toLowerCase()),
  }));

/** Cheap ranking: title hits beat description hits beat body hits. */
function rank(prepared: Prepared[], query: string): Hit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/);
  const hits: Hit[] = [];

  for (const { entry, title, description, sections } of prepared) {
    let score = 0;
    for (const word of words) {
      if (title === word) score += 60;
      else if (title.startsWith(word)) score += 40;
      else if (title.includes(word)) score += 26;
      if (description.includes(word)) score += 10;
      if (sections.some((text) => text.includes(word))) score += 14;
      if (entry.haystack.includes(word)) score += 4;
      else score -= 12;
    }
    if (score > 0) hits.push({ ...entry, score });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 8);
}

/** One request per language per page load, shared by every open of the dialog. */
const indexes = new Map<Lang, Promise<SearchEntry[]>>();

function loadIndex(lang: Lang): Promise<SearchEntry[]> {
  let index = indexes.get(lang);
  if (!index) {
    index = fetch(`/${lang}/search-index.json`).then((res) => {
      if (!res.ok) throw new Error(`search index: HTTP ${res.status}`);
      return res.json() as Promise<SearchEntry[]>;
    });
    // A failed download is retried on the next open instead of being remembered.
    index.catch(() => indexes.delete(lang));
    indexes.set(lang, index);
  }
  return index;
}

export function SearchDialog({
  lang,
  open,
  onClose,
}: {
  lang: Lang;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || entries) return;
    let live = true;
    loadIndex(lang)
      .then((loaded) => live && setEntries(loaded))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [open, entries, lang]);

  const prepared = useMemo(() => prepare(entries ?? []), [entries]);
  // Typing stays responsive on a phone: ranking catches up instead of blocking each key.
  const deferredQuery = useDeferredValue(query);
  const hits = useMemo(() => rank(prepared, deferredQuery), [prepared, deferredQuery]);

  useEffect(() => setCursor(0), [query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = useCallback(
    (hit: Hit) => {
      onClose();
      router.push(`/${lang}/docs/${hit.plugin}/${hit.slug}`);
    },
    [lang, onClose, router],
  );

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((c) => Math.min(c + 1, hits.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (event.key === "Enter" && hits[cursor]) {
      event.preventDefault();
      go(hits[cursor]);
    } else if (event.key === "Escape") {
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-ink-950/75 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          <m.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-ink-900/92 shadow-2xl shadow-black/60 backdrop-blur-2xl"
            role="dialog"
            aria-modal
          >
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-4">
              <svg className="h-4 w-4 shrink-0 text-white/30" viewBox="0 0 16 16" fill="none">
                <circle cx="7.2" cy="7.2" r="4.4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.6 10.6L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={dict.search.placeholder[lang]}
                className="h-14 w-full bg-transparent text-[15px] text-white placeholder:text-white/25 focus:outline-none"
              />
              <kbd className="hidden shrink-0 rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/30 sm:block">
                ESC
              </kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto scroll-thin p-2">
              {query && !entries && (
                <p className="px-3 py-8 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-white/25 animate-pulse">
                  {dict.search.loading[lang]}
                </p>
              )}

              {query && entries && hits.length === 0 && (
                <p className="px-3 py-8 text-center text-[13.5px] text-white/35">
                  {dict.search.noResults[lang]} <span className="text-white/70">{query}</span>
                </p>
              )}

              {!query && (
                <p className="px-3 py-8 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-white/25">
                  {dict.search.empty[lang]}
                </p>
              )}

              {hits.map((hit, i) => (
                <Link
                  key={`${hit.plugin}/${hit.slug}`}
                  href={`/${lang}/docs/${hit.plugin}/${hit.slug}`}
                  onClick={onClose}
                  onMouseEnter={() => setCursor(i)}
                  className={`relative block rounded-lg px-3 py-2.5 transition-colors ${
                    i === cursor ? "bg-white/[0.055]" : "hover:bg-white/[0.03]"
                  }`}
                >
                  {i === cursor && (
                    <m.span
                      layoutId="search-cursor"
                      className="absolute left-0 top-1/2 h-5 w-px -translate-y-1/2 bg-[rgb(var(--accent))]"
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[14.5px] font-medium text-white">{hit.title}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/25">
                      {hit.pluginName} · {hit.group}
                    </span>
                  </div>
                  {hit.description && (
                    <p className="mt-0.5 line-clamp-1 text-[13px] text-white/40">{hit.description}</p>
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 border-t border-white/[0.07] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/25">
              <span>↑↓ {dict.search.navigate[lang]}</span>
              <span>↵ {dict.search.open[lang]}</span>
              <span className="ml-auto">
                {entries ? `${entries.length} ${dict.search.pages[lang]}` : "…"}
              </span>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

/** Opens the dialog, and owns the ⌘K / Ctrl+K shortcut. */
export function useSearchHotkey(onOpen: () => void) {
  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpen();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpen]);
}
