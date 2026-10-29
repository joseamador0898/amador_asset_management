import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Two root layouts (English, and Spanish under /es) leave no single layout to frame a 404 for an unmatched URL;
  // app/global-not-found.tsx renders those.
  experimental: { globalNotFound: true },
  cacheLife: {
    // Live market panels on /signals: served from cache, refreshed in the
    // background at most every 5 minutes so provider quotas stay small.
    // A long `expire` means a visitor (or a crawler) after a quiet spell
    // still gets the last panels at once instead of waiting 10+ seconds
    // for every provider; the panels show their own "Updated" time, and
    // deploy/amador-warm.timer keeps them fresh anyway.
    signals: { stale: 60, revalidate: 300, expire: 86400 },
    // Slower feeds (SEC filings, macro series, prediction markets).
    filings: { stale: 300, revalidate: 1800, expire: 604800 },
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  // Markdown twins of the articles for AI assistants: /insights/<slug>.md and /es/analisis/<slug>.md.
  async rewrites() {
    return [
      { source: "/insights/:slug.md", destination: "/insights-md/:slug" },
      { source: "/es/analisis/:slug.md", destination: "/insights-md/es/:slug" },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
