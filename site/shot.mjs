import { createRequire } from 'node:module';

const require = createRequire('/home/arch/.local/lib/node_modules/');
const { chromium } = require('playwright');

const URL = 'http://localhost:4322/hamna-Henna-Site/';
const OUT = '/tmp/shots';

const browser = await chromium.launch();

for (const scheme of ['light', 'dark']) {
  for (const [name, width, height] of [
    ['mobile', 375, 812],
    ['tablet', 768, 1024],
    ['desktop', 1440, 900],
  ]) {
    const ctx = await browser.newContext({
      viewport: { width, height },
      colorScheme: scheme,
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(String(e)));

    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Freeze the scroll reveals. Playwright's fullPage capture stitches the
    // page without scrolling, so a `view()` timeline never advances and every
    // .reveal below the fold sits at opacity 0 — a blank-page artifact, not a
    // real defect. The reveal itself is verified separately by scrolling.
    await page.addStyleTag({
      content: '.reveal { animation: none !important; opacity: 1 !important; transform: none !important; }',
    });

    await page.screenshot({ path: `${OUT}/${scheme}-${name}.png`, fullPage: true });

    // horizontal scroll check
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );

    console.log(`${scheme}/${name}  overflowX=${overflow}  errors=${errors.length}`);
    if (errors.length) console.log('   ', errors.slice(0, 3));
    await ctx.close();
  }
}

await browser.close();
