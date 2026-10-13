# Platforms and delivery

## Sizes

| Where | Size | Notes |
|---|---|---|
| Instagram Reels, TikTok, YouTube Shorts, Facebook Reels | 1080×1920 (9:16) | the default here |
| Instagram / LinkedIn / Facebook feed | 1080×1350 (4:5) | the user's LinkedIn default |
| Square | 1080×1080 (1:1) | carousels, X |
| YouTube / web | 1920×1080 (16:9) | |

All at 30 fps, H.264, yuv420p, BT.709 tags, AAC 48 kHz.

## Safe zones on 9:16 (Instagram; TikTok is similar)

Instagram covers the top ~220 px, the bottom ~440 px (caption, username, audio) and a ~140 px strip on the right from
y 880 to 1480 (like, comment, share). Keep everything important inside **x 60..940, y 230..1460**. Captions sit around
y 1180. TikTok's right-hand button column is a bit wider and its bottom caption area a bit taller, so keep critical text
away from the bottom-right corner on both. `reel-edit/scripts/snap-beats.py` paints the zones red on a contact sheet.

## Length

Hook in the first 1.5 s, first spoken word in the first 0.3 s. 15–45 s is the sweet spot for talking Reels; 60–90 s
works for documentaries and explainers when every 2–3 s something changes. Instagram Reels and YouTube Shorts accept up
to 3 minutes (check the current limits before planning anything longer).

## Loudness and encoding (`templates/finish.sh`)

- −14 LUFS integrated, true peak −1.5 dBTP (`loudnorm=I=-14:TP=-1.5:LRA=11`).
- CBR ~12 Mb/s (`-b:v 12M -minrate 12M -maxrate 12M -bufsize 6M -x264-params nal-hrd=cbr`): flat graphics otherwise
  encode so small that Instagram re-compresses them badly.
- `-color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv -movflags +write_colr+faststart`.
- It writes `<name>-cover.png` at the cover second and reports size, bitrate, LUFS and black gaps.

```bash
bash templates/finish.sh projects/<p>/out-raw.mp4 results/<p>.mp4 1.2
bash templates/join.sh results/full.mp4 part1.mp4 part2.mp4     # XF=0.4 crossfades, then finish.sh
```

Remotion renders: `npm run build` → `finish.sh out/video.mp4 ../../results/<p>.mp4`. `build:small` (CRF 23) is only
for quick sharing; finish.sh output is the upload file.

## Upload

- Upload the file as-is (no in-app trimming, which re-encodes twice). Turn on "Upload at highest quality".
- Music: either baked in (licence-free, ducked under the voice) or added inside the app (trending audio, licensed).
  Never bake in a commercial song.
- Deliver with a ready caption: hook line, 1–3 short lines, a CTA, 3–5 hashtags, and the suggested cover time.
- Political content: keep the sources list ready (pinned comment or caption), since questions will come.
