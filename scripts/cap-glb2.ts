import { chromium } from "playwright";
import fs from "fs";
const OUT = "/private/tmp/claude-501/-Users-davidcoast-Downloads/ebf404b8-f970-4d9a-8dd3-1810f5c3ae29/scratchpad";
const run = async () => {
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader"] });
  const page = await browser.newPage({ viewport: { width: 940, height: 660 } });
  await page.goto("http://localhost:8931/scripts/glb-viewer.html", { waitUntil: "load", timeout: 30000 });
  await page.waitForFunction("window.__ready === true || window.__error", { timeout: 120000 });
  for (const [name, yaw, pitch] of [
    ["glb2-stern-quarter", 40, 9],
    ["glb2-port-beam", 272, 6],
    ["glb2-bow-quarter", 215, 7],
  ] as const) {
    const data: string = await page.evaluate(`window.__shoot(${yaw}, ${pitch})`);
    fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(data.split(",")[1], "base64"));
    console.log(name, "saved");
  }
  await browser.close();
};
run();
