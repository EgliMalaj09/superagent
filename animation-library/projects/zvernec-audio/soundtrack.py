"""zvernec-FULL v7 soundtrack: original voice/clips with the old bed and the text sound effects removed,
the new voice lines, Rama + people clips, and 'Showdown - prova' as the music, ducked under every voice."""
import numpy as np, subprocess, json
R=48000; T=lambda t:int(round(t*R))
def rdf(p): return np.frombuffer(subprocess.check_output(["ffmpeg","-v","error","-i",p,"-f","f32le","-ac","2","-ar","48000","-"]),np.float32).astype(np.float64).reshape(-1,2)
def rdm(p): return np.frombuffer(subprocess.check_output(["ffmpeg","-v","error","-i",p,"-f","f32le","-ac","1","-ar","48000","-"]),np.float32).astype(np.float64)
a=np.fromfile("orig_nobed.f32",np.float32).astype(np.float64).reshape(-1,2)
# ---- 1. remove the text sound effects (spectral subtraction with a capped gain so speech is never carved out) ----
ev=json.load(open("sfx_events.json"))
keep=lambda n,s: s>=(0.55 if n in ("whoosh","stamp","boom","luxhit","glitch","riser") else 0.6)
F=1024; Hh=256; win=np.hanning(F)
def stft(x):
    n=1+(len(x)-F)//Hh; return np.array([np.fft.rfft(win*x[i*Hh:i*Hh+F]) for i in range(n)])
def istft(X,L):
    y=np.zeros(L); ws=np.zeros(L)
    for i,f in enumerate(X): y[i*Hh:i*Hh+F]+=win*np.fft.irfft(f,F); ws[i*Hh:i*Hh+F]+=win**2
    return y/np.maximum(ws,1e-6)
tm={}; done=0
for n,t,s in ev:
    if not keep(n,s): continue
    tp=tm.setdefault(n,rdm("sfx/%s.wav"%n)); pad=int(0.10*R); i0=max(0,T(t)-pad); L=len(tp)+2*pad
    tpp=np.zeros(L); tpp[pad:pad+len(tp)]=tp; Tm=np.abs(stft(tpp)); strong=Tm>0.2*Tm.max()
    for ch in range(2):
        x=a[i0:i0+L,ch].copy(); X=stft(x); M=np.abs(X)
        g=min(np.percentile(M[strong]/Tm[strong],25),0.6)
        newM=np.maximum(M-2.0*g*Tm,0.08*M); y=istft(X*(newM/np.maximum(M,1e-9)),L)
        e=int(0.02*R); w=np.ones(L); w[:e]=np.linspace(0,1,e); w[-e:]=np.linspace(1,0,e)
        a[i0:i0+L,ch]=x*(1-w)+y*w
    done+=1
print("sound effects removed:",done)
base=a
def act_rms(x):
    fr=x[:len(x)//2400*2400].mean(1).reshape(-1,2400); r=np.sqrt((fr**2).mean(1)); r=r[r>0.25*r.max()]; return np.sqrt((r**2).mean())
ref=act_rms(base[T(143.0):T(148.0)])
# ---- 2. assemble in the new timeline (same cuts as v6) ----
D=186.65; out=np.zeros((T(D)+R,2))
def place(s0,s1,dst,fade=0.04):
    h=fade/2; p=base[T(s0-h):T(s1+h)].copy(); k=T(fade)
    p[:k]*=np.linspace(0,1,k)[:,None]; p[-k:]*=np.linspace(1,0,k)[:,None]; j=T(dst-h); out[j:j+len(p)]+=p
place(0.02,61.25,0.02); place(61.45,62.65,61.25); place(61.25,148.41,62.45)
place(153.10,160.26,155.60,0.04); place(165.25,167.30,173.15,0.08)
def put(x,t): i=T(t); out[i:i+len(x)]+=x
vo={k:rdf("vo_%s.wav"%k) for k in ("pav","kohen","nine")}
for k in vo: vo[k]*=ref/act_rms(vo[k])
put(vo["pav"],61.17); put(vo["kohen"],62.75); put(vo["nine"],149.51)
ra=rdf("rama_a.wav")[:T(10.25)]; ra*=ref/act_rms(ra)*0.95; k=T(0.25); ra[-k:]*=np.linspace(1,0,k)[:,None]; ra[:T(0.02)]*=np.linspace(0,1,T(0.02))[:,None]; put(ra,163.067)
ch=rdf("people_a.wav")[T(0.22):]; ch*=ref/act_rms(ch)*0.9; k=T(0.6); ch[-k:]*=np.linspace(1,0,k)[:,None]; ch[:T(0.02)]*=np.linspace(0,1,T(0.02))[:,None]; put(ch,175.47)
out=out[:T(D)]
# ---- 3. the music, ducked under every voice ----
mu=rdf("showdown.wav"); mu=np.r_[mu,np.zeros((max(0,len(out)-len(mu)),2))][:len(out)]
fr=int(0.05*R); n=len(out)//fr
sp=np.sqrt((out[:n*fr].mean(1).reshape(n,fr)**2).mean(1)); spd=20*np.log10(sp+1e-9)
act=np.clip((spd-(20*np.log10(ref)-24))/10,0,1)                 # 0 = no voice, 1 = voice
sm=np.zeros(n); v=0
for i in range(n):                                                # fast attack, slow release
    v=act[i] if act[i]>v else v+(act[i]-v)*0.12; sm[i]=v
mrms=act_rms(mu[T(40):T(140)])
gain_db=(20*np.log10(ref)-16-20*np.log10(mrms))+6*(1-sm)            # -16 dB under the voice, +6 dB in the gaps
g=np.interp(np.arange(len(out)),np.arange(n)*fr+fr/2,10**(gain_db/20))
fo=T(1.2); g[-fo:]*=np.linspace(1,0,fo)
out+=mu*g[:,None]
pk=np.abs(out).max(); out*=min(1,0.98/pk)
out.astype(np.float32).tofile("soundtrack_v7.f32"); print("done %.2f s, peak %.2f, voice ref %.1f dB"%(len(out)/R,pk,20*np.log10(ref)))
