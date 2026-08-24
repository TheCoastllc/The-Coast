/* Normalise harvested client logos to white-on-transparent masks at uniform
 * height, per the harvest agents' per-logo structure notes. Modes:
 *   alpha      - use the asset's own alpha (already a clean silhouette source)
 *   lum        - keep LIGHT pixels (light mark on dark tile, e.g. Solomon)
 *   invlum     - keep DARK pixels (dark ink on white/light bg, e.g. Dada, Zapped)
 *   alphaXinv  - alpha AND darkness (knocks out white interiors, e.g. iAMD
 *                heartbeat, AMG globe continents)
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SRC = "/private/tmp/claude-501/-Users-davidcoast-Downloads/ccfea029-f2ac-4c53-b644-a522e6661323/scratchpad/logos";
const OUT = "public/clients";
mkdirSync(OUT, { recursive: true });

type Mode = "alpha" | "lum" | "invlum" | "alphaXinv";
const JOBS: { id: string; file: string; mode: Mode; minAlpha?: number }[] = [
  { id: "troi", file: "troi.png", mode: "alpha" },
  { id: "kando", file: "kando.png", mode: "alpha" },
  { id: "new-era-aesthetics", file: "new-era-aesthetics.png", mode: "alpha" },
  { id: "world-is-yours", file: "world-is-yours.png", mode: "alpha" },
  { id: "gifted-touch", file: "gifted-touch.svg", mode: "alpha" },
  { id: "solomon-katsman", file: "solomon-katsman.svg", mode: "lum", minAlpha: 90 },
  { id: "dada-global-finance", file: "dada-global-finance.png", mode: "invlum" },
  { id: "omotunde-hospital", file: "omotunde-hospital.svg", mode: "alpha" },
  { id: "iamd-health", file: "iamd-health.png", mode: "alphaXinv" },
  { id: "ogaticket", file: "ogaticket.png", mode: "alpha", minAlpha: 46 },
  { id: "amg-records", file: "amg-records.png", mode: "alphaXinv", minAlpha: 60 },
  { id: "zapped", file: "zapped.png", mode: "invlum", minAlpha: 140 },
];

async function run() {
  const aspects: Record<string, number> = {};
  for (const j of JOBS) {
    const srcPath = `${SRC}/${j.file}`;
    const { data, info } = await sharp(srcPath, { density: 300 })
      .ensureAlpha()
      .resize({ height: 480, fit: "inside", withoutEnlargement: false })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { width: w, height: h, channels } = info;
    const rgba = Buffer.alloc(w * h * 4, 255);
    for (let i = 0; i < w * h; i++) {
      const r = data[i * channels], g = data[i * channels + 1], b = data[i * channels + 2];
      const a = channels > 3 ? data[i * channels + 3] : 255;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      let m: number;
      switch (j.mode) {
        case "alpha": m = a; break;
        case "lum": m = (lum / 255) * a; break;
        case "invlum": m = ((255 - lum) / 255) * a; break;
        case "alphaXinv": m = ((255 - lum) / 255) * a; break;
      }
      if (j.minAlpha && m < j.minAlpha) m = 0;
      rgba[i * 4 + 3] = Math.max(0, Math.min(255, Math.round(m)));
    }
    const buf = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
    const final = await sharp(buf).trim({ threshold: 8 }).png().toBuffer();
    await sharp(final).resize({ height: 240, withoutEnlargement: false }).png().toFile(`${OUT}/${j.id}.png`);
    const m2 = await sharp(`${OUT}/${j.id}.png`).metadata();
    aspects[j.id] = Number(((m2.width ?? 240) / (m2.height ?? 240)).toFixed(2));
    console.log(`${j.id.padEnd(22)} ${j.mode.padEnd(9)} -> ${m2.width}x${m2.height} aspect ${aspects[j.id]}`);
  }
  console.log("\nASPECTS = " + JSON.stringify(aspects));
}
run().catch((e) => { console.error(e); process.exit(1); });
