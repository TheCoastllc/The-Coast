import { chromium } from 'playwright'
import fs from 'node:fs'

const OUT = '/private/tmp/claude-501/-Users-davidcoast-Downloads/ccfea029-f2ac-4c53-b644-a522e6661323/scratchpad/audit-verify'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36'

const SEEDS = [
  'https://coastglobal.org/',
  'https://coastglobal.org/services',
  'https://coastglobal.org/work',
  'https://coastglobal.org/blog',
  'https://coastglobal.org/about',
  'https://coastglobal.org/offers',
  'https://coastglobal.org/contact',
  'https://coastglobal.org/get-started',
  'https://coastglobal.org/visuals',
  'https://coastglobal.org/faq',
  'https://coastglobal.org/locations',
  'https://coastglobal.org/ai',
  'https://coastglobal.org/vision',
  'https://coastglobal.org/brand-avatar',
  'https://gallery.coastglobal.org/',
  'https://cbi.coastglobal.org/',
]

type Anchor = { href: string; raw: string; text: string }

async function main() {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader'] })
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA })
  const page = await ctx.newPage()

  // source -> anchors
  const bySource: Record<string, Anchor[]> = {}
  const bad: Record<string, Anchor[]> = {} // empty/#/javascript hrefs

  for (const seed of SEEDS) {
    try {
      await page.goto(seed, { waitUntil: 'domcontentloaded', timeout: 60000 })
    } catch (e) {
      console.log('SEED FAILED', seed, String(e).slice(0, 120))
      continue
    }
    try { await page.click('text=Decline', { timeout: 3500 }) } catch {}
    await page.waitForTimeout(3500)
    // open the hamburger menu so any menu-only links are in the DOM
    try { await page.click('header button, [aria-label*="menu" i], button[aria-label*="Menu" i]', { timeout: 2500 }); await page.waitForTimeout(1200) } catch {}

    const anchors: Anchor[] = await page.evaluate(`(() => {
      return Array.from(document.querySelectorAll('a')).map(a => ({
        raw: a.getAttribute('href') === null ? '__NULL__' : a.getAttribute('href'),
        href: a.href || '',
        text: (a.textContent || '').trim().slice(0, 50)
      }));
    })()`)
    bySource[seed] = anchors
    const b = anchors.filter(a => a.raw === '__NULL__' || a.raw.trim() === '' || a.raw.trim() === '#' || a.raw.toLowerCase().startsWith('javascript:'))
    if (b.length) bad[seed] = b
    console.log('SEED', seed, 'anchors:', anchors.length, 'suspect:', b.length)
  }
  await browser.close()

  // Build destination -> sources map for same-origin + coastglobal subdomains
  const dest: Record<string, Set<string>> = {}
  for (const [src, anchors] of Object.entries(bySource)) {
    for (const a of anchors) {
      if (!a.href.startsWith('http')) continue
      let u: URL
      try { u = new URL(a.href) } catch { continue }
      if (!u.hostname.endsWith('coastglobal.org')) continue
      u.hash = ''
      const key = u.toString()
      ;(dest[key] ||= new Set()).add(src)
    }
  }
  // add sitemap urls
  const sm = fs.readFileSync(`${OUT}/sitemap-urls.txt`, 'utf8').split('\n').map(s => s.trim()).filter(Boolean)
  for (const u of sm) (dest[u] ||= new Set()).add('SITEMAP')

  const keys = Object.keys(dest).sort()
  console.log('\nTOTAL UNIQUE coastglobal DESTINATIONS:', keys.length)

  const results: { url: string; status: number | string; finalUrl?: string; sources: string[] }[] = []
  for (const url of keys) {
    let status: number | string = 'ERR'
    let finalUrl = ''
    try {
      const r = await fetch(url, { method: 'GET', redirect: 'follow', headers: { 'user-agent': UA } })
      status = r.status
      finalUrl = r.url
    } catch (e) {
      status = 'FETCH_ERR: ' + String(e).slice(0, 80)
    }
    results.push({ url, status, finalUrl, sources: [...dest[url]] })
    if (status !== 200) console.log('NON-200', status, url, '<- linked from:', [...dest[url]].join(', '))
  }

  fs.writeFileSync(`${OUT}/link-results.json`, JSON.stringify({ results, bad }, null, 2))
  console.log('\n=== SUSPECT HREFS (empty / # / javascript: / missing) ===')
  for (const [src, list] of Object.entries(bad)) {
    console.log(src)
    for (const a of list) console.log('   raw=' + JSON.stringify(a.raw), 'text=' + JSON.stringify(a.text))
  }
  const non200 = results.filter(r => r.status !== 200)
  console.log('\n=== SUMMARY: checked', results.length, 'non-200:', non200.length, '===')
  for (const r of non200) console.log(r.status, r.url, '|| sources:', r.sources.join(', '))
}
main()
