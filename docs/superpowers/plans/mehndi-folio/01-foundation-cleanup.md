# Module 1: Foundation & Cleanup

> **Source:** Task 1 from `docs/superpowers/plans/2026-08-15-mehndi-folio-design.md`

## Goal
Remove Stripe dependencies, delete unused components, clean up stale spec, establish clean repo baseline.

## Files

**Deleted:**
- `site/src/components/BookingForm.tsx`, `site/src/components/BookingForm.css`
- `site/src/components/GalleryCarousel.tsx`, `site/src/components/GalleryCarousel.css`
- `site/src/components/TestimonialsSlider.tsx`, `site/src/components/TestimonialsSlider.css`
- `site/src/pages/booking/cancel.astro`, `site/src/pages/booking/success.astro`
- `site/netlify/functions/bookings.ts`
- `site/netlify/functions/testimonials.ts`
- `docs/specs/website-redesign.md`

**Modified:**
- `site/package.json` — remove `@stripe/stripe-js` and `stripe` from dependencies
- `site/netlify.toml` — drop booking redirects, add inquiry endpoint

## Steps

### Step 1: Delete unused source files
```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
rm -f src/components/BookingForm.tsx src/components/BookingForm.css
rm -f src/components/GalleryCarousel.tsx src/components/GalleryCarousel.css
rm -f src/components/TestimonialsSlider.tsx src/components/TestimonialsSlider.css
rm -rf src/pages/booking
rm -f netlify/functions/bookings.ts netlify/functions/testimonials.ts
```

### Step 2: Remove Stripe from package.json
Edit `site/package.json` and delete:
- `"@stripe/stripe-js": "^9.13.0",`
- `"stripe": "^22.5.0",`

Result dependencies should only include:
- `@astrojs/react`
- `@netlify/functions`
- `@tailwindcss/vite`
- `@types/react`
- `@types/react-dom`
- `astro`
- `react`
- `react-dom`
- `tailwindcss`

### Step 3: Update netlify.toml redirects
Edit `site/netlify.toml`. Remove the two `[[redirects]]` blocks for `/booking/success` and `/booking/cancel`. Add:

```toml
[[redirects]]
  from = "/api/inquiries"
  to = "/.netlify/functions/inquiries"
  status = 200
```

Keep all other sections (`[build]`, `[functions]`, `[[headers]]`, `[dev]`) intact.

### Step 4: Delete superseded spec
```bash
rm -f /home/arch/Applications/Play-Site/hamna-site/docs/specs/website-redesign.md
```

### Step 5: Reinstall dependencies
```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm install
```
Expected: install completes without Stripe errors; lockfile updated.

### Step 6: Verify build still succeeds
```bash
pnpm build
```
Expected: build completes. The index page will fail to import deleted components — that's expected; we replace `src/pages/index.astro` in Module 5. If build complains only about the index page, proceed; if other errors appear, stop and fix.

### Step 7: Commit
```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add -A
git commit -m "chore: drop Stripe, unused components, stale spec"
```

---

## Verification
- [ ] `pnpm install` succeeds without Stripe
- [ ] `pnpm build` completes (index errors expected)
- [ ] No Stripe references remain in codebase
- [ ] Clean git commit