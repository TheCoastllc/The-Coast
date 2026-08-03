import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader'] });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const page = await ctx.newPage();
  let filmCount = 0;
  page.on('request', (req) => { if (req.url().includes('/story/film')) filmCount++; });
  await page.goto('https://coastglobal.org', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  try { await page.click('text=Decline', { timeout: 5000 }); } catch {}
  await page.waitForTimeout(6000);
  const check = `(() => {
    const wrap = document.querySelector('body > div[aria-hidden="true"][style*="z-index: -1"]');
    const c = document.querySelector('canvas');
    return {
      canvasCount: document.querySelectorAll('canvas').length,
      wrapperOpacity: wrap ? getComputedStyle(wrap).opacity : 'no-wrapper-found'
    };
  })()`;
  console.log('after decline + 6s:', JSON.stringify(await page.evaluate(check)));
  // scroll ~6 viewports
  for (let i = 0; i < 30; i++) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(150);
    const y = Number(await page.evaluate('window.scrollY'));
    if (y > 844 * 6) break;
  }
  await page.waitForTimeout(2000);
  console.log('after deep scroll:', JSON.stringify(await page.evaluate(check)));
  console.log('scrollY:', await page.evaluate('window.scrollY'));
  console.log('film requests total:', filmCount);
  console.log('overflow:', await page.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth'));
  await ctx.close();
  await browser.close();
}
main().catch((e) => { console.error('FATAL', e); process.exit(1); });
