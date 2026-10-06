import type { Metadata } from "next";
import type { Lang } from "@/content/registry";

/**
 * The link-preview fields for a page: its card from app/[lang]/og (a static PNG per landing,
 * plugin and page). Spread into `openGraph`/`twitter`.
 */
export function ogImageFor(lang: Lang, plugin?: string, slug?: string): { openGraph: Metadata["openGraph"]; twitter: Metadata["twitter"] } {
  const url = `/${lang}/og/${plugin ? (slug ? `${plugin}/${slug}` : plugin) : "index"}.png`;
  const image = { url, width: 1200, height: 630 };
  return {
    openGraph: { type: "website", siteName: "Exylia Docs", images: [image] },
    twitter: { card: "summary_large_image", images: [url] },
  };
}
