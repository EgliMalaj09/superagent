#!/usr/bin/env python3
"""Build projects/<name>/public/index.html from the project's scene files + a style kit + engines.

    python3 library/engines/build_page.py projects/<name>

Project folder:
    project.json   format, style, engines, duration, audio (voice, bed, sfx)
    scene.html     the visual layers (everything inside the stage)
    scene.css      extra CSS for this project (optional)
    scene.js       the GSAP timeline code (uses `tl`, W, H and the helpers in motion.js)
    media/         voice-over, photos, clips, logos (copied to public/media)
    reference.css  written by the style-reference skill (optional, loaded last so it wins)
"""
import json, os, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LIB = os.path.join(ROOT, "library")
FORMATS = {"9x16": (1080, 1920), "4x5": (1080, 1350), "1x1": (1080, 1080), "16x9": (1920, 1080)}


def probe(path):
    try:
        return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]).decode().strip())
    except Exception:
        return 0.0


def main(pdir):
    pdir = os.path.abspath(pdir)
    P = json.load(open(os.path.join(pdir, "project.json")))
    W, H = FORMATS[P.get("format", "9x16")]
    out = os.path.join(pdir, "public")
    for sub in ("fonts", "vendor", "sfx", "media"):
        if os.path.exists(os.path.join(out, sub)): shutil.rmtree(os.path.join(out, sub))
    os.makedirs(out, exist_ok=True)
    shutil.copytree(os.path.join(LIB, "fonts"), os.path.join(out, "fonts"))
    os.makedirs(os.path.join(out, "vendor")); os.makedirs(os.path.join(out, "sfx"))
    shutil.copy(os.path.join(LIB, "vendor", "gsap.min.js"), os.path.join(out, "vendor"))
    if os.path.isdir(os.path.join(pdir, "media")): shutil.copytree(os.path.join(pdir, "media"), os.path.join(out, "media"))
    engines = P.get("engines", [])
    if P.get("style") == "isometric" and "isometric" not in engines: engines.append("isometric")
    if P.get("style") == "map" and "map" not in engines: engines.append("map")
    scripts = ['<script src="vendor/gsap.min.js"></script>']
    if "map" in engines:
        for f in ("d3.min.js", "topojson.min.js"): shutil.copy(os.path.join(LIB, "vendor", f), os.path.join(out, "vendor"))
        open(os.path.join(out, "vendor", "world.js"), "w").write("window.__WORLD__=" + open(os.path.join(LIB, "vendor", "countries-50m.json")).read() + ";")
        scripts += ['<script src="vendor/d3.min.js"></script>', '<script src="vendor/topojson.min.js"></script>', '<script src="vendor/world.js"></script>']

    # ---- audio: voice leads, bed ~15 dB under, very few quiet sfx ----
    A = P.get("audio", {}); tags = []; warn = []; end = 0.0
    for i, v in enumerate(A.get("voice", [])):
        d = probe(os.path.join(pdir, v["src"])); end = max(end, v.get("start", 0) + d)
        tags.append('<audio id="vo%d" src="%s" data-start="%.3f" data-duration="%.3f" data-track-index="%d" data-volume="%.2f"></audio>'
                    % (i, v["src"], v.get("start", 0), d, 80 + i, v.get("volume", 1)))
    D = P.get("duration") or round(end + 0.8, 2) or 10
    bed = A.get("bed")
    if bed:
        src = os.path.join(pdir, bed["src"]) if bed["src"].startswith("media/") else os.path.join(LIB, "sfx", bed["src"])
        if bed.get("volume", 0.07) > 0.1 and A.get("voice"): warn.append("bed volume %.2f > 0.1 while a voice plays (taste: ~0.07)" % bed["volume"])
        # one continuous bed: looped if short, trimmed to the video, 1.5 s fade-out at the end
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-stream_loop", "-1", "-ss", str(bed.get("media_start", 0)), "-i", src, "-t", "%.3f" % D,
                        "-af", "afade=t=in:d=0.6,afade=t=out:st=%.3f:d=1.5" % max(0, D - 1.5), "-ar", "48000", os.path.join(out, "sfx", "bed.wav")], check=True)
        tags.append('<audio id="bed" src="sfx/bed.wav" data-start="0" data-duration="%.3f" data-track-index="90" data-volume="%.2f"></audio>'
                    % (D, bed.get("volume", 0.07)))
    for i, (name, t, vol) in enumerate(A.get("sfx", [])):
        f = os.path.join(LIB, "sfx", name + ".wav"); shutil.copy(f, os.path.join(out, "sfx"))
        if vol > 0.1: warn.append("sfx %s at %.2fs volume %.2f > 0.1" % (name, t, vol))
        tags.append('<audio id="s%d" src="sfx/%s.wav" data-start="%.3f" data-duration="%.3f" data-track-index="%d" data-volume="%.2f"></audio>'
                    % (i, name, t, min(probe(f), D - t), 100 + i, vol))
    if len(A.get("sfx", [])) > max(3, D / 8): warn.append("%d sfx in %.0fs — taste says very few (stamps, the ending)" % (len(A["sfx"]), D))

    rd = lambda p: open(p).read() if os.path.exists(p) else ""
    css = rd(os.path.join(LIB, "styles", "base.css")) + rd(os.path.join(LIB, "styles", P.get("style", "vox") + ".css"))
    css += rd(os.path.join(pdir, "reference.css")) + rd(os.path.join(pdir, "scene.css"))
    css += "\n:root { --W:%dpx; --H:%dpx; }\n" % (W, H)
    js = rd(os.path.join(LIB, "engines", "motion.js"))
    for e in engines: js += "\n" + rd(os.path.join(LIB, "engines", e + ".js"))
    js += "\n// ---- scene ----\n" + rd(os.path.join(pdir, "scene.js"))
    cid = P.get("name", os.path.basename(pdir)).replace("-", "_")
    page = """<!doctype html><html lang="%s"><head><meta charset="utf-8"/><style>
%s
</style></head><body>
<div id="stage" data-composition-id="%s" data-start="0" data-duration="%.2f" data-fps="30" data-width="%d" data-height="%d">
%s
%s
%s
<script>
(function () {
  const W = %d, H = %d, D = %.2f;
  const tl = window.gsap.timeline({ paused: true });
%s
  tl.to({}, { duration: D }, 0);
  window.__timelines = window.__timelines || {}; window.__timelines["%s"] = tl;
})();
</script>
</div></body></html>""" % (P.get("lang", "sq"), css, cid, D, W, H, rd(os.path.join(pdir, "scene.html")), "\n".join(tags), "\n".join(scripts), W, H, D, js, cid)
    open(os.path.join(out, "index.html"), "w").write(page)
    open(os.path.join(out, "hyperframes.json"), "w").write('{"paths":{"blocks":"compositions","components":"compositions/components","assets":"assets"},"media":{"autoProxy":true}}')
    print("built %s/public  %dx%d  %.2fs  style=%s engines=%s" % (os.path.relpath(pdir, ROOT), W, H, D, P.get("style"), ",".join(engines) or "-"))
    for w in warn: print("  TASTE WARNING:", w)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else ".")
