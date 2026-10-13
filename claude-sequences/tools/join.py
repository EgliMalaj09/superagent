#!/usr/bin/env python3
"""Join an episode's rendered scenes (0.35 s crossfades), add its sound.wav if present, finish for Instagram.
    python3 tools/join.py <episode> [--cover 10]   →  episodes/<episode>/final/<episode>.mp4 + cover PNG"""
import argparse, glob, os, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('episode'); ap.add_argument('--cover', default='1.0'); ap.add_argument('--xf', type=float, default=0.35)
a = ap.parse_args(); E = os.path.join(ROOT, 'episodes', a.episode)
parts = sorted(glob.glob(os.path.join(E, 'scenes', 's*', 'out.mp4')))
dur = [float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p])) for p in parts]
raw = os.path.join(E, 'out-raw.mp4'); fc = ''; off = 0; pv = '0:v'
for i in range(1, len(parts)):
    off += dur[i - 1] - a.xf; fc += f'[{pv}][{i}:v]xfade=transition=fade:duration={a.xf}:offset={off:.3f}[v{i}];'; pv = f'v{i}'
args = ['ffmpeg', '-y', '-v', 'error'] + sum([['-i', p] for p in parts], [])
args += (['-filter_complex', fc.rstrip(';'), '-map', f'[{pv}]'] if len(parts) > 1 else ['-map', '0:v']) + ['-c:v', 'libx264', '-crf', '14', '-preset', 'medium', '-pix_fmt', 'yuv420p', raw]
subprocess.run(args, check=True)
snd = os.path.join(E, 'sound.wav'); src = raw
if os.path.exists(snd):
    src = os.path.join(E, 'out-raw-sound.mp4')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', raw, '-i', snd, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', src], check=True)
os.makedirs(os.path.join(E, 'final'), exist_ok=True)
subprocess.run(['bash', os.path.join(ROOT, 'tools', 'finish.sh'), src, os.path.join(E, 'final', a.episode + '.mp4'), a.cover], check=True)
print('total', round(sum(dur) - a.xf * (len(parts) - 1), 2), 's,', len(parts), 'scenes, sound:', os.path.exists(snd))
