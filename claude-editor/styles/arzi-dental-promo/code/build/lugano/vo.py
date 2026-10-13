import numpy as np, subprocess, os, wave
SR=48000
def load(f,ch):
    return np.frombuffer(subprocess.run(["tools/ffmpeg","-v","error","-i",os.path.expanduser(f),"-f","f32le","-ac",str(ch),"-ar",str(SR),"-"],capture_output=True).stdout,np.float32).reshape(-1,ch).astype(np.float64)
mix=load("build/rec43/mix52.wav",2); vold=load("build/rec43/voice52.wav",1)[:,0]
wa=load("~/Downloads/WhatsApp Audio 2026-10-06 at 3.51.32 PM.mpeg",1)[:,0]
N=len(mix); vold=np.pad(vold,(0,max(0,N-len(vold))))[:N]
SH=int(0.003*SR); vsh=np.concatenate([np.zeros(SH),vold[:-SH]])   # voice sits 3 ms later in the mix
R0,R1=int(40.0*SR),int(44.22*SR)
# voice gain in the mix: regress mix on [voice, music-ish residual] in the old region, per channel
mono=mix.mean(1); seg=slice(R0,R1)
a=float(np.dot(mono[seg],vsh[seg])/np.dot(vsh[seg],vsh[seg]))
print("voice gain in mix %.3f"%a)
# pieces from the WhatsApp take: (src start, src end, src anchor, target anchor)
P=[(16.58,17.80,16.64,40.12),(18.54,19.92,18.60,41.64),(21.16,22.12,21.46,43.52)]
OLD=[(40.06,41.28),(41.58,42.98),(43.28,44.10)]   # matching words in the old voice, for level match
# matching EQ: smooth spectral ratio old-voice / WA-voice (speech parts)
def spec(x):
    n=4096; w=np.hanning(n); fr=[np.abs(np.fft.rfft(x[i:i+n]*w))**2 for i in range(0,len(x)-n,n//2)]
    return np.sqrt(np.mean(fr,0))
so=spec(vold[int(39.9*SR):int(47.0*SR)]); sw=spec(wa[int(16.5*SR):int(22.2*SR)])
fq=np.fft.rfftfreq(4096,1/SR); g=so/np.maximum(sw,1e-9)
# 1/3-octave smoothing, clamp ±8 dB, flat below 120 Hz
gs=np.empty_like(g)
for i,f in enumerate(fq):
    lo,hi=f/2**(1/6),f*2**(1/6); m=(fq>=lo)&(fq<=hi); gs[i]=np.exp(np.mean(np.log(g[m]+1e-12))) if m.any() else 1
gs/=np.exp(np.mean(np.log(gs[(fq>300)&(fq<3000)])))
gs=np.clip(gs,10**(-8/20),10**(8/20)); gs[fq<120]=gs[np.argmin(np.abs(fq-120))]
fir=np.fft.irfft(gs); fir=np.roll(fir,len(fir)//2)*np.hanning(len(fir))
waq=np.convolve(wa,fir,mode="same")
new=np.zeros(N)
for (s0,s1,anc,tgt),(o0,o1) in zip(P,OLD):
    x=waq[int(s0*SR):int(s1*SR)].copy()
    f=int(0.015*SR); x[:f]*=np.linspace(0,1,f); x[-f:]*=np.linspace(1,0,f)
    ro=np.sqrt(np.mean(vold[int(o0*SR):int(o1*SR)]**2)); rn=np.sqrt(np.mean(x**2)); x*=ro/rn
    at=int((tgt-(anc-s0))*SR); new[at:at+len(x)]+=x
    print("piece %.2f-%.2f -> %.2f-%.2f gain %.1f dB"%(s0,s1,tgt-(anc-s0),tgt-(anc-s0)+s1-s0,20*np.log10(ro/rn)))
nsh=np.concatenate([np.zeros(SH),new[:-SH]])
# crossfade window for the swap (boundaries sit in silence)
w=np.zeros(N); f=int(0.03*SR); w[R0:R1]=1; w[R0:R0+f]=np.linspace(0,1,f); w[R1-f:R1]=np.linspace(1,0,f)
out=mix - (a*vsh*w)[:,None] + (a*nsh*w)[:,None]
print("peak",np.abs(out).max())
out=np.clip(out,-1,1)
wv=wave.open("build/lugano/mix_lugano.wav","w"); wv.setnchannels(2); wv.setsampwidth(2); wv.setframerate(SR)
wv.writeframes((out*32767).astype(np.int16).tobytes()); wv.close()
# also check residual of the subtraction (old voice should be gone)
res=mix[seg].mean(1)-a*vsh[seg]
print("old region rms mix %.1f dB, after removing voice %.1f dB"%(20*np.log10(np.sqrt(np.mean(mono[seg]**2))),20*np.log10(np.sqrt(np.mean(res**2)))))
