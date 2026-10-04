# Production checks

## Local verification

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm test
pnpm build
pnpm preview --host 127.0.0.1 --port 4322
# In another terminal:
AUDIT_URL=http://127.0.0.1:4322/hamna-Henna-Site/ pnpm run audit
```

Use `pnpm run audit` for the browser checks; `pnpm audit` runs the package vulnerability audit. Browser checks exit nonzero on failure. Node 22.12 or newer is required; tests use Node's TypeScript stripping.

## Before publishing

- Confirm the email, social accounts, service area, availability, and phone in `src/data/site.json`. The current 555 phone is placeholder data; it has been omitted from structured data but still needs replacing in visible contact content.
- Verify testimonial consent/content, package pricing, response-time promises, and supply actual portfolio images. Do not represent placeholders as completed client work.
- Update `site` and `base` in `astro.config.mjs` if changing hosting. Canonical and preview-image URLs derive from these settings.
- The booking form prepares an email; it does **not** deliver or store messages. It offers an email-app link and copy/manual-copy fallbacks. A real submission service requires choosing/configuring a backend and testing delivery, abuse protection, and privacy handling before claiming receipt.
- The social card is `public/social-preview.png`; its editable source is `public/social-preview.svg`. Regenerate the PNG if the source changes.
- Google Fonts are fetched externally. Consider self-hosting licensed font files if offline resilience or privacy requirements warrant it.

No deployment or real email submission is performed by the tests.
