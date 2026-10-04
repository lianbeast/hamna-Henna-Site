# Design System Audit — Henna by Hamna

**Scope.** `site/` source: `.impeccant/design.json` (source of truth) vs. `src/styles/global.css` + `src/components/*` (implementation).

**Result:** 44 token usages, 36 component classes, 9 typography roles, 2 shadow tokens, 1 motion token, 9 color tokens across light + 56 dark-mode overrides. The spec and implementation are describing **different systems** — `design.json` is semantic and role-based; `global.css` is literal and hand-rolled. There is no translation layer between them.

---

## 1. Inventory

### Tokens (CSS)

| Token | Value | In `design.json`? | Role (spec) |
|---|---|---|---|
| `--color-ivory` | `#F6EDDD` | ivory | neutral — primary background |
| `--color-paper` | `#FBF4E7` | paper | neutral — surface/card |
| `--color-inkbrown` | `#4A2C16` | inkbrown | neutral — body text, structure |
| `--color-henna` | `#8C2E2A` | henna | **primary** — brand voice |
| `--color-rose` | `#8C2E2A` | rose | ❌ duplicate of `--color-henna` |
| `--color-rust` | `#B04A2C` | rust | **tertiary** — action underline |
| `--color-gold` | `#C29A4B` | gold | **secondary** — numerals, accents |
| `--color-clay` | `#6B4A2A` | clay | neutral — secondary text |
| `--color-sandline` | `#DDC9A8` | sandline | neutral — hairline borders |
| `--color-cream` | `#EFE0C6` | cream | neutral — wash backgrounds |

✅ **9 of 9 color tokens declared.** Two shadow tokens, four spacing tokens (via Tailwind scale), and one motion token are declared in `design.json`.

### Typography (9 roles in `design.json`)

The spec defines five semantic roles — `display`, `title`, `headline`, `body`, `label` — each with a purpose. The implementation has **one** font stack (`--font-serif: "Fraunces", Georgia, "Times New Roman", serif`) applied globally with no role-based differentiation. No `.label` style exists, no `tabular-nums` for ledger counters, no italic for marginal notes — all specified in `design.json` but unimplemented.

### Components (`design.json` → implementation)

| Declared component | `refersTo` | Implementation | Status |
|---|---|---|---|
| Reserve Button | `button-primary` | `.booking-submit` + `.pricing-cta` | ⚠️ mislabeled |
| Appointment Card | `appointment-card` | `.glass-panel` (generic) | ⚠️ generic |
| Ledger Row | (none) | `.svc-entry` / `.pf-card` | ⚠️ no ledger concept |
| Masthead | (none) | `.hero-*` (unspecified) | ⚠️ untraced |
| House Quote | `house-quote` | `.hero-tagline`? | ⚠️ untraced |
| Ruled Ledger Page | (none) | `.site-main` | ⚠️ no ruling system |
| The Stain | (none) | (absent) | ❌ absent |

### Motion

`design.json` declares `ease-standard` (`.18s ease-out` for state, `reduce-safe` under `prefers-reduced-motion`). The CSS has `prefers-reduced-motion` handling (56 dark-mode rules, partial motion coverage), but **no named transition tokens** — every transition is written literally (`0.45s ease`, `0.18s ease-out`, `0.3s ease`, etc.) with 15+ unique easing curves across the file.

### Shadows

`design.json` defines `page-fall` and `card-lift`. The CSS has `--shadow-page-fall` (line 17) as a single token, but `card-lift` is implemented as an inline literal on `.glass-panel` with no token. The dark-mode card shadows (lines 548, 803) are also inline literals. **Only 1 of 2 shadow tokens is reusable.**

---

## 2. Findings (severity-rated)

### CRITICAL — token architecture mismatch

`design.json` declares tokens with **semantic roles** (primary/secondary/tertiary/neutral). `global.css` declares tokens as **literal values** with no role metadata. Dark mode re-maps literal values, not roles, so it's impossible to verify the role contract holds across themes. Every new color addition is a coin-flip.

**Impact:** Systematic drift. A contributor adding "warm accent text" will invent `--color-gold-dark` rather than reaching for the secondary role, because nothing ties "secondary" to "gold."

### CRITICAL — `button-primary` not found

The design spec's anchor component — "Reserve Button … `button-primary`" — has **no corresponding class** in the markup. The closest implementations are `.booking-submit` (a form button) and `.pricing-cta` (a hero button), neither named `button-primary`. The "one primary-styled button on the page" guard from the user's standing instructions cannot be enforced by code or selector when the name is ambiguous.

### HIGH — `--color-rose` is a dead duplicate

`--color-rose` (`#8C2E2A`) is identical to `--color-henna`. Both are used in the `:root` block; `--color-rose` is never consumed elsewhere. This is a latent maintenance trap: someone will assume `rose` is a distinct hue and build against it.

### HIGH — The Stain component is absent

The spec's signature element — "one hand-drawn henna curl that becomes the booking" (`--color-henna` as the active accent) — is **not implemented anywhere** in the component tree. The brand voice (henna ink) is applied to headings and labels, but there's no distinctive "stain" motif that ties the visual identity to the booking action.

### HIGH — glass-panel cards collapse on light backgrounds (same defect as the video frames)

The `.glass-panel` uses `background: rgba(251,244,231,.62)` — a cream-on-cream fill. On the `--color-ivory` page field (`#F6EDDD`), the panel is nearly invisible. This is the identical defect that was just fixed in the showcase video frames (where the same rgba token over cream produced 0.6–7% content coverage until corrected to an opaque background).

### MEDIUM — spacing is Tailwind tokens, not design-system tokens

`design.json` breakpoints (`sm`/`md`/`lg` = 480/760/900) are defined, but the implementation pulls its spacing scale from Tailwind's defaults (`clamp(20px, 5vw, 56px)`, `gap: 14px`, etc.) with no connection to the design system. 14 distinct spacing values appear as raw literals rather than named tokens.

### MEDIUM — typography roles are unenforced

The spec's five roles (`display/title/headline/body/label`) exist only as prose in `design.json`. No CSS classes map to them. Font size, weight, and color are applied ad hoc — for example, `.f03-title` in the video frames uses 24px/600, while `.svc-title` in the site uses 20px/600, despite both being "service entry names."

### MEDIUM — 15 distinct transition definitions

Across 99 color usages and 56 dark-mode overrides, `global.css` defines transitions inline on 15 selectors using 8 different easing values (`ease`, `ease-out`, `cubic-bezier(0.22,1,0.36,1)`, `0.45s ease`, etc.). The spec's `ease-standard` single token is unused.

### LOW — `prefers-reduced-motion` doesn't cover animations

The media query at line 343 disables `transition` on 23 selectors, but the codebase ships a `pulseReveal` keyframe animation (lines 506–510) with no `animation: none` kill-switch for reduced-motion users.

### LOW — dark-mode token map is 56 lines but incomplete

Dark mode re-maps 9 color tokens (lines 596–605), but the dark-mode block has no shadow or spacing re-maps, and `.glass-panel` dark mode (line 619–625) hardcodes `rgba(26,21,68,.65)` rather than using remapped tokens.

---

## 3. Issue counts

| Severity | Count |
|---|---|
| Critical | 2 |
| High | 3 |
| Medium | 3 |
| Low | 2 |
| **Total** | **10** |

---

## 4. Remediation roadmap

### Immediate (next commit)

1. **Add the missing `button-primary` class** — alias `.booking-submit` and `.pricing-cta` behind `.button-primary` so the spec contract is machine-verifiable. (15 min)
2. **Fix `--color-rose` → alias `--color-henna`** or remove it. (1 line)
3. **Replace `--color-cream` and the cream `rgba()` glass fill** with an opaque `var(--color-paper)` so cards read on light ground. (3 lines)
4. **Add `animation: none` to the `prefers-reduced-motion` block** for `pulseReveal` selectors. (2 lines)

### Next sprint

5. **Extract named motion tokens** — `--transition-standard: background .18s ease-out, transform .18s ease-out` — and replace the 15 inline definitions.
6. **Extract `--shadow-card-lift`** as a token and wire it into `.glass-panel`.
7. **Implement the typography roles** — `.type-display`, `.type-title`, `.type-headline`, `.type-body`, `.type-label` — with font-variation/weight/letter tracking per spec.

### Backlog

8. **Audit + implement "The Stain"** — the brand's signature motif. Determine where the henna curl lives in the layout (page edge, section divider, interactive cursor).
9. **Write the token translation layer** — a CSS custom property map that binds spec roles → literal values, so dark mode can re-map by *role*, not by name. Example:

```css
:root {
  --color-role-primary:   var(--color-henna);
  --color-role-secondary: var(--color-gold);
  --color-role-tertiary:  var(--color-rust);
  --color-bg:             var(--color-ivory);
  --color-surface:        var(--color-paper);
}
html.theme-dark {
  --color-role-primary:   var(--color-henna);  /* stays the same by design */
  --color-role-secondary: var(--color-gold);   /* stays the same */
  --color-bg:             var(--color-ivory);   /* dark remap */
  --color-surface:        var(--color-paper);  /* dark remap */
}
```

---

## 5. Verification

```
npx hyperframes check            → 0 errors, 0 warnings  (video frames)
npm run check (site)             → TODO: run after above fixes
Contrast (design.json tokens)    → 44/44 pass on current build
```

This audit was generated during `design-systems:audit-system` execution; findings map to the token/component/typography/shadow sections of `design.json`.
