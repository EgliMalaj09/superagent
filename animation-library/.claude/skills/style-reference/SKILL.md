---
name: style-reference
description: Turn a reference the user gives (a video clip, screenshots, GIFs, a Behance/Dribbble/Motionographer/Pinterest/Instagram link) into a reusable style card (references/<name>/STYLE.md + reference.css) that motion-video, doc-reel and reel-edit can apply. Use when the user says "use this as a reference", "make it look like this", "copy this style", or later "use the <name> style".
---

# Style reference

1. **Collect** into `references/<name>/`: the clip or images. Links: open them with the browser tools and screenshot
   3–6 key frames; anything behind a login, the user downloads. Never re-publish someone else's footage; we only
   extract the style.
2. **Contact sheet** (1 frame per second, max ~24 tiles):
   `ffmpeg -i ref.mp4 -vf "fps=1,scale=360:-1,tile=6x4" -frames:v 1 references/<name>/sheet.png`
   Read the sheet (one image instead of many frames).
3. **Write `references/<name>/STYLE.md`:**
   - palette (5–7 hex: background, ink, accent, highlight, secondary) + texture (grain, paper, halftone, scan lines)
   - fonts: what it looks like + the closest free font with Albanian ë/ç from `library/fonts/` or Google Fonts (latin-ext)
   - type scale and habits (caps? weight contrast? outline echo? italics?)
   - layout habits (centred/asymmetric, margins, cards, photo treatment, safe areas)
   - motion verbs (slam, slide, mask reveal, glitch, typewriter, count, draw…) with eases and durations
   - transitions (hard cuts on words, wipes, iris, zoom-through, crossfades) and pace (changes every N s)
   - sound character (bed, hits)
   - "Don't copy": logos, characters, footage, exact layouts that would read as theirs
   - conflicts with `TASTE.md` (e.g. the reference shakes the screen → we won't), resolved in favour of TASTE.md
4. **Write `references/<name>/reference.css`**: `:root` tokens in the kit format (`--bg --ink --mute --accent --hi --red
   --card --head --headw --track --body --quote --bgfx --shadow --radius`) + any small classes. `new_project.py
   --reference references/<name>` copies it into the project; `build_page.py` loads it last so it wins.
5. **Show** a 5-line summary + one test frame (a `_test` project rendered with the card), then use it.
   Later: "use the <name> style" → read STYLE.md first.

Best places to find references: `research/motion-design-2026.md` §4 (Behance motion, Dribbble animation,
Motionographer, Pinterest video pins) and the HyperFrames catalog previews (`npx hyperframes catalog --json`).
