import { chromium } from "playwright";
const OUT = "/private/tmp/claude-501/-Users-davidcoast-Downloads/ebf404b8-f970-4d9a-8dd3-1810f5c3ae29/scratchpad";
const run = async () => {
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader"] });
  for (const [name, vp] of [
    ["footer-desktop2", { width: 1280, height: 800 }],
    ["footer-mobile2", { width: 390, height: 844 }],
  ] as const) {
    const page = await browser.newPage({ viewport: vp });
    await page.goto("https://gallery.coastglobal.org/gallery", { waitUntil: "networkidle", timeout: 45000 });
    await page.mouse.move(vp.width / 2, vp.height / 2);
    let lastY = -1;
    for (let i = 0; i < 300; i++) {
      await page.mouse.wheel(0, 1600);
      await page.waitForTimeout(40);
      if (i % 10 === 9) {
        const y = await page.evaluate(() => window.scrollY);
        if (y === lastY) break;
        lastY = y;
      }
    }
    await page.waitForTimeout(1200);
    const cdp = await page.context().newCDPSession(page);
    const shot = await cdp.send("Page.captureScreenshot", { format: "png" });
    const { writeFileSync } = await import("fs");
    writeFileSync(`${OUT}/${name}.png`, Buffer.from(shot.data, "base64"));
    await page.close();
  }
  await browser.close();
  console.log("done");
};
run();
