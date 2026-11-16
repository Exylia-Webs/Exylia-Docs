"use client";

import { useRef, useState } from "react";
import { dict } from "@/content/dictionary";
import type { Lang } from "@/content/registry";
import type { KeyNote } from "@/lib/config-map";

export type ExplorerLine = { text: string; path?: string; anchor: string; note?: KeyNote };
export type ExplorerFile = { name: string; lines: ExplorerLine[] };

/** `code` spans in a note, without pulling a markdown renderer into the client. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) =>
        i % 2 ? (
          <code key={i} className="rounded bg-[rgb(var(--accent)/0.1)] px-1 py-px font-mono text-[0.88em] text-[color-mix(in_srgb,rgb(var(--accent))_45%,#fff)]">
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** One yaml line, key in the plugin colour, value plain, comment faint. */
function Yaml({ text }: { text: string }) {
  if (text.trimStart().startsWith("#")) return <span className="text-white/30">{text}</span>;
  const m = /^(\s*(?:- )?)([^:]+:)(.*)$/.exec(text);
  if (!m) return <span className="text-white/60">{text}</span>;
  const [, lead, key, rest] = m;
  const hash = rest.indexOf(" #");
  return (
    <>
      {lead}
      <span className="text-[color-mix(in_srgb,rgb(var(--accent))_55%,#fff)]">{key}</span>
      <span className="text-white/60">{hash >= 0 ? rest.slice(0, hash) : rest}</span>
      {hash >= 0 && <span className="text-white/30">{rest.slice(hash)}</span>}
    </>
  );
}

/**
 * The configuration files of a page as the server owner sees them, with the page's own explanation of
 * whatever key is under the cursor. A native <dialog>: Escape, focus trap and the backdrop come free.
 */
export function ConfigExplorer({ files, lang }: { files: ExplorerFile[]; lang: Lang }) {
  const t = dict.docs;
  const ref = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState(0);
  const [pick, setPick] = useState<ExplorerLine | null>(null);
  const keys = files.reduce((n, f) => n + f.lines.filter((l) => l.path).length, 0);
  const file = files[tab];
  const value = pick?.note?.value ?? (pick ? /:\s*(.+)$/.exec(pick.text)?.[1] : undefined);

  return (
    <>
      <button
        onClick={() => ref.current?.showModal()}
        className="not-prose group mb-10 flex w-full items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-left transition-colors hover:border-[rgb(var(--accent)/0.45)] hover:bg-[rgb(var(--accent)/0.05)]"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[rgb(var(--accent)/0.12)] text-[rgb(var(--accent))]">
          <svg className="h-[18px] w-[18px]" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M2.5 3.5h4l1 1.5h6v7.5h-11z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M5 8.5h6M5 10.5h3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-medium text-white">{t.explore[lang]}</span>
          <span className="block truncate text-[13px] text-white/45">
            {files.map((f) => f.name).join(" · ")} — {t.exploreKeys[lang].replace("{n}", String(keys))}
          </span>
        </span>
        <span className="hidden text-[13px] text-white/35 transition-colors group-hover:text-white sm:block">{t.exploreHint[lang]} →</span>
      </button>

      <dialog
        ref={ref}
        onClick={(e) => e.target === ref.current && ref.current.close()}
        className="m-auto h-[min(86vh,860px)] w-[min(1280px,calc(100vw-32px))] max-w-none overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0e] p-0 text-white shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95)] backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-1 border-b border-white/[0.07] px-3 py-2">
            <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto scroll-thin">
              {files.map((f, i) => (
                <button
                  key={f.name}
                  onClick={() => {
                    setTab(i);
                    setPick(null);
                  }}
                  className={`shrink-0 rounded-lg px-3 py-1.5 font-mono text-[12.5px] transition-colors ${
                    i === tab ? "bg-[rgb(var(--accent)/0.14)] text-white" : "text-white/45 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => ref.current?.close()}
              aria-label={dict.search.close[lang]}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/40 hover:bg-white/[0.06] hover:text-white"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="grid min-h-0 flex-1 grid-rows-[1fr_auto] md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:grid-rows-1">
            <pre className="min-h-0 overflow-auto py-3 font-mono text-[13px] leading-[1.7] scroll-thin">
              {file.lines.map((line, i) =>
                line.path ? (
                  <button
                    key={i}
                    onPointerEnter={() => setPick(line)}
                    onFocus={() => setPick(line)}
                    onClick={() => setPick(line)}
                    className={`block w-full whitespace-pre px-5 text-left transition-colors ${
                      pick === line ? "bg-[rgb(var(--accent)/0.12)] shadow-[inset_2px_0_0_rgb(var(--accent))]" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <Yaml text={line.text} />
                  </button>
                ) : (
                  <span key={i} className="block whitespace-pre px-5">
                    {line.text ? <Yaml text={line.text} /> : " "}
                  </span>
                ),
              )}
            </pre>

            <aside className="max-h-[38vh] overflow-y-auto border-t border-white/[0.07] p-5 scroll-thin md:max-h-none md:border-l md:border-t-0 md:p-7">
              {!pick ? (
                <p className="text-[14px] text-white/40">{t.explorePick[lang]}</p>
              ) : (
                <>
                  <p className="break-all font-mono text-[12.5px] text-white/40">{file.name}</p>
                  <p className="mt-1 break-all font-mono text-[17px] text-white">{pick.path}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-[12.5px]">
                    {pick.note?.type && (
                      <span className="rounded-md border border-white/10 px-2 py-1 text-white/55">
                        {t.exploreType[lang]} <span className="text-white">{pick.note.type}</span>
                      </span>
                    )}
                    {value && (
                      <span className="rounded-md border border-white/10 px-2 py-1 text-white/55">
                        {t.exploreDefault[lang]} <span className="font-mono text-white">{value}</span>
                      </span>
                    )}
                  </div>
                  <p className="mt-5 text-[14.5px] leading-relaxed text-white/70">
                    {pick.note ? <Rich text={pick.note.text} /> : <span className="text-white/40">{t.exploreNone[lang]}</span>}
                  </p>
                  {pick.anchor && (
                    <a
                      href={`#${pick.anchor}`}
                      onClick={() => ref.current?.close()}
                      className="mt-6 inline-block text-[13.5px] text-[rgb(var(--accent))] hover:underline"
                    >
                      {t.exploreGo[lang]} →
                    </a>
                  )}
                </>
              )}
            </aside>
          </div>
        </div>
      </dialog>
    </>
  );
}
