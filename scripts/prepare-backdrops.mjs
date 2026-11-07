import fs from "fs";
import path from "path";
import sharp from "sharp";

const outDir = path.resolve(process.cwd(), "public/images/backdrops");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const tasks = [
  { in: "assets/incoming-photos/lux-hero-wide.jpg", out: "bg-hero-curtains.webp" },
  { in: "assets/incoming-photos/lux-service-house.jpg", out: "bg-timber-floor-light.webp" },
  { in: "assets/incoming-photos/lux-why-choose.jpg", out: "bg-why-clean.webp" },
  { in: "assets/incoming-photos/lux-hero-detail.jpg", out: "bg-white-flowers.webp" },
  { in: "assets/incoming-photos/lux-detail-gallery-3.jpg", out: "bg-water-sparkle.webp" },
  { in: "assets/incoming-photos/lux-cta-wide.jpg", out: "bg-footer-wide.webp" },
];

for (const t of tasks) {
  const src = path.resolve(process.cwd(), t.in);
  const dest = path.join(outDir, t.out);
  if (fs.existsSync(src)) {
    await sharp(src)
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 55, effort: 6 })
      .toFile(dest);
    const stat = fs.statSync(dest);
    console.log(`Generated ${t.out}: ${Math.round(stat.size / 1024)} KB`);
  }
}
