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
