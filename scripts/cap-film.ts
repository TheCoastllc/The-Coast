import { chromium } from "playwright";
import fs from "fs";
const OUT = "/private/tmp/claude-501/-Users-davidcoast-Downloads/ebf404b8-f970-4d9a-8dd3-1810f5c3ae29/scratchpad";
const run = async () => {
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader"] });
  // desktop with flag: scrub the film window (spacer starts after 300vh hero track)
  const d = await browser.newPage({ viewport: { width: 1200, height: 750 } });
  await d.goto("https://coastglobal.org/?film=on", { waitUntil: "networkidle", timeout: 60000 });
  await d.mouse.move(600, 380);
  await d.waitForTimeout(4000);
  const cdp = await d.context().newCDPSession(d);
  let y = 0;
  const to = async (t: number) => { let g = 0; while (y < t - 60 && g < 600) { await d.mouse.wheel(0, Math.min(520, t - y)); await d.waitForTimeout(65); y = await d.evaluate(() => window.scrollY); g++; } };
  // film window: spacer occupies ~[3vh, 6.5vh] of scroll; raw .25/.5/.75 ≈ 3.9/5.0/6.1 vh
  for (const [name, vhDepth] of [["film-25", 3.9], ["film-50", 5.0], ["film-75", 6.1]] as const) {
    await to(Math.round(750 * vhDepth));
    await d.waitForTimeout(1400);
    const s = await cdp.send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(s.data, "base64"));
    console.log(name, "y=", y);
  }
  await d.close();
  // mobile WITH flag: section must be absent + zero frame requests
  const m = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const frameReqs: string[] = [];
  m.on("request", (r) => { if (r.url().includes("/story/film/")) frameReqs.push(r.url()); });
  await m.goto("https://coastglobal.org/?film=on", { waitUntil: "networkidle", timeout: 60000 });
  await m.mouse.move(195, 400);
  for (let i = 0; i < 20; i++) { await m.mouse.wheel(0, 700); await m.waitForTimeout(70); }
  await m.waitForTimeout(1500);
  const sectionCount = await m.evaluate(() => document.querySelectorAll('section[class*="FilmStrip"], div[class*="FilmStrip"]').length);
  console.log("mobile frame requests:", frameReqs.length, "| FilmStrip DOM nodes:", sectionCount);
  // flagless desktop: no film spacer, homepage weight unchanged
  const f = await browser.newPage({ viewport: { width: 1200, height: 750 } });
  const flaglessReqs: string[] = [];
  f.on("request", (r) => { if (r.url().includes("/story/film/")) flaglessReqs.push(r.url()); });
  await f.goto("https://coastglobal.org/", { waitUntil: "networkidle", timeout: 60000 });
  await f.waitForTimeout(3000);
  const h = await f.evaluate(() => document.documentElement.scrollHeight);
  console.log("flagless frame requests:", flaglessReqs.length, "| flagless page height:", h);
  await browser.close();
};
run();
