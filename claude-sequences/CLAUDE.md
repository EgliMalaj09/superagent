# claude-sequences

The home of **the Claude story**: a series of short comic-style animated episodes about Claude (the orange block) living
in Tirana. This folder is only for this story. Everything needed to make a new episode is here: the comic kit, the cast,
the sound engine, the tools, the story bible and the finished episodes with how they were made.

Read before any work: `STORY.md` (who is who, running gags, continuity) · `STYLE.md` (look, motion, sound, kit API) ·
the latest `episodes/*/MAKING-OF.md` (what worked).

## How we make an episode (the user's workflow)
1. **Idea → 3–4 script options** (main points only). The user picks one → write it in full (scene by scene: time, clock chip,
   what we see, text/dialogue) in `episodes/<ep>/SCRIPT.md`. **Wait for approval.**
2. **Animation questions per scene** (AskUserQuestion, recommended option first). Write only CONFIRMED answers to `CONFIRMED.md`.
3. **Build scene by scene.** For each scene: `python3 tools/new_scene.py <ep> <n> --duration <s>` → write `scene.html/scene.js`
   with the kit → `bash tools/build.sh <ep> <n> 0.5,2,4` → **read the contact sheet, fix what looks wrong** → render
   (`bash tools/build.sh <ep> <n> render`) → send the MP4 → adjust until the user approves → next scene.
   Before building a complex scene, describe it in detail and let the user adjust it first.
4. **Sound** after all scenes are approved: propose effects scene by scene with times → write `cues.py` → `python3 episodes/<ep>/cues.py`.
5. **Join + finish:** `python3 tools/join.py <ep> --cover <s>` → `episodes/<ep>/final/<ep>.mp4` (−14 LUFS, 9:16, crossfades 0.35 s).
6. **Close the project (HARD RULE, user 2026-10-09):** when an episode is finished, delete every stand-alone clip and
   intermediate (scene `out.mp4`, `public/`, snapshots, `out-raw*.mp4`, `sound.wav`, test renders). Keep ONLY
   `final/` (the MP4 + cover), the sources (`scenes/*/scene.*`, `project.json`, `cues.py`, docs, assets) and a `MAKING-OF.md`
   (how it was made, strongest points, best practices, what the user changed). Move files to the macOS Trash (never `rm`).

## Rules (from the user's taste)
- Talk to the user in English. On-screen text: English (Albanian words only for local flavour: "QENDËR!", "kafe me raki").
- Characters on twos, camera smooth; soft crossfades 0.35 s between rooms; **no screen shakes, no white/red flashes**.
- Sound: one music bed + real hits only. **No ambience beds** (café murmur, crowd noise). Nothing loud over a voice.
- Real places can be shown (Tirana, the Pyramid, the Kryeministria, the Flamingo Revolution) — peaceful, joyful; no invented
  slogans, no real politicians, no clashes. Flags: none in this story (not drawn faithfully).
- No "fan-made / not affiliated" line (user removed it).
- Verify by looking: build → contact sheet → fix → render. Never send a render you have not looked at.
- Save the user's likes/dislikes the same turn (STORY.md for story facts, STYLE.md for craft).

## Folder map
```
claude-sequences/
├── CLAUDE.md  STORY.md  STYLE.md  package.json (hyperframes 0.8.137 + gsap 3.14.2)
├── library/
│   ├── engines/ build_page.py · motion.js (base helpers) · comic.js (THE KIT: defs, type, cast, props, moves, camera)
│   ├── styles/  base.css · comic.css (ink, misregistration, boom, capbox, bubble, chat, note, endcard)
│   ├── sound/   kit.py (synth effects + lo-fi bed + mixer)
│   ├── sfx/     a few sample sounds (pop, click, tick, typing, whoosh, swipe, ding, glitch, stamp, riser…)
│   ├── fonts/   vendor/
├── tools/       new_episode.py · new_scene.py · build.sh · join.py · finish.sh
├── research/    spiderverse-style.md
├── references/  claude-day/ (the original inspiration clip)
└── episodes/
    └── ep01-a-day-in-the-life/  final/ · scenes/ (sources) · sound.py · SCRIPT.md · CONFIRMED.md · MAKING-OF.md · assets/
```
