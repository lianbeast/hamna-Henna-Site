# Specifications

Website redesign combining static brand showcase with interactive React islands for booking, testimonials, and gallery.

## Functional Requirements

- Full‑bleed hero section with brand imagery
- Responsive service card grid
- Interactive gallery carousel
- Booking form with Stripe payment integration
- Testimonials slider with CRUD via serverless API
- Mobile‑first navigation menu
- Design tokens applied consistently (palette, typography, spacing)

## Non-Functional Requirements

- Largest Contentful Paint < 2.5s
- Time to Interactive < 3s on 3G
- SEO-friendly semantic HTML
- Fully responsive down to 320px
- Zero‑JavaScript fallback for static pages

## Acceptance Criteria

- All pages pass Lighthouse performance >= 90
- Mobile navigation works on iOS/Android
- Booking form submits to serverless API and redirects to Stripe
- Design tokens match specified palette and typography
- Gallery carousel auto‑plays and swipes
- Testimonials display and can be submitted via API

## Out of Scope

- Server‑side rendered dynamic pages beyond static generation
- Custom CMS integration (to be added later)
- Native mobile app development
- Complex animation library beyond Tailwind transitions