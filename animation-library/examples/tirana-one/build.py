"""One continuous isometric film: hook + the green-space story in a single world with one camera."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
D = 63.2
style = open(os.path.join(HERE, '..', 'design.html')).read().split('</style>')[0].replace('<style>', '')
helpers = open(os.path.join(HERE, '..', 'hook', 'helpers.js')).read()
scene = open(os.path.join(HERE, 'scene.js')).read()
def block(id_, t0, t1, inner, top=250):
    return '<div class="ov clip" id="%s" data-start="%.2f" data-duration="%.2f" data-track-index="%d" style="top:%dpx;">%s</div>' % (id_, t0, t1 - t0, 10 + block.n, top, inner)
block.n = 0
def B(*a, **k):
    block.n += 1; return block(*a, **k)
ov = [
  B('hook', 0, 6.2, '<div class="h" id="h0" style="font-size:96px;">Në Tiranë,</div><div class="h" id="h1" style="font-size:66px;">hapësira e gjelbër për banor</div><div class="h" id="h2" style="font-size:66px;">është më e vogël se</div><div class="h" id="h3" style="font-size:104px;"><span class="hl"><i id="h3hl"></i><b>një krevat dopio.</b></span></div>'),
  B('ta', 6.0, 10.6, '<div class="h" id="a1" style="font-size:88px;">Tirana po ndërton…</div><div class="h" id="a2" style="font-size:72px;">…dhe hapësirat e gjelbra<br/><span class="hl"><i id="a2hl"></i><b>po zhduken.</b></span></div>'),
  B('tb', 10.3, 21.9, '<div class="k" id="b0">Leje ndërtimi në Tiranë · 2024</div><div class="h" id="b1" style="font-size:120px;font-variant-numeric:tabular-nums;"><span id="b1n">0</span><span style="font-size:.5em;"> m²</span></div>'
         '<div style="display:flex;gap:14px;justify-content:center;"><span class="pill" id="b2">+36% nga 2023</span><span class="pill y" id="b3">rekord që nga 2005</span></div>'
         '<div class="h" id="b4" style="font-size:66px;margin-top:6px;">≈ <span class="hl"><i id="b4hl"></i><b>266 fusha futbolli</b></span></div><div class="src">Burimi: INSTAT, via Monitor (2025). 1 fushë ≈ 7,140 m².</div>'),
  B('tc', 22.0, 36.1, '<div class="k" id="c0">Gjelbërim publik për banor</div><div class="h" id="c1" style="font-size:140px;font-variant-numeric:tabular-nums;"><span class="hl"><i id="c1hl"></i><b><span id="c1n">3.44</span> m²</b></span></div>'
         '<div class="h" id="c2" style="font-size:56px;">= sa një <span class="hl"><i id="c2hl"></i><b>krevat dopio</b></span></div><div class="k" id="c3" style="color:#6b655c;">2009 → 2014</div>'
         '<div class="bars"><div id="c4"><div class="k s">Gjelbërimi</div><div class="row"><b id="c4b" style="width:120px;background:#3FA66B;"></b><span class="h" id="c4v">+0%</span></div></div>'
         '<div id="c5"><div class="k s">Popullsia</div><div class="row"><b id="c5b" style="width:640px;background:#1E1B18;"></b><span class="h" id="c5v">+0%</span></div></div></div>'
         '<div class="src">Burimi: studim mbi gjelbërimin urban në Tiranë (2009–2014, më të fundit të publikuara).</div>'),
  B('td', 36.2, 50.4, '<div class="k" id="d0">Parqe e kopshte publike · m² për banor</div><div class="h" id="d1" style="font-size:96px;">Tirana <span style="color:#E0483E;">vs</span> Evropa</div><div class="src" style="margin-top:auto;">Burimi: Wolff &amp; Haase 2019, 905 qytete (Urban Atlas 2012) · Tirana: 2014. Në shkallë të saktë.</div>'),
  B('te', 50.4, 54.5, '<div class="h" id="e0" style="font-size:88px;"><span class="hl"><i id="e0hl"></i><b>4 herë më pak</b></span></div><div class="h" id="e1" style="font-size:170px;">×4</div>'),
  B('tf', 54.3, D, '<div class="h" id="f0" style="font-size:78px;">Qyteti po rritet lart.</div><div class="h" id="f1" style="font-size:78px;">A do të rritet edhe<br/><span class="hl"><i id="f1hl"></i><b>gjelbërimi?</b></span></div>'
         '<div style="flex:1"></div><div class="pill" id="f2" style="align-self:center;">Ndiq për më shumë →</div><div class="src" id="f3">Burimet: INSTAT (lejet 2024) · Studim mbi gjelbërimin në Tiranë 2009–2014 · Wolff &amp; Haase 2019 (Urban Atlas)</div>'),
]
page = """<!doctype html><html lang="sq"><head><meta charset="utf-8"/><style>
  * { box-sizing:border-box; } html, body { margin:0; width:1080px; height:1920px; overflow:hidden; background:#F2EEE6; }
  #stage { position:relative; width:1080px; height:1920px; overflow:hidden; }
%s
  .ov { position:absolute; left:70px; right:70px; bottom:470px; display:flex; flex-direction:column; align-items:center; gap:12px; text-align:center; z-index:60; pointer-events:none; }
  .ov > * { opacity:0; }
  .ov > .bars, .ov > .src { opacity:1; }
  .ov .src { position:absolute; bottom:-60px; left:0; right:0; opacity:1; font-family:"HG",Arial,sans-serif; font-weight:500; font-size:22px; color:rgba(30,27,24,.55); }
  .pill { display:inline-block; font-family:"HG",Arial,sans-serif; font-weight:700; font-size:30px; color:#1E1B18; border:3px solid #1E1B18; border-radius:999px; padding:8px 22px; background:#fff; }
  .pill.y { background:#F6D743; }
  .bars { width:100%%; display:flex; flex-direction:column; gap:16px; align-items:flex-start; }
  .bars > div { opacity:0; width:100%%; text-align:left; } .bars .s { font-size:22px; }
  .bars .row { display:flex; align-items:center; gap:16px; margin-top:6px; } .bars .row b { display:block; height:44px; border-radius:6px; transform-origin:0 50%%; transform:scaleX(0); }
  .bars .h { font-size:42px; }
  .tagw { background:#fff; color:#1E1B18; font-family:"BG",sans-serif; font-weight:800; font-size:15px; padding:3px 8px; border-radius:3px; box-shadow:0 2px 6px rgba(0,0,0,.2); white-space:nowrap; }
  .veil { position:absolute; inset:0; z-index:50; pointer-events:none;
    background:linear-gradient(180deg, rgba(242,238,230,.92) 0px, rgba(242,238,230,.75) 520px, rgba(242,238,230,0) 760px); }
</style></head><body>
<div id="stage" data-composition-id="tiranaone" data-start="0" data-duration="%.2f" data-fps="30" data-width="1080" data-height="1920">
  <div class="L clip paper" id="bg" data-start="0" data-duration="%.2f" data-track-index="1" style="z-index:1;">
    <div class="cam" id="cam" style="left:540px;top:960px;transform-origin:0 0;"><div class="tilt" id="tilt"><div class="spin" id="w"></div></div></div>
  </div>
  <div class="veil clip" data-start="0" data-duration="%.2f" data-track-index="2"></div>
  %s
  <audio id="vo1" src="sfx/vo-hook.wav" data-start="0" data-duration="5.2" data-track-index="80" data-volume="1"></audio>
  <audio id="vo2" src="sfx/vo-main.wav" data-start="5.55" data-duration="56.9" data-track-index="81" data-volume="1"></audio>
  <audio id="bed" src="sfx/bed64.wav" data-start="0" data-duration="%.2f" data-track-index="82" data-volume="0.07"></audio>
  <script src="vendor/gsap.min.js"></script>
  <script>
  (function () {
    const tl = window.gsap.timeline({ paused: true });
%s
%s
    tl.to({}, { duration: %.2f }, 0);
    window.__timelines = window.__timelines || {}; window.__timelines["tiranaone"] = tl;
  })();
  </script>
</div></body></html>""" % (style, D, D, D, "\n  ".join(ov), D, helpers, scene, D)
open(os.path.join(HERE, 'public', 'index.html'), 'w').write(page)
open(os.path.join(HERE, 'public', 'hyperframes.json'), 'w').write('{"paths":{"blocks":"compositions","components":"compositions/components","assets":"assets"},"media":{"autoProxy":true}}')
print('built one/public/index.html, %.1f s' % D)
