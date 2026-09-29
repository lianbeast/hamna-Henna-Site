# Henna by Hamna

A portfolio site for a working henna artist. Static Astro pages with a few
React islands, styled by a small token system. Deployed to GitHub Pages.

**Live:** https://lianbeast.github.io/hamna-Henna-Site/

![Site preview](preview.gif)

## Contents

- [What it is](#what-it-is)
- [Stack](#stack)
- [Architecture](#architecture)
- [Design system](#design-system)
- [Accessibility](#accessibility)
- [Local dev](#local-dev)
- [Project layout](#project-layout)
- [Environment](#environment)
- [Deploy](#deploy)
- [Tooling](#tooling)
- [Notes](#notes)

## What it is

A single-page portfolio. Sections render to static HTML; only the pieces
that need state ship JavaScript.

| Section | Ships JS |
|---|---|
| Hero, About, Services, Process, Portfolio, Pricing, Testimonials, Footer | no |
| FAQ accordion | `client:visible` |
| Booking inquiry form | `client:visible` |

The booking form writes to Supabase. Everything else is static.

## Stack

- **Astro 7** — static output, islands
- **React 19** — the two interactive islands
- **Tailwind v4** — utilities, via `@tailwindcss/vite`
- **Supabase** — `profiles` for business settings, `inquiries` for bookings
- **pnpm**, Node ≥ 22.12

## Architecture

**Islands.** `.astro` for anything presentational, `.tsx` only where state
is real. Both interactive islands hydrate on `client:visible`, so a reader
who never scrolls to them never downloads them.

**Stores.** `themeStore.ts` and `scrollStore.ts` are module-level objects
with a callback list, not React context. Context does not cross the
boundary between Astro's renderer and React's, and a single page only ever
has one theme and one scroll value, so a shared module is the honest
representation.

**Content.** FAQs, portfolio entries and testimonials are JSON in
`src/data/`. Changing a price or adding a testimonial does not need a
component edit.

**SEO.** Every meta tag, JSON-LD block and Open Graph image is declared
once, in `src/layouts/Layout.astro`.

## Design system

All tokens live in `src/styles/tokens.css`; `dark-mode.css` remaps the
colour tokens under `html.theme-dark`. Components reference tokens only —
no raw hex outside the token file.

The palette is warm earth: henna, clay, gold and sand on ivory. Dark mode
is a darker set of the same hues, not an inversion.

`--plate-ink` / `--plate-gold` are deliberately *not* remapped. They back
the dark stamp badge and the footer band, which should read as the same
object in both themes. Gold on that ink measures 8.12:1.

The page background is four stacked layers — three radial washes over a
repeating SVG henna tile, inline as a data URI. Layers paint top-first,
so the washes sit over the tile. It costs no extra request, and the dark
mode variant recolours the tile rather than dropping it.

## Accessibility

Targets WCAG 2.2 AA, checked rather than assumed:

- Every text pair measured against its actual composited background. The
  lowest is 4.73:1; the plate pairs run 8.12:1 and 14.2:1.
- Visible `:focus-visible` ring on every interactive element.
- `prefers-reduced-motion` is a global kill switch for transitions,
  animations and transforms.
- Decorative ornament SVGs are `aria-hidden`; the page's `<h1>` is the only
  top-level heading.
- Service entries are plain list items. They were once `role="button"`
  with `tabindex="0"` and a `cursor: pointer` tint, which advertised an
  interaction that did not exist.
- Layout is fluid, verified at 375 / 768 / 1024 / 1440px.

## Local dev

```bash
cd site
pnpm install
pnpm dev        # dev server
pnpm build      # static build to dist/
pnpm preview    # serve the built output
```

The build is static and does not need Supabase. Without a reachable
project it logs a warning and falls back to default business settings.

## Project layout

```
hamna-site/
├── site/                     # the Astro project
│   ├── src/
│   │   ├── pages/index.astro     # the only route
│   │   ├── layouts/Layout.astro  # head, SEO, JSON-LD
│   │   ├── components/           # .astro sections, .tsx islands
│   │   ├── styles/               # tokens, base, layout, typography
│   │   ├── data/                 # faq, portfolio, testimonials
│   │   └── lib/supabase.ts
│   └── public/
├── docs/
├── .github/workflows/deploy.yml
└── selfcheck.sh
```

## Environment

```bash
# site/.env.local
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

`.env*` is gitignored. Never commit keys.

## Deploy

Push to `main`. GitHub Actions builds and publishes `site/dist` to Pages.

The workflow pins pnpm via `pnpm/action-setup` and caches the store
against `site/pnpm-lock.yaml`.

## Tooling

`site/selfcheck.sh` guards the CSS contract. It fails the build on two
things:

1. a `var(--x)` referenced in reachable source but never defined in
   `tokens.css`
2. a non-utility class in reachable markup with no rule in the built CSS

Reachability is computed from `src/pages/index.astro`, so an orphaned
component cannot break the check. Run it after `pnpm build`:

```bash
cd site && pnpm build && ./selfcheck.sh
```

## Notes

- There is no LICENSE file. Add one before treating this as reusable.
- `netlify.toml` and `netlify/functions/` are stale. Pages is the live
  deploy path; the Netlify config is not wired to anything.
- `site/src/pages/admin/` holds `.tsx` files that are not pages. Astro
  warns about them on every build. They are components, and belong outside
  `pages/`.
- Stale comments in `themeStore.ts` and `scrollStore.ts` still mention
  `@react-three/fiber`. There is no 3D in this project; the stores are
  plain modules.
