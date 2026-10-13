# Ep01 · A Day in the Life of Claude — how it was made

**Result:** `final/a-day-in-claude.mp4` · 96.5 s · 9:16 1080×1920 · 12 scenes · comic style · lo-fi bed + 224 sound effects ·
−14 LUFS · cover `final/a-day-in-claude-cover.png` (the aerial protest). Made 2026-10-09 in one session.
Inspiration: an existing "Day in the Life of Claude" voxel animation (`references/claude-day/`) — same idea, our own story,
character, world and look.

## The story in one line
Claude never remembers; a day in Tirana (alarm → note → toast → kafe me raki → furgon → HQ → the claw/lab → kafe → Pyramid
→ the Flamingo Revolution) ends with Claude writing its own P.S. on the note — and the day loops.

## Scenes (sources in `scenes/sNN/scene.html + scene.js`)
| # | Len | Scene | Best moments |
|---|---|---|---|
| 1 | 7 s | bedroom: clock close-up → alarm OFF → hop off the bed → bathroom door | close-up → pull-back opening; "CLICK!" |
| 2 | 6 | bathroom: over-the-shoulder push into the mirror; the note writes itself | typewriter note = the premise in 3 s |
| 3 | 6 | kitchen: walks in, jumps at the toaster as the toast POPs, sits, 3 bites, leaves right | bite masks that grow; crumbs |
| 4 | 10 | bar: "The usual? Kafe me raki?" / "…I have a usual?"; kafe GULP, rakia GLUG, lemon face BRRR!, dominoes CLACK | the lemon face (most local, most shareable) |
| 5 | 7 | furgon: "QENDËR!", everyone types, Ana: "Help me write a message to my boss: I'll be late 😅", BUMP! | everyday ask, not a nerdy one |
| 6 | 11.5 | HQ entrance → one desk on an endless floor → thousands pop in → high view (ACTIVE SESSIONS, floating requests) → dive into the chat | the reveal of scale |
| 7 | 12.4 | the claw grabs Claude → Lab 3 (QUALITY/EFFORT/REASONING) → recharging, time flies → the claw brings it back → leaves for kafe | the claw is a great recurring device |
| 8 | 7.2 | same bar at 5 PM: "…yes?" + flamingo latte art (foreshadow) | callback + foreshadow in one shot |
| 9 | 7.5 | climbs the Pyramid's colourful steps; reveal of pink dots at the Kryeministria: "…what's that?" | turn-and-reveal |
| 10 | 12.5 | the Flamingo Revolution: Ana "You helped me this morning!" / "…I did?"; HQ doors open, the Claudes march out; night aerial (from the user's photo) + flamingo wave | emotional + spectacle peak |
| 11 | 4.8 | mirror at night: Claude writes the P.S. + sticks the flamingo sticker | the character growing |
| 12 | 8.4 | sleeps (pink lights) → time flies → 7:00 alarm → reads the note, smiles → "Tomorrow, he does it all again." → lands on scene 1's first frame | the loop |

## Strongest points (keep doing these)
1. **One premise, paid off:** "never remembers" drives every joke ("…I have a usual?", "…I did?") and the ending (writing it down).
2. **Callbacks + foreshadowing:** the bar twice, Ana twice, flamingo latte before the protest, the note twice, the loop.
3. **Local specificity:** kafe me raki, furgon "QENDËR!", dominoes, the Pyramid, the Kryeministria — it feels like *Tirana*, not stock.
4. **The comic look** (ink, halftone, misregistration, on-twos, sound words) — the user's verdict: "this is really good".
5. **Scale reveals:** one desk → thousands; one Claude → a river of Claudes at the protest.
6. **Every action has a sound on its frame** (224 cues), with one quiet music bed; no ambience.

## Process that worked
- Script options → user picks → full script → per-scene animation questions → **build ONE scene at a time**, send the MP4, fix,
  then the next. For complex scenes, describe in detail first and let the user adjust before rendering.
- Always: build → read the contact sheet → fix → render. Most bugs were caught this way (see below).
- Reference images from the user (the room view, the protest photo) → match them closely; they were decisive.

## What the user changed (taste learned)
- Character: tried a voxel cube + spark → user chose the **orange block** of the reference with a front view.
- "Make it look like a real room" → furniture, posters, wall clock, string lights, window, plant; furniture must touch the floor.
- Toast: Claude goes **to the toaster** and jumps for it (not the toast flying across the room); table **centred** with a **chair**;
  front door on its **own right wall**.
- Ana's question: an everyday one (message to the boss), not a niche one.
- Scenes 6–7 redesigned by the user: entering HQ, endless floor, thousands, floating screens, the claw, the lab, recharge,
  **the same claw brings it back**, leaves the desk. Elevated office view from a user reference.
- Removed: red flags (not drawn faithfully), the "fan-made / not affiliated" line, the café and crowd ambiences.

## Bugs to avoid next time
- Isometric CSS 3D was hard to frame and looked flat → front-view SVG stage sets were faster and nicer.
- Labels placed in 3D space didn't line up with faces → put eyes etc. inside the character group.
- Scaling a character from its centre made it float → scale around the feet.
- Changing `svgOrigin` inside a moving tween offset the cup/glass → set origins once.
- Things held "in front" were drawn behind Claude → mind the draw order.
- A grey band / misplaced glow came from screen-space overlays → keep light effects inside the world group.
- Duplicate helper names (`pop`) broke a scene → the kit uses `popIn`.

## Numbers
12 scenes · ~96 s · ~35 renders during the session · sound: 224 cues + bed, generated in < 2 s by `sound.py`.
