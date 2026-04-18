const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const url = process.env.SITE_URL || 'http://localhost:3001';
  console.log(`Loading ${url}`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  // Make sure reveal-up animations have fired
  await page.evaluate(() => {
    document.querySelectorAll('.reveal-up').forEach((el) => el.classList.add('is-visible'));
  });

  await page.locator('#why-aios').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const section = page.locator('#why-aios');
  const rows = section.locator('.reveal-up.grid');
  const count = await rows.count();
  console.log(`Found ${count} rows in #why-aios`);

  const labels = ['onebrain', 'interview', 'selfevolving', 'security', 'connectors'];

  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    await row.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // The illustration box is the 2nd child (the lg:block div)
    const box = row.locator('> div').nth(1);
    const label = labels[i] || `row${i}`;
    const out = `/tmp/diagram-${i}-${label}.png`;
    await box.screenshot({ path: out });
    console.log(`Saved ${out}`);
  }

  await browser.close();
  console.log('Done.');
})();
