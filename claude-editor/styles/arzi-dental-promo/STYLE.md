# Editing style: "arzi-dental-promo" (real footage + AI shots, pop captions, navy/gold overlays, 9:16)

One editing style, made for the Arzi / Dental Med Austria ads. **Use it when the job is for Arzi or the user picks
this style**; it is not the base for other edits. Full detail, per-video history and the reasons behind every rule:
`LEARNINGS.md` (next to this file). Reusable code: `code/` (Remotion components and the
ffmpeg/music/voice scripts from the original project; see "Code" below).

Client: Dental Med Austria, a dental clinic in Tirana with an in-house lab, advertising to Italian and Swiss patients.
Contact: Arzi. Videos: 9:16 vertical ads in **Italian**, 38–55 s, doctor-led, ending in a lead form.

## The recipe (approved; Video 2 was called "perfect")
1. **Plan video first**: black cards per scene on the real voice (scene, AI / REAL / ANIM tag, what to shoot, the
   Italian line, seconds). Client and user approve the structure before any AI or animation work.
2. **Voice is the master clock**: never re-time or alter it. Word timings from faster-whisper `medium`, int8,
   `language="it"`, brand words in `initial_prompt`.
3. **Real footage first**, AI only where nothing real fits. Never reuse a sequence already used in another video of
   the campaign.
4. **Edit**: 30 fps, shots 1.5–6 s, ~0.33 s dissolves centred on cuts, 5 % slow push-in per shot, warm grade on real
   footage. Real-time speed, clean cuts: no speed ramps, no "timelapse" blur.
5. **Captions**: Poppins ExtraBold 800, 132 px @1080 wide, top 1120, 1–3 words per chunk popping in on the spoken
   word, white with **key words in yellow `#FFE14D` UPPERCASE**, max 2 lines, long words auto-shrink.
6. **Animations**: dark navy pills `rgba(12,22,38,0.84)` with gold `#E2C17A` border, gold pins dropping with a
   ripple ("TIRANA · ALBANIA"), Tirana ↔ Italy/Lugano route maps, spring pops on the exact word, one idea per shot,
   **never over a face**, labels on one line. Emotional shots get captions only.
7. **Sound**: original synthesized score (120 BPM groove; 96 BPM piano felt too slow), ducked under the voice, final
   ≈4–6 dB under; **no SFX**; keep voice and music stems. −14 LUFS, TP −1 dB.
8. **End card**: the clinic logo only, centred, fading in. No CTA text or button.
9. **Export**: 4K (2160×3840), overlay rendered natively at 4K, H.264 CRF 16, bt709, faststart.
10. **Check before sending**: stills at every cut and animation, frame counts, Whisper read-back of the final mix.

## AI shots (Seedance or `api-keys/day7` gen.py + omni.py)
- The doctor's face is never AI; shoot him from behind. Patients: lips closed, no teeth, no before/after.
- Real reference frames from the client footage for people, props and the clinic; a face reference to stop drift.
- Generate 4–6 s, use the best 2–3 s. One prop per shot, "bare hands", avoid words that get printed (e.g. "A4").
- To keep a patient anonymous, make an object the identity device (the blue suitcase) at hand/waist height until
  the real-footage reveal.

## Code (copied from the original working folder on 2026-10-13)
- `code/remotion/src/`: the compositions. Key ones: `RouteMap.tsx` (d3-geo map with a plane on a gold arc,
  configurable destination), `C3Map.tsx`, `DoctorHook3.tsx` (the hook animation the user liked most),
  `Creative2Final.tsx` and `LuganoFinal.tsx` (full overlays), `PopCaptionsFrom.tsx` / `DentalCaption.tsx` (captions),
  `C3Card.tsx` (plan-video cards), `EndCard.tsx`. `code/remotion/public/fonts/` has Poppins 800.
  No `node_modules`: copy into a project and run `npm install`.
- `code/build/`: per-video ffmpeg builds (`c2final/build.py`, `c3final/build.py`, `lug/build.py`), music
  (`torino/groove.py`, `lug/music.py`), voice replacement (`lugano/vo3.py`), caption recolouring (`rec49/hl.py`).
- The footage and renders were not copied; they're still in the other account's folder
  (`~/Library/Application Support/Claude/scratch-workspaces/…/scratch-2026-09-28-edac15/`).

## Taste log
Newest first. Add a dated line every time the user approves or rejects something for this client.
- 2026-10-13: Knowledge base created from Videos 1–3 and the Lugano video.
