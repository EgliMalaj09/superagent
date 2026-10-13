import numpy as np, subprocess, sys
W,H,N=1440,2560,359
Y0,Y1=1735,1885
SRC="/Users/eglimalaj/Desktop/finished-1-arzi-FINAL-captions-v2.mp4"
# (first-blob x, width) of each chunk -> x ranges of the words to highlight
SIG=[((330,48),[(638,1122)]),        # il tuo SORRISO?
     ((424,90),[(546,1024)]),        # in ALBANIA,
     ((284,48),[(372,768)]),         # il PREZZO conta,
     ((306,424),[(298,1138)]),       # SEGUIRÀ PRIMA,
     ((281,443),[(274,732),(858,1166)]),  # DURANTE e DOPO
     ((317,48),[(398,1130)])]        # il TRATTAMENTO.
YEL=np.array([255,225,77],float)/255
dec=subprocess.Popen(["../tools/ffmpeg","-v","error","-i",SRC,"-frames:v",str(N),"-pix_fmt","rgb24","-f","rawvideo","-"],stdout=subprocess.PIPE)
enc=subprocess.Popen(["../tools/ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r","30","-i","-","-c:v","libx264","-crf","12","-preset","medium","-pix_fmt","yuv420p","rec49/hook_hl.mp4"],stdin=subprocess.PIPE)
def detect(f):
    band=f[Y0:Y1].astype(float); mn=band.min(2); mx=band.max(2)
    m=(mn>215)&((mx-mn)<25); cols=np.where(m.sum(0)>0)[0]
    if not len(cols): return None, False
    s=cols[0];pr=cols[0];blobs=[]
    for x in cols[1:]:
        if x-pr>18: blobs.append((s,pr-s));s=x
        pr=x
    blobs.append((s,pr-s)); blobs=[bb for bb in blobs if bb[1]>6]
    if not blobs: return None, False
    x0,w0=blobs[0]
    best=min(SIG,key=lambda g: abs(x0-g[0][0])+abs(w0-g[0][1]))
    (sx,sw),r=best
    if abs(x0-sx)<=16 and abs(w0-sw)<=22: return r, True
    return None, True
pre=subprocess.Popen(["../tools/ffmpeg","-v","error","-i",SRC,"-frames:v",str(N),"-vf",f"crop={W}:{Y1-Y0}:0:{Y0}","-pix_fmt","rgb24","-f","rawvideo","-"],stdout=subprocess.PIPE)
R=[];T=[]
for n in range(N):
    bb=np.frombuffer(pre.stdout.read(W*(Y1-Y0)*3),np.uint8).reshape(Y1-Y0,W,3)
    full=np.zeros((Y1,W,3),np.uint8); full[Y0:Y1]=bb
    r,t=detect(full); R.append(r); T.append(t)
for n in range(N):
    if R[n] is None:
        for k in range(1,7):
            if n+k<N and R[n+k] is not None and (not T[n] or k<=2): R[n]=R[n+k]; break
for n in range(N-1,0,-1):
    pass
for n in range(1,N):
    if R[n] is None and not T[n]:
        for k in (1,2):
            if n-k>=0 and R[n-k] is not None and T[n-k]: R[n]=R[n-k]; break
hits=0
for n in range(N):
    b=dec.stdout.read(W*H*3)
    f=np.frombuffer(b,np.uint8).reshape(H,W,3).copy()
    band=f[Y0:Y1].astype(float); mn=band.min(2); mx=band.max(2)
    rng=R[n]
    if rng:
        hits+=1
        wgt=np.clip((mn-60)/60,0,1)*np.clip(1-(mx-mn-15)/35,0,1)
        for a,c in rng:
            seg=band[:,a:c]; ww=wgt[:,a:c,None]
            band[:,a:c]=seg*(1-ww)+ww*seg*YEL
        f[Y0:Y1]=np.clip(band,0,255).astype(np.uint8)
    enc.stdin.write(f.tobytes())
enc.stdin.close(); enc.wait()
print("highlighted frames",hits)
