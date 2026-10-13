# Remotion 4.0.532 cheat-sheet (for doc-reel)

All `remotion` and `@remotion/*` packages must be the **same exact version** (no `^`). The template pins 4.0.532.

## Core

```tsx
const frame = useCurrentFrame();                         // local to the enclosing <Sequence>
const { fps, durationInFrames, width, height } = useVideoConfig();
interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
interpolateColors(frame, [0, 60], ["#d4a040", "#e21818"]);
spring({ frame: frame - 20, fps, config: { damping: 200 } });   // 0 → 1, physics; damping 200 = no overshoot
random("seed-string");                                    // deterministic 0..1 (never Math.random)
```

Easing: `linear quad cubic poly(n) sin circle exp elastic(b) back(s) bounce bezier(x1,y1,x2,y2)` wrapped in
`Easing.in/out/inOut(...)`. There is **no `Easing.quint`**: use `Easing.poly(5)`.

## Structure

`<AbsoluteFill>` (full-frame flex layer) · `<Sequence from durationInFrames name layout="none">` (offsets time for
children) · `<Series><Series.Sequence durationInFrames>` (back-to-back) · `<Loop durationInFrames>` · `<Freeze frame>` ·
`<Composition id component durationInFrames fps width height>` / `<Folder name>` in Root.

## Media

`<Img src={staticFile("images/x.jpg")}>` (waits for load) · `<OffthreadVideo src>` (frame-exact video, best for renders) ·
`<Audio src volume={(f) => …}>` · `staticFile()` for anything in `public/` · `delayRender()/continueRender(handle)` for
async work (fonts, canvas keying) · `@remotion/google-fonts/<Font>` `loadFont("normal", { weights, subsets: ["latin-ext"] })`.

## Transitions (`@remotion/transitions`), verified in the installed 4.0.532

```tsx
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={90}><A /></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
  <TransitionSeries.Sequence durationInFrames={90}><B /></TransitionSeries.Sequence>
</TransitionSeries>
```
Presentations (each its own import path `@remotion/transitions/<name>`): `fade`, `slide`, `wipe`, `flip`, `clock-wipe`,
`iris`, `none`, `dissolve`, `book-flip`, `zoom-blur`, `dreamy-zoom`, `film-burn`, `linear-blur`, `zoom-in-out`,
`ripple`, `crosswarp`, `cross-zoom`, `swap`, `push-cut`, `blur-slide`. A transition overlaps the two sequences, so the
total is shorter by the transition length. Taste-friendly picks: `fade`, `dissolve`, `linear-blur`, `film-burn`
(subtle), `cross-zoom` (for a zoom-through). Avoid anything that flashes.
`useTransitionProgress()` lets a scene react to its own enter/exit progress.

## Other installed packages worth knowing

| Package | Exports | Use |
|---|---|---|
| `@remotion/captions` | `createTikTokStyleCaptions`, `parseSrt`, `serializeSrt` | word-by-word captions from a transcript |
| `@remotion/elevenlabs` | `elevenLabsTranscriptToCaptions`, `detectElevenLabsTranscriptFormat` | captions from ElevenLabs timestamps (exact word times without Whisper) |
| `@remotion/openai-whisper` | `openAiWhisperApiToCaptions` | captions from a Whisper API transcript |
| `@remotion/shapes` | `Rect Circle Ellipse Triangle Star Polygon Pie Heart Arrow Callout Spark` + `make*` path builders | vector shapes, pie timers, callouts |
| `@remotion/noise` | `noise2D/3D/4D` | organic drift, smoke, boil |
| `@remotion/media-utils` | `useAudioData`, `visualizeAudio`, `visualizeAudioWaveform`, `getAudioDurationInSeconds`, `getImageDimensions` | real waveform/spectrum bars from the voiceover |

## CLI

`npx remotion studio` · `npx remotion render <id> out.mp4 [--crf 18–23] [--frames 100-200] [--concurrency N]` ·
`npx remotion still <id> out.png --frame 120` · scripts in the template: `scripts/render-stills.mjs` (bundle once, many
frames), `detect-pauses.mjs`, `generate-audio.mjs`, `analyze-checker.mjs`.
