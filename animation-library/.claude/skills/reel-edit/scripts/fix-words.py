#!/usr/bin/env python3
"""fix-words.py: Claude's proofreading pass on a Whisper transcript. Timings stay, only the spelling changes.

Whisper writes Albanian with missing or wrong diacritics (e/ë, c/ç), split or merged words and misheard names. The
captions are printed from this text, so Claude reads it once (compact: one numbered line per sentence) and fixes it.

  --show                    print "index:word" per sentence, the cheapest way to read a transcript
  --set 12=përshëndetje     replace word 12 (repeatable; keep any trailing punctuation you want shown)
  --merge 14-15=faleminderit   two misheard pieces become one word (start of 14, end of 15)
  --sub "pershendetje=>përshëndetje"   replace a word everywhere (case-insensitive match, exact replacement)

Usage:
  python3 fix-words.py --transcript W/transcript.json --show
  python3 fix-words.py --transcript W/transcript.json --set 3=ëndrra --merge 7-8=mirëdita --sub "Instagrami=>Instagram-i"
Writes the file in place (a .bak copy first) and touches nothing but "text". Run it after EVERY transcription, raw and flat.
"""
import argparse, json, re, shutil

ap = argparse.ArgumentParser()
ap.add_argument("--transcript", required=True)
ap.add_argument("--show", action="store_true")
ap.add_argument("--set", action="append", default=[])
ap.add_argument("--merge", action="append", default=[])
ap.add_argument("--sub", action="append", default=[])
a = ap.parse_args()
raw = json.load(open(a.transcript))
words = raw["words"] if isinstance(raw, dict) and "words" in raw else raw

if a.set or a.merge or a.sub:
    shutil.copy(a.transcript, a.transcript + ".bak")
    for s in a.sub:
        old, new = s.split("=>", 1)
        for w in words:
            core = re.sub(r"[\.,;:!\?]+$", "", w["text"])
            if core.lower() == old.lower():
                w["text"] = new + w["text"][len(core):]
    for s in a.set:
        i, new = s.split("=", 1)
        words[int(i)]["text"] = new
    for s in sorted(a.merge, key=lambda s: -int(s.split("-")[0])):   # from the end, so indices stay valid
        rng, new = s.split("=", 1)
        i, j = [int(x) for x in rng.split("-")]
        words[i]["text"], words[i]["end"] = new, words[j]["end"]
        del words[i + 1:j + 1]
    json.dump(raw, open(a.transcript, "w"), ensure_ascii=False, indent=1)
    print("fixed %d set, %d merge, %d sub -> %s (%d words)" % (len(a.set), len(a.merge), len(a.sub), a.transcript, len(words)))

if a.show or not (a.set or a.merge or a.sub):
    line = []
    for i, w in enumerate(words):
        line.append("%d:%s" % (i, w["text"]))
        if re.search(r"[\.\?!]$", w["text"]) or len(line) >= 14:
            print("%.1f  %s" % (float(words[i - len(line) + 1]["start"]), " ".join(line))); line = []
    if line:
        print("%.1f  %s" % (float(words[len(words) - len(line)]["start"]), " ".join(line)))
