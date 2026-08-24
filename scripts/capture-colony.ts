import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
const OUT = "/private/tmp/claude-501/-Users-davidcoast-Downloads/ccfea029-f2ac-4c53-b644-a522e6661323/scratchpad/colony";
mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ["--use-angle=swiftshader"] });
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
  await p.goto("https://colonyapp.ai", { waitUntil: "networkidle", timeout: 60000 });
  await p.waitForTimeout(3500);
  for (const t of ["Accept", "Got it", "Close"]) { try { await p.click(`text=${t}`, { timeout: 700 }); } catch {} }
  // settle lazy content, then return to top
  for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, 900); await p.waitForTimeout(250); }
  for (let i = 0; i < 12; i++) { await p.mouse.wheel(0, -1200); await p.waitForTimeout(120); }
  await p.waitForTimeout(1500);
  const cdp = await p.context().newCDPSession(p);
  let { data } = await cdp.send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`${OUT}/hero.png`, Buffer.from(data, "base64"));
  // one features shot
  for (let i = 0; i < 4; i++) { await p.mouse.wheel(0, 850); await p.waitForTimeout(300); }
  await p.waitForTimeout(1200);
  ({ data } = await cdp.send("Page.captureScreenshot", { format: "png" }));
  writeFileSync(`${OUT}/features.png`, Buffer.from(data, "base64"));
  console.log("captured");
  await b.close();
})();
