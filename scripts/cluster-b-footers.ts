/* Cluster B verification: footer + nav consistency across prod surfaces. */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const OUT =
  '/private/tmp/claude-501/-Users-davidcoast-Downloads/ccfea029-f2ac-4c53-b644-a522e6661323/scratchpad/audit-verify'

const TARGETS: { id: string; url: string }[] = [
  { id: 'home', url: 'https://coastglobal.org/' },
  { id: 'services', url: 'https://coastglobal.org/services' },
  { id: 'work', url: 'https://coastglobal.org/work' },
  { id: 'blog', url: 'https://coastglobal.org/blog' },
  { id: 'offers', url: 'https://coastglobal.org/offers' },
  { id: 'ai', url: 'https://coastglobal.org/ai' },
  { id: 'gallery', url: 'https://gallery.coastglobal.org/' },
  { id: 'cbi', url: 'https://cbi.coastglobal.org/' },
  { id: 'offers-sub', url: 'https://offers.coastglobal.org/' },
]

async function main() {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader'] })
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  const results: Record<string, unknown> = {}

  for (const t of TARGETS) {
    const rec: Record<string, unknown> = { url: t.url }
    try {
      const resp = await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 60000 })
      rec.status = resp?.status()
      await page.waitForTimeout(2500)
      try {
        await page.click('text=Decline', { timeout: 4000 })
      } catch {}
      await page.waitForTimeout(500)

      // scroll to the bottom via mouse wheel (Lenis swallows scrollTo)
      for (let i = 0; i < 60; i++) {
        await page.mouse.wheel(0, 2400)
        await page.waitForTimeout(120)
        const atBottom = await page.evaluate(
          '(() => (window.scrollY + window.innerHeight) >= (document.documentElement.scrollHeight - 60))()',
        )
        if (atBottom) break
      }
      await page.waitForTimeout(1600)

      const data = await page.evaluate(`(() => {
        const fs = Array.from(document.querySelectorAll('footer'));
        const f = fs[fs.length - 1] || null;
        if (!f) return { footerFound: false, footerCount: fs.length };
        const links = Array.from(f.querySelectorAll('a')).map(a => ({
          text: (a.textContent || '').trim().replace(/\\s+/g,' '),
          href: a.getAttribute('href'),
          aria: a.getAttribute('aria-label'),
        }));
        const nonLinkText = Array.from(f.querySelectorAll('p,span,li,h2,div'))
          .filter(el => !el.closest('a') && el.children.length === 0)
          .map(el => (el.textContent||'').trim().replace(/\\s+/g,' '))
          .filter(Boolean);
        const r = f.getBoundingClientRect();
        return {
          footerFound: true,
          footerCount: fs.length,
          className: f.className,
          innerText: f.innerText,
          links,
          nonLinkText,
          box: { x: r.x + window.scrollX, y: r.y + window.scrollY, w: r.width, h: r.height },
          docHeight: document.documentElement.scrollHeight,
        };
      })()`)
      Object.assign(rec, data)

      const cdp = await page.context().newCDPSession(page)
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' })
      fs.writeFileSync(path.join(OUT, `footer-${t.id}.png`), Buffer.from(shot.data, 'base64'))
    } catch (e) {
      rec.error = String(e).slice(0, 300)
    }
    results[t.id] = rec
    console.log('done', t.id, (rec as any).status ?? (rec as any).error)
  }

  fs.writeFileSync(path.join(OUT, 'footers.json'), JSON.stringify(results, null, 2))
  await browser.close()
}

main()
