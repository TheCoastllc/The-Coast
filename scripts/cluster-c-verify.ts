import { chromium } from 'playwright'
import fs from 'fs'
const OUT = '/private/tmp/claude-501/-Users-davidcoast-Downloads/ccfea029-f2ac-4c53-b644-a522e6661323/scratchpad/audit-verify'

async function shot(page: any, name: string, clip?: any) {
  const cdp = await page.context().newCDPSession(page)
  const r: any = await cdp.send('Page.captureScreenshot', clip ? { format: 'png', clip: { ...clip, scale: 1 }, captureBeyondViewport: true } : { format: 'png' })
  fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(r.data, 'base64'))
  console.log('shot', name)
}
async function scrollTo(page: any, y: number) {
  for (let i = 0; i < 200; i++) {
    const cur: number = await page.evaluate('window.scrollY')
    if (Math.abs(cur - y) < 60) break
    await page.mouse.wheel(0, Math.max(-900, Math.min(900, y - cur)))
    await page.waitForTimeout(90)
  }
}

const b = await chromium.launch({ args: ['--use-angle=swiftshader'] })
const page = await b.newPage({ viewport: { width: 1440, height: 900 } })

// ---------- /work ----------
await page.goto('https://coastglobal.org/work', { waitUntil: 'networkidle', timeout: 90000 })
try { await page.click('text=Decline', { timeout: 4000 }) } catch {}
await page.waitForTimeout(1500)

const workData = await page.evaluate(`(() => {
  const secs = [...document.querySelectorAll('.cs-takeover-section')];
  return secs.map(s => {
    const media = s.querySelector('.media');
    const h3 = s.querySelector('h3');
    const cs = media ? getComputedStyle(media) : null;
    const r = media ? media.getBoundingClientRect() : null;
    return {
      client: h3 ? h3.textContent.trim() : null,
      placeholder: s.classList.contains('placeholder'),
      mediaTag: media ? media.tagName : null,
      mediaHref: media ? (media.getAttribute('href') || null) : null,
      mediaCursor: cs ? cs.cursor : null,
      docTop: r ? Math.round(r.top + window.scrollY) : null,
      ctas: [...s.querySelectorAll('a')].map(a => a.getAttribute('href') + ' :: ' + a.textContent.trim().slice(0,20)),
    };
  });
})()`)
console.log('=== /work sections ===')
console.log(JSON.stringify(workData, null, 1))

// screenshot the placeholder (prospry) section
const ph: any = (workData as any[]).find(s => s.placeholder)
if (ph) { await scrollTo(page, ph.docTop - 120); await page.waitForTimeout(900); await shot(page, 'work-placeholder-prospry') }

// ---------- homepage ----------
await page.goto('https://coastglobal.org/', { waitUntil: 'networkidle', timeout: 90000 })
try { await page.click('text=Decline', { timeout: 4000 }) } catch {}
await page.waitForTimeout(2500)
for (let i = 0; i < 30; i++) { await page.mouse.wheel(0, 900); await page.waitForTimeout(120) }
await page.waitForTimeout(1500)

const homeData = await page.evaluate(`(() => {
  const links = [...document.querySelectorAll('a[href^="/work/"]')].map(a => ({
    href: a.getAttribute('href'),
    text: (a.textContent||'').replace(/\\s+/g,' ').trim().slice(0,70),
    docTop: Math.round(a.getBoundingClientRect().top + window.scrollY),
  }));
  const wall = [...document.querySelectorAll('[class*="wall"] > *')].map(el => ({
    tag: el.tagName, href: el.getAttribute('href'),
    text: (el.textContent||'').replace(/\\s+/g,' ').trim().slice(0,40),
    cursor: getComputedStyle(el).cursor,
  }));
  return { links, wall };
})()`)
console.log('=== homepage /work links ===')
console.log(JSON.stringify(homeData, null, 1))

const dada: any = (homeData as any).links.find((l: any) => l.href.includes('dada'))
if (dada) { await scrollTo(page, dada.docTop - 200); await page.waitForTimeout(1200); await shot(page, 'home-dada-card') }

await b.close()
