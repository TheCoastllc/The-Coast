import { chromium } from "playwright";
import fs from "fs";
const OUT = "/private/tmp/claude-501/-Users-davidcoast-Downloads/ebf404b8-f970-4d9a-8dd3-1810f5c3ae29/scratchpad";
const run = async () => {
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader"] });
  const page = await browser.newPage({ viewport: { width: 940, height: 660 } });
  page.on("pageerror", (e) => console.log("pageerror:", String(e).slice(0, 200)));
  await page.goto("http://localhost:8931/scripts/glb-viewer.html", { waitUntil: "load", timeout: 30000 });
  await page.waitForFunction("window.__ready === true || window.__error", { timeout: 120000 });
  const err = await page.evaluate("window.__error");
  if (err) { console.log("GLB ERROR:", err); await browser.close(); return; }
  for (const [name, yaw, pitch] of [["glb-bow", 178, 6], ["glb-quarter", 135, 8], ["glb-beam", 88, 6], ["glb-stern-quarter", 40, 10], ["glb-high", 130, 28]] as const) {
    const data: string = await page.evaluate(`window.__shoot(${yaw}, ${pitch})`);
    fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(data.split(",")[1], "base64"));
    console.log(name, "saved");
  }
  await browser.close();
};
run();
