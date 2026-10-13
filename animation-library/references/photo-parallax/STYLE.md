# Style card: "photo-parallax" (Vox-style 3-layer photo dive, 9:16)

Source: a written tutorial the user pasted ("Claude Motion Design: Photo Parallax Tutorial", technique learned from the
HF0 promo reel, first 3 s). No video file; this card is built from the text. The tutorial's own prompt blocks were
missing from the paste, so the prompts below are ours.

## The effect
One old black-and-white photo splits into 3 depth layers; the camera dives through it (each layer moves at its own
speed, with offset timing); the text lands ON a surface inside the photo (a sign, a board, a banner, a screen), looking
printed into it, not stuck on top. Typical length: a 5–7 s hook over one voice-over line.

## The 3 layers (every photo needs all three)
1. **Far:** background plate (sky, wall, buildings far away). Must be fully filled where the middle layer used to be.
2. **Middle:** the subject (person / building), cut out, with the writing surface blanked (empty sign/board/banner).
3. **Near:** something close to the lens (a branch, a railing, a shoulder, a power line, a car mirror). Most photos lack
   it, so it is added with an image model.
Rule: whatever sits behind each layer is filled in (no holes, no ghosts when the layers separate). Check by restacking
the three layers: it must look exactly like the original.

## Look
- B&W archival photo, bright (not muddy), light vignette, subtle real paper texture under everything
  (a real paper scan, never AI paper; pick the subtlest).
- Edges like a drugstore photo print: clean, slightly soft, thin white border; NOT torn paper.
- Text: printed into the surface (follows its perspective, slight ink bleed / multiply blend, a little grain).

## Motion
- Camera: slow push-in (scale 1 → 1.25 over the shot) + the layers separate in depth: far moves least, near moves most
  and finally slides past the lens.
- Offset timing (near starts ~0.15 s before middle, far ~0.3 s after) + very slight jitter so they don't move as one block.
- Text writes/prints onto the surface on its word; hold the last word a beat before the fade.
- Ease: power2.inOut for the dive; soft 0.4 s fades. No shakes, no flashes.

## How we build it here
- HyperFrames: three absolutely positioned PNG layers inside a `perspective` container; GSAP tweens z/scale/x per layer
  with offset starts; the text is a layer placed on the sign with CSS `transform: matrix3d/rotate` to match its
  perspective + `mix-blend-mode: multiply`. Or Remotion for a doc-reel.
- Layers: the user generates them with an image model (taste: user makes images; give exact prompts + filenames):
  `p1-far.png`, `p1-mid.png` (transparent PNG), `p1-near.png` (transparent PNG), plus `p1-full.png` for the restack check.

## Prompts (ours)
- Make it 3 layers deep: "Edit this black-and-white archival photo: keep everything identical, add one out-of-focus
  foreground element close to the lens on the [left/right] edge ([a balcony railing / a tree branch / a power line]),
  and blank out the [sign/banner] so it is an empty clean surface. Same grain, same lighting, photorealistic, 9:16."
- Far plate: "Remove the [subject] and fill the background behind it naturally, same grain and light, nothing else changes."
- Middle: "Cut out the [subject] on a transparent background, keep the blank [sign] attached, clean soft edges."
- Near: "Cut out only the foreground [element] on a transparent background."

## Don't copy
- The tutorial's exact photo or wording; it's a technique, not footage.

## Conflicts with TASTE.md
- None (soft, no shakes/flashes). If the photo is AI-made, never present it as a real archival photo: label it
  "ilustrim" on screen.
