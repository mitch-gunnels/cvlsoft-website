import { chromium } from "playwright";
const OUT = "/private/tmp/claude-501/-Users-mitchellgunnels-Apps-cvlsoft-website/cfc94924-55a7-42b6-b934-c1ddf582169f/scratchpad";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
await page.goto("http://localhost:3001/", { waitUntil: "domcontentloaded" });
const panel = page.locator("div.absolute.bottom-\\[calc\\(8\\%-40px\\)\\]").first();
await panel.waitFor({ timeout: 15000 });
await panel.locator("button").nth(3).click();
const want = ["Billing Overage Review", "credited it back", "Call resolved"];
const got = new Set();
const deadline = Date.now() + 140000;
while (Date.now() < deadline && got.size < want.length) {
  const t = await panel.innerText().catch(() => "");
  for (const w of want) {
    if (!got.has(w) && t.includes(w)) {
      got.add(w);
      await page.waitForTimeout(700);
      await panel.screenshot({ path: `${OUT}/v5-call-${got.size}.png` });
    }
  }
  await page.waitForTimeout(150);
}
console.log("frames:", [...got].join(" / "));
await browser.close();
