import { chromium } from 'playwright'
import fs from 'node:fs'

const OUT = '/private/tmp/claude-501/-Users-davidcoast-Downloads/ccfea029-f2ac-4c53-b644-a522e6661323/scratchpad/audit-verify'

async function shot(page: any, name: string) {
  const cdp = await page.context().newCDPSession(page)
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' })
  fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(data, 'base64'))
}

async function main() {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader'] })
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()

  const consoleErrs: string[] = []
  page.on('console', (m: any) => { if (m.type() === 'error') consoleErrs.push(m.text().slice(0, 300)) })
  page.on('pageerror', (e: any) => consoleErrs.push('PAGEERROR: ' + String(e).slice(0, 300)))

  for (const target of ['https://coastglobal.org/login', 'https://coastglobal.org/login?redirect=/admin', 'https://coastglobal.org/portal', 'https://coastglobal.org/portal/login']) {
    consoleErrs.length = 0
    console.log('\n########## ' + target)
    const resp = await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60000 })
    console.log('STATUS', resp?.status(), 'FINAL URL', page.url())
    try { await page.click('text=Decline', { timeout: 4000 }) } catch {}
    await page.waitForTimeout(6000)

    const info = await page.evaluate(`(() => {
      const inputs = Array.from(document.querySelectorAll('input')).map(i => ({ id: i.id, type: i.type, name: i.name, placeholder: i.placeholder, ac: i.autocomplete }));
      const forms = document.querySelectorAll('form').length;
      const btns = Array.from(document.querySelectorAll('button')).map(b => (b.textContent||'').trim()).filter(Boolean).slice(0,15);
      const h1 = Array.from(document.querySelectorAll('h1,h2')).map(h => (h.textContent||'').trim()).slice(0,10);
      return { title: document.title, url: location.href, inputs, forms, btns, h1, text: (document.body.innerText||'').replace(/\\n+/g,' | ').slice(0, 2200) };
    })()`)
    console.log(JSON.stringify(info, null, 1))
    if (consoleErrs.length) console.log('CONSOLE ERRORS:', JSON.stringify(consoleErrs.slice(0, 8), null, 1))
    await shot(page, 'D-' + target.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '_'))
  }

  await browser.close()
}
main()
