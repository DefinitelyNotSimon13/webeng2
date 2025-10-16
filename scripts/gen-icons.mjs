import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const INPUT = "assets-src/web-icon.png";
const OUT_DIR = "public/icons";

const sizes = [
  { name: "128x128.png", size: 128 },
  { name: "144x144.png", size: 144 },
  { name: "152x152.png", size: 152 },
  { name: "192x192.png", size: 192 },
  { name: "256x256.png", size: 256 },
  { name: "512x512.png", size: 512 },
  { name: "favicon.png", size: 128 },
  { name: "apple-touch-icon.png", size: 256 },
];

async function main() {
  try {
    await fs.access(INPUT);
  } catch {
    console.error(`Source ${INPUT} not found in ${process.cwd()}`);
    process.exit(1);
  }

  await fs.mkdir(OUT_DIR, { recursive: true });

  const src = sharp(INPUT).png({ compressionLevel: 9 });

  for (const { name, size } of sizes) {
    const outPath = path.join(OUT_DIR, name);
    await src
      .clone()
      .resize(size, size, {
        fit: "cover",
        withoutEnlargement: true,
      })
      .toFile(outPath);
    console.log(`Created ${outPath} (${size}x${size})`);
  }

  console.log("\nAll icons written to:", OUT_DIR);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
