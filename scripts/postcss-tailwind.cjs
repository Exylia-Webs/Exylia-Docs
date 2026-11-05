// The public docs are styled with Tailwind 3 (tailwind.config.ts); the admin panel is built from the
// design system, which is Tailwind 4. Next takes one PostCSS pipeline for every stylesheet, so this
// plugin hands each file to its own: `src/app/admin/admin.css` to Tailwind 4, everything else to
// Tailwind 3, exactly as before.
const postcss = require("postcss");

const ADMIN_CSS = /[\\/]src[\\/]app[\\/]admin[\\/]admin\.css$/;

module.exports = () => ({
  postcssPlugin: "exylia-tailwind-split",
  async Once(root, { result }) {
    const file = result.opts.from ?? "";
    const tailwind = ADMIN_CSS.test(file) ? require("@tailwindcss/postcss")() : require("tailwindcss")();
    // Processing the Root itself changes it in place; the file dependencies go along for the watcher.
    const done = await postcss([tailwind]).process(root, { ...result.opts, from: file });
    result.messages.push(...done.messages);
  },
});
module.exports.postcss = true;
