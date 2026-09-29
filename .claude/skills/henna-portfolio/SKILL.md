---
name: henna-portfolio
description: Henna artist portfolio site (hamna-site) - Astro 7 + React 19 + Tailwind v4 + Supabase. Manages components, content, islands architecture, and deployment.
argument-hint: "[component|content|deploy|dev]"
license: MIT
metadata:
  author: claudekit
  version: "1.0.0"
---

# Henna Portfolio Site Skill

This skill provides project-specific commands and workflows for the hamna-site henna artist portfolio.

## Project Overview

- **Stack**: Astro 7, React 19, Tailwind v4, Supabase
- **Architecture**: Islands (static .astro sections + interactive .tsx React islands)
- **Live URL**: https://lianbeast.github.io/hamna-Henna-Site/
- **Primary Deploy**: GitHub Pages (gh-pages branch from site/dist)
- **Secondary**: Netlify (stale config)

## Quick Commands

| Command | Description |
|---------|-------------|
| `henna-portfolio dev` | Start dev server (pnpm dev in site/) |
| `henna-portfolio build` | Production build (pnpm build in site/) |
| `henna-portfolio preview` | Preview production build |
| `henna-portfolio deploy` | Deploy to GitHub Pages |
| `henna-portfolio component <name>` | Create new component (astro or tsx) |
| `henna-portfolio content <type>` | Manage content (faq, portfolio, testimonials) |
| `henna-portfolio tokens` | View design tokens from global.css |

## Component Architecture

### Static Sections (.astro)
- `Hero.astro` - Landing hero with CTA
- `About.astro` - Artist bio
- `Services.astro` - Service listings
- `Process.astro` - Booking process steps
- `Portfolio.astro` - Gallery grid
- `Pricing.astro` - Price tiers
- `Testimonials.astro` - Client reviews
- `InstagramFeed.astro` - Social feed
- `Footer.astro` - Site footer

### Interactive Islands (.tsx)
- `BookingInquiry.tsx` - Booking form (client:visible)
- `FAQAccordion.tsx` - FAQ expand/collapse (client:visible)
- `FloatingToolbar.tsx` - Navigation toolbar (client:load)
- `ThemeToggle.tsx` - Dark/light toggle (client:visible)
- `ShortcutHelp.tsx` - Keyboard shortcuts (client:visible)
- `ScrollToTop.tsx` - Back to top button (client:idle)

### Shared Logic (.ts)
- `themeStore.ts` - Reactive theme state
- `scrollStore.ts` - Scroll position tracking

## Content Management

### JSON Data Files (site/src/data/)
- `faq.json` - FAQ items array
- `portfolio.json` - Portfolio images/metadata
- `testimonials.json` - Client testimonials

### Supabase Tables
- `profiles` - Business settings (name, bio, contact, social links)
- `inquiries` - Booking form submissions

## Design System

Tokens defined in `site/src/styles/global.css` `@theme` block:

| Token | Light | Dark |
|-------|-------|------|
| --color-ivory | #FDFBF7 | #1a1a1a |
| --color-paper | #F5F0E6 | #252525 |
| --color-inkbrown | #2D2D2D | #E0E0E0 |
| --color-henna | #B8553D | #FF6B5B |
| --color-rose | #D48C9E | #FF8A8F |
| --color-rust | #C96C5D | #FF7A6A |
| --color-gold | #D4AF37 | #FFD700 |
| --color-clay | #A67B5B | #FFAB8A |

Fonts: Fraunces (serif) via Google Fonts

Utility classes in `@layer components`:
- `.glass-panel` - Frosted glass effect
- `.svc-*` - Section layout classes (.svc-hero, .svc-portfolio, etc.)

## Development Workflow

```bash
cd site
pnpm install          # Install dependencies
pnpm dev              # Start dev server (localhost:4321)
pnpm build            # Build to site/dist/
pnpm preview          # Preview dist/ locally
pnpm astro check      # Type-check Astro files
```

## Deployment

GitHub Pages workflow (`.github/workflows/deploy.yml`):
- Triggers on push to main or lianbeast/shipworm
- Builds with `pnpm install && pnpm build`
- Deploys `site/dist/` to gh-pages branch
- Base path: `/hamna-Henna-Site/`

## Creating New Components

### Static Section (.astro)
```astro
---
// src/components/NewSection.astro
interface Props {
  title: string
}
const { title } = Astro.props
---
<section class="svc-newsection">
  <h2>{title}</h2>
</section>
```

### Interactive Island (.tsx)
```tsx
// src/components/NewIsland.tsx
import { useState } from 'react'

export default function NewIsland() {
  const [state, setState] = useState(false)
  return <button onClick={() => setState(!state)}>{state ? 'On' : 'Off'}</button>
}
```

Use in .astro: `<NewIsland client:visible />`

## Hydration Directives

| Directive | Use Case | Components |
|-----------|----------|------------|
| `client:visible` | Mount when in viewport | FAQAccordion, BookingInquiry, ThemeToggle |
| `client:load` | Mount immediately | FloatingToolbar |
| `client:idle` | Mount after idle | ScrollToTop |

## Environment Variables

Create `site/.env.local`:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## References

- Main docs: `../CLAUDE.md` and `site/AGENTS.md`
- Design tokens: `site/src/styles/global.css`
- Supabase client: `site/src/lib/supabase.ts`
- Deploy workflow: `.github/workflows/deploy.yml`