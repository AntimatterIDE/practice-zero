#!/usr/bin/env node
/**
 * Capture /og/scene at 1200×630 into public/og/preview.mp4 + public/og.png.
 *
 * Prerequisites: Playwright browsers + ffmpeg on PATH, and a running app:
 *   npm run dev -- --port 3000
 *   npm run og:render
 *
 * Or: OG_ORIGIN=http://127.0.0.1:3001 npm run og:render
 */
import { spawn, spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, access, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "og");
const mp4Out = path.join(outDir, "preview.mp4");
const pngOut = path.join(root, "public", "og.png");

const WIDTH = 1200;
const HEIGHT = 630;
const SETTLE_MS = 1400;
const DURATION_MS = 3600;
const ORIGIN = (process.env.OG_ORIGIN || process.env.BASE_URL || "http://127.0.0.1:3000").replace(
  /\/$/,
  "",
);

function hasFfmpeg() {
  return spawnSync("ffmpeg", ["-version"], { encoding: "utf8" }).status === 0;
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit" });
    p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

async function waitForOrigin() {
  const url = `${ORIGIN}/og/scene`;
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.ok || (res.status >= 300 && res.status < 400)) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Timed out waiting for ${url}. Start the app, then re-run og:render.`);
}

async function main() {
  if (!hasFfmpeg()) {
    throw new Error("ffmpeg is required on PATH to encode public/og/preview.mp4");
  }

  await waitForOrigin();
  await mkdir(outDir, { recursive: true });

  const work = await mkdtemp(path.join(tmpdir(), "pz-og-"));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
    recordVideo: { dir: work, size: { width: WIDTH, height: HEIGHT } },
  });
  const page = await context.newPage();

  await page.goto(`${ORIGIN}/og/scene`, { waitUntil: "networkidle" });
  await page.waitForSelector("[data-og-scene]");
  // Strip Next.js / Turbopack dev overlays (they inject after hydration)
  await page.evaluate(() => {
    document.querySelectorAll("nextjs-portal").forEach((n) => n.remove());
    const style = document.createElement("style");
    style.textContent =
      "nextjs-portal,[data-next-badge-root],[data-nextjs-toast],[data-nextjs-dialog-overlay],#__next-build-watcher{display:none!important;visibility:hidden!important}";
    document.head.appendChild(style);
    const obs = new MutationObserver(() => {
      document.querySelectorAll("nextjs-portal").forEach((n) => n.remove());
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  });
  // Wait for paint + motion intro so the first recorded frames aren't blank
  await page.waitForTimeout(SETTLE_MS);
  await page.screenshot({ path: pngOut, type: "png" });
  await page.waitForTimeout(DURATION_MS);
  await page.close();
  await context.close();
  await browser.close();

  const files = await readdir(work);
  const webm = files.find((f) => f.endsWith(".webm"));
  if (!webm) throw new Error("Playwright did not produce a .webm recording");

  const webmPath = path.join(work, webm);
  // Skip initial load (~settle), keep ~4s of animating content
  await run("ffmpeg", [
    "-y",
    "-ss",
    String(SETTLE_MS / 1000),
    "-i",
    webmPath,
    "-t",
    String(DURATION_MS / 1000),
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-profile:v",
    "main",
    "-movflags",
    "+faststart",
    "-an",
    "-crf",
    "23",
    "-vf",
    `scale=${WIDTH}:${HEIGHT}:flags=lanczos`,
    mp4Out,
  ]);

  await rm(work, { recursive: true, force: true });

  await access(mp4Out);
  await access(pngOut);

  console.log(`Wrote ${path.relative(root, mp4Out)}`);
  console.log(`Wrote ${path.relative(root, pngOut)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
