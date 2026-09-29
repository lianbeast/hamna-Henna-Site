# Module 5: Portfolio & Assembly

> **Source:** Tasks 9, 13-15 from `docs/superpowers/plans/2026-08-15-mehndi-folio-design.md`

## Goal
Create Portfolio section with empty-state, assemble complete page from all sections, add FAQ/booking styles, verify production build.

## Files Created/Modified
- `site/src/data/portfolio.json` (empty)
- `site/src/components/Portfolio.astro`
- `site/src/pages/index.astro` (assembly)
- `site/src/styles/global.css` (append FAQ + booking styles)
- `site/src/layouts/Layout.astro` (update meta description)

---

## Task 9: Portfolio Section with Empty-State

### Step 1: Create src/data/portfolio.json

```json
[]
```

### Step 2: Create Portfolio.astro

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

### Step 3: Verify build
```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```
Expected: no errors.

### Step 4: Commit
```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/data/portfolio.json site/src/components/Portfolio.astro
git commit -m "feat: add Portfolio section with SVG empty-state"
```

---

## Task 13: Assemble the Page

### Step 1: Replace src/pages/index.astro

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

### Step 2: Verify build
```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm build 2>&1 | tail -30
```
Expected: `pnpm build` completes. Output `dist/index.html` exists.

### Step 3: Start dev server and verify

```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro dev --background
```

Wait ~5s for server to come up, then:
```bash
curl -s http://localhost:4321/ | head -50
```
Expected: HTML containing "Henna by", "301.555.4321", "@henna-designer".

Stop server:
```bash
pnpm astro dev stop
```

### Step 4: Commit
```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/pages/index.astro
git commit -m "feat: assemble folio from all sections on index"
```

---

## Task 14: Add FAQ + Booking Styles to global.css

### Step 1: Append styles to global.css

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

### Step 2: Verify build
```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm build 2>&1 | tail -20
```
Expected: build succeeds.

### Step 3: Commit
```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/styles/global.css
git commit -m "feat: style FAQ accordion and booking form in folio system"
```

---

## Task 15: Final Preview and Verification

### Step 1: Build production bundle
```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm build 2>&1 | tail -30
```
Expected: clean build, no warnings about missing imports or Stripe references.

### Step 2: Verify Page Content
```bash
curl -s http://localhost:4321/ | grep -E "Henna by|301.555.4321|@henna-designer|The Craft Book"
```
Expected: all four strings present.

### Step 3: Verify Netlify Function Route
Check `site/netlify.toml` contains:
```toml
[[redirects]]
  from = "/api/inquiries"
  to = "/.netlify/functions/inquiries"
  status = 200
```

### Step 4: Verify No Stripe Artifacts
```bash
grep -r "stripe\|Stripe" site/src --exclude-dir=node_modules
```
Expected: no results.

### Step 5: Verify All Modules Present
```bash
ls site/src/components/{Hero,About,Services,Process,Portfolio,Footer,Ornament,MotifPlaceholder}.astro
ls site/src/components/{FAQAccordion,BookingInquiry}.tsx
```
Expected: all files exist.

### Step 6: Final Commit
```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add -A
git commit -m "feat: complete mehndi-folio continuum (all modules)"
```

---

## Verification
- [ ] `pnpm build` completes cleanly
- [ ] `dist/index.html` contains all sections
- [ ] No Stripe references remain in codebase
- [ ] All 5 modules implemented
- [ ] FAQ accordion works client-side
- [ ] Booking form submits to `/api/inquiries`
- [ ] Portfolio shows SVG empty-state
- [ ] All components use CSS custom properties
- [ ] Responsive at 600px breakpoint
- [ ] Clean final commit