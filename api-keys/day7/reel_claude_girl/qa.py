#!/usr/bin/env python3
"""Transcribe a shot's audio with Gemini and compare it to the scripted Albanian line.
Usage: python3 qa.py 01 [02 ...]"""
import base64, json, os, subprocess, sys, tempfile, urllib.request
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from shots import SHOTS, HERE

PROJECT = "project-cb3b1428-cbd7-41cd-bb8"
tok = subprocess.check_output([os.path.expanduser("~/google-cloud-sdk/bin/gcloud"), "auth", "application-default", "print-access-token"], text=True).strip()
for n in sys.argv[1:]:
    mp4 = os.path.join(HERE, f"clips/shot_{n}.mp4")
    mp3 = tempfile.mktemp(suffix=".mp3")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", mp4, "-vn", "-ac", "1", "-ar", "16000", mp3], check=True)
    dl = SHOTS[n].get("dialogue") or [dict(who=SHOTS[n]["who"], line=SHOTS[n]["line"])]
    q = ("The intended Albanian dialogue, in order, is: " + " | ".join(f"{d['who']} ({'young woman' if d['who']=='ANA' else 'gentle polite AI voice'}): {d['line']}" for d in dl) + "\n"
         "Transcribe exactly what is heard. Then answer in one line each: MATCH (all words present and understandable? yes/no + what's wrong), "
         "VOICE (gender/age), EMOTION, EXTRA (any extra speech, wrong language, music). Be very brief.")
    body = {"contents": [{"role": "user", "parts": [{"inlineData": {"mimeType": "audio/mp3", "data": base64.b64encode(open(mp3, 'rb').read()).decode()}}, {"text": q}]}]}
    req = urllib.request.Request(f"https://aiplatform.googleapis.com/v1/projects/{PROJECT}/locations/global/publishers/google/models/gemini-3.5-flash:generateContent",
                                 json.dumps(body).encode(), {"Authorization": "Bearer " + tok, "X-Goog-User-Project": PROJECT, "Content-Type": "application/json"})
    print(f"=== shot {n}\n" + json.load(urllib.request.urlopen(req, timeout=300))["candidates"][0]["content"]["parts"][0]["text"].strip())
