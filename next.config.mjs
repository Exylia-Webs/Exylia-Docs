/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // The design system ships TypeScript source.
  transpilePackages: ["@exylia-webs/ui"],
  // Pull only the modules a page imports from the barrel (CookieConsent), not the whole design system.
  experimental: { optimizePackageImports: ["@exylia-webs/ui"] },
};

export default nextConfig;
