---
name: doc-reel
description: Make a voiceover-led cinematic documentary Reel (1080x1920) in Remotion from AI-generated photos — political exposés, scandals, rise-and-fall stories, history — with research, an Albanian script, an ElevenLabs voiceover prompt, image prompts with filenames, scene-by-scene animation synced to the voice, a film look and a synthesized score. Use when the user asks for a documentary / exposé / story video about a person, scandal or event, mentions "like Zoti i Shqipërisë", or wants AI images brought to life with a voiceover.
---

# Doc-reel (Remotion + AI images)

Idea → angle → script → storyboard → voiceover → images → build → stills → render. The reference build is
`examples/zoti-i-shqiperise/` (77 s, 8 scenes). **Read `TASTE.md` first.** Full knowledge base: `docs/doc-reel/01…09`.

## Checkpoints (wait for the user each time)

1. **Angle.** Research with web search; only confirmed facts (convictions > indictments > arrests > investigations),
   each with source + date. Pitch 2–4 angles, recommend one. → `docs/doc-reel/01-pipeline.md`
2. **Script.** 6–8 Albanian lines, 60–80 s, Hook → Turn → Evidence → Money → Twist → Payoff, plus a title concept;
   English gloss per line. → `docs/doc-reel/02-story-and-script.md`
3. **Storyboard.** Line → scene → technique → assets; colour arc. More visual beats than lines.
4. **Voiceover.** Give the ElevenLabs package (voice design, settings, tagged full script). The user sends one MP3.
   → `docs/doc-reel/03-voiceover.md`
5. **Images.** One prompt per asset + exact filename; the user pastes images, you copy them into `public/images/...`.
   QA each (likeness, burned-in text, before/after framing). → `docs/doc-reel/04-image-prompts.md`

## Build

```bash
cp -R remotion/template projects/<p> && cd projects/<p> && npm install
# public/audio/voiceover.mp3 in place, then:
npm run pauses                 # phrase-by-phrase timestamps = the master clock
```
- `src/timing.ts`: one entry per scene, boundaries in the middle of pauses: `hook: [VO_OFFSET, at(11.3)]`.
- One file per scene in `src/scenes/`, registered in `SCENE_COMPONENTS` (`src/MainReel.tsx`); cue every move with
  `cue("<scene>", <voSeconds>)`. Borrow scenes from the example; techniques in `docs/doc-reel/05-motion-techniques.md`.
- Flip `HAS_VOICEOVER` / `HAS_MUSIC` to true once the files exist. Set `PLAN` in `scripts/generate-audio.mjs`, `npm run audio`.
- `npx tsc --noEmit` → `npm run stills -- <a frame per scene + every changed transition>` → **read them**.
- Studio for the user: `preview_start` name `remotion-studio`. They reply with frame numbers.
- `npm run build` (or `build:small` for upload) → `bash ../../templates/finish.sh out/video.mp4 ../../results/<p>.mp4 <cover_s>`.

## Taste rules for this format (from the Zoti reel)

- **No shakes, no red/white flashes.** Transitions: soft crossfades (10–12 frames), motion-blurred pushes, zoom-through.
- Sound effects quiet (`SFX_GAIN` 0.12 in the template ≈ ≤ 0.1 effective), only on stamps/reveals/the end;
  music ~0.08 under the voice.
- Every photo moves: slow push + boil. Stamps on the verdict word, entrances on the name, cuts in pauses.
- On-screen wording must stay true: "I DËNUAR" (convicted) unless imprisonment is confirmed; attribute to institutions
  as the source does. Satire (crowns, "Zoti") yes, invented events no, "he is a dictator" as a fact no.
- Rejected before: crown falling from the top; god-ray + flash cut; outro repeating the punchline.
