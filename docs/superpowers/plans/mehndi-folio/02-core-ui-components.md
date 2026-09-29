# Module 2: Core UI Components

> **Source:** Tasks 2-3 from `docs/superpowers/plans/2026-08-15-mehndi-folio-design.md`

## Goal
Create reusable SVG ornament components: `Ornament.astro` (dividers) and `MotifPlaceholder.astro` (portfolio empty-state motifs).

## Files Created
- `site/src/components/Ornament.astro`
- `site/src/components/MotifPlaceholder.astro`

---

## Task 2: Ornament SVG Component

### Step 1: Create Ornament.astro

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

### Step 2: Verify it compiles
```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```
Expected: no errors from `Ornament.astro`.

### Step 3: Commit
```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/components/Ornament.astro
git commit -m "feat: add Ornament SVG component"
```

---

## Task 3: MotifPlaceholder SVG Component

### Step 1: Create MotifPlaceholder.astro

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

### Step 2: Verify it compiles
```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```
Expected: no errors.

### Step 3: Commit
```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/components/MotifPlaceholder.astro
git commit -m "feat: add MotifPlaceholder SVG component"
```

---

## Verification
- [ ] `pnpm astro check` passes for both components
- [ ] Both components use CSS custom properties for palette colors (no hardcoded hex in SVG)
- [ ] `aria-hidden="true"` on decorative elements
- [ ] `role="img"` + `aria-label` on motif placeholders
- [ ] Clean git commits