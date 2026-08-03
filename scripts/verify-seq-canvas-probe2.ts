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
  await page.goto('https://coastglobal.org', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  console.log('after 3s wait:', await page.evaluate('document.querySelectorAll("canvas").length'));
  try { await page.click('text=Decline', { timeout: 5000 }); console.log('declined'); } catch { console.log('no decline button'); }
  await page.waitForTimeout(800);
  console.log('after decline+800ms:', await page.evaluate('document.querySelectorAll("canvas").length'));
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Page.captureScreenshot', { format: 'png' });
  await cdp.detach();
  await page.waitForTimeout(500);
  console.log('after screenshot:', await page.evaluate('document.querySelectorAll("canvas").length'));
  const info = await page.evaluate(`(() => Array.from(document.querySelectorAll('canvas')).map((c) => ({
    w: c.width, h: c.height,
    cls: (c.className||'').toString().slice(0,120),
    parentCls: c.parentElement ? (c.parentElement.className||'').toString().slice(0,160) : null,
    grandCls: c.parentElement && c.parentElement.parentElement ? (c.parentElement.parentElement.className||'').toString().slice(0,160) : null,
    rect: (() => { const r = c.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; })()
  })))()`);
  console.log(JSON.stringify(info, null, 2));
  // wheel a bit, check again
  await page.mouse.wheel(0, 10);
  await page.waitForTimeout(1500);
  console.log('after wheel 10px + 1.5s:', await page.evaluate('document.querySelectorAll("canvas").length'));
  const info2 = await page.evaluate(`(() => Array.from(document.querySelectorAll('canvas')).map((c) => ({
    cls: (c.className||'').toString().slice(0,120),
    parentCls: c.parentElement ? (c.parentElement.className||'').toString().slice(0,160) : null,
    grandCls: c.parentElement && c.parentElement.parentElement ? (c.parentElement.parentElement.className||'').toString().slice(0,160) : null
  })))()`);
  console.log(JSON.stringify(info2, null, 2));
  await ctx.close();
  await browser.close();
}
main().catch((e) => { console.error('FATAL', e); process.exit(1); });
