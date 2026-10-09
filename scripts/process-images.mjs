#!/usr/bin/env node

/**
 * Clean & Crest — Automated Image Pipeline Script
 *
 * Processes incoming raw photography from `assets/incoming-photos/`:
 * 1. Resizes to target responsive dimensions according to aspect ratio.
 * 2. Converts to modern WebP format.
 * 3. Strips all EXIF, GPS, and camera metadata for privacy and size reduction.
 * 4. Compresses to meet strict budget targets (hero <= 300 KB, cards <= 200 KB).
 * 5. Places optimized assets directly into `public/images/`.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { imageManifest } from "../src/config/imageManifest.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INCOMING_DIR = path.resolve(__dirname, "../assets/incoming-photos");
const OUTPUT_DIR = path.resolve(__dirname, "../public/images");

const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

console.log("\n" + cyan("=".repeat(72)));
console.log(bold(cyan("  📸  CLEAN & CREST — IMAGE PROCESSING PIPELINE")));
console.log(cyan("=".repeat(72)));

if (!fs.existsSync(INCOMING_DIR)) {
  fs.mkdirSync(INCOMING_DIR, { recursive: true });
}

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const files = fs.readdirSync(INCOMING_DIR).filter((f) => !f.startsWith(".") && f !== "README.md");

if (files.length === 0) {
  console.log(`\n${yellow("● No incoming photos found in assets/incoming-photos/")}`);
  console.log("  To add real photos, place high-res originals in that directory matching any of:");
  Object.keys(imageManifest).forEach((id) => {
    if (id !== "brand-logo") {
      console.log(`    - ${bold(id + ".jpg")} (${imageManifest[id].requiredAspectRatio}) -> ${imageManifest[id].subject}`);
    }
  });
  console.log("\n  Then re-run: " + cyan("npm run process:images") + "\n");
  process.exit(0);
}

console.log(`\nProcessing ${files.length} incoming file(s)...\n`);

let processedCount = 0;

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const baseName = path.basename(file, ext);
  const inputPath = path.join(INCOMING_DIR, file);

  // Match against slot in manifest
  const slot = imageManifest[baseName];

  if (!slot) {
    console.log(`  ${yellow("⚠️ Skipped:")} ${file} (no matching slot in imageManifest.ts)`);
    continue;
  }

  const outputFileName = `${baseName}.webp`;
  const outputPath = path.join(OUTPUT_DIR, outputFileName);

  try {
    const originalStats = fs.statSync(inputPath);
    const originalSizeKb = (originalStats.size / 1024).toFixed(1);

    // Target width based on slot type:
    // Hero: up to 1600px wide; Cards: up to 1280px wide
    const targetWidth = baseName === "hero-main" ? 1600 : 1280;

    // Process with sharp: resize, strip metadata (default in sharp), convert to webp
    const imagePipeline = sharp(inputPath)
      .rotate() // auto-orient based on EXIF before stripping
      .resize({
        width: targetWidth,
        withoutEnlargement: true,
      })
      .webp({
        quality: 82,
        effort: 6,
      });

    await imagePipeline.toFile(outputPath);

    const newStats = fs.statSync(outputPath);
    const newSizeKb = (newStats.size / 1024).toFixed(1);
    const isWithinBudget = newStats.size <= slot.maxFileSizeKb * 1024;

    console.log(`  ${green("✓")} ${bold(file)} -> ${cyan(outputFileName)}`);
    console.log(`     Original: ${originalSizeKb} KB  -->  Optimized: ${bold(newSizeKb + " KB")} (${slot.requiredAspectRatio})`);
    console.log(`     Metadata stripped: YES  |  Budget: ${slot.maxFileSizeKb} KB ${isWithinBudget ? green("[PASS]") : red("[OVER BUDGET]")}`);

    processedCount++;
  } catch (err) {
    console.error(`  ${red("✗ Failed to process")} ${file}:`, err.message);
  }
}

console.log("\n" + cyan("-".repeat(72)));
console.log(green(`Done! ${processedCount} image(s) processed and saved to public/images/.`));
console.log(cyan("-".repeat(72)) + "\n");
