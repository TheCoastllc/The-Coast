import { chromium } from "playwright";
const OUT = "/private/tmp/claude-501/-Users-davidcoast-Downloads/ebf404b8-f970-4d9a-8dd3-1810f5c3ae29/scratchpad";
const run = async () => {
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader"] });
  const shots: Array<[string, string, number]> = [
    ["loc-hub-top", "https://coastglobal.org/locations", 0],
    ["loc-hub-mid", "https://coastglobal.org/locations", 1400],
    ["loc-dfw-top", "https://coastglobal.org/locations/dallas-fort-worth", 0],
    ["loc-dfw-mid", "https://coastglobal.org/locations/dallas-fort-worth", 1800],
    ["loc-fl-mid", "https://coastglobal.org/locations/florida", 1000],
  ];
  const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
  let current = "";
  for (const [name, url, depth] of shots) {
    if (url !== current) {
      await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      await page.mouse.move(600, 380);
      await page.waitForTimeout(1500);
      current = url;
      // reset to top
      for (let i = 0; i < 40; i++) await page.mouse.wheel(0, -3000);
      await page.waitForTimeout(400);
    }
    // wheel to depth with distance feedback
    let y = await page.evaluate(() => window.scrollY);
    let guard = 0;
    while (y < depth - 60 && guard < 120) {
      await page.mouse.wheel(0, Math.min(600, depth - y));
      await page.waitForTimeout(60);
      y = await page.evaluate(() => window.scrollY);
      guard++;
    }
    await page.waitForTimeout(1200);
    const cdp = await page.context().newCDPSession(page);
    const shot = await cdp.send("Page.captureScreenshot", { format: "png" });
    const { writeFileSync } = await import("fs");
    writeFileSync(`${OUT}/${name}.png`, Buffer.from(shot.data, "base64"));
    console.log(`${name}: y=${y}`);
  }
  await browser.close();
};
run();
