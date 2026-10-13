# reel-edit: free Instagram Reel editor for Claude Code

Adapted from the WeAreNoCode YouTube editor kit, rebuilt for Instagram Reels (9:16) with free, local tools only.

## What was kept, changed, dropped

| From the YouTube kit | Here |
|---|---|
| Cut stage (paper cut, retakes, tighten, sliver, edge audit, dead air) | Kept, tighter Reel pauses (0.25 s), Albanian retake words ("fshije", "edhe një herë") and ë/ç-aware matching |
| Parakeet transcription (no Albanian) | Replaced by Whisper large-v3-turbo (free, local, Albanian + English), then Claude proofreads the text (`fix-words.py`) |
| 16:9 composer with 40+ YouTube formats | Replaced by `reel-compose.py`: 1080x1920, word-by-word captions, hook, title, emoji, logo, number, pills, image, B-roll clip, CTA |
| 4K render, YouTube chapters, long-form rules | Replaced: 1080x1920 render, Instagram safe zones, Reel pacing |
| Epidemic Sound (paid) | Dropped. `sfx-synth.py` makes the sounds from scratch (free, no licence) |
| Tella (paid) | Dropped. Record your screen with anything |
| AI B-roll (paid credits) | Dropped. Free stock (Pexels, Pixabay, Mixkit) or your own clips |
| Teardown, assembly for long videos | Dropped / assembly kept for multi-part Reels and loudness |
| New | `prep-source.py`: iPhone HDR → SDR, 60 fps/VFR → 30 fps, landscape → 9:16 |

## Prompts

Edit a Reel:
> Use the reel-edit skill to edit this Reel: [file name]. The hook is [your promise]. Language: Albanian (or English).

Notes:
> At 0:04 the caption covers my face, move it lower. Less sounds. Make the hook bigger.

Make it learn:
> Save this to the skill.

## Music

Add music inside the Instagram app (licensed, trending audio, no tokens). Baked-in music only from free libraries
(Pixabay Music, YouTube Audio Library); the ducking command is in `SKILL.md`.
