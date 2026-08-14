import { chromium } from "playwright";

const URL = process.env.URL || "http://localhost:3001/";
const out = "/private/tmp/claude-501/-Users-mitchellgunnels-Apps-cvlsoft-website/e0c3f51a-cd11-492f-bcb4-f7e1f63ef712/scratchpad";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 180000 });
await page.waitForSelector("#demo", { timeout: 60000 });
await page.locator("#demo").scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);

const panel = page.locator("#demo form").locator("xpath=..");
const section = page.locator("#demo");

const before = { panel: await panel.boundingBox(), section: await section.boundingBox() };
await page.screenshot({ path: `${out}/01-before.png`, fullPage: false });

// Trigger validation errors
await page.locator('#demo button[type="submit"]').click();
await page.waitForTimeout(600);
const after = { panel: await panel.boundingBox(), section: await section.boundingBox() };
await page.screenshot({ path: `${out}/02-errors.png` });

console.log(JSON.stringify({ beforePanelH: before.panel?.height, afterPanelH: after.panel?.height, beforeSectionH: before.section?.height, afterSectionH: after.section?.height }, null, 2));

// Fill valid values and submit to see the status dialog (intercept API)
await page.route("**/api/demo-request", async (route) => {
  await new Promise((r) => setTimeout(r, 1200));
  await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, message: "Thanks. We will follow up to schedule your demo." }) });
});
await page.fill('#demo input[name="firstName"]', "Ada");
await page.fill('#demo input[name="lastName"]', "Lovelace");
await page.fill('#demo input[name="email"]', "ada@cvlsoft.net");
await page.fill('#demo input[name="phone"]', "5125551234");
await page.fill('#demo input[name="company"]', "cvlSoft");
await page.check('#demo input[name="termsAccepted"]');
await page.waitForTimeout(300);
await page.screenshot({ path: `${out}/03-filled.png` });
await page.locator('#demo button[type="submit"]').click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${out}/04-loading.png` });
await page.waitForTimeout(1600);
await page.screenshot({ path: `${out}/05-success.png` });

await browser.close();
