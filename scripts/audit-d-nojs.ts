import { chromium } from 'playwright'
import fs from 'node:fs'

const OUT = '/private/tmp/claude-501/-Users-davidcoast-Downloads/ccfea029-f2ac-4c53-b644-a522e6661323/scratchpad/audit-verify'

async function main() {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader'] })
  // javaScriptEnabled: false => pure server HTML, i.e. the crawler / no-JS view
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false })
  const page = await ctx.newPage()

  for (const [name, url] of [
    ['nojs-login', 'https://coastglobal.org/login'],
    ['nojs-portal', 'https://coastglobal.org/portal'],
    ['nojs-home', 'https://coastglobal.org/'],
  ] as const) {
    await page.goto(url, { waitUntil: 'load', timeout: 60000 })
    await page.waitForTimeout(2500)
    const info = await page.evaluate(`(() => ({
      title: document.title,
      inputs: document.querySelectorAll('input').length,
      forms: document.querySelectorAll('form').length,
      signin: document.body.innerText.includes('Sign in') || document.body.innerText.includes('Sign In'),
      text: (document.body.innerText||'').replace(/\\n+/g,' | ').slice(0,900)
    }))()`)
    console.log('#####', url, JSON.stringify(info, null, 1))
    const cdp = await page.context().newCDPSession(page)
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' })
    fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(data, 'base64'))
  }
  await browser.close()
}
main()
