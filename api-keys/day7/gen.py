#!/usr/bin/env python3
"""Generate an image with Gemini image models on Vertex AI using ADC.

Usage:
  python3 gen.py PROMPT_FILE OUT.png [--model M] [--aspect 16:9] [--ref img.jpg ...]
"""
import argparse, base64, json, mimetypes, os, subprocess, sys, urllib.request, urllib.error

PROJECT = "project-cb3b1428-cbd7-41cd-bb8"
GCLOUD = os.path.expanduser("~/google-cloud-sdk/bin/gcloud")

p = argparse.ArgumentParser()
p.add_argument("prompt_file")
p.add_argument("out")
p.add_argument("--model", default="gemini-3-pro-image")
p.add_argument("--aspect", default="16:9")
p.add_argument("--ref", nargs="*", default=[])
a = p.parse_args()

token = subprocess.check_output([GCLOUD, "auth", "application-default", "print-access-token"], text=True).strip()
parts = []
for r in a.ref:
    mime = mimetypes.guess_type(r)[0] or "image/jpeg"
    parts.append({"inlineData": {"mimeType": mime, "data": base64.b64encode(open(r, "rb").read()).decode()}})
parts.append({"text": open(a.prompt_file).read()})

body = {
    "contents": [{"role": "user", "parts": parts}],
    "generationConfig": {"responseModalities": ["TEXT", "IMAGE"], "imageConfig": {"aspectRatio": a.aspect}},
}
url = f"https://aiplatform.googleapis.com/v1/projects/{PROJECT}/locations/global/publishers/google/models/{a.model}:generateContent"
req = urllib.request.Request(url, json.dumps(body).encode(), {
    "Authorization": f"Bearer {token}", "X-Goog-User-Project": PROJECT, "Content-Type": "application/json"})
import time
for attempt in range(6):
    try:
        resp = json.load(urllib.request.urlopen(req, timeout=300))
        break
    except urllib.error.HTTPError as e:
        if e.code == 429 and attempt < 5:
            wait = 20 * (attempt + 1)
            print(f"rate limited, retrying in {wait}s", file=sys.stderr)
            time.sleep(wait)
            continue
        sys.exit(f"HTTP {e.code}: {e.read().decode()[:2000]}")

saved = 0
seen = set()
for cand in resp.get("candidates", []):
    for part in cand.get("content", {}).get("parts", []):
        if "inlineData" in part:
            if part["inlineData"]["data"] in seen:
                continue
            seen.add(part["inlineData"]["data"])
            out = a.out if saved == 0 else a.out.replace(".png", f"_{saved}.png")
            open(out, "wb").write(base64.b64decode(part["inlineData"]["data"]))
            print("saved", out)
            saved += 1
        elif "text" in part:
            print("model:", part["text"][:500])
if not saved:
    sys.exit("No image returned: " + json.dumps(resp)[:2000])
