# Spider-Verse comic look — research + how we build it (HyperFrames / SVG / GSAP)

Source of the request: `references/claude-day/ref.mp4` + `projects/a-day-in-claude-animation/assets/room-view-reference.webp` (user, 2026-10-09).

## What makes the look (research)
| Ingredient | What it is in the films / the reference | Source |
|---|---|---|
| Halftone (Ben-Day) dots **as lighting** | Dots sit in highlights and light falloff, not as decoration; they replace smooth gradients | marilajane substack; GarageFarm Blender guide |
| **Hatching** in shadows | Parallel line hatching instead of soft shadow falloff | 3danimationcrystal (UAL) research blog |
| **Misregistration / chromatic aberration** | Imitates old comic printing errors; also replaces depth of field (background "separated" by colour offset, not blur); subtle on faces, stronger on backgrounds | marilajane; GarageFarm |
| **Ink line work** | Hand-drawn-looking outlines with deliberate imperfections | marilajane |
| **Animating on twos** | Stepped character animation (12 drawings/s) instead of smooth CG; camera can stay on ones | Sony Pictures Imageworks (via sources above) |
| **Smears** instead of motion blur | Geometry stretched on fast moves | prolificstudio blog |
| **Comic graphics** | Onomatopoeia bursts, caption boxes, panel inserts | prolificstudio; ceros "making comics come alive" |

Links: https://marilajane.substack.com/p/into-the-spider-verse-animation-techniques ·
https://blog.garagefarm.net/blog/recreating-the-spider-verse-look-in-the-blender-node-editor ·
https://www.blendernation.com/2024/01/15/7-steps-to-make-a-spiderverse-shader-in-blender/ ·
https://3danimationcrystal.myblog.arts.ac.uk/2021/01/12/research-and-report/ ·
https://blog.prolificstudio.co/blog/spiderman-into-the-spiderverse/ · https://view.ceros.com/editorial-content/spider-verse-desktop
(Several are student/tutorial sources; the on-twos and smear points are the most consistent.)

## Our recipe (free, in the browser)
1. **Flat cel colours, 2–3 tones per object** (base / shade / highlight), hard-edged shadow shapes (e.g. the bed's shadow on the wall).
2. **Ink outlines**: every main shape gets `stroke:#1D1530; stroke-width:4–6; stroke-linejoin:round`.
3. **Halftone**: SVG `<pattern>` of dots; dark dots on shadow faces (side of a box, under furniture), light/coloured dots inside light pools masked by a radial gradient (`<mask>`), so the dots ARE the light.
4. **Hatching**: SVG line pattern on cast shadows on walls.
5. **Misregistration**: CSS on the whole picture — `filter: drop-shadow(3px 0 0 rgba(255,40,140,.35)) drop-shadow(-3px 0 0 rgba(30,200,255,.35))` (stronger on the room, lighter on the character layer).
6. **On twos**: character tweens use GSAP `ease: 'steps(N)'` with N ≈ duration × 12; the camera stays smooth.
7. **Smears**: stretch the character (scaleX 1.15–1.3) on the first step of a fast move.
8. **Comic type**: onomatopoeia in yellow/white with thick black outline, slight rotation, offset shadow; caption boxes (yellow, black border, condensed caps: "7:00 AM · RISE AND SHINE").
9. **Paper**: a faint dot screen over everything + soft vignette.
