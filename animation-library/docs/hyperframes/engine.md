# HyperFrames engine (how this library builds pages)

HyperFrames 0.8.137 renders an HTML page with a **paused GSAP timeline** to MP4 by seeking it frame by frame in headless
Chrome. GSAP 3.14.2. Both pinned in `package.json`.

## The project folder (`templates/new_project.py` creates it)

```
projects/<p>/
  project.json   format (9x16|4x5|1x1|16x9), style, engines, lang, duration (null = voice + 0.8 s), audio
  scene.html     the layers (each a root-level .clip)
  scene.js       GSAP code on `tl`, using the motion kit; W, H, D are defined
  scene.css      project-only CSS (wins over the kit)
  media/         voice-over, photos, clips, logos → copied to public/media
  reference.css  from a style reference (loaded last)
  SCRIPT.md      the approved script
```

`python3 library/engines/build_page.py projects/<p>` writes `public/index.html` = base.css + `<style>.css` +
reference.css + scene.css, the layers, `<audio>` tags, gsap (+ d3/topojson/world map for `map`), motion.js + engines +
scene.js inside one IIFE that registers `window.__timelines[<id>]`. It also copies fonts/vendor/sfx/media and
**prints TASTE WARNINGs** (bed > 0.1 under a voice, sfx > 0.1, too many sfx).

`project.json` audio:
```json
"audio": { "voice": [{"src": "media/vo.wav", "start": 0}],
           "bed": {"src": "bed-vox.wav", "volume": 0.07},
           "sfx": [["stamp", 12.4, 0.08], ["boom", 41.0, 0.1]] }
```
The bed is looped/trimmed to the video with a 0.6 s fade-in and 1.5 s fade-out. Beds in `library/sfx/`:
`bed-news-tension`, `bed-vox`, `bed-explainer`, `bed-luxury-pad`, `bed-tech`. Hits: `stamp boom riser whoosh swipe
shimmer luxhit tick click ding pop glitch typing`.

## Layer markup

```html
<div class="L clip" id="s1" data-start="0" data-duration="6.0" data-track-index="2"> … </div>
```
- `.L` = full-stage absolute layer. `class="clip"` + the three data attributes are required for anything timed.
- `data-track-index` orders layers (bg 1, content 2+, grain 9, audio 80+).
- Kit classes: `.h .kicker .body .quote .num .src .hl(>i,>b) .card .photo .stamp .bar .rule .grain .vignette`,
  plus per-kit extras (news `.scan`, vox `.halftone`, luxury `.gold .hairline`, dossier `.redact`, map `.route .pin`,
  brand `.glass .ui`, isometric `.cam .tilt .spin .bx .chip`).

## Motion kit (`library/engines/motion.js`), all on `tl`, times in seconds

| Function | Does |
|---|---|
| `up(sel, t, d=0.5)` | rise 40 px + fade in, expo.out |
| `fadeIn(sel, t, d=0.4)` / `fadeOut(sel, t, d)` / `out(sel, t, d)` | fades (out also lifts 20 px) |
| `pop(sel, t, d=0.45)` | scale 0.6 → 1, back.out(1.7) |
| `slideIn(sel, t, 'left'|'right'|'top'|'bottom', d)` | 120 px slide, power3.out |
| `blurIn(sel, t, d=0.6)` | blur 18 px + scale 1.06 → sharp (luxury) |
| `words(sel, t, gap=0.07)` | word-by-word reveal |
| `hl(sel, t)` | highlighter / rule wipe (scaleX 0 → 1) on `.hl > i` or `.rule` |
| `growY(sel, t, d, stagger)` | bars grow (scaleY) |
| `stamp(sel, t)` | stamp slam (scale 2.4 → 1, power4.in) |
| `count(sel, a, b, t, dur, fmt)` | number count-up (de-DE grouping by default) |
| `typeIn(sel, text, t, dur)` | typewriter via a proxy tween |
| `draw(path, t, dur)` | SVG stroke draw |
| `kenBurns(sel, t, dur, from, to)` / `drift(sel, t, dur, dx, dy)` | slow push / drift |
| `xfade(a, b, t, d=0.4)` | crossfade two layers |
| `remap([[old,new], …])` | retime the whole timeline after the voice-over arrives |
| `show/hide(sel, t)`, `div(parent, css, cls)`, `rnd()` (seeded), `$()` | utilities |

Engines: **isometric.js** (`world, box, layer, grow, camTo, isoScreen, PAL`; one world + one camera;
`examples/tirana-one/scene.js` is a full film) · **map.js** (`makeMap({center, scale, highlight:['008']})` →
`pin, route, camTo, P, proj`; ISO numeric ids: 008 Albania, 380 Italy, 300 Greece).

## CLI

| Command | Use |
|---|---|
| `npx hyperframes check <public>` | lint + validation (non-transform tweens, missing clip attrs) |
| `npx hyperframes snapshot <public> --at 1,5,10` | contact sheet of stills; read it before every render |
| `npx hyperframes render <public> -o out.mp4 [--resolution portrait] [--video-bitrate 20M] [--gpu]` | MP4 |
| `npx hyperframes transcribe vo.wav -d <dir> --engine whisper --model large-v3-turbo --language sq --json` | word times |
| `npx hyperframes catalog <word>` / `add <name>` | 386 ready blocks (captions, lower thirds, shaders, UI, charts) |
| `npx hyperframes capture <url> -o <dir> --skip-vision` | a site's text, colours, fonts, logo, screenshots |

## Traps (each one has cost a render)

- Missing `class="clip"` → the element shows for the whole video. `<audio>` without `id` → silent in the render.
- Tweening `top/left/width/height` → `check` fails; move with `x/y/scale`. No CSS `transform` on GSAP-moved elements
  (use the separate `translate` property for centring).
- Hidden-in-CSS elements need `opacity` in the `fromTo` **destination**; later entrances `immediateRender:false`.
- No `Math.random()`/`Date.now()`/timers; `repeat:-1` only with a finite duration. Use `rnd()`.
- Text that changes per step (counters, typing): one proxy tween, never a `tl.set` per step.
- Fonts that fail to load fall back silently to serif: always a fallback stack, check a snapshot.
- Renders drop colour tags → always `finish.sh` (BT.709) or faces look red on Instagram.
- Flat graphics encode tiny; `finish.sh` forces CBR 12 Mb/s so Instagram keeps quality.
- Trimming a voice line: put `-ss` before `-i` or the fade-out cuts the last word.
- Non-9:16 formats: don't use `reel-compose.py`/`assemble.py` (they force 1080x1920).
