"""Remove the old music bed (bed-news-tension, restarted per part) from the original zvernec-FULL soundtrack by
fitting its level every 0.25 s (least squares, all candidate offsets at once) and subtracting it."""
import numpy as np, subprocess
R=48000
rd=lambda p: np.frombuffer(subprocess.check_output(["ffmpeg","-v","error","-i",p,"-ac","2","-ar","48000","-f","f32le","-"]),np.float32).astype(np.float64).reshape(-1,2)
x=rd("orig.wav"); bed=rd("bed-news-tension.wav"); N=len(x); L=len(bed)
import json
OFFS=[o/48000 for o in json.load(open('offsets.json'))]
# refine each offset to the sample with a local search
def tmpl(off,i0,i1,ch):
    p0=i0-int(round(off*R)); out=np.zeros(i1-i0)
    a=max(p0,0); b=min(p0+(i1-i0),L)
    if b>a: out[a-p0:b-p0]=bed[a:b,ch]
    return out
win=int(0.25*R); hop=win//2; nW=(N-win)//hop+1
G=np.zeros((nW,len(OFFS),2))
for w in range(nW):
    i0=w*hop; i1=i0+win
    for ch in range(2):
        A=np.stack([tmpl(o,i0,i1,ch) for o in OFFS],1); act=np.where((A**2).sum(0)>1e-6)[0]
        if len(act)==0: continue
        Aa=A[:,act]; lam=1e-3*np.trace(Aa.T@Aa)/len(act); g=np.linalg.solve(Aa.T@Aa+lam*np.eye(len(act)),Aa.T@x[i0:i1,ch]); G[w,act,ch]=g
# smooth gains over ~1.5 s (median then mean) and drop offsets that are not really there
from numpy.lib.stride_tricks import sliding_window_view as swv
k=5
Gs=np.zeros_like(G)
for o in range(len(OFFS)):
    for ch in range(2):
        g=np.pad(G[:,o,ch],(k//2,k//2),mode='edge'); g=np.median(swv(g,k),1)
        g=np.convolve(np.pad(g,(k//2,k//2),mode='edge'),np.ones(k)/k,'valid'); g[g<0.02]=0; Gs[:,o,ch]=g
# subtract with per-sample interpolated gains
t_w=(np.arange(nW)*hop+win/2)
out=x.copy(); idx=np.arange(N)
for o,off in enumerate(OFFS):
    if Gs[:,o,:].max()==0: continue
    for ch in range(2):
        gi=np.interp(idx,t_w,Gs[:,o,ch]); out[:,ch]-=gi*tmpl(off,0,N,ch)
np.save("bed_gains.npy",Gs)
out.astype(np.float32).tofile("orig_nobed.f32")
def lvl(a,t0,t1): s=a[int(t0*R):int(t1*R)]; return 20*np.log10(np.sqrt((s**2).mean())+1e-9)
for t0,t1,what in [(3,9,"intro, voice+bed"),(57.5,59.4,"Kohen claim"),(61.4,64.0,"silent card (bed only)"),(149,152,"KLSH line"),(153.3,153.9,"gap"),(167.4,171.3,"flag ending")]:
    print("%-26s before %5.1f dB  after %5.1f dB"%(what,lvl(x,t0,t1),lvl(out,t0,t1)))
