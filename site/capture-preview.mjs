/**
 * Recapture preview.gif from the built site.
 *
 *   cd site && pnpm build && pnpm preview --port 4322
 *   node capture-preview.mjs
 *
 * Needs playwright and ImageMagick. Playwright is deliberately not a devDep
 * — it pulls a browser download onto every `pnpm install` for a tool most
 * contributors never run. Install it where you have it:
 * `pnpm add -g playwright && playwright install chromium`.
 *
 * Scrolling capture: Playwright's fullPage screenshot freezes long pages
 * to a static image, which loses the scroll-reveal this site is built
 * around. Stepping the viewport and stitching frames keeps the motion
 * honest. ImageMagick turns the frames into the GIF.
 */
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const URL = process.env.PREVIEW_URL || 'http://localhost:4322/hamna-Henna-Site/';
const WIDTH = Number(process.env.GIF_WIDTH || 820);
const HEIGHT = Number(process.env.GIF_HEIGHT || 513);
const OUT = process.env.GIF_OUT || '../preview.gif';
const STEP = 0.9; // viewport heights per step, so motion stays continuous

const frames = mkdtempSync(join(tmpdir(), 'hamna-frames-'));
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
});

// Load once to measure. scrollHeight is 0 on about:blank, so this has to
// happen after navigation or the frame loop walks a single position.
await page.goto(URL, { waitUntil: 'networkidle' });
const total = await page.evaluate(() => document.documentElement.scrollHeight);

// Walk in equal steps that end exactly at the bottom. Stepping by STEP and
// then clamping the last position overshoots, so the clamp lands back
// *upwards* — the loop ends on a near-duplicate that reads as a stutter.
const maxScroll = Math.max(0, total - HEIGHT);
const stepPx = Math.round(HEIGHT * STEP);
const count = Math.max(1, Math.ceil(maxScroll / stepPx));
const positions = Array.from({ length: count + 1 }, (_, i) =>
  Math.round((maxScroll * i) / count)
);

// themeStore reads localStorage, so clearing the class keeps the capture in
// light mode even if a previous session left a dark preference behind.
await page.evaluate(() => {
  document.documentElement.classList.remove('theme-dark');
  window.scrollTo(0, 0);
});
await page.waitForTimeout(500);

let i = 0;
for (const y of positions) {
  await page.evaluate((target) => window.scrollTo(0, target), y);
  // Let fonts settle and the reveal transitions finish before the shutter.
  await page.waitForTimeout(700);
  const path = join(frames, `f${String(i).padStart(3, '0')}.png`);
  await page.screenshot({ path });
  i++;
  process.stdout.write(`\rcaptured ${i}/${positions.length}`);
}
process.stdout.write('\n');

await browser.close();

// ImageMagick's encoder, not ffmpeg. ffmpeg's sequence input defaults to
// start_number 1, which silently drops f000.png, and an fps upsample
// filter emits 1x1 placeholders for the tail. magick gets both right.
//
// `-layers Optimize` also means the file holds *delta* frames. `magick
// preview.gif[16]` on a viewer that does not coalesce shows the raw diff
// canvas, which reads as a broken 1x1 frame. It is not broken — the
// browser composites every frame. Inspect with `magick preview.gif
// -coalesce` or the GIF looks corrupt.
execFileSync('magick', [
  '-delay', '20',        // centiseconds per frame -> 2.5 fps
  '-loop', '0',
  ...positions.map((_, i) => join(frames, `f${String(i).padStart(3, '0')}.png`)),
  '-layers', 'Optimize', // per-frame diff + transparency, keeps size down
  OUT,
]);

rmSync(frames, { recursive: true, force: true });
console.log(`wrote ${OUT} (${positions.length} frames, ${WIDTH}x${HEIGHT})`);
