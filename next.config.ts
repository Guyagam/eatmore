import type { NextConfig } from "next";

/**
 * GITHUB_PAGES=true switches the build to a fully static export served from
 * a sub-path (https://<user>.github.io/<repo>/). Local `npm run dev` and a
 * normal `npm run build` are untouched, so nothing about day-to-day work
 * changes — and when this moves to a real host with a root domain, deleting
 * the branch below is the whole migration.
 */
const onPages = process.env.GITHUB_PAGES === "true";
const repo = process.env.PAGES_BASE_PATH || "/eatmore";

const nextConfig: NextConfig = {
  // Lets a production build run without fighting a dev server that already
  // holds .next: `BUILD_DIR=.next-build npm run build`.
  distDir: process.env.BUILD_DIR || ".next",

  ...(onPages
    ? {
        output: "export" as const,
        basePath: repo,
        assetPrefix: repo,
        // Pages serves directories, so every route needs its own index.html.
        trailingSlash: true,
        // No Node server on Pages, so the image optimiser can't run. Nothing
        // uses next/image yet; this keeps the door open for when it does.
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
