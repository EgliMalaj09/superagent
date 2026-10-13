// SCENE 5 · 0–7 s · the furgon. Exterior: stop, conductor shouts, Claude squeezes in → push through the window →
// inside: everyone types, chat bubbles fly to Claude → Ana asks → "On it!" → BUMP → pull out, the furgon drives off.
const NSV = 'http://www.w3.org/2000/svg';
const twos = function (d) { return 'steps(' + Math.max(1, Math.round(d * 12)) + ')'; };
const mk = function (tag, attrs, parent) { const e = document.createElementNS(NSV, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); (typeof parent === 'string' ? $(parent) : parent).appendChild(e); return e; };
const ink = { stroke: '#1D1530', 'stroke-width': 4 };
const A = function (o) { return Object.assign({}, ink, o); };

// ---------- exterior details: colourful Tirana blocks + road dashes ----------
[[0, 280, 760, '#F4B6C2'], [280, 260, 900, '#FFE59A'], [540, 300, 700, '#9FD6C4'], [840, 260, 820, '#C9B8F0']].forEach(function (b) {
  mk('rect', A({ x: b[0], y: 1300 - b[2], width: b[1], height: b[2], fill: b[3] }), '#blocks');
  for (let yy = 1300 - b[2] + 50; yy < 1240; yy += 110) for (let xx = b[0] + 30; xx < b[0] + b[1] - 50; xx += 80)
    mk('rect', A({ x: xx, y: yy, width: 44, height: 60, fill: '#FFFFFF', 'stroke-width': 3 }), '#blocks');
});
for (let x = 20; x < 1080; x += 180) mk('rect', { x: x, y: 1660, width: 100, height: 14, fill: '#FFFFFF' }, '#dashes');
// ---------- interior: the street passing in the window ----------
for (let i = 0; i < 14; i++) {
  const c = ['#F4B6C2', '#FFE59A', '#9FD6C4', '#C9B8F0'][i % 4];
  mk('rect', A({ x: 60 + i * 150, y: 420 + (i % 3) * 30, width: 130, height: 260, fill: c, 'stroke-width': 3 }), '#street');
}
tl.fromTo('#street', { x: 0 }, { x: -900, duration: 7, ease: 'steps(84)', immediateRender: false }, 0);

// ---------- passengers (blocky people, all on their phones) ----------
const person = function (id, x, body, head, hair, extra) {
  const g = mk('g', { id: id }, '#people');
  mk('rect', A({ x: x, y: 940, width: 160, height: 300, fill: body }), g);
  mk('rect', A({ x: x + 22, y: 810, width: 116, height: 120, fill: head }), g);
  mk('rect', A({ x: x + 14, y: 794, width: 132, height: 30, fill: hair }), g);
  mk('rect', { x: x + 50, y: 860, width: 14, height: 22, fill: '#15131A' }, g);
  mk('rect', { x: x + 96, y: 860, width: 14, height: 22, fill: '#15131A' }, g);
  const ph = mk('rect', A({ x: x + 50, y: 1010, width: 60, height: 90, rx: 8, fill: '#1D1530' }), g);
  mk('rect', { x: x + 56, y: 1018, width: 48, height: 72, rx: 4, fill: '#BFF5FF', class: 'glow' }, g);
  mk('rect', A({ x: x + 30, y: 1240, width: 40, height: 170, fill: '#3A3550' }), g); mk('rect', A({ x: x + 90, y: 1240, width: 40, height: 170, fill: '#3A3550' }), g);
  mk('rect', A({ x: x + 20, y: 1400, width: 56, height: 26, rx: 8, fill: '#1D1530' }), g); mk('rect', A({ x: x + 84, y: 1400, width: 56, height: 26, rx: 8, fill: '#1D1530' }), g);
  if (extra) extra(g, x);
  return g;
};
person('pGran', 20, '#7A5C8E', '#E9C4A6', '#D8D8D8', function (g, x) {   // grandma + pazar bag of veggies
  mk('rect', A({ x: x + 110, y: 1130, width: 90, height: 100, rx: 10, fill: '#F7D79A' }), g);
  const v = mk('g', { id: 'veg' }, g);
  mk('circle', A({ cx: x + 130, cy: 1124, r: 18, fill: '#E0483E' }), v); mk('circle', A({ cx: x + 168, cy: 1118, r: 16, fill: '#3FA66B' }), v);
  mk('rect', A({ x: x + 146, y: 1090, width: 12, height: 40, fill: '#F2843A' }), v);
});
person('pSuit', 230, '#2F3A55', '#E2A982', '#2E2A26', function (g, x) { mk('polygon', { points: (x + 70) + ',940 ' + (x + 90) + ',940 ' + (x + 80) + ',1040', fill: '#E0483E' }, g); });
person('pAna', 700, '#7B5BD6', '#E9B994', '#5A3A28', function (g, x) {   // Ana: purple hoodie, round glasses, ponytail, backpack straps
  mk('rect', A({ x: x + 128, y: 820, width: 30, height: 70, rx: 12, fill: '#5A3A28' }), g);
  mk('circle', { cx: x + 57, cy: 871, r: 18, fill: 'none', stroke: '#1D1530', 'stroke-width': 5 }, g);
  mk('circle', { cx: x + 103, cy: 871, r: 18, fill: 'none', stroke: '#1D1530', 'stroke-width': 5 }, g);
  mk('rect', { x: x + 20, y: 940, width: 16, height: 220, fill: '#FFD84F' }, g); mk('rect', { x: x + 124, y: 940, width: 16, height: 220, fill: '#FFD84F' }, g);
  mk('path', { id: 'anaMouth', d: 'M' + (x + 62) + ' 905 L' + (x + 98) + ' 905', stroke: '#15131A', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, g);
});
person('pTeen', 900, '#3FA66B', '#D9A07A', '#1D1530', function (g, x) {   // headphones
  mk('path', { d: 'M' + (x + 18) + ' 860 Q' + (x + 80) + ' 760 ' + (x + 142) + ' 860', fill: 'none', stroke: '#E0483E', 'stroke-width': 12 }, g);
});
// Claude inside, sitting between the suit and Ana
const ci = mk('g', { id: 'claudeIn' }, '#people');
mk('polygon', A({ points: '445,950 470,925 650,925 625,950', fill: '#FFAA6B' }), ci);
mk('polygon', A({ points: '625,950 650,925 650,1220 625,1245', fill: '#D9612B' }), ci);
mk('rect', A({ x: 445, y: 950, width: 180, height: 295, fill: '#F5873A' }), ci);
[460, 505, 555, 600].forEach(function (lx) { mk('rect', A({ x: lx, y: 1245, width: 30, height: 60, rx: 5, fill: '#D9612B' }), ci); });
const ce = mk('g', { id: 'ceyes' }, ci);
mk('rect', { x: 485, y: 1000, width: 24, height: 48, fill: '#15131A' }, ce); mk('rect', { x: 562, y: 1000, width: 24, height: 48, fill: '#15131A' }, ce);
// phones glow (on twos)
tl.fromTo('#people .glow', { opacity: 0.6 }, { opacity: 1, duration: 0.33, yoyo: true, repeat: 20, ease: 'steps(2)', immediateRender: false }, 0);

// interior camera: frame the passengers (the floor below is empty)
gsap.set('#intCam', { svgOrigin: '0 0' });
tl.set('#intCam', { scale: 1.15, x: 540 - 1.15 * 540, y: 960 - 1.15 * 960 }, 0);

// ---------- 1 · exterior: the furgon pulls up, the conductor shouts, Claude runs in ----------
tl.set('#bus', { x: 700 }, 0);
tl.to('#bus', { x: 0, duration: 0.6, ease: 'steps(7)' }, 0);
gsap.set('#bus', { svgOrigin: '620 1390' });
tl.to('#bus', { scaleY: 0.96, scaleX: 1.02, duration: 0.08, ease: 'steps(1)', yoyo: true, repeat: 1 }, 0.6);   // stop squash
gsap.set('#cArm', { svgOrigin: '390 1187' });
tl.fromTo('#cArm', { rotation: 0 }, { rotation: 30, duration: 0.17, yoyo: true, repeat: 5, ease: 'steps(2)', immediateRender: false }, 0.7);   // waving
tl.set('#claudeOut', { x: -200, y: 1415 }, 0);
tl.to('#claudeOut', { x: 300, duration: 0.8, ease: twos(0.8) }, 0.75);
gsap.set('#oA', { svgOrigin: '-57 -38' }); gsap.set('#oB', { svgOrigin: '-17 -38' }); gsap.set('#oC', { svgOrigin: '21 -38' }); gsap.set('#oD', { svgOrigin: '59 -38' });
tl.fromTo(['#oA', '#oC'], { rotation: -25 }, { rotation: 25, duration: 0.2, yoyo: true, repeat: 3, ease: 'steps(2)', immediateRender: false }, 0.75);
tl.fromTo(['#oB', '#oD'], { rotation: 25 }, { rotation: -25, duration: 0.2, yoyo: true, repeat: 3, ease: 'steps(2)', immediateRender: false }, 0.75);
tl.to('#claudeOut', { x: 430, y: 1330, scale: 0.7, duration: 0.17, ease: 'steps(2)' }, 1.55);   // squeezes in
tl.set('#claudeOut', { opacity: 0 }, 1.72);
// ---------- 2 · push through the window (710,1100) and crossfade inside ----------
gsap.set('#ext', { svgOrigin: '0 0' });
tl.to('#ext', { scale: 4, x: 540 - 4 * 715, y: 960 - 4 * 1100, duration: 0.6, ease: 'power2.in' }, 1.8);
tl.to('#ext', { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 2.15);
tl.to('#int', { opacity: 1, duration: 0.35, ease: 'power2.inOut' }, 2.15);
// ---------- 3 · inside: chat bubbles fly from every phone into Claude ----------
const icons = ['</>', '@', '♥', '?', '✓', '#'];
[[70, 1050], [280, 1050], [960, 1050], [120, 1050], [330, 1050], [990, 1050]].forEach(function (p, i) {
  const g = mk('g', { opacity: 0 }, '#bubblesIn');
  mk('rect', A({ x: p[0], y: p[1], width: 84, height: 54, rx: 18, fill: '#FFFFFF' }), g);
  mk('text', { x: p[0] + 42, y: p[1] + 38, 'text-anchor': 'middle', 'font-family': 'Out, sans-serif', 'font-weight': 800, 'font-size': 28, fill: '#1D1530' }, g).textContent = icons[i];
  const t = 2.6 + i * 0.16;
  tl.set(g, { opacity: 1 }, t);
  tl.to(g, { x: 535 - p[0] - 42, y: 960 - p[1], scale: 0.5, duration: 0.42, ease: 'steps(5)' }, t);
  tl.set(g, { opacity: 0 }, t + 0.42);
});
tl.fromTo('#ceyes', { x: -12 }, { x: 12, duration: 0.17, yoyo: true, repeat: 5, ease: 'steps(1)', immediateRender: false }, 2.6);   // eyes dart
tl.to('#ceyes', { x: 10, duration: 0.08, ease: 'steps(1)' }, 3.65);   // looks at Ana
// ---------- 4 · Ana's question, Claude's answer, Ana smiles ----------
const anaQ = div('#hud', 'left:210px;top:540px;width:700px;border-color:#1D1530;box-shadow:8px 8px 0 #FFD84F, 0 0 0 10px #FFE14D;font-size:46px;', 'bubble tr');
anaQ.innerHTML = 'Help me write a message to my boss: I\'ll be late 😅';
tl.set(anaQ, { opacity: 0 }, 0);
tl.fromTo(anaQ, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', transformOrigin: '80% 100%', immediateRender: false }, 3.6);
tl.to(anaQ, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 5.1);
const onIt = div('#hud', 'left:470px;top:770px;font-size:56px;', 'bubble tl'); onIt.textContent = 'On it!';
tl.set(onIt, { opacity: 0 }, 0);
tl.fromTo(onIt, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', transformOrigin: '20% 100%', immediateRender: false }, 4.4);
tl.to(onIt, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 5.15);
tl.set('#anaMouth', { attr: { d: 'M762 900 Q780 922 798 900' } }, 4.65);   // Ana smiles
// ---------- 5 · BUMP: pothole, everyone hops, veggies jump ----------
tl.to('#int', { y: -36, duration: 0.17, ease: 'steps(2)', yoyo: true, repeat: 1 }, 5.25);
['#pGran', '#pSuit', '#claudeIn', '#pAna', '#pTeen'].forEach(function (s, i) { tl.to(s, { y: -60, duration: 0.17, ease: 'steps(2)', yoyo: true, repeat: 1 }, 5.27 + i * 0.03); });
tl.to('#veg', { y: -150, rotation: 20, duration: 0.25, ease: 'steps(3)', yoyo: true, repeat: 1 }, 5.25);
const bump = div('#hud', 'top:150px;font-size:150px;transform:rotate(-6deg);', 'boom'); bump.textContent = 'BUMP!';
tl.set(bump, { opacity: 0 }, 0);
tl.fromTo(bump, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', immediateRender: false }, 5.25);
tl.to(bump, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 5.95);
// ---------- 6 · pull out; the furgon drives off right ----------
tl.to('#int', { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 6.0);
tl.to('#ext', { opacity: 1, duration: 0.35, ease: 'power2.inOut' }, 6.0);
tl.to('#ext', { scale: 1, x: 0, y: 0, duration: 0.5, ease: 'power2.out' }, 6.05);
tl.set(['#bus', '#cArm'], { rotation: 0 }, 6.0);
tl.to('#bus', { x: 1200, duration: 0.55, ease: 'steps(7)' }, 6.45);
// ---------- caption + conductor shout ----------
const cap = div('#hud', 'top:150px;', 'capbox'); cap.textContent = '8:15 AM · furgon';
tl.set(cap, { opacity: 0 }, 0);
tl.fromTo(cap, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'steps(3)', immediateRender: false }, 0.2);
tl.to(cap, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 5.1);
const shout = div('#hud', 'left:60px;top:760px;font-size:54px;', 'bubble tl'); shout.textContent = 'QENDËR! QENDËR!';
tl.set(shout, { opacity: 0 }, 0);
tl.fromTo(shout, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', transformOrigin: '20% 100%', immediateRender: false }, 0.7);
tl.to(shout, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 1.75);
