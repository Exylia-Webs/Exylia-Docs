// The public docs are styled with Tailwind 3 (tailwind.config.ts); the admin panel and the docs
// assistant are built from the design system, which is Tailwind 4. Next takes one PostCSS pipeline
// for every stylesheet, so this plugin hands each file to its own: `src/app/admin/admin.css` and
// `src/components/assistant/assistant.css` to Tailwind 4, everything else to Tailwind 3.
//
// The assistant's sheet lives on the public pages, beside the Tailwind 3 stylesheet, so its output
// is also scoped (see `scope`).
const postcss = require("postcss");

const ADMIN_CSS = /[\\/]src[\\/]app[\\/]admin[\\/]admin\.css$/;
const ASSISTANT_CSS = /[\\/]src[\\/]components[\\/]assistant[\\/]assistant\.css$/;
const SCOPE = ".exy-ds";

/**
 * Confines a Tailwind 4 stylesheet to the `.exy-ds` element and what is inside it:
 * - the cascade layers go: the docs' Tailwind 3 rules are unlayered, and an unlayered rule beats
 *   any layered one, so its preflight (`button { background: transparent }`) would win over the
 *   design system's classes. Unlayered, the usual specificity and order decide again.
 * - `:root`, `html` and `body` become `.exy-ds` (tokens, colour, font); `.light` rules are dropped.
 * - Tailwind 4's own `--tw-*` @property registrations go (see below).
 * - every other selector only matches inside `.exy-ds`, at the same specificity (`:where`).
 */
function scope(root) {
  root.walkAtRules("layer", (rule) => {
    if (rule.nodes) rule.replaceWith(rule.nodes);
    else rule.remove();
  });
  // Tailwind 4 registers its `--tw-*` variables globally with @property, and some with a type
  // (`--tw-gradient-from: <color>`) that Tailwind 3's values of the same name do not fit, which
  // would break the docs' gradients. Its fallback for browsers without @property sets the same
  // initial values on every element: kept for every browser (and scoped below) instead.
  root.walkAtRules("property", (rule) => {
    if (rule.params.startsWith("--tw-")) rule.remove();
  });
  root.walkAtRules("supports", (rule) => {
    if (rule.params.includes("margin-trim")) rule.replaceWith(rule.nodes);
  });
  root.walkRules((rule) => {
    if (rule.parent?.type === "atrule" && /keyframes$/.test(rule.parent.name)) return;
    const selectors = rule.selectors.flatMap((selector) => {
      if (/:root\.light|^\.light\b|::view-transition/.test(selector)) return [];
      const top = selector.replace(/^(:root(\.dark)?|html|body|:host)(?=$|[\s.:[>~+])/, SCOPE);
      if (top !== selector) return [top];
      return [`:where(${SCOPE}) ${selector}`];
    });
    if (selectors.length) rule.selectors = [...new Set(selectors)];
    else rule.remove();
  });
}

module.exports = () => ({
  postcssPlugin: "exylia-tailwind-split",
  async Once(root, { result }) {
    const file = result.opts.from ?? "";
    const v4 = ADMIN_CSS.test(file) || ASSISTANT_CSS.test(file);
    const tailwind = v4 ? require("@tailwindcss/postcss")() : require("tailwindcss")();
    // Processing the Root itself changes it in place; the file dependencies go along for the watcher.
    const done = await postcss([tailwind]).process(root, { ...result.opts, from: file });
    result.messages.push(...done.messages);
    if (ASSISTANT_CSS.test(file)) scope(done.root);
  },
});
module.exports.postcss = true;
