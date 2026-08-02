/* Slice a video into WebP frames via Playwright seek-extraction - no ffmpeg,
 * no EZGIF. Deterministic: seek t, wait for the seeked frame, blit, export. */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const SRC = process.argv[2]; // absolute path to the mp4
const OUT = "/Users/davidcoast/Downloads/the-coast/public/story/film";
const FRAMES = 60;

const run = async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const b64 = fs.readFileSync(SRC).toString("base64");
  await page.setContent(`<video id="v" muted playsinline></video><canvas id="c"></canvas>`);
  await page.evaluate(async (data) => {
    const v = document.getElementById("v") as HTMLVideoElement;
    v.src = `data:video/mp4;base64,${data}`;
    await new Promise((res) => (v.onloadedmetadata = res));
    const c = document.getElementById("c") as HTMLCanvasElement;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    (window as any).__dur = v.duration;
  }, b64);
  const dur: number = await page.evaluate("window.__dur");
  console.log("video duration:", dur.toFixed(2), "s");
  for (let i = 0; i < FRAMES; i++) {
    // keep a hair inside the ends so seeks always resolve
    const t = 0.02 + (i / (FRAMES - 1)) * (dur - 0.1);
    const data: string = await page.evaluate(async (tt) => {
      const v = document.getElementById("v") as HTMLVideoElement;
      const c = document.getElementById("c") as HTMLCanvasElement;
      await new Promise<void>((res) => {
        v.onseeked = () => res();
        v.currentTime = tt;
      });
      c.getContext("2d")!.drawImage(v, 0, 0);
      return c.toDataURL("image/webp", 0.72);
    }, t);
    fs.writeFileSync(
      path.join(OUT, `frame-${String(i).padStart(3, "0")}.webp`),
      Buffer.from(data.split(",")[1], "base64")
    );
  }
  await browser.close();
  const sizes = fs.readdirSync(OUT).map((f) => fs.statSync(path.join(OUT, f)).size);
  console.log(`${sizes.length} frames, total ${(sizes.reduce((a, b) => a + b, 0) / 1048576).toFixed(2)}MB, avg ${(sizes.reduce((a, b) => a + b, 0) / sizes.length / 1024).toFixed(0)}KB`);
};
run();
