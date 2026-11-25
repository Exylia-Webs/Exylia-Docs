"use client";

import { AnimatePresence, m } from "motion/react"; // domain animation (layoutId indicators, springs) the library helpers do not express; shares ThemeProvider's LazyMotion
import { SearchInput } from "@exylia-webs/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import type { SearchEntry } from "@/lib/docs";
import { dict } from "@/content/dictionary";
import type { Lang } from "@/content/registry";

export type Hit = SearchEntry & { score: number };

/** An entry with its fields lowercased once, not on every keystroke. */
export type Prepared = { entry: SearchEntry; title: string; description: string; sections: string[] };

export const prepare = (entries: SearchEntry[]): Prepared[] =>
  entries.map((entry) => ({
    entry,
    title: entry.title.toLowerCase(),
    description: entry.description.toLowerCase(),
    sections: entry.sections.map((s) => s.text.toLowerCase()),
  }));

/** Cheap ranking: title hits beat description hits beat body hits. */
export function rank(prepared: Prepared[], query: string, limit = 8): Hit[] {
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
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** One request per language per page load, shared by every open of the dialog. */
const indexes = new Map<Lang, Promise<SearchEntry[]>>();

export function loadIndex(lang: Lang): Promise<SearchEntry[]> {
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
            className="absolute inset-0 bg-canvas/75 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          <m.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-paper/92 shadow-2xl shadow-black/60 backdrop-blur-2xl"
            role="dialog"
            aria-modal
          >
            <div className="border-b border-line p-3">
              <SearchInput
                ref={inputRef}
                value={query}
                onChange={setQuery}
                debounceMs={0}
                onKeyDown={onKeyDown}
                placeholder={dict.search.placeholder[lang]}
              />
            </div>

            <div className="max-h-[52vh] overflow-y-auto scroll-thin p-2">
              {query && !entries && (
                <p className="px-3 py-8 text-center font-mono text-ui-xs uppercase tracking-[0.18em] text-ink-3 animate-pulse">
                  {dict.search.loading[lang]}
                </p>
              )}

              {query && entries && hits.length === 0 && (
                <p className="px-3 py-8 text-center text-ui-sm text-ink-3">
                  {dict.search.noResults[lang]} <span className="text-ink-2">{query}</span>
                </p>
              )}

              {!query && (
                <p className="px-3 py-8 text-center font-mono text-ui-xs uppercase tracking-[0.18em] text-ink-3">
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
                    i === cursor ? "bg-sunk" : "hover:bg-hover"
                  }`}
                >
                  {i === cursor && (
                    <m.span
                      layoutId="search-cursor"
                      className="absolute left-0 top-1/2 h-5 w-px -translate-y-1/2 bg-accent"
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <span className="font-display text-ui-base font-medium text-ink">{hit.title}</span>
                    <span className="font-mono text-ui-xs uppercase tracking-[0.14em] text-ink-3">
                      {hit.pluginName} · {hit.group}
                    </span>
                  </div>
                  {hit.description && (
                    <p className="mt-0.5 line-clamp-1 text-ui-sm text-ink-3">{hit.description}</p>
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-ui-xs uppercase tracking-[0.14em] text-ink-3">
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
