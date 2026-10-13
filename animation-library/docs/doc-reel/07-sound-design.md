# 07 — Sound design

Three layers: **voiceover** (the user's ElevenLabs MP3), **music bed**, **SFX**. The music and SFX are
synthesized by `scripts/generate-audio.mjs` (pure Node, no dependencies), so every video gets a score
without licensing problems. It's a synthesized drone score, not an orchestra. If the user wants
richer music, they can generate a track in Suno / ElevenLabs Music and save it as
`public/audio/music.wav` (or change the filename in `MainReel.tsx`).

## The music bed (edit `PLAN` at the top of the script)

| Element | Role |
|---|---|
| Warm D-major pad | the "promise" section, until `warmUntil` |
| Cold D-minor pad (detuned saws, lowpass opening over time) | the "regime", builds to `climax` |
| Minor-second (Eb) tension voice | creeps in after the turn |
| Sub drone D1+D2 | constant floor; drops at the climax |
| Heartbeat (lub-dub) | from `heartbeatFrom`, 66 → 118 bpm into the climax |
| Low ostinato pulse (D–Eb–F) | `pulses` sections (money montage, final build) |
| Eerie high sines with tremolo | `eerie` section (surveillance) |
| Schroeder reverb + soft-clip | glue and loudness |

Prompt for an external track, if the user wants one:
```
Dark cinematic documentary score, slow building tension, deep cello and sub-bass drone, no drums
until the final 15 seconds, ominous Eastern European orchestral texture, HBO true-crime style,
[N] seconds, building to a heavy orchestral stinger at the end.
```

## SFX (`public/audio/sfx/*.wav`, placed with `<Sfx name at volume>`)

| Name | Use on |
|---|---|
| `stamp` | every stamp, number landing, strike-through |
| `boom` | title slams, reveals, the climax |
| `riser` | 3 s build ending exactly on the climax frame (`at = climax - 90`) |
| `whoosh` | cuts, rushes, scene transitions |
| `shutter` | portrait entrances (camera flash), opening photo |
| `beep` | surveillance / wiretap moments |

## Levels (user feedback: SFX were "really interfering" with the voice)

- Global `SFX_GAIN` in `src/effects/Sfx.tsx`: **0.12 in the template** (≈ ≤ 0.1 effective, per TASTE.md); the Zoti example still uses 0.3. Per-call `volume` 0.4–1.0 on top. Only stamps, reveals and the ending get a sound; nothing on text entrances.
- Music: 0.5 in the silent title, **0.08 under the voice in the template** (≈ 15 dB under; the Zoti example used 0.3), fades to 0 over the last 20 frames
  (`MainReel.tsx`).
- Voice at 1.0. If anything competes with a word, lower or move the effect, not the voice.
