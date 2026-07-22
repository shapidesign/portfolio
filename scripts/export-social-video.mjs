#!/usr/bin/env node

import { spawn } from "node:child_process";
import { access, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const DEFAULT_BASE_URL = "http://127.0.0.1:3000";
const SERVER_TIMEOUT_MS = 90_000;
const EXPORT_TIMEOUT_MS = 120_000;

const FORMATS = {
  desktop: {
    label: "desktop horizontal",
    viewport: { width: 1920, height: 1080 },
    fileName: "solar-sequence-desktop-1920x1080.mp4",
  },
  mobile: {
    label: "mobile vertical",
    viewport: { width: 1080, height: 1920, isMobile: true, hasTouch: true },
    fileName: "solar-sequence-mobile-1080x1920.mp4",
  },
};

function parseArgs(argv) {
  const args = new Map();
  for (const arg of argv) {
    if (!arg.startsWith("--")) continue;
    const [key, value = "true"] = arg.slice(2).split("=");
    args.set(key, value);
  }
  return args;
}

async function commandExists(command) {
  const candidates = (process.env.PATH ?? "").split(path.delimiter).map((entry) => path.join(entry, command));
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return true;
    } catch {
      // Keep looking through PATH.
    }
  }
  return false;
}

async function canReach(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1500);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function waitForServer(url, timeoutMs) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await canReach(url)) return;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function startDevServer(port) {
  const child = spawn("npm", ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: process.cwd(),
    env: { ...process.env, NO_COLOR: "1" },
    detached: process.platform !== "win32",
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => process.stdout.write(`[next] ${chunk}`));
  child.stderr.on("data", (chunk) => process.stderr.write(`[next] ${chunk}`));

  return child;
}

function stopDevServer(server) {
  if (!server?.pid) return;
  try {
    if (process.platform === "win32") {
      server.kill("SIGTERM");
      return;
    }
    process.kill(-server.pid, "SIGTERM");
  } catch {
    server.kill("SIGTERM");
  }
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(stderr.trim());
        return;
      }
      reject(new Error(`${command} exited with ${code}\n${stderr}`));
    });
  });
}

async function getDurationSeconds(filePath) {
  const output = await runCommand("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    filePath,
  ]);
  const duration = Number.parseFloat(output);
  return Number.isFinite(duration) ? duration : 0;
}

async function convertToMp4WithSound(inputPath, outputPath) {
  const duration = await getDurationSeconds(inputPath);
  const fadeOutStart = Math.max(0, duration - 1.8).toFixed(2);

  await runCommand("ffmpeg", [
    "-y",
    "-i",
    inputPath,
    "-f",
    "lavfi",
    "-i",
    "sine=frequency=88:sample_rate=48000",
    "-shortest",
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-preset",
    "medium",
    "-crf",
    "18",
    "-c:a",
    "aac",
    "-b:a",
    "160k",
    "-af",
    `volume=0.035,afade=t=in:st=0:d=1.2,afade=t=out:st=${fadeOutStart}:d=1.8`,
    "-movflags",
    "+faststart",
    outputPath,
  ]);
}

async function recordFormat(browser, baseUrl, format, config, outputRoot) {
  const tempDir = path.join(outputRoot, ".tmp", format);
  await rm(tempDir, { recursive: true, force: true });
  await mkdir(tempDir, { recursive: true });

  const { width, height, ...viewportRest } = config.viewport;
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
    colorScheme: "dark",
    recordVideo: {
      dir: tempDir,
      size: { width, height },
    },
    ...viewportRest,
  });

  const page = await context.newPage();
  const url = new URL(baseUrl);
  url.searchParams.set("solarExport", "1");
  url.searchParams.set("format", format);

  console.log(`Recording ${config.label} at ${width}x${height}...`);
  await page.goto(url.toString(), { waitUntil: "networkidle", timeout: SERVER_TIMEOUT_MS });
  await page.waitForSelector(".solar-root", { timeout: SERVER_TIMEOUT_MS });
  await page.waitForFunction(() => window.__solarExportComplete === true, null, {
    timeout: EXPORT_TIMEOUT_MS,
  });

  const video = page.video();
  await context.close();
  const webmPath = await video.path();
  const outputPath = path.join(outputRoot, config.fileName);

  console.log(`Encoding ${path.relative(process.cwd(), outputPath)}...`);
  await convertToMp4WithSound(webmPath, outputPath);

  return outputPath;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const formatArg = args.get("format") ?? "all";
  const baseUrl = args.get("url") ?? DEFAULT_BASE_URL;
  const outputRoot = path.resolve(args.get("out") ?? "exports/social");
  const port = new URL(baseUrl).port || "3000";
  const formats =
    formatArg === "all"
      ? Object.keys(FORMATS)
      : formatArg
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);

  for (const format of formats) {
    if (!FORMATS[format]) {
      throw new Error(`Unknown format "${format}". Use desktop, mobile, or all.`);
    }
  }

  if (!(await commandExists("ffmpeg")) || !(await commandExists("ffprobe"))) {
    throw new Error("ffmpeg and ffprobe are required for MP4 export.");
  }

  await mkdir(outputRoot, { recursive: true });

  let server = null;
  if (!(await canReach(baseUrl))) {
    console.log(`Starting local Next server on ${baseUrl}...`);
    server = startDevServer(port);
    await waitForServer(baseUrl, SERVER_TIMEOUT_MS);
  }

  let browser = null;
  try {
    browser = await chromium.launch({ headless: true });
    const outputs = [];
    for (const format of formats) {
      outputs.push(await recordFormat(browser, baseUrl, format, FORMATS[format], outputRoot));
    }

    console.log("\nDone:");
    for (const output of outputs) {
      console.log(`- ${path.relative(process.cwd(), output)}`);
    }
  } finally {
    if (browser) await browser.close();
    if (server) stopDevServer(server);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
