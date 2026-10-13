#!/usr/bin/env python3
"""reel-compose.py: build public/index.html for a 9:16 Reel (1080x1920, 30 fps) from storyboard.json.

The storyboard is the review artifact AND the source of truth; retiming a beat is editing one number.

Usage:
  python3 reel-compose.py --spec projects/<p>/storyboard.json --out projects/<p>/public [--shared library]
  --shared: img/* -> <out>/img, sfx/* -> <out>/sfx (make the sounds once with sfx-synth.py, free, no downloads)

storyboard.json:
{
  "id": "reel1", "duration": 31.2, "video": "input-video.mp4", "origin": "50% 32%",
  "accent": "#FFD60A",                         # the highlight colour (captions' live word, em words); optional
  "captions": {"src": "transcript.json", "max_words": 3, "max_chars": 16, "y": 1180, "size": 82,
               "upper": true, "hide": [[12.0, 14.5]], "style": "pop|plain"},
  "beats": [
    {"type": "hook",   "id": "h1", "text": "I edit Reels for free", "em": [4], "in": 0.0, "out": 2.9, "anchor": "-"},
    {"type": "title",  "id": "t1", "text": "Step 1: cut the pauses", "em": [0,1], "in": 4.1, "out": 7.0, "anchor": "first"},
    {"type": "emoji",  "id": "e1", "char": "🔥", "x": 780, "y": 520, "size": 200, "in": 8.0, "out": 9.6, "anchor": "fire", "sound": "pop"},
    {"type": "logo",   "id": "lg", "src": "img/capcut.svg", "in": 10.0, "out": 12.5, "anchor": "CapCut", "sound": "pop"},
    {"type": "number", "id": "n1", "value": 1000, "prefix": "$", "suffix": "", "label": "a month", "in": 13.0, "out": 16.0, "anchor": "thousand"},
    {"type": "pills",  "id": "p1", "items": [["Captions", 17.1], ["Zooms", 17.9, "the zooms"], ["Sounds", 18.6]], "in": 16.9, "out": 20.5, "anchor": "captions"},
    {"type": "image",  "id": "i1", "src": "img/shot.png", "in": 21.0, "out": 24.0, "anchor": "this post"},
    {"type": "clip",   "id": "b1", "src": "broll/city.mp4", "in": 24.2, "out": 27.0, "anchor": "the city", "sound": "whoosh"},
    {"type": "cta",    "id": "c1", "text": "Follow for part 2", "em": [3,4], "in": 28.0, "out": 31.2, "anchor": "follow"}
  ],
  "camera": [["punch", 2.1, 1.15], ["set", 4.03, 1.0], ["creep", 4.1, 9.0, 1.08], ["release", 9.0, 0.4]],
  "sfx": [["whoosh", 4.0], ["ding", 15.4, 0.3]],
  "raw_html": "", "raw_js": ""
}
Every beat: type, id, in, out, anchor (the spoken phrase it lands on; "-" = deliberately unanchored).
A beat may carry "sound": "<name>" (sfx/<name>.wav at its entrance) and "y" to move it vertically.
Camera ops: set t scale | creep t0 t1 scale | punch t scale | release t dur | shake t (a 0.25 s hit, for a joke or a drop)
            | layout t preset [dur] [[fx,fy]]: full pip-bl pip-br pip-tl pip-tr bubble-bl bubble-br split-top split-card split-bottom
"face": [x, y] (top level) = the speaker's face centre in the source, used to aim every layout (default [540, 700]).
Safe area (Instagram UI): keep everything inside x 60..940 and y 230..1460. The composer's defaults already do.
"""
import argparse, glob, json, os, re, shutil

ap = argparse.ArgumentParser()
ap.add_argument("--spec", required=True)
ap.add_argument("--out", required=True)
ap.add_argument("--shared", default="")
args = ap.parse_args()
S = json.load(open(args.spec))
OUT = args.out
SPEC_DIR = os.path.dirname(os.path.abspath(args.spec))
os.makedirs(OUT, exist_ok=True)
W, H = 1080, 1920
D = float(S["duration"])
ACCENT = S.get("accent", "#FFD60A")

# ---- stage assets ---------------------------------------------------------------------------------------
SKILL = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
def stage(src, dst):
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    if os.path.isfile(src) and (not os.path.exists(dst) or os.path.getmtime(src) > os.path.getmtime(dst)):
        shutil.copy(src, dst)
for f in glob.glob(os.path.join(SKILL, "assets", "fonts", "*.woff2")):
    stage(f, os.path.join(OUT, "fonts", os.path.basename(f)))
GSAP_CDN = "https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"
local_gsap = os.path.join(SKILL, "assets", "vendor", "gsap.min.js")
if os.path.exists(local_gsap):
    stage(local_gsap, os.path.join(OUT, "vendor", "gsap.min.js"))
GSAP_SRC = "vendor/gsap.min.js" if os.path.exists(os.path.join(OUT, "vendor", "gsap.min.js")) else GSAP_CDN
if GSAP_SRC == GSAP_CDN:
    print("note: GSAP loads from the CDN (first render needs internet). Offline copy: curl -sL %s -o %s" % (GSAP_CDN, local_gsap))
if args.shared:
    for sub in ("img", "sfx"):
        for f in glob.glob(os.path.join(args.shared, sub, "*")):
            stage(f, os.path.join(OUT, sub, os.path.basename(f)))

def esc(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;"))

def anchor_attr(a):
    if a == "-":
        return ' data-unanchored="1"'
    return ' data-anchor="%s"' % esc(a) if a else ""

def em_html(text, em, cls="em"):
    em = set(em or [])
    return " ".join('<span class="%s">%s</span>' % (cls, esc(w)) if i in em else esc(w) for i, w in enumerate(text.split(" ")))

html, js, audio = [], [], []
track = [3]
audio_track = [40]
warns = []

def host(bid, t_in, t_out, inner, anchor="", z=10, extra_cls=""):
    html.append('    <div class="card-host clip%s" id="host-%s" data-start="%.3f" data-duration="%.3f" data-track-index="%d"%s '
                'style="z-index:%d;visibility:hidden;">%s</div>\n'
                % (extra_cls, bid, t_in, t_out - t_in, track[0], anchor_attr(anchor), z, inner))
    track[0] += 1

def sound(name, t, vol=None):
    path = os.path.join(OUT, "sfx", name + ".wav")
    dur = 1.5
    if os.path.exists(path):
        dur = max(0.05, (os.path.getsize(path) - 44) / (48000 * 2.0))   # sfx-synth writes 48 kHz mono 16-bit
    else:
        warns.append("WARN sfx/%s.wav missing (run sfx-synth.py into the --shared folder)" % name)
    dur = min(dur, D - t)
    vols = {"pop": 0.45, "click": 0.35, "whoosh": 0.30, "swipe": 0.30, "ding": 0.30, "typing": 0.25, "riser": 0.30, "boom": 0.45, "tick": 0.30}
    v = vol if vol is not None else vols.get(name, 0.35)
    audio.append('    <audio id="sfx-%s-%d" src="sfx/%s.wav" data-start="%.3f" data-duration="%.3f" data-track-index="%d" data-volume="%.2f"></audio>\n'
                 % (name, audio_track[0], name, t, dur, audio_track[0], v))
    audio_track[0] += 1

# ---- captions (word by word, from the flat-cut transcript) ------------------------------------------------
cap_html = []
C = S.get("captions")
n_chunks = 0
if C:
    src = C.get("src", "transcript.json")
    src = src if os.path.isabs(src) else os.path.join(SPEC_DIR, src)
    raw = json.load(open(src))
    words = raw["words"] if isinstance(raw, dict) and "words" in raw else raw
    words = [w for w in words if str(w.get("text", "")).strip()]
    hide = [(float(a), float(b)) for a, b in C.get("hide", [])]
    hidden = lambda t: any(a <= t < b for a, b in hide)
    max_w, max_c = int(C.get("max_words", 3)), int(C.get("max_chars", 16))
    chunks, cur = [], []
    for i, w in enumerate(words):
        st = float(w["start"])
        if hidden(st):
            if cur: chunks.append(cur); cur = []
            continue
        txt = re.sub(r"[\.,;:]+$", "", str(w["text"]).strip())
        if not txt:
            continue
        gap = st - cur[-1]["e"] if cur else 0
        length = sum(len(x["t"]) + 1 for x in cur) + len(txt)
        if cur and (len(cur) >= max_w or length > max_c or gap > 0.35):
            chunks.append(cur); cur = []
        cur.append({"t": txt, "s": st, "e": float(w["end"])})
        if re.search(r"[\.\?!,;:]$", str(w["text"]).strip()):
            chunks.append(cur); cur = []
    if cur: chunks.append(cur)
    upper = C.get("upper", True)
    size = int(C.get("size", 82)); y = int(C.get("y", 1180)); pop = C.get("style", "pop") == "pop"
    for k, ch in enumerate(chunks):
        t0 = ch[0]["s"]
        nxt = chunks[k + 1][0]["s"] if k + 1 < len(chunks) else D
        t1 = min(nxt, ch[-1]["e"] + 0.30, D)
        t1 = max(t1, min(t0 + 0.25, nxt, D))
        if t1 <= t0:
            continue
        cid = "cap%d" % k
        spans = "".join('<span class="cw" id="%s-w%d">%s</span>' % (cid, j, esc(x["t"].upper() if upper else x["t"])) for j, x in enumerate(ch))
        cap_html.append('    <div class="cap clip" id="%s" data-start="%.3f" data-duration="%.3f" data-track-index="2" style="top:%dpx;font-size:%dpx;">%s</div>\n'
                        % (cid, t0, t1 - t0, y, size, spans))
        if pop:
            js.append("tl.fromTo('#%s', { scale: 0.82, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.14, ease: 'power2.out', immediateRender: false }, %.3f);" % (cid, t0))
        for j, x in enumerate(ch):
            js.append("tl.fromTo('#%s-w%d', { color: '#FFFFFF' }, { color: ACCENT, duration: 0.04, immediateRender: false }, %.3f);" % (cid, j, x["s"]))
            if j + 1 < len(ch):
                js.append("tl.to('#%s-w%d', { color: '#FFFFFF', duration: 0.04 }, %.3f);" % (cid, j, ch[j + 1]["s"]))
        n_chunks += 1

# ---- beats ------------------------------------------------------------------------------------------------
def box_in(sel, t):
    js.append("tl.fromTo('%s', { scale: 0.88, opacity: 0, y: 24 }, { scale: 1, opacity: 1, y: 0, duration: 0.28, ease: 'power3.out', immediateRender: false }, %.3f);" % (sel, t))
def box_out(sel, t):
    js.append("tl.to('%s', { opacity: 0, y: -16, duration: 0.22, ease: 'power2.in' }, %.3f);" % (sel, t - 0.22))

for b in S.get("beats", []):
    ty, bid, t_in, t_out = b["type"], b["id"], float(b["in"]), float(b["out"])
    anchor = b.get("anchor", "")
    if t_out > D + 0.001 or t_out <= t_in:
        raise SystemExit("beat %s: bad in/out (%.2f..%.2f, duration %.2f)" % (bid, t_in, t_out, D))
    if ty in ("hook", "title", "cta"):
        y = int(b.get("y", {"hook": 300, "title": 330, "cta": 330}[ty]))
        size = int(b.get("size", {"hook": 84, "title": 74, "cta": 70}[ty]))
        style = b.get("style", "box" if ty != "title" else "plain")
        arrow = '<div class="cta-arrow" id="%s-arr">&#8595;</div>' % bid if ty == "cta" else ""
        inner = '<div class="txt %s" id="%s" style="top:%dpx;font-size:%dpx;">%s%s</div>' % (style, bid, y, size, em_html(b["text"], b.get("em")), arrow)
        host(bid, t_in, t_out, inner, anchor)
        box_in("#" + bid, t_in)
        if ty == "cta":
            js.append("tl.fromTo('#%s-arr', { y: 0 }, { y: 14, duration: 0.35, ease: 'sine.inOut', yoyo: true, repeat: %d }, %.3f);"
                      % (bid, max(1, int((t_out - t_in - 0.6) / 0.35)) | 1, t_in + 0.3))
        box_out("#" + bid, t_out)
    elif ty == "emoji":
        x, y, size = int(b.get("x", 540)), int(b.get("y", 560)), int(b.get("size", 180))
        inner = '<div class="emoji" id="%s" style="left:%dpx;top:%dpx;font-size:%dpx;">%s</div>' % (bid, x, y, size, esc(b["char"]))
        host(bid, t_in, t_out, inner, anchor)
        js.append("tl.fromTo('#%s', { scale: 0, rotation: -14 }, { scale: 1, rotation: 0, duration: 0.32, ease: 'back.out(2.2)', immediateRender: false }, %.3f);" % (bid, t_in))
        js.append("tl.to('#%s', { scale: 0, duration: 0.18, ease: 'power2.in' }, %.3f);" % (bid, t_out - 0.18))
    elif ty == "logo":
        y = int(b.get("y", 330))
        inner = '<div class="plate" id="%s" style="top:%dpx;"><img src="%s" alt=""/></div>' % (bid, y, esc(b["src"]))
        host(bid, t_in, t_out, inner, anchor)
        js.append("tl.fromTo('#%s', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.8)', immediateRender: false }, %.3f);" % (bid, t_in))
        box_out("#" + bid, t_out)
    elif ty == "number":
        y = int(b.get("y", 360)); dec = int(b.get("decimals", 0))
        label = '<div class="num-label">%s</div>' % em_html(b.get("label", ""), b.get("label_em")) if b.get("label") else ""
        inner = '<div class="num" id="%s" style="top:%dpx;"><div class="num-v" id="%s-v"></div>%s</div>' % (bid, y, bid, label)
        host(bid, t_in, t_out, inner, anchor)
        box_in("#" + bid, t_in)
        js.append("countUp('#%s-v', %s, %.3f, %.2f, %s, %s, %d);" % (bid, float(b["value"]), float(b.get("count_at", t_in + 0.1)),
                  float(b.get("count_dur", 1.1)), json.dumps(b.get("prefix", "")), json.dumps(b.get("suffix", "")), dec))
        box_out("#" + bid, t_out)
    elif ty == "pills":
        y = int(b.get("y", 330))
        items = ""
        for i, it in enumerate(b["items"]):
            a = it[2] if len(it) > 2 else it[0]
            items += '<div class="pill" id="%s-i%d" data-at="%.3f"%s>%s</div>' % (bid, i, float(it[1]), anchor_attr(a), esc(it[0]))
        inner = '<div class="pills" style="top:%dpx;">%s</div>' % (y, items)
        host(bid, t_in, t_out, inner, anchor)
        for i, it in enumerate(b["items"]):
            js.append("tl.fromTo('#%s-i%d', { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.28, ease: 'power3.out', immediateRender: false }, %.3f);" % (bid, i, float(it[1])))
        js.append("tl.to('#host-%s .pill', { opacity: 0, x: -30, duration: 0.22, stagger: 0.04, ease: 'power2.in' }, %.3f);" % (bid, t_out - 0.34))
    elif ty == "image":
        y = int(b.get("y", 300)); w = int(b.get("w", 880))
        inner = '<div class="imgcard" id="%s" style="top:%dpx;width:%dpx;"><img src="%s" alt=""/></div>' % (bid, y, w, esc(b["src"]))
        host(bid, t_in, t_out, inner, anchor)
        js.append("tl.fromTo('#%s', { y: 120, opacity: 0, rotation: -2 }, { y: 0, opacity: 1, rotation: 0, duration: 0.38, ease: 'power3.out', immediateRender: false }, %.3f);" % (bid, t_in))
        js.append("tl.fromTo('#%s img', { scale: 1.0 }, { scale: 1.06, duration: %.3f, ease: 'none', immediateRender: false }, %.3f);" % (bid, t_out - t_in, t_in))
        box_out("#" + bid, t_out)
    elif ty == "clip":
        html.append('    <video class="cutaway clip" id="%s" src="%s" muted playsinline data-start="%.3f" data-duration="%.3f" data-media-start="%.3f" data-track-index="%d"%s></video>\n'
                    % (bid, esc(b["src"]), t_in, t_out - t_in, float(b.get("media_start", 0)), track[0], anchor_attr(anchor)))
        track[0] += 1
        if b.get("drift", True):
            js.append("tl.fromTo('#%s', { scale: 1.0 }, { scale: 1.05, duration: %.3f, ease: 'none', immediateRender: false }, %.3f);" % (bid, t_out - t_in, t_in))
        if b.get("label"):
            lid = bid + "-lab"
            inner = '<div class="txt box" id="%s" style="top:%dpx;font-size:70px;">%s</div>' % (lid, int(b.get("label_y", 330)), em_html(b["label"], b.get("label_em")))
            host(lid, t_in, t_out, inner, "-", z=25)
            box_in("#" + lid, t_in + 0.15)
            box_out("#" + lid, t_out)
    else:
        raise SystemExit("unknown beat type %r (hook title cta emoji logo number pills image clip)" % ty)
    if b.get("sound"):
        sound(b["sound"], t_in)

for s in S.get("sfx", []):
    sound(s[0], float(s[1]), float(s[2]) if len(s) > 2 else None)

# ---- camera -----------------------------------------------------------------------------------------------
# Layouts: the whole footage frame (#video-wrap) is scaled + moved so the face lands in a box, and clipped to it.
# box = [x, y, w, h] on the 1080x1920 stage (inside the Instagram safe area), zoom = footage scale, radius in px.
FACE = tuple(S.get("face", [540, 700]))            # where the speaker's face sits in the source (px)
LAYOUTS = {
    "full":         ([0, 0, 1080, 1920], 1.0, 0),
    "pip-bl":       ([60, 1010, 330, 440], 0.55, 36),
    "pip-br":       ([610, 1010, 330, 440], 0.55, 36),
    "pip-tl":       ([60, 240, 330, 440], 0.55, 36),
    "pip-tr":       ([690, 240, 330, 440], 0.55, 36),
    "bubble-bl":    ([60, 1080, 360, 360], 0.5, 180),
    "bubble-br":    ([580, 1080, 360, 360], 0.5, 180),
    "split-top":    ([0, 0, 1080, 900], 1.0, 0),       # speaker above, graphics in y 900..1460
    "split-card":   ([60, 240, 960, 640], 0.85, 40),   # speaker in a rounded card up top
    "split-bottom": ([60, 860, 960, 600], 0.8, 40),    # graphics above, speaker card low (keep clear of the UI)
}
def frame_tween(box, focus, zoom, radius, t, dur):
    bx, by, bw, bh = [float(v) for v in box]
    fx, fy = float(focus[0]), float(focus[1])
    if bw >= W and bh >= H:                       # full frame: no offset, no clip
        tx, ty = 0.0, 0.0
    else:
        tx, ty = bx + bw / 2 - zoom * fx, by + bh / 2 - zoom * fy
    lx, ly, lw, lh = (bx - tx) / zoom, (by - ty) / zoom, bw / zoom, bh / zoom
    clip = "inset(%.1fpx %.1fpx %.1fpx %.1fpx round %.1fpx)" % (ly, W - lx - lw, H - ly - lh, lx, radius / zoom)
    return ("tl.to('#video-wrap', { x: %.1f, y: %.1f, scale: %.4f, clipPath: '%s', duration: %.3f, ease: 'expo.inOut' }, %.3f);"
            % (tx, ty, zoom, clip, dur, t))
cam = ["tl.set('#video-wrap', { x: 0, y: 0, scale: 1, clipPath: 'inset(0.0px 0.0px 0.0px 0.0px round 0.0px)' }, 0);"]
for op in S.get("camera", []):
    if op[0] == "set":
        cam.append("tl.set('#video-zoom', { scale: %.3f }, %.3f);" % (float(op[2]), float(op[1])))
    elif op[0] == "creep":
        cam.append("tl.to('#video-zoom', { scale: %.3f, duration: %.3f, ease: 'power1.inOut' }, %.3f);" % (float(op[3]), float(op[2]) - float(op[1]), float(op[1])))
    elif op[0] == "punch":
        cam.append("tl.to('#video-zoom', { scale: %.3f, duration: 0.18, ease: 'power3.out' }, %.3f);" % (float(op[2]), float(op[1])))
    elif op[0] == "release":
        cam.append("tl.to('#video-zoom', { scale: 1.0, duration: %.3f, ease: 'power2.inOut' }, %.3f);" % (float(op[2]), float(op[1])))
    elif op[0] == "shake":
        cam.append("tl.to('#video-zoom', { keyframes: [{ x: -14, y: 6 }, { x: 12, y: -8 }, { x: -8, y: 4 }, { x: 0, y: 0 }], duration: 0.25, ease: 'none' }, %.3f);" % float(op[1]))
    elif op[0] == "layout":
        # ["layout", t, preset, dur?, focus?]: move the speaker into a frame (corner, bubble, split) or back to full
        t, name = float(op[1]), op[2]
        dur = float(op[3]) if len(op) > 3 and op[3] is not None else 0.5
        if name not in LAYOUTS:
            raise SystemExit("unknown layout %r (%s)" % (name, " ".join(sorted(LAYOUTS))))
        box, zoom, radius = LAYOUTS[name]
        fx, fy = op[4] if len(op) > 4 else (FACE if name != "full" else (540, 960))
        cam.append(frame_tween(box, (fx, fy), zoom, radius, t, dur))
    else:
        raise SystemExit("unknown camera op %r" % op)

CSS = """
  @font-face { font-family: "DM Sans"; src: url("fonts/DMSans-400.woff2") format("woff2"); font-weight: 400; font-display: block; }
  @font-face { font-family: "DM Sans"; src: url("fonts/DMSans-500.woff2") format("woff2"); font-weight: 500; font-display: block; }
  @font-face { font-family: "DM Sans"; src: url("fonts/DMSans-700.woff2") format("woff2"); font-weight: 700; font-display: block; }
  * { box-sizing: border-box; }
  html, body { margin:0; padding:0; width:100%; height:100%; overflow:hidden; background:#000;
    font-family: "DM Sans", ui-sans-serif, system-ui, sans-serif; }
  :root { --accent: ACCENT; }
  #stage { position:relative; width:1080px; height:1920px; overflow:hidden; background:#000; }
  #video-wrap { position:absolute; left:0; top:0; width:1080px; height:1920px; overflow:hidden; transform-origin:0 0; }
  #video-zoom { position:absolute; inset:0; transform-origin:ORIGIN; will-change:transform; }
  #video-zoom video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; }
  .card-host { position:absolute; left:0; top:0; width:1080px; height:1920px; pointer-events:none; }
  .cutaway { position:absolute; left:0; top:0; width:1080px; height:1920px; object-fit:cover; z-index:20; }
  /* captions: centred, heavy, a dark stroke so they read on any footage; the live word takes the accent */
  .cap { position:absolute; left:60px; width:960px; text-align:center; z-index:30; font-weight:700; line-height:1.08;
    letter-spacing:-.01em; color:#fff; -webkit-text-stroke: 3px #000; paint-order: stroke fill;
    text-shadow: 0 6px 18px rgba(0,0,0,.65); }
  .cap .cw { display:inline-block; margin:0 .13em; }
  /* hook / title / cta */
  .txt { position:absolute; left:50%; translate:-50% 0; max-width:900px; width:max-content; text-align:center; font-weight:700;
    line-height:1.12; letter-spacing:-.015em; }
  .txt.box { background:#fff; color:#111; padding:.22em .5em .26em; border-radius:22px; box-shadow:0 18px 50px rgba(0,0,0,.35); }
  .txt.box .em { color:#111; background:var(--accent); border-radius:10px; padding:0 .12em; }
  .txt.plain { color:#fff; -webkit-text-stroke: 3px #000; paint-order: stroke fill; text-shadow:0 6px 22px rgba(0,0,0,.7); }
  .txt.plain .em { color:var(--accent); }
  .cta-arrow { font-size:.9em; line-height:1; margin-top:.1em; }
  .emoji { position:absolute; translate:-50% -50%; line-height:1; filter: drop-shadow(0 12px 24px rgba(0,0,0,.4)); }
  .plate { position:absolute; left:50%; translate:-50% 0; width:340px; height:340px; border-radius:40px; background:rgba(255,255,255,.92);
    display:flex; align-items:center; justify-content:center; box-shadow:0 24px 70px rgba(0,0,0,.4); }
  .plate img { max-width:240px; max-height:240px; }
  .num { position:absolute; left:50%; translate:-50% 0; text-align:center; color:#fff; font-weight:700; width:max-content; }
  .num-v { display:block; font-size:190px; line-height:1.15; letter-spacing:-.03em; font-variant-numeric: tabular-nums; color:var(--accent);
    -webkit-text-stroke: 4px #000; paint-order: stroke fill; text-shadow:0 10px 30px rgba(0,0,0,.6); }
  .num-label { display:block; font-size:64px; line-height:1.15; margin-top:10px; -webkit-text-stroke: 3px #000; paint-order: stroke fill; }
  .num-label .em { color:var(--accent); }
  .pills { position:absolute; left:70px; display:flex; flex-direction:column; align-items:flex-start; gap:22px; }
  .pill { font-weight:700; font-size:60px; color:#111; background:#fff; padding:.16em .55em .2em; border-radius:999px; opacity:0;
    box-shadow:0 14px 40px rgba(0,0,0,.35); }
  .imgcard { position:absolute; left:50%; translate:-50% 0; border-radius:28px; overflow:hidden; background:#fff;
    box-shadow:0 30px 80px rgba(0,0,0,.5); border:6px solid #fff; }
  .imgcard img { display:block; width:100%; height:auto; transform-origin:50% 50%; }
""".replace("ACCENT", ACCENT).replace("ORIGIN", S.get("origin", "50% 32%"))

HELPERS = """
        const ACCENT = '%s';
        const countUp = function (sel, to, t, dur, prefix, suffix, dec) {
          const el = document.querySelector(sel); const o = { v: 0 };
          const fmt = function (v) { return prefix + v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix; };
          el.textContent = fmt(0);
          tl.fromTo(o, { v: 0 }, { v: to, duration: dur, ease: 'power2.out', immediateRender: false,
            onUpdate: function () { el.textContent = fmt(dec ? o.v : Math.round(o.v)); } }, t);
        };
""" % ACCENT

page = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>%s</style>
</head>
<body>
  <div id="stage" data-composition-id="%s" data-start="0" data-duration="%.3f" data-fps="30" data-width="%d" data-height="%d">
    <div id="video-wrap">
      <div id="video-zoom" data-layout-allow-overflow>
        <video id="bg-video" src="%s" playsinline data-has-audio="true" data-start="0" data-duration="%.3f" data-track-index="1"></video>
      </div>
    </div>
%s%s%s%s
    <script src="%s"></script>
    <script>
      (function () {
        const tl = window.gsap.timeline({ paused: true });
%s
        // camera
        %s
        // beats + captions
        %s
%s
        tl.to({}, { duration: %.3f }, 0);
        window.__timelines = window.__timelines || {};
        window.__timelines["%s"] = tl;
      })();
    </script>
  </div>
</body>
</html>
""" % (CSS, S["id"], D, W, H, S.get("video", "input-video.mp4"), D, "".join(html), "".join(cap_html), S.get("raw_html", ""),
       "".join(audio), GSAP_SRC, HELPERS, "\n        ".join(cam), "\n        ".join(js), S.get("raw_js", ""), D, S["id"])
open(os.path.join(OUT, "index.html"), "w").write(page)
open(os.path.join(OUT, "hyperframes.json"), "w").write(json.dumps({
    "$schema": "https://hyperframes.heygen.com/schema/hyperframes.json",
    "paths": {"blocks": "compositions", "components": "compositions/components", "assets": "assets"},
    "media": {"autoProxy": True}}, indent=2))

beats = S.get("beats", [])
print("wrote %s/index.html: 1080x1920, %.2f s, %d beats, %d caption chunks, %d camera ops, %d sounds"
      % (OUT, D, len(beats), n_chunks, len(S.get("camera", [])), len(audio)))
print("snapshot moments:", " ".join("%.2f" % (float(b["in"]) + 0.5) for b in beats))
seq = sorted((float(b["in"]), b["type"]) for b in beats)
for (t1, a), (t2, b2) in zip(seq, seq[1:]):
    if a == b2 and a not in ("emoji",):
        warns.append("WARN same format twice in a row: %s at %.2f and %.2f" % (a, t1, t2))
hook = [b for b in beats if float(b["in"]) < 0.5]
if not hook:
    warns.append("WARN nothing on screen in the first 0.5 s: a Reel needs a hook on frame one")
for w in warns:
    print(w)
