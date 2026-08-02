/* Verify the film scrub renders on the PLAIN homepage (no flags) after the
 * default flip, and the hero sun is back to the approved disc look. */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const OUT =
  "/private/tmp/claude-501/-Users-davidcoast-Downloads/ebf404b8-f970-4d9a-8dd3-1810f5c3ae29/scratchpad";

async function shot(cdp: any, path: string) {
  const { data } = await cdp.send("Page.captureScreenshot", { format: "png" });
  writeFileSync(path, Buffer.from(data, "base64"));
}

async function run() {
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader"] });
  const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
  const filmReqs: string[] = [];
  const errors: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/story/film")) filmReqs.push(r.url());
  });
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("https://coastglobal.org", { waitUntil: "networkidle" });
  const cdp = await page.context().newCDPSession(page);

  // wake the WebGL hero, then shoot the top (reverted disc sun check)
  await page.mouse.wheel(0, 10);
  await page.waitForTimeout(1500);
  await shot(cdp, `${OUT}/default-hero-top.png`);

  // scroll until the film layer is visibly on (opacity > 0.5), then mid-film
  const target = await page.evaluate(() => {
    const vh = window.innerHeight;
    return 2.4 * vh; // end of hero runway - film spacer follows content start
  });
  let last = -1;
  for (let i = 0; i < 120; i++) {
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(90);
    const state = await page.evaluate(() => {
      const layers = Array.from(document.querySelectorAll("div")).filter(
        (d) =>
          getComputedStyle(d).position === "fixed" &&
          d.querySelector("canvas") &&
          d.className.includes("layer")
      );
      const l = layers[0] as HTMLElement | undefined;
      return {
        y: window.scrollY,
        op: l ? Number(getComputedStyle(l).opacity) : -1,
      };
    });
    if (state.op > 0.9) break;
    if (state.y === last) break;
    last = state.y;
  }
  // advance a bit deeper into the runway for a mid-film frame
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(800);
  await shot(cdp, `${OUT}/default-film-mid.png`);

  const tiers = new Set(
    filmReqs.map((u) => (u.includes("film-uhd") ? "uhd" : "hd"))
  );
  console.log(
    JSON.stringify(
      {
        filmFrameRequests: filmReqs.length,
        tiers: [...tiers],
        consoleErrors: errors,
      },
      null,
      2
    )
  );
  await browser.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
