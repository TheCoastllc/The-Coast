import { chromium } from "playwright";
import fs from "fs";
const OUT = "/private/tmp/claude-501/-Users-davidcoast-Downloads/ebf404b8-f970-4d9a-8dd3-1810f5c3ae29/scratchpad";
const run = async () => {
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader"] });
  const shots: Array<[string, string, number]> = [
    ["stage-light", "https://coastglobal.org/?stage=on&sun=circle", 0.35],
    ["stage-voyage", "https://coastglobal.org/?stage=on&sun=circle", 1.55],
    ["stage-through", "https://coastglobal.org/?stage=on&sun=circle", 1.95],
    ["stage-baseline", "https://coastglobal.org/", 1.95],
  ];
  for (const [name, url, depthVh] of shots) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await page.mouse.move(600, 380);
    await page.waitForTimeout(3500); // intro curtain
    const target = Math.round(750 * depthVh);
    let y = 0, guard = 0;
    while (y < target - 40 && guard < 300) {
      await page.mouse.wheel(0, Math.min(420, target - y));
      await page.waitForTimeout(60);
      y = await page.evaluate(() => window.scrollY);
      guard++;
    }
    await page.waitForTimeout(1600);
    const cdp = await page.context().newCDPSession(page);
    const shot = await cdp.send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(shot.data, "base64"));
    console.log(`${name}: y=${y}/${target}`);
    await page.close();
  }
  await browser.close();
};
run();
