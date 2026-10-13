import numpy as np, subprocess, sys, json
F=sys.argv[1]; W,H=1080,678
raw=subprocess.run([F,"-v","error","-i","rec2/content.mp4","-f","rawvideo","-pix_fmt","rgb24","-"],capture_output=True).stdout
fr=np.frombuffer(raw,np.uint8).reshape(-1,H,W,3).astype(np.int16)
n=len(fr); print("frames",n)
mask=np.ones((H,W),bool)
mask[50:320,455:615]=False   # player preview (plays video)
mask[0:14,:]=False           # autosave clock
res=[]
for i in range(n):
    f=fr[i]
    # overlay clip: teal body on overlay track row y~486
    row=f[480:492]
    teal=(row[...,1]>70)&(row[...,2]>70)&(row[...,0]<60)&(row[...,1]-row[...,0]>30)
    cols=np.where(teal.mean(0)>0.6)[0]
    clip=[int(cols.min()),int(cols.max())] if len(cols)>20 else None
    cur=None
    if i>0:
        d=np.abs(f-fr[i-1]).max(2)>40
        d&=mask
        ys,xs=np.where(d)
        if len(xs)>6:
            cur=[int(np.median(xs)),int(np.median(ys)),int(len(xs))]
    res.append({"i":i,"t":round(i/30,3),"clip":clip,"diff":cur})
json.dump(res,open("rec2/analysis.json","w"))
for o in res[::5]: print(o["t"],o["clip"],o["diff"])
