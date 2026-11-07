#!/usr/bin/env node
/**
 * Builds the static export for GitHub Pages and leaves it in ./out.
 *
 * Exists because `GITHUB_PAGES=true npm run build` is a bash-ism that does
 * nothing on PowerShell, and because the export needs a .nojekyll file —
 * without it GitHub's Jekyll step silently drops every path beginning with
 * an underscore, which is all of Next's _next/ assets.
 *
 * Usage:
 *   npm run build:pages                 → base path /eatmore
 *   npm run build:pages -- --base ""    → root domain, no base path
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const argv = process.argv.slice(2);
const baseIdx = argv.indexOf("--base");
const basePath = baseIdx === -1 ? "/eatmore" : argv[baseIdx + 1] ?? "";

const DIST = ".next-pages";
const OUT = "out";

for (const dir of [DIST, OUT]) {
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
}

const run = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    GITHUB_PAGES: "true",
    PAGES_BASE_PATH: basePath,
    BUILD_DIR: DIST,
  },
});

if (run.status !== 0) process.exit(run.status ?? 1);

// With a custom distDir, Next writes the export into that directory.
const exported = existsSync(resolve(DIST, "index.html")) ? DIST : OUT;
if (exported !== OUT) {
  mkdirSync(OUT, { recursive: true });
  cpSync(exported, OUT, { recursive: true });
  rmSync(DIST, { recursive: true, force: true });
}

writeFileSync(resolve(OUT, ".nojekyll"), "");

console.log(`\nStatic export ready in ./${OUT}  (base path: ${basePath || "/"})`);
