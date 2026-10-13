# 04 — Image prompts

These prompts produced every image in `examples/zoti-i-shqiperise/public/images/`. The user runs
them in Nano Banana Pro / Gemini image (best with reference faces), Higgsfield, Midjourney
(`--cref <face> --cw 100 --ar 9:16 --style raw --stylize 250`) or GPT image.

## Rules that made them work

- **9:16 vertical**, photoreal, 35 mm film language. Always prepend the MASTER STYLE.
- **Likeness comes from reference photos.** The user uploads a real photo of the person. Say
  "use the reference image for facial likeness", and keep face-reference strength high (85–100%).
- **One prompt = one filename.** Tell the user the exact filename and folder for each.
- **Before/after pairs: edit, don't regenerate.** For a second version of a shot (e.g. throne → throne
  with crown), upload the first image and say "keep EVERYTHING identical… the ONLY change: …".
  If framing still drifts, the code transition has to hide it (zoom-through or a soft crossfade).
- **Never put filenames or labels in prompts.** The tunnel image came back with "LLOGARA-TUNNEL.JPG"
  burned into a road sign and had to be blurred in code.
- "Transparent PNG" props usually come back as a JPG with a **fake checkerboard**. That's fine:
  `useKeyedImage()` removes it (see 08-remotion-engineering.md). Ask for the object isolated,
  front view, no floor shadow.
- Engraved/printed text in images (crown band, signs) can come out wrong or illegible. The user
  sometimes wants a specific (even crude/satirical) text: put it in quotes in the prompt and check it.

## MASTER STYLE (prepend to every prompt)

```
Cinematic documentary still, shot on 35mm film, Kodak Vision3 stock, slight film grain,
shallow depth of field, dramatic chiaroscuro lighting, muted color grade, hyperrealistic
photography, true-crime documentary aesthetic, HBO political thriller mood, 8K detail,
photorealistic skin texture with visible pores, natural imperfections, no plastic AI look,
no CGI gloss, vertical 9:16 composition.
```

## Hero shots of the main subject

**The promise (warm, triumphant): `characters/<subject>-promise.jpg`**
```
[MASTER STYLE] + [NAME] in [YEAR], standing on a political campaign stage, both arms raised
triumphantly in a victory salute, mouth open mid-shout, euphoric expression. Dark navy suit,
white shirt, red tie. Warm golden-hour sunset light from the left, long shadows, backlit by stage
lights creating a halo rim. Blurred cheering crowd below waving Albanian red-and-black flags.
Confetti in the warm light. Low angle looking up, heroic, larger than life. Palette: amber, gold,
deep orange, warm cream, soft red. Nostalgic political documentary vibe.
```

**The turn (back view, alone with power): `characters/<subject>-silhouette.jpg`**
```
[MASTER STYLE] + [NAME] from behind, standing at a dark podium facing an empty, dimly lit
parliament chamber. Low wide angle, broad shoulders filling the lower third as a near-silhouette.
One harsh overhead spotlight gives a cold cyan-white rim on head and shoulders; face hidden.
Empty red-upholstered seats stretch into darkness. A thin shaft of red light from the ceiling.
Palette: pitch black, crimson, cold steel blue. Mood: ominous, lonely, absolute power.
```

**Split face (two eras in one face): `characters/<subject>-split.jpg`**
```
[MASTER STYLE] + [NAME] straight-on, waist up, split lighting: the LEFT half of the face in warm
golden sunset light (soft, slight smile), the RIGHT half lit by cold hard blood-red light (cold,
unreadable). Clean dark background. Symbolic, like a Janus mask.
```

**Villain in the treasure room: `characters/<subject>-vault.jpg`**
```
[MASTER STYLE] + [NAME] in a dim opulent vault, waist-up, arms crossed, slight smug smile. All-black
suit, open collar. Low warm amber light from below reflecting off stacks of 500 euro bills piled in
front of him and on shelves. Shadows climbing his face from below (villain lighting). Blurred safety
deposit boxes behind. Palette: black, amber-gold, euro violet, red rim light.
```

**The throne (base for the coronation): `characters/<subject>-throne.jpg`**
```
[MASTER STYLE] + [NAME] seated on an elevated black marble throne-like podium, very low angle
(worm's-eye), towering over the viewer. Blank, cold stare into the camera. All-black suit, black
shirt, black tie. Hands resting heavily on the armrests. Behind: a massive black Albanian
double-headed eagle on a dark marble wall, backlit by one blood-red spotlight making a red halo.
Smoke curling at his feet. Palette: black, crimson, tarnished gold. Dictator portrait, Soviet
realism meets Game of Thrones.
```

**Crowned version (edit of the throne image + crown reference): `characters/<subject>-throne-crowned.jpg`**
```
Edit reference image 1. Keep EVERYTHING identical: same pose, framing, camera angle, lighting,
throne, eagle backdrop, smoke, suit, face and expression. The ONLY change: place the crown from
reference image 2 on his head, sitting naturally, slightly too big. It catches the red backlight
on its top edge and casts a soft shadow on his forehead. Same film grain as the original.
```
(Add a royal outfit only if the user wants it: "replace the suit with a black and gold royal robe
with an ermine collar". Expect the framing to drift more.)

## The supporting cast: one formula, six variants

Formula (swap `[NAME]`, `[ROLE]`):
```
[MASTER STYLE] + [NAME], Albanian [ROLE], straight-on, head and shoulders, flat harsh fluorescent
overhead light carving sunken eyes and hard shadows. Dark suit, no tie, top button undone.
Expression: caught, tired, shamed. Cold grey institutional wall with faint security-grid shadow.
Palette: desaturated steel grey, sickly green-white, black. A surveillance photo taken the moment
before arrest.
```

| Variant | Use for | What to add |
|---|---|---|
| Defiant | convicted but unbroken | "jaw tight, chin raised, contempt; courthouse corridor; police insignia blurred behind" |
| Perp walk | convicted, bribe | "escorted by blurred police, HANDCUFFS visible on his wrists, paparazzi flash from the left, press cameras behind" |
| Fugitive | fled the country | "from behind, walking away through a dark airport terminal at night, long dark overcoat, wheeled suitcase, collar up, cold cyan light on the jaw" |
| Technocrat | indicted minister | "woman/man, cold composed stone face, black blazer; blurred wall of tender documents and blueprints behind" |
| Mayor | arrested official | "led down the steps of City Hall, mayor's sash half-removed and crooked, pigeons scattering, press cameras" |
| Spy chief | intelligence scandal | "seated at a desk, wall of surveillance monitors (CCTV feeds, wiretap waveforms, maps with red dots), face lit from below by a laptop" |

## Scandal locations (one per money beat)

```
[MASTER STYLE] + derelict industrial waste incinerator at dusk, massive rusted chimney, broken
windows, weeds, abandoned machinery, low wide angle, cold grey sky.
```
```
[MASTER STYLE] + entrance of a mountain road tunnel at night, construction barriers, red-and-white
tape, abandoned equipment, flickering fluorescent lights inside, wet asphalt reflecting red beacons.
```
```
[MASTER STYLE] + dark data-center server room, rows of blinking racks with cyan and green lights,
cables on the floor, one rack with a torn-out cable, a thin red laser line crossing the frame.
```
```
[MASTER STYLE] + huge pile of scattered 500 euro bills on a wet asphalt road at night, some blowing
away, one yellow street lamp above, a knocked-over traffic cone.
```

## Props

**Crown: `props/crown.jpg`**
```
A heavy ornate royal gold crown, slightly tarnished and scratched, Byzantine and Albanian royal
design (double-headed eagles), red velvet lining, black onyx jewels, worn and ancient. Straight-on
front view at eye level, warm rim light on the top edges. Engraved on the front band in [gothic /
roman] letters: "[TEXT]". Isolated on a transparent background, no shadow, photorealistic.
```
Other useful props: stack of 500 € bills, handcuffs, gavel, red rubber stamp, redacted document,
CCTV monitor, hanging interrogation lamp. Most of these are faster to draw in code (see 05).

## Image QA checklist (when the user pastes images)

- Likeness OK? Pose/framing what the scene needs (space for captions top or bottom)?
- Burned-in text/filenames? Note coordinates and blur them in code.
- Before/after pair: compare framing (face position, scale) and pick a transition that hides drift.
- Copy into `public/images/...` with the agreed filenames.
