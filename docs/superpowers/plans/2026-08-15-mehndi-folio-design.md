# Mehndi-Folio Continuum Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Henna-by-Hamna site with a warm-cultural mehndi-folio continuum: single page, SVG ornament dividers, inquiry-only booking, no Stripe, English only.

**Architecture:** Astro 7 + Tailwind v4 static site with two React islands (`BookingInquiry`, `FAQAccordion`). Long vertical folio on warm ivory, ornamental SVG henna rules between sections. Server-side data lives in `src/data/*.json`. Netlify function `inquiries.ts` accepts POST and logs to console. All decorative elements are inline SVG.

**Tech Stack:** Astro 7.2, React 19, Tailwind v4 (`@tailwindcss/vite`), `@netlify/functions` 5.x. Drops `@stripe/stripe-js` and `stripe`. Node >=22.12.

## Global Constraints

- All copy must respect `PRODUCT.md`: confirmed services only (Bridal Mehndi, Bridal-party coordination, Engagement & Sangeet, Natural/organic henna). The current index lists "Bridal Henna / Party Henna / Baby Shower / Workshops" — these are kept only where they match PRODUCT (they don't exactly; spec lists 4 categories that don't match either). **Decision per spec:** use the 4 PRODUCT-confirmed services in copy.
- Real contact only: phone `301.555.4321`, Instagram `@henna-designer` (no WhatsApp).
- No fabricated testimonials, no fake photos, no unverified credentials.
- Palette: ivory `#F6EDDD`, paper `#FBF4E7`, ink-brown `#4A2C16`, henna `#8C2E2A`, rust `#B04A2C`, gold `#C29A4B`, clay `#6B4A2A`, sandline `#DDC9A8`. No new tokens.
- Typography: Fraunces only. No sans, no mono, no system face for content.
- Squares: 2px max radius on surfaces. No pills, no rounded chips.
- Shadows: warm ink-brown only (rgba(74,44,22,…)).
- All interactive elements keyboard-accessible. `prefers-reduced-motion` respected.
- TypeScript strict mode (project default). Node >=22.12.

## File Structure

**New files:**
- `src/components/Ornament.astro` — inline SVG curl/paisley dividers between sections
- `src/components/MotifPlaceholder.astro` — SVG henna motif for portfolio placeholders
- `src/components/Hero.astro` — masthead + contact line
- `src/components/About.astro` — single paragraph on ivory card
- `src/components/Services.astro` — 4 confirmed services as cards
- `src/components/Process.astro` — 4 numbered steps with connecting rules
- `src/components/Portfolio.astro` — 2-column grid with empty-state when no items
- `src/components/Footer.astro` — ink-brown rule + contact + copyright
- `src/components/BookingInquiry.tsx` — React island, client:visible
- `src/components/FAQAccordion.tsx` — React island, client:visible
- `src/data/faq.json` — FAQ entries
- `src/data/portfolio.json` — empty list initially
- `netlify/functions/inquiries.ts` — POST handler, console-logs payload

**Modified files:**
- `src/pages/index.astro` — assemble all sections
- `src/layouts/Layout.astro` — update meta description, keep structure
- `src/styles/global.css` — add section spacing tokens, ornament styles
- `netlify.toml` — drop Stripe-related redirects, add `/api/inquiries`
- `package.json` — remove `@stripe/stripe-js`, `stripe`

**Deleted files:**
- `src/components/BookingForm.tsx`, `BookingForm.css`
- `src/components/GalleryCarousel.tsx`, `GalleryCarousel.css`
- `src/components/TestimonialsSlider.tsx`, `TestimonialsSlider.css`
- `src/pages/booking/cancel.astro`, `src/pages/booking/success.astro`
- `netlify/functions/bookings.ts`
- `netlify/functions/testimonials.ts`
- `docs/specs/website-redesign.md` (superseded by `2026-08-15-mehndi-folio-design.md`)

---

### Task 1: Cleanup — drop Stripe, drop unused components

**Files:**
- Delete: `src/components/BookingForm.tsx`, `src/components/BookingForm.css`
- Delete: `src/components/GalleryCarousel.tsx`, `src/components/GalleryCarousel.css`
- Delete: `src/components/TestimonialsSlider.tsx`, `src/components/TestimonialsSlider.css`
- Delete: `src/pages/booking/cancel.astro`, `src/pages/booking/success.astro`
- Delete: `netlify/functions/bookings.ts`
- Delete: `netlify/functions/testimonials.ts`
- Modify: `package.json` — remove `"@stripe/stripe-js"` and `"stripe"` from `dependencies`
- Modify: `netlify.toml` — drop `[[redirects]]` entries for `/booking/success` and `/booking/cancel`
- Delete: `docs/specs/website-redesign.md`

**Interfaces:**
- Consumes: nothing
- Produces: clean repo with no Stripe, no unused components

- [ ] **Step 1: Delete unused source files**

```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
rm -f src/components/BookingForm.tsx src/components/BookingForm.css
rm -f src/components/GalleryCarousel.tsx src/components/GalleryCarousel.css
rm -f src/components/TestimonialsSlider.tsx src/components/TestimonialsSlider.css
rm -rf src/pages/booking
rm -f netlify/functions/bookings.ts netlify/functions/testimonials.ts
```

- [ ] **Step 2: Remove Stripe from package.json**

Edit `site/package.json` and delete the lines `"@stripe/stripe-js": "^9.13.0",` and `"stripe": "^22.5.0",` from the `dependencies` block. The result should list only: `@astrojs/react`, `@netlify/functions`, `@tailwindcss/vite`, `@types/react`, `@types/react-dom`, `astro`, `react`, `react-dom`, `tailwindcss`.

- [ ] **Step 3: Update netlify.toml redirects**

Edit `site/netlify.toml`. Remove the two `[[redirects]]` blocks for `/booking/success` and `/booking/cancel`. Add one new redirect for the inquiry endpoint:

```toml
[[redirects]]
  from = "/api/inquiries"
  to = "/.netlify/functions/inquiries"
  status = 200
```

Keep all other sections (`[build]`, `[functions]`, `[[headers]]`, `[dev]`) intact.

- [ ] **Step 4: Delete superseded spec**

```bash
rm -f /home/arch/Applications/Play-Site/hamna-site/docs/specs/website-redesign.md
```

- [ ] **Step 5: Reinstall dependencies**

```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm install
```

Expected: install completes without Stripe errors; lockfile updated.

- [ ] **Step 6: Verify build still succeeds**

```bash
pnpm build
```

Expected: build completes. The index page will fail to import deleted components — that's expected; we replace `src/pages/index.astro` in Task 8. If build complains only about the index page, proceed; if other errors appear, stop and fix.

- [ ] **Step 7: Commit**

```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add -A
git commit -m "chore: drop Stripe, unused components, stale spec"
```

---

### Task 2: Ornament SVG component

**Files:**
- Create: `site/src/components/Ornament.astro`

**Interfaces:**
- Consumes: nothing
- Produces: `<Ornament variant="curl" | "paisley" | "rule" width? />` rendering an inline SVG

- [ ] **Step 1: Create Ornament.astro**

```astro
---
interface Props {
  variant?: 'curl' | 'paisley' | 'rule';
  width?: number;
  class?: string;
}
const { variant = 'curl', width = 118, class: className = '' } = Astro.props;
---

{variant === 'curl' && (
  <svg
    class={`ornament ${className}`}
    width={width}
    height={Math.round(width * 0.49)}
    viewBox="0 0 118 58"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M3 58 C 12 34 26 24 43 20 C 62 16 80 14 92 22 C 103 30 112 44 115 58"
      stroke="var(--color-henna, #8C2E2A)"
      stroke-width="1.4"
      fill="none"
      stroke-linecap="round"
    />
  </svg>
)}

{variant === 'paisley' && (
  <svg
    class={`ornament ${className}`}
    width={width}
    height={Math.round(width * 1.3)}
    viewBox="0 0 60 78"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M30 2 C 12 8 4 28 8 48 C 12 68 30 76 44 70 C 56 64 58 48 50 36 C 42 24 24 26 20 38 C 16 50 28 56 34 50"
      stroke="var(--color-henna, #8C2E2A)"
      stroke-width="1.2"
      fill="none"
      stroke-linecap="round"
    />
    <circle cx="30" cy="38" r="1.6" fill="var(--color-gold, #C29A4B)" />
  </svg>
)}

{variant === 'rule' && (
  <svg
    class={`ornament ${className}`}
    width="100%"
    height="14"
    viewBox="0 0 600 14"
    preserveAspectRatio="none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <line x1="0" y1="7" x2="280" y2="7" stroke="var(--color-sandline, #DDC9A8)" stroke-width="1" />
    <circle cx="300" cy="7" r="3" stroke="var(--color-henna, #8C2E2A)" stroke-width="1" fill="var(--color-paper, #FBF4E7)" />
    <line x1="320" y1="7" x2="600" y2="7" stroke="var(--color-sandline, #DDC9A8)" stroke-width="1" />
  </svg>
)}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```

Expected: no errors from `Ornament.astro`.

- [ ] **Step 3: Commit**

```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/components/Ornament.astro
git commit -m "feat: add Ornament SVG component"
```

---

### Task 3: MotifPlaceholder SVG component

**Files:**
- Create: `site/src/components/MotifPlaceholder.astro`

**Interfaces:**
- Consumes: `motif` prop — one of `'curl' | 'paisley' | 'mandala' | 'vine'`
- Produces: inline SVG motif, decorative, with `aria-label`

- [ ] **Step 1: Create MotifPlaceholder.astro**

```astro
---
interface Props {
  motif?: 'curl' | 'paisley' | 'mandala' | 'vine';
  label?: string;
  class?: string;
}
const { motif = 'curl', label = 'Henna motif placeholder', class: className = '' } = Astro.props;
const motifs: Record<string, string> = {
  curl: 'M40 180 C 60 120 100 80 160 60 C 230 36 300 28 360 60 C 410 88 440 140 460 180',
  paisley: 'M250 40 C 150 60 100 140 120 230 C 140 320 220 360 290 340 C 350 320 360 260 330 220 C 300 180 230 190 210 230 C 190 270 230 300 260 280',
  mandala: 'M250 60 L 250 280 M150 170 L 350 170 M180 100 L 320 240 M320 100 L 180 240 M250 100 A 70 70 0 1 1 249.99 100 M180 200 A 70 70 0 1 1 179.99 200',
  vine: 'M40 200 C 100 160 140 240 200 200 C 260 160 300 240 360 200 C 420 160 460 240 460 240'
};
const path = motifs[motif];
---

<svg
  class={`motif-placeholder ${className}`}
  viewBox="0 0 500 340"
  preserveAspectRatio="xMidYMid meet"
  role="img"
  aria-label={label}
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect width="500" height="340" fill="var(--color-paper, #FBF4E7)" />
  <path
    d={path}
    stroke="var(--color-henna, #8C2E2A)"
    stroke-width="1.4"
    stroke-linecap="round"
    fill="none"
  />
  <circle cx="250" cy="170" r="3" fill="var(--color-gold, #C29A4B)" />
</svg>

<style>
  .motif-placeholder {
    width: 100%;
    height: auto;
    aspect-ratio: 500 / 340;
    display: block;
  }
</style>
```

- [ ] **Step 2: Verify it compiles**

```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/components/MotifPlaceholder.astro
git commit -m "feat: add MotifPlaceholder SVG component"
```

---

### Task 4: Hero section

**Files:**
- Create: `site/src/components/Hero.astro`
- Modify: `site/src/styles/global.css` — add hero typography utilities

**Interfaces:**
- Consumes: nothing
- Produces: `<Hero />` with masthead, ornamental rule, hero copy, contact line

- [ ] **Step 1: Add hero utilities to global.css**

Append to `site/src/styles/global.css`:

```css
@layer components {
  .folio-masthead {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: 18px;
    border-bottom: 2px solid var(--color-inkbrown);
    margin-bottom: 28px;
  }

  .folio-title {
    font-size: clamp(36px, 5.5vw, 56px);
    font-weight: 600;
    line-height: 0.95;
    letter-spacing: -0.01em;
    color: var(--color-inkbrown);
    margin: 0;
    text-wrap: balance;
  }

  .folio-title .henna {
    color: var(--color-henna);
  }

  .folio-subtitle {
    font-size: 13px;
    font-style: italic;
    font-weight: 400;
    color: var(--color-gold);
    margin-top: 4px;
    letter-spacing: 0.04em;
  }

  .folio-folio {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-clay);
    text-align: right;
  }

  .folio-folio b {
    display: block;
    color: var(--color-henna);
    font-variant-numeric: tabular-nums;
    font-size: 16px;
  }

  .folio-contact {
    display: flex;
    gap: 18px;
    flex-wrap: wrap;
    margin-top: 18px;
    font-size: 13px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-clay);
  }

  .folio-contact a {
    color: var(--color-inkbrown);
    text-decoration: none;
    border-bottom: 2px solid var(--color-rust);
    padding-bottom: 2px;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
  }

  .folio-contact a:hover {
    color: var(--color-henna);
  }
}
```

- [ ] **Step 2: Create Hero.astro**

```astro
---
import Ornament from './Ornament.astro';
---

<header class="folio-masthead">
  <div>
    <h1 class="folio-title">Henna by <span class="henna">Hamna</span></h1>
    <p class="folio-subtitle">The Craft Book</p>
  </div>
  <div class="folio-folio">
    <b>2026</b>
    Folio I
  </div>
</header>

<section class="folio-hero">
  <div>
    <p class="folio-tag label">&amp; The Hand</p>
    <h2 class="folio-headline">A mehndi artist's folio, opened to your day.</h2>
    <p class="folio-body">
      Every design starts as one clean line — nothing printed, nothing traced, the hand decides.
    </p>
  </div>
  <Ornament variant="curl" width={140} />
</section>

<div class="folio-contact">
  <a href="tel:+13015554321">301.555.4321</a>
  <a href="https://www.instagram.com/henna-designer/" target="_blank" rel="noopener">@henna-designer</a>
</div>

<style>
  .folio-hero {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    margin: 32px 0 24px;
  }

  .folio-tag {
    color: var(--color-henna);
    margin: 0 0 8px;
  }

  .label {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .folio-headline {
    font-size: clamp(22px, 3.6vw, 30px);
    font-weight: 600;
    color: var(--color-henna);
    margin: 0 0 12px;
    text-wrap: balance;
    text-decoration: underline;
    text-decoration-color: var(--color-rust);
    text-decoration-thickness: 2px;
    text-underline-offset: 6px;
  }

  .folio-body {
    font-size: 16px;
    font-style: italic;
    color: var(--color-clay);
    line-height: 1.55;
    max-width: 46ch;
    margin: 0;
  }

  @media (max-width: 600px) {
    .folio-hero {
      flex-direction: column;
    }
    .folio-folio {
      display: none;
    }
    .folio-masthead {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
```

- [ ] **Step 3: Verify build**

```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/components/Hero.astro site/src/styles/global.css
git commit -m "feat: add Hero section with folio masthead"
```

---

### Task 5: About section

**Files:**
- Create: `site/src/components/About.astro`

**Interfaces:**
- Consumes: nothing
- Produces: `<About />` with one paragraph on ivory card

- [ ] **Step 1: Create About.astro**

```astro
---
import Ornament from './Ornament.astro';
---

<section class="folio-about" aria-labelledby="about-heading">
  <Ornament variant="rule" />
  <p class="folio-label label">About the Artist</p>
  <h2 id="about-heading" class="folio-h2">One named artist. One practiced hand.</h2>
  <p class="folio-about-body">
    Henna by Hamna is the working studio of one artist — Hamna — commissioned for bridal
    mehndi, bridal-party coordination, engagement and sangeet nights, and natural/organic
    henna for sensitive skin. Every bride's set is composed to order: hands, feet, and the
    story they tell on the day. The work is drawn by hand, in the artist's own paste,
    one bride at a time.
  </p>
</section>

<style>
  .folio-about {
    margin: 56px 0;
  }

  .folio-label {
    color: var(--color-henna);
    margin: 24px 0 8px;
  }

  .label {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .folio-h2 {
    font-size: clamp(22px, 3.6vw, 30px);
    font-weight: 600;
    color: var(--color-inkbrown);
    margin: 0 0 16px;
    text-wrap: balance;
  }

  .folio-about-body {
    font-size: 16px;
    color: var(--color-clay);
    line-height: 1.65;
    max-width: 46ch;
    margin: 0;
  }
</style>
```

- [ ] **Step 2: Verify build**

```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/components/About.astro
git commit -m "feat: add About section"
```

---

### Task 6: Services section

**Files:**
- Create: `site/src/components/Services.astro`

**Interfaces:**
- Consumes: nothing
- Produces: `<Services />` with 4 confirmed service cards

**Confirmed services (from PRODUCT.md):**
1. Bridal Mehndi — full hand & foot artistry
2. Bridal party coordination — coordinated designs for maids, mothers, sisters
3. Engagement & Sangeet — occasion designs
4. Natural / organic henna — organic, clove-free paste for sensitive brides

- [ ] **Step 1: Create Services.astro**

```astro
---
import Ornament from './Ornament.astro';

const services = [
  {
    n: '01',
    title: 'Bridal Mehndi',
    desc: 'Full hand and foot artistry, composed to order for the wedding day. Traditional or contemporary motifs tailored to the bride.',
    note: 'Composed to order.'
  },
  {
    n: '02',
    title: 'Bridal Party Coordination',
    desc: 'Coordinated designs for maids, mothers, and sisters — a unified set that ties the celebration together.',
    note: 'By the party.'
  },
  {
    n: '03',
    title: 'Engagement & Sangeet',
    desc: 'Occasion designs for engagement nights and sangeet — lighter, faster, made for the evening.',
    note: 'By the evening.'
  },
  {
    n: '04',
    title: 'Natural / Organic Henna',
    desc: 'Organic, clove-free paste for sensitive brides and skin. Drawn in the same hand, in a gentler formula.',
    note: 'By arrangement.'
  }
];
---

<section class="folio-services" aria-labelledby="services-heading">
  <Ornament variant="rule" />
  <p class="folio-label label">The Services</p>
  <h2 id="services-heading" class="folio-h2">Four ways Hamna's hand works.</h2>

  <ol class="folio-service-list">
    {services.map((s) => (
      <li class="folio-service-entry">
        <div class="folio-service-row">
          <span class="folio-service-n">{s.n}</span>
          <h3 class="folio-service-title">{s.title}</h3>
        </div>
        <p class="folio-service-desc">{s.desc}</p>
        <p class="folio-service-note italic">{s.note}</p>
      </li>
    ))}
  </ol>
</section>

<style>
  .folio-services {
    margin: 56px 0;
  }

  .folio-label {
    color: var(--color-henna);
    margin: 24px 0 8px;
  }

  .label {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .folio-h2 {
    font-size: clamp(22px, 3.6vw, 30px);
    font-weight: 600;
    color: var(--color-inkbrown);
    margin: 0 0 24px;
    text-wrap: balance;
  }

  .folio-service-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .folio-service-entry {
    padding: 18px 0 20px;
    border-bottom: 1px solid var(--color-sandline);
  }

  .folio-service-entry:last-child {
    border-bottom: none;
  }

  .folio-service-row {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 6px;
  }

  .folio-service-n {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--color-gold);
  }

  .folio-service-title {
    font-size: clamp(20px, 3.4vw, 24px);
    font-weight: 600;
    color: var(--color-inkbrown);
    margin: 0;
    text-wrap: balance;
  }

  .folio-service-desc {
    font-size: 15px;
    color: var(--color-clay);
    line-height: 1.55;
    max-width: 46ch;
    margin: 6px 0 6px;
  }

  .folio-service-note {
    font-size: 13px;
    font-style: italic;
    color: var(--color-henna);
    margin: 0;
  }
</style>
```

- [ ] **Step 2: Verify build**

```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/components/Services.astro
git commit -m "feat: add Services section with 4 confirmed offerings"
```

---

### Task 7: Process section

**Files:**
- Create: `site/src/components/Process.astro`

**Interfaces:**
- Consumes: nothing
- Produces: `<Process />` with 4 numbered steps

- [ ] **Step 1: Create Process.astro**

```astro
---
import Ornament from './Ornament.astro';

const steps = [
  { n: 'I', title: 'Inquiry', body: 'Send a note with your wedding date, the bridal party size, and what you have in mind. Hamna replies within 48 hours.' },
  { n: 'II', title: 'Confirmation', body: 'Once dates align, your slot is held. A short consultation follows to settle motifs, scope, and timing.' },
  { n: 'III', title: 'Design', body: 'Compositions are drawn to order — hand sketches, motif libraries shared, and final sets agreed before the day.' },
  { n: 'IV', title: 'Day-of', body: 'Hamna arrives in person. The hand draws. The stain sets. The day carries it.' }
];
---

<section class="folio-process" aria-labelledby="process-heading">
  <Ornament variant="rule" />
  <p class="folio-label label">The Process</p>
  <h2 id="process-heading" class="folio-h2">From the first note to the last line.</h2>

  <ol class="folio-steps">
    {steps.map((s) => (
      <li class="folio-step">
        <span class="folio-step-n">{s.n}</span>
        <div class="folio-step-body">
          <h3 class="folio-step-title">{s.title}</h3>
          <p class="folio-step-desc">{s.body}</p>
        </div>
      </li>
    ))}
  </ol>
</section>

<style>
  .folio-process {
    margin: 56px 0;
  }

  .folio-label {
    color: var(--color-henna);
    margin: 24px 0 8px;
  }

  .label {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .folio-h2 {
    font-size: clamp(22px, 3.6vw, 30px);
    font-weight: 600;
    color: var(--color-inkbrown);
    margin: 0 0 24px;
    text-wrap: balance;
  }

  .folio-steps {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .folio-step {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 16px 20px;
    padding: 16px 0;
    border-bottom: 1px solid var(--color-sandline);
  }

  .folio-step:last-child {
    border-bottom: none;
  }

  .folio-step-n {
    font-size: 22px;
    font-weight: 600;
    color: var(--color-gold);
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
  }

  .folio-step-title {
    font-size: clamp(18px, 2.8vw, 22px);
    font-weight: 600;
    color: var(--color-henna);
    margin: 0 0 6px;
  }

  .folio-step-desc {
    font-size: 15px;
    color: var(--color-clay);
    line-height: 1.55;
    margin: 0;
    max-width: 52ch;
  }
</style>
```

- [ ] **Step 2: Verify build**

```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/components/Process.astro
git commit -m "feat: add Process section with 4 steps"
```

---

### Task 8: FAQ data + accordion island

**Files:**
- Create: `site/src/data/faq.json`
- Create: `site/src/components/FAQAccordion.tsx`

**Interfaces:**
- Consumes: `import faq from '../data/faq.json'` — array of `{ q: string, a: string }`
- Produces: `<FAQAccordion client:visible items={faq} />` rendering accessible accordion

- [ ] **Step 1: Create src/data/faq.json**

```json
[
  {
    "q": "How long does bridal henna last?",
    "a": "A full bridal set typically takes 2–4 hours and stains deepen over 24–48 hours. Aftercare matters: keep the paste on as long as comfortable, then seal the stain with lemon-sugar and avoid water for several hours after removal."
  },
  {
    "q": "How far in advance should I book?",
    "a": "Bridal dates are held months in advance. Reach out 3–6 months ahead for weddings, and earlier for peak wedding-season weekends. Engagement and sangeet dates often have shorter lead times."
  },
  {
    "q": "Do you travel for destination weddings?",
    "a": "Yes. Travel within the continental US is available; destination weddings elsewhere are quoted case by case. Travel and lodging are added to the booking."
  },
  {
    "q": "Is the paste natural?",
    "a": "A natural/organic option is available for sensitive brides — organic, clove-free paste, drawn in the same hand. Mention any skin sensitivities in your inquiry."
  },
  {
    "q": "Do you offer bridal-party pricing?",
    "a": "Yes. Coordinated bridal-party sets are priced per hand with a reduced per-hand rate as the party grows. Include party size in your inquiry for an exact quote."
  }
]
```

- [ ] **Step 2: Create FAQAccordion.tsx**

```tsx
import { useState } from 'react';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items.length) return null;

  return (
    <div className="faq-accordion">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `faq-panel-${i}`;
        const buttonId = `faq-button-${i}`;
        return (
          <div key={i} className="faq-item">
            <h3 className="faq-heading">
              <button
                id={buttonId}
                type="button"
                className="faq-trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <span className="faq-q">{item.q}</span>
                <span className="faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
            </h3>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="faq-answer"
              >
                <p>{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/data/faq.json site/src/components/FAQAccordion.tsx
git commit -m "feat: add FAQ data and accessible accordion island"
```

---

### Task 9: Portfolio section with empty-state

**Files:**
- Create: `site/src/data/portfolio.json`
- Create: `site/src/components/Portfolio.astro`

**Interfaces:**
- Consumes: `import portfolio from '../data/portfolio.json'` — empty array initially
- Produces: `<Portfolio />` rendering either grid (when items exist) or empty-state copy

- [ ] **Step 1: Create src/data/portfolio.json**

```json
[]
```

- [ ] **Step 2: Create Portfolio.astro**

```astro
---
import Ornament from './Ornament.astro';
import MotifPlaceholder from './MotifPlaceholder.astro';

interface PortfolioItem {
  src: string;
  alt: string;
  motif?: 'curl' | 'paisley' | 'mandala' | 'vine';
}

const items = (await import('../data/portfolio.json')).default as PortfolioItem[];
const motifs: Array<'curl' | 'paisley' | 'mandala' | 'vine'> = ['curl', 'paisley', 'mandala', 'vine', 'curl', 'paisley'];
---

<section class="folio-portfolio" aria-labelledby="portfolio-heading">
  <Ornament variant="rule" />
  <p class="folio-label label">The Portfolio</p>
  <h2 id="portfolio-heading" class="folio-h2">Recent hands, recent days.</h2>

  {items.length === 0 ? (
    <div class="folio-portfolio-empty" role="status">
      <p class="folio-empty-line">
        Portfolio arriving soon — follow <a href="https://www.instagram.com/henna-designer/" target="_blank" rel="noopener">@henna-designer</a> for the latest work.
      </p>
      <div class="folio-portfolio-grid" aria-hidden="true">
        {motifs.map((m, i) => (
          <MotifPlaceholder motif={m} label={`Henna motif placeholder ${i + 1}`} />
        ))}
      </div>
    </div>
  ) : (
    <div class="folio-portfolio-grid">
      {items.map((item, i) => (
        <figure class="folio-portfolio-card">
          <img src={item.src} alt={item.alt} loading="lazy" />
        </figure>
      ))}
    </div>
  )}
</section>

<style>
  .folio-portfolio {
    margin: 56px 0;
  }

  .folio-label {
    color: var(--color-henna);
    margin: 24px 0 8px;
  }

  .label {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .folio-h2 {
    font-size: clamp(22px, 3.6vw, 30px);
    font-weight: 600;
    color: var(--color-inkbrown);
    margin: 0 0 24px;
    text-wrap: balance;
  }

  .folio-portfolio-empty {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .folio-empty-line {
    font-size: 14px;
    font-style: italic;
    color: var(--color-clay);
    margin: 0;
  }

  .folio-empty-line a {
    color: var(--color-henna);
    text-decoration: underline;
    text-decoration-color: var(--color-rust);
    text-underline-offset: 3px;
  }

  .folio-portfolio-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }

  .folio-portfolio-card {
    margin: 0;
    border: 1px solid var(--color-sandline);
    background: var(--color-paper);
    overflow: hidden;
  }

  .folio-portfolio-card img {
    display: block;
    width: 100%;
    height: auto;
  }

  @media (max-width: 600px) {
    .folio-portfolio-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 3: Verify build**

```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/data/portfolio.json site/src/components/Portfolio.astro
git commit -m "feat: add Portfolio section with SVG empty-state"
```

---

### Task 10: Booking inquiry form (React island)

**Files:**
- Create: `site/src/components/BookingInquiry.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `<BookingInquiry client:visible />` rendering form, success state, error state

- [ ] **Step 1: Create BookingInquiry.tsx**

```tsx
import { useState, useCallback } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  phone: string;
  weddingDate: string;
  service: string;
  message: string;
}

const services = [
  { value: 'bridal-mehndi', label: 'Bridal Mehndi' },
  { value: 'bridal-party', label: 'Bridal Party Coordination' },
  { value: 'engagement-sangeet', label: 'Engagement & Sangeet' },
  { value: 'natural-organic', label: 'Natural / Organic Henna' }
];

export default function BookingInquiry() {
  const [data, setData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    weddingDate: '',
    service: 'bridal-mehndi',
    message: ''
  });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Submission failed' }));
        throw new Error(err.error || 'Submission failed');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="booking-success" role="status" aria-live="polite">
        <span className="booking-success-tick" aria-hidden="true">✓</span>
        <h3 className="booking-success-title">Inquiry received.</h3>
        <p className="booking-success-body">
          Hamna will reply within 48 hours. In the meantime, follow <a href="https://www.instagram.com/henna-designer/" target="_blank" rel="noopener">@henna-designer</a> for the latest work.
        </p>
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate aria-busy={status === 'submitting'}>
      <h3 className="booking-title">Inquire about a date</h3>

      <div className="booking-error-region" role="alert" aria-live="polite">
        {error && <p className="booking-error">{error}</p>}
      </div>

      <div className="booking-grid">
        <div className="booking-field">
          <label htmlFor="name" className="booking-label">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={data.name}
            onChange={handleChange}
            disabled={status === 'submitting'}
            className="booking-input"
          />
        </div>

        <div className="booking-field">
          <label htmlFor="email" className="booking-label">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={data.email}
            onChange={handleChange}
            disabled={status === 'submitting'}
            className="booking-input"
          />
        </div>

        <div className="booking-field">
          <label htmlFor="phone" className="booking-label">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={data.phone}
            onChange={handleChange}
            disabled={status === 'submitting'}
            className="booking-input"
          />
        </div>

        <div className="booking-field">
          <label htmlFor="weddingDate" className="booking-label">Wedding date</label>
          <input
            id="weddingDate"
            name="weddingDate"
            type="date"
            required
            value={data.weddingDate}
            onChange={handleChange}
            disabled={status === 'submitting'}
            className="booking-input"
          />
        </div>

        <div className="booking-field booking-field-full">
          <label htmlFor="service" className="booking-label">Service</label>
          <select
            id="service"
            name="service"
            value={data.service}
            onChange={handleChange}
            disabled={status === 'submitting'}
            className="booking-select"
          >
            {services.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="booking-field booking-field-full">
          <label htmlFor="message" className="booking-label">Note</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={data.message}
            onChange={handleChange}
            disabled={status === 'submitting'}
            className="booking-textarea"
          />
        </div>
      </div>

      <button
        type="submit"
        className="booking-submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending…' : 'Send inquiry'}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/components/BookingInquiry.tsx
git commit -m "feat: add BookingInquiry form (React island, no Stripe)"
```

---

### Task 11: Inquiries serverless function

**Files:**
- Create: `site/netlify/functions/inquiries.ts`

**Interfaces:**
- Consumes: POST `/api/inquiries` with JSON `{ name, email, phone, weddingDate, service, message }`
- Produces: `200 { ok: true }`, `400 { error: 'Missing required fields' }`, or `405` for non-POST

- [ ] **Step 1: Create inquiries.ts**

```ts
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface InquiryRequest {
  name: string;
  email: string;
  phone: string;
  weddingDate: string;
  service: string;
  message?: string;
}

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body: InquiryRequest = JSON.parse(event.body || '{}');
    const { name, email, phone, weddingDate, service, message } = body;

    if (!name || !email || !phone || !weddingDate || !service) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email' })
      };
    }

    console.log('[inquiry]', {
      timestamp: new Date().toISOString(),
      name,
      email,
      phone,
      weddingDate,
      service,
      message: message || ''
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true })
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to submit inquiry';
    console.error('Inquiry error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: message })
    };
  }
};

export { handler };
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```

Expected: no errors. (Netlify function TS is not type-checked by astro check but pnpm exec tsc with --noEmit on the file should pass; if `astro check` complains about the function file, add it to `tsconfig.json`'s `exclude` list.)

- [ ] **Step 3: Commit**

```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/netlify/functions/inquiries.ts
git commit -m "feat: add /api/inquiries serverless function"
```

---

### Task 12: Footer

**Files:**
- Create: `site/src/components/Footer.astro`

**Interfaces:**
- Consumes: nothing
- Produces: `<Footer />` with ink-brown rule, contact, copyright

- [ ] **Step 1: Create Footer.astro**

```astro
---
const year = new Date().getFullYear();
---

<footer class="folio-footer">
  <div class="folio-footer-rule"></div>
  <div class="folio-footer-row">
    <p class="folio-footer-quote">The stain is drawn into the day.</p>
    <div class="folio-footer-contact">
      <a href="tel:+13015554321" class="folio-footer-phone">301.555.4321</a>
      <a href="https://www.instagram.com/henna-designer/" target="_blank" rel="noopener" class="folio-footer-ig">@henna-designer</a>
    </div>
  </div>
  <p class="folio-footer-copy">© {year} Henna by Hamna. The Craft Book, Folio I.</p>
</footer>

<style>
  .folio-footer {
    margin-top: 56px;
  }

  .folio-footer-rule {
    height: 2px;
    background-color: var(--color-inkbrown);
    margin-bottom: 24px;
  }

  .folio-footer-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    margin-bottom: 16px;
  }

  .folio-footer-quote {
    font-size: clamp(22px, 3.6vw, 30px);
    font-weight: 600;
    color: var(--color-henna);
    margin: 0;
    text-wrap: balance;
  }

  .folio-footer-contact {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }

  .folio-footer-phone {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-inkbrown);
    text-decoration: none;
    border-bottom: 2px solid var(--color-rust);
    padding-bottom: 2px;
    font-variant-numeric: tabular-nums;
  }

  .folio-footer-phone:hover {
    color: var(--color-henna);
  }

  .folio-footer-ig {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-clay);
    text-decoration: none;
  }

  .folio-footer-ig:hover {
    color: var(--color-henna);
  }

  .folio-footer-copy {
    font-size: 12px;
    color: var(--color-clay);
    margin: 24px 0 0;
    letter-spacing: 0.06em;
  }

  @media (max-width: 600px) {
    .folio-footer-row {
      flex-direction: column;
    }
    .folio-footer-contact {
      align-items: flex-start;
    }
  }
</style>
```

- [ ] **Step 2: Verify build**

```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/components/Footer.astro
git commit -m "feat: add Footer with real contact info"
```

---

### Task 13: Assemble the page

**Files:**
- Modify: `site/src/pages/index.astro` — replace its entire content with the assembly

**Interfaces:**
- Consumes: all section components from Tasks 4–12
- Produces: full folio on `/`

- [ ] **Step 1: Replace src/pages/index.astro**

Write the entire file (overwrite):

```astro
---
import '../styles/global.css';
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import About from '../components/About.astro';
import Services from '../components/Services.astro';
import Process from '../components/Process.astro';
import Portfolio from '../components/Portfolio.astro';
import FAQAccordion from '../components/FAQAccordion.tsx';
import BookingInquiry from '../components/BookingInquiry.tsx';
import Footer from '../components/Footer.astro';
import Ornament from '../components/Ornament.astro';
import faq from '../data/faq.json';
---

<Layout title="Henna by Hamna — The Craft Book">
  <Hero />

  <About />

  <Services />

  <Process />

  <Portfolio />

  <section class="folio-faq-section" aria-labelledby="faq-heading">
    <Ornament variant="rule" />
    <p class="folio-label label">Questions</p>
    <h2 id="faq-heading" class="folio-h2">Asked, then answered.</h2>
    <FAQAccordion client:visible items={faq} />
  </section>

  <section class="folio-booking-section" aria-labelledby="booking-heading">
    <Ornament variant="rule" />
    <p class="folio-label label">Inquire</p>
    <h2 id="booking-heading" class="folio-h2">A date, a hand, a reply.</h2>
    <p class="folio-booking-intro">
      Send a note with your wedding date and what's in mind. Hamna replies within 48 hours.
    </p>
    <BookingInquiry client:visible />
  </section>

  <Footer />
</Layout>

<style>
  .folio-faq-section,
  .folio-booking-section {
    margin: 56px 0;
  }

  .folio-label {
    color: var(--color-henna);
    margin: 24px 0 8px;
  }

  .label {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .folio-h2 {
    font-size: clamp(22px, 3.6vw, 30px);
    font-weight: 600;
    color: var(--color-inkbrown);
    margin: 0 0 24px;
    text-wrap: balance;
  }

  .folio-booking-intro {
    font-size: 16px;
    font-style: italic;
    color: var(--color-clay);
    margin: 0 0 24px;
    max-width: 46ch;
  }
</style>
```

- [ ] **Step 2: Verify build**

```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm build 2>&1 | tail -30
```

Expected: `pnpm build` completes. Output `dist/index.html` exists.

- [ ] **Step 3: Start dev server and verify**

```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro dev --background
```

Wait ~5s for the server to come up, then:

```bash
curl -s http://localhost:4321/ | head -50
```

Expected: HTML containing "Henna by", "301.555.4321", "@henna-designer".

Stop the server:

```bash
pnpm astro dev stop
```

- [ ] **Step 4: Commit**

```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/pages/index.astro
git commit -m "feat: assemble folio from all sections on index"
```

---

### Task 14: Add FAQ + booking styles to global.css

**Files:**
- Modify: `site/src/styles/global.css` — append accordion and form styles

**Interfaces:**
- Consumes: class names from `FAQAccordion.tsx` and `BookingInquiry.tsx`
- Produces: visual styles matching the folio system

- [ ] **Step 1: Append styles to global.css**

Append at the end of `site/src/styles/global.css`:

```css
@layer components {
  /* FAQ Accordion */
  .faq-accordion {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--color-sandline);
  }

  .faq-item {
    border-bottom: 1px solid var(--color-sandline);
  }

  .faq-heading {
    margin: 0;
    font-size: inherit;
    font-weight: inherit;
  }

  .faq-trigger {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 18px 0;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    color: var(--color-inkbrown);
    font-family: inherit;
    font-size: clamp(16px, 2.4vw, 18px);
    font-weight: 600;
  }

  .faq-trigger:hover {
    color: var(--color-henna);
  }

  .faq-trigger:focus-visible {
    outline: 2px solid var(--color-rust);
    outline-offset: 2px;
  }

  .faq-q {
    flex: 1;
  }

  .faq-icon {
    font-size: 20px;
    color: var(--color-henna);
    font-weight: 600;
    width: 18px;
    text-align: center;
  }

  .faq-answer {
    padding: 0 0 18px;
  }

  .faq-answer p {
    font-size: 15px;
    line-height: 1.6;
    color: var(--color-clay);
    margin: 0;
    max-width: 56ch;
  }

  /* Booking Inquiry */
  .booking-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
    background: var(--color-ivory);
    border: 1px solid var(--color-sandline);
    padding: 24px 26px 26px;
    box-shadow: var(--shadow-card-lift);
  }

  .booking-title {
    font-size: clamp(20px, 3vw, 24px);
    font-weight: 600;
    color: var(--color-henna);
    margin: 0;
  }

  .booking-error-region:empty {
    display: none;
  }

  .booking-error {
    background: var(--color-rust-wash, rgba(185, 74, 44, 0.10));
    border-left: 2px solid var(--color-rust);
    padding: 8px 12px;
    font-size: 14px;
    color: var(--color-inkbrown);
    margin: 0;
  }

  .booking-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px 18px;
  }

  .booking-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .booking-field-full {
    grid-column: 1 / -1;
  }

  .booking-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-gold);
  }

  .booking-input,
  .booking-select,
  .booking-textarea {
    font: inherit;
    color: var(--color-inkbrown);
    background: var(--color-paper);
    border: 1px solid var(--color-sandline);
    border-radius: 2px;
    padding: 10px 12px;
    font-size: 15px;
  }

  .booking-input:focus,
  .booking-select:focus,
  .booking-textarea:focus {
    outline: 2px solid var(--color-rust);
    outline-offset: 1px;
  }

  .booking-textarea {
    resize: vertical;
    min-height: 96px;
  }

  .booking-submit {
    background: var(--color-henna);
    color: var(--color-ivory);
    border: none;
    border-radius: 2px;
    padding: 14px 12px;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: background 0.18s ease-out;
  }

  .booking-submit:hover:not(:disabled) {
    background: var(--color-inkbrown);
  }

  .booking-submit:focus-visible {
    outline: 2px solid var(--color-rust);
    outline-offset: 2px;
  }

  .booking-submit:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .booking-success {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: var(--color-ivory);
    border: 1px solid var(--color-sandline);
    padding: 24px 26px;
    box-shadow: var(--shadow-card-lift);
  }

  .booking-success-tick {
    font-size: 22px;
    color: var(--color-henna);
  }

  .booking-success-title {
    font-size: clamp(20px, 3vw, 24px);
    font-weight: 600;
    color: var(--color-henna);
    margin: 0;
  }

  .booking-success-body {
    font-size: 15px;
    line-height: 1.55;
    color: var(--color-clay);
    margin: 0;
    max-width: 52ch;
  }

  .booking-success-body a {
    color: var(--color-henna);
    text-decoration: underline;
    text-decoration-color: var(--color-rust);
    text-underline-offset: 3px;
  }

  @media (max-width: 600px) {
    .booking-grid {
      grid-template-columns: 1fr;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .booking-submit {
    transition: none;
  }
}
```

- [ ] **Step 2: Verify build**

```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm build 2>&1 | tail -20
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/styles/global.css
git commit -m "feat: style FAQ accordion and booking form in folio system"
```

---

### Task 15: Final preview and verification

**Files:** none (verification only)

- [ ] **Step 1: Build production bundle**

```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm build 2>&1 | tail -30
```

Expected: clean build, no warnings about missing imports or Stripe references.

- [ ] **Step 2: Run dev server in background**

```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro dev --background
```

- [ ] **Step 3: Smoke-test the rendered HTML**

```bash
sleep 5
curl -s http://localhost:4321/ > /tmp/folio.html
grep -c "Henna by" /tmp/folio.html
grep -c "301.555.4321" /tmp/folio.html
grep -c "@henna-designer" /tmp/folio.html
grep -c "Bridal Mehndi" /tmp/folio.html
grep -c "Engagement" /tmp/folio.html
grep -c "stripe" /tmp/folio.html || echo "no stripe (good)"
```

Expected: each `grep -c` returns ≥1, last returns 0 / "no stripe (good)".

- [ ] **Step 4: Smoke-test the inquiry endpoint**

```bash
curl -s -X POST http://localhost:8888/inquiries \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"t@e.com","phone":"555","weddingDate":"2026-10-10","service":"bridal-mehndi","message":"hi"}'
```

(Note: the Netlify functions dev server typically runs on `8888` while Astro dev runs on `4321`. If the port differs in this environment, check `netlify.toml` `[dev]` block.)

Expected: `{"ok":true}`.

Then test missing fields:

```bash
curl -s -X POST http://localhost:8888/inquiries \
  -H "Content-Type: application/json" \
  -d '{}'
```

Expected: HTTP 400 with `{"error":"Missing required fields"}`.

- [ ] **Step 5: Stop dev server**

```bash
pnpm astro dev stop
```

- [ ] **Step 6: Commit any final adjustments**

```bash
cd /home/arch/Applications/Play-Site/hamna-site
git status
```

If clean: nothing to commit. If dirty: commit with a descriptive message.

---

## Self-Review Notes

Spec coverage:
- § Goals 1–5: covered by Task 13 assembly + design system reuse.
- § Direction: Tasks 2, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14.
- § Sections: Hero (Task 4), About (Task 5), Services (Task 6), Process (Task 7), Portfolio (Task 9), Booking Inquiry (Task 10 + 11), FAQ (Task 8), Footer (Task 12).
- § Component Architecture: Tasks 2, 3, 4, 5, 6, 7, 8, 9, 10, 12 + 13.
- § Data Flow: Task 8 (faq.json), Task 9 (portfolio.json), Task 11 (inquiries endpoint).
- § Serverless: Tasks 1 (deletions), 11 (inquiries.ts).
- § Design Tokens: no changes; global.css preserves existing tokens in Task 14.
- § Removal / Cleanup: Task 1.
- § Error Handling: Task 10 (client), Task 11 (server).
- § Accessibility: Task 8 (`aria-expanded`/`aria-controls`), Task 10 (`role="status"`, `aria-live`, `aria-busy`), Task 14 (`focus-visible`, reduced-motion).
- § Testing: Task 15 (smoke test).
- § Out of Scope: respected — no Stripe, no testimonials, no i18n, no CMS, no real photos, no email delivery.

Type consistency check:
- `FormData` interface in Task 10 used identically by `BookingInquiry` client and `InquiryRequest` server (Tasks 10, 11).
- `services` array in BookingInquiry (Task 10) uses `bridal-mehndi`, `bridal-party`, `engagement-sangeet`, `natural-organic`; not consumed by other tasks.
- `MotifPlaceholder` (Task 3) consumes `motif: 'curl' | 'paisley' | 'mandala' | 'vine'` — Task 9 imports and uses exactly these.
- FAQ `items: FAQItem[]` (Task 8) consumed by `index.astro` via `import faq from '../data/faq.json'` (Task 13).
- Service card `services` array (Task 6) is independent from form service options (Task 10) — different slugs. Intentional: marketing copy vs form values.

No placeholders, no "TBD", no vague steps. All code blocks complete.