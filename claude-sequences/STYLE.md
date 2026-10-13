# Style, motion, sound — and the kit API

## The look (comic, Spider-Verse-inspired; research in `research/spiderverse-style.md`)
- **Front views** like a stage set (rooms seen straight on, floor in perspective). 9:16, 1080×1920.
- **Ink outlines** (`class="ink"`, #1D1530, 5 px) on every shape; **2–3 flat tones** per object (top / front / side).
- **Halftone = light and shade:** `url(#dotsD)` on shadow sides, `url(#dotsS)` paper screen everywhere, `url(#dotsL)` on shines.
- **Hatching** for cast shadows on walls (`url(#hatch)`); contact shadows (dark ellipses ~25% opacity) under everything
  standing on a floor — furniture must touch the floor line (the user noticed "floating" furniture).
- **Misregistration** on the whole SVG (magenta/cyan 3 px ghosts) — automatic via comic.css.
- **Comic type:** sound words (`boom()`, yellow fill, black stroke, pink offset shadow, slight rotation); yellow time captions
  (`caption('7:00 AM · rise and shine', t)`); white speech bubbles with tails (`bubble()`); the important bubble glows (`.hot`).
- Palette: ink #1D1530 · Claude #F5873A / top #FFAA6B / side #D9612B · caption yellow #FFE14D · pink #FF6FAE / #FF3D7F ·
  lavender walls #DCDDF6 · night = multiply #1B2466 at ~0.45 · sunset = purple→coral→gold.

## Motion
- **Characters on twos** (`ease: 'steps(N)'`, N ≈ seconds × 12) — the comic feel. **Camera smooth** (`power2.inOut`).
- Squash & stretch: anticipation squash → stretched jump → land squash (`hop()`).
- Scale characters around their **feet** (`transformOrigin: '50% 100%'`) or they float.
- Never change `svgOrigin` inside a tween that also moves x/y (GSAP re-offsets) — set origins once with `gsap.set`.
- Draw order = depth: anything held "in front" (cup, toast) must be drawn after the character.
- Rooms change with 0.35 s crossfades; one long camera move inside a room is better than cuts.
- Close-up → pull-back openings work (the alarm clock). Big reveals: freeze 0.3–0.5 s, then the biggest move.
- No screen shakes, no flashes (a camera "flash" is at most a 0.2-opacity soft white).

## Sound (`library/sound/kit.py`)
- One lo-fi bed (`bed()`, 84 bpm, keys + bass + soft drums + vinyl) at ~0.30, swells at the big moment, quiet at night.
- Every visible action gets its sound on the frame (alarm, crunch, gulp, clank, stomps…); **no ambience beds**.
- Finish at −14 LUFS (`tools/finish.sh`, called by `join.py`).

## Kit API (`library/engines/comic.js`) — loaded with `"style": "comic", "engines": ["comic"]`
| | |
|---|---|
| setup | `comicDefs()` first · `comicFinish('#world')` last (paper screen + vignette) · `mk(tag, attrs, parent)` · `A({...})` adds ink stroke |
| type | `boom(txt, t, t2, css)` · `caption(txt, t, t2)` · `bubble(html, x, y, t, t2, 'tl'|'tr', css)` · `popIn(el, t, t2)` · `stickyNote(lines, x, y, w, sticker)` · `NOTE_LINES` |
| cast | `claude(parent, id)` (feet at 0,0; parts `#idL0-3 #idB #idE #idS #idQ #idAL #idAR`) · `claudeBack(parent, id)` · `person(parent, x, y, s, {body, head, hair, glasses, ponytail, cap, moustache, coat, goggles})` · `ana()` `barista()` `conductor()` `scientist()` `extra(parent, x, y, s, i)` |
| props | `flamingo(parent, x, y, s)` · `claw(parent, id)` + `openClaw(id, t)` / `closeClaw(id, t)` |
| moves | `walk(id, t, d, {x, y, scale})` · `hop(id, t, toY)` · `blink` · `lookAround` · `surprised` · `happy` · `eyesNormal` · `sleepy(id, t, on)` · `lemonFace(id, t, d)` · `typing(id, t, d)` · `shrug` |
| camera | `camSet(sel, x, y, scale, t)` · `camTo(sel, x, y, scale, t, d, ease)` (centres world point x,y) · `crossfade(a, b, t)` · `twos(d)` |
Base helpers from motion.js are also there: `up fadeIn pop slideIn blurIn words out fadeOut count typeIn draw kenBurns drift xfade remap rnd`.
