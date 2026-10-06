/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // The design system ships TypeScript source.
  transpilePackages: ["@exylia-webs/ui"],
};

export default nextConfig;
