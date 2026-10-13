# Zvërnec — how it was made (training reference)

**Result:** 186.7 s (3:07) · 9:16 · Albanian voice-over · multi-part political documentary · HyperFrames. Final = v6.
The full videos (v4–v6) were removed to save space; `contact-sheet-v6.jpg` (18 frames across the film) shows the final look.
Reconstructed from the project files and the user's taste notes (made in earlier sessions).

## Files
`STORYBOARDS-v3.md` — the same voice-over designed in 4 styles (A 3D map journey, B archive collage, …) to choose from ·
`src/` — one HTML/JS page per part (A, B, C, P2…P8, clip) · `map-scene-B.js` — the map scene · `build.py` — builds the parts.

## Structure
8 parts on one voice-over: the 2022 Jerusalem speech (2 clips as "PROVA 1/2, 2/2") → Orikumi & Hecataeus (2,500+ years) →
Ana Kohen's "90% / 10%" claim vs. the facts → the museum request → Rabbi Pinto visit + Jerusalem Post quote → Vlora & the
flag → Kushner / Zvërnec project / ICC → meeting, emigration, KLSH → water, rail, Rama quote → "Shqipëria shqiptarëve!".

## Strongest points
1. **The dark news kinetic style** the user loves for political/investigative work: black + red, Oswald caps, word slams,
   red bottom bar with the part name ("FJALIMI · FAKTI · DEKLARATA · VIZITA · PROJEKTI"), red-framed video cards.
2. **Claim → evidence** rhythm: every statement shown on its clip, then the fact with its source on screen (Hecataeus, census,
   The Jerusalem Post, ICC, INSTAT, KLSH, bosja.al).
3. Clips as framed "evidence" cards with a date chip (• 2022 · JERUSALEM) — documentary credibility.
4. Storyboarding one VO in 4 styles first let the user choose the direction before any build.

## Rules learned here (now in TASTE.md)
- No screen shakes; no red/white flashes — soft fades/slides and 0.35 s crossfades instead.
- No sound effects on text/slide entrances, no stamp/boom hits on red text; one continuous bed under the voice.
- Criticise decisions and public figures with evidence; sources on screen; never target a people or religion.
