import { chromium } from "playwright";
(async () => {
  const b = await chromium.launch({ args: ["--use-angle=swiftshader"] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto("https://coastglobal.org", { waitUntil: "networkidle", timeout: 60000 });
  try { await p.click("text=Decline", { timeout: 4000 }); } catch {}
  await p.waitForTimeout(6000);
  const info = await p.evaluate(`(() => {
    const btns = Array.from(document.querySelectorAll('button')).map(b => ({ label: b.getAttribute('aria-label'), cls: (b.className||'').slice(0,60), r: (() => { const r = b.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; })() }));
    const header = document.querySelector('header');
    const topEl = document.elementFromPoint(1400, 40);
    return { btns: btns.slice(0, 12), headerExists: !!header, headerHTML: header ? header.outerHTML.slice(0, 400) : null, topEl: topEl ? topEl.tagName + '.' + (topEl.className||'').toString().slice(0,60) : null };
  })()`);
  console.log(JSON.stringify(info, null, 2));
  await b.close();
})();
