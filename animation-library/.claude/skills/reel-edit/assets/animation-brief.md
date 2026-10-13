# Animation brief: <section name>  (<t_in>–<t_out> s, <words spoken>)

**Ask (user's words):** "<exactly what they said>"
**Intent:** what the viewer must feel and understand in one sentence (e.g. "this is effortless and premium").
**Style:** <reference style card, or the Reel's look> · accent <hex> · fonts <display / label>

## Frame
- **Layout mode:** Face / Corner (`pip-*`, `bubble-*`) / Split / Full MG · where the speaker sits · free area for graphics
- **Composition:** hero element + its size and position · supporting elements · empty space kept on purpose
- **Safe area:** x 60..940, y 230..1460; nothing on the face

## Choreography (beat by beat, locked to word times)
| t | element | move (from → to) | ease · duration | why |
|---|---|---|---|---|
| <t> | <hero> | <e.g. mask reveal from below, scale 1.12 → 1> | expo.out · 0.8 s | lands on "<word>" |
| ... | | | | |
- **Entrance → hold → exit:** the entrance is done by 50 % of the hold; something keeps moving while it holds (breathe, drift, counter, light sweep); the exit or cut lands on the next word
- **Hierarchy:** 1 hero move at a time; supporting elements follow with a 0.06 to 0.15 s stagger
- **Easing mix:** at least 3 eases (e.g. expo.out for the hero, power2.inOut for the camera, back.out(1.6) for small UI)

## Details that make it premium
- Depth: <parallax layers / 3D tilt / blur at the back>
- Texture & light: <grain, light sweep, glow, shadows>
- Type: <weight contrast, outline echo, italics, letter-by-letter or word-by-word>
- Micro-motion: <cursor, ripple, counter, check draw, particles (seeded)>

## Sound
| t | sound | volume | cause on screen |
|---|---|---|---|

## In / out
- **Transition in:** <hard cut on word / wipe / iris / curtain>, **out:** <...>
- Captions: hidden while this graphic shows the words? yes/no

## Build notes
- Catalog pieces to adapt: `npx hyperframes catalog <word>` → <names>
- Assets needed: <frame from the video, logo, screenshot>
- Risks: <burned-in text to cover, fast cuts, contrast>
