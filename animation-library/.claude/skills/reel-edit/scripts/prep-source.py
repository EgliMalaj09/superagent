#!/usr/bin/env python3
"""prep-source.py: make any phone or camera clip a clean Reel source before the cut.

Phones hand over HDR (iPhone HLG / Dolby Vision), 60 fps or variable frame rate, rotation flags and sometimes a
landscape frame. Every later step wants 1080x1920, 30 fps CFR, SDR BT.709, so this runs first, once per raw clip.

  HDR (HLG / PQ)  -> SDR BT.709 through VideoToolbox (scale_vt, macOS, free) or zscale+tonemap when ffmpeg has it
  rotation        -> applied (ffmpeg autorotates), tag removed
  any fps / VFR   -> 30 fps CFR
  9:16 already    -> scaled to 1080x1920
  landscape / 4:5 -> centre crop to 9:16 (--x 0.5 = centre; 0.35 = keep the left-of-centre subject); --fit pads instead
  audio           -> AAC 48 kHz stereo, plus a 16 kHz mono WAV for transcription (--wav)

Usage:
  python3 prep-source.py --in raw/IMG_1234.MOV --out raw/IMG_1234-prep.mp4 [--wav audio-raw.wav] [--x 0.5] [--fit]
"""
import argparse, json, subprocess, sys

ap = argparse.ArgumentParser()
ap.add_argument("--in", dest="src", required=True)
ap.add_argument("--out", required=True)
ap.add_argument("--wav")
ap.add_argument("--x", type=float, default=0.5, help="horizontal crop centre for a wider-than-9:16 source (0..1)")
ap.add_argument("--fit", action="store_true", help="pad (blurred background) instead of cropping a landscape source")
ap.add_argument("--crf", type=int, default=14)
a = ap.parse_args()

p = json.loads(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
    "stream=width,height,r_frame_rate,avg_frame_rate,color_transfer,color_primaries:stream_side_data=rotation",
    "-of", "json", a.src], capture_output=True, text=True, check=True).stdout)["streams"][0]
w, h = int(p["width"]), int(p["height"])
rot = 0
for sd in p.get("side_data_list", []) or []:
    if "rotation" in sd:
        rot = int(sd["rotation"])
if abs(rot) % 180 == 90:
    w, h = h, w
trc = p.get("color_transfer", "")
hdr = trc in ("arib-std-b67", "smpte2084")
print("source %dx%d (rotation %d), %s fps, transfer %s%s" % (w, h, rot, p.get("avg_frame_rate"), trc or "unknown", "  -> HDR, tone-mapping to SDR" if hdr else ""))

filters = subprocess.run(["ffmpeg", "-hide_banner", "-filters"], capture_output=True, text=True).stdout
pre, hw = [], []
if hdr:
    if " zscale " in filters:
        pre = ["zscale=t=linear:npl=203", "format=gbrpf32le", "zscale=p=bt709", "tonemap=hable:desat=0",
               "zscale=t=bt709:m=bt709:r=tv", "format=yuv420p"]
    elif " scale_vt " in filters:
        hw = ["-hwaccel", "videotoolbox", "-hwaccel_output_format", "videotoolbox_vld"]
        pre = ["scale_vt=color_matrix=bt709:color_primaries=bt709:color_transfer=bt709", "hwdownload", "format=nv12"]
    else:
        sys.exit("HDR source and this ffmpeg has neither zscale nor scale_vt: brew install ffmpeg-full, or set the "
                 "phone to record SDR (iPhone: Settings > Camera > Formats > HDR Video off)")

TW, TH = 1080, 1920
TAG = "setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709:range=tv"   # ffmpeg 9: frame tags beat output flags
if abs(w / h - TW / TH) < 0.01:
    geo = ["scale=%d:%d:flags=lanczos" % (TW, TH)]
elif a.fit:
    geo = ["split[m][b]", "[b]scale=%d:%d:force_original_aspect_ratio=increase,crop=%d:%d,boxblur=40:2[bg]" % (TW, TH, TW, TH),
           "[m]scale=%d:-2:flags=lanczos[fg]" % TW, "[bg][fg]overlay=(W-w)/2:(H-h)/2"]
else:
    geo = ["scale=-2:%d:flags=lanczos" % TH if w / h > TW / TH else "scale=%d:-2:flags=lanczos" % TW,
           "crop=%d:%d:'max(0,min(iw-%d,iw*%.3f-%d))':'(ih-%d)/2'" % (TW, TH, TW, a.x, TW // 2, TH)]
if a.fit and abs(w / h - TW / TH) >= 0.01:
    chain = (",".join(pre) + "," if pre else "") + ";".join(geo) + ",fps=30,format=yuv420p,setsar=1," + TAG
    vf_args = ["-filter_complex", "[0:v]" + chain + "[v]", "-map", "[v]", "-map", "0:a:0?"]
else:
    chain = ",".join(pre + geo + ["fps=30", "format=yuv420p", "setsar=1", TAG])
    vf_args = ["-vf", chain, "-map", "0:v:0", "-map", "0:a:0?"]

cmd = (["ffmpeg", "-y", "-v", "error"] + hw + ["-i", a.src] + vf_args +
       ["-c:v", "libx264", "-preset", "medium", "-crf", str(a.crf), "-g", "30", "-keyint_min", "30",
        "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", "-color_range", "tv",
        "-metadata:s:v:0", "rotate=0", "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-ac", "2",
        "-movflags", "+faststart", a.out])
r = subprocess.run(cmd)
if r.returncode:
    sys.exit("ffmpeg failed (%d)" % r.returncode)
if a.wav:
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", a.out, "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", a.wav], check=True)
o = json.loads(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
    "stream=width,height,r_frame_rate,color_transfer:format=duration", "-of", "json", a.out], capture_output=True, text=True, check=True).stdout)
s = o["streams"][0]
print("wrote %s: %sx%s, %s fps, %s, %.2f s" % (a.out, s["width"], s["height"], s["r_frame_rate"], s.get("color_transfer"), float(o["format"]["duration"])))
