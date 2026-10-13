# Motion principles (both engines)

Working rules distilled from `research/motion-design-2026.md` (trends + sources), the reel-edit skill and the Zoti reel.
`TASTE.md` overrides anything here.

## Easing vocabulary

| Feeling | GSAP | Remotion | Duration |
|---|---|---|---|
| smooth (default entrance) | `power3.out` / `power2.out` | `Easing.out(Easing.cubic)` | 0.3–0.6 s |
| snappy | `power4.out` | `Easing.out(Easing.poly(4))` | 0.2–0.3 s |
| dramatic slam | `expo.out` | `Easing.out(Easing.exp)` / `smashIn` | 0.3–0.5 s |
| bouncy UI | `back.out(1.6–2)` | `Easing.out(Easing.back(1.6))` or `spring()` | 0.35–0.5 s |
| dreamy / camera | `sine.inOut`, `power2.inOut` | `Easing.inOut(Easing.sin)` / `Easing.inOut(Easing.cubic)` | 0.8–1.4 s (luxury) |
| mechanical | `steps(5)` | `posterizeTime(frame, n)` | ticks, glitch |
| constant drift / Ken Burns | `none` | linear `interpolate` | whole shot |

Use at least 3 eases per scene. One hero move at a time; supporting elements stagger 0.06–0.15 s.

## Pacing

- Reading budget: 1–3 words need 2–3 s, 4–10 words 3–4 s, 11–20 words 4–6 s; longer → split. Text finishes entering
  by half of its hold. A scene/beat stays under ~5 s unless one continuous camera move carries it.
- First move 0.1–0.3 s after a scene starts. Something changes every 1.5–3 s in a Reel.
- **Everything keeps moving after it lands**: Ken Burns 1 → 1.03–1.2, boil/breathe, a counter, a drift, a light sweep.
  A still frame for more than a second reads as a bug.
- Sync accents to words: entrances on the name, stamps on the verdict, numbers land as they're spoken; cuts in pauses.

## Layout modes (talking head, from reel-edit)

Face (hook, trust, punchlines) → Corner/PiP (steps, tools) → Split (comparisons) → Full MG (key claim, stat, CTA).
Open on Face 2–4 s; a 30 s Reel ≈ 30–40 % Face, 30–40 % Corner/Split, 25–35 % Full MG; no mode > ~6 s.

## Word → graphic

| Said | Show |
|---|---|
| a number, money, time | count-up with tabular digits, a bar/ring filling, a comparison in everyday units ("266 football pitches") |
| steps / "first, then" | numbered stepper with a drawn connecting line |
| a list | staggered chips/cards, checklist with drawn ticks |
| a person accused/convicted | portrait + name bar + verdict stamp on the verdict word |
| a place / route | map pin + drawn route, camera move |
| a document / leak | dossier card, typewriter, redaction bars wiping in |
| an app, a tool | mock UI: window, typing caret, notifications, cursor click ripple |
| a comparison | split / before-after wipe, two squares to scale |
| the key claim | one huge word per beat, mask reveal, outline echo |
| the ending | the title line, a slow pull-back, fade to black |

## Vague words → concrete specs

- **luxury**: black/ivory + champagne gold, serif italics, `expo`/`power2.inOut` 0.8–1.4 s, light sweeps, gold dust, curtain/mask reveals, soft shimmer.
- **investigative / political**: dark news or vox paper; Oswald caps or Archivo; red accent; stamps, redactions, sources on screen; **no shakes or flashes** (taste).
- **cinematic documentary**: photoreal stills, slow pushes + boil, film grain/scan lines/vignette, colour arc warm → cold red, quiet score.
- **clean / Apple**: off-white, one accent, big sans, blur-in, spring UI, generous space.
- **techy / AI**: mono labels, grids, scan lines, typing, `steps()` glitch, cyan/electric accent.
- **fun**: `back.out(2)`, stickers, emoji, wobble, bright colours.
- **energetic**: 0.15–0.3 s `power4/expo.out`, alternating colour panels, ticks (but still no shakes, per taste).

## The modern look (2026)

Type as the hero (oversized, weight contrast 300 vs 900, outline echo, mask reveals) · texture over gloss (grain,
paper, halftone) · depth (parallax: background 50–70 %, foreground 130–150 % of camera speed; 3D tilt cards) ·
asymmetric layouts, ink `#0B0B0E` / off-white `#F4F1EC` instead of pure black/white, one accent · native phone UI.
Avoid overused fonts (Inter, Roboto, Poppins, Montserrat, Open Sans, Lato) for display type.

## Transitions

Most changes are cuts on a word or soft crossfades (0.35–0.4 s). Save 2–3 designed transitions for energy shifts and
the reveal: wipe, iris, zoom-through, light leak, film burn, cross-zoom. No flash transitions (taste).
