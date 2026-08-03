/* Verify THE HANDOFF + FILM on prod (coastglobal.org) at 1440x820.
 * Walks the hero->film crossfade, samples the film scrub, checks crispness,
 * loading counts, fast-scrub resilience, and the overlay copy. */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT =
  "/private/tmp/claude-501/-Users-davidcoast-Downloads/ccfea029-f2ac-4c53-b644-a522e6661323/scratchpad/verify-seq";
const VH = 820;

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader"] });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 820 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const consoleErrors: string[] = [];
  const netFails: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text().slice(0, 400));
  });
  page.on("pageerror", (e) => consoleErrors.push("pageerror: " + String(e).slice(0, 400)));
  page.on("requestfailed", (r) =>
    netFails.push("FAILED " + (r.failure()?.errorText || "?") + " " + r.url())
  );
  page.on("response", (r) => {
    if (r.status() >= 400) netFails.push(String(r.status()) + " " + r.url());
  });

  await page.goto("https://coastglobal.org", { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(2000);

  // cookie banner - strict-mode-proof dismissal, verified
  let bannerGone = false;
  for (const attempt of [0, 1, 2]) {
    try {
      await page.locator("text=Decline").first().click({ timeout: 4000 });
    } catch (e) {
      console.error("decline click attempt " + attempt + " failed: " + String(e).slice(0, 200));
    }
    await page.waitForTimeout(600);
    bannerGone =
      (await page.evaluate("document.body.innerText.indexOf('WE VALUE YOUR PRIVACY')")) === -1;
    if (bannerGone) break;
  }

  // hero mounts after first interaction
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

  // Lenis swallows scrollTo - drive with wheel deltas in a feedback loop
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

  const log: Record<string, unknown> = { bannerGone };

  // --- handoff walk ---
  for (const [vhMult, name] of [
    [2.3, "hand-230.png"],
    [2.45, "hand-245.png"],
    [2.55, "hand-255.png"],
    [2.7, "hand-270.png"],
  ] as [number, string][]) {
    const y = await scrollTo(Math.round(vhMult * VH));
    await shot(name);
    log[name] = { targetY: Math.round(vhMult * VH), actualY: y };
  }

  // --- 3.0vh: frame resource loading count (should climb to 60 fast) ---
  await scrollTo(Math.round(3.0 * VH));
  const counts: number[] = [];
  for (let i = 0; i < 10; i++) {
    const c = Number(
      await page.evaluate(
        "performance.getEntriesByType('resource').filter(function(e){return e.name.indexOf('film-hd2')>=0||e.name.indexOf('film-uhd2')>=0}).length"
      )
    );
    counts.push(c);
    if (c >= 60) break;
    await page.waitForTimeout(700);
  }
  log["frameResourceCounts@3.0vh"] = counts;

  // --- film scrub samples ---
  const y35 = await scrollTo(Math.round(3.5 * VH));
  await shot("film-35.png");
  log["film-35.png"] = { actualY: y35 };

  const y45 = await scrollTo(Math.round(4.5 * VH));
  await shot("film-45.png");
  await shot("film-crisp.png", { x: 500, y: 250, width: 420, height: 300 });
  log["film-45.png"] = { actualY: y45 };

  // copy check at 4.5vh (within 4.0-4.6 window) - report ALL candidate
  // containers so the visible FilmStrip copy is distinguishable from the
  // hidden hero fallback that shares the same words
  const copyInfo = await page.evaluate(
    "(() => { const els = Array.from(document.querySelectorAll('div')); const hits = els.filter(function(e){ return e.textContent && e.textContent.indexOf('The Craft') >= 0 && e.textContent.indexOf('drop') >= 0 && e.children.length >= 1 && e.children.length <= 4; }); return hits.map(function(hit){ const cs = getComputedStyle(hit); const r = hit.getBoundingClientRect(); return { cls: String(hit.className).slice(0, 60), text: hit.innerText || hit.textContent, opacity: cs.opacity, display: cs.display, rect: { top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) } }; }); })()"
  );
  log["copyCheck@4.5vh"] = copyInfo;

  const y52 = await scrollTo(Math.round(5.2 * VH));
  await shot("film-52.png");
  log["film-52.png"] = { actualY: y52 };

  // --- fast scrub: back to 2.6vh, then 10 rapid wheels of 900. Screenshot
  // mid-storm (right after wheel 4) while scroll is still inside the film
  // runway, so the shot proves the canvas keeps painting under a fast scrub ---
  await scrollTo(Math.round(2.6 * VH));
  await page.waitForTimeout(600);
  let yScrubMid = -1;
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(50);
    if (i === 3) {
      yScrubMid = await scrollY();
      await shot("film-fastscrub.png");
    }
  }
  const yScrubEnd = await scrollY();
  log["film-fastscrub.png"] = { scrollYAtShot: yScrubMid, scrollYAfterAll10Wheels: yScrubEnd };

  // final resource count
  log["frameResourceCountsFinal"] = Number(
    await page.evaluate(
      "performance.getEntriesByType('resource').filter(function(e){return e.name.indexOf('film-hd2')>=0||e.name.indexOf('film-uhd2')>=0}).length"
    )
  );

  log["consoleErrors"] = consoleErrors;
  log["netFails"] = netFails.filter(
    (f, i, a) => a.indexOf(f) === i
  );

  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(log, null, 2));
  console.log(JSON.stringify(log, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
