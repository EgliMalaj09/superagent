"""Build the 3 style tests (A dossier, B map, C news) for part 1 into public_A/B/C.  python3 build.py [A B C]"""
import os, sys, shutil, wave

HERE = os.path.dirname(os.path.abspath(__file__))
SRC, SH = os.path.join(HERE, "src"), os.path.join(HERE, "shared")
D = 30.6
COMMON_SFX = [("stamp", 10.5, .55), ("whoosh", 11.0, .25), ("pop", 15.6, .3), ("pop", 17.3, .3), ("pop", 19.3, .3),
              ("swipe", 21.2, .25), ("boom", 24.6, .3), ("tick", 28.7, .3)]
STYLE_SFX = {
    "A": [("stamp", 0.48, .55), ("typing", 1.6, .18), ("pop", 2.55, .3), ("swipe", 5.9, .25), ("typing", 8.7, .15), ("stamp", 9.75, .55), ("whoosh", 10.3, .3)],
    "B": [("whoosh", 0.3, .25), ("tick", 1.6, .35), ("pop", 2.55, .25), ("swipe", 5.8, .3), ("whoosh", 6.6, .2)] +
         [("pop", t, .25) for t in (6.85, 7.3, 7.75, 8.15, 8.5)] + [("boom", 9.3, .35), ("glitch", 10.38, .25)],
    "C": [("glitch", 0.5, .3), ("boom", 0.5, .3), ("stamp", 1.6, .45), ("swipe", 2.5, .25), ("stamp", 4.0, .4), ("tick", 4.95, .3),
          ("pop", 6.85, .25), ("pop", 7.3, .25), ("pop", 7.74, .3), ("stamp", 8.7, .45), ("glitch", 9.65, .35), ("boom", 9.65, .35), ("glitch", 10.38, .3)],
}

KEEP = {"stamp": 0.6, "boom": 0.55, "whoosh": 0.7, "luxhit": 0.6}
VOX_SFX = {"C": [], "P2": [], "P3": [("stamp", 21.25, .35)], "P3B": [], "P4": [], "P5": [], "P6": [("stamp", 17.8, .35)], "P7": [], "P8": [("luxhit", 15.6, .3)]}
def thin(sfx, gap=1.4):
    """Fewer, softer sound effects: only the key hits, never closer than `gap` seconds."""
    out, last = [], -9
    for n, t, v in sorted(sfx, key=lambda x: x[1]):
        if n in KEEP and t - last >= gap:
            out.append((n, t, round(v * KEEP[n], 2))); last = t
    return out

def dur(p):
    w = wave.open(p); return w.getnframes() / w.getframerate()

def build(st):
    out = os.path.join(HERE, "public_" + st)
    for sub in ("fonts", "img", "sfx", "vendor", "media"):
        dst = os.path.join(out, sub)
        if os.path.exists(dst): shutil.rmtree(dst)
        shutil.copytree(os.path.join(SH, sub), dst, ignore=shutil.ignore_patterns("countries-50m.json"))
    if st == "B":
        open(os.path.join(out, "vendor", "world.js"), "w").write("window.__WORLD__=" + open(os.path.join(SH, "vendor", "countries-50m.json")).read() + ";")
    rd = lambda n: open(os.path.join(SRC, n)).read()
    shtml = rd(st + ".html"); style, body = shtml.split("</style>", 1); style = style.replace("<style>", "")
    audio = ['<audio id="vo1" src="media/vo1.wav" data-start="0" data-duration="10.85" data-track-index="80" data-volume="1"></audio>',]
    for i, (n, t, v) in enumerate(VOX_SFX["C"]):
        audio.append('<audio id="s%d" src="sfx/%s.wav" data-start="%.3f" data-duration="%.3f" data-track-index="%d" data-volume="%.2f"></audio>'
                     % (i, n, t, min(dur(os.path.join(SH, "sfx", n + ".wav")), D - t), 100 + i, v))
    libs = '<script src="vendor/gsap.min.js"></script>' + ('<script src="vendor/d3.min.js"></script><script src="vendor/topojson.min.js"></script><script src="vendor/world.js"></script>' if st == "B" else "")
    page = """<!doctype html><html lang="sq"><head><meta charset="utf-8"/><style>%s%s%s</style></head><body>
<div id="stage" data-composition-id="zv1%s" data-start="0" data-duration="%.2f" data-fps="30" data-width="1080" data-height="1920">
%s
%s
%s
%s
<script>
(function () {
  const tl = window.gsap.timeline({ paused: true });
%s
%s
  tl.to({}, { duration: %.2f }, 0);
  window.__timelines = window.__timelines || {}; window.__timelines["zv1%s"] = tl;
})();
</script>
</div></body></html>""" % (rd("common.css"), style, rd("vox.css"), st.lower(), D, body, rd("clip.html"), "\n".join(audio), libs, rd(st + ".js"), rd("clip.js"), D, st.lower())
    open(os.path.join(out, "index.html"), "w").write(page)
    open(os.path.join(out, "hyperframes.json"), "w").write('{"paths":{"blocks":"compositions","components":"compositions/components","assets":"assets"},"media":{"autoProxy":true}}')
    print("built public_%s" % st)

P2_SFX = [("glitch", 0.0, .3), ("stamp", 0.32, .45), ("boom", 0.8, .35), ("glitch", 0.8, .3), ("boom", 1.67, .4), ("glitch", 1.67, .3),
          ("swipe", 2.45, .25), ("whoosh", 3.3, .25), ("tick", 3.45, .25), ("stamp", 4.23, .45), ("boom", 6.0, .3), ("swipe", 6.5, .25)]

def build_p2():
    out = os.path.join(HERE, "public_P2"); D2 = 8.3
    for sub in ("fonts", "sfx", "vendor", "media"):
        dst = os.path.join(out, sub)
        if os.path.exists(dst): shutil.rmtree(dst)
        shutil.copytree(os.path.join(SH, sub), dst, ignore=shutil.ignore_patterns("countries-50m.json", "clip*.mp4"))
    rd = lambda n: open(os.path.join(SRC, n)).read()
    style, body = rd("P2.html").split("</style>", 1); style = style.replace("<style>", "")
    audio = ['<audio id="vo2" src="media/vo2.wav" data-start="0" data-duration="7.45" data-track-index="80" data-volume="1"></audio>']
    for i, (n, t, v) in enumerate(VOX_SFX["P2"]):
        audio.append('<audio id="s%d" src="sfx/%s.wav" data-start="%.3f" data-duration="%.3f" data-track-index="%d" data-volume="%.2f"></audio>'
                     % (i, n, t, min(dur(os.path.join(SH, "sfx", n + ".wav")), D2 - t), 100 + i, v))
    page = """<!doctype html><html lang="sq"><head><meta charset="utf-8"/><style>%s%s%s</style></head><body>
<div id="stage" data-composition-id="zv2" data-start="0" data-duration="%.2f" data-fps="30" data-width="1080" data-height="1920">
%s
%s
<script src="vendor/gsap.min.js"></script>
<script>
(function () {
  const tl = window.gsap.timeline({ paused: true });
%s
  tl.to({}, { duration: %.2f }, 0);
  window.__timelines = window.__timelines || {}; window.__timelines["zv2"] = tl;
})();
</script>
</div></body></html>""" % (rd("common.css"), style, rd("vox.css"), D2, body, "\n".join(audio), rd("P2.js"), D2)
    open(os.path.join(out, "index.html"), "w").write(page)
    open(os.path.join(out, "hyperframes.json"), "w").write('{"paths":{"blocks":"compositions","components":"compositions/components","assets":"assets"},"media":{"autoProxy":true}}')
    print("built public_P2")

P3_SFX = [("glitch", 0.0, .3), ("boom", 0.0, .3), ("stamp", 1.95, .45), ("glitch", 1.95, .25), ("pop", 4.25, .3), ("stamp", 6.7, .4), ("whoosh", 7.35, .25),
          ("pop", 16.0, .3), ("pop", 17.7, .3), ("stamp", 21.4, .6), ("boom", 21.45, .45), ("glitch", 21.45, .3)]

def build_part(name, D2, sfx, extra_audio):
    out = os.path.join(HERE, "public_" + name)
    for sub in ("fonts", "img", "sfx", "vendor", "media"):
        dst = os.path.join(out, sub)
        if os.path.exists(dst): shutil.rmtree(dst)
        shutil.copytree(os.path.join(SH, sub), dst, ignore=shutil.ignore_patterns("countries-50m.json", "clip1.mp4", "clip2.mp4"))
    rd = lambda n: open(os.path.join(SRC, n)).read()
    style, body = rd(name + ".html").split("</style>", 1); style = style.replace("<style>", "")
    audio = [a for a in extra_audio if 'id="bed' not in a]
    for i, (n, t, v) in enumerate(VOX_SFX.get(name, [])):
        audio.append('<audio id="s%d" src="sfx/%s.wav" data-start="%.3f" data-duration="%.3f" data-track-index="%d" data-volume="%.2f"></audio>'
                     % (i, n, t, min(dur(os.path.join(SH, "sfx", n + ".wav")), D2 - t), 100 + i, v))
    cid = "zv" + name.lower()
    page = """<!doctype html><html lang="sq"><head><meta charset="utf-8"/><style>%s%s%s</style></head><body>
<div id="stage" data-composition-id="%s" data-start="0" data-duration="%.2f" data-fps="30" data-width="1080" data-height="1920">
%s
%s
<script src="vendor/gsap.min.js"></script>
<script>
(function () {
  const tl = window.gsap.timeline({ paused: true });
%s
  tl.to({}, { duration: %.2f }, 0);
  window.__timelines = window.__timelines || {}; window.__timelines["%s"] = tl;
})();
</script>
</div></body></html>""" % (rd("common.css"), style, rd("vox.css"), cid, D2, body, "\n".join(audio), rd(name + ".js"), D2, cid)
    open(os.path.join(out, "index.html"), "w").write(page)
    open(os.path.join(out, "hyperframes.json"), "w").write('{"paths":{"blocks":"compositions","components":"compositions/components","assets":"assets"},"media":{"autoProxy":true}}')
    print("built public_" + name)

P4_SFX = [("glitch", 0.05, .3), ("boom", 0.05, .3), ("stamp", 2.15, .45), ("stamp", 4.5, .35), ("swipe", 4.85, .25), ("boom", 5.7, .35), ("glitch", 5.7, .25),
          ("pop", 5.85, .25), ("pop", 5.95, .25), ("stamp", 7.9, .5), ("glitch", 7.9, .3), ("whoosh", 9.3, .25), ("stamp", 11.65, .45), ("whoosh", 13.2, .25),
          ("tick", 13.45, .25), ("tick", 14.4, .2), ("tick", 15.9, .2), ("tick", 17.07, .2), ("tick", 19.02, .2), ("tick", 20.75, .2), ("boom", 21.4, .35)]

for st in (sys.argv[1:] or ["A", "B", "C"]):
    if st == "P2": build_p2()
    elif st == "P3": build_part("P3", 23.4, P3_SFX, ['<audio id="vo3" src="media/vo3.wav" data-start="0" data-duration="7.48" data-track-index="80" data-volume="1"></audio>',
                                                     '<audio id="bed1" src="sfx/bed.wav" data-start="0" data-duration="7.6" data-media-start="5" data-track-index="81" data-volume="0.2"></audio>',
                                                     '<audio id="bed2" src="sfx/bed.wav" data-start="7.6" data-duration="15.8" data-media-start="12.6" data-track-index="82" data-volume="0.1"></audio>'])
    elif st == "P3B": build_part("P3B", 15.4, [("whoosh", 0.05, .3), ("stamp", 0.9, .4), ("whoosh", 3.35, .25)],
                                 ['<audio id="bed1" src="sfx/bed.wav" data-start="0" data-duration="3.6" data-media-start="14" data-track-index="81" data-volume="0.22"></audio>',
                                  '<audio id="bed2" src="sfx/bed.wav" data-start="3.6" data-duration="11.8" data-media-start="17.6" data-track-index="82" data-volume="0.1"></audio>'])
    elif st == "P4": build_part("P4", 23.2, P4_SFX, ['<audio id="vo4" src="media/vo4.wav" data-start="0" data-duration="22.6" data-track-index="80" data-volume="1"></audio>',
                                                     '<audio id="bed" src="sfx/bed.wav" data-start="0" data-duration="23.2" data-media-start="3" data-track-index="81" data-volume="0.18"></audio>'])
    elif st == "P5": build_part("P5", 9.9, [("boom", 0.07, .3), ("whoosh", 0.1, .2), ("tick", 1.85, .25), ("boom", 3.5, .35), ("glitch", 3.5, .25), ("tick", 4.4, .25),
                                            ("stamp", 5.83, .4), ("stamp", 8.3, .5), ("glitch", 8.3, .3), ("boom", 8.3, .35)],
                                ['<audio id="vo5" src="media/vo5.wav" data-start="0" data-duration="9.33" data-track-index="80" data-volume="1"></audio>',
                                 '<audio id="bed" src="sfx/bed.wav" data-start="0" data-duration="9.9" data-media-start="6" data-track-index="81" data-volume="0.18"></audio>'])
    elif st == "P6": build_part("P6", 20.0, [("whoosh", 0.05, .2), ("boom", 0.95, .35), ("glitch", 0.95, .3), ("glitch", 2.3, .25), ("pop", 2.7, .25), ("stamp", 4.0, .35),
                                             ("boom", 4.95, .35), ("swipe", 5.3, .2), ("stamp", 6.3, .4), ("whoosh", 7.5, .2), ("glitch", 8.5, .3), ("boom", 8.5, .3), ("typing", 8.6, .15),
                                             ("glitch", 10.62, .3), ("boom", 10.62, .4), ("pop", 10.9, .25), ("stamp", 13.7, .4), ("stamp", 15.2, .45), ("stamp", 17.95, .6), ("boom", 18.0, .45)],
                                ['<audio id="vo6" src="media/vo6.wav" data-start="0" data-duration="19.44" data-track-index="80" data-volume="1"></audio>',
                                 '<audio id="bed" src="sfx/bed.wav" data-start="0" data-duration="20.0" data-media-start="1" data-track-index="81" data-volume="0.18"></audio>'])
    elif st == "P7": build_part("P7", 25.2, [("boom", 0.1, .35), ("glitch", 0.1, .25), ("pop", 0.4, .2), ("pop", 1.1, .2), ("swipe", 1.5, .2), ("stamp", 2.05, .5), ("boom", 2.05, .3),
                                             ("stamp", 4.05, .35), ("boom", 4.92, .35), ("glitch", 6.1, .3), ("stamp", 7.35, .45), ("tick", 9.2, .25),
                                             ("stamp", 10.76, .5), ("boom", 10.76, .35), ("whoosh", 12.6, .25), ("stamp", 13.6, .35), ("stamp", 14.8, .45), ("tick", 17.6, .25),
                                             ("boom", 20.5, .45), ("glitch", 20.5, .3), ("tick", 21.7, .25), ("stamp", 22.64, .35)],
                                ['<audio id="vo7" src="media/vo7.wav" data-start="0" data-duration="24.67" data-track-index="80" data-volume="1"></audio>',
                                 '<audio id="bed" src="sfx/bed.wav" data-start="0" data-duration="25.2" data-media-start="2" data-track-index="81" data-volume="0.18"></audio>'])
    elif st == "P8": build_part("P8", 18.2, [("stamp", 0.05, .45), ("boom", 0.05, .3), ("pop", 0.4, .2), ("tick", 0.6, .2), ("tick", 1.05, .2), ("tick", 1.5, .2),
                                             ("stamp", 2.1, .45), ("glitch", 2.1, .25), ("swipe", 3.29, .25), ("boom", 4.3, .4), ("glitch", 4.3, .3),
                                             ("stamp", 5.36, .4), ("boom", 6.1, .3), ("whoosh", 7.05, .2), ("stamp", 8.06, .45), ("tick", 9.83, .2), ("tick", 11.22, .2),
                                             ("stamp", 12.2, .45), ("whoosh", 14.1, .3), ("boom", 14.23, .4), ("stamp", 15.23, .4), ("boom", 15.6, .5), ("luxhit", 15.6, .4)],
                                ['<audio id="vo8" src="media/vo8.wav" data-start="0" data-duration="16.7" data-track-index="80" data-volume="1"></audio>',
                                 '<audio id="bed" src="sfx/bed.wav" data-start="0" data-duration="18.2" data-media-start="4" data-track-index="81" data-volume="0.18"></audio>'])
    else: build(st)
