import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root to THIS app. Without this, Turbopack walks up to the
  // monorepo parent (which has its own lockfile + middleware.ts) and wrongly
  // bundles the website's coming-soon rewrite into this store.
  turbopack: { root: __dirname },
  images: {
    // Product art is locally-generated SVG (paper reams) in /public/products.
    // Optimization is off so the demo never hits image-optimizer quotas, and
    // dangerouslyAllowSVG lets next/image serve our own first-party SVGs.
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
