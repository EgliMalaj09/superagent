# A Day in the Life of Claude — confirmed decisions
Only decisions the user has confirmed go in this folder (no trials, no unchosen options).
Reference (inspiration only, do not copy): references/claude-day/ref.mp4 — 91 s, 16:9 voxel 3D, no voice, music + comic SFX bursts, timestamp chips.

## Confirmed 2026-10-09
- Angle: Mix A + C — the no-memory story (wakes up blank, reads a note to learn who it is, context backpack fills up, loops) set in Tirana with local details.
- Look: voxel 3D built in code (HyperFrames isometric engine). No image assets needed.
- Format: 9:16 vertical, English on screen.
- Sound: one music bed + a few quiet hits (4–5 real comedy beats only, ≤0.1).
- Story: option 1 "The Sticky Note" + Flamingo Revolution twist (Pyramid at 6 PM, protest at the Kryeministria at 7 PM, coffee at 5 PM). Kafe + rakia at the coffee bar. Full approved script: SCRIPT.md.

## Confirmed 2026-10-09 — animation questions (scene by scene)
- Character: coral cube body, two big square eyes, small glowing 4-point spark on top (lights when it thinks), tiny legs, backpack = context.
- Camera: one continuous isometric camera gliding across a Tirana diorama (flat → bar → furgon → tower → Pyramid → Kryeministria), no cuts.
- Scenes 1–2: push over Claude's shoulder into the mirror; the note's text writes itself line by line.
- Scenes 3–4: bar with old men at domino/backgammon outside, TV showing football, plastic chairs, "Kafe 70 lek" sign; furgon chaos (conductor shouting the route from the door, people squeezed in, bumpy bounce). Keep props minimal, focus on the character and chat bubbles.
- Scenes 5–6: a dark glowing grid tower, every window a tiny Claude at a desk; camera rises the facade as ACTIVE CHATS climbs, then dives into one window. Context full = backpack inflates with objects poking out, Claude tips back, objects hug into one glowing cube, backpack deflates with a soft pop.
- Scene 8: Claude climbs the colourful step-boxes as the sky goes orange; at the top the camera swings to reveal the boulevard filling with pink flamingos at the Kryeministria.
- Scene 9: dense crowd of voxel people and inflatable flamingos; tower doors open and a river of Claudes flows in; phone lights; a flamingo wave; camera rises to a top view of a pink sea.
- Text: small rounded clock chips ("7:00 AM · wake up"), white speech bubbles, sound-words as bold outlined letters (no starbursts). Our own look.
- Ending (warm loop): night writes the P.S., sleeps, pink lights outside. Morning: same alarm, reads the P.S., looks at the flamingo sticker, smiles; title card + "fan-made parody · not affiliated with Anthropic" + Patternio badge; last frame = first frame.
- Music: light lo-fi/indie bed (synthesized or library bed-tech), swells at the protest.

## Confirmed 2026-10-09 — assets and audio
- No Patternio logo in this video (no badge, no sign-off mark). The end card keeps the "fan-made parody · not affiliated with Anthropic" line.
- No voice-over for now (the user may add a voice at the end). Audio = music bed + quiet hits only.
- Character reference from the user: assets/character-reference.jpg — an orange pixel-art blob with two black eye bars, small stub arms, and a black laptop it leans on. The user has not yet said whether to use this 2D pixel look or keep the voxel 3D plan.

## Confirmed 2026-10-09 — character
- The Claude character is the user's design: assets/character-reference.jpg (orange pixel blob, black eye bars, stub arms, black laptop). Claude's own design (assets/character-mine.svg) is not used.
- Open: whether the world is pixel art to match, or voxel 3D with the pixel character.

## Confirmed 2026-10-09 — REVISED (latest word wins)
- Character: Claude's own design (coral voxel cube, two square eyes, glowing gold spark on top, tiny legs, dark backpack). The user's pixel blob is NOT used. assets/character-mine.svg is the reference.
- World: voxel 3D everywhere (isometric engine), matching the earlier suggestion.
- Build method: scene by scene. Each scene is built, snapshotted and approved before the next one starts.

## Build progress
- Scene 1 (0–4 s): v3 snapshot made. Room, bed, nightstand + alarm, coral Claude cube, spark and "?" bubble present. Open: spark and "?" sit over the nightstand instead of Claude; eyes sit on the top face. Awaiting user review before scene 2.

## Confirmed 2026-10-09 — scene 1 room (user direction)
- The bedroom must feel like a real room, laid out like the reference frame in assets/room-reference.webp: bed with blue mattress and orange headboard, nightstand with a twin-bell alarm clock showing 7:00, lamp, window with pink sky, desk with laptop, bookshelf, plants, posters.
- Scene 1 opens on a CLOSE VIEW of the ringing clock, then pulls back to the room, then Claude wakes.

## Confirmed 2026-10-09 — REVISED AGAIN (latest word wins)
- Camera: the reference's FRONT view (not isometric). Room layout and style from assets/room-view-reference.webp.
- Claude: the reference's orange block character (coral-orange voxel block, two black eyes, short legs). Not the spark version.
- Scene 1 now runs ~7 s: close on the ringing clock → the alarm is switched off → Claude gets up and walks to the bathroom door (the door is on the left wall) → goes in.
- Build: SVG 2.5D front view with GSAP timeline (style: flat shapes, halftone, soft shadows, lamp glow).

## Confirmed 2026-10-09 — style
- Look: Spider-Verse comic style on the reference room (research: research/spiderverse-style.md): ink outlines, 2–3 cel tones, halftone dots as light, hatched cast shadows, magenta/cyan misregistration, character animated on twos (stepped), comic onomatopoeia + yellow caption boxes.

## Build progress
- Scene 1 APPROVED (v6, results/a-day-in-claude-scene1-v6.mp4): clock close-up → alarm off → Claude walks into the bathroom. Files: scenes/s01/.
- Scenes now live in scenes/sNN/ (each a HyperFrames project); they get joined at the end.
- NEW scene inserted (user, 2026-10-09): after the bathroom, a quick BREAKFAST scene, max 4 s — Claude eats a toast. Becomes scenes/s03; the coffee bar moves to s04.
- Scene 3 REVISED (user): Claude enters from the left → the toast pops → Claude jumps and catches it → walks to a table, sits and eats it → gets up and leaves through the front door (leaving home). ~6 s (more actions than fit in 4 s).
- Scene 3 APPROVED with the toaster-grab change (v4, results/a-day-in-claude-scene3-v4.mp4): Claude walks to the counter, jumps at the toaster as the toast pops and grabs it.
- Scene 4 extended (user): after '…I have a usual?' Claude downs the kafe in one shot, then the rakia in one shot, makes a sour 'lemon face' (rakia is strong), then leaves the bar. ~10 s.
- Scene 4 v2 delivered (kafe + rakia one shot, lemon face, leaves).
- Scene 5 (furgon) plan APPROVED: exterior (furgon stops, conductor shouts "QENDËR! QENDËR!", Claude runs in from the left and squeezes in) → push through the side window → inside: 5 blocky passengers typing, chat bubbles fly to Claude → Ana (purple hoodie, round glasses, ponytail, backpack — she returns at the protest) asks: "Help me write a message to my boss: I'll be late 😅"; Claude: "On it!"; Ana smiles → pothole "BUMP!" everyone bounces, veggies jump → pull out, furgon drives off right. Caption "8:15 AM · FURGON". ~7 s.
- Scene 5 delivered (results/a-day-in-claude-scene5-v1.mp4).
- Scenes 6+7 REDESIGNED by the user (replaces the office tower + "context full"; no backpack):
  s06 (9:00 AM, ~9.5 s): only Claude's desk on an endless floor → it starts working → thousands of identical Claudes at desks pop in → zoom out → floating screens in the air (ACTIVE SESSIONS growing, USAGE CREDITS, TOKENS/SEC…) → camera moves into Claude's screen: a fast chat montage with users ("how do I center a div?", "make the logo bigger", "does my boyfriend love me?", …).
  s07 (~10 s): a giant CLAW (ganxhë) comes from the top, grabs Claude, carries it to the LAB → scientist with science gear and screens (QUALITY, EFFORT…) → the claw drops Claude on a pedestal → cut to another lab section: Claude goes through a RECHARGING flow, time flies → back at its desk working 1–2 s → (next: cut to the same bar, 5 PM).
- Scene 6 zoom-out REVISED (user reference image): elevated 3/4 view over endless rows of desks (pink back wall, purple floor with cyan grid), big hanging screens (ACTIVE SESSIONS centre, TOKENS/SEC, QUEUE DEPTH, LATENCY), some Claudes in other colours, glowing floating request labels (our own lines), particles. Our Claude front-centre with a plant on its desk; the camera dives into its screen → chat.
- Fixes (user): s06 opens with Claude ENTERING the office building; s07: the SAME claw carries Claude back to its desk after recharging; s07 ends with Claude LEAVING the desk (off to the 5 PM kafe).
- Scenes 8 (bar 5 PM, flamingo latte) and 9 (Pyramid climb + boulevard reveal) delivered.
- Scene 10 reference (user photo, assets/protest-reference.webp): night aerial down the boulevard by the Kryeministria, warm-lit buildings both sides, trees + street lamps, towers far away, packed crowd with red Albanian flags + pink flamingos, banners.
- Scenes 10–12 built; full reel joined (0.35 s crossfades, no audio): results/a-day-in-claude.mp4 (96.5 s) + cover (the aerial protest frame).
- User (2026-10-09): remove the 'fan-made parody · not affiliated with Anthropic' line; remove the red flags from the protest (this video only — not real Albanian flags); replace with flamingos. Everything else approved.
- Full sound design added (sound.py → sound.wav: 231 cues — every effect from the plan + café/crowd/night ambiences + synthesized lo-fi bed with protest swell). Final: results/a-day-in-claude.mp4.
- Removed café + crowd ambiences (user). Final re-exported.
