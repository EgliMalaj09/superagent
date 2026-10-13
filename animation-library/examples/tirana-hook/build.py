"""Build hook/public/index.html: the zoom-out hook that opens the Tirana video (isometric style)."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
D = 5.9
style = open(os.path.join(HERE, '..', 'design.html')).read().split('</style>')[0].replace('<style>', '')
helpers = open(os.path.join(HERE, 'helpers.js')).read()
scene = open(os.path.join(HERE, 'scene.js')).read()
page = """<!doctype html><html lang="sq"><head><meta charset="utf-8"/><style>
  * { box-sizing:border-box; } html, body { margin:0; width:1080px; height:1920px; overflow:hidden; background:#F2EEE6; }
  #stage { position:relative; width:1080px; height:1920px; overflow:hidden; }
%s
  .txt { position:absolute; left:70px; right:70px; top:250px; display:flex; flex-direction:column; align-items:center; gap:10px; text-align:center; z-index:60; }
  .txt > div { opacity:0; }
  .veil { position:absolute; inset:0; background:radial-gradient(120%% 75%% at 50%% 62%%, rgba(242,238,230,0) 45%%, rgba(242,238,230,.85) 100%%); z-index:50; pointer-events:none; }
</style></head><body>
<div id="stage" data-composition-id="hook" data-start="0" data-duration="%.2f" data-fps="30" data-width="1080" data-height="1920">
  <div class="L clip paper" id="bgh" data-start="0" data-duration="%.2f" data-track-index="1" style="z-index:1;">
    <div class="cam" id="camh" style="left:540px;top:1360px;"><div class="tilt" id="tilth"><div class="spin" id="wh"></div></div></div>
  </div>
  <div class="veil clip" data-start="0" data-duration="%.2f" data-track-index="2"></div>
  <div class="txt clip" data-start="0" data-duration="%.2f" data-track-index="3">
    <div class="h" id="h0" style="font-size:96px;opacity:1;">Në Tiranë,</div>
    <div class="h" id="h1" style="font-size:66px;">hapësira e gjelbër për banor</div>
    <div class="h" id="h2" style="font-size:66px;">është më e vogël se</div>
    <div class="h" id="h3" style="font-size:104px;"><span class="hl"><i id="h3hl"></i><b>një krevat dopio.</b></span></div>
  </div>
  <audio id="vo" src="sfx/vo.wav" data-start="0" data-duration="5.2" data-track-index="80" data-volume="1"></audio>
  <audio id="bed" src="sfx/bed.wav" data-start="0" data-duration="%.2f" data-track-index="81" data-volume="0.07"></audio>
  <script src="vendor/gsap.min.js"></script>
  <script>
  (function () {
    const tl = window.gsap.timeline({ paused: true });
%s
%s
    tl.to({}, { duration: %.2f }, 0);
    window.__timelines = window.__timelines || {}; window.__timelines["hook"] = tl;
  })();
  </script>
</div></body></html>""" % (style, D, D, D, D, D, helpers, scene, D)
open(os.path.join(HERE, 'public', 'index.html'), 'w').write(page)
open(os.path.join(HERE, 'public', 'hyperframes.json'), 'w').write('{"paths":{"blocks":"compositions","components":"compositions/components","assets":"assets"},"media":{"autoProxy":true}}')
print('built hook/public/index.html')
