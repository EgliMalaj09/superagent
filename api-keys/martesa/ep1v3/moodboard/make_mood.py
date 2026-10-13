#!/usr/bin/env python3
"""Episode 1 v3 mood board — one 9:16 still per beat. Usage: make_mood.py [id ...]"""
import os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
GEN = os.path.join(ROOT, "..", "day7", "gen.py")
A = os.path.join(ROOT, "characters", "adriani", "ADRIANI_character_sheet.png")
E = os.path.join(ROOT, "characters", "elira", "ELIRA_character_sheet.png")
MASTER = os.path.join(ROOT, "ep1v3", "scene01", "keys", "master.png")
MANSION = os.path.join(ROOT, "ep1", "loc_mansion.png")

LOOK = ("Cinematic photoreal film still from a realistic Albanian TV drama, shot on ARRI Alexa with vintage anamorphic "
        "lens, shallow depth of field, natural film grain, halation on highlights, low-key moody lighting, muted "
        "desaturated grade with warm practicals and cool blue shadows. Handheld realism, NOT glossy advertising, NOT CGI, "
        "NOT 3D. Real skin texture. 9:16 vertical frame. No captions, no watermark, no English text.")
ADR = "ADRIANI = the man from the ADRIANI character sheet (exact face, charcoal-black suit, black open-collar shirt, silver watch on left wrist)."
ELI = "ELIRA = the woman from the ELIRA character sheet (exact face, long dark wavy hair, dark green satin wrap dress, small gold hoops)."
OFFICE = ("OFFICE RULE: Adriani sits behind the desk on FRAME LEFT with the rainy night-city windows behind him; Elira is on "
          "the opposite side of the desk on FRAME RIGHT with dark bookshelves behind her; green banker's lamp at the frame-left end of the desk.")

M = {
 "01_hook": ([A, E, MASTER], f"{ADR} {ELI} {OFFICE} Over-the-shoulder from behind Elira (her blurred hair foreground frame right) on Adriani, his left hand with the silver watch pressing a thick cream contract in a black leather folder onto the desk, his eyes locked on her. Green lamp glow, rain on windows."),
 "02_window": ([E, MASTER], f"{ELI} She has walked away from the desk and stands at the floor-to-ceiling window, her back half to camera, arms crossed tight. Her face is reflected faintly in the rain-streaked glass, overlaid on the blurred night city lights. In the deep background, out of focus, the green lamp and the dark shape of a man still seated at the desk. Lonely, cold blue light."),
 "03_father": ([], "FLASH MEMORY: a small, modest Albanian family kitchen at night, a single bare warm bulb. A tired man in his late fifties, grey hair, worn cardigan, sits at a kitchen table with his head in his hands; bank letters and an unpaid bill spread on the vinyl tablecloth, a cold cup of coffee. Seen through a half-open doorway. Warm, poor, intimate, sad. Slightly overexposed and soft like a memory."),
 "04_clause": ([E, MASTER], f"{ELI} {OFFICE} Extreme close-up angle over Elira's shoulder: her finger with chipped natural nail stops on one line of the cream contract under green lamp light; the typed text is soft and unreadable. Her breath held. Shallow focus."),
 "05_thirdfloor": ([MANSION], "TEASER INSERT: a dark, silent corridor on the third floor of a luxurious old villa at night. At the end, a tall closed dark wooden double door with an old brass lock. Thin cold blue moonlight from one window, dust in the air, a single dead flower in a vase on a side table. Ominous, still, nobody visible."),
 "06_elevator": ([E], f"{ELI} She leaves without signing: alone in a mirrored brass elevator going down, her back against the wall, eyes closed, jaw tight, fighting tears. Harsh overhead light, her reflection repeated in the mirrors. Claustrophobic, quiet."),
 "07_car_rain": ([E], f"{ELI} Inside an old small used car parked on a dark street in heavy rain. Shot through the windshield with rain streaks and wiper, orange streetlight. Elira sits in the driver seat, wet hair, staring at her phone whose screen lights her face from below (screen not readable). Torn, thinking, the decision on her face. Long silent moment."),
 "08_return": ([A, E, MASTER], f"{ADR} {ELI} {OFFICE} She has come back: wide shot from the office doorway, Elira standing in the dark doorway on frame right with rain-wet hair and wet shoulders, determined; Adriani on frame left still behind the desk under the green lamp, looking up at her, not surprised. The contract lies on the desk between them."),
 "09_sign": ([E, MASTER], f"{ELI} {OFFICE} Close-up: her hand, still wet with rain drops, signs the cream contract with a heavy black fountain pen under green lamp light. Ink line on paper, unreadable text. Tension."),
 "10_message": ([A, MASTER], f"{ADR} {OFFICE} Close-up on the desk: a black smartphone lying face up lights up with a new message notification, its glow on Adriani's left hand with the silver watch reaching to cover it. The notification text is blurred and unreadable. In soft focus above, his face hardening. Green lamp glow."),
}

def run(k):
    refs, shot = M[k]
    note = "Reference images: " + ", ".join(
        {A: "ADRIANI character sheet", E: "ELIRA character sheet", MASTER: "office master blocking frame (match set, lighting and sides)",
         MANSION: "villa exterior mood (match its cold blue night palette)"}[r] for r in refs) + "." if refs else ""
    pf = os.path.join(HERE, k + "_prompt.txt")
    open(pf, "w").write(f"{LOOK}\n{note}\n{shot}")
    r = subprocess.run([sys.executable, GEN, pf, os.path.join(HERE, k + ".png"), "--aspect", "9:16", "--ref", *refs],
                       capture_output=True, text=True)
    return k, (r.stdout + r.stderr).strip().splitlines()[-1:]

want = sys.argv[1:] or list(M)
with ThreadPoolExecutor(5) as ex:
    for k, msg in ex.map(run, want): print(k, msg, flush=True)
