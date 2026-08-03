import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const OUT = "/private/tmp/claude-501/-Users-davidcoast-Downloads/ccfea029-f2ac-4c53-b644-a522e6661323/scratchpad";

async function capture(url: string, tag: string) {
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader"] });
  const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
  const errors: string[] = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url, { waitUntil: "networkidle" });
  const cdp = await page.context().newCDPSession(page);
  await page.mouse.wheel(0, 10);
  await page.waitForTimeout(1600);
  const vh = 750;
  const beats = [0, 0.45, 0.8]; // p = scrollY / (2.4*vh)
  let y = await page.evaluate(() => window.scrollY);
  for (const p of beats) {
    const target = Math.round(p * 2.4 * vh);
    for (let i = 0; i < 60 && Math.abs(y - target) > 40; i++) {
      await page.mouse.wheel(0, Math.max(-400, Math.min(400, target - y)));
      await page.waitForTimeout(80);
      y = await page.evaluate(() => window.scrollY);
    }
    await page.waitForTimeout(900);
    const { data } = await cdp.send("Page.captureScreenshot", { format: "png" });
    writeFileSync(`${OUT}/sky-${tag}-p${String(p).replace(".", "")}.png`, Buffer.from(data, "base64"));
  }
  await browser.close();
  return errors;
}

(async () => {
  const e1 = await capture("https://coastglobal.org", "cur");
  const e2 = await capture("https://coastglobal.org/?sky=up", "up");
  console.log(JSON.stringify({ currentErrors: e1, upErrors: e2 }));
})();
