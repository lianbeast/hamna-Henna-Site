# Plain-Jane Template

A minimal, practical Astro starter template for service-based businesses. Built with Astro, React, and Tailwind CSS 4.

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS)
- [pnpm](https://pnpm.io/)

### Installation
```bash
pnpm install
```

### Development
Run the dev server in background mode:
```bash
pnpm astro dev --background
```
- Check status: `pnpm astro dev status`
- View logs: `pnpm astro dev logs`
- Stop server: `pnpm astro dev stop`

### Production
```bash
pnpm astro build
pnpm astro preview
```

## 🛠 Project Structure

The project follows the Astro Islands architecture, combining static HTML with interactive React components.

- `src/pages/`: Routing. `index.astro` is the main landing page.
- `src/components/`: UI components. 
  - `.astro` files for static/server-side content.
  - `.tsx` files for interactive React components.
- `src/data/`: JSON files (`faq.json`, `portfolio.json`, `testimonials.json`) for easy content management.
- `src/layouts/`: Page wrappers. `Layout.astro` handles SEO, metadata, and the base HTML shell.
- `src/styles/`: Global styles. `global.css` uses Tailwind 4 `@theme` blocks for custom design tokens.

## 🎨 Design System

### Theme Tokens
Custom palette is defined in `src/styles/global.css` using CSS variables:
- `--color-ivory`: Background / Paper
- `--color-henna`: Primary Brand Color
- `--color-gold`: Accents
- `--color-clay`: Text / Secondary

### Theming
Supports light/dark mode via `localStorage` and `prefers-color-scheme`. Toggle available in `FloatingToolbar`.

## 🚢 Deployment

### GitHub Pages
Automated deployment is configured via GitHub Actions (`.github/workflows/deploy.yml`).
Every commit to the `main` or `lianbeast/shipworm` branches triggers a build and deploys the static output to the `gh-pages` branch.

## 🌿 Branching Strategy
- `main`: The stable, "plain-jane" template version.
- `lianbeast/shipworm`: Feature development branch.
- `future-development`: Contains the advanced 3D/interactive version of the site (archived for future use).

## 📝 Customization Guide

1. **Content**: Edit the files in `src/data/` to update FAQ, testimonials, and portfolio items.
2. **Copy**: Update the text in `.astro` components within `src/components/`.
3. **Branding**: Change the colors in `src/styles/global.css` within the `@theme` block.
4. **Contact**: Update the `FORM_EMAIL` in `src/components/BookingInquiry.tsx`.
5. **SEO**: Modify the metadata and JSON-LD schema in `src/layouts/Layout.astro`.

## ✅ Accessibility & SEO
- **A11y**: Uses semantic HTML, ARIA roles for interactive components, and respects `prefers-reduced-motion`.
- **SEO**: Includes JSON-LD `LocalBusiness` schema for rich search results and Open Graph / Twitter Card meta tags.
