import json, numpy as np
cur=json.load(open("rec2/cursor.json"))
PRE, POST, FPS = 0.8, 0.7, 30
CW, CH = 1080, 678
xs=np.array([c[0] if c else 130 for c in cur],float)
# robust: running median (9 frames) kills one-off panel flashes, then gaussian glide
pad=np.pad(xs,4,mode="edge")
med=np.array([np.median(pad[i:i+9]) for i in range(len(xs))])
N=int(round((PRE+len(cur)/FPS+POST)*FPS))
src_i=np.clip(np.arange(N)-int(PRE*FPS),0,len(cur)-1)
track=med[src_i]
k=np.exp(-0.5*(np.arange(-15,16)/5.0)**2); k/=k.sum()
track=np.convolve(np.pad(track,15,mode="edge"),k,mode="valid")
trims_src=[1.1,3.45,5.6,8.15]; trim_x=[130,135,369,367]; TRIM_Y=487
events=[round(t+PRE,3) for t in trims_src]
WIDE, TIGHT, PUNCH = 1080/CW, 1920/CH, 3.6
def ease(x): x=min(1,max(0,x)); return x*x*(3-2*x)
cam=[]
for f in range(N):
    t=f/FPS
    z=ease((t-0.5)/0.55)
    s=WIDE+(TIGHT-WIDE)*z
    p=0.0; px=None
    for e,ex in zip(events,trim_x):
        if e-0.45<=t<e: q=ease((t-(e-0.45))/0.35)
        elif e<=t<e+0.4: q=1
        elif e+0.4<=t<e+0.8: q=1-ease((t-(e+0.4))/0.4)
        else: q=0
        if q>p: p,px=q,ex
    p*=z
    s=s+(PUNCH-s)*p
    tx=track[f] if px is None else track[f]+(px-track[f])*p
    cx=CW/2+(tx-CW/2)*z
    cy=CH/2+(TRIM_Y-CH/2)*p
    w,h=1080/s,1920/s
    cx=CW/2 if w>=CW else min(max(cx,w/2),CW-w/2)
    cy=CH/2 if h>=CH else min(max(cy,h/2),CH-h/2)
    cam.append([round(float(cx),2),round(float(cy),2),round(float(s),4)])
json.dump({"fps":FPS,"frames":N,"contentW":CW,"contentH":CH,"video":"rec/adjust2x.mp4",
  "events":events,"eventX":trim_x,"eventY":TRIM_Y,"cam":cam},open("../remotion/src/adjustCam.json","w"))
print(N, events)
