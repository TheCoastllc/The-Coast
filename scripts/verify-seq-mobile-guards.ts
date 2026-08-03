import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const OUT = '/private/tmp/claude-501/-Users-davidcoast-Downloads/ccfea029-f2ac-4c53-b644-a522e6661323/scratchpad/verify-seq';
fs.mkdirSync(OUT, { recursive: true });

type PageLog = {
  label: string;
  consoleErrors: string[];
  failedRequests: string[];
  filmRequests: string[];
  notes: string[];
};

const logs: PageLog[] = [];

async function shoot(page: any, file: string) {
  const cdp = await page.context().newCDPSession(page);
  const res = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT, file), Buffer.from(res.data, 'base64'));
  await cdp.detach();
  console.log('SHOT', file);
}

function wire(page: any, log: PageLog) {
  page.on('console', (msg: any) => {
    if (msg.type() === 'error') log.consoleErrors.push(msg.text().slice(0, 300));
  });
  page.on('pageerror', (err: any) => {
    log.consoleErrors.push('PAGEERROR: ' + String(err).slice(0, 300));
  });
  page.on('requestfailed', (req: any) => {
    log.failedRequests.push(req.url().slice(0, 200) + ' :: ' + (req.failure()?.errorText || '?'));
  });
  page.on('request', (req: any) => {
    if (req.url().includes('/story/film')) log.filmRequests.push(req.url());
  });
}

async function wheelScroll(page: any, target: number, maxIter = 60) {
  let last = -1;
  for (let i = 0; i < maxIter; i++) {
    const y = Number(await page.evaluate('window.scrollY'));
    if (y >= target) return y;
    await page.mouse.wheel(0, Math.min(600, target - y + 100));
    await page.waitForTimeout(180);
    const y2 = Number(await page.evaluate('window.scrollY'));
    if (y2 === last && y2 === y) {
      // stuck
      await page.waitForTimeout(400);
    }
    last = y2;
  }
  return Number(await page.evaluate('window.scrollY'));
}

async function main() {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader'] });

  // ---------- PART 1: MOBILE ----------
  {
    const log: PageLog = { label: 'mobile', consoleErrors: [], failedRequests: [], filmRequests: [], notes: [] };
    logs.push(log);
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
      hasTouch: true,
      isMobile: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    });
    const page = await ctx.newPage();
    wire(page, log);
    await page.goto('https://coastglobal.org', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    try { await page.click('text=Decline', { timeout: 5000 }); } catch {}
    await page.waitForTimeout(800);
    await shoot(page, 'mobile-top.png');

    const canvasCountTop = await page.evaluate('document.querySelectorAll("canvas").length');
    const overflow = await page.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth');
    log.notes.push(`canvas count at top: ${canvasCountTop}`);
    log.notes.push(`horizontal overflow (scrollWidth - clientWidth): ${overflow}`);

    // Scroll ~3 viewports
    const target = 844 * 3;
    let y = await wheelScroll(page, target);
    if (y === 0) {
      log.notes.push('wheel scroll produced scrollY=0, falling back to touch swipes');
      for (let i = 0; i < 12; i++) {
        await page.touchscreen.tap(195, 422); // wake
        // swipe up: drag from lower to upper
        await page.evaluate('(() => {})()');
        // Playwright touchscreen has no swipe; emulate via CDP Input.dispatchTouchEvent is complex.
        // Use mouse wheel again after tap as fallback:
        await page.mouse.wheel(0, 500);
        await page.waitForTimeout(200);
      }
      y = Number(await page.evaluate('window.scrollY'));
    }
    await page.waitForTimeout(800);
    log.notes.push(`scrollY after scroll: ${y} (target ~${target})`);
    await shoot(page, 'mobile-mid.png');

    const canvasCountMid = await page.evaluate('document.querySelectorAll("canvas").length');
    const overflowMid = await page.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth');
    log.notes.push(`canvas count after scroll: ${canvasCountMid}`);
    log.notes.push(`horizontal overflow after scroll: ${overflowMid}`);
    log.notes.push(`/story/film requests: ${log.filmRequests.length}`);
    await ctx.close();
  }

  // ---------- PART 2: DESKTOP END ----------
  {
    const log: PageLog = { label: 'desktop-end', consoleErrors: [], failedRequests: [], filmRequests: [], notes: [] };
    logs.push(log);
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 820 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    wire(page, log);
    await page.goto('https://coastglobal.org', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2500);
    try { await page.click('text=Decline', { timeout: 5000 }); } catch {}
    await page.waitForTimeout(500);

    // WebGL hero mounts after first interaction
    await page.mouse.wheel(0, 10);
    await page.waitForTimeout(1500);

    // Scroll to very end: wheel until scrollY stops increasing
    let last = -1;
    let stable = 0;
    for (let i = 0; i < 400; i++) {
      await page.mouse.wheel(0, 1200);
      await page.waitForTimeout(120);
      const y = Number(await page.evaluate('window.scrollY'));
      if (y === last) {
        stable++;
        if (stable >= 8) break;
        await page.waitForTimeout(300);
      } else {
        stable = 0;
      }
      last = y;
    }
    const endY = Number(await page.evaluate('window.scrollY'));
    const maxScroll = Number(await page.evaluate('document.documentElement.scrollHeight - window.innerHeight'));
    log.notes.push(`end scrollY: ${endY}, max possible: ${maxScroll}`);
    await page.waitForTimeout(1200);
    await shoot(page, 'desktop-end.png');

    // ~2 viewports before the end
    const target = Math.max(0, endY - 820 * 2);
    // scroll up with negative wheel
    for (let i = 0; i < 200; i++) {
      const y = Number(await page.evaluate('window.scrollY'));
      if (y <= target + 50) break;
      await page.mouse.wheel(0, -Math.min(800, y - target));
      await page.waitForTimeout(150);
    }
    await page.waitForTimeout(1000);
    const lateY = Number(await page.evaluate('window.scrollY'));
    log.notes.push(`desktop-late scrollY: ${lateY} (target ~${target})`);
    await shoot(page, 'desktop-late.png');
    await ctx.close();
  }

  // ---------- PART 3: /ai SMOKE ----------
  {
    const log: PageLog = { label: 'ai', consoleErrors: [], failedRequests: [], filmRequests: [], notes: [] };
    logs.push(log);
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 820 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    wire(page, log);
    await page.goto('https://coastglobal.org/ai', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    try { await page.click('text=Decline', { timeout: 5000 }); } catch {}
    await page.waitForTimeout(500);
    await shoot(page, 'ai-hero.png');
    const heroText = await page.evaluate('(() => { const el = document.querySelector("main") || document.body; return el.innerText.slice(0, 1200); })()');
    const hasSub = String(heroText).includes('We design, build, and deploy AI systems');
    log.notes.push(`hero sub "We design, build, and deploy AI systems..." present: ${hasSub}`);
    if (!hasSub) log.notes.push('HERO TEXT SAMPLE: ' + String(heroText).replace(/\n+/g, ' | ').slice(0, 400));
    await ctx.close();
  }

  await browser.close();

  console.log('\n===== REPORT =====');
  for (const l of logs) {
    console.log(`\n--- ${l.label} ---`);
    for (const n of l.notes) console.log('NOTE:', n);
    console.log('console errors:', l.consoleErrors.length);
    l.consoleErrors.slice(0, 10).forEach((e) => console.log('  CONSOLE_ERR:', e));
    console.log('failed requests:', l.failedRequests.length);
    l.failedRequests.slice(0, 10).forEach((e) => console.log('  REQ_FAIL:', e));
    console.log('film requests:', l.filmRequests.length);
    l.filmRequests.slice(0, 5).forEach((e) => console.log('  FILM:', e));
  }
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
