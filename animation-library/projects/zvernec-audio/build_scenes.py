"""Rebuild the three replacement scenes for zvernec-FULL (KLSH 9 miliardë, Rama clip, people clip)."""
import os
W=os.path.dirname(os.path.abspath(__file__)); Z=os.path.expanduser("~/Desktop/animation-library/examples/zvernec/src")
rd=lambda n: open(os.path.join(Z,n)).read()
HF='{"paths":{"blocks":"compositions","components":"compositions/components","assets":"assets"},"media":{"autoProxy":true}}'
def page(cid,D,css,body,js):
    return '''<!doctype html><html lang="sq"><head><meta charset="utf-8"/><style>%s%s</style></head><body>
<div id="stage" data-composition-id="%s" data-start="0" data-duration="%.2f" data-fps="30" data-width="1080" data-height="1920">
%s
<script src="vendor/gsap.min.js"></script>
<script>
(function () {
  const tl = window.gsap.timeline({ paused: true });
%s
  tl.to({}, { duration: %.2f }, 0);
  window.__timelines = window.__timelines || {}; window.__timelines["%s"] = tl;
})();
</script>
</div></body></html>'''%(rd("common.css"),css,cid,D,body,js,D,cid)
def write(d,html):
    open(os.path.join(W,d,"index.html"),"w").write(html); open(os.path.join(W,d,"hyperframes.json"),"w").write(HF)
# --- KLSH: "9 miliardë €" timed to the new voice line, held to 26.5 s ---
h=rd("P7.html"); style,body=h.split("</style>",1); style=style.replace("<style>","")
old='<div class="O" style="font-size:190px;line-height:.9;position:relative;"><span class="R">Miliarda €</span><div class="gl O" id="d3g" style="font-size:190px;color:#2AD4FF;">Miliarda €</div>'
new='<div class="O" style="font-size:160px;line-height:.9;position:relative;margin-top:14px;"><span class="R">9 miliardë €</span><div class="gl O" id="d3g" style="font-size:160px;color:#2AD4FF;">9 miliardë €</div>'
assert old in body; body=body.replace(old,new).replace('data-duration="25.2"','data-duration="26.5"')
js=rd("P7.js"); a="mld: 20.5, dem: 21.7, korr: 22.64, end: 25.2"; assert a in js
js=js.replace(a,"mld: 20.35, dem: 21.66, korr: 23.18, end: 25.2")
write("p7",page("zvp7",26.5,style,body,js))
# --- Rama clip scene (10.8 s) and people scene (11.25 s), same style as the Kohen interview ---
p3=rd("P3B.html").split("</style>")[0].replace("<style>","")
body='''<div class="S clip news" id="pr" data-start="0" data-duration="10.80" data-track-index="10">
  <div class="S" id="camr">
    <div class="O" id="cl" style="position:absolute;left:0;width:1080px;text-align:center;top:330px;font-size:40px;color:#FF2A2A;letter-spacing:.12em;opacity:0;">Edi Rama · fjalim</div>
    <div class="pl3" id="pl3"><video class="clip" id="vr" src="media/rama.mp4" muted playsinline data-start="0.50" data-duration="10.3" data-track-index="31"></video><div class="ptag3">● Edi Rama</div></div>
    <div class="sb" id="sb" style="position:absolute;left:60px;top:960px;width:960px;height:160px;">
      <div id="t0">“Shqipëria nuk është<br/>e shqiptarëve,</div><div id="t1">se shtëpia<br/>e shqiptarit</div>
      <div id="t2">është <span class="R">e Zotit</span><br/>dhe <span class="R">e mikut</span>,</div><div id="t3">dhe këtë<br/>e thotë Kanuni.”</div></div>
    <div class="O" id="src" style="position:absolute;left:0;width:1080px;text-align:center;top:1400px;font-size:26px;color:rgba(255,255,255,.55);font-weight:500;letter-spacing:.06em;opacity:0;">Burimi: Dosja.al</div>
  </div>
  <div class="scan"></div><div class="vig"></div>
  <div class="bar"><b>SIPAS RAMËS</b><span>Shqipëria · e Zotit dhe e mikut</span></div>
</div>'''
js='''  const C0 = 0.50;
  tl.fromTo('#camr', { scale: 1 }, { scale: 1.03, duration: 10.8, ease: 'none', immediateRender: true }, 0);
  tl.fromTo('#pl3', { opacity: 0, scale: 1.03 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out', immediateRender: true }, 0.05);
  tl.fromTo('#cl', { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', immediateRender: true }, 0.15);
  tl.fromTo('#src', { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: true }, 0.6);
  [['#t0', 0.0, 3.2], ['#t1', 3.2, 5.7], ['#t2', 5.7, 8.5], ['#t3', 8.5, 10.6]].forEach(function (c) {
    tl.fromTo(c[0], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out', immediateRender: false }, C0 + c[1]);
    tl.to(c[0], { opacity: 0, duration: 0.2, ease: 'power1.inOut' }, C0 + c[2] - 0.2);
  });
'''
write("rama",page("zvrama",10.8,p3+"\n  .pl3 { height:462px; }\n  .sb > div .R { color:#FF2A2A; }\n",body,js))
body='''<div class="S clip news" id="pp" data-start="0" data-duration="11.25" data-track-index="10">
  <div class="S" id="campp">
    <div class="O" id="cl" style="position:absolute;left:0;width:1080px;text-align:center;top:330px;font-size:40px;color:#FF2A2A;letter-spacing:.12em;opacity:0;">Përgjigjja e shqiptarëve</div>
    <div class="pl3" id="pl3"><video class="clip" id="vp" src="media/people.mp4" muted playsinline data-start="0.30" data-duration="10.95" data-track-index="31"></video><div class="ptag3">● Protestë</div></div>
    <div class="wd" id="w1" style="top:1080px;"><div class="O" style="font-size:96px;">Shqipëria</div><div class="O" style="font-size:96px;margin-top:40px;"><span class="blk">shqiptarëve!</span></div></div>
    <div class="O" id="src" style="position:absolute;left:0;width:1080px;text-align:center;top:1400px;font-size:26px;color:rgba(255,255,255,.55);font-weight:500;letter-spacing:.06em;opacity:0;">Burimi: Kronikani me Plis</div>
  </div>
  <div class="scan"></div><div class="vig"></div>
  <div class="bar"><b>PËRGJIGJJA</b><span>Shqipëria shqiptarëve</span></div>
</div>'''
js='''  tl.fromTo('#campp', { scale: 1 }, { scale: 1.03, duration: 11.25, ease: 'none', immediateRender: true }, 0);
  tl.fromTo('#pl3', { opacity: 0, scale: 1.03 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out', immediateRender: true }, 0.05);
  tl.fromTo('#cl', { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', immediateRender: true }, 0.15);
  tl.fromTo('#src', { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: true }, 0.8);
  tl.fromTo('#w1', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', immediateRender: false }, 0.5);
'''
write("people",page("zvpeople",11.25,p3,body,js))
print("scenes written")
