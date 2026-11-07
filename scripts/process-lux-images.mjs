import sharp from "sharp";
import fs from "fs";
import path from "path";

const BRAIN_DIR = "/Users/macbook/.gemini/antigravity/brain/a8fbac2b-b537-49b2-a0e0-7eb2b4985774";
const OUT_IMAGES = path.resolve(process.cwd(), "public/images");
const OUT_ASSETS = path.resolve(process.cwd(), "assets/incoming-photos");
const OUT_LUX = path.resolve(process.cwd(), "public/images/lux");

[OUT_IMAGES, OUT_ASSETS, OUT_LUX].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const mappings = [
  {
    targetBase: "lux-hero-wide",
    sourceFile: "lux_hero_wide_1794030834101.jpg",
    aspect: "3:2",
    crop: null,
  },
  {
    targetBase: "lux-hero-portrait",
    sourceFile: "lux_hero_portrait_1794030856429.jpg",
    aspect: "3:4",
    crop: null,
  },
  {
    targetBase: "lux-hero-detail",
    sourceFile: "lux_hero_detail_1794030881750.jpg",
    aspect: "1:1",
    crop: null,
  },
  {
    targetBase: "lux-service-house",
    sourceFile: "lux_service_house_1794030845403.jpg",
    aspect: "3:4",
    crop: null,
  },
  {
    targetBase: "lux-service-lease",
    sourceFile: "lux_service_lease_1794030868826.jpg",
    aspect: "3:4",
    crop: null,
  },
  {
    targetBase: "lux-service-deep",
    sourceFile: "lux_service_deep_1794030894293.jpg",
    aspect: "3:4",
    crop: null,
  },
  {
    targetBase: "lux-service-commercial",
    sourceFile: "lux_service_commercial_1794030921466.jpg",
    aspect: "3:4",
    crop: null,
  },
  {
    targetBase: "lux-service-carpet",
    sourceFile: "lux_service_carpet_1794030850226.jpg",
    aspect: "3:4",
    crop: null,
  },
  {
    targetBase: "lux-service-upholstery",
    sourceFile: "lux_service_upholstery_1794030875520.jpg",
    aspect: "3:4",
    crop: null,
  },
  {
    targetBase: "lux-why-choose",
    sourceFile: "lux_why_choose_1794030896865.jpg",
    aspect: "4:5",
    crop: { width: 896, height: 1120, top: 40, left: 0 },
  },
  {
    targetBase: "lux-detail-gallery-1",
    sourceFile: "lux_detail_gallery_1_1794030855150.jpg",
    aspect: "4:5",
    crop: { width: 896, height: 1120, top: 40, left: 0 },
  },
  {
    targetBase: "lux-detail-gallery-2",
    sourceFile: "lux_detail_gallery_2_1794030871933.jpg",
    aspect: "4:5",
    crop: { width: 896, height: 1120, top: 40, left: 0 },
  },
  {
    targetBase: "lux-detail-gallery-3",
    sourceFile: "lux_detail_gallery_3_1794030891574.jpg",
    aspect: "4:5",
    crop: { width: 896, height: 1120, top: 40, left: 0 },
  },
  {
    targetBase: "lux-detail-gallery-4",
    sourceFile: "lux_service_lease_1794030868826.jpg",
    aspect: "4:5",
    crop: { width: 896, height: 1120, top: 80, left: 0 },
  },
  {
    targetBase: "lux-cta-wide",
    sourceFile: "lux_hero_wide_1794030834101.jpg",
    aspect: "21:9",
    // 1260 x 540 is 21:9
    crop: { width: 1260, height: 540, top: 150, left: 2 },
    softFocus: true,
  },
];

async function run() {
  console.log("Starting Luxury Editorial Photo Suite processing...");

  for (const item of mappings) {
    const srcPath = path.join(BRAIN_DIR, item.sourceFile);
    if (!fs.existsSync(srcPath)) {
      console.error(`Source missing: ${srcPath}`);
      continue;
    }

    let pipeline = sharp(srcPath);

    if (item.crop) {
      pipeline = pipeline.extract(item.crop);
    }

    if (item.softFocus) {
      pipeline = pipeline.blur(1.2);
    }

    // Save as JPG (quality 92, mozjpeg)
    const jpgBuffer = await pipeline
      .clone()
      .jpeg({ quality: 92, mozjpeg: true })
      .toBuffer();

    // Save as WebP (quality 88)
    const webpBuffer = await pipeline
      .clone()
      .webp({ quality: 88, effort: 6 })
      .toBuffer();

    // Write to public/images/
    fs.writeFileSync(path.join(OUT_IMAGES, `${item.targetBase}.jpg`), jpgBuffer);
    fs.writeFileSync(path.join(OUT_IMAGES, `${item.targetBase}.webp`), webpBuffer);

    // Also write to public/images/lux/
    fs.writeFileSync(path.join(OUT_LUX, `${item.targetBase}.jpg`), jpgBuffer);
    fs.writeFileSync(path.join(OUT_LUX, `${item.targetBase}.webp`), webpBuffer);

    // Also archive in assets/incoming-photos/
    fs.writeFileSync(path.join(OUT_ASSETS, `${item.targetBase}.jpg`), jpgBuffer);

    console.log(`✓ Processed ${item.targetBase} (${item.aspect}) -> JPG & WebP (${(webpBuffer.length / 1024).toFixed(1)} KB)`);
  }

  console.log("\nAll 15 images processed and saved to public/images/ and assets/incoming-photos/!");
}

run().catch(console.error);

