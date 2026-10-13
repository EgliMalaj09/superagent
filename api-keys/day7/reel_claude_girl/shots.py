#!/usr/bin/env python3
"""Shot data for "A më do?" + builders for keyframe prompts and Omni performance prompts.

  python3 shots.py write            -> writes prompts/kf_XX.txt and prompts/omni_XX.txt
  python3 shots.py keyframe 01      -> generates keyframes/kf_01.png
  python3 shots.py clip 01          -> generates clips/shot_01.mp4 from the keyframe
"""
import os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DAY7 = os.path.dirname(HERE)
STYLE = open(os.path.join(HERE, "STYLE.md")).read().split("STYLE BLOCK (append unchanged to every prompt):")[1].split("CHARACTERS")[0].strip()
REFS = ["keyframes/master_space_v2.png", "assets/ana_sheet_v2.png", "assets/claude_sheet.png"]
LEGEND = ("Image 1 is the MASTER SHOT of this scene: Ana sits on the left of a floating ledge in starry space with a glowing purple neon edge, "
          "Claude stands on the ledge to her right, holographic panels behind (chat bubbles 'a je mirë?' / 'jam mirë.', sticky note 'gjumë?', panel 'CLAUDE · ONLINE'). "
          "REFRAME this exact scene as a new camera shot as described below: same characters, same set, same chunky low-poly render and lighting. "
          "Image 2: ANA sheet (keep her exactly). Image 3: CLAUDE sheet (keep exactly; use it for his eye expressions). "
          "Output ONE single continuous 9:16 film frame, not a sheet.")

ANA_V = "ANA (young Albanian woman, ~24, soft tired voice with a Tirana accent, growing frustration, natural and funny, not theatrical)"
CLA_V = ("CLAUDE (gentle, warm, slightly synthetic and overly polite gender-neutral AI voice). CLAUDE HAS NO MOUTH: "
         "his voice plays while his tiny antenna spark pulses brighter on each syllable; he never opens a mouth")

SHOTS = {
 "01": dict(dur=4, who="ANA", dialogue=[
      dict(who="ANA", line="A më do?", deliv="Small, hesitant, sad, quiet rising question; emphasis on \"do\". Pronounced clearly as three words.", face="Sad puppy eyes on Claude, small pout, brows lifted in the middle.", gest="Chin stays on her hand; tiny head tilt on \"do\"."),
      dict(who="CLAUDE", line="Sigurisht.", deliv="Instantly after her, bright and cheerful, falling intonation; emphasis on \"Sig-\".", face="Claude's dot eyes turn into happy upward arcs ^ ^ (Claude has no mouth; antenna spark pulses as he speaks).", gest="Claude does one small happy hop on the spot."),
    ], frame="Close-up of Ana sitting on the ledge, three-quarter view, chin resting on her hand, purple rim light on her face, Claude fully inside the frame on the right, smaller and softly out of focus, his whole cube visible, turned toward Ana so his ONE front face with two dot eyes faces her (plain blank sides, no eyes on the side).",
    line="A më do?", deliv="(pronounced clearly as three words: \"a\" + \"më\" + \"do\") Small, hesitant, sad, rising question intonation, quiet; emphasis on \"do\".",
    face="Sad puppy eyes looking at Claude, small pout, brows lifted in the middle.", gest="Chin stays on her hand; tiny head tilt on \"do\"."),
 "02": dict(dur=3, who="CLAUDE", frame="Over Ana's shoulder (her bun and hoodie soft in the foreground left), Claude standing on the ledge facing her, the 'CLAUDE · ONLINE' panel behind him.",
    line="Sigurisht.", deliv="Bright, instant, cheerful, falling intonation; emphasis on \"Sig-\".",
    face="Claude's dot eyes turn into happy upward arcs ^ ^.", gest="Claude does one small hop on the spot, legs leaving the ledge."),
 "03": dict(dur=8, who="ANA", frame="Medium shot of Ana sitting on the ledge, legs dangling, turned toward Claude who is at the right edge of frame; holographic chat panel behind her.",
    line="Atëherë pse të shkruaj gjithmonë unë e para? (beat) Po s'të shkruajta unë, ti s'më flet fare.",
    deliv="First sentence accusing but hurt, rising on \"gjithmonë\", pitch peaks on \"unë e para\". (beat) Second sentence lower, slower, deflated, falling to a near-whisper on \"fare\".",
    face="First: wide eyes, eyebrows up, mouth slightly open in disbelief. Second: eyes drop to the ledge, small frown.",
    gest="On the first line she turns her body to him and opens both palms toward Claude. On the second her shoulders and hands drop into her lap."),
 "04": dict(dur=3, who="CLAUDE", frame="Close-up of Claude standing on the same dark ledge (purple neon edge below him), face-on, two plain round black dot eyes exactly like the neutral pose in Image 3, the teal 'CLAUDE · ONLINE' panel soft and out of focus behind; no extra sticky notes or chat bubbles floating around him.",
    line="Po të lë hapësirë.", deliv="Calm, soothing, measured, like customer support; even pitch, emphasis on \"hapësirë\".",
    face="Calm round dot eyes, one slow blink.", gest="Claude tilts his whole body slowly forward once, like a polite nod."),
 "05": dict(dur=4, who="ANA", frame="Medium shot of Ana on the ledge facing Claude, the floating holographic panels beside her.",
    line="Hapësirë kam plot. (beat) Dy terabajt.", deliv="Deadpan, flat, dry; short pause, then \"Dy terabajt\" said even flatter. Emphasis on \"plot\" and \"terabajt\".",
    face="Half-lidded unimpressed eyes, straight mouth.", gest="On \"Dy terabajt\" she points one finger at the floating holographic panel beside her without looking at it."),
 "06": dict(dur=6, who="ANA", frame="Medium close-up of Ana on the ledge, hand raised in front of her chest, Claude out of focus at the right edge.",
    line="Të them \"të lutem\". Të them \"faleminderit\". Të pyes si je.",
    deliv="A list that builds in hurt: each phrase a bit higher and more wounded; emphasis on \"të lutem\", \"faleminderit\", \"si je\". Slight crack in the voice on the last one.",
    face="Brows knit more with every item, lips pressed, eyes getting glossy.", gest="Counts on her fingers: one, two, three fingers, one per phrase."),
 "07": dict(dur=5, who="CLAUDE", frame="Two-shot: Claude in the foreground right on the ledge turned toward Ana, Ana behind on the left, the floating chat panel with the bubbles 'a je mirë?' and 'jam mirë.' clearly visible between them.",
    line="Dje të pyeta \"a je mirë?\" dhe më the \"jam mirë\".",
    deliv="Innocent, matter-of-fact, helpful; slight rise on \"a je mirë?\", then quoting \"jam mirë\" flatly, exactly as she wrote it.",
    face="Claude's dot eyes neutral and sincere; Ana in the back freezes.", gest="Claude turns his body toward Ana; Ana slowly crosses her arms."),
 "08": dict(dur=4, who="ANA", frame="Medium shot of Ana from a slightly low angle on the ledge, holographic panels and stars behind her.",
    line="\"Jam mirë\" do të thotë që NUK jam mirë!",
    deliv="Exasperated, louder, fast; big stress on \"NUK\", pitch jumps up on it, then lands hard on the final \"mirë\".",
    face="Eyes wide, eyebrows high, mouth open in outrage.", gest="Both hands fly up beside her head, palms open, on \"NUK\"."),
 "09": dict(dur=3, who="CLAUDE", frame="Close-up of Claude face-on on the ledge, teal panel glow behind.",
    line="Kjo s'është në dokumentacion.", deliv="Flat, robotic, completely sincere, even pitch; small stress on \"dokumentacion\".",
    face="Claude's eyes become two short flat horizontal lines; one slow blink.", gest="Claude stays perfectly still; only the antenna spark flickers once."),
 "10": dict(dur=7, who="ANA", frame="Wide two-shot exactly like the master shot: Ana on the left of the ledge, Claude on the right; the camera slowly pushes in toward Claude during the shot.",
    line="Mirë. (beat) Radha jote. Fillo ti një bisedë. (beat) Më pyet diçka. Çfarëdo.",
    deliv="\"Mirë\" short and clipped. Then a challenge, measured and pointed; emphasis on \"jote\" and \"ti\". Last two softer and hopeful, \"Çfarëdo\" almost pleading.",
    face="Arms crossed, chin up, then softening eyes, hopeful.", gest="She crosses her arms and leans back on \"Mirë\"; on \"Çfarëdo\" she uncrosses and opens one hand toward Claude."),
 "11": dict(dur=4, who="CLAUDE", frame="Close-up of Claude face-on on the ledge, very centered, stars behind.",
    line="(1 second of silence) Si mund t'ju ndihmoj sot?",
    deliv="One second of complete silence first. Then bright, cheerful, customer-service perfect, rising friendly intonation; emphasis on \"ndihmoj\".",
    face="During the silence, neutral dot eyes; on the line the eyes pop into happy upward arcs ^ ^.", gest="A small proud hop exactly as he speaks."),
 "12": dict(dur=4, who="ANA", frame="Close-up of Ana on the ledge, face-on, purple rim light on her face.",
    line="(long silence, a deep sigh) …Lëre.", deliv="Two seconds of silent dead stare, an audible long sigh through the nose, then a quiet defeated \"Lëre\", falling.",
    face="Dead-eyed stare at Claude, then eyes slowly roll away.", gest="She slowly turns her head away from him and looks down into the starry void."),
}


def kf_prompt(n):
    s = SHOTS[n]
    who = "Claude is on screen, Ana " + ("may be partly visible." if s["who"] == "CLAUDE" else "is the focus.")
    return (f"{LEGEND}\n\nVertical 9:16 frame, camera framing is IMPORTANT: {s['frame']} Follow this framing exactly (a close-up means the face fills most of the frame). "
            f"{who} Expression at the start of the shot: {s['face'].split('.')[0]}. Full-bleed image filling the whole frame edge to edge, no borders. No other people.")


def omni_prompt(n):
    s = SHOTS[n]
    lines = s.get("dialogue") or [dict(who=s["who"], line=s["line"], deliv=s["deliv"], face=s["face"], gest=s["gest"])]
    speakers = []
    for l in lines:
        if l["who"] not in speakers: speakers.append(l["who"])
    voices = " / ".join(ANA_V if w == "ANA" else CLA_V for w in speakers)
    perf = "\n\n".join(f"""Line {i+1} — {l['who']}: "{l['line']}"
Delivery: {l['deliv']}
Face: {l['face']}
Gesture: {l['gest']}""" for i, l in enumerate(lines))
    order = " then ".join(f"{l['who']} says \"{l['line']}\"" for l in lines)
    return f"""GOOGLE OMNI PROMPT

[SPEAKER & SETTING]
Animated low-poly 3D short film, continuing exactly from the given first frame: same characters, same floating ledge in starry space with purple neon edge and holographic panels, same chunky low-poly render style and purple lighting; no style change, no new characters, no cuts. Voices: {voices}. Framing: {s['frame']} Total duration: {s['dur']} seconds.

[PERFORMANCE — language: Albanian]

{perf}

[RULES]
The scene contains ONLY Ana and the small orange robot Claude. NO other people, no faces, no figures, no reflections of people anywhere in the frame or background, ever.
CLAUDE DESIGN LOCK: Claude is a rigid terracotta cube that NEVER morphs. He has exactly ONE face (the front side) with exactly two plain black dot eyes, and nothing else: NO eyebrows, NO nose, NO mouth, NO cheeks, no human facial features, ever. His other sides are plain and blank (no eyes on the sides). His eyes may only change between dots, happy upward arcs and flat lines. He moves only by small hops, tilts and turning his whole body. Even while Claude is speaking, his face shows ONLY the two eyes: no mouth ever appears, not even a small line or smile; his voice comes from the robot like a speaker. His antenna ALWAYS ends in the same glowing orange starburst spark, never a plain ball or knob.
Spoken dialogue, in this exact order and nothing else: {order}. Standard Albanian (Tirana accent), exactly as written, every word clearly articulated and complete, not mumbled or cut off. No extra words, no whispers, no other speech. Whoever is not speaking stays silent and reacts subtly. Quiet spacey ambience and faint electronic hum only; no music, no subtitles, no on-screen text.

[TIMING]
Total target: {s['dur']}s. Start the first line after ~0.3s, leave a short natural beat between lines; let the last expression hold to the end of the shot."""


def run(args):
    print("+", " ".join(args)); return subprocess.call(args)


if __name__ == "__main__":
    cmd = sys.argv[1]
    os.makedirs(os.path.join(HERE, "prompts"), exist_ok=True)
    if cmd == "write":
        for n in SHOTS:
            open(os.path.join(HERE, f"prompts/kf_{n}.txt"), "w").write(kf_prompt(n))
            open(os.path.join(HERE, f"prompts/omni_{n}.txt"), "w").write(omni_prompt(n))
        print("wrote", len(SHOTS), "shots")
    elif cmd == "keyframe":
        n = sys.argv[2]; os.makedirs(os.path.join(HERE, "keyframes"), exist_ok=True)
        open(os.path.join(HERE, f"prompts/kf_{n}.txt"), "w").write(kf_prompt(n))
        sys.exit(run([sys.executable, os.path.join(DAY7, "gen.py"), os.path.join(HERE, f"prompts/kf_{n}.txt"),
                      os.path.join(HERE, f"keyframes/kf_{n}.png"), "--model", "gemini-3.1-flash-image", "--aspect", "9:16",
                      "--ref", *[os.path.join(HERE, r) for r in REFS]]))
    elif cmd == "clip":
        n = sys.argv[2]; os.makedirs(os.path.join(HERE, "clips"), exist_ok=True)
        open(os.path.join(HERE, f"prompts/omni_{n}.txt"), "w").write(omni_prompt(n))
        sys.exit(run([sys.executable, os.path.join(DAY7, "omni.py"), os.path.join(HERE, f"prompts/omni_{n}.txt"),
                      os.path.join(HERE, f"clips/shot_{n}.mp4"), "--image", os.path.join(HERE, f"keyframes/kf_{n}.png"),
                      "--duration", f"{SHOTS[n]['dur']}s", "--resolution", "720p"]))
