# Albanian on screen and in audio

## Text

- Letters: **ë Ë ç Ç** must render. Load fonts with the Latin Extended subset (Remotion `subsets: ["latin", "latin-ext"]`);
  the fonts in `library/fonts/` all have them. Check a frame with "ËSHTË ÇFARË".
- Uppercase keeps the diaeresis: SHQIPËRIA, ZËVENDËSI.
- Numbers: Albanian uses a decimal comma and a dot (or space) for thousands: 3,4 m² · 1.900.000. Pick one convention per
  video and keep it (the motion kit's `count()` groups with dots by default). Currency after the number: 430 milionë €
  or "€430 milionë" as a design choice. Say large numbers in words in the voice script.
- Quotation marks: „…“ or «…». Attribute: "Sipas INSTAT…", "Burimi: …".

## Verdict and status vocabulary (stamps, bars)

| Status | On screen | Use only when |
|---|---|---|
| convicted | I DËNUAR / E DËNUAR | a court verdict exists |
| imprisoned | I BURGOSUR / NË BURG | confirmed in prison now |
| fugitive / wanted | NË ARRATI | fled / arrest warrant not executable |
| under investigation | NËN HETIM | prosecutors (SPAK) investigating |
| indicted / charged | I AKUZUAR | formally charged |
| arrested | I ARRESTUAR | arrested |
| house arrest | NËN ARREST SHTËPIAK | ordered by court |
| suspended / dismissed | I PEZULLUAR / I SHKARKUAR | official decision |

Common words: Kryeministër, zëvendëskryeministër, ministër, kryetar bashkie, prokuror, gjykata, ryshfet, pastrim parash,
shpërdorim detyre, tender, koncesion, miliardë/milionë lekë/euro.

## Voice and transcription

- ElevenLabs v3 reads Albanian well with a native-sounding voice; tags like `[pause]` `[whispers]` steer delivery.
- Whisper: `--language sq`. Then proofread with `fix-words.py` (diacritics e/ë, c/ç, names, split words); captions print
  exactly that text. Text matching in the reel-edit scripts folds accents, so `bej` finds `bëj`.
- Retake words the paper cut understands: "fshije", "edhe një herë", "nga fillimi", "e përsëris". Fillers: "pra", "dmth", "okej", "ëëë".
