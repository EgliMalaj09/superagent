---
name: motion-video
description: Make a motion-graphics, explainer, data, map, isometric-3D, luxury or brand/marketing video with HyperFrames (HTML + GSAP → MP4), timed to a voice-over or on-screen text, in 9:16, 4:5, 1:1 or 16:9. Albanian and English. Use when the user says "make an animation / explainer / data video / infographic / map animation about …", "animate this voice-over", "make a marketing video for <url>", or names a style kit (news, vox, dossier, map, isometric, luxury, brand).
---

# Motion video (HyperFrames)

Script → approval → a scene built from a style kit + the motion kit → check → snapshot → render → finish → `results/`.
**Read `TASTE.md` first.** Engine reference: `docs/hyperframes/engine.md`. Style kits: `docs/hyperframes/style-kits.md`.
Principles: `docs/craft/motion-principles.md`. Platforms: `docs/craft/platforms-and-delivery.md`.

## 1. Script (checkpoint 1)

- Research facts with web search; keep a source per number. Albanian data: INSTAT, Monitor, Faktoje, BIRN/Reporter.al
  (see `docs/craft/resources.md`). Prefer the most recent published figure and say its year on screen.
- Fill `templates/SCRIPT.md`: time, exact voice-over words, what we see, on-screen text, source; plus the fact-check table
  and a "Not used, on purpose" list (numbers that would mislead). `examples/tirana-design/SCRIPT.md` is the model.
- Marketing videos: only claims that are on the brand's site; no invented numbers or testimonials
  (`examples/cyberoz/SCRIPT.md`). Capture brand assets: `npx hyperframes capture <url> -o projects/<p>/capture --skip-vision`.
- Show it and wait for approval.

## 2. Brief (5–8 lines shown to the user)

Expand the ask with `templates/animation-brief.md` into `projects/<p>/briefs/<section>.md`: intent in one sentence,
layout, hero move, beat-by-beat choreography on word times, premium details, sound, transitions in/out.
Translate vague words ("luxury", "energetic", "clean", "techy", "fun") with the table in `docs/craft/motion-principles.md`.

## 3. Build

```bash
python3 templates/new_project.py <p> --format 9x16 --style vox [--voice path/vo.wav] [--reference references/<ref>]
# edit projects/<p>/scene.html (layers), scene.js (GSAP on `tl` with the motion kit), scene.css, project.json (audio)
python3 library/engines/build_page.py projects/<p>      # prints TASTE WARNINGs for loud beds / too many sfx
npx hyperframes check projects/<p>/public
npx hyperframes snapshot projects/<p>/public --at 1,4,8,12   # read the contact sheet = checkpoint 2
```

- Voice-over: transcribe with Whisper for word times
  (`npx hyperframes transcribe vo.wav -d projects/<p> --engine whisper --model large-v3-turbo --language sq --json`),
  proofread with `.claude/skills/reel-edit/scripts/fix-words.py`, get anchors with `phrase-times.py`.
  Built a draft before the voice existed? `remap([[old,new],…])` in scene.js retimes the whole timeline.
- Motion kit (`library/engines/motion.js`): `up fadeIn pop slideIn blurIn words out fadeOut hl growY stamp count typeIn
  draw kenBurns drift xfade remap`, seeded `rnd()`. Engines: `isometric.js` (world/box/layer/grow/camTo),
  `map.js` (makeMap → pin/route/camTo). Full API in `docs/hyperframes/engine.md`.
- One continuous camera move beats cuts (`examples/tirana-one`). Between parts: `xfade` 0.35–0.4 s.
- Need something bigger? `npx hyperframes catalog <word>` (386 blocks: captions, lower thirds, shader transitions,
  mock UI, charts, hand-drawn) → `npx hyperframes add <name>` → adapt into scene.html/js in the kit's colours.

## 4. Render, finish, deliver

```bash
NODE_OPTIONS=--max-old-space-size=8192 npx hyperframes render projects/<p>/public -o projects/<p>/out-raw.mp4
bash templates/finish.sh projects/<p>/out-raw.mp4 results/<p>.mp4 <cover_second>
```
`finish.sh` normalises to −14 LUFS, tags BT.709, encodes CBR 12 Mb/s with faststart, writes the cover PNG, and reports
black gaps. Multi-part films: render parts, `bash templates/join.sh` (0.4 s crossfades), then finish.

## Rules that bite (see `docs/hyperframes/engine.md` → Traps)

- Every timed element needs `class="clip"` + `data-start/data-duration/data-track-index`; every `<audio>` needs an `id`.
- Tween only transforms + opacity (`check` rejects top/left/width/height). No CSS `transform` on elements GSAP moves.
- Elements hidden in CSS need `opacity` in the `fromTo` destination; later entrances use `immediateRender:false`.
- No `Math.random()`/`Date.now()`: use the seeded `rnd()`.
- Taste: no shakes, no flashes, no sounds on text entrances, bed ~0.07 under a voice, sfx ≤ 0.1.
