#!/bin/bash
# Make a HyperFrames render Instagram/LinkedIn-ready: loudness -14 LUFS, BT.709 colour tags, CBR ~12 Mb/s (IG keeps quality), faststart,
# plus a cover PNG. Usage: bash templates/finish.sh projects/<name>/out-raw.mp4 results/<name>.mp4 [cover_second]
set -e
IN="$1"; OUT="$2"; COVER_T="${3:-1.0}"
[ -z "$IN" ] || [ -z "$OUT" ] && { echo "usage: finish.sh in.mp4 out.mp4 [cover_second]"; exit 1; }
mkdir -p "$(dirname "$OUT")"
HAS_A=$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$IN" | head -1)
if [ -n "$HAS_A" ]; then AUD=(-af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 256k -ar 48000); else AUD=(-an); fi
ffmpeg -y -v error -i "$IN" -c:v libx264 -preset slow -b:v 12M -minrate 12M -maxrate 12M -bufsize 6M -x264-params nal-hrd=cbr \
  -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv "${AUD[@]}" -movflags +write_colr+faststart "$OUT"
ffmpeg -y -v error -ss "$COVER_T" -i "$OUT" -frames:v 1 "${OUT%.mp4}-cover.png"
# report
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"); BR=$(ffprobe -v error -show_entries format=bit_rate -of csv=p=0 "$OUT")
SZ=$(ffprobe -v error -select_streams v -show_entries stream=width,height -of csv=s=x:p=0 "$OUT")
LUFS=$( [ -n "$HAS_A" ] && ffmpeg -nostats -i "$OUT" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}' || echo "-")
BLACK=$(ffmpeg -nostats -i "$OUT" -vf blackdetect=d=0.08:pix_th=0.06 -an -f null - 2>&1 | grep -c black_start || true)
printf "done %s  %s  %.2fs  %.1f Mb/s  %s LUFS  black-gaps:%s\n" "$OUT" "$SZ" "$D" "$(echo "$BR/1000000" | bc -l)" "$LUFS" "$BLACK"
