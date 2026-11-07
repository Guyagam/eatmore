import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a production build run without fighting a dev server that already
  // holds .next: `BUILD_DIR=.next-build npm run build`.
  distDir: process.env.BUILD_DIR || ".next",
};

export default nextConfig;
