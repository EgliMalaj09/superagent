#!/usr/bin/env python3
"""Omni video-to-video outfit swap for the VIVAMUS reel.
Usage: RES=720p python3 edit_viv.py src/A.mp4 shots/A.txt out/A.mp4"""
import base64, json, os, subprocess, sys, time, urllib.request, urllib.error

P = "project-cb3b1428-cbd7-41cd-bb8"
RES = os.environ.get("RES", "720p")
src, shotfile, out = sys.argv[1:4]
shots = open(shotfile).read().strip()
tok = subprocess.check_output([os.path.expanduser("~/google-cloud-sdk/bin/gcloud"), "auth", "application-default", "print-access-token"], text=True).strip()
b64 = lambda f: base64.b64encode(open(f, "rb").read()).decode()

prompt = f"""VIDEO-TO-VIDEO EDIT, NOT A NEW VIDEO. Input 1 is the source video: two women side by side in a studio with dark blinds and a white floor. Reproduce it frame by frame: identical shots, cut timings, camera position, framing and camera movement; identical poses, gestures, turns, hair flips, walking and timing of every movement; same two women: both have long DARK BROWN / brunette hair, NEVER blonde (same faces, hair, sunglasses, jewellery, bags, shoes, body shape), same background and lighting. The source is a strict motion and composition guide.

THE ONLY CHANGE IS THE CLOTHING:
- The woman on the LEFT (originally in the cream suit) wears the WHITE VIVAMUS set (images 2-3): an oversized off-white fleece crewneck sweatshirt with a small V logo (fine black and red lines) on the left chest, and matching off-white baggy fleece joggers with a drawstring, a small V logo on the left thigh and elastic gathered ankle cuffs.
- The woman on the RIGHT (originally in the pink suit) wears the BLACK VIVAMUS set (images 4-5): the same oversized black crewneck sweatshirt with a small white-and-red V logo on the left chest, and matching black baggy joggers with a small V logo on the left thigh and elastic ankle cuffs.
- BACK of both sweatshirts: a large print of a flowing V made of fine wavy lines (white/black lines with one red line), the word VIVAMUS below it, then LET'S LIVE in small letters and a short red line, exactly as in images 3 and 5. Whenever a woman turns her back, this back print must be visible; the back of the sweatshirt is closed (no cut-out, no open back).
- FIT ONLY, from images 6-7 (these show the clothing fit on a different body; take NOTHING else from them, not hair colour, not cap, not skin, not shoes): sweatshirt boxy and slightly cropped with dropped shoulders and wide sleeves, ending at a high elastic waistband; joggers very wide and baggy, gathered at the ankles over the shoes.
- Wherever the source shows the women holding clothes up or putting clothes on, they hold / put on these same VIVAMUS pieces instead (joggers instead of the wide trousers, sweatshirt instead of the blazer). Anything not covered by the outfit (bra, skin, hair) stays exactly as in the source.

SHOT LIST of the source (FRAMING AND MOTION ARE THE PRIORITY: when a woman is close to the camera and large in frame in the source, she must be equally close and large in the output; same distances, same sizes in frame; reproduce each shot's camera move and both women's body movements exactly, same speed, direction, start and end positions and timing):
{shots}

No text overlays, no extra people, no logos other than the VIVAMUS ones."""

refs = ["refs/white_front.jpg", "refs/white_back.jpg", "refs/black_front.jpg", "refs/black_back.jpg", "refs/worn_front_body.jpg", "refs/worn_back_body.jpg"]
inp = [{"type": "video", "data": b64(src), "mime_type": "video/mp4"}]
inp += [{"type": "image", "data": b64(r), "mime_type": "image/jpeg"} for r in refs]
inp.append({"type": "text", "text": prompt})
body = {"model": "gemini-omni-1.1-flash-preview", "input": inp,
        "response_format": [{"type": "video", "aspect_ratio": "9:16", "resolution": RES}]}
req = urllib.request.Request(f"https://aiplatform.googleapis.com/v1beta1/projects/{P}/locations/global/interactions",
                             json.dumps(body).encode(), {"Authorization": "Bearer " + tok, "X-Goog-User-Project": P, "Content-Type": "application/json"})
for a in range(5):
    try:
        r = json.load(urllib.request.urlopen(req, timeout=900)); break
    except urllib.error.HTTPError as e:
        if e.code == 429: time.sleep(30 * (a + 1)); continue
        sys.exit(f"HTTP {e.code}: {e.read().decode()[:1500]}")

def find(x):
    if isinstance(x, dict):
        if x.get("type") == "video" and x.get("data"): return x["data"]
        for v in x.values():
            r = find(v)
            if r: return r
    if isinstance(x, list):
        for v in x:
            r = find(v)
            if r: return r
d = find(r)
if not d: sys.exit("no video: " + json.dumps(r)[:1500])
open(out, "wb").write(base64.b64decode(d)); print("saved", out)
