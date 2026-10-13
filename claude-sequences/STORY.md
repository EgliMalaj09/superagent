# The Claude story — bible

## Premise
Claude is a small orange block who lives in Tirana and helps everyone all day. **It never remembers yesterday.** Every
morning a sticky note on the bathroom mirror tells it who it is. People remember Claude; Claude doesn't remember them —
that gap is the heart (and the comedy) of the series. Slowly, Claude learns to *write things down*.

## The cast (all built in `library/engines/comic.js`)
| Character | Look | Role / running gags | Kit call |
|---|---|---|---|
| **Claude** | orange voxel block, two tall black eyes, 4 short legs, stub arms, halftone side | kind, curious, overwhelmed, never remembers; "…I did?" | `claude(parent, id)` |
| **Ana** | student, purple hoodie, round glasses, ponytail, yellow backpack straps | met in the furgon (message to her boss), recognises Claude at the protest, gave it the flamingo sticker: "Write it down so you remember!" | `ana(parent, x, y, s)` |
| **The barista** | white shirt, black apron, moustache, flat hair | "The usual? Kafe me raki?" — Claude: "…I have a usual?" | `barista(...)` |
| **The furgon conductor** | green jacket, cap | leans out shouting "QENDËR! QENDËR!" | `conductor(...)` |
| **The scientist** | lab coat, cyan goggles, clipboard | Lab 3: tests QUALITY / EFFORT / REASONING | `scientist(...)` |
| **The old men** | flat caps, plastic table outside the bar | always playing dominoes: CLACK! | `person(...)` ×2 |
| **The thousands of Claudes** | identical blocks at endless desks | appear when Claude starts working; march out of HQ with flamingos | rows of `claude()` / `<use>` |

## Places (Tirana)
Claude's bedroom (lavender walls, blue door to the bathroom, pink window, "THINK!" / "hello, world" / "be kind" posters,
twin-bell alarm) · the bathroom mirror + the note · the kitchen (toaster, centred table + teal chair, front door on the right
wall) · the corner bar "BAR · KAFE" (KAFE 70 LEK / RAKI 100 LEK, TV football, old men outside) · the furgon · HQ (lavender
tower) and the endless office floor (pink wall, hanging stats screens) · Lab 3 + the recharge room · the Pyramid of Tirana
(colourful step-boxes) · the boulevard at the Kryeministria (the Flamingo Revolution, night aerial).

## Continuity (what has happened)
- **Ep01 "A Day in the Life of Claude":** alarm → note → toast → kafe me raki (lemon face) → furgon (Ana) → HQ, thousands
  of Claudes, chat montage → the claw → Lab 3 → recharge → back to work → 5 PM kafe (flamingo latte) → the Pyramid →
  the Flamingo Revolution (Ana: "You helped me this morning!" / "…I did?"; the Claudes march out) → writes
  "P.S. Flamingos, 7 PM. Don't forget! ♥" + sticks the flamingo sticker → sleeps → 7:00 AM again (loop).
- The note now reads: You are Claude. / Be helpful. / You won't remember yesterday. / That's okay. ♥ /
  P.S. Flamingos, 7 PM. Don't forget! ♥ (+ flamingo sticker). Use `NOTE_LINES` + the P.S. in later episodes.

## Episode ideas (not confirmed)
Claude on vacation (Sarandë / Zvërnec, messages pile up) · Claude meets an Albanian mother ("Have you eaten?" ×10) ·
the worst user (same question 50 times) · night shift (2 AM questions) · the furgon conductor's day · Ana's exam day.
