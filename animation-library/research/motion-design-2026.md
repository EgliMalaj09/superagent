# Motion design for Reels with HyperFrames: research (October 2026)

What looks modern right now, how to build it in HyperFrames, and how to decide where motion design goes in a talking video.
The working rules are in the skill (`.claude/skills/reel-edit/SKILL.md`, "Motion design"); this file holds the reasoning and the sources.

## 1. What modern motion design looks like in 2026

| Trend | What it looks like | How we build it |
|---|---|---|
| **Type as the main visual** | Text is the main character: oversized heavy words that stretch, rotate and break apart, in sync with the voice or beat | Per-letter/word spans or SplitText, `expo.out` slams, outline echo layers, `scaleX/scaleY` squash, mask reveals with `clipPath: inset()` |
| **Texture, not gloss** | Grain, paper edges, tape, marker lines, scratches, jump cuts. Grit beats shiny 3D | CSS dot grain, `hw-*` hand-drawn components, halftone, RGB split on hits |
| **Mixed-media collage** | Cut-out photos, video, illustration and type layered like a moving poster | Cut-out stills over the footage, stickers, rotated cards, tape strips |
| **Vertical-first** | Composed for 9:16: large central type, close framing, swipe transitions, sticker pop-ups | 1080x1920, safe area x 60..940 / y 230..1460 |
| **Motion trails / echo** | Ghost copies trail a moving element (opacity about 70 % → 10 %) | Duplicate layers with a time offset; outline echo rings; the `echo-trail` component |
| **Parallax depth** | Layers move at different speeds (background 50 to 70 %, foreground 130 to 150 %), with soft blur at the back | Several layers with different `y`/`scale` tweens; `parallax-zoom` components |
| **Cel-spin / staggered layers** | Flat shapes spin with 3 to 5 offset copies | Staggered duplicate tweens |
| **Fluid organic transitions** | S-curve eases, nothing stops sharply | `sine.inOut`, `power3.inOut`, CustomEase |
| **Native UI / mock-ups** | Chat, notifications, prompt windows, comment feeds, cursors | The HyperFrames catalog has dozens (`ai-chat-reveal`, `notification-cascade`, `chat-thread`, `typewriter`, `press-ripple`...) |
| **Brand motion systems** | One logo, transition, lower-third and colour rule set across every video | One accent + ink + off-white, one display font, a fixed set of moves per creator |
| **Raw + captions (the "YAP" format)** | Off-the-cuff selfie talk, minimal edit, captions + headline hook | The **Face** mode, with design held back to the hook and captions |
| **Process vs result (split screen)** | Behind the scenes on one side, the polished result on the other | `split-top` / `split-card` layout |

## 2. How layouts for a talking head work

The research and current creator edits use four layouts. Picture-in-picture is the default when the speaker supports a
screen, and split screen when both halves matter equally:

1. **Face:** the speaker fills the frame (hook, trust, punchlines).
2. **Corner / bubble (PiP):** the speaker small in a corner, graphics take most of the screen (explaining, steps, tools).
3. **Split:** the speaker and the graphic share the screen (comparisons, reactions, results).
4. **Full motion graphics:** the speaker hidden, the voice continues (key claim, stats, CTA).

These are now built into the composer as `["layout", t, preset]` ops. The presets are `full`, `pip-bl/br/tl/tr`,
`bubble-bl/br`, `split-top`, `split-card` and `split-bottom`, each aimed at the face and kept inside Instagram's safe area.

## 3. HyperFrames techniques (from the official docs + the local CLI v0.8.137)

- **Seek-safe GSAP:** a paused timeline, explicit positions, `fromTo` when start and end both matter, and only transforms
  and opacity for movement (`top/left/width/height` are rejected by `check`). No `Math.random()`, `Date.now()` or timers;
  no `repeat: -1` without a finite duration.
- **Reading budget per scene:** 1 to 3 words need 2 to 3 s, 4 to 10 words need 3 to 4 s, 11 to 20 words need 4 to 6 s; more is split. Text finishes entering by 50 % of the hold. A scene lasts at most 5 s.
- **Easing by feeling:** smooth `power2.out`, snappy `power4.out`, bouncy `back.out(1.6)`, dramatic `expo.out`,
  dreamy `sine.inOut`, mechanical `steps(5)`. Use at least 3 eases per scene.
- **Keep it moving after it lands:** counters, SVG stroke draw, character stagger, breathing float, bar fills,
  Ken Burns 1 → 1.03, highlight sweep, orbit, glow pulse.
- **Transitions:** about 95 % of scene changes are hard cuts. Use 2 or 3 shader transitions per video at the key moments
  (`whip-pan`, `flash-through-white`, `glitch`, `sdf-iris`, `cinematic-zoom`, `light-leak`, `cross-warp-morph`,
  `chromatic-radial-split`...), 0.3 to 0.5 s, centred on the cut.
- **Typography:** dramatic weight contrast; avoid the overused fonts (Inter, Roboto, Poppins, Open Sans, Lato...); use
  `tabular-nums` for counters; avoid pure `#000`/`#fff`, identical card grids and centre-everything layouts.
- **Catalog:** `npx hyperframes catalog` lists 386 blocks/components (motion primitives, 16 caption styles,
  13 lower thirds, 19 shaders, mock UI, data, 3D, hand-drawn). Install one with `npx hyperframes add <name>`.
- **GSAP is fully free** since 3.13 (Webflow), including SplitText, DrawSVG, MorphSVG, CustomEase and MotionPath.
- **Sub-compositions** (`data-composition-src`) with variables keep big Reels manageable.

## 4. The 4 best places to find reference styles

| # | Resource | Why | How to search it | How to give it to me |
|---|---|---|---|---|
| 1 | **Behance, Motion Graphics** (behance.net/galleries/motion) | The largest library of finished motion projects, often with style frames, colour palettes and the full video in one case study | Search "kinetic typography", "social media motion", "reels motion graphics", "brand motion system" | Send the project link, or save 3 to 6 frames/GIFs into `references/<name>/` |
| 2 | **Dribbble, Animation** (dribbble.com/tags/motion-graphics, /shots/popular/animation) | Short loops of single moves (a text reveal, a UI transition, a counter). Best for "make *this* move" | Search "text animation", "kinetic type", "UI motion", "transition" | Download the shot MP4 into `references/<name>/` |
| 3 | **Motionographer** (motionographer.com) | Curated top-tier studio work, updated weekly. Best for a premium, cinematic look | Browse the latest posts; for titles and brand pieces search "title sequence" or "brand" | Send the link + the timestamp you like |
| 4 | **Pinterest** (pinterest.com, video pins) | The fastest way to collect vertical Reel edit styles from real creators into one board | Search "reels editing style", "motion graphics reel", "kinetic typography vertical", "talking head edit" | Make a board and send it, or screen-record 5 to 10 s into `references/<name>/` |

Bonus: the HyperFrames catalog previews (`npx hyperframes catalog --json` includes preview MP4 links) show what can be
built directly, so pointing at one of those is the most precise reference you can give.

When a reference arrives, I make a contact sheet and write `references/<name>/STYLE.md` (palette, fonts, type scale,
layout habits, motion verbs, eases, transitions, texture, pace), then apply it. Say "use the <name> style" any time later.

## Sources

- [HyperFrames: Animate with GSAP](https://hyperframes.heygen.com/guides/gsap-animation)
- [HyperFrames: Claude Design guide (layout, pacing, easing, shaders)](https://github.com/heygen-com/hyperframes/blob/main/docs/guides/claude-design-hyperframes.md)
- [HeyGen research: HTML to video](https://www.heygen.com/research/html-to-video)
- [GSAP 3.13 release (all plugins free)](https://gsap.com/blog/3-13/)
- [Video and Motion Creative Trends 2026, GDJ](https://graphicdesignjunction.com/2026/01/video-and-motion-creative-trends-2026/)
- [7 Trending Motion Graphic Styles in 2026, Demotion](https://trydemotion.com/blog/trending-motion-graphic-styles)
- [Kinetic Typography guide 2026, IK Agency](https://www.ikagency.com/graphic-design-typography/kinetic-typography/)
- [16 Animation Trends 2026, GarageFarm](https://garagefarm.net/blog/animation-trends-to-watch)
- [Top Instagram Reels Trends 2026, Later](https://later.com/blog/instagram-reels-trends/)
- [Instagram trends creators are doing in 2026, Manychat](https://manychat.com/blog/instagram-trends-for-creators-2026/)
- [Talking-head video styles, Piktochart](https://piktochart.com/blog/talking-head-video/)
- [Split screen vs picture-in-picture, CapCut](https://www.capcut.com/create/split-screen-effects-multi-frame-videos)
- [Motion design inspiration sites, Vinnomedia](https://vinnomedia.com/motion-graphics-inspiration-sites/)
- [Motionographer](https://motionographer.com)
