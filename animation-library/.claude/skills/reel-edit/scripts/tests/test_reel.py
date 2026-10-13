"""The Reel-only scripts: reel-compose.py builds a 1080x1920 page with transcript captions, sfx-synth.py writes the
sound kit at -3 dBFS, prep-source.py turns a landscape 24 fps clip into a 1080x1920 30 fps BT.709 source."""
import os, re, unittest, wave
from .helpers import ffmpeg, needs_ffmpeg, probe, read, run, scratch, write

WORDS = [{"text": w, "start": i * 0.4, "end": i * 0.4 + 0.3}
         for i, w in enumerate("I edit all my reels for free. Follow for part two.".split())]


class ReelCompose(unittest.TestCase):
    def build(self, d, beats, captions=True):
        write(os.path.join(d, "transcript.json"), {"words": WORDS})
        spec = {"id": "t", "duration": 5.0, "beats": beats, "camera": [["punch", 1.0, 1.15], ["set", 2.0, 1.0]]}
        if captions:
            spec["captions"] = {"src": "transcript.json", "max_words": 3}
        write(os.path.join(d, "storyboard.json"), spec)
        return run("reel-compose.py", "--spec", os.path.join(d, "storyboard.json"), "--out", os.path.join(d, "public"))

    def test_vertical_page_with_captions(self):
        d = scratch(self)
        r = self.build(d, [{"type": "hook", "id": "h", "text": "Free Reels", "em": [0], "in": 0, "out": 2, "anchor": "-"},
                           {"type": "cta", "id": "c", "text": "Follow for part 2", "in": 2.8, "out": 5, "anchor": "follow"}])
        self.assertEqual(r.returncode, 0, r.stderr)
        html = read(os.path.join(d, "public", "index.html"))
        self.assertIn('data-width="1080" data-height="1920"', html)
        caps = re.findall(r'<div class="cap clip" id="(cap\d+)" data-start="([\d.]+)" data-duration="([\d.]+)"', html)
        # "I edit all" / "my reels for" / "free." / "Follow for part" / "two." (3 words max, a break at every full stop)
        self.assertEqual(len(caps), 5, caps)
        for (_, s1, d1), (_, s2, _) in zip(caps, caps[1:]):
            self.assertLessEqual(float(s1) + float(d1), float(s2) + 1e-6, "caption chunks overlap")
        self.assertIn("FREE", html)
        self.assertNotIn("WARN nothing on screen", r.stdout)

    def test_warns_without_a_hook_and_on_repeats(self):
        d = scratch(self)
        r = self.build(d, [{"type": "title", "id": "a", "text": "One", "in": 1, "out": 2, "anchor": "-"},
                           {"type": "title", "id": "b", "text": "Two", "in": 2.5, "out": 3.5, "anchor": "-"}], captions=False)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("WARN nothing on screen in the first 0.5 s", r.stdout)
        self.assertIn("WARN same format twice in a row", r.stdout)

    def test_bad_beat_is_refused(self):
        d = scratch(self)
        r = self.build(d, [{"type": "hook", "id": "h", "text": "x", "in": 3, "out": 9, "anchor": "-"}])
        self.assertNotEqual(r.returncode, 0)


class SfxSynth(unittest.TestCase):
    def test_kit_is_written_and_starts_on_the_transient(self):
        d = scratch(self)
        r = run("sfx-synth.py", "--out", d, "--only", "pop,whoosh,ding")
        self.assertEqual(r.returncode, 0, r.stderr)
        for name in ("pop", "whoosh", "ding"):
            with wave.open(os.path.join(d, name + ".wav")) as w:
                self.assertEqual((w.getframerate(), w.getnchannels()), (48000, 1))
                frames = w.readframes(w.getnframes())
            import array
            a = array.array("h", frames)
            peak = max(abs(x) for x in a)
            self.assertAlmostEqual(peak / 32767, 10 ** (-3 / 20), delta=0.01)
        self.assertFalse(os.path.exists(os.path.join(d, "boom.wav")))


@needs_ffmpeg
class PrepSource(unittest.TestCase):
    def test_landscape_becomes_vertical_30fps_bt709(self):
        d = scratch(self)
        src, out, wav = os.path.join(d, "land.mp4"), os.path.join(d, "prep.mp4"), os.path.join(d, "a.wav")
        ffmpeg("-f", "lavfi", "-i", "testsrc2=size=1280x720:rate=24", "-f", "lavfi", "-i", "sine=f=440:r=48000",
               "-t", "2", "-c:v", "libx264", "-c:a", "aac", "-shortest", src)
        r = run("prep-source.py", "--in", src, "--out", out, "--wav", wav)
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn("1080x1920, 30/1 fps, bt709", r.stdout)
        self.assertTrue(os.path.exists(wav))
        self.assertAlmostEqual(probe(out)[1], 2.0, delta=0.1)


if __name__ == "__main__":
    unittest.main()
