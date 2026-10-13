import json, numpy as np
a=json.load(open("rec/analysis.json"))
PRE, POST, FPS = 0.8, 0.9, 30
ph=np.array([o["ph"] for o in a],float)
idx=np.arange(len(ph)); good=ph>0
ph=np.interp(idx, idx[good], ph[good])
N=int(round((PRE+len(a)/FPS+POST)*FPS))
src_i=np.clip(np.arange(N)-int(PRE*FPS),0,len(a)-1)
track=ph[src_i]
# gaussian smoothing (sigma 4 frames) so the camera glides, never snaps
k=np.exp(-0.5*(np.arange(-12,13)/4.0)**2); k/=k.sum()
track=np.convolve(np.pad(track,12,mode="edge"),k,mode="valid")
presses_src=[0.367,1.767,2.367,3.567,4.3,5.067]
presses=[round(p+PRE,3) for p in presses_src]
marker_x=[154,420,434,696,708,978]
MARKER_Y=480
WIDE, TIGHT, PUNCH = 1080/1280, 1920/806, 2.95
def ease(x): x=min(1,max(0,x)); return x*x*(3-2*x)
cam=[]
for f in range(N):
    t=f/FPS
    z=ease((t-0.5)/0.55)                 # wide -> tight
    s=WIDE+(TIGHT-WIDE)*z
    p=0.0
    for pt in presses:
        if pt-0.25<=t<pt: p=max(p,ease((t-(pt-0.25))/0.25))
        elif pt<=t<pt+0.35: p=max(p,1)
        elif pt+0.35<=t<pt+0.75: p=max(p,1-ease((t-(pt+0.35))/0.4))
    p*=z
    s=s+(PUNCH-s)*p
    cx=640+(track[f]-640)*z
    cy=403+(MARKER_Y-403)*p
    w,h=1080/s,1920/s
    cx=640 if w>=1280 else min(max(cx,w/2),1280-w/2)
    cy=403 if h>=806 else min(max(cy,h/2),806-h/2)
    cam.append([round(cx,2),round(cy,2),round(s,4)])
json.dump({"fps":FPS,"frames":N,"presses":presses,"markerX":marker_x,"markerY":MARKER_Y,"cam":cam},open("../remotion/src/markerCam.json","w"))
print(N, presses); print(cam[0],cam[30],cam[35],cam[60],cam[150])
