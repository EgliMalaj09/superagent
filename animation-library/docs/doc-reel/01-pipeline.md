# 01 — The pipeline, phase by phase

The method comes from a viral "AI motion-graphics documentary" workflow (a Netflix-vs-Blockbuster
reel built with Claude Code + Remotion) and was adapted and extended for the Zoti i Shqipërisë reel.
Core idea: **the voiceover drives everything**. Lock the story and the voice first; animation is
choreography on top of a fixed audio track.

## Phase 1 — Idea → angle (checkpoint: user picks the angle)

- Research with web search. Good sources: Balkan Insight, European Western Balkans, Reuters/AP/US
  News wires, Transparency International (CEPI cases), Wikipedia "Corruption in Albania", SPAK press
  releases, Albanian outlets (Gazeta Shqiptare, Shqiptarja.com, Syri, Vox News) for recent events.
- Prefer **confirmed** cases: convictions > indictments > arrests > investigations. Note the date and
  status of each fact.
- Offer 2–4 angles with a one-line pitch and tagline each, then recommend one. Possible angles:
  - a single big case (one villain, one sum of money, a clear fall)
  - a pattern across years ("minister after minister…"), as in Zoti i Shqipërisë
  - the most recent scandal (this month), which goes stale quickly
- The user changes direction freely ("maybe something neutral… no, back to politics"). Don't argue;
  re-pitch quickly.

## Phase 2 — Script (checkpoint: approved lines)

See 02-story-and-script.md. Deliver: title concept + 6–8 Albanian lines + English gloss per line.

## Phase 3 — Storyboard (checkpoint: approved table)

Table columns: # · beat · what we see · technique · assets needed. Also the color arc
(06-film-look-and-color.md). Plan more visual beats than voice lines (a 77s reel had ~12 beats).

## Phase 4 — Voiceover (user generates it)

Give the ElevenLabs package from 03-voiceover.md. The user sends back one MP3 of the whole script.
Then run `npm run pauses` and map every phrase to its timestamp. That table is the master clock.

## Phase 5 — Images (user generates them)

Give one prompt per asset with an exact filename (04-image-prompts.md). When images arrive:
- check each one against its prompt (likeness, framing, artifacts like burned-in text)
- copy to `public/images/{characters,props,scenes}/` with the agreed filename
- note problems you'll fix in code (blur a burned-in filename, key a fake checkerboard)

## Phase 6 — Build

```bash
cp -R remotion/template projects/<slug> && cd projects/<slug> && npm install
# voiceover → public/audio/voiceover.mp3, then:
npm run pauses
```
1. In `src/timing.ts`, add scenes with boundaries inside pauses: `[at(11.3), at(13.6)]`.
2. Write one scene file per beat in `src/scenes/` and register it in `SCENE_COMPONENTS` in `MainReel.tsx`.
   Cue everything with `cue("<scene>", <voSeconds>)`.
3. Set `HAS_VOICEOVER` / `HAS_MUSIC` to true in `MainReel.tsx` once the files exist.
4. Edit `PLAN` in `scripts/generate-audio.mjs`, then run `npm run audio`.
5. `npx tsc --noEmit`, then `npm run stills -- <a frame from each scene>` and **look at them**.
6. Open the Studio for the user (`preview_start` name `remotion-studio`).

## Phase 7 — Iterate and render

- The user reviews in the Studio and replies with frame numbers. Fix, re-render stills, repeat.
- `npm run build` renders full quality (~200 MB for 80s). `npm run build:small` (CRF 23) is the
  one to upload to Instagram/TikTok.
- Send the MP4 with SendUserFile.
