# api-keys: Google AI image, video and music generation

The user's studio for generating **images, videos and music with Google's models on Vertex AI**. Each subfolder is
one project (a series, a reel, a client piece). Albanian and English.

Despite the folder name, **no API keys are stored here**. Every script authenticates with Google Cloud
Application Default Credentials (ADC):
`~/google-cloud-sdk/bin/gcloud auth application-default print-access-token`, project `project-cb3b1428-cbd7-41cd-bb8`.
If a call fails with 401/403, tell the user to run `gcloud auth application-default login` themselves. Never print
tokens, never write credentials into files, prompts or logs.

**Every generation call is billed to the user's Google Cloud project.** Videos cost far more than images.

## Models and the scripts that call them

| What | Model | Script | Endpoint |
|---|---|---|---|
| Image (text and/or reference images → PNG) | `gemini-3-pro-image` (default), `gemini-3.1-flash-image` | `day7/gen.py PROMPT_FILE OUT.png [--model M] [--aspect 16:9] [--ref img ...]` | `generateContent`, location `global` |
| Video (text, first frame, refs → MP4) | `gemini-omni-1.1-flash-preview` | `day7/omni.py PROMPT_FILE OUT.mp4 [--image first.png] [--ref img ...] [--aspect 9:16] [--duration 8s] [--resolution 720p] [--task T]` | Interactions API, `v1beta1`, location `global` |
| Video-to-video edit (restyle or swap clothes, keep the motion) | `gemini-omni-1.1-flash-preview` with a video input | `vivamus/edit_viv.py`, `outfits/video_test/edit*.py` | Interactions API |
| Music | `lyria-002` | `outfits/music/lyria.py OUT.wav "prompt" "negative prompt"` | `predict`, location `us-central1` |
| Audio QA (transcribe, check language, same speaker?) | Gemini | `martesa/ep1v2/listen.py`, `compare.py`, `day7/reel_claude_girl/qa.py` | `generateContent` |

All scripts are stdlib Python 3 (`urllib`, no SDK). They retry on HTTP 429 (rate limit) with a growing wait;
any other HTTP error exits with the response body. Scripts that use Pillow need a Python that has it
(e.g. `day7/reel_coaster/.venv`). Assembly and finishing use FFmpeg.

Reuse these scripts. When a new project needs a variant, copy the closest one into the project folder
(as `martesa/ep1v2/omni2.py` did) instead of changing the shared ones in `day7/`.

## Projects

- **`day7/`**: the shared tools (`gen.py`, `omni.py`, `make_asset.py`, `make_slide.py`) plus:
  - `series/`: **House of Albania · S1 ARBËRIA (Skanderbeg)**, an Instagram history series. Read `series/BIBLE.md`
    (format, episodes, motifs, captions) and `series/BRAND.md` first. Carousels are 3:4 with 6–8 slides; selected
    episodes become 9:16 Omni videos. No text and no dialogue are generated inside images or video.
  - `style-blocks.md`: the **locked "posterized engraving" style** for that series. `make_asset.py` (character and
    location sheets) and `make_slide.py` (scenes with sheets as refs) assemble the prompt from it automatically and
    attach the fixed style references from `references/`. Never edit the blocks between assets.
  - `reel_claude_girl/` (`SCRIPT.md`, `SHOTLIST.md`, `STYLE.md`, `shots.py`, `qa.py`) and `reel_coaster/`
    (`music.py`, `overlay.py`): finished reels; use them as worked examples.
- **`martesa/`**: **"Martesa 1 milion euro"**, an Albanian TV-drama-style series. `characters/` (adriani, babai,
  elira), `ep1/`, `ep1v2/` (the full pipeline: `shots.py` → `make_keys.py` keyframes → `make_clips.py` Omni clips
  with Albanian speech and Gemini QA → `make_amb.py` room tone → `assemble.py`), `ep1v3/` (current version, read
  `BLOCKING.md` for screen direction before any office shot). The user often works on this in its own sessions;
  don't touch it unless the task is about Martesa.
- **`outfits/`**: outfit-swap fashion reel: prompts per outfit, Omni edits, `fx.py` effects, `sound.py`, Lyria music.
- **`vivamus/`**: VIVAMUS clothing-brand reel, an Omni video-to-video outfit swap (`edit_viv.py SRC SHOT_FILE OUT`).

## How to do a new job

1. **Find the project.** Continue in an existing folder, or create `<project>/` with `prompts/`, `refs/`, `out/`.
   Read that project's docs (bible, style, script, blocking) before writing a prompt.
2. **Write the prompt to a file** in `prompts/` (the scripts read prompt files, which keeps every prompt on record).
   Be explicit about what to copy from each reference image and what to ignore. Say "no text" unless text is wanted.
3. **Show the user the prompt(s), the model, aspect, duration and number of calls, and STOP for approval** before
   spending money. Images can then be iterated freely within the approved brief; ask again before every new video
   batch.
4. **Generate, then look at the result** (open the PNG, or check frames/audio of the MP4) before reporting. For speech,
   check it with `listen.py` / `qa.py`. Fix the prompt and retry only what failed.
5. **Report** the output path(s) and what the prompt was. Keep the `.prompt.txt` next to each output.

## Defaults

- Instagram: 3:4 for carousels, 9:16 for Reels; videos 720p, 8 s per clip unless told otherwise.
- Keep characters consistent by passing their approved sheet / keyframe as `--ref` every time.
- Never move or delete the user's source footage or approved assets. Move unwanted files to the macOS Trash, never `rm`.
