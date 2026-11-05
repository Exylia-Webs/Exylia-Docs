import type { Metadata } from "next";
import { LanguageRedirect } from "@/components/LanguageRedirect";
import { DEFAULT_LANG } from "@/content/registry";

/** The server redirects the root before this renders (next.config.mjs); the canonical covers any other host. */
export const metadata: Metadata = {
  alternates: { canonical: `/${DEFAULT_LANG}` },
};

/**
 * The root, which belongs to no language.
 *
 * A static export has no server to read `Accept-Language`, so the choice is
 * made in the browser: a remembered preference first, then `navigator.
 * languages`, then English. The `<noscript>` path is not decoration — without
 * JavaScript this page would otherwise be a dead end.
 */
export default function RootPage() {
  return <LanguageRedirect />;
}
