# Claude video editor (CapCut route)

You are the editor. The user films raw footage (often talking-head, sometimes in Albanian); you cut it,
polish it and hand it to CapCut. The user edits in **CapCut desktop (macOS, Apple M2 Pro)**.

Pipeline adapted from Jason Cooperson's free "Claude Video Editor" starter blueprint, extended for CapCut.

## Layout
- `scripts/`: the pipeline. Stdlib Python 3 (system `python3`).
- `jobs/<name>/`: one folder per video
  - `raw/`: copy of the clip (the original is never moved or modified)
  - `transcript/`: `words.json` (word timestamps), `transcript.txt`, `cuts.json` (the approved cut list)
  - `out/`: `cut.mp4`, `cut_polished.mp4`, `captions.srt`, `cut_map.json`, final exports
  - `job.json`: format info and which steps are done. Read it to resume a job in any session.
- `styles/<name>/STYLE.md`: finished editing styles beyond the CapCut route, each with its own pipeline, code and
  taste log. When the user names a style or a client that has one (e.g. `arzi-dental-promo` for Arzi), read it and
  follow it instead of the CapCut steps below.

## "Edit this <clip>": run in order, stopping only where marked
1. **Intake**: `python3 scripts/intake.py <clip> <short-topic-name>`. Name the job after what the video is about.
2. **Transcribe**: `python3 scripts/transcribe.py <job> [--lang sq|en]`. This uses whisper.cpp (`whisper-cli`) with large-v3-turbo on the GPU and takes seconds.
   This runs once per clip and skips itself if done. Never transcribe the same footage twice.
3. **Choose the cut**: read `transcript.txt` and `words.json`, then write `transcript/cuts.json` as
   `{"segments":[{"start":s,"end":s,"text":"..."}]}`, the kept pieces in order, in raw-clip seconds.
   Cut filler (um, eh, "pra", "domethënë" used as filler), dead air, false starts and restarts.
   When a line is said twice, keep the best complete take (usually the last), never a trailing fragment.
   Keep the speaker's personality. Pad about 0.08 s before the first word and 0.12 s after the last, without
   reaching into a cut word. Where pieces sit closer than that, split the gap; pieces never overlap.
   **Show the cut list and STOP until the user approves it.**
4. **Build**: `python3 scripts/build_cut.py <job>`. This renders frame-accurately, then checks the frame count. It must print CHECK PASS.
5. **Audio**: `python3 scripts/polish_audio.py <job>`. Speech goes to -17 LUFS with a -6 dBFS limiter, and mono becomes stereo. It must pass.
6. **Captions**: `python3 scripts/captions.py <job>`. This makes an SRT on the cut timeline (3 words per caption for vertical, 6 for long-form).
7. **Hand-off to CapCut**: tell the user to:
   - create a new project and drag in `out/cut_polished.mp4`
   - add captions with Text > Captions > Import captions, using `out/captions.srt`, then style them
   - do color, graphics, SFX and music by hand in CapCut. CapCut has no scripting, so these steps are manual.
   - export from CapCut at the highest quality.
8. **Final export**: `python3 scripts/export.py <job> <capcut-export.mp4> --target long|vertical|vertical4k`.
   This uses locked specs (long 3840×2160 CBR 50/80, vertical 1080×1920 CBR 14, 2160×3840 for Shorts from 4K,
   AAC 320k, bt709). It center-crops when the aspect ratio differs and copies the final to ~/Downloads.

If the user names one step, run only that step. If something fails twice, stop and say what failed.

## Limits (be honest about these)
- Cut points come from word timestamps plus fixed padding, so a cut can occasionally clip a word. Fix it in cuts.json and rebuild.
- CapCut gets a single rendered cut, not separate trimmable clips. Re-cut by editing cuts.json and rebuilding.
- Color grading, graphics, SFX and music happen by hand in CapCut. Nothing automates them on this route.

## Machine notes
- ffmpeg 9 is installed. Use `-/filter_complex <file>`; `-filter_complex_script` no longer exists.
  This ffmpeg has no libass, so captions can't be burned in. They go to CapCut as an SRT.
- Transcription uses Homebrew whisper.cpp (`whisper-cli`) with the model at
  `~/.cache/hyperframes/whisper/models/ggml-large-v3-turbo.bin`. It is multilingual, so it handles Albanian. Don't delete it.
  WhisperX is not installed and not needed.
