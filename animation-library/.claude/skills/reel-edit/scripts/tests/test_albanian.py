"""Albanian: accent-folded matching (ë = e, ç = c), Albanian retake markers in the paper cut, fix-words.py."""
import json, os, unittest
from .helpers import read, run, scratch, write


def words(text, t0=0.0, step=0.4):
    return [{"text": w, "start": round(t0 + i * step, 2), "end": round(t0 + i * step + 0.3, 2)} for i, w in enumerate(text.split())]


class Albanian(unittest.TestCase):
    def test_phrase_times_matches_without_diacritics(self):
        d = scratch(self)
        tr = write(os.path.join(d, "t.json"), {"words": words("Sot do ju tregoj si e bëj këtë.")})
        r = run("phrase-times.py", "--transcript", tr, "si e bej kete", "çfarë")
        self.assertIn("1.60-3.10", r.stdout, r.stdout + r.stderr)
        self.assertIn("NOT FOUND", r.stdout)

    def test_fshije_marker_drops_the_flub(self):
        d = scratch(self)
        w = words("Kjo është gabim. Fshije.", 0.0) + words("Kjo është mënyra më e mirë.", 4.0)
        tr = write(os.path.join(d, "raw.json"), {"words": w})
        r = run("paper-cut.py", "--transcript", tr, "--duration", "8", "--out-dir", d)
        self.assertEqual(r.returncode, 0, r.stderr)
        cut = json.load(open(os.path.join(d, "cut-list.json")))
        first = min(float(k["start"]) for k in cut["kept"])
        self.assertGreaterEqual(first, 3.5, read(os.path.join(d, "PAPER-CUT.md")))

    def test_fix_words_keeps_timings(self):
        d = scratch(self)
        tr = write(os.path.join(d, "t.json"), {"words": words("pershendetje te gjitheve fale minderit.")})
        r = run("fix-words.py", "--transcript", tr, "--sub", "pershendetje=>Përshëndetje", "--set", "1=të", "--merge", "3-4=faleminderit.")
        self.assertEqual(r.returncode, 0, r.stderr)
        w = json.load(open(tr))["words"]
        self.assertEqual([x["text"] for x in w], ["Përshëndetje", "të", "gjitheve", "faleminderit."])
        self.assertEqual((w[3]["start"], w[3]["end"]), (1.2, 1.9))
        self.assertIn("0:Përshëndetje", run("fix-words.py", "--transcript", tr, "--show").stdout)


if __name__ == "__main__":
    unittest.main()
