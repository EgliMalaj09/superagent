import subprocess, glob, os, sys
H=os.path.expanduser("~"); P="build/c3final/"
D=10; h=D//2
G="curves=master='0/0 0.25/0.21 0.6/0.56 0.85/0.78 1/0.9',eq=saturation=1.1:contrast=1.04,colorbalance=rm=0.03:bm=-0.03:rh=0.02:bh=-0.02"
REAL="crop=1080:1920:0:(ih-1920)/2,"+G
AI="scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920"
g=lambda p: glob.glob(H+p)[0]
# (start, end, src, src_start_sec, filter, push_in) — src may be a card PNG (frozen) or a clip
S=[(0,317,P+"hook2.mp4",0,None,False),
   (317,432,H+"/Downloads/DSCF8790.mp4",3.0,REAL,True),
   (432,525,P+"card_3.png",0,None,False),
   (525,624,P+"card_4a.png",0,None,False),
   (624,732,P+"card_4b.png",0,None,False),
   (732,782,H+"/Downloads/DSCF8801.mp4",7.4,REAL,True),
   (782,870,H+"/Downloads/DSCF8794.mp4",6.0,REAL,True),
   (870,966,P+"card_6.png",0,None,False),
   (966,1029,P+"map.mp4",0,None,False),
   (1029,1116,P+"card_7b.png",0,None,False),
   (1116,1227,P+"card_8.png",0,None,False),
   (1227,1338,P+"card_9.png",0,None,False),
   (1338,1434,P+"card_10.png",0,None,False),
   (1434,1500,P+"endlogo.mp4",0,None,False)]
# new opening (doctor looking at camera, 0-5.9 s) replaces the 10.55 s hook: everything after shifts 141 f earlier
SH=141
S=[(0,177,S[0][2],0,None,False)]+[(a-SH,b-SH,src,ss,flt,push) for (a,b,src,ss,flt,push) in S[1:]]
OUT=sys.argv[1] if len(sys.argv)>1 else H+"/Desktop/creative3-plan.mp4"
args=["tools/ffmpeg","-v","error","-y"]; fc=[]; n=len(S)
for i,(a,b,src,ss,flt,push) in enumerate(S):
    pre = 0 if i==0 else h
    post= 0 if i==n-1 else h
    L=b-a+pre+post
    still=src.endswith(".png")
    own = still or src.startswith(P) or src.endswith("black.mp4")
    t0=ss if own else ss-pre/30
    padstart=pre if own else 0
    if t0<0: padstart=round(-t0*30); t0=0
    args+=(["-loop","1","-t","6","-i",src] if still else ["-ss",f"{t0:.4f}","-i",src])
    chain=["fps=30"]
    if flt: chain.append(flt)
    chain.append("setpts=PTS-STARTPTS")
    if own: chain.append(f"trim=end_frame={b-a}")
    if padstart: chain.append(f"tpad=start_mode=clone:start={padstart}")
    chain.append(f"tpad=stop_mode=clone:stop={L}")
    chain.append(f"trim=end_frame={L}")
    if push:
        chain.append(f"scale=w='trunc(1080*(1+0.05*n/{L})/2)*2':h=-2:eval=frame:flags=bicubic,crop=1080:1920")
    chain+=["scale=1080:1920:out_range=tv","setsar=1","format=yuv420p","setpts=N/30/TB","fps=30"]
    fc.append(f"[{i}:v]"+",".join(chain)+f"[s{i}]")
cur="s0"
for i in range(1,n):
    off=(S[i][0]-h)/30
    fc.append(f"[{cur}][s{i}]xfade=transition=fade:duration={D/30:.4f}:offset={off:.4f}[x{i}]")
    cur=f"x{i}"
args+=["-i",P+"vo2.wav","-filter_complex",";".join(fc),"-map",f"[{cur}]","-map",f"{n}:a",
       "-c:v","libx264","-crf","17","-preset","medium","-pix_fmt","yuv420p","-r","30","-c:a","aac","-b:a","256k","-movflags","+faststart",OUT]
r=subprocess.run(args,capture_output=True,text=True); print(r.stderr[-2000:])
