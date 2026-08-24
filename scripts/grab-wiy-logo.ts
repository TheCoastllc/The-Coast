import { chromium } from 'playwright';

const OUT = '/private/tmp/claude-501/-Users-davidcoast-Downloads/ccfea029-f2ac-4c53-b644-a522e6661323/scratchpad/logos/world-is-yours.png';

(async () => {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader'] });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 3,
  });
  await page.goto('https://theworldisyoursinc.com', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(4000); // let intro animations run + fonts settle

  // Force the header visible, kill blend mode, transparent backgrounds, white ink
  await page.evaluate(`(() => {
    const header = document.querySelector('header');
    if (!header) return 'no header';
    // hide everything that is not the header or one of its ancestors
    const keep = new Set();
    let n = header; while (n) { keep.add(n); n = n.parentElement; }
    document.querySelectorAll('body *').forEach(el => {
      if (!keep.has(el) && !header.contains(el)) el.style.visibility = 'hidden';
    });
    document.querySelectorAll('canvas, video, img').forEach(el => {
      if (!header.contains(el)) el.style.display = 'none';
    });
    header.style.opacity = '1';
    header.style.transform = 'none';
    header.style.mixBlendMode = 'normal';
    header.style.background = 'transparent';
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';
    const brand = header.querySelector('a[href="/"]');
    if (!brand) return 'no brand link';
    brand.style.opacity = '1';
    brand.style.color = '#ffffff';
    const span = brand.querySelector('span');
    if (span) { span.style.opacity = '1'; span.style.color = '#ffffff'; }
    return 'ok';
  })()`).then(r => console.log('style pass:', r));

  await page.evaluate(`document.fonts.ready.then(() => 'fonts ready')`).then(r => console.log(r));
  await page.waitForTimeout(500);

  const el = await page.$('header a[href="/"] span.hidden');
  if (!el) throw new Error('wordmark span not found');
  const box = await el.boundingBox();
  console.log('wordmark box:', JSON.stringify(box));
  await el.screenshot({ path: OUT, omitBackground: true });
  console.log('saved', OUT);

  await browser.close();
})();
