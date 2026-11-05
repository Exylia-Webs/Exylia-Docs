import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Served by `next start` (the assistant's API route, the admin panel); every docs page is still
  // prerendered at build time.
  images: { unoptimized: true },
  // Coolify's Traefik already gzips every response; compressing in Node too only burns the event loop.
  compress: false,
  trailingSlash: true,
  // The design system ships TypeScript source.
  transpilePackages: ["@exylia-webs/ui"],
  // Pull only the modules a page imports from the barrel (CookieConsent), not the whole design system.
  experimental: { optimizePackageImports: ["@exylia-webs/ui"] },

  // What nginx did in front of the static export.
  async redirects() {
    return [
      // The root belongs to no language: a real HTTP redirect, so a crawler never sees an empty
      // page that only redirects in JavaScript. Googlebot sends no Accept-Language and lands on /en/.
      { source: "/", has: [{ type: "header", key: "accept-language", value: "[eE][sS](?:[-,;].*)?" }], destination: "/es/", permanent: false },
      { source: "/", destination: "/en/", permanent: false },
      // Old links without a language segment.
      { source: "/docs/:path*", destination: "/en/docs/:path*", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      // Not hashed, but only a deploy changes them: an hour in the browser, then revalidated (ETag).
      // The search index is 1.7 MB, fetched on the first search of every visit without this.
      ...["/:lang/search-index.json", "/:lang/og/:path*"].map((source) => ({
        source,
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" }],
      })),
    ];
  },
};

// next-intl only serves the admin panel (the design system's strings); the docs never call it.
export default createNextIntlPlugin("./src/i18n/request.ts")(nextConfig);
