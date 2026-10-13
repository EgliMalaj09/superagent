# Your taste (read before every brief, script and build; overrides every default in this repo)

Shareable summary for other projects: `CREATOR-PROFILE.md`.

Saved automatically from your reactions. One rule per line, newest wins. When a new rule contradicts an old one,
replace the old one (don't keep both).

## Love
- Vox-style explainer look for documentary/political videos: paper texture, ink text, yellow highlighter, photos as white-bordered prints, serif quotes (2026-10-07, zvernec-full-2).
- Investigative/political videos: the dark news kinetic style (black + red, Oswald caps, word slams, glitch, red bottom bar) over the dossier or map styles (2026-10-06, zvernec p1; red flashes removed by the 2026-10-07 rule below).
- AI-image cinematic documentary (doc-reel): photoreal AI stills brought to life with slow pushes and boil, a portrait wall with verdict stamps over the eyes, a split face (warm/red), a money montage, a surveillance room (CCTV HUD, waveform), a throne/crown payoff, film grain + scan lines + vignette (2026-10-05, Zoti i Shqipërisë).
- A general "pattern" story (one person, years of cases) over a single case; one strong title concept repeated as cold open and final line ("Zoti i Shqipërisë") (2026-10-04, Zoti).
- Graphics-heavy edits: the speaker on camera for the first ~3 s, then motion design covers most of what is said (2026-10-06, mg-reel + lux-test).
- Luxury direction (black + champagne gold, serif italics, slow moves, light sweeps) is worth trying (once) (2026-10-06, lux-test).
- Isometric 3D dusk city with queued cars, red traffic strips, a glowing green bus lane: liked for the Tirana traffic reel (2026-10-09, tirana-iso3d). Did NOT like its opening (flat screenshot tilting up into 3D with buildings popping out of it).
- Openings with a screenshot: a match cut beats a phone-on-dashboard POV. Liked: full-screen map + rain → dive into a red traffic line → cut to a row of brake lights in the 3D city (2026-10-09, tirana-iso3d-b).
- Isometric 3D is a favourite, but a whole video in only isometric feels like too much: mix it with other styles by purpose (isometric for story/world, flat kinetic type for numbers, simple charts for comparisons) (2026-10-10, tirana-shtepia).
- Housing reel (tirana-shtepia) FINAL: mixed system (isometric night world + frosted-glass number cards + bars to scale) with the premium finish (shadows, warm interior light, haze, DOF, champagne gold, grade + grain, 60 fps, slower eases, Instrument Serif italic for human lines, living city, furniture filling the flat). Rejected on the way: chrome & glass for the whole video, the 3-layer photo-parallax opening, a spinning-key opening (2026-10-11).
- Hooks must hit hard: show the payoff immediately (a whole life in fast-forward in 3 s, then rewind). When unsure, pace ~10% faster (2026-10-11).
- Product ads: one selling point per ad, shown by repetition (many different ATMs → same 0,00 ALL fee); use the brand's real logo/card/colours/font (2026-10-13, epara-atm).
- Social-media UI gags tracked onto real objects in AI/skit reels (e.g. an Instagram LIVE pill + floating hearts + a soaring viewer count coming out of a phone) — liked on the alma plane reel (2026-10-09).

- Spider-Verse comic look for character skits: ink outlines, flat cel tones, halftone dots as light, hatched cast shadows, magenta/cyan misregistration, character on twos, yellow comic captions + onomatopoeia — "this is really good" (2026-10-09, a-day-in-claude scene 1 v5).

## Avoid
- Screen shakes: none (2026-10-07, zvernec; confirmed 2026-10-08 on the Zoti reel).
- Red or white flashes between or on screens: none. Use soft fades/slides (0.3–0.45 s, power3.out) and 0.35 s crossfades between parts (2026-10-07, zvernec; confirmed 2026-10-08, Zoti).
- Sound effects on text or slide entrances: none. Only real stamps / the ending get a sound; one continuous music bed under the whole film (2026-10-07, zvernec-full-2).
- No stamp / boom / hit sounds when red text appears either — a hit every few seconds is disturbing. Default to zero hit SFX; the voice and one continuous bed carry the film (2026-10-08, zvernec-FULL-v3).
- Loud sound effects over the voice ("really interfering") (2026-10-05, Zoti).
- A crown falling from the top of the frame; a gold god-ray + flash cut as a coronation transition (2026-10-05, Zoti).
- Outros/close-ups that repeat the punchline after the title lands (removed "Shpërndaje. Mos hesht." and the crown-text close-up) (2026-10-05, Zoti).

- Ambience beds under scenes (café murmur, crowd noise): none — keep only the music bed + the actual sound effects (2026-10-09, a-day-in-claude).

## Defaults
- HARD RULE when a project is finished: remove all stand-alone clips and intermediates (scene renders, public/, snapshots, raw MP4s, sound.wav, test renders); keep ONLY the final result (MP4 + cover), the sources, and a MAKING-OF.md (how it was made, strongest points, best practices, what the user changed). Move to the macOS Trash, never rm (2026-10-09).
- The Claude story lives in ~/Desktop/claude-sequences (its own kit, cast, sound engine, episodes) — work on Claude episodes there, not here (2026-10-09).
- Voice-over always on top: music bed ~15 dB under the voice (bed volume ~0.07 when VO is 1.0), sound effects very quiet (≤0.1) and only a few (2026-10-07, tirana-iso).
- Talk to me in English; everything spoken or written on screen in the video's language (usually Albanian) (2026-10-04, Zoti).
- Before any animation: show the script (roughly what is said/shown, scene by scene) and wait for approval. Data videos get their numbers + sources checked first (2026-10-06, tirana-iso).
- A good voiceover of 60–80 s is fine for an exposé: add visual beats rather than cutting audio (2026-10-04, Zoti).
- I generate images and voice myself: give me exact prompts and exact filenames; put the files I paste into the project yourself (2026-10-04, Zoti).
- LinkedIn videos: 4:5 (1080x1350) for the mobile feed. Product/marketing videos: English, text on screen + sound effects (voice-over maybe later), no invented numbers or claims (2026-10-06, cyberoz).
- Finished videos go to `results/` in the project root (2026-10-06).
- Albanian Reels, 9:16, free tools only, keep tokens low.
- Hooks: open with the viewer's own question, word for word ("Sa vjet i duhen një çifti në Tiranë për…?"), then hit with the answer in the same breath (2026-10-10, tirana-shtepia).
- Data reels: keep the information (≈1 min is fine), but never a list of numbers in a row. One number per beat, each turned into a picture (a doormat, a bathroom, an age), with a breath/visual between them; extra numbers small on screen only (2026-10-10, tirana-shtepia).
- When I bring my own script (opinion piece): never fact-check or double-check its numbers/claims. Wording suggestions for flow and hook ARE welcome (2026-10-09, tirana-trafiku).
