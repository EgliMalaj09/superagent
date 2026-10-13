# Style guide: every look we can make

Pick a look per video here, then open its card. Two sources:
- **Our own styles**: HyperFrames kits (`docs/hyperframes/style-kits.md`) and style cards from references the user
  liked (`references/<name>/STYLE.md`). Isometric is the usual pattern.io look.
- **huashu-art-motion** (installed skill: `.claude/skills/huashu-art-motion/`, MIT; docs in Chinese): 9 explainer
  grammars and 35 art styles, each with working code, a canvas renderer (`scripts/engine/render.py`, Playwright
  Chromium) and a QA + delivery gate that blocks slideshow-like films. Not licensed: the author's cartoon likeness
  and the Clawd character frames; never use those.

**The user's taste still rules** (`TASTE.md`, `CREATOR-PROFILE.md`): no screen shakes, no white/red flashes, voice
first, one number per beat, soft eases. Where a huashu recipe uses smash cuts or whip pans, tone them down.
**One look per video**, at most two explainer grammars, one palette. Always show 2–3 style stills before building.

## 1. Explainer grammars (how a beat is told)
Card: `.claude/skills/huashu-art-motion/references/动画语法/<id>.md` · overview of all:
`references/09-视频动画语法.md` · demo frames: `assets/动画语法/<id>_总览.jpg` · parameterized clips:
`scripts/engine/clips/<id>.js` + `scripts/engine/examples/<id>.json` (a JSON spec renders a frame-accurate clip,
landscape or portrait, optional transparency; one clip carries at most 8 s).

| id | Grammar | Use it when the voice is… | The rule in one line | pattern.io fit |
|---|---|---|---|---|
| `y1_kurzgesagt` | Kurzgesagt flat | explaining a mechanism, scale, "what's inside" | abstract idea → one concrete object in a glowing world the camera zooms through | ★★★ alternative to isometric for "how X works" |
| `t1_3b1b` | 3Blue1Brown | showing one thing turning into the next | dark ground, only the current object, each concept transforms into the next, colour = concept | ★★★ the user's "make numbers felt" metaphors |
| `t3_finance_chart` | Finance charts | numbers, growth, comparisons people will fact-check | axes first, data grows, highlight one thing; values always honest | ★★★ housing, traffic, any data reel |
| `y5_kinetic_type` | Kinetic type | a list, stages, a quote, an opening number | the word is the actor; one focus per screen | ★★★ hooks and one-number beats |
| `t2_keynote_ui` | Keynote UI | a product, an app, a feature, steps | one thing per screen, product pushed in, names and numbers land on the word; glass cards optional | ★★★ app ads (ePara); matches the premium taste |
| `y2_vox` | Vox collage | news, history, quotes with real material | an investigator's desk: clippings, red lines, highlighter | ★★ we already have a Vox kit; use for exposés |
| `y3_whiteboard` | Whiteboard (RSA) | reasoning step by step | write as you speak, camera moves on one board, zoom out at the end | ★★ who-decides-what explainers |
| `y4_storytime` | Storytime stick figures | first-person stories and jokes | poses snap then hold; jokes land on a reaction close-up and a pause | ★ skits only |
| `y6_presenter_explainer` | Presenter finance explainer | presenter-led explainers | needs your own character assets | ★ later |

Choosing for a voice-over: mechanism → t1 or y1 · news with real material → y2 · list or quote → y5 · product → t2 ·
numbers → t3 (only one number → a big counting number, t2/y5) · step-by-step argument → y3.

## 2. Art styles (how the world is painted)
Cards: `.claude/skills/huashu-art-motion/references/风格配方/<id>.md` · index with quality and weaknesses:
`references/风格配方/INDEX.md` · scene code: `scripts/engine/scenes/<id>.js` · all 35 at a glance:
`assets/全风格总览.jpg`. The demos all share one room (a girl, a cat, a table); **design a new composition for
our subject**, take only the renderer, brushwork, palette and motion.

**Material styles: work on any subject**
| id | Style | Signature motion | Quality | pattern.io fit |
|---|---|---|---|---|
| `16_2026` | Contemporary flat illustration (grain, no outlines) | characters act: jump, react, sign | ★★★ | ★★★ modern explainers |
| `30_matisse` | Matisse cut paper | paper pieces float and sway | ★★★ | ★★★ warm, bold, Instagram-friendly |
| `13_pop` | Lichtenstein pop comic (Ben-Day dots) | Warhol colour swaps, onomatopoeia boxes | ★★★ | ★★★ satire, political skits |
| `24_hopper` | Hopper hard light | a sunbeam slowly crosses the room | ★★★ | ★★ moody: emigration, empty city |
| `26_vaporwave` | Vaporwave / neon | grid rolls, sign flickers, VHS noise | ★★★ | ★★ tech and AI topics |
| `14_8bit` | 8-bit pixel | blocks pop coins, HUD hearts | ★★★ | ★★ games, AI jokes, retro |
| `09_postimp` | Van Gogh | swirling sky, flowing brushstrokes | ★★★ | ★ art pieces |
| `12_bauhaus` | Bauhaus geometry (narrow use) | geometry rotates and swaps | ★★★ | ★★ design/architecture topics |
| `22_constructivism` | Soviet constructivist poster (narrow use) | slogans stamp in word by word | ★★★ | ★★ communist-era Albania history |
| `04_roman` | Roman mosaic (narrow use) | mosaic borders flow | ★★★ | ★★ Illyrian/Roman Albania |
| `25_ghibli` | Ghibli watercolour | curtains in the wind, grass sways | ★★ | ★★ nostalgic, gentle |
| `35_shinkai` | Shinkai light (clouds, god rays) | light particles, clouds move | ★★ | ★★ emotional endings |
| `17_ink` | Chinese ink wash | strokes write themselves, ink spreads | ★★ | ★ |
| `08_impressionism` · `29_seurat` · `11_cubism` · `32_rembrandt` · `15_raytrace` | painterly / CGI | | ★–★★ | ★ |

**Era styles: best for time travel, history speedruns, tributes**
`01_cave` · `02_egypt` · `03_greek` · `05_gothic` · `06_renaissance` · `10_nouveau` (Mucha) · `18_klimt` ·
`19_munch` · `20_dunhuang` · `21_kusama` · `23_dali` · `27_kirby` · `28_monet` · `31_haring` · `33_rubberhose`
(1930s cartoon) · `34_shadowpuppet` · `36_picasso_blue`. Good for: Albanian history through the ages, Albanian
Monsters (egli_ai), "walk through famous paintings" pieces (`scripts/engine/demos/long_scroll/`).

## 3. Our own styles
| Look | Where | Use |
|---|---|---|
| Isometric world (the usual pattern.io look) | `library/styles/isometric.css`, `examples/tirana-*` | story, world, emotion; mix with kinetic numbers and honest charts |
| News · Vox · Luxury · Dossier · Map · Brand | `docs/hyperframes/style-kits.md` | see the kit doc |
| Doc-reel (AI images, film look) | `doc-reel` skill (Remotion) | documentaries, exposés |
| `car-decor`, `morning-routine`, `photo-parallax`, `pinterest-fall` | `references/<name>/STYLE.md` | reference looks the user liked |

## Taste log
Newest first. Add a dated line when the user picks, likes or rejects a look.
- 2026-10-13: huashu-art-motion installed; first real test is the "AI jobs" pattern.io Reel.
