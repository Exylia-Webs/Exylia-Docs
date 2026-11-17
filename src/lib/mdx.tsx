import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import { createMdxComponents } from "@/components/docs/MdxComponents";
import type { Lang } from "@/content/registry";

/**
 * Highlighting runs at build time, so the browser never ships a highlighter.
 * `keepBackground` is off because the code block's surface is ours.
 */
const prettyCode: PrettyCodeOptions = {
  theme: "vitesse-dark",
  keepBackground: false,
  defaultLang: { block: "text", inline: "text" },
};

export function Mdx({ source, lang, plugin }: { source: string; lang: Lang; plugin: string }) {
  return (
    <MDXRemote
      source={source}
      components={createMdxComponents(lang, plugin)}
      options={{
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCode]],
        },
      }}
    />
  );
}
