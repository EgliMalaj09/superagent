#!/usr/bin/env python3
"""Create projects/<name>/ with a working starter scene in a style kit.

    python3 templates/new_project.py <name> [--format 9x16|4x5|1x1|16x9] [--style news|vox|isometric|luxury|dossier|map|brand]
                                            [--reference references/<ref>] [--voice path/to/vo.wav] [--bed bed-vox.wav]

Then: edit SCRIPT.md (get approval) -> scene.html / scene.js -> python3 library/engines/build_page.py projects/<name> -> check, snapshot, render.
"""
import argparse, json, os, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BEDS = {"news": "bed-news-tension.wav", "vox": "bed-vox.wav", "isometric": "bed-explainer.wav", "luxury": "bed-luxury-pad.wav",
        "dossier": "bed-news-tension.wav", "map": "bed-explainer.wav", "brand": "bed-tech.wav"}

GENERIC_HTML = """<div class="L bg clip" id="bg" data-start="0" data-duration="__D__" data-track-index="1"></div>
<div class="L clip" id="s1" data-start="0" data-duration="__D__" data-track-index="2">
  <div style="position:absolute;left:8%;right:8%;top:24%;">
    <div class="kicker" id="k1">KICKER · TEMA</div>
    <div class="h" id="h1" style="font-size:96px;margin-top:22px;">A headline that says <span class="hl"><i id="hl1"></i><b>one idea</b></span></div>
  </div>
  <div style="position:absolute;left:8%;top:52%;">
    <div class="num" id="n1" data-layout-allow-overlap>0</div>
    <div class="body" id="b1" style="margin-top:10px;">what the number means, in one line</div>
  </div>
  <div style="position:absolute;left:8%;right:8%;top:68%;height:16%;" id="chart">
    <div class="bar" style="left:0%;height:40%;"></div><div class="bar" style="left:22%;height:65%;"></div>
    <div class="bar" style="left:44%;height:85%;"></div><div class="bar" style="left:66%;height:100%;background:var(--hi);"></div>
  </div>
  <div class="src" id="src1">Burimi: put the real source here</div>
</div>
<div class="L clip" style="pointer-events:none" data-start="0" data-duration="__D__" data-track-index="9"><div class="grain"></div></div>"""

GENERIC_JS = """// Times are seconds. When the voice-over exists, put each beat on its word time (Whisper words.json).
up('#k1', 0.2);
up('#h1', 0.45);
hl('#hl1', 1.1);
up('#n1', 1.8); count('#n1', 0, 46460, 1.8, 1.4);
up('#b1', 2.3);
growY('#chart .bar', 2.8);
fadeIn('#src1', 3.0);
kenBurns('#s1', 0, D, 1.0, 1.04);
"""

ISO_HTML = """<div class="L bg clip" id="bg" data-start="0" data-duration="__D__" data-track-index="1">
  <div class="cam" id="cam" style="left:50%;top:50%;"><div class="tilt" id="tilt"><div class="spin" id="w"></div></div></div>
</div>
<div class="L clip" data-start="0" data-duration="__D__" data-track-index="2">
  <div style="position:absolute;left:8%;right:8%;top:13%;text-align:center;">
    <div class="h" id="h1" style="font-size:84px;">A city that <span class="hl"><i id="hl1"></i><b>keeps growing</b></span></div>
  </div>
  <div class="src" id="src1">Burimi: put the real source here</div>
</div>"""

ISO_JS = """// One world, one camera, no cuts. World units: px; MM = px per metre. See examples/tirana-one/scene.js for a full film.
const LOT = 560, N = 5, WT = LOT * N, HT = LOT * N;
const w = world('w', 'tilt', WT, HT);
box(w, { x: -40, y: -40, w: WT + 80, d: HT + 80, h: 18, top: '#D6CFC1', s1: '#BDB4A3', s2: '#A69D8C' });
const G = layer(w, 18);
seed = 3; const towers = [];
for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
  const pal = PAL[Math.floor(rnd() * PAL.length)];
  const b = box(G, { x: i * LOT + 60, y: j * LOT + 60, w: LOT - 120, d: LOT - 120, h: Math.round(500 + rnd() * 1500), top: pal[0], s1: pal[1], s2: pal[2], win: true, h0: 10 });
  towers.push(b);
}
towers.forEach(function (b, i) { grow(b, 0.6 + i * 0.06, 0.9); });
const scrW = isoScreen(WT, HT);
camTo('#cam', scrW, WT / 2, HT / 2, 0, 0.55, H * 0.58, 0, 0);
camTo('#cam', scrW, WT / 2, HT / 2, 0, 0.32, H * 0.6, 0.2, D - 0.4, 'power1.inOut');
tl.fromTo('#w', { rotation: -45 }, { rotation: -36, duration: D, ease: 'none', immediateRender: true }, 0);
up('#h1', 0.3); hl('#hl1', 1.0); fadeIn('#src1', 1.4);
"""

MAP_HTML = """<div class="L bg clip" id="bg" data-start="0" data-duration="__D__" data-track-index="1">
  <div id="mcam" style="position:absolute;left:0;top:0;transform-origin:0 0;">
    <svg id="map" width="2400" height="2400"></svg>
    <svg id="routes" width="2400" height="2400" style="position:absolute;left:0;top:0;"></svg>
    <div id="pins" style="position:absolute;left:0;top:0;"></div>
  </div>
</div>
<div class="L clip" data-start="0" data-duration="__D__" data-track-index="2">
  <div style="position:absolute;left:8%;right:8%;top:12%;"><div class="kicker" id="k1">EMIGRIMI</div>
    <div class="h" id="h1" style="font-size:88px;margin-top:16px;">From Tirana to <span class="hl"><i id="hl1"></i><b>Rome</b></span></div></div>
  <div class="src" id="src1">Burimi: put the real source here</div>
</div>"""

MAP_JS = """const M = makeMap({ center: [17, 42], scale: 3800, highlight: ['008'] });   // 008 = Albania
const tr = M.pin('tr', 19.82, 41.33, 'Tiranë', 'r'), ro = M.pin('ro', 12.50, 41.90, 'Roma', 'l');
M.camTo([19.8, 41.3], 1.6, 0, 0);
M.camTo([19.8, 41.3], 1.8, 0, 1.2, 'none');
tr.show(0.5);
M.camTo([16.1, 41.6], 1.1, 1.2, 1.4);
M.route([19.82, 41.33], [12.5, 41.9], 1.4, 1.5);
ro.show(2.8);
up('#k1', 0.2); up('#h1', 0.45); hl('#hl1', 2.9); fadeIn('#src1', 3.2);
"""

LUX_JS = """// luxury: slow, expo/power4 eases, blur-ins, gold sweep, hairlines; sound = pad + one shimmer at the end
blurIn('#k1', 0.3, 0.9);
blurIn('#h1', 0.7, 1.1);
hl('#hl1', 1.6);
up('#n1', 2.2, 0.9); count('#n1', 0, 100, 2.2, 1.6, function (v) { return Math.round(v) + '%'; });
fadeIn('#b1', 2.8, 0.8);
growY('#chart .bar', 3.2, 1.1, 0.12);
fadeIn('#src1', 3.6, 0.8);
kenBurns('#s1', 0, D, 1.0, 1.03);
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("name"); ap.add_argument("--format", default="9x16"); ap.add_argument("--style", default="vox")
    ap.add_argument("--reference"); ap.add_argument("--voice"); ap.add_argument("--bed"); ap.add_argument("--duration", type=float, default=6.0)
    a = ap.parse_args()
    p = os.path.join(ROOT, "projects", a.name)
    if os.path.exists(p): raise SystemExit("projects/%s already exists" % a.name)
    os.makedirs(os.path.join(p, "media"))
    D = "%.2f" % a.duration
    html, js = GENERIC_HTML, GENERIC_JS
    if a.style == "isometric": html, js = ISO_HTML, ISO_JS
    elif a.style == "map": html, js = MAP_HTML, MAP_JS
    elif a.style == "luxury": js = LUX_JS
    if a.style == "luxury": html = html.replace("0</div>", "0%</div>")
    open(os.path.join(p, "scene.html"), "w").write(html.replace("__D__", D) + "\n")
    open(os.path.join(p, "scene.js"), "w").write(js)
    open(os.path.join(p, "scene.css"), "w").write("/* project-only CSS (wins over the style kit) */\n")
    audio = {"voice": [], "bed": {"src": a.bed or BEDS.get(a.style, "bed-vox.wav"), "volume": 0.07}, "sfx": []}
    if a.voice:
        shutil.copy(a.voice, os.path.join(p, "media", "vo.wav")); audio["voice"] = [{"src": "media/vo.wav", "start": 0}]
    proj = {"name": a.name, "format": a.format, "style": a.style, "engines": [], "lang": "sq",
            "duration": None if a.voice else a.duration, "audio": audio,
            "_notes": "duration null = voice length + 0.8 s. bed volume ~0.07 under a voice (0.15-0.2 without). sfx: [[name, time, volume<=0.1]] only on real hits."}
    if a.reference:
        ref = os.path.join(ROOT, a.reference)
        if os.path.exists(os.path.join(ref, "reference.css")): shutil.copy(os.path.join(ref, "reference.css"), os.path.join(p, "reference.css"))
        proj["reference"] = a.reference
    json.dump(proj, open(os.path.join(p, "project.json"), "w"), indent=2, ensure_ascii=False)
    shutil.copy(os.path.join(ROOT, "templates", "SCRIPT.md"), os.path.join(p, "SCRIPT.md"))
    print("created projects/%s (%s, %s%s)" % (a.name, a.format, a.style, ", reference " + a.reference if a.reference else ""))
    print("next: fill SCRIPT.md -> approve -> edit scene.html/scene.js -> python3 library/engines/build_page.py projects/%s" % a.name)


if __name__ == "__main__":
    main()
