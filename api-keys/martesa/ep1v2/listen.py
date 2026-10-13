#!/usr/bin/env python3
"""QA: ask Gemini to listen to an audio/video file and report transcript + language.

Usage: python3 listen.py FILE [--expect "expected line"] [--model M]
"""
import argparse, base64, json, mimetypes, os, subprocess, sys, time, urllib.request, urllib.error

PROJECT = "project-cb3b1428-cbd7-41cd-bb8"
GCLOUD = os.path.expanduser("~/google-cloud-sdk/bin/gcloud")

p = argparse.ArgumentParser()
p.add_argument("file")
p.add_argument("--expect", default="")
p.add_argument("--model", default="gemini-2.5-pro")
a = p.parse_args()

mime = mimetypes.guess_type(a.file)[0] or "audio/wav"
q = ("Listen carefully to this clip. Reply ONLY with compact JSON: "
     '{"transcript": "<verbatim speech>", "language": "<language(s) spoken>", '
     '"all_albanian": true/false, "music": true/false, "background_noise": "<describe non-speech sounds>", '
     '"matches_expected": true/false}. ')
if a.expect:
    q += f'Expected line (Albanian): "{a.expect}". matches_expected = the speech says essentially this.'
body = {"contents": [{"role": "user", "parts": [
    {"inlineData": {"mimeType": mime, "data": base64.b64encode(open(a.file, "rb").read()).decode()}},
    {"text": q}]}],
    "generationConfig": {"responseMimeType": "application/json", "temperature": 0}}
token = subprocess.check_output([GCLOUD, "auth", "application-default", "print-access-token"], text=True).strip()
url = f"https://aiplatform.googleapis.com/v1/projects/{PROJECT}/locations/global/publishers/google/models/{a.model}:generateContent"
req = urllib.request.Request(url, json.dumps(body).encode(), {
    "Authorization": f"Bearer {token}", "X-Goog-User-Project": PROJECT, "Content-Type": "application/json"})
for attempt in range(5):
    try:
        resp = json.load(urllib.request.urlopen(req, timeout=300)); break
    except urllib.error.HTTPError as e:
        if e.code == 429 and attempt < 4:
            time.sleep(15 * (attempt + 1)); continue
        sys.exit(f"HTTP {e.code}: {e.read().decode()[:1000]}")
print(resp["candidates"][0]["content"]["parts"][0]["text"].strip())
