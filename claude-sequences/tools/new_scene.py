#!/usr/bin/env python3
"""Add a scene to an episode:  python3 tools/new_scene.py <episode> <number> [--duration 6]
Creates episodes/<episode>/scenes/sNN/ (project.json, scene.html, scene.js) wired to the comic kit, with a working
starter: a room, Claude walking in, a caption and a sound word. Then: bash tools/build.sh <episode> <number>"""
import argparse, json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('episode'); ap.add_argument('number', type=int); ap.add_argument('--duration', type=float, default=6.0)
a = ap.parse_args(); D = a.duration
d = os.path.join(ROOT, 'episodes', a.episode, 'scenes', 's%02d' % a.number); os.makedirs(d, exist_ok=True)
json.dump({"name": "%s-s%02d" % (a.episode, a.number), "format": "9x16", "style": "comic", "engines": ["comic"], "lang": "en",
           "duration": D, "audio": {"voice": [], "bed": None, "sfx": []}}, open(os.path.join(d, 'project.json'), 'w'), indent=2)
open(os.path.join(d, 'scene.html'), 'w').write(f'''<div class="L clip" id="stage" data-start="0" data-duration="{D}" data-track-index="1">
<svg id="svg" viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <defs></defs>
  <g id="world"></g>
</svg>
<div class="L clip" id="hud" data-start="0" data-duration="{D}" data-track-index="3"></div>
</div>
''')
open(os.path.join(d, 'scene.js'), 'w').write(f'''// SCENE {a.number} · 0–{D} s · <what happens>. Comic kit: see library/engines/comic.js and STYLE.md.
comicDefs();
// ---------- set: wall, floor (replace with the real location) ----------
mk('rect', {{ x: 0, y: 0, width: 1080, height: 1320, fill: '#DCDDF6' }}, '#world');
mk('rect', {{ x: 0, y: 0, width: 1080, height: 1320, fill: 'url(#dotsS)' }}, '#world');
mk('rect', A({{ x: 0, y: 1320, width: 1080, height: 600, fill: '#E9A65F' }}), '#world');
// ---------- cast ----------
claude('#world', 'c');
tl.set('#c', {{ x: -220, y: 1560 }}, 0);
walk('c', 0.2, 1.2, {{ x: 540 }});
blink('c', 2.0);
// ---------- comic type ----------
caption('7:00 AM · new episode', 0.15);
boom('HELLO!', 1.5, 2.6);
comicFinish('#world');
''')
print('created', os.path.relpath(d, ROOT))
