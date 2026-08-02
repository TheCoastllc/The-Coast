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
  const shoot = async (name: string) => {
    await page.waitForTimeout(1600);
    const s = await cdp.send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(s.data, "base64"));
    console.log(name, "y=", await page.evaluate(() => window.scrollY));
  };
  await shoot("fs-landing");
  const to = async (target: number) => {
    let y = await page.evaluate(() => window.scrollY);
    let guard = 0;
    while (y < target - 50 && guard < 400) {
      await page.mouse.wheel(0, Math.min(500, target - y));
      await page.waitForTimeout(70);
      y = await page.evaluate(() => window.scrollY);
      guard++;
    }
  };
  await to(Math.round(750 * 1.3)); await shoot("fs-approach");
  await to(Math.round(750 * 1.95)); await shoot("fs-arrival");
  // finale: deep-scroll to the boat finale section (anchor ≈ layer opacity plateau)
  await to(Math.round(750 * 30)); // far down; finale is near page end
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  await to(max - 900); await shoot("fs-finale");
  await browser.close();
};
run();
