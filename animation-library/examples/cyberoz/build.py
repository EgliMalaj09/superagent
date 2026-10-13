"""Assemble public/index.html for the 4:5 cyberOZ composition: design.html + design.js + sound effects."""
import os, wave

HERE = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.join(HERE, "public")
D = 44.0
SFX = [("pop", 0.25, .2), ("pop", 0.81, .18), ("pop", 1.37, .18), ("pop", 1.93, .18), ("ding", 2.6, .22),
       ("tick", 4.2, .35), ("tick", 4.8, .35), ("tick", 5.4, .35), ("swipe", 6.3, .25), ("pop", 6.5, .3), ("tick", 7.0, .25), ("tick", 7.6, .25),
       ("whoosh", 8.92, .3), ("boom", 9.25, .35), ("luxhit", 9.6, .4), ("shimmer", 9.7, .3), ("swipe", 11.15, .25), ("pop", 11.85, .2),
       ("whoosh", 12.95, .25), ("whoosh", 13.85, .2), ("pop", 14.7, .18), ("pop", 15.02, .18), ("pop", 15.34, .18), ("pop", 15.66, .18), ("pop", 15.98, .18), ("pop", 16.3, .22),
       ("whoosh", 19.95, .25), ("pop", 20.7, .2), ("pop", 20.92, .2), ("pop", 21.14, .2), ("pop", 21.36, .2), ("tick", 22.6, .3), ("tick", 24.6, .3),
       ("ding", 25.3, .18), ("ding", 25.8, .18), ("ding", 26.3, .22),
       ("whoosh", 26.95, .25), ("tick", 28.6, .2), ("ding", 29.4, .18), ("boom", 30.4, .25), ("tick", 30.45, .4), ("swipe", 30.6, .25),
       ("whoosh", 32.95, .25)] + [("tick", 33.7 + i * 0.11, .18) for i in range(9)] + [
       ("whoosh", 37.95, .25), ("shimmer", 38.8, .25), ("swipe", 40.95, .3), ("click", 42.72, .45), ("luxhit", 43.0, .35), ("shimmer", 43.05, .25)]

def dur(name):
    w = wave.open(os.path.join(PUB, "sfx", name + ".wav")); return w.getnframes() / w.getframerate()

audio = ['<audio id="bed" src="sfx/bed.wav" data-start="0" data-duration="%.2f" data-track-index="90" data-volume="0.34"></audio>' % D]
for i, (n, t, v) in enumerate(SFX):
    audio.append('<audio id="sfx%d" src="sfx/%s.wav" data-start="%.3f" data-duration="%.3f" data-track-index="%d" data-volume="%.2f"></audio>'
                 % (i, n, t, min(dur(n), D - t), 100 + i, v))
html = open(os.path.join(HERE, "design.html")).read()
js = open(os.path.join(HERE, "design.js")).read()
style, body = html.split("</style>", 1)
page = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"/>%s</style></head>
<body>
<div id="stage" data-composition-id="cyberoz" data-start="0" data-duration="%.2f" data-fps="30" data-width="1080" data-height="1350">
%s
%s
<script src="vendor/gsap.min.js"></script>
<script>
(function () {
  const tl = window.gsap.timeline({ paused: true });
%s
  tl.to({}, { duration: %.2f }, 0);
  window.__timelines = window.__timelines || {}; window.__timelines["cyberoz"] = tl;
})();
</script>
</div></body></html>
""" % (style, D, body, "\n".join(audio), js, D)
open(os.path.join(PUB, "index.html"), "w").write(page)
open(os.path.join(PUB, "hyperframes.json"), "w").write('{"paths":{"blocks":"compositions","components":"compositions/components","assets":"assets"},"media":{"autoProxy":true}}')
print("wrote public/index.html: 1080x1350, %.0f s, %d sounds" % (D, len(SFX)))
