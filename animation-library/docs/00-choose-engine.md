# Which engine?

| The video is mostly… | Use | Why |
|---|---|---|
| A person talking to the phone | **HyperFrames · `reel-edit`** | Whisper cut stage, captions, layouts (face / corner / split / full MG), tested scripts |
| Typography, numbers, charts, lists, UI mock-ups | **HyperFrames · `motion-video`** | style kits + motion kit, 386 catalog blocks, fast check/snapshot |
| A map (routes, pins, countries) | **HyperFrames · `motion-video` --style map** | offline d3 + topojson world map engine |
| An isometric 3D city or data world | **HyperFrames · `motion-video` --style isometric** | CSS 3D box engine, one continuous camera |
| A website / product / brand | **HyperFrames · `motion-video` --style brand** | `hyperframes capture <url>` grabs real colours, fonts, screenshots |
| Photoreal AI images of real people/places, a voiceover story, a film look | **Remotion · `doc-reel`** | frame-exact cue system tied to the measured voiceover, React scene components, keyed props, synthesized score |
| A mix | both | render each part, `templates/join.sh` (0.4 s crossfades), then `templates/finish.sh` |

Rules of thumb
- Need captions from speech or cutting real footage → HyperFrames (reel-edit owns that pipeline).
- More than ~6 photo scenes with a narrator → Remotion doc-reel.
- Both engines render 30 fps H.264; always finish with `templates/finish.sh` for loudness and colour tags.
- Either way: `TASTE.md` first, script approval first, look at stills before rendering.
