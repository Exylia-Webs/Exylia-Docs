import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getPlugin, plugins, LANGS, SHARED_GROUP, SHARED_PLUGIN, type Lang, type NavGroup } from "@/content/registry";
import { slugify } from "./slug";

export { slugify };

const CONTENT_DIR = path.join(process.cwd(), "content");

export type DocMeta = {
  plugin: string;
  lang: Lang;
  /** Stable identity across languages, from the registry. */
  id: string;
  slug: string;
  title: string;
  description: string;
  /** Sidebar group the page belongs to, already in this language. */
  group: string;
  /** Optional tag drawn next to the title in the sidebar. */
  badge?: string;
  /** Plugin version whose changes this page last documented (frontmatter `updated`). */
  updated?: string;
  /** `updated` is the plugin's current version: the page is news. */
  fresh?: boolean;
};

export type Doc = DocMeta & {
  body: string;
  /** Frontmatter `questions`: how readers ask for this page ("how do I change the colours?"). Search and the assistant match on them. */
  questions: string[];
  headings: Heading[];
};

export type Heading = { id: string; text: string; level: 2 | 3 };

export type NavSection = { label: string; pages: DocMeta[] };

function filePath(plugin: string, lang: Lang, slug: string) {
  return path.join(CONTENT_DIR, plugin, lang, `${slug}.mdx`);
}

/** `##` and `###` headings, ignoring anything inside a fenced code block. */
export function extractHeadings(body: string): Heading[] {
  const out: Heading[] = [];
  let fenced = false;
  for (const line of body.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const text = match[2].replace(/`/g, "");
    out.push({ id: slugify(text), text, level: match[1].length as 2 | 3 });
  }
  return out;
}

/** Where the registry says this slug lives, and what its id is. */
function locate(plugin: string, lang: Lang, slug: string) {
  const entry = getPlugin(plugin);
  if (!entry) return null;
  for (const group of entry.nav) {
    const ref = group.pages.find((p) => p.slugs[lang] === slug);
    if (ref) return { id: ref.id, group: group.label[lang] };
  }
  return null;
}

/**
 * Content is immutable during a build, and the nav reads every page of a plugin for each of its
 * pages: memoised there, read live in dev so edits to the MDX still show.
 */
const docs = new Map<string, Doc | null>();

export function readDoc(plugin: string, lang: Lang, slug: string): Doc | null {
  if (process.env.NODE_ENV !== "production") return loadDoc(plugin, lang, slug);
  const key = `${plugin}/${lang}/${slug}`;
  if (!docs.has(key)) docs.set(key, loadDoc(plugin, lang, slug));
  return docs.get(key) ?? null;
}

function loadDoc(plugin: string, lang: Lang, slug: string): Doc | null {
  const file = filePath(plugin, lang, slug);
  if (!fs.existsSync(file)) return null;
  const placed = locate(plugin, lang, slug);
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    plugin,
    lang,
    id: placed?.id ?? slug,
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    badge: data.badge ? String(data.badge) : undefined,
    updated: data.updated ? String(data.updated) : undefined,
    fresh: !!data.updated && String(data.updated) === getPlugin(plugin)?.version,
    group: placed?.group ?? "",
    body: content,
    questions: Array.isArray(data.questions) ? data.questions.map(String) : [],
    headings: extractHeadings(content),
  };
}

function metaOf(plugin: string, lang: Lang, id: string, slug: string, group: string): DocMeta {
  const doc = readDoc(plugin, lang, slug);
  if (!doc) {
    throw new Error(`Missing content/${plugin}/${lang}/${slug}.mdx (declared in the registry)`);
  }
  return {
    plugin,
    lang,
    id,
    slug,
    title: doc.title,
    description: doc.description,
    badge: doc.badge,
    updated: doc.updated,
    fresh: doc.fresh,
    group,
  };
}

/** The sidebar for one plugin, with titles resolved from frontmatter. */
export function getNav(plugin: string, lang: Lang): NavSection[] {
  const entry = getPlugin(plugin);
  if (!entry) return [];
  const own = entry.nav.map((group: NavGroup) => ({
    label: group.label[lang],
    pages: group.pages.map((ref) => metaOf(plugin, lang, ref.id, ref.slugs[lang], group.label[lang])),
  }));
  if (plugin === SHARED_PLUGIN || entry.standalone || !entry.nav.length) return own;
  // The library's server-owner guides, linked (not copied) at the end of every plugin's sidebar.
  const label = SHARED_GROUP.label[lang];
  return [...own, { label, pages: SHARED_GROUP.pages.map((ref) => metaOf(SHARED_PLUGIN, lang, ref.id, ref.slugs[lang], label)) }];
}

/** Every page of a plugin, flattened in reading order. */
export function getFlatNav(plugin: string, lang: Lang): DocMeta[] {
  return getNav(plugin, lang).flatMap((section) => section.pages);
}

/** The previous and next page around a slug, for the pager. */
export function getNeighbours(plugin: string, lang: Lang, slug: string) {
  const flat = getFlatNav(plugin, lang);
  const index = flat.findIndex((page) => page.plugin === plugin && page.slug === slug);
  return {
    previous: index > 0 ? flat[index - 1] : null,
    next: index >= 0 && index < flat.length - 1 ? flat[index + 1] : null,
  };
}

/** Every `[lang, plugin, slug]` triple, for `generateStaticParams`. */
export function getAllDocParams(): { lang: Lang; plugin: string; slug: string }[] {
  return LANGS.flatMap((lang) =>
    plugins.flatMap((entry) =>
      entry.nav.flatMap((group) =>
        group.pages.map((ref) => ({ lang, plugin: entry.id, slug: ref.slugs[lang] })),
      ),
    ),
  );
}

export type SearchEntry = {
  plugin: string;
  pluginName: string;
  slug: string;
  title: string;
  group: string;
  description: string;
  /** Section headings, so a search can land mid-page. */
  sections: { text: string; id: string }[];
  /** Lowercased haystack, built once at build time. */
  haystack: string;
};

/**
 * A flat index of one language's pages, served as `/[lang]/search-index.json`.
 *
 * Per language on purpose: searching Spanish text from an English page would
 * return results the reader cannot read, and doubles the payload for nothing.
 */
export function buildSearchIndex(lang: Lang): SearchEntry[] {
  return plugins.flatMap((entry) =>
    entry.nav.flatMap((group) =>
      group.pages.map((ref) => {
        const slug = ref.slugs[lang];
        const doc = readDoc(entry.id, lang, slug);
        if (!doc) {
          throw new Error(`Missing content/${entry.id}/${lang}/${slug}.mdx (declared in the registry)`);
        }
        const text = doc.body
          .replace(/```[\s\S]*?```/g, " ")
          .replace(/[#*`|>_-]/g, " ")
          .replace(/\s+/g, " ")
          .slice(0, 1500);
        return {
          plugin: entry.id,
          pluginName: entry.name,
          slug,
          title: doc.title,
          group: group.label[lang],
          description: doc.description,
          sections: doc.headings
            .filter((h) => h.level === 2)
            .map((h) => ({ text: h.text, id: h.id })),
          haystack: `${doc.title} ${doc.description} ${doc.questions.join(" ")} ${text}`.toLowerCase(),
        };
      }),
    ),
  );
}
