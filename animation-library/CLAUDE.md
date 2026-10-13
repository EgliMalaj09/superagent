# animation-library

The user's studio for making **Reels, motion graphics and AI-image documentaries with Claude Code**, free local
tools only. Albanian and English. It merges two systems that were each built and tested on real videos:

- **HyperFrames** (HTML + GSAP rendered to MP4 in headless Chrome) + FFmpeg + Whisper: talking-head Reel editing,
  explainers, data videos, maps, isometric 3D, luxury/brand/marketing pieces.
- **Remotion** (React → MP4): voiceover-led cinematic documentaries built from AI-generated photos
  (reference: "Zoti i Shqipërisë").

**Read `TASTE.md` before every brief, script and build. It overrides every default in this repo.**

## Route the request

| The user says | Skill | Engine |
|---|---|---|
| "Edit this reel" + a phone clip | `reel-edit` | HyperFrames |
| "Make an animation / explainer / data video / map / chart about …", "animate this voice-over", "marketing video for <url>" | `motion-video` | HyperFrames |
| "Make a documentary / exposé / story video about <person, scandal, history>" with AI images, voiceover, film look | `doc-reel` | Remotion |
| "Use this as a reference style" + a video, images or a link | `style-reference` | either |
| A huashu look from `docs/style-guide.md` (Kurzgesagt, 3Blue1Brown, finance charts, kinetic type, Matisse, pop, 8-bit…), "make it in the style of <artist/era>", "recreate this animation" | `huashu-art-motion` | huashu canvas engine |
| Not sure | read `docs/00-choose-engine.md`, recommend one in a sentence, go | |

**Choosing a look:** `docs/style-guide.md` lists every look we can make (our kits and style cards, plus the
huashu grammars and art styles) with what each is good for. Show 2–3 style stills before building.

Finished videos always go to `results/` (MP4 + cover PNG). Each new video lives in `projects/<name>/`.

## Working rules (from the user's taste)

1. **Script first.** Before any animation, show the script / storyboard (scene by scene: time, words, what we see)
   and wait for approval. For data and political videos, check every number and claim and show sources.
2. **Brief enhancer.** Turn a short ask ("make it luxury here") into a full brief (`templates/animation-brief.md`).
   Show a 5–8 line summary, then build.
3. **Voice leads.** Music bed ~15 dB under the voice (~0.07 when the voice is 1.0). Sound effects very few and quiet
   (≤ 0.1), only on real hits (a stamp, the ending). **No sound effects on text or slide entrances.**
4. **Smooth, not harsh.** Soft fades/slides (0.3–0.45 s, `power3.out`), crossfades (0.35–0.4 s) between parts.
   **No screen shakes. No red (or white) flashes.** Best of all: one continuous camera move (see `examples/tirana-one`).
5. **Facts.** Only real, sourced numbers; never invent claims, testimonials, quotes or statistics. Source on screen.
   Criticise decisions and public figures with evidence; satire (crowns, titles) is fine, fabricated events are not.
   Never target a people, religion or private person; never call for violence.
6. **Language.** Talk to the user in English. Everything spoken or shown on screen is in the video's language
   (usually Albanian; see `docs/craft/albanian.md`).
7. **Save taste automatically.** When the user likes or dislikes something, write it into `TASTE.md` the same turn
   (taste) or into the right skill/doc (craft), and say in one line what was saved.
8. **Verify by looking.** Snapshot/still frames before every render, read them, then render.
9. **Tokens:** run scripts, read one contact sheet instead of many frames, keep replies short.

## Folder map

```
animation-library/
├── CLAUDE.md  TASTE.md  START-HERE.md  setup.sh
├── package.json              ← hyperframes 0.8.137 + gsap 3.14.2 (pinned)
├── .claude/skills/
│   ├── reel-edit/            ← talking-head Reel editor (Whisper, paper cut, composer, 29 tests)
│   ├── motion-video/         ← HyperFrames motion graphics, data, maps, isometric, brand
│   ├── doc-reel/             ← Remotion AI-image documentary pipeline
│   └── style-reference/      ← reference clip/images/link → STYLE.md
├── docs/
│   ├── 00-choose-engine.md   README.md (index)
│   ├── doc-reel/             ← pipeline, script, voiceover, image prompts, motion, look, sound, Remotion, lessons
│   ├── hyperframes/          ← engine + motion kit API, style kits
│   └── craft/                ← motion principles, platforms & delivery, GSAP + Remotion cheat-sheets, resources, Albanian
├── library/                  ← fonts (ë/ç), sfx + music beds, vendor (gsap, d3, topojson, world map), engines, styles, img
├── templates/                ← new_project.py, SCRIPT.md, animation-brief.md, finish.sh, join.sh
├── remotion/template/        ← clean Remotion engine to copy for a doc-reel
├── research/                 ← motion-design research 2026 (+ sources)
├── references/               ← style references the user gives (+ STYLE.md each)
├── examples/                 ← finished projects to copy from (see docs/README.md for the list)
├── projects/                 ← one folder per new video
└── results/                  ← finished MP4s + covers
```

## Fast paths

HyperFrames
- New: `python3 templates/new_project.py <name> --format 9x16|4x5|1x1|16x9 --style news|vox|isometric|luxury|dossier|map|brand`
- Build page: `python3 library/engines/build_page.py projects/<name>`
- Check: `npx hyperframes check projects/<name>/public` · `npx hyperframes snapshot projects/<name>/public --at 1,5,10`
- Render: `NODE_OPTIONS=--max-old-space-size=8192 npx hyperframes render projects/<name>/public -o projects/<name>/out-raw.mp4`

Remotion
- New: `cp -R remotion/template projects/<name> && cd projects/<name> && npm install`
- `npm run pauses` · `npm run audio` · `npm start` (Studio) · `npm run stills -- 120 450` · `npm run build`

Both
- Finish for Instagram/LinkedIn (−14 LUFS, BT.709, CBR, cover): `bash templates/finish.sh <in.mp4> results/<name>.mp4 [cover_s]`
- Join parts with 0.4 s crossfades: `bash templates/join.sh out.mp4 part1.mp4 part2.mp4 …`
- First time on a machine: `bash setup.sh`
