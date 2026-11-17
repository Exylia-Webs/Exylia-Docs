import fs from "node:fs";
import path from "node:path";
import type { Lang } from "@/content/registry";

/**
 * A plugin's reference data — commands, permissions, placeholders — written once in
 * `content/<plugin>/data.json` and drawn by `<Commands />`, `<Permissions />` and `<Placeholders />`.
 * The same rows feed the page, the Markdown copy and the AI assistant, so the three never disagree.
 */
type Text = Record<Lang, string>;

/** Who has a permission without anyone granting it: `true` everyone, `op` operators, `false` nobody. */
export type PermDefault = "true" | "op" | "false";

export type CommandRow = { usage: string; permission?: string; group?: string; aliases?: string[] } & Text;
export type PermissionRow = { node: string; default: PermDefault; group?: string } & Text;
export type PlaceholderRow = { key: string; example?: string; group?: string } & Text;

export type PluginData = {
  commands?: CommandRow[];
  permissions?: PermissionRow[];
  placeholders?: PlaceholderRow[];
};

export type DataKind = keyof PluginData;

const cache = new Map<string, PluginData | null>();

export function readPluginData(plugin: string): PluginData | null {
  if (process.env.NODE_ENV === "production" && cache.has(plugin)) return cache.get(plugin)!;
  const file = path.join(process.cwd(), "content", plugin, "data.json");
  const data = fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")) as PluginData) : null;
  cache.set(plugin, data);
  return data;
}

const HEAD: Record<DataKind, Record<Lang, string[]>> = {
  commands: { en: ["Command", "What it does", "Permission"], es: ["Comando", "Qué hace", "Permiso"] },
  permissions: { en: ["Permission", "Who has it", "What it allows"], es: ["Permiso", "Quién lo tiene", "Qué permite"] },
  placeholders: { en: ["Placeholder", "Shows", "Example"], es: ["Placeholder", "Muestra", "Ejemplo"] },
};

const WHO: Record<PermDefault, Text> = {
  true: { en: "Everyone", es: "Todos" },
  op: { en: "Admins (op)", es: "Admins (op)" },
  false: { en: "Nobody until granted", es: "Nadie hasta que se dé" },
};

/**
 * The rows of one kind as plain cells. Each cell is either text or code (`{ code }`), so the page can
 * draw code as copyable `<code>` and the Markdown copy can wrap it in backticks.
 */
export type Cell = string | { code: string };

export function dataTable(plugin: string, kind: DataKind, lang: Lang, group?: string): { head: string[]; rows: Cell[][] } | null {
  const data = readPluginData(plugin)?.[kind];
  if (!data?.length) return null;
  const rows = data.filter((r) => !group || r.group === group);
  const cells: Cell[][] = rows.map((r) => {
    if (kind === "commands") {
      const c = r as CommandRow;
      return [{ code: c.usage }, c[lang], c.permission ? { code: c.permission } : "—"];
    }
    if (kind === "permissions") {
      const p = r as PermissionRow;
      return [{ code: p.node }, WHO[p.default][lang], p[lang]];
    }
    const p = r as PlaceholderRow;
    return [{ code: p.key }, p[lang], p.example ? { code: p.example } : "—"];
  });
  return { head: HEAD[kind][lang], rows: cells };
}

/** The same table as GitHub Markdown, for the AI assistant and "Copy as Markdown". */
export function dataMarkdown(plugin: string, kind: DataKind, lang: Lang, group?: string): string {
  const table = dataTable(plugin, kind, lang, group);
  if (!table) return "";
  const cell = (c: Cell) => (typeof c === "string" ? c : `\`${c.code}\``).replace(/\|/g, "\\|");
  return [
    `| ${table.head.join(" | ")} |`,
    `|${table.head.map(() => "---").join("|")}|`,
    ...table.rows.map((r) => `| ${r.map(cell).join(" | ")} |`),
  ].join("\n");
}
