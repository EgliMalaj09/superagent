# Zoti i Shqipërisë — storyboard and asset map

77.5 s · 1080×1920 · 30 fps · 2324 frames. Voiceover: ElevenLabs "George", 73.8 s, starts at frame 60.

> The voiceover file isn't in this folder. Download it again from ElevenLabs history (generated
> 2026-10-04 21:38, voice George) and save it as `public/audio/voiceover.mp3`. Then
> `npm install && npm run audio && npm start`. Timings in `src/timing.ts` match that exact file.

> **2026-10-08:** all screen shakes and red/white flashes were removed (split face, portrait-wall stamps,
> money-montage cuts → 10-frame crossfades, crown reveal). Sound levels are still the original ones (SFX_GAIN 0.3,
> music 0.3 under the voice); new videos use the quieter template defaults.

| Scene (id) | Frames | VO line | What happens | Images |
|---|---|---|---|---|
| title | 0–60 | (silence) | "ZOTI I SHQIPËRISË" flickers on, boom | — |
| hook | 60–399 | 1 | 2013 rally, gold weld frame detaches, "2013" + "SHQIPËRIA E RE" slams, three promises ping-pong in | characters/rama-2013.jpg |
| split | 399–468 | "Trembëdhjetë vite…" | warm half, red half wipes in with a seam glow, "13 VITE MË VONË" | characters/rama-split.jpg |
| transformation | 468–612 | 2 | back view at an empty parliament, colour drains to red, "KRYEMINISTËR" struck through, "ZOTI" slams | characters/rama-silhouette.jpg |
| fallen | 612–1053 | 3 | 2×3 portrait wall flies in, verdict stamps over the eyes (no flash), "LISTA NUK MBARON" | tahiri, koka, ahmetaj, balluku, veliaj, hyseni |
| loot | 1053–1418 | 4 | 4 beats with crossfades: €430M counter / tunnel beacons / AKSHI laser + glitch / vault "MILIARDA TË ZHDUKURA" + typewriter | scandals/*, characters/rama-vault.jpg |
| twist | 1418–1743 | 5 | surveillance room: swinging lamp, flicker, CCTV HUD, waveform, "NËN ARREST SHTËPIAK", "SHTETI E MBRONTE." | characters/hyseni.jpg |
| coronation | 1743–2324 | 6 | recap stamps over the blurred throne → reveal → zoom-through into the face → crowned throne, "ZOTI I SHQIPËRISË", fade | characters/rama-throne.jpg, rama-throne-crowned.jpg |

Unused but kept: `props/crown.jpg` ("Mbreti bythqir" crown) and `props/crown-shqiperise.jpg`
(both keyed with `useKeyedImage`, used in an earlier crown close-up scene that was removed).

Original image numbering from the chat → filename: 1 rama-2013 · 2 rama-silhouette · 3 rama-throne ·
4 ahmetaj · 5 tahiri · 6 koka · 7 balluku · 8 veliaj · 9 rama-vault · 10 hyseni · 11 crown ·
12 llogara-tunnel · 13 akshi-server-room · 14 llogara-money-pile · 15 rama-split ·
16 rama-throne-crowned · 17 crown-shqiperise.
