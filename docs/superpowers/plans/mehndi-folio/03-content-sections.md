# Module 3: Content Sections

> **Source:** Tasks 4-7, 12 from `docs/superpowers/plans/2026-08-15-mehndi-folio-design.md`

## Goal
Create static page sections: Hero, About, Services, Process, Footer.

## Files Created
- `site/src/components/Hero.astro`
- `site/src/components/About.astro`
- `site/src/components/Services.astro`
- `site/src/components/Process.astro`
- `site/src/components/Footer.astro`

## Files Modified
- `site/src/styles/global.css` — add hero typography utilities

---

## Task 4: Hero Section

### Step 1: Add hero utilities to global.css

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

### Step 2: Create Hero.astro

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

### Step 3: Verify build
```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```
Expected: no errors.

### Step 4: Commit
```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/components/Hero.astro site/src/styles/global.css
git commit -m "feat: add Hero section with folio masthead"
```

---

## Task 5: About Section

### Step 1: Create About.astro

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

### Step 2: Verify build
```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```
Expected: no errors.

### Step 3: Commit
```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/components/About.astro
git commit -m "feat: add About section"
```

---

## Task 6: Services Section

**Confirmed services (from PRODUCT.md):**
1. Bridal Mehndi — full hand & foot artistry
2. Bridal party coordination — coordinated designs for maids, mothers, sisters
3. Engagement & Sangeet — occasion designs
4. Natural / organic henna — organic, clove-free paste for sensitive brides

### Step 1: Create Services.astro

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

### Step 2: Verify build
```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```
Expected: no errors.

### Step 3: Commit
```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/components/Services.astro
git commit -m "feat: add Services section with 4 confirmed offerings"
```

---

## Task 7: Process Section

### Step 1: Create Process.astro

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

### Step 2: Verify build
```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```
Expected: no errors.

### Step 3: Commit
```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/components/Process.astro
git commit -m "feat: add Process section with 4 steps"
```

---

## Task 12: Footer

### Step 1: Create Footer.astro

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

### Step 2: Verify build
```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```
Expected: no errors.

### Step 3: Commit
```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/components/Footer.astro
git commit -m "feat: add Footer with real contact info"
```

---

## Verification
- [ ] All 5 components compile without errors
- [ ] Components use `Ornament` from Module 2
- [ ] All styling uses CSS custom properties (no hardcoded hex)
- [ ] Semantic HTML: proper section landmarks, h2 hierarchy
- [ ] Responsive breakpoints at 600px
- [ ] Clean git commits