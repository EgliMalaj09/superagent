"""Scene 2 — WINDOW (00:06-00:12). All office shots obey ../BLOCKING.md."""
import importlib.util, os
HERE = os.path.dirname(os.path.abspath(__file__))
_s = importlib.util.spec_from_file_location("scene01_spec", os.path.join(HERE, "..", "scene01", "spec.py"))
_m = importlib.util.module_from_spec(_s); _s.loader.exec_module(_m)
ROOT, SHEET_A, SHEET_E, LOOK, SET, BLOCK, ADR, ELI, V_ADR, V_ELI = (getattr(_m, k) for k in
    "ROOT SHEET_A SHEET_E LOOK SET BLOCK ADR ELI V_ADR V_ELI".split())

FACE_E = os.path.join(ROOT, "characters", "elira", "refs", "elira_face_anchor.png")
S1 = os.path.join(ROOT, "ep1v3", "scene01", "keys")
MASTER, S1A, S1B = (os.path.join(S1, f) for f in ("master.png", "s01.png", "s02.png"))

WINDOW = ("WINDOW CORNER: the floor-to-ceiling window wall with heavy rain streaming down the glass and the blurred "
          "night city (blue and amber bokeh) beyond. Elira stays on FRAME RIGHT facing FRAME LEFT; Adriani, when "
          "visible, stays on FRAME LEFT.")

SHOTS = [
 dict(id="s01", dur=4,
      refs=[(SHEET_E, "ELIRA character sheet (exact face, hair, dress)"),
            (SHEET_A, "ADRIANI character sheet (exact face, suit)"),
            (MASTER, "MASTER BLOCKING frame of this office: match set, lighting and exactly which side each person is on")],
      frame=("WIDE-MEDIUM SHOT from the same side as the master frame, eye level. Adriani on FRAME LEFT seated behind "
             "the desk, leaning back, calm, watching her. Elira on FRAME RIGHT on the other side of the desk, caught in "
             "the moment of standing up abruptly from her leather chair: weight forward, both hands pushing on the "
             "armrests, her body half risen, face angry and hurt, eyes on him. The cream contract in the black folder "
             "on the desk between them, green lamp at the frame-left end of the desk, rainy windows behind him, dark "
             "bookshelves behind her."),
      action=("She pushes herself up out of the chair in one sharp move, stands tall, and throws the line at him, "
              "angry, voice cracking slightly. He does not move at all, only his eyes follow her up."),
      cam="handheld, the camera reacts slightly late to her standing up, small tilt up to follow her face",
      sfx=("the wooden chair legs scraping hard on the wooden floor, the leather of the chair creaking, satin fabric "
           "rustling, steady rain on the windows, quiet office room tone"),
      speaker_id="E", line="Ti as nuk më njeh!"),
 dict(id="s02", dur=5,
      refs=[(SHEET_E, "ELIRA character sheet (exact face, hair, dress)"),
            (FACE_E, "extra face reference of ELIRA"),
            (S1B, "a previous shot of ELIRA in this scene: match her face, hair, dress and the green lamp light")],
      frame=("MEDIUM CLOSE-UP at the window. Elira stands on FRAME RIGHT in three-quarter profile, facing FRAME LEFT "
             "toward the glass, arms crossed tightly, jaw set, eyes glassy, staring out at the city. On FRAME LEFT the "
             "dark rain-streaked glass shows her faint ghostly reflection over the blurred blue and amber city lights. "
             "Deep in the soft out-of-focus background on FRAME LEFT: the warm glow of the green banker's lamp and the "
             "dark blurred shape of a man seated at a desk. Cold blue window light on her face, a thin warm green-gold "
             "edge light from the lamp behind."),
      action=("She stands still at the window, arms crossed, breathing hard, trying to control herself; she does not "
              "speak, her lips stay closed. As the off-screen man speaks, her eyes slowly widen and her arms tighten. "
              "The blurred man in the far background does not move."),
      cam="handheld, very slow push-in toward her face and her reflection",
      sfx=("heavy rain drumming on the glass close to the microphone, a distant low rumble of thunder far away, a faint "
           "hum of the city below, her controlled breathing"),
      speaker_id="A", offscreen=True, line="Di që babai yt ka dyzet e tetë orë."),
]
for s in SHOTS: s["speaker"] = s.pop("speaker_id")
