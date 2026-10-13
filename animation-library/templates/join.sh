#!/bin/bash
# Join parts with soft 0.4 s crossfades (video xfade + audio acrossfade). Usage: bash templates/join.sh out.mp4 part1.mp4 part2.mp4 [...]
# Then run finish.sh on the result. Parts must share size and fps.
set -e
OUT="$1"; shift; X=${XF:-0.4}
ARGS=(); for f in "$@"; do ARGS+=(-i "$f"); done
N=$#; [ $N -lt 2 ] && { cp "$1" "$OUT"; exit 0; }
FC=""; OFF=0; PV="0:v"; PA="0:a"
for ((i=1;i<N;i++)); do
  PREV=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "${@:$i:1}")
  OFF=$(echo "$OFF + $PREV - $X" | bc -l)
  FC+="[$PV][$i:v]xfade=transition=fade:duration=$X:offset=$OFF[v$i];[$PA][$i:a]acrossfade=d=$X[a$i];"
  PV="v$i"; PA="a$i"
done
ffmpeg -y -v error "${ARGS[@]}" -filter_complex "${FC%;}" -map "[$PV]" -map "[$PA]" -c:v libx264 -crf 14 -preset medium -pix_fmt yuv420p -c:a aac -b:a 256k "$OUT"
echo "joined $N parts -> $OUT"
