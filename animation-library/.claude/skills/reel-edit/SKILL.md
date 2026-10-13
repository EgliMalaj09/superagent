---
name: reel-edit
description: Edit an Instagram Reel (9:16, 1080x1920) end to end in Claude Code with free, local tools only. Takes a raw phone clip (retakes and all) or several clips, cuts the retakes and pauses, adds word-by-word captions, a hook, punch-in zooms, pop-ins (emoji, logo, number, pills, screenshot), free B-roll and synthesised sound effects, then renders an Instagram-ready MP4 with HyperFrames. Albanian and English. Use whenever the user drops a video and says "edit this reel", "make a reel", "cut this for Instagram", "add captions", "edit this for IG/TikTok/Shorts", or names a vertical clip to edit.
---

# Reel editor

Raw phone footage in, a finished Reel out: the cut, captions, hook, zooms, pop-ins, sound, and a tagged 1080x1920 MP4.
Everything runs locally and free: FFmpeg, auto-editor, HyperFrames (Chrome + GSAP), Whisper for transcription (Albanian + English),
and `sfx-synth.py` for sounds. No paid service, no account, no footage leaves the computer.

**This skill keeps learning, automatically.** Every time the user reacts to a result ("I like this", "I don't like that",
"too slow", "love the gold", "no more confetti"), save it without being asked, the same turn, before rebuilding:
- **A taste rule** (it applies to future Reels) goes into `TASTE.md` next to this file, under Love / Avoid / Defaults,
  as one plain rule with the date and the example it came from. If it contradicts an older rule, replace that rule; never keep both.
- **A craft rule** (how to build, a bug, a number that works) goes into the section of this file where it belongs.
- **A one-off** (only this video: "move this word 0.2 s") goes into that project's brief or storyboard, not the skill.
- When unsure whether it is general, save it to `TASTE.md` marked "(once)"; if it comes up a second time, drop the mark.
Then say in one line what was saved and where ("Saved to your taste: no confetti; luxury = slower moves").
**Read `TASTE.md` before every brief and every Reel.** It overrides the defaults in this file.

Paths: `SK=".claude/skills/reel-edit"`, `W="projects/<project>"` (one folder per Reel), shared assets in
`library/` (`sfx/`, `img/`).

## Setup check (first use, and after updates)

| Needs | Check | Install when missing (all free) |
|---|---|---|
| Node 22+ | `node -v` | `brew install node` |
| HyperFrames 0.8.137 + GSAP 3.14.2 (the animation engine) | `npx hyperframes --version`, `npx hyperframes doctor` | pinned in the project's `package.json`: `npm install` in the project folder restores both |
| FFmpeg 7+ | `ffmpeg -version` | `brew install ffmpeg` |
| numpy | `python3 -c "import numpy"` | `brew install numpy` (Homebrew Python) |
| auto-editor | `auto-editor --version` | `brew install auto-editor` |
| Whisper large-v3-turbo (1.6 GB, once) | `npx hyperframes transcribe <5 s wav> --engine whisper --model large-v3-turbo --language sq --json` | the same command downloads it |
| Google Chrome | snapshots and renders run in it | google.com/chrome |
| GSAP offline copy (optional) | `ls $SK/assets/vendor/gsap.min.js` | `mkdir -p $SK/assets/vendor && curl -sL https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js -o $SK/assets/vendor/gsap.min.js` |
| Sound kit | `ls library/sfx/*.wav` | `python3 $SK/scripts/sfx-synth.py --out library/sfx` |

Tests: `cd "$SK/scripts" && python3 -m unittest tests` must end `OK`. Run them after touching any script.

**Transcription = Whisper + Claude.** Claude cannot hear audio, so Whisper (free, local) writes every word with its
time; then **Claude proofreads the text** with `fix-words.py` (timings untouched): diacritics (e/ë, c/ç), split or
merged words, names, brands, slang. Captions print exactly this text, so never skip it. `--language sq` for Albanian,
`--language en` for English; ask which when it is not said. One language per Reel; a mixed Reel takes its main language.
All text matching (anchors, retakes, beat-check) folds accents, so `bej` finds `bëj`.

## The route

| Input | Route |
|---|---|
| One raw phone clip (15 s to 3 min) | prep → cut stage → storyboard → compose → snapshot → render → deliver |
| Several clips for one Reel | `ingest.py` joins them into one source (after prepping each), then the same |
| An already-cut clip | prep → transcribe → storyboard → compose → render |
| A landscape clip | `prep-source.py --x 0.4` (crop centre) or `--fit` (blurred fill) |
| A multi-part Reel / a carousel of clips | each part on its own, then `assemble.py` |

Two checkpoints, everything else unattended. **A, the cut:** `PAPER-CUT.md`, answered in plain words. **B, the plan:**
`MOTION-PLAN.md` + `storyboard.json` + `snaps/sheet.png` (every beat as a still, with Instagram's UI zones in red). Then render, verify, deliver.

## Reel rules (the look and the pace)

**The hook (first 1.5 s) decides everything.**
- Frame one has the hook on screen: a `hook` box with the promise in 3 to 7 words. Not a logo, not a "hey guys".
- The first spoken word lands in the first 0.3 s: cut every breath and settle before it.
- Hook text and spoken hook say the same promise, or the text adds a twist. It must work muted (most people watch muted).
- The payoff comes before the end; the last line ideally runs back into the first so the Reel loops.

**Pace.** Something changes every 1.5 to 3 s: a caption chunk (always), plus a zoom, a pop-in or a cutaway every 2 to 4 s.
No pause over 0.25 s after a sentence, 0.30 s elsewhere. 15 to 45 s is the sweet spot; up to 90 s when the content holds.

**Safe zones (1080x1920).** Instagram covers the top 220 px, the bottom ~440 px (caption, username, audio) and a
140 px strip on the right from y 880 to 1480 (like, comment, share). Everything important lives inside x 60..940,
y 230..1460. The composer's defaults already do; `snap-beats.py` paints the zones red on the sheet to prove it.

**Captions** are on by default, word by word from the flat-cut transcript: 2 to 3 words a chunk (max 16 characters),
uppercase, 82 px DM Sans 700, white with a black stroke, the live word in the accent colour, at y 1180 (between the face
and the UI). Hide them (`captions.hide`) while a `hook`/`title`/`cta` box says the same words, never otherwise.

**Colour.** One accent (`"accent"`, default yellow `#FFD60A`) for the live caption word and `em` words. White boxes with
dark text for hook/CTA; plain white with a stroke for titles. One accent per Reel; never two loud colours in one frame.

**Camera** (origin `50% 32%`, so the face never crops):
| Move | Numbers |
|---|---|
| Punch-in on a key word | 1.12 to 1.20, 0.18 s `power3.out` |
| Framing switch at a jump cut | alternate 1.0 / 1.10 with `set` on the cut frame (it hides the jump) |
| Slow creep across a thought | 1.00 → 1.08 over 3 to 6 s |
| Shake | a 0.25 s hit on a punchline or a drop, one or two per Reel at most |
| Limit | 1.25 (the prepped source is 1080 wide; beyond that it goes soft) |
Never carry a zoom across a cut unless it is the deliberate framing switch.

**Sound.** Reels can be busier than YouTube, but every sound still needs a cause on screen:
| Sound | On | Default volume |
|---|---|---|
| pop | an emoji, a logo, a pill landing | 0.45 |
| whoosh / swipe | a cut to or from B-roll, a big slide-in; never under plain caption text | 0.30 |
| click / tick | a cursor click, a counter, list items | 0.35 / 0.30 |
| ding | a number landing, "done" | 0.30 |
| riser → boom | tension into the big reveal, once per Reel | 0.30 / 0.45 |
| typing | real typing on screen, for exactly that time | 0.25 |
About 3 to 8 sounds in a 30 s Reel. Sounds come from `sfx-synth.py` (made from scratch, free, no licence) or any file
you own dropped into `library/sfx/` (name it `<name>.wav`).

**Music.** Default: none in the file; the user adds a track **inside the Instagram app** (licensed, can use trending audio,
which helps reach, and costs zero tokens). If they want music baked in: a free track from Pixabay Music (no attribution
needed) or YouTube Audio Library, ducked under the voice with the command in "Deliver". Never a commercial song baked in:
Instagram mutes or blocks it.

## Prep and cut stage (raw clip to flat cut)

```bash
mkdir -p "$W/raw" "$W/public" "$W/snaps" && cp "<clip>" "$W/raw/"
python3 "$SK/scripts/prep-source.py" --in "$W/raw/<clip>.MOV" --out "$W/raw/source.mp4" --wav "$W/audio-raw.wav"
npx hyperframes transcribe "$W/audio-raw.wav" -d "$W" --engine whisper --model large-v3-turbo --language sq --json && mv "$W/transcript.json" "$W/transcript-raw.json"
python3 "$SK/scripts/fix-words.py" --transcript "$W/transcript-raw.json" --show      # read it, fix only what changes cuts (wrong words)
auto-editor "$W/raw/source.mp4" --edit audio:-30dB --margin 0.08s,0.25s --export v1 -o "$W/speech.v1"
python3 "$SK/scripts/paper-cut.py" --transcript "$W/transcript-raw.json" --duration <seconds> --out-dir "$W" --speech "$W/speech.v1"
#   read PAPER-CUT.md (Checkpoint A); fix misreads with hand-cut.py (rewrites cut-list.json)
python3 "$SK/scripts/tighten-cut.py" --audio "$W/audio-raw.wav" --cut-list "$W/cut-list.json" --out "$W/cut-list.json" --lead 0.05 --tail 0.08 --maxgap 0.22
python3 "$SK/scripts/sliver.py" --cut-list "$W/cut-list.json" --audio "$W/audio-raw.wav" --fix
python3 "$SK/scripts/edge-audit.py" --audio "$W/audio-raw.wav" --cut-list "$W/cut-list.json" --transcript "$W/transcript-raw.json" --fix
python3 "$SK/scripts/edge-audit.py" --audio "$W/audio-raw.wav" --cut-list "$W/cut-list.json" --transcript "$W/transcript-raw.json"   # 0 issues
python3 "$SK/scripts/apply-cut.py" --input "$W/raw/source.mp4" --cut-list "$W/cut-list.json" --out "$W/public/input-video.mp4"
ffmpeg -y -v error -i "$W/public/input-video.mp4" -vn -acodec pcm_s16le -ar 16000 -ac 1 "$W/audio.wav"
npx hyperframes transcribe "$W/audio.wav" -d "$W" --engine whisper --model large-v3-turbo --language sq --json     # transcript.json, flat-cut time
python3 "$SK/scripts/fix-words.py" --transcript "$W/transcript.json" --show       # then --set / --merge / --sub: the caption text
python3 "$SK/scripts/dead-air.py" "$W" --plan --max 0.30 --max-sentence 0.25 --target 0.15
#   each proposed range: patch-cut.py --cut-list "$W/cut-list.json" --drop-flat A-B, edge-audit, apply-cut, re-transcribe, until 0 pauses
```

`<seconds>` = `ffprobe -v error -show_entries format=duration -of csv=p=0 "$W/raw/source.mp4"`. English Reel: `--language en`.
Several clips: prep each, then
`ingest.py --raw "$W/raw" --out "$W" --concat` on the prepped files.

**How the paper cut decides:** the **last take** of every line wins; restarts inside a sentence, false starts and
spoken markers go with the sentence before them: Albanian **"fshije"**, "edhe një herë", "nga fillimi", "e përsëris",
a lone "prapë"; English "cut that", "scratch that", "start over". Habit that always works: **fluff a line, pause two
seconds, say the whole sentence again.** Albanian fillers ("pra", "dmth", "okej", "ëëë") count as fillers. Where it misreads (a list read as restarts, one sentence
retaken many times with no pause): fix with `hand-cut.py --keep A-B`, then scan the flat transcript for the same 3 to 4
words twice within 7 s.

**Edges:** sentence starts come from the transcript, ends from the audio (Whisper stretches the last word into the
pause). Audit every edge by the audio; a cut in the quiet dip before a sentence's last word deletes that word, so after
each apply compare each segment's last word against the fresh transcript. `apply-cut.py` writes `cut-map.json` (every
jump cut): put framing switches, B-roll or a pop-in on those cuts.

## Composer (`reel-compose.py`) and `storyboard.json`

```bash
python3 "$SK/scripts/reel-compose.py" --spec "$W/storyboard.json" --out "$W/public" --shared library
npx hyperframes check "$W/public"
python3 "$SK/scripts/beat-check.py" --index "$W/public/index.html" --transcript "$W/transcript.json"
python3 "$SK/scripts/snap-beats.py" --project "$W"          # read snaps/sheet.png = Checkpoint B
```

The storyboard is the plan and the source: retiming is editing one number and rebuilding. The full JSON shape is in
`reel-compose.py`'s docstring. Anchors come from `phrase-times.py --transcript "$W/transcript.json" "phrase" ...`; enter
0.1 to 0.25 s before the word.

| Beat | Use for | Default spot |
|---|---|---|
| `hook` | the promise on frame one (white box, accent on `em`) | y 300 |
| `title` | a step or section ("Step 2", "The mistake") | y 330 |
| `emoji` | a reaction (🔥 😳 ✅ ❌ 💸), with `sound: pop` | anywhere in the safe area, beside the face |
| `logo` | naming a tool or brand (white plate, logo only) | y 330 |
| `number` | money, time, a stat; counts up in full digits | y 360 |
| `pills` | 2 to 4 short items, each on its word | left 70, y 330 |
| `image` | a screenshot, a post, a product photo, slow push | y 300, 880 wide |
| `clip` | full-frame B-roll or a screen recording, optional `label` | full frame |
| `cta` | the ask at the end ("Follow for part 2", "Comment GUIDE") | y 330 |
Captions run under all of them (`"captions"` block). Camera ops: `set`, `creep`, `punch`, `release`, `shake`, `layout` (speaker into a corner, bubble or split; see Motion design).

**Variety:** never the same beat type twice in a row (the composer warns). A beat holds 1.5 to 3.5 s; text must read in
under 1.5 s (5 words max in a box). Overlays sit above or beside the face, never on it: check the face position on the
first snapshot and move with `"y"`/`"x"`. What the composer does not build goes in `raw_html` / `raw_js` (1080x1920 px,
root-level, `class="clip"` with `data-start`/`data-duration`/`data-track-index`).

**Snapshot before every render** (seconds vs minutes) and read the sheet: hook on frame one, nothing important under red,
no text on the face, captions readable.

## Motion design (decide, then design)

Full research with sources: `research/motion-design-2026.md` in the project root. The rules below are the working part.

**Every Reel gets a motion plan first.** Before the storyboard, walk the flat transcript sentence by sentence and write
`$W/MOTION-PLAN.md`: one row per line with time, words, **layout mode**, the graphic and the reason. Show it with
Checkpoint B. Ask on every line: "Can a graphic say this better than my face?" Numbers, steps, lists, tools, apps,
comparisons, results and the CTA almost always can. Emotion, trust and punchlines usually need the face.

| Mode | Speaker | Graphics | Use for | How |
|---|---|---|---|---|
| **Face** | full frame | captions + small pop-ins | the opening 2 to 4 s (trust), opinions, punchlines | default |
| **Corner** | `pip-*` / `bubble-*` | 70 to 80 % of the screen | steps, lists, tools, UI, explaining | `["layout", t, "pip-br"]` |
| **Split** | `split-top` / `split-card` / `split-bottom` | half | before/after, reacting to a screenshot, showing a result | `["layout", t, "split-top"]` |
| **Full MG** | hidden (voice continues) | 100 % | the key claim, a stat, a list climax, section breaks, the CTA | opaque full-screen scene in `raw_html` |

- Open on **Face** for 2 to 4 s (the hook text sits above the head), then move. A 30 s Reel is roughly 30 to 40 % Face,
  30 to 40 % Corner/Split and 25 to 35 % Full MG. No mode runs longer than about 6 s, and never two Full MG scenes back to back
  with the same layout.
- Come back to the face for emotional lines and the ask, or end on a Full MG CTA, then let the last frame loop to the first.
- **Layout op:** `["layout", t, preset, dur?, [fx, fy]?]` animates the footage into the box (expo.inOut, 0.5 s).
  Presets: `full pip-bl pip-br pip-tl pip-tr bubble-bl bubble-br split-top split-card split-bottom`, all inside the
  safe area. Set `"face": [x, y]` at the top of the storyboard (the face centre in the 1080x1920 source; check one frame)
  so every layout aims at the face. Design the graphics for the space the layout leaves free (e.g. `pip-br` leaves
  x 60..940, y 230..990 plus the left column).
- Put a soft design behind a shrunken speaker (`.card` ink + grid + glow, or a mesh gradient), never plain black.

**Word → graphic** (pick the one that matches what is said, in time with the word):
| Said | Graphic |
|---|---|
| a number, money, time | count-up / number-wheel, big tabular digits, a bar or ring filling |
| steps, "first / then" | numbered stepper with a progress bar, numbered circles joined by a drawn line |
| a list | stacked chips/cards staggering in, a checklist with drawn ticks |
| an app, a tool, AI | mock UI: window with typing + caret, chat bubbles, notifications, a cursor click with a ripple |
| a comparison | split / before-after wipe, two cards side by side, ✓ vs ✗ |
| the key claim | kinetic type: one huge word per beat, outline echo layers, slam + small shake |
| a result | reveal frame (viewfinder corners, REC dot, timer), confetti, a scroll feed braking on "your" post |
| a question | a typed question card, "?" wobble |
| the CTA | comment feed + input typing the keyword + send, follow button tap |

**The modern look (2026):**
- **Type is the hero.** Oversized, heavy display fonts with dramatic weight contrast (300 against 900, not 400 against 700).
  Use outline + fill echo layers, per-letter or per-word staggers, mask reveals (`clipPath: inset()`), squash-stretch
  (`scaleX/scaleY`) and a slow breathe while holding. Free fonts with Albanian ë/ç: Unbounded, Anton, Archivo Black,
  Bricolage Grotesque, Space Grotesk, DM Sans; download the woff2 into `public/fonts/` and always give a fallback stack.
  Avoid the overused ones (Inter, Roboto, Poppins, Montserrat, Open Sans, Lato).
- **Native phone UI** reads instantly: chat, notifications, prompt windows, comment feeds, tap ripples, progress bars, toggles.
- **Texture over gloss:** CSS grain, halftone, paper/tape/marker (handwritten `hw-*` components), RGB split on hits.
  Grain recipe: `background-image: radial-gradient(rgba(255,255,255,.08) 1px, transparent 1.2px), radial-gradient(rgba(0,0,0,.18) 1px, transparent 1.2px); background-size: 3px 3px, 5px 5px;`
- **Depth:** parallax layers (background slower, foreground 1.3 to 1.5x), 3D tilt cards (`perspective` + `rotationY`),
  floating breathe loops, motion trails/echo on fast moves, motion blur (`motion-blur` component).
- **Layout:** asymmetric, not centre-everything; bento cards assembling; sticker pills; HUD/viewfinder frames. Ink
  `#0B0B0E` and off-white `#F4F1EC` instead of pure black and white; one accent; rapid cuts may alternate ink/accent/off-white panels.
- **Easing vocabulary:** smooth `power2.out` 0.4 to 0.6 s · snappy `power4.out` 0.2 to 0.3 s · bouncy `back.out(1.6 to 2)` ·
  dramatic `expo.out` 0.3 to 0.5 s · dreamy `sine.inOut` · mechanical `steps(5)` (glitch, ticks). Use at least 3 eases per
  scene. Every element keeps moving after it lands (breathe, Ken Burns 1 → 1.03, a counter, a pulse).
- **Pacing:** text finishes entering by the middle of its hold; 1 to 3 words need 2 to 3 s, 4 to 10 words need 3 to 4 s
  (word-synced voice-over text may go faster); a scene stays under 5 s; first tween 0.1 to 0.3 s after a scene starts.
- **Transitions:** most changes are hard cuts on a word. Use 2 or 3 designed transitions per Reel (energy shifts, the
  reveal, the CTA): wipe panel, colour bars sweep, circle iris (`clipPath: circle()`), zoom-through, flash. HyperFrames
  shader transitions also exist (`whip-pan`, `flash-through-white`, `glitch`, `chromatic-radial-split`, `sdf-iris`,
  `cinematic-zoom`, `light-leak`, `cross-warp-morph`); install one and follow its own scene rules.

**HyperFrames power tools:**
- `npx hyperframes catalog <word>` searches 386 ready blocks/components (16 caption styles, 13 lower thirds, shader
  transitions, mock UI, counters, charts, `hw-*` hand-drawn, `confetti`, `success-check`, `typewriter`, `scroll-feed`...).
  `npx hyperframes add <name>` installs one; read its HTML/JS and adapt it into `design.html`/`design.js` in our colours.
- GSAP 3.14 plugins are free (SplitText, DrawSVG, MorphSVG, CustomEase, MotionPath): load them from `vendor/` or the jsdelivr CDN.
- Big pieces can become sub-compositions (`data-composition-src="scenes/x.html"`); the lint warns when the file gets large.

**Workflow for graphics-heavy Reels:** `projects/<p>/design.html` (CSS + every graphic layer as a root `.clip`),
`design.js` (the GSAP timeline, word times from the transcript), `storyboard.base.json` (captions, camera + layout ops,
sfx), and `build.sh` copied from `$SK/assets/mg-build.sh`. Run `./build.sh` → `hyperframes check` → snapshot → render.
Captions stay hidden wherever a graphic already shows the words.

**Brief enhancer (always, before building any animation the user asks for).** The user's request is a seed
("put a luxury animation here", "make this part pop"), not a spec. Expand it into a full brief with
`$SK/assets/animation-brief.md` and save it as `$W/briefs/<section>.md`:
1. **Pin the section:** the exact time window and words, from `phrase-times.py`.
2. **Find the intent:** one sentence on what the viewer must feel or understand. Every choice below serves it.
3. **Pick the layout mode** and the hero element: one idea per section, and the graphic that says the words best (Word → graphic table).
4. **Choreograph beat by beat** on word times: from → to, ease, duration, and why. Use 3 or more eases; finish the entrance
   by half the hold; keep something moving while it holds; one hero move at a time, with supporting elements staggered 0.06 to 0.15 s.
5. **Add the premium layer:** depth (parallax, tilt, blur at the back), light (sweep, glow, shadow), texture (grain),
   type craft (weight contrast, echo, italics), micro-motion (counter, ripple, check draw, seeded particles).
6. **Sound and transitions:** every sound has a cause on screen; the transition in and out match the energy.
7. **Translate vague words** into concrete specs, for example:
   - **"luxury":** black/ivory + champagne gold, serif italics, slow `expo`/`power2.inOut` 0.8 to 1.4 s, light sweeps, gold dust, curtain or mask reveals, soft hits and shimmers
   - **"energetic":** 0.15 to 0.3 s `power4/expo.out`, slams, shakes, alternating colour panels, ticks and pops
   - **"clean / Apple":** off-white, one accent, a big sans, blur-in, spring UI, generous space, quiet clicks
   - **"techy / AI":** mono labels, grids, scan lines, typing, glitch `steps()`, a cyan or electric accent
   - **"fun":** bouncy `back.out(2)`, stickers, emoji, rotation wobble, bright colours
Unless the user asked to skip it, show a 5 to 8 line summary of the brief (intent, layout, hero move, the 3 best details,
sound) and build straight after; their notes go back into the brief, not just the code. When the ask is clear and
small ("add a ✅ on 'done'"), the brief is one line in `MOTION-PLAN.md`.

**Reference styles.** When the user gives a reference (clip, screenshots or a link), save it to `references/<name>/`,
extract a 1 fps contact sheet, and write `references/<name>/STYLE.md`: palette (hex), fonts (or the closest free ones),
type scale, layout habits, motion verbs (slam, slide, mask, glitch...), eases, transitions, texture, pace. Apply that card
to the Reel and keep it for later Reels ("use the <name> style").

## B-roll (free only)

- **Your own clips first** (screen recordings, product shots): proof beats stock.
- **Free stock:** Pexels (free licence, portrait filter, no credit required), Pixabay videos, Mixkit free licence. Never
  a clip labelled AI-generated, never a paid tier, no readable third-party logos. Search with the browser tools;
  the user downloads anything that needs a login (Claude never creates accounts).
- **Conform:** `python3 "$SK/scripts/broll-conform.py" --in <file> --out "$W/public/broll/<name>.mp4" --start <s> --dur <slot+0.5> [--x 0.5] [--grade]`
  (landscape stock is centre-cropped to 9:16; a still becomes a slow push). Read its `.sheet.png`, then a `clip` beat.
- 1.5 to 3 s each, on the words that describe it, with a whoosh only if the cut is a big change.

## Render, verify, deliver

```bash
NODE_OPTIONS=--max-old-space-size=8192 npx hyperframes render "$W/public" --resolution portrait --video-bitrate 20M -o "$W/output-raw.mp4"
ffmpeg -y -v error -i "$W/output-raw.mp4" -c copy -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv \
  -movflags +write_colr+faststart "$W/output-tagged.mp4"
#   loudness to -14 LUFS: a one-segment manifest {"project":"<p>","segments":[{"name":"Reel","file":"output-tagged.mp4"}]}
python3 "$SK/scripts/assemble.py" --manifest "$W/assembly.json" --out "$W/output.mp4"
python3 "$SK/scripts/verify-render.py" --render "$W/output.mp4" --index "$W/public/index.html"      # exit 1 = do not deliver
mkdir -p results && cp "$W/output.mp4" "results/<project>.mp4"
ffmpeg -y -v error -ss <hook frame s> -i "$W/output.mp4" -frames:v 1 "results/<project>-cover.png"
```

- A 30 s Reel renders in about a minute. `--gpu` is fine on a Mac (it uses the bitrate, not CRF).
- **Music baked in** (only when asked; keep a no-music twin):
  `ffmpeg -i output.mp4 -stream_loop -1 -i bed.mp3 -filter_complex "[0:a]asplit=2[v][sc];[1:a]volume=-18dB,afade=t=in:d=0.5[b];[b][sc]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=300[d];[v][d]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.89[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -shortest output-music.mp4`
- **Deliver:** always into `results/` in the project root (the animation-library folder): `<project>.mp4`, `<project>-cover.png`, and `<project>-REEL.md`: a ready-to-paste Instagram
  caption (hook line, 1 to 3 short lines, a CTA, 3 to 5 relevant hashtags), the suggested cover time, and your own
  concerns (a word on the edge of a cut, a beat held long). Open it from Finder; upload from the phone via AirDrop.
- **Upload tips to tell the user once:** upload the file as-is (no in-app trimming, which re-encodes twice); turn on
  "Upload at highest quality" in Instagram settings; add music in the app if wanted, keeping original audio at 100%.

## Traps

- **Every timed element needs `class="clip"`** or it shows for the whole Reel. Keep `data-has-audio="true"` on the footage.
- **Every `<audio>` needs an `id`**, or it is silent in the render while the preview plays fine.
- **Never put CSS transform in the style of an element GSAP moves** (use the separate `translate` property for centring).
- **Text that changes step by step** (typing, counters) comes from one proxy tween, never a `tl.set` per step.
- **The render drops colour tags:** always the BT.709 remux, or faces look redder in QuickTime/Instagram.
- **HDR phone footage** that skipped `prep-source.py` renders washed out or neon. Always prep.
- **60 fps / VFR phone footage** drifts against the cut map. Always prep (it makes 30 fps CFR).
- **Transcript older than the video** fails beat-check: re-transcribe (and re-run fix-words) after every apply-cut.
- **Whisper timings are looser than Parakeet's** (±0.1 s): trust the audio-based edge tools for cuts; anchors still work.
- **Whisper writes commas where you paused for a sentence** (no full stops): the paper cut then sees one long sentence.
  Read PAPER-CUT.md with that in mind and use hand-cut.py where a retake was missed.
- **Snapshot names:** `snapshot --at 8.0` writes `frame-00-at-8s.png` and wipes the folder each run; `snap-beats.py` handles it.

- **`gsap_non_transform_motion`:** `hyperframes check` rejects tweens on `top`/`left`/`width`/`height`: move with `x`/`y`/`scale`.
- **An element that starts hidden** (`opacity:0` in CSS) needs `opacity` in the **destination** of its `fromTo`, or cold render workers leave it invisible.
- **No `Math.random()`:** render workers each load the page, so random layouts flicker. Use a seeded PRNG (e.g. `s = s * 16807 % 2147483647`).
- **Fonts:** a family that fails to load falls back to serif silently. Always give a fallback stack and look at a snapshot.
- **Covering burned-in text** in someone else's footage: opaque panels or blur panels over it, a dark bottom shade for old
  captions, and start the cover 2 to 3 frames **before** the cut, or `verify-render.py` catches a black flash.
- **Flat graphics encode tiny** (under 6 Mb/s fails verify): re-encode the final file with
  `ffmpeg -i output.mp4 -c:v libx264 -preset slow -b:v 14M -minrate 12M -maxrate 18M -bufsize 12M -x264-params nal-hrd=cbr -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv -c:a copy -movflags +write_colr+faststart out.mp4`.
- **`shake` moves `#video-zoom`** and **`layout` moves `#video-wrap`**: never tween `#video-wrap` x/y yourself.
- **Non-9:16 videos** (LinkedIn 4:5 = 1080x1350, 16:9): skip `reel-compose.py` and `assemble.py` (both force 1080x1920). Write `public/index.html` directly
  (root `data-width/height`, see `examples/cyberoz/build.py`), render without `--resolution`, then normalise in one pass:
  `ffmpeg -i output-raw.mp4 -af "loudnorm=I=-14:TP=-1.0:LRA=11" -ar 48000 -c:v libx264 -preset slow -b:v 12M -minrate 12M -maxrate 12M -bufsize 6M -x264-params nal-hrd=cbr -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv -c:a aac -b:a 256k -movflags +write_colr+faststart output.mp4`.
- **Product/website videos:** `npx hyperframes capture <url> -o projects/<p>/capture --skip-vision` grabs the page text, colours, fonts, logo, screenshots and badge SVGs; build from those real brand assets.
- **Trimming a voice line with a fade-out:** put `-ss` **before** `-i` (`ffmpeg -ss 0.42 -i in -t 5.2 -af "afade=t=out:st=5.05:d=0.15"`). With `-ss` after `-i`, `afade st=` counts from the original file's start and fades out early, cutting the last word. Always check the last word's level after trimming.

## Recording tips (tell the user once)

- Phone vertical, 1080p or 4K, 30 fps, at eye level, face in the upper third, light in front of you.
- A clip-on or phone-near mic beats any edit. A second of silence at the start and end.
- Fluff a line: pause two seconds and restart the whole sentence. The last take wins.
- Point where a graphic should go; say numbers in full ("ten thousand"); name tools out loud (logos come from the name).

## Keeping the skill yours

- After every delivery: the note in plain words → one number in the storyboard or one rule here → rebuild → snapshot → render.
- **Likes and dislikes are saved automatically** (see the top of this file): taste → `TASTE.md`, craft → the right section, one-offs → the project.
- **Tokens:** run scripts instead of retyping, read one snapshot sheet instead of many frames, read transcripts only
  through `fix-words.py --show` (compact), and use `phrase-times.py` for timings. Routine edits run fine on a mid-size model.
