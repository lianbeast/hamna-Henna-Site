---
format: 1920x1080
duration: 60s
message: "An immersive 3D henna portfolio — artistry, craft, and the mandala come alive"
arc: Hook → Tour → Services → Portfolio → Process → Social Proof → CTA
audience: art buyers, prospective clients, the artist's own portfolio viewers
language: en
mode: autonomous
angle: artistry
music: none
---

## Intent

Show-it-as-is tour of hamna-Henna-Site. No narration — the site's own visuals and motion
carry the argument: the animated mandala, the 3D scene, the glassmorphism cards, the scroll
stagger, the dark-mode indigo. The video is a guided look at the work, not an invented story.
Tone is calm and reverent — the craft is the claim.

## Assets

- `capture/screenshots/scroll-*.png` — captured viewport rasters of the painted page, used as backdrop plates (the 3D canvas was not crawlable, so the dark-mode scene look comes from HennaScene.tsx theme colors + the captured painted layer).
- `capture/screenshot/splash-mandala` — reconstructed from the inline SVG in `site/src/layouts/Layout.astro` (12-petal outer ring #b48232, 8-petal middle #a0522d, dot ring #c87533, center dot #b48232).
- `assets/portfolio/*.svg` — the six featured portfolio SVGs staged for Frame 4.
- brand tokens from `capture/extracted/tokens.json`: ink #3B2118, canvas #EFE3CF, green #1F5145, gold #C6A15B.

## Customizations

- Show-it-as-is: captured screens are the featured assets; no page rebuild, no invented route.
- Silent: `music: none`, no SCRIPT.md — no narration, no BGM, no SFX.

## Video direction

Silent, reverent pacing — held beats where stillness earns it (Per Step-4 rule: a held
frame that lets the gallery breathe is legitimate; front-loading everything then freezing
is not). All reveals pace to the implicit beat of each section's own motion. Background
ground is the frame.md `pink-deep` (#1F5145) wash at 12% under cream-canvas sections,
switching to `ink` (#3B2118) for the dark-mode CTA outro.

---

## Frame 1 — Hook (splash)

- scene: animated henna mandala spins into view over cream, brand name builds beneath it
- duration: 8s
- transition_in: cut
- status: outline
- src: compositions/frames/01-splash.html
- type: branding
- persuasion: brand-stakes
- beat: signature-open
- blueprint: logo-assemble-lockup (Reproduce)
- focal: capture/splash-mandala (reconstructed inline SVG)
- roles: mandala = hero · title = hero · sub-title = supporting
- asset_candidates: splash-mandala.svg (reconstructed), scroll-000.png (as texture base)

Reproduce the `logo-assemble-lockup` blueprint: the mandala draws its outer ring sweep first
(on the 6s linear spin inherited from the site's splashSpin), then the petal rings assemble
petal-by-petal from zero in a staggered cascade, the center dot blooms, and the wordmark
"Henna by Hamna" + sub "The Craft Book" fade up beneath. Signature move: the outer-ring
stroke-dash sweep that *is* the mandala drawing itself.

Scene 1 (0.0–1.2s): solid cream canvas (#EFE3CF); the outer ring of the mandala draws itself
via stroke-dashoffset (12 petals, 400ms stagger) — Centered template, ~50% of frame. Subtle
pulse under the spin.
Scene 2 (1.2–3.8s): middle petal ring (8 petals) assembles with a spring-pop on each, dot
ring clusters in, inner teardrop fades; the brand wordmark "Henna by Hamna" lifts from
below on a slow ease — Asymmetric 60/40, 3 depth layers (canvas / ring / wordmark).
Scene 3 (3.8–8.0s): sub-title "The Craft Book" fades in beneath; the full mandala holds
in slow rotation (inherited site animation speed), a held beat that lets the brand land.
Stillness reads — no further motion, the rotation itself is the only life.

---

## Frame 2 — 3D scene reveal

- scene: the interactive henna scene comes alive — mandala rings, paisley form, mouse-reactive camera
- duration: 6s
- transition_in: crossfade
- status: outline
- type: product_intro
- src: compositions/frames/02-scene.html
- persuasion: value-before-evidence
- beat: hero-canvas
- blueprint: device-surface-showcase (Adapt)
- focal: capture/screenshots/scroll-000.png (the painted hero, with 3D scene look layered over)
- roles: scene-backdrop = ground · hero-title = hero · eyebrow = supporting
- asset_candidates: scroll-000.png (hero painted frame), scroll-008.png (gallery detail)

Adapt `device-surface-showcase` for a 3D canvas: the camera is the storyteller. The painted
hero plate (cream + floating text) is the ground; the 3D scene's indigo palette
(#0f0c29 bg, #6c5ce7 points, #a29bfe forms, #fdcb6e rings) layers on top as a live viewport
fade. Signature move: the **camera dive-through** — a slow decelerating push into the scene
that reveals the floating mandala rings and paisley form come into view.

Scene 1 (0.0–1.0s): cream ground holds the painted hero tile at 40% opacity as texture;
the 3D viewport fades in over it from 0 — a clean wipe of color into form.
Scene 2 (1.0–3.5s): the camera dives THROUGH (blueprint signature) into the scene —
floating mandala rings materialize on their orbits (#a29bfe + #fdcb6e), the paisley form
coalesces center-frame. Mouse-reactive parallax implied in the camera arc.
Scene 3 (3.5–6.0s): widen to show the full floating-particle field; the hero title
"Henna by Hamna / The Craft Book" lifts onto a cream card above — held still, reading
against the scene. Particles breathe faintly only.

---

## Frame 3 — Services

- scene: four service cards fan in along a henna vine motif
- duration: 9s
- transition_in: crossfade
- status: outline
- type: feature_showcase
- persuasion: feature-benefit
- beat: service-grid
- src: compositions/frames/03-services.html
- blueprint: grid-card-assemble (Reproduce)
- focal: capture/screenshots/scroll-023.png
- roles: cards = hero · label = supporting · backdrop = background (dim ~30%)
- asset_candidates: scroll-023.png

Reproduce `grid-card-assemble`: the four services (Bridal, Bridal Party, Engagement & Sangeet,
Natural/Organic) self-assemble in a staggered cascade. Signature move: the
**staggered cascade + accent number pop** — each card slides from the lower-left along a
subtle curved path (a henna vine arc) as its counter-number (#01–#04) spring-pops, then the
title and desc fade in trailing each card.

Scene 1 (0.0–1.2s): section label "The Services" (great-vibes script accent) lifts from
below, "Four ways Hamna's hand works." builds beneath it — Centered, cream ground.
Scene 2 (1.2–4.6s): cards cascade in along the vine arc (320ms stagger): card 01 at 1.4s
(spring-pop counter), 02 at 1.7s, 03 at 2.0s, 04 at 2.3s; title + desc trailing each on a
160ms delay. Accent gold (#C6A15B) on the counters, ink (#3B2118) on text.
Scene 3 (4.6–9.0s): the cards settle into a 2×2 grid; the counter numbers hold. A subtle
golden rule line draws under the row — stillness reads, the arrangement is the payoff.

---

## Frame 4 — Portfolio

- scene: six henna portfolio pieces grid-assemble, each labelled with its occasion
- duration: 10s
- transition_in: crossfade
- status: outline
type: benefit_highlight
- persuasion: social-truth
- beat: gallery-grid
- src: compositions/frames/04-portfolio.html
- blueprint: grid-card-assemble (Adapt)
- focal: assets/paisley-1.svg · assets/peacock-1.svg · assets/mandala-1.svg · assets/bridal-hand-1.svg · assets/floral-1.svg · assets/vine-1.svg
- roles: gallery-cards = hero · occasion-label = supporting · backdrop = background (dim ~25%)
- asset_candidates: assets/*.svg (the six staged portfolio SVGs)

Adapt `grid-card-assemble` from data cards to henna art: the six SVGs assemble in a 3×2 grid,
each with its occasion label. Signature move: **elements reveal one-by-one in reading order** —
the count-down on each piece's reveal is the henna stain "deepening" (a warm #8C2E2A→#3B2118
tone shift via a subtle inner-glow) as its label types in.

Scene 1 (0.0–1.4s): "Recent hands, recent days." builds from center in Cormorant 500 —
cream-on-ink ground.
Scene 2 (1.4–6.8s): the six SVGs assemble in reading-order cascade (300ms stagger):
paisley-1 (Bridal), mandala-1 (Engagement), peacock-1 (Bridal mehndi), bridal-hand-1
(Full hand glove), floral-1 (Lotus bloom), vine-1 (Climbing vine). On each reveal the
stain deepens (warm glow → rich brown) and the occasion label fades up beneath in
small great-vibes script.
Scene 3 (6.8–10.0s): the full gallery holds in a 3×2 grid, held beat — let the work
breathe. The grid is the payoff, no forced camera drift.

---

## Frame 5 — Process

- scene: the four-step process — a single henna line draws itself as the steps number through
- duration: 9s
- transition_in: crossfade
- status: outline
- type: branding
- persuasion: trust
- beat: step-process
- src: compositions/frames/05-process.html
- blueprint: spatial-pan-stations (Adapt)
- focal: capture/screenshots/scroll-055.png
- roles: step-cards = hero · drawing-line = hero · backdrop = background (dim ~20%)
- asset_candidates: scroll-055.png; henna-line.svg (reconstructed from theme #8C2E2A)

Adapt `spatial-pan-stations` from a pan across milestones to a **single drawn line that travels
through four process stages**. The backbone is one continuous henna line (ink #3B2118) that
draws itself pen-on-paper as the camera follows. Signature move: **the line draws + the
station resolves under it** — each station (Inquiry → Confirmation → Design → Day-of) lights
up as the pen passes its marker.

Scene 1 (0.0–1.0s): cream ground; the four step cards sit in a horizontal row, dimmed;
"From the first note to the last line." fades in from center.
Scene 2 (1.0–7.4s): the henna line begins at the left (Inquiry, #01, gold accent #C6A15B
pops) and draws rightward, 320ms per station; as the pen passes each card, that card's
title lifts and its body fades in, the background washes to a soft indigo (#1F5145 @ 8%).
The line reaches "Day-of" (#04) at 6.6s.
Scene 3 (7.4–9.0s): the completed line holds; all four cards lit. A held beat on the
promise of the craft. Stillness.

---

## Frame 6 — Social proof

- scene: two client testimonials cycle against a henna-detail backdrop
- duration: 8s
- transition_in: crossfade
- status: outline
- type: social_proof
- persuasion: evidence
- beat: quote-relay
- src: compositions/frames/06-testimonials.html
- blueprint: comparison-split (Adapt)
- focal: scroll-039.png (or a portfolio detail)
- roles: quote = hero · name = supporting · backdrop = background
- asset_candidates: scroll-039.png (gallery/detail)

Adapt `comparison-split` from A/B product to a **quote relay**: two testimonials sit in
mirror positions, the active one blooms forward while the other recedes. Signature move:
**mirrored 3D "book-open" tilt** on the active quote card as it transitions to the next.

Scene 1 (0.0–1.0s): backdrop is a blurred henna-detail (bridal hand macro from the
portfolio SVGs); two quote cards in mirrored positions, both at opacity 0.
Scene 2 (1.0–4.8s): Card 1 blooms forward (tilt 0→5°, spring): "Hamna drew my bridal
set the morning of the wedding…" — Ayesha R., Bridal · Richmond, VA. At 4.0s a soft
blur-snap flip to Card 2 (Priya S., Bridal party · Washington, DC): "We had six
bridesmaids… our hands together are my favorite." — mirrored tilt the other way.
Scene 3 (4.8–8.0s): the active card holds centered; a small ring counter (#01 · #02)
underneath in gold. Held beat.

---

## Frame 7 — CTA / Outro

- scene: a single primary CTA button blooms, form field accents, brand fades to indigo
- duration: 8s
- transition_in: crossfade
- status: outline
- type: cta
- persuasion: action
- beat: book-it
- src: compositions/frames/07-cta.html
- blueprint: cta-morph-press (Reproduce)
- focal: capture/screenshots/scroll-078.png or scroll-086.png (the contact section)
- roles: cta-button = hero · contact-lines = supporting · backdrop = background
- asset_candidates: scroll-078.png

Reproduce `cta-morph-press`: a resting brand wordmark condenses at center into a brighter
CTA ("Book Your Date"), then a cursor lands a human-aimed click. Signature move: **the
pill→CTA condensation + click press** — the "Henna by Hamna" wordmark shrinks slightly and
solidifies into a gold-ink CTA pill, a cursor (the site's own pointer) clicks, feedback
ripple blooms.

Scene 1 (0.0–2.2s): indigo ground (#123C35 from tokens) fades up from cream; the brand
wordmark sits center at rest.
Scene 2 (2.2–5.0s): the wordmark condenses in place (scale 1→0.88, gold fill #C6A15B
grows), resolving to a CTA pill "Book Your Date" — Centered, one primary button by design.
Scene 3 (5.0–8.0s): a cursor arrow lands the click; a ripple blooms outward (gold →
transparent); contact lines (email, phone) fade up beneath in small great-vibes. HELD
still — the call to action reads.
