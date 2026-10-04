import { chromium } from 'playwright';

const URL = process.env.AUDIT_URL || 'http://127.0.0.1:4322/hamna-Henna-Site/';
const browser = await chromium.launch();
const fails = [];
const ok = (cond, label, extra = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}${extra ? '  ' + extra : ''}`);
  if (!cond) fails.push(label);
};

// ---------- 1. Reduced motion ----------
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const hidden = await page.evaluate(() => {
    const els = [...document.querySelectorAll('.reveal')];
    const bad = els.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99);
    return { total: els.length, bad: bad.length };
  });
  ok(hidden.bad === 0, 'reduced-motion: all .reveal visible', `${hidden.bad}/${hidden.total} faded`);
  await ctx.close();
}

// ---------- 2. Keyboard: focus ring on every control ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });

  // Real Tab presses, not el.focus() — programmatic focus never matches
  // :focus-visible, so it would report a false negative on every control.
  const ringless = [];
  let ringed = 0;
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return {
        tag: el.tagName,
        label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30),
        visible: el.matches(':focus-visible'),
        ring: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0,
      };
    });
    if (!info) break;
    if (info.visible && info.ring) ringed++;
    else if (info.visible) ringless.push(`${info.tag} "${info.label}"`);
  }
  ok(ringless.length === 0, 'keyboard: focus ring on every tabbed control', `${ringed} checked, ${ringless.join(' | ')}`);
  await ctx.close();
}

// ---------- 3. Mobile nav: trap, Escape, focus return ----------
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });

  const btn = page.locator('header button[aria-expanded]').first();
  await btn.click();
  await page.waitForTimeout(300);

  const openState = await page.evaluate(() => ({
    expanded: document.querySelector('header button[aria-expanded]')?.getAttribute('aria-expanded'),
    locked: document.body.style.overflow,
    focusInside: !!document.activeElement?.closest('#mobile-nav'),
  }));
  ok(openState.expanded === 'true', 'mobile nav: opens', `aria-expanded=${openState.expanded}`);
  ok(openState.locked === 'hidden', 'mobile nav: body scroll locked', `overflow=${openState.locked}`);

  // walk Tab many times; focus must never escape the panel
  let escaped = false;
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(() => !!document.activeElement?.closest('#mobile-nav'));
    if (!inside) { escaped = true; break; }
  }
  ok(!escaped, 'mobile nav: Tab stays trapped in panel');

  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const closed = await page.evaluate(() => ({
    expanded: document.querySelector('header button[aria-expanded]')?.getAttribute('aria-expanded'),
    focused: document.activeElement?.getAttribute('aria-expanded') !== null,
    overflow: document.body.style.overflow,
  }));
  ok(closed.expanded === 'false', 'mobile nav: Escape closes', `aria-expanded=${closed.expanded}`);
  ok(closed.focused, 'mobile nav: focus returns to button');
  ok(closed.overflow !== 'hidden', 'mobile nav: scroll lock released', `overflow=${closed.overflow || '(empty)'}`);
  await ctx.close();
}

// ---------- 4. Form: invalid submit -> inline error + focus ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });

  await page.locator('form button[type="submit"]').click();
  await page.waitForTimeout(400);

  const errState = await page.evaluate(() => {
    const form = document.querySelector('form');
    const alert = form?.querySelector('[role="alert"]');
    const invalid = [...form.querySelectorAll('[aria-invalid="true"]')];
    return {
      alertText: alert?.textContent?.trim().slice(0, 60) ?? '',
      alertVisible: !!alert && alert.getBoundingClientRect().height > 0,
      focusOnAlert: document.activeElement === alert,
      invalidCount: invalid.length,
      hasRole: !!alert,
    };
  });
  ok(errState.hasRole && errState.alertVisible, 'form: error summary renders', errState.alertText);
  ok(errState.focusOnAlert, 'form: error summary receives focus');
  ok(errState.invalidCount > 0, 'form: invalid fields marked', `${errState.invalidCount} fields`);
  await ctx.close();
}

// ---------- 5. Form: prepare a draft without claiming delivery ----------
// Listen for the mailto: request instead of stubbing window.location —
// window.location is non-configurable in Chromium, so redefining it throws.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  let uri = null;
  page.on('request', (r) => {
    if (r.url().startsWith('mailto:')) uri = r.url();
  });

  await page.goto(URL, { waitUntil: 'networkidle' });
  const form = page.locator('form');
  await form.locator('input, select, textarea').first().waitFor();
  await page.evaluate(() => {
    const f = document.querySelector('form');
    const set = (el, v) => {
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement
        : el.tagName === 'SELECT' ? HTMLSelectElement : HTMLInputElement;
      Object.getOwnPropertyDescriptor(proto.prototype, 'value').set.call(el, v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };
    for (const el of f.querySelectorAll('input, select, textarea')) {
      if (el.type === 'date') {
        const future = new Date();
        future.setFullYear(future.getFullYear() + 1);
        set(el, `${future.getFullYear()}-11-14`);
      }
      else if (el.type === 'email') set(el, 'bride@example.com');
      else if (el.type === 'tel') set(el, '+92 300 1234567');
      else if (el.type === 'number') set(el, '120');
      else if (el.tagName === 'SELECT') set(el, el.options[1]?.value ?? '');
      else if (el.id === 'f-message') set(el, 'Full bridal mehndi for my November wedding in Lahore.');
      else set(el, 'Ayesha Khan');
    }
  });
  await page.waitForTimeout(200);
  await form.locator('button[type="submit"]').click();
  await page.waitForTimeout(600);

  uri = await form.locator('a[href^="mailto:"]').getAttribute('href');
  ok(!!uri && uri.startsWith('mailto:'), 'form: prepares email link without sending', (uri || '(none)').slice(0, 60));
  if (uri) {
    const q = uri.split('?')[1] || '';
    const subj = decodeURIComponent((q.match(/subject=([^&]*)/) || [])[1] || '');
    const body = decodeURIComponent((q.split('body=')[1] || '').replace(/\+/g, ' '));
    ok(body.includes('bride@example.com') && body.includes('-11-14'), 'form: body carries submitted values');
    ok(subj.length > 0, 'form: subject present', subj);
    ok(await form.getByText('Nothing has been sent.', { exact: false }).isVisible(), 'form: honest draft status');
    ok((await form.locator('#inquiry-text').inputValue()).includes('bride@example.com'), 'form: manual copy fallback');
    await form.locator('#f-name').fill('Updated name');
    ok(await form.locator('#inquiry-text').count() === 0, 'form: editing clears stale draft');
  }
  await ctx.close();
}

// ---------- 6. Responsive layout and deployed assets ----------
for (const dark of [false, true]) {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate((dark) => document.documentElement.classList.toggle('theme-dark', dark), dark);
  for (const width of [320, 375, 414, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const fits = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
    ok(fits, `layout: ${width}px ${dark ? 'dark' : 'light'} has no horizontal overflow`);
  }
  const image = await page.locator('meta[property="og:image"]').getAttribute('content');
  const deployedPath = new globalThis.URL(image).pathname;
  const response = await ctx.request.get(new globalThis.URL(deployedPath, URL).href);
  ok(response.ok() && response.headers()['content-type']?.includes('image/png'), 'social preview: base-aware PNG resolves');
  const texture = await page.evaluate(() => getComputedStyle(document.body).getPropertyValue('--paisley-texture'));
  ok(texture.includes('/hamna-Henna-Site/textures/'), 'texture: deployment base included');
  await ctx.close();
}

await browser.close();
console.log(fails.length ? `\n${fails.length} FAILED` : '\nall passed');
process.exitCode = fails.length ? 1 : 0;
