---
name: henna-deploy
description: Deploy henna-site to GitHub Pages. Manages build, preview, and deployment workflows.
argument-hint: "[build|preview|deploy|status|logs]"
license: MIT
metadata:
  author: claudekit
  version: "1.0.0"
---

# Henna Deploy Skill

Deployment workflows for the henna-site portfolio.

## Deployment Targets

### Primary: GitHub Pages
- **Repository**: lianbeast/hamna-Henna-Site
- **Branch**: gh-pages (auto-generated)
- **Source**: site/dist/
- **Base Path**: /hamna-Henna-Site/
- **Workflow**: .github/workflows/deploy.yml

### Secondary: Netlify (Stale)
- **Config**: site/netlify.toml
- **Build**: pnpm build
- **Publish**: site/dist
- **Functions**: netlify/functions/
- **Note**: Config appears outdated; GitHub Pages is primary

## Commands

```bash
henna-deploy build       # Production build (pnpm build in site/)
henna-deploy preview     # Preview production build locally
henna-deploy deploy      # Trigger GitHub Pages deployment
henna-deploy status      # Check deployment status
henna-deploy logs        # View recent deployment logs
```

## Build Process

```bash
cd site
pnpm install           # Install dependencies
pnpm build             # Build to site/dist/
# Output: site/dist/ with static assets
```

### Build Output Structure
```
site/dist/
├── index.html
├── _astro/
│   ├── *.js
│   ├── *.css
│   └── *.map
├── images/
│   └── portfolio/
├── fonts/
└── favicon.svg
```

## GitHub Pages Workflow

File: `.github/workflows/deploy.yml`

### Triggers
- Push to `main` branch
- Push to `lianbeast/shipworm` branch
- Manual workflow dispatch

### Steps
1. Checkout repository
2. Setup Node.js 20
3. Install pnpm
4. Run `pnpm install` in site/
5. Run `pnpm build` in site/
6. Upload site/dist/ as artifact
7. Deploy to gh-pages branch

### Configuration (astro.config.mjs)
```javascript
export default defineConfig({
  site: 'https://lianbeast.github.io',
  base: '/hamna-Henna-Site/',
  outDir: 'dist',
  // ...
})
```

## Local Preview

```bash
henna-deploy preview
# Runs: cd site && pnpm preview
# Serves site/dist/ at http://localhost:4321
```

## Environment Variables

Required for Supabase features (create `site/.env.local`):

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

Build-time variables (in workflow):
- `SUPABASE_URL` - From GitHub secrets
- `SUPABASE_ANON_KEY` - From GitHub secrets

## Troubleshooting

### Build Fails
```bash
# Check TypeScript errors
cd site && pnpm astro check

# Clear cache and rebuild
cd site && rm -rf .astro dist node_modules && pnpm install && pnpm build
```

### Deployment Not Triggering
- Check workflow file: `.github/workflows/deploy.yml`
- Verify branch names match triggers
- Check GitHub Actions tab for run history

### Base Path Issues
- Ensure `base` in astro.config.mjs matches repository name
- All internal links should use absolute paths from base

### Supabase Not Working in Production
- Verify GitHub secrets: SUPABASE_URL, SUPABASE_ANON_KEY
- Check browser console for CORS errors
- Ensure Supabase project allows GitHub Pages domain

## Rollback

```bash
# GitHub Pages: revert commit on main branch
git revert <commit-hash>
git push origin main

# Or manually deploy previous build
# Download artifact from previous successful workflow run
# Push to gh-pages branch directly
```

## Monitoring

- GitHub Actions: Repository → Actions tab
- Live site: https://lianbeast.github.io/hamna-Henna-Site/
- Custom domain: Configure in repository settings → Pages