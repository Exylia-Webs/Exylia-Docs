import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getPlugin, plugins, LANGS, type Lang, type NavGroup } from "@/content/registry";

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
};

export type Doc = DocMeta & {
  body: string;
  headings: Heading[];
};

export type Heading = { id: string; text: string; level: 2 | 3 };

export type NavSection = { label: string; pages: DocMeta[] };

function filePath(plugin: string, lang: Lang, slug: string) {
  return path.join(CONTENT_DIR, plugin, lang, `${slug}.mdx`);
}

/**
 * Slugifies a heading the way `rehype-slug` (github-slugger) does: lowercase,
 * punctuation dropped, spaces hyphenated — accents kept, which is why the
 * anchors of Spanish headings read `configuración` and not `configuracion`.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[ -⁯⸀-⹿\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "")
    .replace(/\s+/g, "-");
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

export function readDoc(plugin: string, lang: Lang, slug: string): Doc | null {
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
    group: placed?.group ?? "",
    body: content,
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
    group,
  };
}

/** The sidebar for one plugin, with titles resolved from frontmatter. */
export function getNav(plugin: string, lang: Lang): NavSection[] {
  const entry = getPlugin(plugin);
  if (!entry) return [];
  return entry.nav.map((group: NavGroup) => ({
    label: group.label[lang],
    pages: group.pages.map((ref) => metaOf(plugin, lang, ref.id, ref.slugs[lang], group.label[lang])),
  }));
}

/** Every page of a plugin, flattened in reading order. */
export function getFlatNav(plugin: string, lang: Lang): DocMeta[] {
  return getNav(plugin, lang).flatMap((section) => section.pages);
}

/** The previous and next page around a slug, for the pager. */
export function getNeighbours(plugin: string, lang: Lang, slug: string) {
  const flat = getFlatNav(plugin, lang);
  const index = flat.findIndex((page) => page.slug === slug);
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
          haystack: `${doc.title} ${doc.description} ${text}`.toLowerCase(),
        };
      }),
    ),
  );
}
