# Mehndi-Folio Continuum — Henna by Hamna Redesign

**Date:** 2026-08-15
**Status:** Draft (self-review pending)
**Scope:** Replace current Craft-Book surface with a warm-cultural mehndi-folio continuum. Drop Stripe. Inquiry-only booking. English only.

## Goals

1. Visitor believes Hamna is skilled, reliable, and worth booking for their wedding.
2. Visitor can inquire without payment friction (single form, reply promise).
3. Site reads as one artist's ceremonial folio, not a SaaS landing page.
4. No fabricated claims (no testimonials, no unverified credentials, no fake placeholders for booking).
5. No fabricated visuals — portfolio is SVG art, clearly placeholder, ready for real photos later.

## Direction (confirmed)

Mehndi-folio continuum: long vertically-scrolling folio on warm ivory field, sections flow into each other through ornamental henna SVG rules. Single serif voice (Fraunces). Existing Impeccable palette (ivory, henna, gold, ink-brown, clay, sandline).

## Sections (single page)

1. **Hero & Masthead** — Full-bleed hand-drawn SVG curl across top. "Henna by Hamna" in henna-ink display. Gold italic subline "The Craft Book". Real contact line: 301.555.4321, @henna-designer.
2. **About the Artist** — One paragraph, truth-only. Ivory card with hairline border. No unverified credentials or chemistry claims.
3. **Services** — Four cards stacked (Bridal, Party, Baby Shower, Workshop). Gold arabic numeral, henna title, clay body, gold underline. Confirmed services only — no Indo-Arabic motifs, no live bars.
4. **Process** — 4 numbered steps (Inquiry → Confirmation → Design → Day-of). Connected by decorative rule.
5. **Portfolio Gallery** — 2-column grid of SVG placeholder motifs. Caption: "Portfolio arriving soon — follow @henna-designer". Drop-in real photos later via Astro image slots.
6. **Booking Inquiry** — Form: name, email, phone, wedding date, service, note. Submit → POST `/api/inquiries`. Success state: "Hamna will reply within 48 hours." No Stripe.
7. **FAQ** — Accordion built from `src/data/faq.json`. Default 5 Qs: aftercare, lead time, deposit, travel, group pricing.
8. **Footer** — Ink-brown rule, contact, copyright, year.

## Component Architecture

Static Astro components (server-rendered):
- `Hero.astro`, `About.astro`, `Services.astro`, `Process.astro`, `Portfolio.astro`, `FAQ.astro`, `Footer.astro`

Interactive (React islands, `client:visible`):
- `BookingInquiry.tsx` (form, success state, error state)
- `FAQAccordion.tsx` (toggle, keyboard accessible)

SVG components (Astro):
- `Ornament.astro` — SVG curl/paisley dividers between sections
- `MotifPlaceholder.astro` — Stylised henna motif for portfolio placeholders

All in `src/components/`. Layout: `src/layouts/Layout.astro` updated with new hero treatment, same global stylesheet.

## Data Flow

- **FAQ:** `src/data/faq.json` → `FAQAccordion` client island renders list.
- **Services:** Hardcoded in `Services.astro` (4 confirmed services, not dynamic).
- **Portfolio:** `src/data/portfolio.json` — empty list initially, renders empty-state with "Portfolio arriving soon" copy. When populated, renders grid of `<img>` with SVG fallback.
- **Booking:** `BookingInquiry` posts JSON to `/api/inquiries`. Netlify function `inquiries.ts` stores or forwards (TBD — see Implementation Notes).

## Serverless

- `POST /api/inquiries` — accepts `{ name, email, phone, weddingDate, service, message }`, returns `{ ok: true }`. Stores in Netlify KV or just logs (client decision: log to console for now, no DB).
- Remove: `netlify/functions/bookings.ts`, Stripe SDK, `@stripe/stripe-js`, `stripe` package, `BookingForm.tsx`, `GalleryCarousel.tsx`, `TestimonialsSlider.tsx` (not reused — no testimonials section).
- Update `netlify.toml` redirects: remove `/booking/success` and `/booking/cancel`.

## Design Tokens (reuse Impeccable)

- Colors: `--color-ivory #F6EDDD`, `--color-paper #FBF4E7`, `--color-inkbrown #4A2C16`, `--color-henna #8C2E2A`, `--color-rust #B04A2C`, `--color-gold #C29A4B`, `--color-clay #6B4A2A`, `--color-sandline #DDC9A8`.
- Typography: Fraunces (Google Fonts), serif-only. No sans. No mono.
- Shadows: page-fall, card-lift (unchanged).
- Spacing: 34px row pitch maintained for folio rhythm.

## Removal / Cleanup

- Delete `BookingForm.tsx`, `BookingForm.css`, `GalleryCarousel.tsx`, `GalleryCarousel.css`, `TestimonialsSlider.tsx`, `TestimonialsSlider.css`.
- Delete `src/pages/booking/cancel.astro`, `src/pages/booking/success.astro`.
- Remove `@stripe/stripe-js` and `stripe` from `package.json`.
- Remove `netlify/functions/bookings.ts` and `netlify/functions/testimonials.ts`.
- Update `docs/specs/website-redesign.md` — either delete (superseded) or rewrite to reference this spec.

## Error Handling

- `BookingInquiry`: client-side validation (required fields, email format). On submit failure, show inline error. No toast — use inline form region (a11y).
- Netlify function: validate payload server-side, return 400 on invalid, 200 on accept. Log to console for now.

## Accessibility

- Form: labels for every input, `aria-required`, `aria-invalid` on error, error message in `aria-live="polite"` region.
- FAQ: button toggles, `aria-expanded`, `aria-controls`.
- Portfolio: SVG placeholders have descriptive `aria-label`.
- Color contrast: henna on ivory passes AA for body, gold for labels only (large text).
- `prefers-reduced-motion`: disable any ornament draw-in animation.

## Testing

- Manual: run `astro dev`, submit form with empty fields → see validation. Submit valid → see success state. Toggle FAQ items. Tab through entire page.
- Build: `pnpm build` succeeds, no console errors.

## Out of Scope

- Stripe payments (dropped per user).
- Testimonials section (none exist; don't fabricate).
- Multiple languages.
- CMS / admin UI.
- Real portfolio photos (placeholders only; user adds later).
- Email delivery for inquiries (console-log only for v1).

## Implementation Notes

- Inquiries destination: confirm with user before implementation. Options: (a) console log only, (b) Netlify Forms, (c) email via Resend. Default: (a) for v1.
- SVG motifs: hand-author 4–6 distinct henna-inspired curl/paisley paths. Each ~80–160px wide, henna stroke.
