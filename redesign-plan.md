# Hamna Henna Portfolio Redesign Plan

## Vision
Redesign the henna artist portfolio to showcase Mehndi art with elevated design, better performance, and enhanced accessibility — while honoring the handcrafted aesthetic.

## Current State Audit
- **Stack**: Astro 7 + React 19 + Tailwind v4 + Supabase
- **Live**: https://lianbeast.github.io/hamna-Henna-Site/
- **19 components**: 9 `.astro` static sections + 5 `.tsx` interactive islands + `themeStore.ts`, `scrollStore.ts`
- **Design tokens**: 8 colors, Fraunces serif font, Tailwind spacing, glass panels, `.svc-*` section classes
- **Deployment**: GitHub Pages (primary), stale Netlify config

## Redesign Principles (Lazy Senior Dev)

1. **STYLING**: Tailwind v4 CSS variables — no hardcoded hex colors
2. **TOKENS**: All colors use `var(--color-*)` from `@theme` block
3. **STRUCTURE**: Islands architecture — static `.astro` + `client:visible` islands
4. **PERFORMANCE**: `prefers-reduced-motion` respected, lazy loading, minimal JS
5. **ACCESSIBILITY**: WCAG AA contrast, focus states, semantic HTML, aria labels
6. **RESPONSIVE**: Mobile-first, `sm:` 640px, `md:` 768px, `lg:` 1024px, `xl:` 1280px, `2xl:` 1536px

## Key Changes

### 1. Color System — Update Tokens
- Increase contrast for WCAG AA compliance
- Refine dark mode palette for glass panel visibility
- Add focus-visible accent color

### 2. Component Refresh
- **Hero**: Larger typography, better hierarchy, subtitle emphasis
- **Services**: 3-column grid on desktop, 1-column on mobile, card tilt interaction
- **Process**: Vertical stepper with number + description, better glass panels
- **Portfolio**: Masonry grid with hover magnification, lazy-loaded images
- **Testimonials**: 3-card carousel with navigation, quote indentation
- **FAQ**: Accordion with smoother reveal, improved focus-visible
- **Booking**: Better form layout, inline error messages

### 3. New Interactive Elements
- Floating toolbar with theme toggle + scroll-to-top
- Smooth page-scroll with staggered section reveals
- Mandala-inspired micro-interactions (subtle, reduced-motion aware)

### 4. Data Structure Improvements
- Portfolio JSON: add motif, year, client attribution
- Testimonials: add source link, client role
- FAQ: expand to 8 questions (Q&A about henna, pricing, scheduling)

### 5. Performance Budget
- FCP < 1.5s on 3G
- Total JS shipped < 40KB (islands only)
- LCP element: hero headline image or text
- No render-blocking CSS above the fold

### 6. Accessibility Checklist
- [ ] All colors use CSS variables (no hardcoded hex)
- [ ] Glass panels proper contrast in both themes
- [ ] Section classes follow `.svc-*` naming convention
- [ ] Typography uses Fraunces font-family
- [ ] Dark mode toggles work without flash
- [ ] Reduced motion disables transitions
- [ ] Focus indicators visible on all interactive elements
- [ ] Touch targets ≥44px
- [ ] Semantic heading hierarchy (h1 → h2 → h3)
- [ ] aria-labels on interactive elements
- [ ] Keyboard-navigable forms

## Migration Path

### Phase 1: Foundation (Week 1)
- Update `global.css` tokens with improved contrast
- Add `prefers-reduced-motion` meta tag
- Convert hardcoded colors to CSS variables
- Run `henna-design audit` to verify

### Phase 2: Component Refresh (Week 2-3)
- Refresh Hero section with larger type
- Update Services to 3-column grid
- Improve Process stepper visuals
- Refresh Portfolio grid with hover states

### Phase 3: Interactive Islands (Week 4-5)
- Update FAQAccordion with smoother animation
- Refine BookingInquiry form
- Enhance ThemeToggle with smoother transition
- Add ScrollToTop with scroll awareness

### Phase 4: Polish & Deploy (Week 6)
- Cross-browser testing
- Mobile responsiveness verification
- GitHub Pages deploy
- Update preview.gif

## Rollback Plan
- Git branch `redesign` from `main`
- All changes committed incrementally
- If critical issue: `git checkout main` reverts immediately
- Deploy preview via `pnpm preview` before pushing to GitHub Pages

## Success Metrics
- WCAG AA color contrast across all themes
- FCP < 1.5s on typical 3G connection
- Mobile-first: all sections work at 320px width
- Zero JavaScript errors in console
- Dark mode toggle transitions smoothly without flash
- All focus-visible states accessible via Tab key

---
*Redesign plan — follow incrementally. Start with token updates, then component refreshes.*