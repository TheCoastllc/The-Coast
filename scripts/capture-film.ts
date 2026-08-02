/* Capture the ?film=on scroll-scrub demo on prod (coastglobal.org). */
import { chromium } from "playwright";
import * as fs from "fs";

const OUT =
  "/private/tmp/claude-501/-Users-davidcoast-Downloads/ebf404b8-f970-4d9a-8dd3-1810f5c3ae29/scratchpad/verify-final";

const consoleErrors: string[] = [];
const failedRequests: string[] = [];
const storyRequests: { url: string; status: number }[] = [];

async function main() {
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader"] });
  const ctx = await browser.newContext({
    viewport: { width: 1200, height: 750 },
    deviceScaleFactor: 1,
  });
  // pre-seed the declined consent state (most privacy-preserving) so the
  // GA4 banner never mounts and never occludes the film copy overlay
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("coast-cookie-consent", "denied");
    } catch {}
  });
  const page = await ctx.newPage();

  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("requestfailed", (r) =>
    failedRequests.push(`${r.url()} :: ${r.failure()?.errorText}`)
  );
  page.on("response", (r) => {
    if (r.url().includes("/story/film")) {
      storyRequests.push({ url: r.url(), status: r.status() });
    }
  });

  await page.goto("https://coastglobal.org/?film=on", {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(1500);

  const bannerVisible = await page
    .getByText(/WE VALUE YOUR PRIVACY/i)
    .isVisible()
    .catch(() => false);
  console.log("consent banner visible after init-script seed:", bannerVisible);

  // trigger hero/interaction mount (FilmStrip renders only after interaction)
  await page.mouse.move(600, 375);
  await page.mouse.wheel(0, 10);
  await page.waitForTimeout(800);

  // find the 350vh film runway section
  const metrics = await page.evaluate(() => {
    const vh = window.innerHeight;
    const sections = Array.from(document.querySelectorAll("section"));
    const el = sections.find(
      (s) => Math.abs(s.getBoundingClientRect().height - 3.5 * vh) < 8
    );
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      top: r.top + window.scrollY,
      height: r.height,
      vh,
      cls: el.className,
    };
  });
  if (!metrics) {
    console.log("FILM SECTION NOT FOUND");
    console.log(JSON.stringify({ consoleErrors, failedRequests, storyRequests }, null, 2));
    await browser.close();
    process.exit(1);
  }
  console.log("section metrics:", JSON.stringify(metrics));

  const targetFor = (raw: number) =>
    Math.round(metrics.top - metrics.vh + raw * (metrics.height + metrics.vh));

  async function scrollToY(target: number) {
    for (let i = 0; i < 300; i++) {
      const y = await page.evaluate(() => window.scrollY);
      const diff = target - y;
      if (Math.abs(diff) < 12) return y;
      await page.mouse.wheel(0, Math.max(-800, Math.min(800, diff)));
      await page.waitForTimeout(120);
    }
    return page.evaluate(() => window.scrollY);
  }

  const cdp = await page.context().newCDPSession(page);
  async function shoot(file: string, clip?: { x: number; y: number; width: number; height: number }) {
    const res = await cdp.send("Page.captureScreenshot", {
      format: "png",
      ...(clip ? { clip: { ...clip, scale: 1 } } : {}),
    });
    fs.writeFileSync(`${OUT}/${file}`, Buffer.from(res.data, "base64"));
  }

  // approach the section so lazy frame loading kicks in, then wait for frames
  await scrollToY(targetFor(0.05));
  const t0 = Date.now();
  while (Date.now() - t0 < 30000) {
    const done = storyRequests.filter((r) => r.status === 200).length;
    if (done >= 60) break;
    await page.waitForTimeout(500);
  }
  console.log("frame responses so far:", storyRequests.length);

  const stops: [number, string][] = [
    [0.1, "film-r01.png"],
    [0.3, "film-r03.png"],
    [0.5, "film-r05.png"],
    [0.7, "film-r07.png"],
    [0.85, "film-r085.png"],
  ];

  const states: any[] = [];
  for (const [raw, file] of stops) {
    const y = await scrollToY(targetFor(raw));
    await page.waitForTimeout(700);
    const state = await page.evaluate(() => {
      const canvas = document.querySelector("canvas");
      const layer = canvas?.parentElement as HTMLElement | null;
      const copy = layer?.querySelector("div") as HTMLElement | null;
      return {
        scrollY: window.scrollY,
        layerOpacity: layer ? getComputedStyle(layer).opacity : null,
        copyOpacity: copy ? getComputedStyle(copy).opacity : null,
        canvasW: canvas?.width,
        canvasH: canvas?.height,
      };
    });
    states.push({ raw, file, targetY: targetFor(raw), reachedY: y, ...state });
    await shoot(file);
  }

  console.log("STATES:", JSON.stringify(states, null, 2));
  const tally: Record<string, number> = {};
  for (const r of storyRequests) {
    const tier = r.url.includes("film-uhd")
      ? "film-uhd"
      : r.url.includes("film-hd")
        ? "film-hd"
        : "film-other";
    const key = `${tier}:${r.status}`;
    tally[key] = (tally[key] || 0) + 1;
  }
  console.log("STORY TALLY:", JSON.stringify(tally));
  console.log("CONSOLE ERRORS:", JSON.stringify(consoleErrors));
  console.log("FAILED REQUESTS:", JSON.stringify(failedRequests.slice(0, 20)));
  const nonHd = storyRequests.filter((r) => !r.url.includes("film-hd"));
  console.log("NON-HD STORY URLS:", JSON.stringify([...new Set(nonHd.map((r) => r.url))].slice(0, 10)));

  await browser.close();
}

main().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
