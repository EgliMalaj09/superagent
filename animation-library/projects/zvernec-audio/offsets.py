import numpy as np, subprocess, json
R=48000
rd=lambda p: np.frombuffer(subprocess.check_output(["ffmpeg","-v","error","-i",p,"-ac","1","-ar","48000","-f","f32le","-"]),np.float32).astype(float)
x=rd("orig.wav"); b=rd("bed-news-tension.wav"); L=len(b)
m=int(1.0*R); n=1<<int(np.ceil(np.log2(L+m))); B=np.fft.rfft(b,n); c2=np.r_[0,np.cumsum(b**2)]
en=np.sqrt(c2[m:L]-c2[:L-m]+1e-12)
found=[]
for t0 in np.arange(0,len(x)/R-1,0.5):
    s=x[int(t0*R):int(t0*R)+m]
    xc=np.fft.irfft(B*np.conj(np.fft.rfft(s,n)),n)[:L-m]; ncc=xc/(en*np.linalg.norm(s)+1e-12); i=int(np.argmax(ncc))
    if ncc[i]>0.35: found.append((round(t0,1),int(round(t0*R))-i,float(ncc[i])))
# cluster offsets (in samples) within 2 ms
offs=[]
for t,o,c in sorted(found,key=lambda z:-z[2]):
    if not any(abs(o-q[0])<96 for q in offs): offs.append([o,c,t])
offs.sort()
for o,c,t in offs: print("offset %.4f s  (best ncc %.2f at %.1f s)"%(o/R,c,t))
json.dump([o for o,c,t in offs],open("offsets.json","w"))
