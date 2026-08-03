/* Redo two shots: film-crisp.png (clip must be offset by scrollY - CDP clip is
 * in absolute page coordinates) and film-fastscrub.png (shoot after wheel 2 of
 * the 10-wheel storm, while scroll is still inside the film runway). */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT =
  "/private/tmp/claude-501/-Users-davidcoast-Downloads/ccfea029-f2ac-4c53-b644-a522e6661323/scratchpad/verify-seq";
const VH = 820;

async function main() {
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader"] });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 820 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const consoleErrors: string[] = [];
  const netFails: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text().slice(0, 300));
  });
  page.on("pageerror", (e) => consoleErrors.push("pageerror: " + String(e).slice(0, 300)));
  page.on("requestfailed", (r) =>
    netFails.push("FAILED " + (r.failure()?.errorText || "?") + " " + r.url().slice(0, 120))
  );
  page.on("response", (r) => {
    if (r.status() >= 400) netFails.push(String(r.status()) + " " + r.url().slice(0, 120));
  });

  await page.goto("https://coastglobal.org", { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(2500);

  // JS-click Decline (Playwright actionability wait stalls on this banner)
  const clicked = await page.evaluate(
    "(() => { const b = Array.from(document.querySelectorAll('button')).find(function(x){ return x.textContent && x.textContent.trim() === 'Decline'; }); if (b) { b.click(); return true; } return false; })()"
  );
  await page.waitForTimeout(1200);
  const bannerGone =
    (await page.evaluate("document.body.innerText.indexOf('WE VALUE YOUR PRIVACY')")) === -1;

  await page.mouse.wheel(0, 10);
  await page.waitForTimeout(1500);

  const cdp = await page.context().newCDPSession(page);
  const shot = async (name: string, clip?: { x: number; y: number; width: number; height: number }) => {
    const params: Record<string, unknown> = { format: "png" };
    if (clip) params.clip = { ...clip, scale: 1 };
    const res = (await cdp.send("Page.captureScreenshot", params)) as { data: string };
    fs.writeFileSync(path.join(OUT, name), Buffer.from(res.data, "base64"));
  };
  const scrollY = async (): Promise<number> => Number(await page.evaluate("window.scrollY"));
  const scrollTo = async (target: number) => {
    for (let i = 0; i < 200; i++) {
      const y = await scrollY();
      const diff = target - y;
      if (Math.abs(diff) < 6) break;
      const step = Math.max(-700, Math.min(700, diff));
      await page.mouse.wheel(0, step);
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(800);
    return await scrollY();
  };

  // crisp clip at 4.5vh - viewport-relative (500,250) => page (500, scrollY+250)
  const y45 = await scrollTo(Math.round(4.5 * VH));
  await page.waitForTimeout(700);
  await shot("film-crisp.png", { x: 500, y: y45 + 250, width: 420, height: 300 });

  // fast scrub: from 2.6vh, 10 rapid wheels of 900, shoot right after wheel 2
  await scrollTo(Math.round(2.6 * VH));
  await page.waitForTimeout(600);
  let yScrubMid = -1;
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(50);
    if (i === 1) {
      yScrubMid = await scrollY();
      await shot("film-fastscrub.png");
    }
  }
  const yScrubEnd = await scrollY();

  console.log(
    JSON.stringify(
      {
        clicked,
        bannerGone,
        crispScrollY: y45,
        fastscrub: { scrollYAtShot: yScrubMid, scrollYAfterAll10Wheels: yScrubEnd },
        consoleErrors,
        netFails: netFails.filter((f, i, a) => a.indexOf(f) === i),
      },
      null,
      2
    )
  );
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
