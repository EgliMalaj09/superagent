# 06 — Film look and colour

## The film treatment stack (`src/effects/FilmTreatment.tsx`)

Rides on top of the whole master composition (and on every scene preview). This is what turns
clean AI renders into "archival documentary footage".

| Layer | Spec |
|---|---|
| Scan lines | 1.6 px black lines every 4 px at 16% opacity, multiply, layer opacity 0.5 |
| Grain | SVG `feTurbulence` fractal noise, base frequency 1.6–2.0 re-rolled every frame, overlay at 18%, jittered ±15 px |
| Dust / grunge wash | ~15% of frames (posterized every 4): faint warm radial blotches, screen |
| Corner blur / falloff | radial gradient transparent → 75% black at the corners |
| Vignette | `inset 0 0 350px 60px rgba(0,0,0,0.85)` |
| Gate weave | whole stack jitters ±2 px x, ±1.5 px y, posterized every 2 frames |

Per-scene grading lives in the scenes (CSS `filter` on the `Photo` + blend overlays):
`saturate()`, `contrast(1.08–1.15)`, `brightness()`, warm `overlay` radial, red `multiply`/`screen`.

## Colour arc (sells the story without words)

| Act | Palette | How |
|---|---|---|
| Promise | warm gold, amber, cream | warm radial overlay, saturate 1.15; gold UI (#d4a040) |
| Turn | gold drains into cold red/black | animate saturate↓, brightness↓, red multiply vignette↑ |
| Regime (evidence, money, twist) | red #e21818, black, steel grey, surveillance cyan/green | grayscale portraits once stamped; cyan HUD |
| Payoff | black + blood red + one gold accent (crown/title) | gold title with red glow |

## Typography

- **Anton** (`DISPLAY`) for slams, titles, stamps, numbers. Condensed, heavy, uppercase.
- **Oswald 400/700** (`LABEL`) for bars, names, captions, letter-spaced (4–18 px).
- Both loaded via `@remotion/google-fonts` with the `latin-ext` subset, so ë and ç render.
- Text shadow `0 6px 0 #000` (hard drop) + coloured glow for slams. Captions get `<Shade>` behind.
- Keep captions out of the face: top band (top 180–260) and bottom band (bottom 60–520).

## Colour tokens (`src/fonts.ts`)

`RED = #e21818`, `GOLD = #d4a040`, plus `#f5d58a` (warm highlight), `#fff3d6` (cream text),
`#e8ffe8` (CCTV HUD), `rgba(80,255,210,0.75)` (waveform).
