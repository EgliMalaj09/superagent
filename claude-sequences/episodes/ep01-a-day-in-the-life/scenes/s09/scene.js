// SCENE 9 · 0–7.5 s · 6:00 PM, the Pyramid of Tirana at sunset. Claude hops up the colourful step-boxes and sits on top;
// the view turns to the boulevard: pink flamingos gathering in front of the Kryeministria. "…what's that?" On twos.
const NSV = 'http://www.w3.org/2000/svg';
const mk = function (tag, attrs, parent) { const e = document.createElementNS(NSV, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); (typeof parent === 'string' ? $(parent) : parent).appendChild(e); return e; };
const ink = { stroke: '#1D1530', 'stroke-width': 5, 'stroke-linejoin': 'round' };
const A = function (o) { return Object.assign({}, ink, o); };
const cube = function (parent, x, y, s, top, front, side) {   // a small box: front face at (x,y) size s, top + side faces
  mk('polygon', A({ points: x + ',' + y + ' ' + (x + s * .25) + ',' + (y - s * .25) + ' ' + (x + s * 1.25) + ',' + (y - s * .25) + ' ' + (x + s) + ',' + y, fill: top }), parent);
  mk('polygon', A({ points: (x + s) + ',' + y + ' ' + (x + s * 1.25) + ',' + (y - s * .25) + ' ' + (x + s * 1.25) + ',' + (y + s * .75) + ' ' + (x + s) + ',' + (y + s), fill: side }), parent);
  mk('rect', A({ x: x, y: y, width: s, height: s, fill: front }), parent);
};
const COL = [['#FFE07A', '#F7C948', '#D9A72E'], ['#FFB3D1', '#FF8FB1', '#E06F96'], ['#9EE1FF', '#5BC0F2', '#3E9CCB'], ['#B6F09A', '#7ED36A', '#5BAE4C'], ['#FF9A7E', '#FF5E62', '#D9474B']];
seed = 17;
// skyline behind
for (let i = 0; i < 9; i++) { const w = 90 + rnd() * 70, h = 160 + rnd() * 260, x = i * 125 - 20; mk('rect', A({ x: x, y: 1560 - h, width: w, height: h, fill: '#8E4FA8', 'stroke-width': 4, opacity: .85 }), '#skyline'); }
// central staircase (12 steps) and colourful boxes on the slopes
const STEPS = 12, sy = function (i) { return 1540 - i * 76; };
for (let i = 0; i < STEPS; i++) { const w = 220 - i * 9; mk('rect', A({ x: 540 - w / 2, y: sy(i), width: w, height: 22, fill: '#FFFFFF', 'stroke-width': 4 }), '#steps'); }
[[160, 1430, 90], [280, 1250, 80], [760, 1300, 90], [850, 1440, 100], [370, 1050, 70], [660, 1100, 70], [240, 1470, 70], [700, 1460, 80],
 [430, 880, 56], [590, 900, 56], [150, 1330, 60], [880, 1340, 60], [320, 1380, 60], [740, 1200, 60]].forEach(function (b, i) { const c = COL[i % COL.length]; cube('#boxes', b[0], b[1], b[2], c[0], c[1], c[2]); });
// the climber (feet at 0,0)
const cl = mk('g', { id: 'cl' }, '#climber');
mk('ellipse', { cx: 0, cy: 4, rx: 100, ry: 12, fill: '#1D1530', opacity: .3 }, cl);
[-74, -30, 14, 56].forEach(function (lx) { mk('rect', A({ x: lx, y: -44, width: 28, height: 46, rx: 5, fill: '#D9612B' }), cl); });
mk('polygon', A({ points: '-100,-270 -72,-298 128,-298 100,-270', fill: '#FFAA6B' }), cl);
mk('polygon', A({ points: '100,-270 128,-298 128,-70 100,-40', fill: '#D9612B' }), cl);
mk('rect', A({ x: -100, y: -270, width: 200, height: 230, fill: '#F5873A' }), cl);
mk('rect', { x: -100, y: -270, width: 200, height: 230, fill: 'url(#dotsS)' }, cl);
mk('rect', { x: -54, y: -224, width: 24, height: 48, fill: '#15131A' }, cl); mk('rect', { x: 30, y: -224, width: 24, height: 48, fill: '#15131A' }, cl);
// ===== the climb: one hop per step (on twos), smaller as it goes up =====
gsap.set('#cl', { transformOrigin: '50% 100%' });   // shrink around the feet, not the middle
tl.set('#cl', { x: 540, y: 1560, scale: 0.62 }, 0);
for (let i = 0; i < STEPS; i++) {
  const t = 0.3 + i * 0.26, sc = 0.62 - i * 0.026;
  tl.to('#cl', { y: sy(i) - 46, scale: sc, duration: 0.17, ease: 'steps(2)' }, t);
  tl.to('#cl', { y: sy(i), duration: 0.08, ease: 'steps(1)' }, t + 0.17);
}
const hop = div('#hud', 'top:300px;font-size:120px;transform:rotate(-5deg);', 'boom'); hop.textContent = 'HOP HOP HOP';
tl.set(hop, { opacity: 0 }, 0);
tl.fromTo(hop, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', immediateRender: false }, 0.4);
tl.to(hop, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 1.6);
// on top: a little sit-squash and a sigh at the sunset
tl.to('#cl', { y: '+=10', duration: 0.17, ease: 'steps(2)', yoyo: true, repeat: 1 }, 3.55);   // settles on the top step
const ahh = div('#hud', 'top:420px;font-size:110px;transform:rotate(4deg);', 'boom'); ahh.textContent = 'ahhh…';
tl.set(ahh, { opacity: 0 }, 0);
tl.fromTo(ahh, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', immediateRender: false }, 3.7);
tl.to(ahh, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 4.3);
// ===== the reveal: turn to the boulevard =====
tl.to('#climb', { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 4.35);
tl.to('#view', { opacity: 1, duration: 0.35, ease: 'power2.inOut' }, 4.35);
for (let i = 0; i < 11; i++) { const w = 70 + rnd() * 80, h = 120 + rnd() * 220, x = i * 110 - 60; mk('rect', A({ x: x, y: 990 - h, width: w, height: h, fill: '#6A3E9A', 'stroke-width': 4 }), '#city'); }
for (let i = 0; i < 7; i++) { const x = 290 + i * 80; mk('rect', A({ x: x, y: 800, width: 26, height: 190, fill: '#FFF4D6', 'stroke-width': 4 }), '#cols'); }
for (let i = 0; i < 6; i++) { const k = i / 5, y = 1010 + 820 * k * k, s = 0.4 + k;
  mk('circle', A({ cx: 470 - 60 - 600 * k, cy: y, r: 34 * s, fill: '#3FA66B' }), '#trees'); mk('circle', A({ cx: 610 + 60 + 600 * k, cy: y, r: 34 * s, fill: '#3FA66B' }), '#trees'); }
// the flamingos gather (pink dots, a few phone lights), front of the building first, spreading down the boulevard
const dots = [];
for (let i = 0; i < 180; i++) {
  const k = Math.pow(rnd(), 1.6), y = 1000 + 520 * k, half = 70 + 380 * k, x = 540 + (rnd() * 2 - 1) * half;
  const phone = rnd() < 0.12;
  const d = mk('circle', { cx: x, cy: y, r: (phone ? 3 : 5) + 9 * k, fill: phone ? '#FFFFFF' : (rnd() < 0.8 ? '#FF5FA2' : '#FFB3D1'), stroke: '#1D1530', 'stroke-width': 2, opacity: 0 }, '#crowd');
  dots.push({ el: d, k: k });
}
dots.forEach(function (d) { tl.to(d.el, { opacity: 1, duration: 0.08, ease: 'steps(1)' }, 4.8 + d.k * 2.0); });
gsap.set('#vcam', { svgOrigin: '540 900' });
tl.fromTo('#vcam', { scale: 1 }, { scale: 1.22, duration: 3.1, ease: 'power1.inOut', immediateRender: false }, 4.4);
const q = div('#hud', 'left:120px;top:1270px;font-size:60px;', 'bubble tl'); q.textContent = '…what\'s that?';
tl.set(q, { opacity: 0 }, 0);
tl.fromTo(q, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', transformOrigin: '20% 100%', immediateRender: false }, 5.7);
// caption
const cap = div('#hud', 'top:150px;', 'capbox'); cap.textContent = '6:00 PM · the Pyramid';
tl.set(cap, { opacity: 0 }, 0);
tl.fromTo(cap, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'steps(3)', immediateRender: false }, 0.15);
