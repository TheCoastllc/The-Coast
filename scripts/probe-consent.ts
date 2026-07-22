import { chromium } from "playwright";
const run = async () => {
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader"] });
  const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
  let gtm = 0;
  page.on("request", (r) => { if (r.url().includes("gtm.js?id=GTM-5L5ZRV3K")) gtm++; });
  await page.goto("https://coastglobal.org/", { waitUntil: "networkidle", timeout: 45000 });
  for (let w = 0; w < 25 && !gtm; w++) await page.waitForTimeout(1000);
  const dl = await page.evaluate(() => {
    const d = (window as any).dataLayer ?? [];
    const consentIdx = d.findIndex((e: any) => e && typeof e === "object" && String(e[0]) === "consent" && String(e[1]) === "default");
    const gtmIdx = d.findIndex((e: any) => !!e && typeof e === "object" && "gtm.start" in e);
    return { consentIdx, gtmIdx, len: d.length };
  });
  console.log(JSON.stringify({ gtmLoaded: gtm, ...dl, orderOk: dl.consentIdx !== -1 && dl.gtmIdx !== -1 && dl.consentIdx < dl.gtmIdx }));
  await browser.close();
};
run();
