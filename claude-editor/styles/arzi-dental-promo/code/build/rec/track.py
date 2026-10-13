import numpy as np, subprocess, sys, json
F=sys.argv[1]; W,H=1280,806
raw=subprocess.run([F,"-v","error","-i","rec/content.mp4","-f","rawvideo","-pix_fmt","rgb24","-"],capture_output=True).stdout
fr=np.frombuffer(raw,np.uint8).reshape(-1,H,W,3).astype(int)
a=json.load(open("rec/analysis.json"))
bg=np.median(fr[:, 690:785, 120:1270],axis=0)  # static background of lower timeline area
for i,f in enumerate(fr):
    band=f[690:785,120:1270]
    lum=band.mean(2)
    col=(lum>120).sum(0)
    ph=int(np.argmax(col))+120 if col.max()>30 else -1
    # cursor: bright pixels in the whole timeline region (y 440-600) that differ from playhead column
    reg=f[455:600,120:1270].min(2)
    ys,xs=np.where(reg>215)
    keep=np.abs(xs+120-ph)>6 if ph>0 else np.ones_like(xs,bool)
    ys,xs=ys[keep],xs[keep]
    cur=[int(np.median(xs))+120,int(np.median(ys))+455] if len(xs)>8 else None
    a[i]["ph"]=ph; a[i]["cursor"]=cur
json.dump(a,open("rec/analysis.json","w"))
for o in a[::6]: print(o["t"],o["ph"],o["cursor"])
