import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root to THIS app. Without this, Turbopack walks up to the
  // monorepo parent (which has its own lockfile + middleware.ts) and wrongly
  // bundles the website's coming-soon rewrite into the shop.
  turbopack: { root: __dirname },
  images: {
    // Demo product art comes from picsum (placeholders). Optimization is off so
    // the demo never hits image-optimizer quotas or redirect quirks on Vercel.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "fastly.picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
