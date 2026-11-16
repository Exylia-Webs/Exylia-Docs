import { slugify } from "./slug";

export type ConfigLine = { text: string; path?: string; anchor: string };
export type ConfigFile = { name: string; lines: ConfigLine[] };
export type KeyNote = { key: string; anchor: string; type?: string; value?: string; text: string };
export type ConfigMap = { files: ConfigFile[]; notes: KeyNote[] };

const KEY = /^(\s*)(?:- )?("[^"]+"|'[^']+'|[\w.-]+):(?:\s|$)/;
const clean = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").replace(/\*\*/g, "").trim();

/**
 * Reads a configuration page back into its files: every ```yaml block, filed under the `.yml` heading
 * it sits in (config.yml until one says otherwise), each key with its full dotted path; and what the
 * page says about each key (a `<Field>`, a table row, or the paragraph right after the block).
 * Pages with fewer than three yaml blocks are not configuration pages and get nothing.
 */
export function buildConfigMap(body: string): ConfigMap | null {
  if ((body.match(/^```ya?ml/gm) ?? []).length < 3) return null;
  const files = new Map<string, ConfigLine[]>();
  const notes: KeyNote[] = [];
  let file = "config.yml";
  let anchor = "";
  let fence: "yaml" | "other" | null = null;
  let stack: { indent: number; key: string }[] = [];
  let root = ""; // first key of the block just closed, waiting for its paragraph
  let para: string[] | null = null;

  const lines = body.split("\n");
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.trimStart().startsWith("```")) {
      if (fence) {
        if (fence === "yaml" && stack.length) root = stack[0].key;
        fence = null;
      } else {
        fence = /^```ya?ml/.test(line.trim()) ? "yaml" : "other";
        stack = [];
        root = "";
        if (fence === "yaml") {
          const out = files.get(file) ?? [];
          if (out.length) out.push({ text: "", anchor });
          files.set(file, out);
        }
      }
      continue;
    }
    if (fence === "yaml") {
      const m = KEY.exec(line);
      let path: string | undefined;
      if (m && !line.trimStart().startsWith("#")) {
        const indent = m[1].length;
        while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();
        stack.push({ indent, key: m[2].replace(/^["']|["']$/g, "") });
        path = stack.map((s) => s.key).join(".");
      }
      files.get(file)!.push({ text: line, path, anchor });
      continue;
    }
    if (fence) continue;

    const heading = /^(#{2,3})\s+(.+)$/.exec(line);
    if (heading) {
      const text = heading[2].replace(/`/g, "");
      anchor = slugify(text);
      const named = /([\w-]+\.ya?ml|[\w-]+\/)\s*$/.exec(text);
      if (heading[1] === "##" && named) file = named[1];
      root = "";
      continue;
    }
    const row = /^\|\s*`([^`]+)`\s*\|(.+)\|\s*$/.exec(line);
    if (row) {
      const cells = row[2].split("|").map(clean);
      notes.push({ key: row[1], anchor, value: cells.length > 1 ? cells[0].replace(/`/g, "") : undefined, text: cells[cells.length - 1] });
      continue;
    }
    if (root) {
      if (line.trim() === "") {
        if (para) {
          notes.push({ key: root, anchor, text: clean(para.join(" ")) });
          para = null;
          root = "";
        }
      } else if (/^[<|>#-]/.test(line.trim())) {
        root = "";
      } else (para ??= []).push(line);
    }
  }

  for (const m of body.matchAll(/<Field\s+([^>]*)>([\s\S]*?)<\/Field>/g)) {
    const attr = (name: string) => new RegExp(`${name}="([^"]*)"`).exec(m[1])?.[1];
    const key = attr("name");
    if (!key) continue;
    const before = body.slice(0, m.index);
    const h = [...before.matchAll(/^#{2,3}\s+(.+)$/gm)].pop();
    notes.push({ key, anchor: h ? slugify(h[1].replace(/`/g, "")) : "", type: attr("type"), value: attr("defaultValue"), text: clean(m[2]) });
  }

  const out = [...files].map(([name, lines]) => ({ name, lines })).filter((f) => f.lines.some((l) => l.path));
  return out.length ? { files: out, notes } : null;
}

/** The note for a key: by name in its own section, else by full path anywhere on the page. */
export function noteFor(map: ConfigMap, path: string, anchor: string): KeyNote | undefined {
  const leaf = path.split(".").pop();
  return map.notes.find((n) => n.anchor === anchor && (n.key === path || n.key === leaf)) ?? map.notes.find((n) => n.key === path);
}
