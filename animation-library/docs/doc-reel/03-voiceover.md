# 03 — Voiceover (ElevenLabs)

The user generates the voice. Give them this package, then measure the result.

## Voice design prompt (male)

```
Albanian male narrator, 40–50 years old, deep gravelly baritone, smoky and controlled.
Slow HBO documentary delivery, ominous and prosecutorial, cold conviction, long weighted
pauses, native Tirana accent, zero foreign inflection. Dark true-crime narrator tone.
```

Female alternative:
```
A 35–45 year old Albanian female narrator, low alto register, husky and controlled.
Measured, prosecutorial delivery, like a journalist reading an indictment. Native
Tirana accent, zero smile in the voice, cold conviction.
```

The Zoti reel was voiced with the ElevenLabs library voice "George — Warm, Captivating Storyteller"
(model v3). It worked well in Albanian.

## Settings

| Setting | Value |
|---|---|
| Model | Eleven v3 (fallback: Multilingual v2) |
| Stability | 45 |
| Similarity | 85 |
| Style exaggeration | 35 |
| Speaker boost | on |
| Speed | 0.90 |

## Full-script format (one generation, one MP3)

Audio tags in brackets steer delivery in v3. `[long pause]` between lines gives clean scene breaks.

```
[somber, slow, documentary narrator] Në vitin 2013, [pause] Edi Rama premtoi një Shqipëri të re. [pause] Pa korrupsion. [pause] Pa oligarkë. [pause] Një shtet për qytetarët.

[long pause]

[cold] Trembëdhjetë vite më vonë, [pause] ai nuk është më Kryeministër. [pause] [whispers] Ai është bërë diçka tjetër.

[long pause]
...
[ominous, building intensity] ... [whispers, final punch] Ai është [pause] Zoti i Shqipërisë.
```

Useful tags: `[somber]` `[cold]` `[grave]` `[prosecutorial, slow]` `[contemptuous]` `[darker]`
`[heavier]` `[low, quiet]` `[whispers]` `[ominous, building intensity]` `[pause]` `[long pause]`.

## After the MP3 arrives

1. Save as `public/audio/voiceover.mp3`.
2. `npm run pauses` prints one line per spoken phrase with start/end seconds. macOS `afconvert`
   decodes it (ffmpeg works too).
3. Map phrases to script words. Example from the Zoti VO (73.8 s):

| Phrase | Start (s) |
|---|---|
| Në vitin 2013 | 0.0 |
| Edi Rama premtoi një Shqipëri të re | 2.8 |
| Pa korrupsion / Pa oligarkë / Një shtet… | 6.2 / 7.7 / 9.25 |
| Trembëdhjetë vite më vonë | 11.85 |
| ai nuk është më Kryeministër / diçka tjetër | 13.9 / 16.45 |
| Saimir Tahiri — në burg | 18.95 (charge 20.45) |
| Lefter Koka — në burg | 21.75 (23.1) |
| Arben Ahmetaj — në arrati | 24.3 (25.7) |
| Balluku, Veliaj, Hyseni — nën hetim | 27.05 (29.7) |
| Lista nuk mbaron | 31.25 |
| Inceneratorët / 430 milionë | 33.6 / 35.0 |
| Tuneli i Llogarasë / Tenderat e AKSHI-t | 37.8 / 39.4 |
| Miliarda të zhdukura / Askush nuk pyet ku | 41.3 / 43.5 |
| Dhe kur SPAK u afrua / shefja… prokurorët | 45.65 / 47.5 |
| Shteti nuk hetonte… / Shteti e mbronte | 51.7 / 54.55 |
| Ministrat… / Zëvendësi… / Inteligjenca… | 56.5 / 58.9 / 61.25 |
| Dhe ai — i rizgjedhur, i pakapshëm | 64.05 |
| Edi Rama nuk është më Kryeministër | 68.0 |
| Ai është / Zoti i Shqipërisë | 71.2 / 72.35 |

4. Put scene boundaries inside the gaps (the middle of a pause), and cue each stamp or slam on the
   word that carries it.
