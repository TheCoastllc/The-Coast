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
  const info = await page.evaluate(`(() => {
    return Array.from(document.querySelectorAll('canvas')).map((c) => {
      const r = c.getBoundingClientRect();
      const parent = c.parentElement;
      return {
        w: c.width, h: c.height,
        rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        cls: c.className && c.className.toString().slice(0, 120),
        id: c.id,
        style: (c.getAttribute('style') || '').slice(0, 200),
        parentTag: parent ? parent.tagName : null,
        parentCls: parent ? (parent.className || '').toString().slice(0, 160) : null,
        grandCls: parent && parent.parentElement ? (parent.parentElement.className || '').toString().slice(0, 160) : null,
        visible: r.width > 0 && r.height > 0,
        ctxWebgl: !!(c.getContext && (function(){ try { return c.getContext('webgl2') || c.getContext('webgl'); } catch(e) { return null; } })())
      };
    });
  })()`);
  console.log(JSON.stringify(info, null, 2));
  await ctx.close();
  await browser.close();
}
main().catch((e) => { console.error('FATAL', e); process.exit(1); });
