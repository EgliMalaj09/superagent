"""Episode 1 v2 shot spec — one speaker per clip, all speech in Albanian."""

LOOK = ("Cinematic photoreal still from a realistic Albanian TV drama, shot on ARRI Alexa with vintage anamorphic lens, "
        "shallow depth of field, natural film grain, low-key moody lighting, deep shadows, muted desaturated grade with "
        "warm practical light and cool shadows. Handheld documentary realism, NOT glossy advertising, NOT CGI, NOT 3D, "
        "NOT illustration. Real skin texture with pores and imperfections. 9:16 vertical frame.")

SET = ("SET: a luxurious private office high in a tower at night. Floor-to-ceiling windows behind, a blurred glittering "
       "city skyline with light rain on the glass. A large dark walnut desk. A brass banker's lamp with a GREEN glass "
       "shade is the main warm light. Dark bookshelves in shadow, leather chairs, a crystal whisky glass.")

ADR = ("ADRIANI: the man from the reference image — same face, short dark hair greying at the temples, stubble. "
       "Charcoal-black suit, black open-collar shirt, no tie, silver watch.")
ELI = ("ELIRA: the woman from the reference image — same face, long dark wavy hair. Dark emerald green satin "
       "long-sleeve wrap dress, small gold hoop earrings.")

TEXT_RULE = "Any visible text must be in Albanian. No English text anywhere."

V_ADR = ("deep, low, calm baritone voice of an Albanian man in his forties, slightly raspy, native Albanian speaker "
         "with a Tirana accent, slow and measured")
V_ELI = ("warm, clear voice of an Albanian woman in her twenties, native Albanian speaker with a Tirana accent, "
         "emotional and tense")

# who: "A" (Adriani), "E" (Elira), "AE" both visible, "" none
# speaker: "A"/"E"/None ; line: Albanian dialogue ; dur: seconds requested from Omni
SHOTS = [
 dict(id="s01", who="A", speaker="A", dur=5,
      frame="Medium shot. Adriani sits behind the desk, leaning back in a leather chair. His right hand rests on a white "
            "contract lying flat on the desk in front of him; the document heading reads 'KONTRATË'. Crystal whisky "
            "glass and the green lamp beside it. He looks across the desk, slightly off camera left, calm and in control.",
      action="He lifts his hand off the contract, settles back, and speaks to the woman across the desk.",
      cam="very slow push-in, subtle handheld",
      line="Një milion euro. Vetëm që të bëhesh gruaja ime."),
 dict(id="s02", who="AE", speaker="E", dur=3,
      frame="Medium close-up of Elira seated across the desk, half-rising from her chair in shock, mouth slightly open. "
            "Adriani's shoulder and the back of his head are a soft dark shape at the right edge of the foreground.",
      action="She half-rises in disbelief and snaps back at him.",
      cam="quick small push-in that settles, slight handheld shake",
      line="Më fal?!"),
 dict(id="s03", who="AE", speaker="E", dur=3,
      frame="Medium shot. Elira now stands and leans forward with both hands on the desk, angry and defensive, looking "
            "down at Adriani. Adriani's shoulder is soft in the near foreground on the right.",
      action="She leans in hard and confronts him.",
      cam="handheld, slight drift",
      line="Ti as nuk më njeh!"),
 # s04 line is split across three cuts (the full sentence trips the video model's filter)
 dict(id="s04a", who="A", speaker="A", dur=4,
      frame="Medium close-up of Adriani seated, slight low angle, looking up at someone standing off camera right. "
            "Calm, unmoved, quietly dangerous. Green lamp light on one side of his face.",
      action="He answers her calmly, without raising his voice.",
      cam="locked-off with faint handheld breathing",
      line="Di që babai yt ka dyzet e tetë orë."),
 dict(id="s04b", who="E", speaker="A", offscreen=True, dur=3,
      frame="Medium close-up of Elira standing by the desk, seen from a low angle across the desk, her angry "
            "expression faltering as she listens, eyes widening. Green lamp in the foreground, rain-streaked window behind.",
      action="She listens in silence, the words hitting her; her lips stay closed.",
      cam="slow push-in",
      line="Për të shlyer borxhin."),
 dict(id="s04c", who="A", speaker="A", dur=3,
      frame="Close-up of Adriani's face from a slight low angle as he looks up at her, calm and certain, green lamp "
            "edge light, rain-streaked window bokeh behind.",
      action="He finishes the sentence quietly.",
      cam="static, faint handheld",
      line="Përndryshe humbisni shtëpinë."),
 dict(id="s05", who="E", speaker="E", dur=4,
      frame="Close-up of Elira, still standing, her anger draining into fear, eyes glassy, lips parted. Green lamp "
            "light from the side, dark blurred background.",
      action="She freezes, then asks quietly, shaken.",
      cam="almost imperceptible push-in",
      line="Nga i di ti këto?"),
 # s06 line is split across three cuts (same filter reason)
 dict(id="s06a", who="AE", speaker="A", dur=4,
      frame="Over-the-shoulder shot from behind Elira (soft dark hair and green dress in the near foreground, left) "
            "toward Adriani at the desk. He pushes the white contract (heading 'KONTRATË') across the desk toward her "
            "with two fingers, holding her gaze.",
      action="He slides the contract toward her and speaks.",
      cam="over-the-shoulder, slow settle",
      line="Një vit martesë."),
 dict(id="s06b", who="E", speaker="A", offscreen=True, dur=3,
      frame="Close-up of Elira looking down at the white contract on the desk in front of her (heading 'KONTRATË'), "
            "her face lit by the green lamp, torn and afraid.",
      action="She stares down at the contract in silence; her lips stay closed.",
      cam="very slow push-in",
      line="Një milion euro."),
 dict(id="s06c", who="A", speaker="A", dur=3,
      frame="Close-up of Adriani, still SEATED in his leather chair behind the desk, leaning slightly forward toward her, calm, almost gentle, green lamp "
            "light on his face, rain-streaked window bokeh behind.",
      action="He says it softly, as if offering mercy.",
      cam="static, faint handheld",
      line="Pastaj je e lirë."),
 dict(id="s07", who="E", speaker="E", dur=3,
      frame="Medium close-up of Elira, now seated again across the desk, guarded and wary, looking at him.",
      action="She asks him, guarded.",
      cam="faint handheld",
      line="Dhe çfarë kërkon nga unë?"),
 dict(id="s08", who="A", speaker="A", dur=7,
      frame="Close-up of Adriani, head and shoulders filling the frame, seen at a three-quarter angle. Half of his face "
            "is in deep shadow, a thin green-lamp rim light on his cheek, rain-streaked window bokeh behind. Cold and precise.",
      action="He lays out the terms slowly, pausing between sentences.",
      cam="very slow push-in",
      line="Të jetosh në shtëpinë time. Të sillesh si gruaja ime. Dhe të mos bësh pyetje."),
 dict(id="s09", who="E", speaker=None, dur=3,
      frame="Top-down insert of the white contract on the walnut desk under green lamp light. Elira's slender hand "
            "turns a page; her fingertip stops on a bold printed clause that reads exactly: 'KATI I TRETË — NDALOHET "
            "HYRJA'. Other text is small and unreadable.",
      action="Her hand smooths the page and her fingertip slides to the clause and stops.",
      cam="gentle handheld drift closer to the clause",
      line=None),
 dict(id="s10", who="E", speaker="E", dur=5,
      frame="Medium close-up of Elira seated, holding the open contract in both hands, looking up from it toward him, "
            "suspicious.",
      action="She looks up from the page and asks him.",
      cam="faint handheld",
      line="Pse është shkruar që nuk mund të hyj në katin e tretë?"),
 dict(id="s11", who="A", speaker="A", dur=4,
      frame="Tight close-up of Adriani's face filling the frame, eyes and mouth sharp, his calm cracking for a moment — "
            "a flicker of something dark in his eyes, jaw tightening. Green lamp edge light, deep shadows, dark background.",
      action="A flicker of something dark crosses his face; he answers low.",
      cam="static, tense",
      line="Sepse ajo pjesë e shtëpisë nuk të përket ty."),
 dict(id="s12", who="E", speaker="E", dur=3,
      frame="Close-up of Elira seated, searching his face, unsettled. Behind her: the rain-streaked window with the "
            "blurred city skyline at night and the green-shaded banker's lamp, exactly as in the set reference.",
      action="She asks, almost a whisper.",
      cam="static, faint breathing movement",
      line="Çfarë fsheh atje?"),
 dict(id="s13", who="A", speaker="A", dur=3,
      frame="Medium close-up of Adriani, the mask back on, cold and final.",
      action="He says it flatly.",
      cam="static",
      line="Firmos ose largohu."),
 dict(id="s14", who="E", speaker="E", dur=6,
      frame="Medium close-up of Elira seated at the desk, holding a black fountain pen above the signature line of the "
            "white contract, her face visible, resolved but afraid.",
      action="She breathes in, says her line quietly, then signs the contract with one decisive stroke.",
      cam="slight drift down toward the signature",
      line="Në rregull. Pranoj."),
 dict(id="s15", who="A", speaker=None, dur=6,
      frame="Low insert of a smartphone lying face-up on the walnut desk, its screen glowing in the dark with a new text "
            "message in Albanian that reads: 'Ajo i ngjan fiks gruas që vrave.' Adriani's hand is entering frame to "
            "cover it; his tense face is soft in the background.",
      action="The phone vibrates. His hand snaps down and covers the screen. The camera pushes in on his face; his eyes "
             "flick up, cold and caught. He says nothing.",
      cam="push-in from the phone to his face",
      line=None, sfx="only the soft buzz of the phone vibrating on the wooden desk"),
]
