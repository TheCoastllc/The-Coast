import { chromium } from "playwright";
import fs from "fs";
const OUT = "/private/tmp/claude-501/-Users-davidcoast-Downloads/ebf404b8-f970-4d9a-8dd3-1810f5c3ae29/scratchpad";
const run = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  for (const [name, url, depth] of [
    ["fix-dfw-bottom", "https://coastglobal.org/locations/dallas-fort-worth", 99999],
    ["fix-ai-mid", "https://coastglobal.org/services/ai-consulting", 3200],
    ["fix-banner", "https://coastglobal.org/faq", 0],
  ] as const) {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    await page.mouse.move(195, 400);
    await page.waitForTimeout(1500);
    let last = -1;
    for (let i = 0; i < 200; i++) {
      await page.mouse.wheel(0, 900);
      await page.waitForTimeout(90);
      const y = await page.evaluate(() => window.scrollY);
      if (y >= depth || y === last) break;
      last = y;
    }
    // settle so scrubbed animations resolve
    await page.waitForTimeout(1800);
    if (name === "fix-dfw-bottom") { await page.mouse.wheel(0, -400); await page.waitForTimeout(1200); }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const shot = await page.screenshot();
    fs.writeFileSync(`${OUT}/${name}.png`, shot);
    console.log(`${name}: overflow=${overflow}px`);
  }
  await browser.close();
};
run();
