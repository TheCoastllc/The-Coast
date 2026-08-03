import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const OUT = '/private/tmp/claude-501/-Users-davidcoast-Downloads/ccfea029-f2ac-4c53-b644-a522e6661323/scratchpad/verify-seq';

async function main() {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 820 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 300)); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e).slice(0, 300)));
  await page.goto('https://coastglobal.org/ai', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3500);
  console.log('scrollY on load:', await page.evaluate('window.scrollY'));
  // scroll back to absolute top just in case, without clicking anything
  for (let i = 0; i < 20; i++) {
    const y = Number(await page.evaluate('window.scrollY'));
    if (y <= 0) break;
    await page.mouse.wheel(0, -1500);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(600);
  const cdp = await page.context().newCDPSession(page);
  const res = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT, 'ai-hero.png'), Buffer.from(res.data, 'base64'));
  console.log('SHOT ai-hero.png, scrollY:', await page.evaluate('window.scrollY'));
  const topText = await page.evaluate('document.body.innerText.slice(0, 600)');
  console.log('TOP TEXT:', String(topText).replace(/\n+/g, ' | ').slice(0, 500));
  console.log('hero sub present:', String(topText).includes('We design, build, and deploy AI systems'));
  console.log('console errors:', errors.length, errors.slice(0, 5));
  await ctx.close();
  await browser.close();
}
main().catch((e) => { console.error('FATAL', e); process.exit(1); });
