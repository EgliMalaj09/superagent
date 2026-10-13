import numpy as np, subprocess, sys, json
F=sys.argv[1]; W,H=1080,678
raw=subprocess.run([F,"-v","error","-i","rec2/content.mp4","-f","rawvideo","-pix_fmt","rgb24","-"],capture_output=True).stdout
fr=np.frombuffer(raw,np.uint8).reshape(-1,H,W,3).astype(np.int16)
n=len(fr)
mask=np.ones((H,W),bool); mask[50:320,455:615]=False; mask[0:14,:]=False
res=[]; last=None
for i in range(n):
    f=fr[i]; cur=None
    if i>0:
        d=(np.abs(f-fr[i-1]).max(2)>50)&mask
        bright=f.min(2)>200
        m=(d&bright).astype(np.float32)
        if m.sum()>=4:
            # densest 24x24 window via integral image
            ii=np.pad(m.cumsum(0).cumsum(1),((1,0),(1,0)))
            k=24; s=ii[k:,k:]-ii[:-k,k:]-ii[k:,:-k]+ii[:-k,:-k]
            y,x=np.unravel_index(np.argmax(s),s.shape)
            if s[y,x]>=4: cur=[int(x+k/2),int(y+k/2)]
    if cur is None: cur=last
    last=cur
    res.append(cur)
json.dump(res,open("rec2/cursor.json","w"))
for i in range(0,n,5): print(round(i/30,2),res[i])
