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
  try { await page.click('text=Decline', { timeout: 5000 }); } catch {}
  await page.waitForTimeout(1200);
  const out = await page.evaluate(`(() => {
    const c = document.querySelector('canvas');
    if (!c) return 'NO CANVAS';
    const path = [];
    let el = c;
    while (el && path.length < 10) {
      const attrs = Array.from(el.attributes || []).map(a => a.name + '="' + String(a.value).slice(0,80) + '"').join(' ');
      path.push('<' + el.tagName.toLowerCase() + (attrs ? ' ' + attrs : '') + '>');
      el = el.parentElement;
    }
    const cs = getComputedStyle(c);
    const pcs = c.parentElement ? getComputedStyle(c.parentElement) : null;
    let glType = 'none';
    try { if (c.getContext('webgl2', ) ) glType = 'webgl2'; } catch(e) {}
    return {
      path,
      canvasStyle: { position: cs.position, zIndex: cs.zIndex, opacity: cs.opacity, pointerEvents: cs.pointerEvents, display: cs.display, visibility: cs.visibility },
      parentStyle: pcs ? { position: pcs.position, zIndex: pcs.zIndex, opacity: pcs.opacity } : null
    };
  })()`);
  console.log(JSON.stringify(out, null, 2));
  await ctx.close();
  await browser.close();
}
main().catch((e) => { console.error('FATAL', e); process.exit(1); });
