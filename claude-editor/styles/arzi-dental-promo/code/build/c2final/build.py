import subprocess, glob, os
H=os.path.expanduser("~")
D=10; h=D//2  # dissolve frames, handle each side
G="curves=master='0/0 0.25/0.21 0.6/0.56 0.85/0.78 1/0.9',eq=saturation=1.1:contrast=1.04,colorbalance=rm=0.03:bm=-0.03:rh=0.02:bh=-0.02"
REAL="crop=1080:1920:0:(ih-1920)/2,"+G
AI="scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920"
PLAN=H+"/Downloads/creative2-plan.mp4"
g=lambda p: glob.glob(H+p)[0]
# (start, end, src, src_start_sec, filter, push_in)
S=[(0,132,PLAN,0,None,False),
   (132,332,H+"/Desktop/scene-2a-6.7s.mp4",0,AI,True),
   (332,456,H+"/Desktop/scene-2b-4.1s.mp4",0,AI,True),
   (456,582,H+"/Downloads/DSCF9629.mp4",14,REAL,True),
   (582,701,g("/Downloads/Woman_reviewing_dental_scan_1080p_*.mp4"),1.0,AI,True),
   (701,810,g("/Downloads/Dentist_consulting_patient_in_cl*20261004203332.mp4"),2.2,AI,True),
   (810,902,"build/c2final/ref4b.mp4",5/30,None,True),
   (902,1050,H+"/Downloads/pamje nga procesi.MP4",12,REAL,True),
   (1050,1235,"build/c2final/ref5b.mp4",5/30,None,True),
   (1235,1334,g("/Downloads/Woman_reviewing_treatment_plan_w*20261004204325.mp4"),0,AI,True),
   (1334,1428,g("/Downloads/Woman_smiling_at_dental_consulta*20261004205024.mp4"),1.8,AI,True),
   (1428,1536,H+"/Downloads/hf_20261004_190627_a798c21c-01a0-40a8-8d5e-d240968039d5.mp4",0.5,AI,True),
   (1536,1635,"build/c2final/black.mp4",0,None,False)]
args=["tools/ffmpeg","-v","error","-y"]; fc=[]; n=len(S)
for i,(a,b,src,ss,flt,push) in enumerate(S):
    pre = 0 if i==0 else h
    post= 0 if i==n-1 else h
    L=b-a+pre+post
    own = src==PLAN  # plan neighbours are other cards: freeze own edges instead
    t0=ss if own else ss-pre/30
    padstart=pre if own else 0
    if t0<0: padstart=round(-t0*30); t0=0
    args+=["-ss",f"{t0:.4f}","-i",src]
    chain=[f"fps=30"]
    if flt: chain.append(flt)
    chain.append("setpts=PTS-STARTPTS")
    if own: chain.append(f"trim=end_frame={b-a}")
    if padstart: chain.append(f"tpad=start_mode=clone:start={padstart}")
    chain.append(f"tpad=stop_mode=clone:stop={L}")
    chain.append(f"trim=end_frame={L}")
    if i==0:
        chain.append("scale=w='trunc(1080*(1+0.10*min(1,max(0,(n-40)/10)))/2)*2':h=-2:eval=frame:flags=bicubic,crop=1080:1920:(iw-1080)/2:(ih-1920)*0.35")
    if push:
        chain.append(f"scale=w='trunc(1080*(1+0.05*n/{L})/2)*2':h=-2:eval=frame:flags=bicubic,crop=1080:1920")
    chain+=["setsar=1","format=yuv420p","setpts=N/30/TB","fps=30"]
    fc.append(f"[{i}:v]"+",".join(chain)+f"[s{i}]")
cur="s0"
for i in range(1,n):
    off=(S[i][0]-h)/30
    fc.append(f"[{cur}][s{i}]xfade=transition=fade:duration={D/30:.4f}:offset={off:.4f}[x{i}]")
    cur=f"x{i}"
args+=["-i",PLAN,"-filter_complex",";".join(fc),"-map",f"[{cur}]","-map",f"{n}:a",
       "-c:v","libx264","-crf","16","-preset","medium","-pix_fmt","yuv420p","-r","30","-c:a","copy","-movflags","+faststart",
       "build/c2final/base.mp4"]
r=subprocess.run(args,capture_output=True,text=True); print(r.stderr[-2000:])
