---
workflow: product-launch-video
flow: automation
storyboard: no
message: "An immersive 3D henna portfolio — artistry, craft, and the mandala come alive"
destination: youtube
aspect: 1920x1080
language: en
length: 60s
angle: artistry
---

## Intent

A site tour / showcase of hamna-Henna-Site, the immersive 3D portfolio for a henna
artist. The video walks the viewer through the site's own experience — the animated
splash with its henna mandala, the interactive 3D scene, the dark-mode neon
wireframe world, the Web Audio tanpura toggle, the scroll-driven reveals, and the
glassmorphism depth cards. No narration, no music: the site's ambient audio and
motion carry it. Tone is calm, deliberate, and visually led — the artistry is the
argument, not a voiceover.

## Assets

- site/ — the source website (Astro + React Three Fiber). Captured screens become the video's visual source of truth; the site's own 3D render, dark-mode UI, and splash animation are the assets, not invented visuals.

## Customizations

- Show-it-as-is: captured screens are the featured assets; no rebuilt page, no invented route.
- Silent: `music: none`, no SCRIPT.md — no narration, no BGM, no SFX.

## Notes

- Audience: art buyers, prospective clients, the artist's own portfolio viewers.
- 60s, 16:9 (YouTube/embed).
- Preserve the site's own motion language (mandala rotation, scroll-driven pull-back, glass cards) rather than imposing a separate motion system.