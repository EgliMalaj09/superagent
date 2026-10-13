#!/bin/bash
# Checks (and where possible installs) everything the library needs. Safe to run again.
#   bash setup.sh            check + install the HyperFrames packages
#   bash setup.sh --remotion also install the Remotion template's packages
cd "$(dirname "$0")"
ok()   { printf "  \033[32m✓\033[0m %s\n" "$1"; }
miss() { printf "  \033[31m✗\033[0m %s  →  %s\n" "$1" "$2"; MISSING=1; }
MISSING=0
echo "Tools"
command -v node >/dev/null && [ "$(node -p 'process.versions.node.split(".")[0]')" -ge 22 ] && ok "node $(node -v)" || miss "node 22+" "brew install node (or nvm install 22)"
command -v ffmpeg >/dev/null && ok "ffmpeg" || miss "ffmpeg 7+" "brew install ffmpeg"
command -v python3 >/dev/null && ok "python3" || miss "python3" "brew install python"
python3 -c "import numpy" 2>/dev/null && ok "numpy" || miss "numpy" "brew install numpy"
command -v auto-editor >/dev/null && ok "auto-editor" || miss "auto-editor (reel-edit only)" "brew install auto-editor"
[ -d "/Applications/Google Chrome.app" ] && ok "Google Chrome" || miss "Google Chrome" "install from google.com/chrome"

echo "Packages"
if [ -d node_modules/hyperframes ]; then ok "hyperframes + gsap (root)"; else npm install --no-audit --no-fund && ok "installed hyperframes + gsap"; fi
if [ "$1" = "--remotion" ]; then
  (cd remotion/template && npm install --no-audit --no-fund) && ok "remotion template packages"
fi

echo "Library"
[ "$(ls library/sfx/*.wav 2>/dev/null | wc -l)" -gt 5 ] && ok "sound kit ($(ls library/sfx/*.wav | wc -l | tr -d ' ') files)" \
  || { python3 .claude/skills/reel-edit/scripts/sfx-synth.py --out library/sfx && ok "sound kit synthesised"; }
[ -f library/vendor/gsap.min.js ] && ok "gsap offline copy" || miss "library/vendor/gsap.min.js" "curl -sL https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js -o library/vendor/gsap.min.js"

echo "Tests"
(cd .claude/skills/reel-edit/scripts && python3 -m unittest tests >/dev/null 2>&1) && ok "reel-edit tests" || miss "reel-edit tests" "cd .claude/skills/reel-edit/scripts && python3 -m unittest tests"

echo "Whisper model: downloads on first transcription (~1.6 GB):"
echo "  npx hyperframes transcribe <5s.wav> --engine whisper --model large-v3-turbo --language sq --json"
[ $MISSING = 0 ] && echo "All set." || echo "Install the ✗ items above, then run this again."
