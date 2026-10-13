# Docs index

| File | Read it when |
|---|---|
| `00-choose-engine.md` | unsure whether a request is HyperFrames or Remotion |
| **doc-reel/** (Remotion + AI images) | |
| `doc-reel/01-pipeline.md` | planning a documentary reel end to end |
| `doc-reel/02-story-and-script.md` | writing the Albanian script, fact discipline, verdict wording |
| `doc-reel/03-voiceover.md` | giving the ElevenLabs prompt, measuring pauses |
| `doc-reel/04-image-prompts.md` | writing image prompts (master style, hero shots, cast formula, props, QA) |
| `doc-reel/05-motion-techniques.md` | choosing/building scene animations in Remotion |
| `doc-reel/06-film-look-and-color.md` | film treatment, colour arc, type |
| `doc-reel/07-sound-design.md` | music bed, SFX, levels |
| `doc-reel/08-remotion-engineering.md` | timing system, keyed images, stills, gotchas |
| `doc-reel/09-lessons-learned.md` | what the user liked/rejected on the Zoti reel |
| **hyperframes/** (HTML + GSAP) | |
| `hyperframes/engine.md` | building with build_page.py, the motion kit API, engines, traps |
| `hyperframes/style-kits.md` | picking a style kit and its tokens |
| **craft/** (both engines) | |
| `craft/motion-principles.md` | easing, pacing, layout modes, word → graphic, vague words → specs |
| `craft/platforms-and-delivery.md` | sizes, safe zones, lengths, loudness, encoding, upload |
| `craft/gsap-cheatsheet.md` | GSAP 3.14 eases, tweens, plugins, seek-safe patterns |
| `craft/remotion-cheatsheet.md` | Remotion 4.0.532 APIs, 20 built-in transitions, captions/shapes/audio packages |
| `craft/resources.md` | free fonts, music, SFX, stock, AI tools, data sources, inspiration |
| `../references/photo-parallax/STYLE.md` | a hook where an old photo splits into 3 layers and the camera dives through it |
| `craft/albanian.md` | diacritics, number format, verdict/stamp vocabulary, Whisper tips |
| `../research/motion-design-2026.md` | the trend research and its sources |

## Examples (`examples/`)

| Example | Engine | What to copy from it |
|---|---|---|
| `zoti-i-shqiperise/` | Remotion | the full doc-reel: timing system, portrait wall, money montage, surveillance room, coronation, keyed props |
| `tirana-one/` | HyperFrames | one continuous isometric camera move through a whole data story (63 s) |
| `tirana-hook/` | HyperFrames | a hook built on the isometric engine + helpers |
| `tirana-design/` | HyperFrames | the model SCRIPT.md with fact-check and "not used, on purpose" |
| `zvernec/` | HyperFrames | multi-part dark news documentary, map scene, storyboards v3 · `MAKING-OF.md` + contact sheet of the final |
| `tirana-ndalon/` | HyperFrames | opinion reel on the user's VO: match-cut map opening → isometric 3D dusk city (final + 3 variants) · `MAKING-OF.md` + contact sheet |
| `cyberoz/` | HyperFrames | 4:5 marketing video from a website's real brand assets |
| `lux-test/` | HyperFrames | luxury look, assembly + render verification reports |
| `style-tests/<kit>/` | HyperFrames | a minimal working scene for each of the 7 style kits |

The HyperFrames examples are sources to copy from (finished projects keep only sources + MAKING-OF + a contact sheet; full videos are not kept). The Claude story lives in `~/Desktop/claude-sequences`; some reference shared folders that lived next to them originally.
