# 05 — Motion techniques catalogue

Everything here exists as code in `remotion/template/src` (helpers and components) and is used in
`examples/zoti-i-shqiperise/src/scenes`. The principle: **static AI photos only feel alive if
something is always moving**, slightly and constantly, with big accents on the words.

## Building blocks (`src/motion/helpers.ts`)

| Helper | What it does | Typical values / where used |
|---|---|---|
| `posterizeTime(frame, step)` | quantizes time so motion ticks in steps (stop-motion feel) | step 2–3; used inside boil, grain, flicker |
| `boil(frame, seed, amount)` | tiny random x/y/rotation jitter, posterized | amount 0.6–1.2 on every photo; makes stills breathe |
| `pingPongEntrance(frame, dur, overshoot)` | 0→overshoot→1 | portraits flying in, promise lines sliding in (dur 12–14, overshoot 1.08–1.12) |
| `weldDetach(frame, detachAt, endAt)` | a frame locked to the image, then grows away and fades | gold frame on the opening photo, detaching mid-line |
| `parallaxPush(frame, total, depth)` | zoom rate by depth (near layers faster) | needs separate fg/bg layers (cut-out character over a plate) |
| `flicker(frame, seed)` | bad-bulb brightness drops (hold keyframes) | surveillance lamp, 0.55 + 0.45·flicker as brightness |
| `pendulum(frame, period, amp)` | sine swing | hanging lamp: light cone x = 50% + swing·22% |
| `smashIn(frame, at, settle)` | scale 3→1 with a hard ease-out | every slam title, stamp, number |
| `motionBlur(px)` | CSS blur | ramp to 8–14 px on cuts, rushes and pushes |

## Components (`src/effects/`)

| Component | Use |
|---|---|
| `<Photo src zoom x y origin filter position>` | full-frame image; drive `zoom` with `interpolate` for the push, add `boil` for x/y |
| `<Shade from="top"/"bottom">` | gradient so captions read over busy photos |
| `<Slam at size color glow>` | huge Anton title smashing in (on a word) |
| `<Stamp at text rotate size>` | red rubber stamp, slightly rotated, over a face or document |
| `<Bar at size bg>` | news-ticker label wiping in from the left (names, places, roles) |
| `<Sfx name at volume>` | place a sound effect at a scene-local frame |
| `useKeyedImage(file)` | loads a prop and removes a fake checkerboard; returns a transparent PNG |
| `<FilmTreatment/>` | the global film look (see 06) |

## Scene recipes that worked

**Slow push (every shot).** `zoom: interpolate(frame, [0, len], [1.0, 1.2])` with
`origin` on the subject's face. A shot with no push looks dead.

**Weld → detach (opening).** A gold border sits exactly on the photo's edge while both push in
together, then at a chosen word it scales away 1→1.4 and fades. Good as the "this is a memory" frame.

**Smash-cut into the next scene.** In the last 10 frames: zoom kick +0.12 and motion blur to 10 px,
plus a whoosh. The next scene starts already moving.

**Split-face reveal.** Show one half (`clipPath: inset(0 50% 0 0)`), then wipe the other half in
from the right in 6 frames on the cue word, with a glowing red seam and a quiet boom. No shake (taste).

**Colour drain.** Over 2–3 s, desaturate and darken the photo while a red multiply vignette and a
red bottom glow fade in. Then strike through the old word (a red bar draws across "KRYEMINISTËR")
and slam the new one ("ZOTI").

**Portrait wall with stamps.** 2×3 grid. Each portrait flies in from a different direction
(left, right, top, bottom, diagonals) with `pingPongEntrance` when the name is spoken; the stamp
slams when the verdict is spoken. On the stamp the portrait goes grayscale and darker, and nothing flashes (taste: no red flashes). Stagger and vary directions so it feels organic, not robotic.

**Money montage.** One `Sequence` per scandal, 2–4 s each, cut on the spoken name. Each beat:
push-in with motion blur at both ends, a 10-frame crossfade into the next beat (each beat holds 10 frames past its end while the next fades in on top), a whoosh, a red `Bar` with the
name. Big numbers count up (0→430 over 18 frames) and then a stamp sound. Per-beat extras: pulsing
red beacons (screen-blended radial gradients at the lamp positions), a laser scan line, glitch
slices (a 70 px strip offset 28 px with hue-rotate), candle flicker on the villain.

**Surveillance room.** Lamp cone swinging (`pendulum`) + bulb `flicker`, a moving VHS tracking band
(`backdropFilter: blur + brightness`), CCTV HUD (corner brackets, blinking ● REC, running timestamp
with the real date), animated wiretap waveform (SVG bars), lower-third name `Bar`s, big diagonal stamp.

**Recap with stamps.** Blurred, darkened background; three lines "MINISTRAT E TIJ / NË BURG" etc.
stamping on the words, then everything fades and the blur clears to reveal the shot.

**Coronation, two approaches:**
- *Zoom-through (current in the example):* slow push, then a 14-frame rush deep into the face
  (zoom → 3.4, motion blur 14), cut to the crowned image already at zoom 3.4 on its face, pull back in
  20 frames to reveal the crown, then a quiet boom and the title slam (no shake, no flash). This hides framing
  differences between the two images.
- *Face-matched dissolve:* align both faces (translate+scale the first image so its face sits on the
  second image's face), push close, dissolve with a blur peak (~5 px) and a gold glow at the crown,
  then pull back and run a glint sweep over the crown. Needs measured face positions; check alignment
  with a 50/50 overlay still.
- Rejected by the user: crown falling from the top of the frame; a white-gold flash cut with god-rays.
- Removed on request (2026-10-08): every screen shake and every red/white flash. Use crossfades, motion blur, pushes.

**Typewriter line.** `chars.slice(0, (frame - at) / 1.5)` plus a blinking ▌ cursor ("ASKUSH NUK PYET KU.").

**Flicker-on title (cold open).** Each letter turns on at `4 + i*1.6` frames and randomly flickers
for 6 frames, over black, with a boom. Then a small subtitle and a fade.

## Timing rules

- Cue on the word: `cue("scene", 20.45)`. Never eyeball seconds.
- Stamps/slams ON the stressed word; entrances on the name; cuts in pauses.
- Accents need silence around them: don't stack three effects on one frame.
- To fix something, think and talk in master frame numbers (the Studio shows them).
