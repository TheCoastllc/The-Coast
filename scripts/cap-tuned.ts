import { chromium } from "playwright";
import fs from "fs";
const OUT = "/private/tmp/claude-501/-Users-davidcoast-Downloads/ebf404b8-f970-4d9a-8dd3-1810f5c3ae29/scratchpad";
const run = async () => {
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader"] });
  const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
  await page.goto("https://coastglobal.org/?film=on", { waitUntil: "networkidle", timeout: 60000 });
  await page.mouse.move(600, 380);
  await page.waitForTimeout(5000);
  const cdp = await page.context().newCDPSession(page);
  let y = 0;
  const to = async (t: number) => { let g = 0; while (y < t - 50 && g < 600) { await page.mouse.wheel(0, Math.min(480, t - y)); await page.waitForTimeout(70); y = await page.evaluate(() => window.scrollY); g++; } };
  const shoot = async (name: string) => {
    await page.waitForTimeout(1500);
    const s = await cdp.send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(s.data, "base64"));
    console.log(name, "y=", y);
  };
  await shoot("tuned-0");
  await to(Math.round(750 * 1.2)); await shoot("tuned-12");
  await to(Math.round(750 * 2.1)); await shoot("tuned-21");
  await to(Math.round(750 * 4.5)); await shoot("tuned-film");
  await to(Math.round(750 * 6.0)); await shoot("tuned-exit");
  await browser.close();
};
run();
