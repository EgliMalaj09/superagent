#!/usr/bin/env python3
"""Ask Gemini whether several audio clips are the same speaker. Usage: compare.py a.wav b.wav [c.wav ...]"""
import base64, json, os, subprocess, sys, urllib.request

PROJECT = "project-cb3b1428-cbd7-41cd-bb8"
token = subprocess.check_output([os.path.expanduser("~/google-cloud-sdk/bin/gcloud"), "auth",
                                 "application-default", "print-access-token"], text=True).strip()
parts = []
for i, f in enumerate(sys.argv[1:]):
    parts.append({"text": f"Clip {i + 1} ({os.path.basename(f)}):"})
    parts.append({"inlineData": {"mimeType": "audio/wav", "data": base64.b64encode(open(f, "rb").read()).decode()}})
parts.append({"text": "These clips should all be the same actor's voice. Compare timbre, pitch, age, accent. Reply ONLY JSON: "
                      '{"same_speaker_score_vs_clip1": {"<clip name>": <0-10>, ...}, "notes": "<short>"}'})
body = {"contents": [{"role": "user", "parts": parts}],
        "generationConfig": {"responseMimeType": "application/json", "temperature": 0}}
url = (f"https://aiplatform.googleapis.com/v1/projects/{PROJECT}/locations/global/publishers/google/models/"
       "gemini-2.5-pro:generateContent")
req = urllib.request.Request(url, json.dumps(body).encode(), {"Authorization": f"Bearer {token}",
                             "X-Goog-User-Project": PROJECT, "Content-Type": "application/json"})
print(json.load(urllib.request.urlopen(req, timeout=300))["candidates"][0]["content"]["parts"][0]["text"])
