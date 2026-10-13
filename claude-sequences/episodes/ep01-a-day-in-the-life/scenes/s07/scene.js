// SCENE 7 · 0–10 s · summoned. A giant claw grabs Claude from its desk → LAB 3 (scientist, QUALITY / EFFORT / REASONING
// screens, pedestal) → RECHARGING flow while time flies → back at the desk. Characters on twos, crossfades between rooms.
const NSV = 'http://www.w3.org/2000/svg';
const twos = function (d) { return 'steps(' + Math.max(1, Math.round(d * 12)) + ')'; };
const mk = function (tag, attrs, parent) { const e = document.createElementNS(NSV, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); (typeof parent === 'string' ? $(parent) : parent).appendChild(e); return e; };
const ink = { stroke: '#1D1530', 'stroke-width': 5, 'stroke-linejoin': 'round' };
const A = function (o) { return Object.assign({}, ink, o); };
const boom = function (txt, t, t2, css) {
  const b = div('#hud', css || 'top:300px;font-size:120px;transform:rotate(-5deg);', 'boom'); b.textContent = txt;
  tl.set(b, { opacity: 0 }, 0);
  tl.fromTo(b, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', immediateRender: false }, t);
  tl.to(b, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, t2);
};
const caption = function (txt, t, t2) {
  const c = div('#hud', 'top:150px;', 'capbox'); c.textContent = txt;
  tl.set(c, { opacity: 0 }, 0);
  tl.fromTo(c, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'steps(3)', immediateRender: false }, t);
  if (t2) tl.to(c, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, t2);
};
// ---------- desk world (same as scene 6, the thousands already there) ----------
const VP = [540, 760];
for (let i = -30; i <= 30; i++) { const xb = 540 + i * 160; mk('line', { x1: VP[0] + (xb - VP[0]) * 0.02, y1: 762, x2: VP[0] + (xb - VP[0]) * 2.2, y2: 2600, stroke: '#FFFFFF', 'stroke-width': 3, opacity: .35 }, '#grid'); }
for (let r = 1; r < 26; r++) { const y = 760 + 1840 / (1 + 0.35 * (26 - r)); mk('line', { x1: -1000, y1: y, x2: 2080, y2: y, stroke: '#FFFFFF', 'stroke-width': 3, opacity: .3 }, '#grid'); }
const units = [];
for (let r = 8; r >= 0; r--) {
  const s = 1 / (1 + 0.62 * (r + 0.55)), y = 760 + (1580 - 760) * s, gap = 420 * s, n = Math.ceil(2600 / gap);
  for (let c = -Math.floor(n / 2); c <= Math.floor(n / 2); c++) {
    const x = 540 + c * gap + (r % 2 ? gap / 2 : 0);
    if (r === 0 && Math.abs(x - 540) < gap * 0.8) continue;
    const u = mk('use', { href: '#unit', x: -200, y: -330, width: 400, height: 400 }, '#crowd');
    u.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') scale(' + s.toFixed(3) + ')');
  }
}
tl.set('#panels', { opacity: 0 }, 0);
gsap.set('#world', { svgOrigin: '0 0' });
tl.set('#world', { scale: 1.25, x: 540 - 1.25 * 540, y: 960 - 1.25 * 1150 }, 0);

// ---------- the claw (local origin = grab point just above the top of what it grabs) ----------
const claw = function (parent, id) {
  const g = mk('g', { id: id }, parent);
  mk('rect', A({ x: -14, y: -2600, width: 28, height: 2490, fill: '#8E99A6' }), g);
  mk('rect', A({ x: -110, y: -130, width: 220, height: 90, rx: 18, fill: '#C9D3DC' }), g);
  mk('rect', { x: 50, y: -130, width: 60, height: 90, fill: 'url(#dotsD)', opacity: .35 }, g);
  mk('circle', A({ cx: 0, cy: -86, r: 18, fill: '#FF5E62' }), g);
  const L = mk('g', { id: id + 'L' }, g), R = mk('g', { id: id + 'R' }, g);
  [[L, -1], [R, 1]].forEach(function (p) {
    const s = p[1];
    mk('path', { d: 'M' + (90 * s) + ' -50 L' + (150 * s) + ' 70 L' + (112 * s) + ' 150', fill: 'none', stroke: '#1D1530', 'stroke-width': 34, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p[0]);
    mk('path', { d: 'M' + (90 * s) + ' -50 L' + (150 * s) + ' 70 L' + (112 * s) + ' 150', fill: 'none', stroke: '#C9D3DC', 'stroke-width': 22, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p[0]);
  });
  gsap.set(L, { svgOrigin: '-90 -50' }); gsap.set(R, { svgOrigin: '90 -50' });
  return g;
};
const openClaw = function (id, t, d) { tl.to('#' + id + 'L', { rotation: 22, duration: d || 0.17, ease: 'steps(2)' }, t); tl.to('#' + id + 'R', { rotation: -22, duration: d || 0.17, ease: 'steps(2)' }, t); };
const closeClaw = function (id, t) { tl.to('#' + id + 'L', { rotation: -6, duration: 0.17, ease: 'steps(2)' }, t); tl.to('#' + id + 'R', { rotation: 6, duration: 0.17, ease: 'steps(2)' }, t); };
// ---------- a Claude (feet at 0,0) ----------
const claude = function (parent, id, sleepy) {
  const g = mk('g', { id: id }, parent);
  mk('ellipse', { cx: 0, cy: 4, rx: 110, ry: 13, fill: '#1D1530', opacity: .3 }, g);
  [-74, -30, 14, 56].forEach(function (lx) { mk('rect', A({ x: lx, y: -44, width: 28, height: 46, rx: 5, fill: '#D9612B' }), g); });
  mk('polygon', A({ points: '-100,-270 -72,-298 128,-298 100,-270', fill: '#FFAA6B' }), g);
  mk('polygon', A({ points: '100,-270 128,-298 128,-70 100,-40', fill: '#D9612B' }), g);
  mk('rect', A({ x: -100, y: -270, width: 200, height: 230, fill: '#F5873A' }), g);
  mk('rect', { x: -100, y: -270, width: 200, height: 230, fill: 'url(#dotsS)' }, g);
  const e = mk('g', { id: id + 'E' }, g);
  if (sleepy) { mk('rect', { x: -56, y: -196, width: 30, height: 9, fill: '#15131A' }, e); mk('rect', { x: 26, y: -196, width: 30, height: 9, fill: '#15131A' }, e); }
  else { mk('rect', { x: -54, y: -224, width: 24, height: 48, fill: '#15131A' }, e); mk('rect', { x: 30, y: -224, width: 24, height: 48, fill: '#15131A' }, e); }
  mk('rect', A({ x: -134, y: -150, width: 36, height: 50, fill: '#E86F33' }), g); mk('rect', A({ x: 98, y: -150, width: 36, height: 50, fill: '#E86F33' }), g);
  return g;
};

// ===== A · desk: typing, the claw descends, CLANK, lifts Claude away (0–2.3) =====
caption('2:00 PM · summoned!', 0.2, 2.2);
gsap.set('#armL', { svgOrigin: '386 1290' }); gsap.set('#armR', { svgOrigin: '604 1290' });
tl.fromTo('#armL', { y: 0 }, { y: -10, duration: 0.17, yoyo: true, repeat: 5, ease: 'steps(1)', immediateRender: false }, 0);
tl.fromTo('#armR', { y: -10 }, { y: 0, duration: 0.17, yoyo: true, repeat: 5, ease: 'steps(1)', immediateRender: false }, 0);
claw('#clawA', 'cA');
tl.set('#cA', { x: 508, y: -900 }, 0);
openClaw('cA', 0, 0.01);
tl.to('#cA', { y: 1062, duration: 0.7, ease: 'steps(8)' }, 0.45);
boom('WHIRRR…', 0.45, 1.15, 'top:300px;font-size:110px;transform:rotate(4deg);');
tl.to('#myEyes', { scaleY: 1.3, svgOrigin: '493 1196', duration: 0.08, ease: 'steps(1)' }, 1.05);   // looks up, surprised
closeClaw('cA', 1.2);
boom('CLANK!', 1.25, 1.95, 'top:520px;font-size:150px;transform:rotate(-7deg);');
tl.to('#cA', { y: -900, duration: 0.7, ease: 'steps(8)' }, 1.55);
tl.to('#me', { y: -1962, duration: 0.7, ease: 'steps(8)' }, 1.55);
// ===== crossfade to the lab =====
tl.to('#deskScene', { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 2.25);
tl.to('#labScene', { opacity: 1, duration: 0.35, ease: 'power2.inOut' }, 2.25);

// ===== B · LAB: lowered onto the pedestal, tested (2.3–5.6) =====
caption('2:05 PM · testing', 2.5, 5.5);
seed = 4;
for (let r = 0; r < 14; r++) for (let c = 0; c < 9; c++) mk('rect', { x: c * 120, y: r * 92, width: 120, height: 92, fill: 'none', stroke: '#2C6474', 'stroke-width': 3 }, '#labTiles');
for (let i = 0; i < 6; i++) { const b = mk('circle', { cx: 70 + rnd() * 200, cy: 1150, r: 6 + rnd() * 6, fill: '#FFFFFF', opacity: .8 }, '#bubbles');
  tl.fromTo(b, { y: 0, opacity: .8 }, { y: -120 - rnd() * 60, opacity: 0, duration: 0.8, repeat: 9, ease: 'steps(8)', immediateRender: false }, rnd() * 0.8); }
claude('#claudeLab', 'cl');
claw('#clawB', 'cB');
tl.set('#cl', { x: 540, y: -500 }, 0); tl.set('#cB', { x: 540, y: -810 }, 0);
closeClaw('cB', 0);
tl.to('#cl', { y: 1250, duration: 0.8, ease: 'steps(9)' }, 2.5);
tl.to('#cB', { y: 940, duration: 0.8, ease: 'steps(9)' }, 2.5);
openClaw('cB', 3.4);
tl.to('#cB', { y: -900, duration: 0.5, ease: 'steps(6)' }, 3.6);
tl.fromTo('#padTop', { attr: { fill: '#7CF0FF' } }, { attr: { fill: '#FFFFFF' }, duration: 0.17, yoyo: true, repeat: 5, ease: 'steps(1)', immediateRender: false }, 3.45);
boom('BZZZT!', 3.45, 4.2, 'top:520px;left:80px;right:auto;width:600px;font-size:120px;transform:rotate(-6deg);color:#7CF0FF;');
// the tests: needle LOW→HIGH→MED, quality climbs, reasoning fills, the scientist scribbles
gsap.set('#needle', { svgOrigin: '800 560' });
tl.set('#needle', { rotation: -70 }, 0);
tl.to('#needle', { rotation: 70, duration: 0.42, ease: 'steps(5)' }, 3.9);
tl.to('#needle', { rotation: 0, duration: 0.33, ease: 'steps(4)' }, 4.5);
const ql = $('#qLine'); const qL = 520; ql.style.strokeDasharray = qL;
tl.fromTo(ql, { strokeDashoffset: qL }, { strokeDashoffset: 0, duration: 0.9, ease: 'steps(10)', immediateRender: false }, 3.9);
tl.set(ql, { strokeDashoffset: qL }, 0);
tl.to('#rBar', { attr: { width: 470 }, duration: 0.9, ease: 'steps(10)' }, 4.0);
tl.fromTo('#clip', { y: 0 }, { y: -10, duration: 0.17, yoyo: true, repeat: 7, ease: 'steps(1)', immediateRender: false }, 4.0);
tl.fromTo('#clE', { x: -10 }, { x: 10, duration: 0.25, yoyo: true, repeat: 5, ease: 'steps(1)', immediateRender: false }, 3.9);
// ===== crossfade to the recharge room =====
tl.to('#labScene', { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 5.55);
tl.to('#rechScene', { opacity: 1, duration: 0.35, ease: 'power2.inOut' }, 5.55);

// ===== C · RECHARGING: along the conveyor through glowing rings, battery fills, the clock spins (5.6–8.3) =====
caption('time flies…', 5.8, 8.2);
for (let x = 30; x < 1080; x += 70) { const r = mk('circle', A({ cx: x, cy: 1385, r: 24, fill: '#8E99A6', 'stroke-width': 4 }), '#rollers'); }
claude('#claudeR', 'cr', true);
[260, 540, 820].forEach(function (x, i) {
  mk('ellipse', { cx: x, cy: 1130, rx: 70, ry: 270, fill: 'none', stroke: '#7CF0FF', 'stroke-width': 14, opacity: .35 }, '#rings');
  const f = mk('path', { d: 'M' + x + ' 860 A70 270 0 0 1 ' + x + ' 1400', fill: 'none', stroke: '#B6F09A', 'stroke-width': 16, 'stroke-linecap': 'round' }, '#ringsFront');
  tl.fromTo(f, { opacity: 0.4 }, { opacity: 1, duration: 0.17, yoyo: true, repeat: 15, ease: 'steps(1)', immediateRender: false }, 5.7 + i * 0.08);
});
tl.set('#cr', { x: 80, y: 1350 }, 0);
tl.to('#cr', { x: 1000, duration: 2.5, ease: twos(2.5) }, 5.75);
tl.to('#batt', { attr: { width: 350 }, duration: 2.3, ease: 'steps(18)' }, 5.85);
count('#battN', 10, 100, 5.85, 2.3, function (v) { return Math.round(v / 5) * 5 + '%'; });
gsap.set('#hMin', { svgOrigin: '900 700' }); gsap.set('#hHour', { svgOrigin: '900 700' });
tl.to('#hMin', { rotation: 1440, duration: 2.5, ease: 'steps(32)' }, 5.75);
tl.to('#hHour', { rotation: 120, duration: 2.5, ease: 'steps(32)' }, 5.75);
tl.fromTo('#rechTxt', { opacity: 1 }, { opacity: 0.3, duration: 0.33, yoyo: true, repeat: 7, ease: 'steps(1)', immediateRender: false }, 5.8);
boom('zzz…', 6.2, 7.8, 'top:820px;left:300px;right:auto;width:400px;font-size:110px;color:#C9B8F0;');
// ===== D · the SAME claw brings Claude back down into its desk (8.3–9.6) =====
tl.set('#cA', { y: -900 }, 8.2); tl.set('#me', { y: -1962 }, 8.2); tl.set('#myEyes', { scaleY: 1 }, 8.2);
closeClaw('cA', 8.2);
tl.to('#rechScene', { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 8.3);
tl.to('#deskScene', { opacity: 1, duration: 0.35, ease: 'power2.inOut' }, 8.3);
tl.to('#cA', { y: 1062, duration: 0.6, ease: 'steps(7)' }, 8.4);
tl.to('#me', { y: 0, duration: 0.6, ease: 'steps(7)' }, 8.4);
openClaw('cA', 9.05);
boom('CLUNK.', 9.05, 9.6, 'top:520px;font-size:130px;transform:rotate(5deg);');
tl.to('#cA', { y: -900, duration: 0.5, ease: 'steps(6)' }, 9.25);
// ===== E · works a little (9.6–11.0) =====
caption('4:55 PM · back to work', 9.6, 10.9);
tl.fromTo('#armL', { y: 0 }, { y: -10, duration: 0.12, yoyo: true, repeat: 9, ease: 'steps(1)', immediateRender: false }, 9.6);
tl.fromTo('#armR', { y: -10 }, { y: 0, duration: 0.12, yoyo: true, repeat: 9, ease: 'steps(1)', immediateRender: false }, 9.6);
boom('TAP TAP TAP', 9.7, 10.8);
// ===== F · gets up and leaves the desk for the 5 PM kafe (11.0–12.4) =====
caption('5:00 PM · kafe time!', 11.05);
tl.to('#me', { y: -50, duration: 0.17, ease: 'steps(2)' }, 11.0);                            // hops up off the chair
['#mL0', '#mL1', '#mL2', '#mL3'].forEach(function (l, i) {
  gsap.set(l, { svgOrigin: (430 + i * 43) + ' 1340' });
  tl.fromTo(l, { rotation: i % 2 ? 22 : -22 }, { rotation: i % 2 ? -22 : 22, duration: 0.22, yoyo: true, repeat: 4, ease: 'steps(3)', immediateRender: false }, 11.2);
});
tl.to('#me', { x: 620, y: 170, duration: 1.1, ease: twos(1.1) }, 11.2);                        // walks out to the right, down to the floor
