import { chromium } from "playwright";
import fs from "fs";
const OUT = "/private/tmp/claude-501/-Users-davidcoast-Downloads/ebf404b8-f970-4d9a-8dd3-1810f5c3ae29/scratchpad";
const run = async () => {
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader"] });
  // mobile portrait - what David sees on his phone
  const m = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await m.goto("https://coastglobal.org/", { waitUntil: "networkidle", timeout: 60000 });
  await m.waitForTimeout(4500);
  fs.writeFileSync(`${OUT}/broke-mobile-hero.png`, await m.screenshot());
  await m.mouse.move(195, 420);
  for (let i = 0; i < 14; i++) { await m.mouse.wheel(0, 600); await m.waitForTimeout(80); }
  await m.waitForTimeout(1200);
  fs.writeFileSync(`${OUT}/broke-mobile-scroll.png`, await m.screenshot());
  console.log("mobile scrollY:", await m.evaluate(() => window.scrollY), "overflow:", await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
  await m.close();
  // desktop voyage beats
  const d = await browser.newPage({ viewport: { width: 1200, height: 750 } });
  await d.goto("https://coastglobal.org/", { waitUntil: "networkidle", timeout: 60000 });
  await d.mouse.move(600, 380);
  await d.waitForTimeout(4000);
  const cdp = await d.context().newCDPSession(d);
  let y = 0;
  const to = async (t: number) => { let g = 0; while (y < t - 50 && g < 400) { await d.mouse.wheel(0, Math.min(450, t - y)); await d.waitForTimeout(70); y = await d.evaluate(() => window.scrollY); g++; } };
  for (const [name, depth] of [["broke-d-16", 1.6], ["broke-d-19", 1.9], ["broke-d-22", 2.2]] as const) {
    await to(Math.round(750 * depth));
    await d.waitForTimeout(1400);
    const s = await cdp.send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(s.data, "base64"));
  }
  await browser.close();
};
run();
