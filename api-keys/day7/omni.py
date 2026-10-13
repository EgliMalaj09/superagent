#!/usr/bin/env python3
"""Generate a video with Gemini Omni Flash (Interactions API) using ADC.

Usage:
  python3 omni.py PROMPT_FILE OUT.mp4 [--image first_frame.png] [--ref img ...]
                  [--aspect 9:16] [--duration 8s] [--resolution 720p] [--task TASK]
"""
import argparse, base64, json, mimetypes, os, subprocess, sys, time, urllib.request, urllib.error

PROJECT = "project-cb3b1428-cbd7-41cd-bb8"
GCLOUD = os.path.expanduser("~/google-cloud-sdk/bin/gcloud")
MODEL = "gemini-omni-1.1-flash-preview"

p = argparse.ArgumentParser()
p.add_argument("prompt_file")
p.add_argument("out")
p.add_argument("--image", default=None, help="first frame")
p.add_argument("--ref", nargs="*", default=[])
p.add_argument("--aspect", default="9:16")
p.add_argument("--duration", default="8s")
p.add_argument("--resolution", default="720p")
p.add_argument("--task", default=None)
a = p.parse_args()


def img(path):
    mime = mimetypes.guess_type(path)[0] or "image/png"
    return {"type": "image", "data": base64.b64encode(open(path, "rb").read()).decode(), "mime_type": mime}


inp = []
if a.image:
    inp.append(img(a.image))
inp += [img(r) for r in a.ref]
inp.append({"type": "text", "text": open(a.prompt_file).read()})
body = {"model": MODEL, "input": inp,
        "response_format": [{"type": "video", "aspect_ratio": a.aspect, "duration": a.duration, "resolution": a.resolution}]}
if a.task:
    body["generation_config"] = {"video_config": {"task": a.task}}

token = subprocess.check_output([GCLOUD, "auth", "application-default", "print-access-token"], text=True).strip()
url = f"https://aiplatform.googleapis.com/v1beta1/projects/{PROJECT}/locations/global/interactions"
req = urllib.request.Request(url, json.dumps(body).encode(), {
    "Authorization": f"Bearer {token}", "X-Goog-User-Project": PROJECT, "Content-Type": "application/json"})
for attempt in range(6):
    try:
        resp = json.load(urllib.request.urlopen(req, timeout=900))
        break
    except urllib.error.HTTPError as e:
        if e.code == 429 and attempt < 5:
            time.sleep(30 * (attempt + 1)); continue
        sys.exit(f"HTTP {e.code}: {e.read().decode()[:2000]}")

for step in resp.get("outputs", resp.get("steps", [])):
    for c in step.get("content", []) if isinstance(step, dict) else []:
        if c.get("type") == "video" and c.get("data"):
            open(a.out, "wb").write(base64.b64decode(c["data"]))
            print("saved", a.out); sys.exit(0)
# fallback: search anywhere for video data
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
data = find(resp)
if data:
    open(a.out, "wb").write(base64.b64decode(data)); print("saved", a.out)
else:
    sys.exit("No video returned: " + json.dumps(resp)[:2000])
