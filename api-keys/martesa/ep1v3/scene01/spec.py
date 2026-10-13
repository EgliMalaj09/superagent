"""Scene 1 — HOOK (00:00-00:06). Shot spec. All office shots obey ../BLOCKING.md."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))           # martesa/
SHEET_A = os.path.join(ROOT, "characters", "adriani", "ADRIANI_character_sheet.png")
SHEET_E = os.path.join(ROOT, "characters", "elira", "ELIRA_character_sheet.png")
LOC = os.path.join(ROOT, "ep1", "loc_office.png")

LOOK = ("Cinematic photoreal film still from a realistic Albanian TV drama, shot on ARRI Alexa with a vintage "
        "anamorphic lens, shallow depth of field, natural film grain, low-key moody lighting, deep shadows, muted "
        "desaturated grade. Handheld documentary realism, NOT glossy advertising, NOT CGI, NOT 3D, NOT illustration. "
        "Real skin texture with pores and imperfections. 9:16 vertical frame. No text, no captions, no watermark.")

SET = ("SET: luxurious private office high in a tower at night. A large dark walnut desk with a green leather top. "
       "A brass banker's lamp with a GREEN glass shade is the only warm light.")

BLOCK = ("SCREEN DIRECTION (strict, never break): ADRIANI sits BEHIND the desk on FRAME LEFT and looks toward FRAME "
         "RIGHT. ELIRA sits on the OTHER side of the desk, facing him, on FRAME RIGHT, looking toward FRAME LEFT. "
         "Behind Adriani: floor-to-ceiling windows with blurred blue night city lights and rain on the glass. "
         "Behind Elira: dark wooden bookshelves in shadow (no windows behind her). The green lamp stands at the "
         "FRAME-LEFT end of the desk; warm green-gold light hits the frame-left side of faces, the frame-right side "
         "falls into cool blue shadow.")

ADR = ("ADRIANI (match reference sheet exactly): 42, short dark hair greying at the temples, salt-and-pepper stubble, "
       "faint scar near left eyebrow. Charcoal-black suit, black shirt with open collar, no tie, silver watch on LEFT wrist.")
ELI = ("ELIRA (match reference sheet exactly): long dark wavy hair, brown eyes, small gold hoop earrings, thin gold "
       "chain, dark bottle-green satin long-sleeve wrap dress.")

V_ADR = ("deep, low, calm baritone voice of an Albanian man in his forties, slightly raspy, native Albanian speaker "
         "with a Tirana accent, slow and measured, quiet, never theatrical")
V_ELI = ("warm, clear voice of an Albanian woman in her twenties, native Albanian speaker with a Tirana accent, "
         "incredulous, natural, not theatrical")

MASTER = dict(id="master", refs=[SHEET_A, SHEET_E, LOC],
    frame=("WIDE ESTABLISHING SIDE VIEW, camera at eye level, perpendicular to the line between the two people, so "
           "the composition reads left-to-right: ADRIANI seated on FRAME LEFT -> the DESK in the CENTER of the frame "
           "-> ELIRA seated on FRAME RIGHT. The desk physically SEPARATES them: he is behind the desk on its left "
           "side, she sits in a visitor chair on the opposite (right) side of the desk, the two facing each other "
           "across the desk surface in profile. Adriani leans back in a black leather chair, relaxed, in control. "
           "Elira sits on the edge of her chair, back straight, a small black handbag in her lap. A thick cream "
           "contract in a black leather folder lies on the desk between them. The green lamp is on the left end of "
           "the desk next to Adriani. Windows with night city behind the left half of the frame, dark bookshelves "
           "behind the right half. NOT both on the same side of the desk."))

SHOTS = [
 dict(id="s01", who="AE", speaker="A", dur=5, refs=[SHEET_A, SHEET_E],
      frame=("OVER-THE-SHOULDER from behind ELIRA toward ADRIANI. Foreground FRAME RIGHT: Elira's out-of-focus dark wavy "
             "hair and green satin shoulder (back of her head, face not visible). Adriani on FRAME LEFT-CENTER behind "
             "the desk, medium shot from chest up, looking toward frame right at her. In the lower third of the frame, "
             "sharp in focus: his LEFT hand with the silver watch resting on a thick cream contract in a black leather "
             "folder he has just laid down on the desk, two fingers on it. His face in the upper part of the frame is "
             "slightly soft (focus is on the contract). Windows with blurred blue city lights and rain behind him. "
             "Green lamp at the frame-left edge."),
      action=("His left hand sets the contract down on the desk and keeps two fingers on it. The focus slowly racks "
              "from the contract up to his eyes. He looks straight at the woman across the desk, completely calm, "
              "no smile, and speaks quietly. A small pause between the two sentences. On the last words his jaw "
              "tightens almost imperceptibly. The woman in the foreground stays still and silent."),
      cam="handheld, subtle breathing movement, slow rack focus from the contract to his eyes, very slight push-in",
      sfx="the heavy leather folder landing on the wooden desk with a soft solid thud at the very start, a light rustle of paper, steady rain pattering on the large window behind him, the faint electric hum of the lamp, quiet office room tone",
      line="Një milion euro. Vetëm që të bëhesh gruaja ime."),
 dict(id="s02", who="EA", speaker="E", dur=4, refs=[SHEET_E, SHEET_A, os.path.join(ROOT, "characters", "elira", "refs", "elira_face_anchor.png")],
      frame=("REVERSE OVER-THE-SHOULDER from behind ADRIANI toward ELIRA. Foreground FRAME LEFT: Adriani's out-of-focus "
             "dark charcoal suit shoulder and the back of his head (face not visible). Elira on FRAME RIGHT-CENTER, "
             "medium close-up from chest up, sitting across the desk on the edge of her chair, looking toward frame "
             "left at him. Her face is split: green-gold lamp light on the frame-left side of her face, cool blue "
             "shadow on the frame-right side. Behind her ONLY dark wooden bookshelves in shadow — NO window, NO curtains behind or beside her. Adriani's collar is a BLACK shirt collar (no white). Her face must be EXACTLY the woman from the ELIRA character sheet (same face shape, nose, brows, eyes, natural minimal makeup, not glamorous). Natural skin tones, the green lamp tint on her face is subtle, not green skin. "
             "Expression: frozen, still, the words just sinking in, lips closed or barely parted (not yet shocked), the corner of the green lamp shade glowing "
             "softly at the frame-left edge."),
      action=("She stays completely still for half a second as the words sink in, then lets out a short disbelieving "
              "breath through her nose, pulls her head back a few centimetres, eyebrows rising while her eyes narrow, "
              "half shocked, half insulted, and says the line. Her hands tighten on the handbag in her lap. The man "
              "in the foreground does not move or speak."),
      cam="handheld, very slow imperceptible push-in toward her face",
      sfx="muffled rain on the windows, the soft creak of her leather chair as she pulls back, her short sharp breath out through the nose, a faint rustle of satin fabric, quiet office room tone",
      line="Më fal?!"),
]
