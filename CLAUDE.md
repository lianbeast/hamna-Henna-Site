# hamna-site — Henna Artist Portfolio

Astro 7 + React 19 + Tailwind v4 + Supabase portfolio site for a henna artist.

**Live:** https://lianbeast.github.io/hamna-Henna-Site/

---

## Project Structure

```
/hamna-site
├── site/              # Astro project (primary codebase)
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── package.json   # Project dependencies
├── docs/              # Documentation & design specs
└── .github/workflows/ # CI/CD (GitHub Pages deploy)
```

---

## Quick Start

```bash
cd site
pnpm install
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm preview      # Preview production build
```

**Environment variables** (create `site/.env.local`):

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Build & Test Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start Astro dev server (background) |
| `pnpm build` | Production build to `dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm astro` | Run any Astro CLI command |

**Test setup** (recommended):

```bash
cd site
pnpm add -D vitest @vitest/ui jsdom @testing-library/react
```

Example test structure (`site/__tests__/FAQ.test.tsx`):

```tsx
import { render, screen } from '@testing-library/react'
import FAQAccordion from '../components/FAQAccordion'

describe('FAQAccordion', () => {
  it('renders FAQ items', () => {
    render(<FAQAccordion faqs={[]} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

Run tests: `pnpm test` or `pnpm test:ui` (Vitest UI).

---

## Architecture

**Islands architecture**: static `.astro` sections + interactive `.tsx` React islands.

- **Static sections**: Hero, About, Services, Process, Portfolio, Pricing, Testimonials, InstagramFeed, Footer (`.astro`)
- **Interactive islands**: BookingInquiry, FAQAccordion, FloatingToolbar, ThemeToggle, ShortcutHelp (`.tsx`)
- **Shared logic**: `themeStore.ts`, `scrollStore.ts` (module-level reactive stores)

**Data sources**:
- JSON content: `src/data/*.json` (faq, portfolio, testimonials)
- Supabase: `profiles` (dynamic business settings), `inquiries` (booking form)

**Styling**:
- Tailwind v4 utilities on `<body>`
- Design tokens in `src/styles/global.css` `@theme` block (colors, fonts, shadows)
- Custom CSS in `@layer components` (glass panels, section classes)
- Dark mode via `html.theme-dark` class, toggled by `themeStore.ts`

**SEO**: All meta/JSON-LD/OG in `Layout.astro` (single entry point).

---

## Key File Locations (in `site/`)

| Category | Path |
|----------|------|
| Entry pages | `src/pages/index.astro` |
| Layouts | `src/layouts/Layout.astro` |
| Styles | `src/styles/global.css` (entire design system) |
| Components | `src/components/*.astro`, `src/components/*.tsx` |
| Data | `src/data/*.json` |
| Supabase | `src/lib/supabase.ts` |
| Config | `astro.config.mjs`, `tsconfig.json`, `netlify.toml`, `package.json` |
| CI | `.github/workflows/deploy.yml` |
| Tests | `__tests__/` (add test files here) |

---

## Coding Conventions

**File types**:
- `.astro` for static presentational sections (no interactivity)
- `.tsx` for interactive islands (hooks, state, event handlers)
- `.ts` for shared logic (`themeStore.ts`, `scrollStore.ts`)

**Component naming**: PascalCase matching export; class names use snake/kebab.

**Styling**:
- Tailwind utilities on elements
- Custom design tokens in `@theme` block of `global.css`
- Glassmorphism: `.glass-panel` class in `global.css`
- Section layout: `.svc-*` classes (`.svc-hero`, `.svc-portfolio`, etc.)

**Data fetching**:
- Static JSON: `import data from '../data/faq.json'` (build time)
- Supabase: `getBusinessProfile()` (SSR/build), direct client in React islands

**Hydration directives**:
- `client:visible` — on mount when in viewport (FAQ, Booking)
- `client:load` — on mount immediately (Toolbar)
- `client:idle` — on mount after idle (ScrollToTop)

**No lint/format config** in repo (TypeScript strict is enforced via `tsconfig.json`).

---

## Deployment

**GitHub Pages** (configured in `astro.config.mjs`):
- Base path: `/hamna-Henna-Site/`
- Triggers on push to `main` or `lianbeast/shipworm`
- Build: `pnpm install && pnpm build`
- Outputs: `site/dist/` → `gh-pages` branch

**Netlify** (configured in `netlify.toml`):
- Build command: `pnpm build`
- Publish: `site/dist`
- Functions: `netlify/functions/`

*Note: Netlify config appears stale; primary deployment is GitHub Pages.*

---

## Design System

Colors (tokens in `global.css` `@theme`):

| Token | Light | Dark |
|-------|-------|------|
| `--color-ivory` | #FDFBF7 | #1a1a1a |
| `--color-paper` | #F5F0E6 | #252525 |
| `--color-inkbrown` | #2D2D2D | #E0E0E0 |
| `--color-henna` | #B8553D | #FF6B5B |
| `--color-rose` | #D48C9E | #FF8A8F |
| `--color-rust` | #C96C5D | #FF7A6A |
| `--color-gold` | #D4AF37 | #FFD700 |
| `--color-clay` | #A67B5B | #FFAB8A |

Fonts: Fraunces (serif) via Google Fonts.

Dark mode: `html.theme-dark` class, toggled via `themeStore.ts`. `prefers-reduced-motion` disables transitions.