#!/bin/zsh
# join.sh OUT.mp4 clip1.mp4 clip2.mp4 ...  -> 1080x1920 24fps H.264 + AAC 48k
out=$1; shift; n=$#; i=0; inputs=(); fc=""; chain=""
for f in "$@"; do inputs+=(-i $f); fc+="[${i}:v]scale=1080:1920,setsar=1,fps=24,setpts=PTS-STARTPTS[v${i}];[${i}:a]aresample=48000,aformat=channel_layouts=stereo,asetpts=PTS-STARTPTS[a${i}];"; chain+="[v${i}][a${i}]"; i=$((i+1)); done
ffmpeg -y -loglevel error "${inputs[@]}" -filter_complex "${fc}${chain}concat=n=$n:v=1:a=1[v][a]" -map "[v]" -map "[a]" \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k $out && ffprobe -v error -show_entries format=duration -of csv=p=0 $out
