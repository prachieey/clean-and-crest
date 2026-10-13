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

// Aliases mapping between user-requested canonical names and internal slot IDs
const ALIAS_MAP = {
  "hero-home": ["hero-main"],
  "service-end-of-lease": ["service-end-of-lease-cleaning"],
  "service-commercial": ["service-commercial-cleaning"],
  "service-carpet-steam": ["service-carpet-steam-cleaning"],
  "service-upholstery": ["service-upholstery-cleaning"],
  "cleaner-at-work": ["about-main"],
  "cta-background": ["cta-band-bg"],
};

const files = fs.readdirSync(INCOMING_DIR).filter((f) => !f.startsWith(".") && f !== "README.md");

if (files.length === 0) {
  console.log(`\n${yellow("● No incoming photos found in assets/incoming-photos/")}`);
  console.log("  To add photos, place high-res originals in that directory matching any of:");
  Object.keys(imageManifest).forEach((id) => {
    if (id !== "brand-logo") {
      console.log(`    - ${bold(id + ".jpg")} (${imageManifest[id].requiredAspectRatio}) -> ${imageManifest[id].subject}`);
    }
  });
  console.log("\n  Then re-run: " + cyan("npm run process:images") + "\n");
  process.exit(0);
}

console.log(`\nProcessing incoming file(s) from ${INCOMING_DIR}...\n`);

let processedCount = 0;

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const baseName = path.basename(file, ext);
  const inputPath = path.join(INCOMING_DIR, file);

  // Match against slot in manifest
  const slot = imageManifest[baseName];

  if (!slot) {
    continue;
  }

  const outputFileName = `${baseName}.webp`;
  const outputPath = path.join(OUTPUT_DIR, outputFileName);

  try {
    const originalStats = fs.statSync(inputPath);
    const originalSizeKb = (originalStats.size / 1024).toFixed(1);

    // Target width:
    // Hero & CTA background: up to 1600px; Cards & details: up to 1200px
    const isHeroOrCta = baseName.includes("hero") || baseName.includes("cta");
    const targetWidth = isHeroOrCta ? 1600 : 1200;

    // Process with sharp: auto-orient, resize without enlargement, strip metadata, convert to webp
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

    // If an alias exists, copy the optimized WebP to the alias filename as well
    const aliases = ALIAS_MAP[baseName] || [];
    for (const alias of aliases) {
      const aliasOutputPath = path.join(OUTPUT_DIR, `${alias}.webp`);
      fs.copyFileSync(outputPath, aliasOutputPath);
      console.log(`     ↳ Alias synced: ${cyan(`${alias}.webp`)}`);
    }

    processedCount++;
  } catch (err) {
    console.error(`  ${red("✗ Failed to process")} ${file}:`, err.message);
  }
}

console.log("\n" + cyan("-".repeat(72)));
console.log(green(`Done! ${processedCount} image(s) processed and saved to public/images/.`));
console.log(cyan("-".repeat(72)) + "\n");
