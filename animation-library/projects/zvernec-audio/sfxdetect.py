import numpy as np, wave, json, subprocess
R=48000; F=1024; H=480
rd=lambda p: np.frombuffer(subprocess.check_output(["ffmpeg","-v","error","-i",p,"-ac","1","-ar","48000","-f","f32le","-"]),np.float32).astype(float)
def spec(x):
    n=1+(len(x)-F)//H; idx=np.arange(F)[None,:]+H*np.arange(n)[:,None]
    return np.abs(np.fft.rfft(x[idx]*np.hanning(F),axis=1))[:,:400]
a=rd("nobed.wav"); Al=np.log1p(spec(a)*30)
names=["stamp","boom","glitch","whoosh","swipe","pop","tick","riser","click","typing","luxhit","shimmer","ding"]
ev=[]
for nm in names:
    t=rd("sfx/%s.wav"%nm); Tl=np.log1p(spec(np.r_[t,np.zeros(F)])*30); m=len(Tl); Tz=Tl-Tl.mean(); Tn=np.linalg.norm(Tz)
    sc=np.array([((Al[i:i+m]-Al[i:i+m].mean())*Tz).sum()/(np.linalg.norm(Al[i:i+m]-Al[i:i+m].mean())*Tn+1e-9) for i in range(len(Al)-m)])
    used=np.zeros(len(sc),bool)
    for i in np.argsort(-sc):
        if sc[i]<0.55: break
        if used[max(0,i-m):i+m].any(): continue
        used[i]=True; ev.append([nm,round(i*H/R,3),round(float(sc[i]),2)])
ev.sort(key=lambda e:e[1]); json.dump(ev,open("sfx_events.json","w"))
print(len(ev),"events"); print(" ".join("%s@%.2f(%.2f)"%tuple(e) for e in ev))
