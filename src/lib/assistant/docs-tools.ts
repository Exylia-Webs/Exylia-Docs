import type { AssistantTool } from "@exylia-webs/ui/assistant";
import { getAllDocParams, readDoc } from "@/lib/docs";
import { DEFAULT_LANG, LANGS, SITE, documentedPlugins, getPlugin, plugins, type Lang } from "@/content/registry";

/**
 * What the docs assistant reads with: a search over every published page, one page as plain text,
 * and the plugin catalogue. Read-only by construction: nothing here writes, and a page is only ever
 * looked up in the registry's list of published pages, never by a path built from the model's input.
 */

/** Characters of a page's text kept in the search index, and returned by `read_page`. */
const INDEX_CHARS = 20_000;
const PAGE_CHARS = 11_000;
const HITS = 8;

/** The URL of a page on this site, as the site's own links write it. */
export const pageUrl = (lang: Lang, plugin: string, slug?: string) => `/${lang}/docs/${plugin}/${slug ? `${slug}/` : ""}`;

/** Lowercase, accents folded one character at a time so positions in the folded text match the original. */
export const fold = (text: string) => text.toLowerCase().replace(/[^\u0000-\u007f]/g, (c) => c.normalize("NFD")[0] ?? c);

const attr = (attrs: string, name: string) => new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)'|\\{["'\`]([^"'\`]*)["'\`]\\})`).exec(attrs)?.slice(1).find((v) => v !== undefined);

const withLang = (href: string, lang: Lang) => (href.startsWith("/docs/") ? `/${lang}${href}` : href);

/** One MDX component tag as the text it shows. Tags we do not know are left alone: they are prose like `<player>`. */
function tagText(name: string, attrs: string, lang: Lang): string {
  switch (name) {
    case "Callout":
    case "Step": {
      const title = attr(attrs, "title");
      return title ? `**${title}** ` : "";
    }
    case "Card": {
      const title = attr(attrs, "title") ?? "";
      const href = attr(attrs, "href");
      return href ? `[${title}](${withLang(href, lang)}) ` : `**${title}** `;
    }
    case "Field": {
      const field = attr(attrs, "name");
      const type = attr(attrs, "type");
      const fallback = attr(attrs, "defaultValue");
      return field ? `\`${field}\`${type ? ` (${type})` : ""}${fallback !== undefined ? ` default \`${fallback}\`` : ""}: ` : "";
    }
    default:
      return "";
  }
}

const COMPONENTS = "Callout|Cards|Card|Steps|Step|Badge|Field|AiPrompt";
const OPEN_TAG = new RegExp(`<(${COMPONENTS})\\b([^<>]*?)\\/?>`, "g");
const CLOSE_TAG = new RegExp(`<\\/(?:${COMPONENTS})\\s*>`, "g");

/**
 * An MDX body as Markdown a model can read: the docs' own components become their visible text,
 * comments go, links get the page's language. Code (fenced and inline) is kept verbatim: it is
 * where the configuration keys and commands are.
 */
export function toPlainText(body: string, lang: Lang): string {
  const out: string[] = [];
  let fenced = false;
  for (const line of body.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").split("\n")) {
    if (line.trimStart().startsWith("```")) fenced = !fenced;
    if (fenced || line.trimStart().startsWith("```")) {
      out.push(line);
      continue;
    }
    out.push(
      line
        .split(/(`[^`]*`)/)
        .map((part, i) =>
          i % 2
            ? part
            : part
                .replace(OPEN_TAG, (_, name: string, attrs: string) => tagText(name, attrs, lang))
                .replace(CLOSE_TAG, "")
                .replace(/\]\(\/docs\//g, `](/${lang}/docs/`),
        )
        .join(""),
    );
  }
  return out
    .join("\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

type Entry = {
  plugin: string;
  pluginName: string;
  slug: string;
  url: string;
  title: string;
  group: string;
  description: string;
  text: string;
  /** Folded copies, for matching. */
  f: { title: string; description: string; headings: string; plugin: string; text: string };
};

/** One index per language, built on first use and kept for the life of the process (content never changes while it runs). */
const indexes = new Map<Lang, Entry[]>();

function indexOf(lang: Lang): Entry[] {
  let index = indexes.get(lang);
  if (index) return index;
  index = [];
  for (const entry of documentedPlugins) {
    for (const group of entry.nav) {
      for (const ref of group.pages) {
        const doc = readDoc(entry.id, lang, ref.slugs[lang]);
        if (!doc) continue;
        const text = toPlainText(doc.body, lang).slice(0, INDEX_CHARS);
        index.push({
          plugin: entry.id,
          pluginName: entry.name,
          slug: doc.slug,
          url: pageUrl(lang, entry.id, doc.slug),
          title: doc.title,
          group: group.label[lang],
          description: doc.description,
          text,
          f: {
            title: fold(doc.title),
            description: fold(doc.description),
            headings: fold(doc.headings.map((h) => h.text).join(" \n ")),
            plugin: fold(`${entry.id} ${entry.name}`),
            text: fold(text),
          },
        });
      }
    }
  }
  indexes.set(lang, index);
  return index;
}

const occurrences = (haystack: string, needle: string, max: number) => {
  let count = 0;
  for (let at = haystack.indexOf(needle); at !== -1 && count < max; at = haystack.indexOf(needle, at + needle.length)) count++;
  return count;
};

function snippet(entry: Entry, words: string[]): string {
  const at = words
    .map((word) => entry.f.text.indexOf(word))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  if (at === undefined) return entry.description || entry.text.slice(0, 220);
  // Start and end on word boundaries.
  const from = Math.max(0, at - 100);
  const start = from && entry.text.slice(from, at).search(/\s/) >= 0 ? from + entry.text.slice(from, at).search(/\s/) : from;
  const end = entry.text.lastIndexOf(" ", at + 180);
  const text = entry.text.slice(start, end > at ? end : at + 180).replace(/\s+/g, " ").trim();
  return `${start > 0 ? "…" : ""}${text}…`;
}

/** Resolves a plugin the way a person would name it: id, name, or the name without "Exylia". */
export function findPlugin(value: string | undefined) {
  if (!value?.trim()) return undefined;
  const wanted = fold(value.trim()).replace(/[\s_-]+/g, "");
  return plugins.find((p) => p.id === wanted || fold(p.name) === wanted || fold(p.name).replace(/^exylia/, "") === wanted.replace(/^exylia/, ""));
}

export type SearchHit = { title: string; plugin: string; pluginName: string; section: string; url: string; snippet: string };

/** The best pages for a query: title beats headings beats description beats body. */
export function searchDocs(query: string, lang: Lang, plugin?: string): SearchHit[] {
  const words = [...new Set(fold(query).split(/[^\p{L}\p{N}._:%-]+/u).filter((word) => word.length >= 2))].slice(0, 12);
  if (!words.length) return [];
  const scored: { entry: Entry; score: number }[] = [];
  for (const entry of indexOf(lang)) {
    if (plugin && entry.plugin !== plugin) continue;
    let score = 0;
    let matched = 0;
    for (const word of words) {
      let s = 0;
      if (entry.f.title === word) s += 60;
      else if (entry.f.title.startsWith(word)) s += 40;
      else if (entry.f.title.includes(word)) s += 28;
      if (entry.f.headings.includes(word)) s += 14;
      if (entry.f.description.includes(word)) s += 10;
      if (entry.f.plugin.includes(word)) s += 12;
      s += occurrences(entry.f.text, word, 6) * 2;
      if (s > 0) matched++;
      score += s;
    }
    // Pages that match more of the words come first, whatever one word scored alone.
    if (score > 0) scored.push({ entry, score: score * (matched / words.length) ** 2 });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, HITS)
    .map(({ entry }) => ({ title: entry.title, plugin: entry.plugin, pluginName: entry.pluginName, section: entry.group, url: entry.url, snippet: snippet(entry, words) }));
}

/** Every published page, `lang/plugin/slug`: the only pages `read_page` will open. */
let published: Set<string> | undefined;
const isPublished = (lang: Lang, plugin: string, slug: string) => (published ??= new Set(getAllDocParams().map((p) => `${p.lang}/${p.plugin}/${p.slug}`))).has(`${lang}/${plugin}/${slug}`);

const PAGE_PATH = /^\/(?:(en|es)\/)?docs\/([a-z0-9-]+)(?:\/([\p{L}\p{N}-]+))?\/?$/u;

/** A page URL (this site's, relative or absolute) as its parts, or null when it is not a docs page address. */
export function parsePageUrl(value: string): { lang?: Lang; plugin: string; slug?: string } | null {
  let path = value.trim();
  if (/^https?:\/\//i.test(path)) {
    let url: URL;
    try {
      url = new URL(path);
    } catch {
      return null;
    }
    if (url.host !== new URL(SITE.url).host) return null;
    path = url.pathname;
  }
  path = path.split(/[?#]/)[0] ?? "";
  try {
    path = decodeURIComponent(path);
  } catch {
    return null;
  }
  const match = PAGE_PATH.exec(path);
  if (!match) return null;
  return { lang: match[1] as Lang | undefined, plugin: match[2]!, slug: match[3] };
}

export type PageResult =
  | { title: string; plugin: string; url: string; section: string; description: string; text: string; truncated: boolean }
  | { title: string; plugin: string; url: string; pages: { title: string; url: string; section: string }[] };

/**
 * One published page as text, by URL or by plugin and slug; a plugin's own address lists its pages.
 * Throws (the model reads why) for anything that is not a published page.
 */
export function readPage(args: { url?: string; plugin?: string; slug?: string }, fallbackLang: Lang): PageResult {
  const parsed = args.url ? parsePageUrl(args.url) : args.plugin ? { plugin: findPlugin(args.plugin)?.id ?? args.plugin, slug: args.slug?.trim() || undefined } : null;
  if (!parsed) throw new Error("Not a docs page: pass a URL like /en/docs/<plugin>/<page>/ from search_docs, or a plugin and a slug");
  const lang = parsed.lang ?? fallbackLang;
  const entry = getPlugin(parsed.plugin);
  if (!entry || !entry.nav.length) throw new Error(`No published docs for plugin "${parsed.plugin}": use list_plugins`);
  if (!parsed.slug) {
    return {
      title: entry.name,
      plugin: entry.id,
      url: pageUrl(lang, entry.id),
      pages: entry.nav.flatMap((group) => group.pages.map((ref) => ({ title: readDoc(entry.id, lang, ref.slugs[lang])?.title ?? ref.slugs[lang], url: pageUrl(lang, entry.id, ref.slugs[lang]), section: group.label[lang] }))),
    };
  }
  if (!isPublished(lang, entry.id, parsed.slug)) throw new Error(`No page "${parsed.slug}" in ${entry.name} (${lang}): use search_docs or read the plugin's address to list its pages`);
  const doc = readDoc(entry.id, lang, parsed.slug);
  if (!doc) throw new Error("That page could not be read");
  const text = toPlainText(doc.body, lang);
  return {
    title: doc.title,
    plugin: entry.id,
    url: pageUrl(lang, entry.id, doc.slug),
    section: doc.group,
    description: doc.description,
    text: text.slice(0, PAGE_CHARS),
    truncated: text.length > PAGE_CHARS,
  };
}

export function listPlugins(lang: Lang) {
  return documentedPlugins.map((p) => ({ id: p.id, name: p.name, category: p.category[lang], version: p.version, minecraft: p.minecraft, tagline: p.tagline[lang], url: pageUrl(lang, p.id), pages: p.nav.reduce((n, g) => n + g.pages.length, 0) }));
}

const LABELS = {
  search_docs: { en: "Searching the docs", es: "Buscando en la documentación" },
  read_page: { en: "Reading a page", es: "Leyendo una página" },
  list_plugins: { en: "Listing the plugins", es: "Listando los plugins" },
} satisfies Record<string, Record<Lang, string>>;

const str = (value: unknown, max: number) => (typeof value === "string" ? value.slice(0, max) : undefined);
const langArg = (value: unknown, fallback: Lang) => (LANGS.includes(value as Lang) ? (value as Lang) : fallback);

/** The three read tools, labelled in the visitor's language. */
export function docsTools(lang: Lang): AssistantTool[] {
  return [
    {
      name: "search_docs",
      label: LABELS.search_docs[lang],
      description: "Full-text search over every published Exylia Docs page. Returns up to 8 pages with title, plugin, url and a snippet. Search before answering; try other words (or the other language) when nothing fits.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Words to look for: feature names, config keys, commands, permissions, placeholders" },
          plugin: { type: "string", description: "Optional plugin id or name to search within (see list_plugins)" },
          lang: { type: "string", enum: [...LANGS], description: `Language of the pages; defaults to the visitor's (${lang})` },
        },
        required: ["query"],
        additionalProperties: false,
      },
      mutates: false,
      run: async (raw) => {
        const args = (raw ?? {}) as Record<string, unknown>;
        const query = str(args.query, 200)?.trim();
        if (!query) throw new Error("query is required");
        const pluginName = str(args.plugin, 80);
        const plugin = pluginName ? findPlugin(pluginName) : undefined;
        if (pluginName && !plugin) throw new Error(`Unknown plugin "${pluginName}": use list_plugins`);
        const hits = searchDocs(query, langArg(args.lang, lang), plugin?.id);
        return hits.length ? { hits } : { hits, note: "No page matches: try other words, fewer words, or the other language" };
      },
    },
    {
      name: "read_page",
      label: LABELS.read_page[lang],
      description: "The text of one docs page (Markdown, code blocks kept), by its url from search_docs, or by plugin and slug. A plugin's own url (/<lang>/docs/<plugin>/) lists its pages instead.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string", description: "The page url, e.g. /en/docs/exyliaffa/arenas/" },
          plugin: { type: "string", description: "Plugin id, when no url is given" },
          slug: { type: "string", description: "Page slug within the plugin, when no url is given; omit to list the plugin's pages" },
        },
        additionalProperties: false,
      },
      mutates: false,
      run: async (raw) => {
        const args = (raw ?? {}) as Record<string, unknown>;
        return readPage({ url: str(args.url, 300), plugin: str(args.plugin, 80), slug: str(args.slug, 120) }, lang);
      },
    },
    {
      name: "list_plugins",
      label: LABELS.list_plugins[lang],
      description: "Every plugin with published docs: id, name, category, version, Minecraft versions, tagline, url and page count.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
      mutates: false,
      run: async () => ({ plugins: listPlugins(lang) }),
    },
  ];
}

/** The knowledge part of the system prompt: what Exylia and these docs are, and how to answer from them. */
export function docsKnowledge(lang: Lang, currentPlugin?: string): string {
  const current = currentPlugin ? getPlugin(currentPlugin) : undefined;
  const catalogue = documentedPlugins.map((p) => `- ${p.name} (\`${p.id}\`, ${p.category[DEFAULT_LANG]}, v${p.version}, MC ${p.minecraft}): ${p.tagline[DEFAULT_LANG]}`).join("\n");
  return `Exylia makes Minecraft server plugins (Java; Spigot, Paper and Folia). Every Exylia plugin builds on ExyliaLib (\`exylialib\`), the shared library. Licences are sold on BuiltByBit (${SITE.store}); some plugins are free on GitHub. ${SITE.name} (${SITE.url}) is the official documentation, in English and Spanish: per plugin, installation, configuration, commands, permissions, placeholders and the developer API.

## Plugins with published docs
${catalogue}

## Site
- Page URLs: /<lang>/docs/<plugin>/<slug>/ (lang "en" or "es"); a plugin's index: /<lang>/docs/<plugin>/. The visitor reads "${lang}": link to "${lang}" pages.
- Support and questions the docs do not answer: the Exylia Discord, ${SITE.discord}.
${current ? `- The visitor is reading the ${current.name} docs (\`${current.id}\`): assume questions are about it unless they say otherwise.\n` : ""}
## How to answer
- Answer only from the docs: search with search_docs, then read_page the pages you rely on. Never answer from memory or general Minecraft knowledge as if it were documented.
- Quote configuration keys, commands, permissions and placeholders exactly as the pages write them. Never invent or guess one; if a page does not show it, say so.
- Cite the pages you used as Markdown links with their relative URL, e.g. [Arenas](/${lang}/docs/exyliaffa/arenas/). Only link URLs the tools returned.
- When the docs do not cover the question, say so plainly and point to the Discord (${SITE.discord}) for support.
- Licences, purchases and refunds are handled on BuiltByBit and the Discord, not here.`;
}

