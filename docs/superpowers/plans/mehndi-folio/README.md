# Mehndi-Folio Design Plan - Module Index

## Overview
The original 2000+ line implementation plan has been split into 5 focused modules.

## Module Files

1. **[01-foundation-cleanup.md](./01-foundation-cleanup.md)** 
   - Removes Stripe dependencies
   - Deletes unused components (BookingForm, GalleryCarousel, TestimonialsSlider)
   - Updates package.json and netlify.toml
   - Task 1 from original plan

2. **[02-core-ui-components.md](./02-core-ui-components.md)**
   - Ornament.astro (curl/paisley/rule SVG dividers)
   - MotifPlaceholder.astro (4 motif variants for empty-state)
   - Tasks 2-3 from original plan

3. **[03-content-sections.md](./03-content-sections.md)**
   - Hero.astro (masthead, hero copy, contact line)
   - About.astro (artist paragraph)
   - Services.astro (4 confirmed service cards)
   - Process.astro (4 numbered steps)
   - Footer.astro (ink-brown rule, contact)
   - Tasks 4-7, 12 from original plan

4. **[04-interactive-islands.md](./04-interactive-islands.md)**
   - FAQ data (faq.json) + FAQAccordion.tsx (React island)
   - BookingInquiry.tsx (React island, form + success/error)
   - netlify/functions/inquiries.ts (serverless POST handler)
   - Tasks 8, 10-11 from original plan

5. **[05-portfolio-assembly.md](./05-portfolio-assembly.md)**
   - Portfolio.astro (2-col grid + SVG empty-state)
   - src/data/portfolio.json (empty array)
   - index.astro assembly (all sections composed)
   - global.css FAQ + booking styles
   - Final build verification
   - Tasks 9, 13-15 from original plan

## Dependencies
Modules must be implemented in order (later modules depend on earlier ones).

## Original File
Source: `docs/superpowers/plans/2026-08-15-mehndi-folio-design.md` (1000+ lines)

## Split Reason
- Each module ~300-500 lines (well under context limits)
- Independently verifiable (astro check, build)
- Matches Astro component architecture patterns
- Reduces cognitive load for agentic implementation

## Execution Notes
Run modules sequentially. Each module ends with verification steps:
- `pnpm astro check` passes
- `pnpm build` succeeds
- Clean git commit with descriptive message