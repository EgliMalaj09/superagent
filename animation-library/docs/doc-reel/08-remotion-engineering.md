# 08 — Remotion engineering notes

## Stack

- Remotion **4.0.532** (all `remotion` / `@remotion/*` packages pinned to the same exact version),
  React 19, TypeScript 5.4, Node 22 (nvm). 1080×1920, 30 fps, JPEG frames.
- First render downloads Chrome Headless Shell (~93 MB) once.
- ffmpeg 7 is installed (brew). The Remotion scripts use macOS `afconvert` and `sips` so they work without it.

## Project structure (template)

```
src/index.ts          registerRoot
src/Root.tsx          "Main" composition + a "Scenes" folder with each scene wrapped in the film look
src/MainReel.tsx      sequences every scene from timing.ts, FilmTreatment on top, voiceover + music
src/timing.ts         FPS/size, VO_OFFSET, at(), SCENES, cue(), TOTAL_FRAMES   ← the master clock
src/fonts.ts          Anton + Oswald (latin-ext), RED, GOLD
src/motion/helpers.ts boil, posterizeTime, pingPong, weldDetach, parallax, flicker, pendulum, smashIn
src/effects/          FilmTreatment, Photo/Shade, Slam/Stamp/Bar, Sfx, useKeyedImage
src/scenes/           one file per scene
scripts/              generate-audio, detect-pauses, render-stills, analyze-checker
public/images/{characters,props,scenes}, public/audio/{voiceover.mp3,music.wav,sfx/}
```

## The timing system

- `VO_OFFSET = 60`: 2 s silent title before the voice.
- `at(voSec)` gives the absolute master frame of a voiceover timestamp.
- `SCENES = { id: [startFrame, endFrame] }`, in order. Boundaries are `at(<middle of a pause>)`.
- `cue(id, voSec)` gives the scene-local frame. Inside a scene, `useCurrentFrame()` is local
  because each scene is wrapped in a `<Sequence>`.
- Sub-beats inside a scene: nested `<Sequence from durationInFrames>` plus a local cue helper
  (see `Scene4_Loot.tsx`: `BEATS`, `beatFrom`, `beatLen`, `bc`).
- To retime after a new voiceover: rerun `npm run pauses`, then update the seconds. Nothing else.

## Keying fake checkerboards: `useKeyedImage(file)`

AI "transparent" props arrive as JPGs with a grey checkerboard. At render time, in a canvas:
1. flood-fill from the borders through dark, low-saturation pixels (`max<125`, `max-min<30`) → alpha 0;
2. enclosed grey pockets (between crown arches) are found by connected components and keyed when
   `(n>8000 && sd>25) || (n>300 && sd>20 && dark<45%)`. Checker pockets are high-variance mid-grey;
   jewels are mostly near-black, so they survive;
3. crop to the bounding box, return a PNG data URL (uses `delayRender`/`continueRender`).
Run `node scripts/analyze-checker.mjs <image>` to see which regions get KEY vs keep before trusting it.

## Verification loop

- `npx tsc --noEmit` after every change.
- `npm run stills -- <frames>` renders half-size PNGs to `out/stills/`. Read them. One frame per
  scene, plus the exact frames of transitions/stamps you changed.
- Studio: `preview_start` with name `remotion-studio` (from `.claude/launch.json`, port 3000).
  The Studio hot-reloads, so the user can scrub while you edit.
- Full render: `npm run build` (~200 MB for 80 s). `npm run build:small` uses CRF 23 for upload.
  Run long renders in the background. If you change code mid-render, stop it
  (`pkill -f "remotion render"`) and re-render.

## Gotchas hit so far

- `Easing.quint` doesn't exist in Remotion. Use `Easing.poly(5)`.
- Don't create component wrappers inside render (e.g. `withFilm(C)` in JSX); build the map once at
  module level, otherwise scenes remount.
- `Config.setConcurrency(1)` makes renders crawl. Leave the default.
- A missing `public/` file makes the Studio/render fail. In the template, `HAS_VOICEOVER` and
  `HAS_MUSIC` in `MainReel.tsx` gate the audio until the files exist.
- `backdropFilter` works in the Remotion renderer (Chrome); use it to blur burned-in text.
- When a file you were editing changes on disk unexpectedly (the user or another session edited it),
  read it and ask before overwriting.
- Image cover math for 9:16 sources: a 768×1376 image fills 1080×1920 at scale 1.406 with ~7 px
  cropped top and bottom. Use it to convert image pixels to frame pixels when positioning overlays.
