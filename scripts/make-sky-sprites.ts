/* Cuts the generated 4K sky plates (photographic sun + rose-gold cloud sheet,
 * both on pure black for additive compositing) into web textures:
 *   public/story/sun.webp        1024 sq  - disc + soft corona, centered
 *   public/story/cloud-0..3.webp 768w     - four distinct dawn clouds
 * Crop boxes are hand-tuned to the specific generations (see job ids in
 * the-coast-motion-system memory). */
import sharp from "sharp";

const SCRATCH =
  "/private/tmp/claude-501/-Users-davidcoast-Downloads/ebf404b8-f970-4d9a-8dd3-1810f5c3ae29/scratchpad";
const OUT = "public/story";

async function run() {
  await sharp(`${SCRATCH}/sun-sprite-4k.png`)
    .extract({ left: 540, top: 540, width: 1800, height: 1800 })
    .resize({ width: 1024 })
    .webp({ quality: 85 })
    .toFile(`${OUT}/sun.webp`);
  console.log("sun.webp written");

  const clouds = [
    { left: 100, top: 90, width: 1660, height: 890 }, // big top-left cumulus
    { left: 2460, top: 450, width: 1380, height: 520 }, // top-right cumulus
    { left: 90, top: 1460, width: 1400, height: 610 }, // bottom-left wispy
    { left: 2520, top: 1200, width: 1320, height: 600 }, // right-mid cumulus
  ];
  for (let i = 0; i < clouds.length; i++) {
    await sharp(`${SCRATCH}/cloud-sheet-4k.png`)
      .extract(clouds[i])
      .resize({ width: 768 })
      .webp({ quality: 80 })
      .toFile(`${OUT}/cloud-${i}.webp`);
    console.log(`cloud-${i}.webp written`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
