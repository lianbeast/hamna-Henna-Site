---
name: henna-design
description: Henna-site design system - tokens, components, glassmorphism, dark mode, section layouts. Extends global design-system skill.
argument-hint: "[tokens|components|glass|dark-mode|sections|audit]"
license: MIT
metadata:
  author: claudekit
  version: "1.0.0"
---

# Henna Design System Skill

Project-specific design system for the henna artist portfolio. Wraps and extends the global design-system skill with hamna-site tokens and patterns.

## Design Tokens (site/src/styles/global.css)

### Color Palette (@theme block)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| --color-ivory | #FDFBF7 | #1a1a1a | Background primary |
| --color-paper | #F5F0E6 | #252525 | Background secondary, cards |
| --color-inkbrown | #2D2D2D | #E0E0E0 | Text primary |
| --color-henna | #B8553D | #FF6B5B | Primary brand, CTAs |
| --color-rose | #D48C9E | #FF8A8F | Accent, hover states |
| --color-rust | #C96C5D | #FF7A6A | Secondary actions |
| --color-gold | #D4AF37 | #FFD700 | Highlights, premium |
| --color-clay | #A67B5B | #FFAB8A | Muted accents |

### Typography
- **Font Family**: Fraunces (serif) via Google Fonts
- **CSS Variable**: `font-family: var(--font-fraunces)` or `font-serif`
- **Weights**: 400, 500, 600, 700, 800, 900

### Spacing Scale
Tailwind v4 default spacing (4px base):
- `space-1` = 4px, `space-2` = 8px, `space-3` = 12px, `space-4` = 16px
- `space-6` = 24px, `space-8` = 32px, `space-12` = 48px, `space-16` = 64px

### Shadows
Defined in `@theme`:
- `--shadow-soft` - Subtle elevation
- `--shadow-medium` - Card elevation
- `--shadow-strong` - Modal/popover elevation

## Component Classes (@layer components)

### Glass Panel
```css
.glass-panel {
  @apply bg-white/10 backdrop-blur-md border border-white/20;
  /* Dark mode handled via html.theme-dark */
}
```
Usage: `<div class="glass-panel p-6 rounded-xl">`

### Section Layouts (.svc-*)
Each major section has a layout class:
- `.svc-hero` - Full viewport hero, centered content
- `.svc-about` - Two-column text + image
- `.svc-services` - 3-column card grid
- `.svc-process` - Numbered stepper horizontal
- `.svc-portfolio` - Masonry/grid gallery
- `.svc-pricing` - 3-tier comparison cards
- `.svc-testimonials` - Carousel/slider
- `.svc-instagram` - Auto-grid feed

## Dark Mode

Implementation: `themeStore.ts` toggles `html.theme-dark` class

```css
/* In global.css */
html.theme-dark {
  --color-ivory: #1a1a1a;
  --color-paper: #252525;
  --color-inkbrown: #E0E0E0;
  --color-henna: #FF6B5B;
  --color-rose: #FF8A8F;
  --color-rust: #FF7A6A;
  --color-gold: #FFD700;
  --color-clay: #FFAB8A;
}

.glass-panel {
  @apply bg-white/5 border-white/10;
}

html.theme-dark .glass-panel {
  @apply bg-black/20 border-white/5;
}
```

Respects `prefers-reduced-motion` - disables transitions when enabled.

## Commands

```bash
henna-design tokens      # Display all design tokens
henna-design components  # List component classes
henna-design glass       # Show glass-panel usage
henna-design dark-mode   # Show dark mode implementation
henna-design sections    # Show section layout classes
henna-design audit       # Run design audit (a11y, contrast, consistency)
```

## Creating New Components

### Using Design Tokens
```astro
---
--- 
<section class="svc-newsection">
  <div class="glass-panel p-8 rounded-2xl">
    <h2 class="text-3xl font-serif text-[var(--color-inkbrown)]">Title</h2>
    <p class="text-[var(--color-inkbrown)]/80 mt-4">Content</p>
    <button class="mt-6 px-6 py-3 rounded-full bg-[var(--color-henna)] text-[var(--color-ivory)] font-medium hover:bg-[var(--color-rose)] transition-colors">
      CTA
    </button>
  </div>
</section>
```

### Tailwind v4 with CSS Variables
```html
<!-- Correct: Use CSS variables -->
<div class="bg-[var(--color-paper)] text-[var(--color-inkbrown)]">

<!-- Avoid: Hardcoded colors -->
<div class="bg-[#F5F0E6] text-[#2D2D2D]">
```

## Responsive Breakpoints

Tailwind v4 defaults:
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px
- `2xl:` 1536px

Section classes handle responsiveness internally.

## Accessibility

- Color contrast: All token pairs meet WCAG AA (4.5:1)
- Focus states: Visible on all interactive elements
- Reduced motion: Transitions disabled via media query
- Semantic HTML: Sections use proper heading hierarchy

## Audit Checklist

Run `henna-design audit` to verify:
- [ ] All colors use CSS variables (no hardcoded hex)
- [ ] Glass panels have proper contrast in both themes
- [ ] Section classes follow naming convention (.svc-*)
- [ ] Typography uses Fraunces font-family
- [ ] Dark mode toggles work without flash
- [ ] Reduced motion respected
- [ ] Focus indicators visible
- [ ] Touch targets ≥44px

## Integration with Global design-system Skill

This skill references:
- `design-system` for token architecture (primitive→semantic→component)
- `design-system` for component spec templates
- `design-system` for slide generation (if needed)

Token mapping:
```
Primitive (global.css @theme) → Semantic (component classes) → Component (.svc-*, .glass-panel)
```