#!/usr/bin/env python3
"""Start a new episode:  python3 tools/new_episode.py ep02-claude-on-vacation
Creates episodes/<name>/ with SCRIPT.md, CONFIRMED.md, cues.py (sound) and an empty scenes/ folder."""
import os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
name = sys.argv[1]; d = os.path.join(ROOT, 'episodes', name)
os.makedirs(os.path.join(d, 'scenes'), exist_ok=True); os.makedirs(os.path.join(d, 'assets'), exist_ok=True)
open(os.path.join(d, 'SCRIPT.md'), 'w').write(f"""# {name} — script (show the user, wait for approval)
Format 9:16 · English on screen · comic style · music bed + real hits only (no ambience beds)

| # | Time | Clock chip | What we see | Text / dialogue |
|---|---|---|---|---|
| 1 | | | | |
""")
open(os.path.join(d, 'CONFIRMED.md'), 'w').write(f"# {name} — confirmed decisions\nOnly what the user confirmed goes here (no trials, no unchosen options).\n")
open(os.path.join(d, 'cues.py'), 'w').write('''#!/usr/bin/env python3
"""Sound for this episode. Run after the scenes are rendered:  python3 episodes/<name>/cues.py"""
import os, sys, glob
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, '..', '..', 'library', 'sound'))
from kit import *
PARTS = sorted(glob.glob(os.path.join(HERE, 'scenes', 's*', 'out.mp4')))
SCENE = scene_starts(PARTS)
DUR = SCENE[-1] + float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', PARTS[-1]]))
CUES = [
    # (scene number, local time in that scene, sound, gain)
    # (1, 0.10, alarm(1.2), .55),
]
render(CUES, SCENE, DUR, os.path.join(HERE, 'sound.wav'), bed_gain=.30, bed_shape=None)
''')
print('created', os.path.relpath(d, ROOT), '→ write SCRIPT.md, get approval, then: python3 tools/new_scene.py', name, '1 --duration 6')
