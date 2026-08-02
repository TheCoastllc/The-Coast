import { chromium } from 'playwright';
import * as fs from 'fs';

const OUT = '/private/tmp/claude-501/-Users-davidcoast-Downloads/ebf404b8-f970-4d9a-8dd3-1810f5c3ae29/scratchpad/verify-final';

async function main() {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader'] });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 750 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('requestfailed', (req) => {
    failedRequests.push(`${req.url()} :: ${req.failure()?.errorText}`);
  });

  await page.goto('https://coastglobal.org', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);

  const cdp = await page.context().newCDPSession(page);

  async function shoot(name: string, opts: any = {}) {
    const res = await cdp.send('Page.captureScreenshot', { format: 'png', ...opts });
    fs.writeFileSync(`${OUT}/${name}`, Buffer.from(res.data, 'base64'));
    console.log(`saved ${name}`);
  }

  // tiny interaction to mount WebGL hero
  await page.mouse.move(600, 375);
  await page.mouse.wheel(0, 10);
  await page.waitForTimeout(800);

  const vh = 750;
  const runway = 2.4 * vh; // 1800

  async function scrollToY(target: number) {
    // feedback loop using wheel since Lenis swallows scrollTo
    let y = await page.evaluate(() => window.scrollY);
    let iter = 0;
    while (Math.abs(y - target) > 20 && iter < 120) {
      const delta = target - y;
      const step = Math.max(-800, Math.min(800, delta));
      await page.mouse.wheel(0, step);
      await page.waitForTimeout(120);
      y = await page.evaluate(() => window.scrollY);
      iter++;
    }
    await page.waitForTimeout(700);
    return y;
  }

  // p = 0: scroll back to top (we wheeled 10px)
  let y = await scrollToY(0);
  console.log(`p=0 scrollY=${y}`);
  await shoot('hero-p00.png');

  // zoom on sun region: upper middle third, 2x scale via clip
  await shoot('hero-sun-zoom.png', {
    clip: { x: 300, y: 0, width: 600, height: 375, scale: 2 },
  });

  const beats: Array<[number, string]> = [
    [0.3, 'hero-p03.png'],
    [0.6, 'hero-p06.png'],
    [0.85, 'hero-p085.png'],
    [1.0, 'hero-p10.png'],
  ];

  for (const [p, name] of beats) {
    y = await scrollToY(Math.round(p * runway));
    console.log(`p=${p} scrollY=${y} (target ${Math.round(p * runway)})`);
    await shoot(name);
  }

  console.log('CONSOLE_ERRORS_START');
  consoleErrors.forEach((e) => console.log(e));
  console.log('CONSOLE_ERRORS_END');
  console.log('FAILED_REQUESTS_START');
  failedRequests.forEach((e) => console.log(e));
  console.log('FAILED_REQUESTS_END');

  await browser.close();
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
