import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const OUT = "/private/tmp/claude-501/-Users-davidcoast-Downloads/ebf404b8-f970-4d9a-8dd3-1810f5c3ae29/scratchpad";

async function run() {
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader"] });
  const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
  await page.goto("https://coastglobal.org", { waitUntil: "networkidle" });
  const cdp = await page.context().newCDPSession(page);
  await page.mouse.wheel(0, 10);
  await page.waitForTimeout(1200);

  // film spacer = the 350vh aria-hidden section; aim at its middle
  const info = await page.evaluate(() => {
    const secs = Array.from(document.querySelectorAll("section[aria-hidden]"));
    const s = secs.find((el) => el.getBoundingClientRect().height > window.innerHeight * 3);
    if (!s) return null;
    const r = s.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: r.height, vh: window.innerHeight };
  });
  if (!info) { console.log("NO FILM SPACER FOUND"); await browser.close(); return; }
  const target = info.top - info.vh + (info.height + info.vh) * 0.5; // raw=0.5
  let y = 0;
  for (let i = 0; i < 200 && y < target - 200; i++) {
    await page.mouse.wheel(0, Math.min(900, target - y));
    await page.waitForTimeout(70);
    y = await page.evaluate(() => window.scrollY);
  }
  await page.waitForTimeout(900);
  const { data } = await cdp.send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`${OUT}/default-film-mid2.png`, Buffer.from(data, "base64"));
  console.log(JSON.stringify({ spacer: info, landedY: y, target: Math.round(target) }));
  await browser.close();
}
run().catch((e) => { console.error(e); process.exit(1); });
