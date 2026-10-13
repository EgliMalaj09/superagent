#!/bin/bash
# Build + check + snapshot one scene:   bash tools/build.sh <episode> <number> [snapshot times e.g. 0.5,2,4]
# Render it:                            bash tools/build.sh <episode> <number> render
set -e
cd "$(dirname "$0")/.."
S=episodes/$1/scenes/s$(printf %02d $2)
python3 library/engines/build_page.py "$S"
if [ "$3" = "render" ]; then
  NODE_OPTIONS=--max-old-space-size=8192 npx hyperframes render "$S/public" -o "$S/out.mp4" 2>&1 | tail -1
else
  npx hyperframes check "$S/public" 2>&1 | grep -E "✗|Check" | head -8 || true
  rm -rf "$S/public/snapshots"; npx hyperframes snapshot "$S/public" --at "${3:-0.5,2,4}" 2>&1 | grep -E "saved|sheet"
  echo "read: $S/public/snapshots/contact-sheet.jpg"
fi
