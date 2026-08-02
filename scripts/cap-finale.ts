import { chromium } from "playwright";
import fs from "fs";
const OUT = "/private/tmp/claude-501/-Users-davidcoast-Downloads/ebf404b8-f970-4d9a-8dd3-1810f5c3ae29/scratchpad";
const run = async () => {
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader"] });
  const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
  await page.goto("https://coastglobal.org/", { waitUntil: "networkidle", timeout: 60000 });
  await page.mouse.move(600, 380);
  await page.waitForTimeout(4000);
  const cdp = await page.context().newCDPSession(page);
  // arrival re-check at deeper beat (side profile fully turned)
  let y = 0, guard = 0;
  const to = async (target: number) => {
    guard = 0;
    while (y < target - 50 && guard < 500) {
      await page.mouse.wheel(0, Math.min(500, target - y));
      await page.waitForTimeout(70);
      y = await page.evaluate(() => window.scrollY);
      guard++;
    }
  };
  await to(Math.round(750 * 2.1));
  await page.waitForTimeout(1600);
  let s = await cdp.send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(`${OUT}/fs2-sideturn.png`, Buffer.from(s.data, "base64"));
  console.log("sideturn y=", y);
  // finale: creep from 78% of max until the fixed finale layer is opaque
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  await to(Math.round(max * 0.78));
  let op = 0;
  for (let i = 0; i < 120; i++) {
    await page.mouse.wheel(0, 350);
    await page.waitForTimeout(90);
    op = await page.evaluate(() => {
      const els = [...document.querySelectorAll('div[class*="layer"]')] as HTMLElement[];
      let best = 0;
      for (const el of els) {
        const st = getComputedStyle(el);
        if (st.position === "fixed" && el.querySelector("canvas")) best = Math.max(best, parseFloat(st.opacity) || 0);
      }
      return best;
    });
    if (op > 0.85) break;
  }
  await page.waitForTimeout(1800);
  s = await cdp.send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(`${OUT}/fs2-finale.png`, Buffer.from(s.data, "base64"));
  console.log("finale layer opacity=", op, "y=", await page.evaluate(() => window.scrollY));
  await browser.close();
};
run();
