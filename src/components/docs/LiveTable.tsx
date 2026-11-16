"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { dict } from "@/content/dictionary";
import type { Lang } from "@/content/registry";
import { slugify } from "@/lib/slug";

/** Tables shorter than this read at a glance; a filter would only add noise. */
const FILTER_FROM = 8;

/**
 * A reference table that works like a tool: every value copies with a click, every row has its own
 * link (`#row-<first cell>`), and long tables get a filter. The rows are server-rendered; this only
 * decorates them, so the table reads the same with JavaScript off.
 */
export function LiveTable({ children, lang }: { children: ReactNode; lang: Lang }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<HTMLTableRowElement[]>([]);
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(0);
  const t = dict.docs;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const body = [...root.querySelectorAll<HTMLTableRowElement>("tbody tr")];
    setRows(body);
    setShown(body.length);

    for (const row of body) {
      const first = row.cells[0];
      const key = first?.textContent?.trim();
      if (!first || !key || row.id) continue;
      row.id = `row-${slugify(key)}`;
      const anchor = document.createElement("a");
      anchor.href = `#${row.id}`;
      anchor.className = "row-anchor";
      anchor.setAttribute("aria-label", `${t.rowLink[lang]}: ${key}`);
      anchor.textContent = "#";
      first.append(anchor);
    }
    for (const code of root.querySelectorAll<HTMLElement>("td code:not(.copyable)")) {
      code.classList.add("copyable");
      code.tabIndex = 0;
      code.setAttribute("role", "button");
      code.title = t.copyValue[lang];
    }

    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target && root.contains(target)) target.scrollIntoView({ block: "center" });

    const copy = async (code: HTMLElement) => {
      try {
        await navigator.clipboard.writeText(code.textContent ?? "");
      } catch {
        return;
      }
      code.setAttribute("data-copied", "");
      code.title = t.copied[lang];
      setTimeout(() => {
        code.removeAttribute("data-copied");
        code.title = t.copyValue[lang];
      }, 1400);
    };
    /* Chips that are already CopyableCode handle themselves; only the plain ones are ours. */
    const pick = (e: Event) => {
      const code = (e.target as HTMLElement).closest<HTMLElement>("td code.copyable:not([aria-label])");
      return code && root.contains(code) ? code : null;
    };
    const onClick = (e: MouseEvent) => {
      const code = pick(e);
      if (code) copy(code);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const code = pick(e);
      if (!code) return;
      e.preventDefault();
      copy(code);
    };
    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKey);
    };
  }, [lang, t]);

  useEffect(() => {
    const needle = query.trim().toLowerCase();
    let count = 0;
    for (const row of rows) {
      const hit = !needle || (row.textContent ?? "").toLowerCase().includes(needle);
      row.hidden = !hit;
      if (hit) count++;
    }
    setShown(count);
  }, [query, rows]);

  return (
    <div ref={ref} className="live-table">
      {rows.length >= FILTER_FROM && (
        <div className="not-prose mb-1 flex items-center gap-3">
          <label className="flex h-9 flex-1 items-center gap-2.5 rounded-lg border border-white/[0.08] px-3 transition-colors focus-within:border-[rgb(var(--accent)/0.5)] sm:max-w-xs">
            <svg className="h-3.5 w-3.5 shrink-0 text-white/30" viewBox="0 0 16 16" fill="none" aria-hidden>
              <circle cx="7.2" cy="7.2" r="4.4" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.6 10.6L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setQuery("")}
              placeholder={t.filterRows[lang]}
              aria-label={t.filterRows[lang]}
              className="w-full bg-transparent text-base text-white placeholder:text-white/30 focus:outline-none sm:text-[13.5px]"
            />
          </label>
          <span className="text-[12.5px] tabular-nums text-white/35">
            {query ? t.rowsShown[lang].replace("{n}", String(shown)).replace("{total}", String(rows.length)) : t.rowsTotal[lang].replace("{n}", String(rows.length))}
          </span>
        </div>
      )}
      <div className="table-wrap">{children}</div>
      {query && shown === 0 && <p className="not-prose py-4 text-[13.5px] text-white/40">{t.noRows[lang]}</p>}
    </div>
  );
}
