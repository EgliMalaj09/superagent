import numpy as np, subprocess, sys, json
F=sys.argv[1]; W,H=1280,806
raw=subprocess.run([F,"-v","error","-i","rec/content.mp4","-f","rawvideo","-pix_fmt","rgb24","-"],capture_output=True).stdout
fr=np.frombuffer(raw,np.uint8).reshape(-1,H,W,3).astype(int)
n=len(fr); print("frames",n)
out=[]
prev_markers=0
for i,f in enumerate(fr):
    r,g,b=f[...,0],f[...,1],f[...,2]
    # cyan marker row y 474..486: teal pixels (g,b high, r low)
    row=f[474:487]
    cy=(row[...,1]>150)&(row[...,2]>150)&(row[...,0]<120)
    cols=np.where(cy.any(0))[0]
    # group marker columns
    groups=[]
    for c in cols:
        if groups and c-groups[-1][-1]<=3: groups[-1].append(c)
        else: groups.append([c])
    mk=[int(np.mean(g)) for g in groups]
    # playhead: bright column in rows 700..780 (below clips)
    band=f[700:780]
    wh=((band.min(2))>200).sum(0)
    ph=int(np.argmax(wh)) if wh.max()>40 else -1
    out.append({"i":i,"t":round(i/30,3),"markers":mk,"ph":ph})
json.dump(out,open("rec/analysis.json","w"))
last=None
for o in out:
    key=(len(o["markers"]),)
    if key!=last: print(o); last=key
print("ph samples:",[ (o["t"],o["ph"]) for o in out[::10]])
