/** @type {import('next').NextConfig} */
const nextConfig = {
  // A Node server (for the assistant's API route); every page is still prerendered at build time.
  output: "standalone",
  images: { unoptimized: true },
  trailingSlash: true,
  // The design system ships TypeScript source.
  transpilePackages: ["@exylia-webs/ui"],
  // Pull only the modules a page imports from the barrel (CookieConsent), not the whole design system.
  experimental: { optimizePackageImports: ["@exylia-webs/ui"] },
  // The assistant reads the MDX at run time: ship it with the server.
  outputFileTracingIncludes: { "/api/assistant": ["./content/**/*"] },

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
    ];
  },
};

export default nextConfig;
