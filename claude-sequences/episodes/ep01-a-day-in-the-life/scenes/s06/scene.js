// SCENE 6 · 0–9.5 s · 9:00 AM. One desk on an endless floor → Claude starts typing → thousands pop in → the camera cranes up
// to a high view over the endless office (hanging stats screens, floating requests) → dives into our Claude's screen → chat.
const NSV = 'http://www.w3.org/2000/svg';
const twos = function (d) { return 'steps(' + Math.max(1, Math.round(d * 12)) + ')'; };
const mk = function (tag, attrs, parent) { const e = document.createElementNS(NSV, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); (typeof parent === 'string' ? $(parent) : parent).appendChild(e); return e; };
const fmt = function (v) { return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };

// ===== front view (desk close-up): endless floor + rows of identical desks =====
const VP = [540, 760];
for (let i = -30; i <= 30; i++) { const xb = 540 + i * 160; mk('line', { x1: VP[0] + (xb - VP[0]) * 0.02, y1: 762, x2: VP[0] + (xb - VP[0]) * 2.2, y2: 2600, stroke: '#FFFFFF', 'stroke-width': 3, opacity: .35 }, '#grid'); }
for (let r = 1; r < 26; r++) { const y = 760 + 1840 / (1 + 0.35 * (26 - r)); mk('line', { x1: -1000, y1: y, x2: 2080, y2: y, stroke: '#FFFFFF', 'stroke-width': 3, opacity: .3 }, '#grid'); }
seed = 9; for (let i = 0; i < 40; i++) mk('circle', { cx: -800 + rnd() * 2700, cy: -500 + rnd() * 1150, r: 2 + rnd() * 3, fill: '#FFFFFF', opacity: .6 }, '#stars');
const units = [];
for (let r = 0; r < 9; r++) {
  const s = 1 / (1 + 0.62 * (r + 0.55)), y = 760 + (1580 - 760) * s, gap = 420 * s, n = Math.ceil(2600 / gap);
  for (let c = -Math.floor(n / 2); c <= Math.floor(n / 2); c++) {
    const x = 540 + c * gap + (r % 2 ? gap / 2 : 0);
    if (r === 0 && Math.abs(x - 540) < gap * 0.8) continue;
    const u = mk('use', { href: '#unit', x: -200, y: -330, width: 400, height: 400, opacity: 0 }, '#crowd');
    u.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') scale(' + s.toFixed(3) + ')');
    units.push({ el: u, d: Math.hypot(x - 540, y - 1580) });
  }
}
const crowd = $('#crowd'); units.slice().reverse().forEach(function (u) { crowd.appendChild(u.el); });
tl.set('#panels', { opacity: 0 }, 0);

// ===== elevated room view: the endless office from above =====
for (let x = -300; x < 1400; x += 240) mk('rect', { x: x, y: -300, width: 10, height: 860, fill: '#E04E92' }, '#wallLines');
const FVP = [540, 120];
for (let i = -16; i <= 16; i++) { const xb = 540 + i * 200; mk('line', { x1: FVP[0] + (xb - FVP[0]) * 0.22, y1: 560, x2: xb * 1.6 - 324, y2: 2600, stroke: '#4CE3FF', 'stroke-width': 3, opacity: .45 }, '#floorGrid'); }
const R = 11, ROWS = [];
for (let r = 0; r < R; r++) { const k = r / (R - 1); ROWS.push({ y: 610 + 1250 * Math.pow(k, 1.25), s: 0.3 + 0.62 * k }); }
seed = 21;
const VARIANTS = [['#FFE07A', '#F7C948'], ['#9EE1FF', '#5BC0F2'], ['#B6F09A', '#7ED36A'], ['#C9D3DC', '#8E99A6'], ['#FFB3D1', '#FF8FB1']];
const ME = { x: 540, row: R - 1 };
ROWS.forEach(function (row, r) {
  const gap = 250 * row.s, n = Math.ceil(2400 / gap);
  for (let c = -Math.floor(n / 2); c <= Math.floor(n / 2); c++) {
    const x = 540 + c * gap + (r % 2 ? gap / 2 : 0);
    if (r === ME.row && Math.abs(x - ME.x) < gap * 0.6) continue;
    const u = mk('use', { href: '#unitTop', x: -130, y: -150, width: 260, height: 230 }, '#rows');
    u.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + row.y.toFixed(1) + ') scale(' + row.s.toFixed(3) + ')');
    if (rnd() < 0.09) { const v = VARIANTS[Math.floor(rnd() * VARIANTS.length)]; u.setAttribute('style', '--top:' + v[0] + ';--front:' + v[1]); }
  }
});
// our Claude: front row centre, with a little plant on the desk
const meU = mk('use', { href: '#unitTop', x: -130, y: -150, width: 260, height: 230 }, '#rows');
const meS = ROWS[ME.row].s, meY = ROWS[ME.row].y;
meU.setAttribute('transform', 'translate(' + ME.x + ',' + meY.toFixed(1) + ') scale(' + meS.toFixed(3) + ')');
mk('rect', { x: ME.x - 92 * meS, y: meY - 30 * meS, width: 26 * meS, height: 24 * meS, fill: '#B9AEDD', stroke: '#1D1530', 'stroke-width': 3 }, '#rows');
mk('circle', { cx: ME.x - 79 * meS, cy: meY - 46 * meS, r: 20 * meS, fill: '#3FA66B', stroke: '#1D1530', 'stroke-width': 3 }, '#rows');
// hanging screens
const screen = function (x, y, w, h, title, col, big) {
  const g = mk('g', {}, '#screens');
  mk('line', { x1: x + 30, y1: -300, x2: x + 30, y2: y, stroke: '#1D1530', 'stroke-width': 4 }, g); mk('line', { x1: x + w - 30, y1: -300, x2: x + w - 30, y2: y, stroke: '#1D1530', 'stroke-width': 4 }, g);
  mk('rect', { x: x, y: y, width: w, height: h, rx: 14, fill: '#2A1640', stroke: '#1D1530', 'stroke-width': 7 }, g);
  mk('text', { x: x + 26, y: y + (big ? 62 : 46), 'font-family': 'Osw, sans-serif', 'font-weight': 700, 'font-size': big ? 44 : 30, 'letter-spacing': 3, fill: col }, g).textContent = title;
  return g;
};
const sA = screen(270, 160, 540, 230, 'ACTIVE SESSIONS', '#FFD27A', true);
mk('text', { id: 'nSess2', x: 296, y: 350, 'font-family': 'Out, sans-serif', 'font-weight': 900, 'font-size': 120, fill: '#FFF4D6', stroke: '#FF8A3D', 'stroke-width': 2 }, sA).textContent = '0';
const sB = screen(20, 60, 260, 170, 'TOKENS / SEC', '#7CF0FF');
mk('polyline', { id: 'tokLine', points: '40,200 80,190 110,196 140,170 170,176 200,150 230,156 260,120', fill: 'none', stroke: '#7CF0FF', 'stroke-width': 5 }, sB);
const sC = screen(800, 70, 260, 170, 'QUEUE DEPTH', '#FF8FB1');
mk('polyline', { id: 'qLine2', points: '820,210 860,206 890,196 920,200 950,180 980,170 1010,140 1040,110', fill: 'none', stroke: '#FF8FB1', 'stroke-width': 5 }, sC);
const sD = screen(330, -80, 220, 130, 'LATENCY', '#B6F09A');
mk('polyline', { points: '350,30 380,20 410,26 440,14 470,22 500,10 530,16', fill: 'none', stroke: '#B6F09A', 'stroke-width': 4 }, sD);
// floating requests (our own lines), some glowing
const REQ = ['center a div', 'make the logo bigger', 'does he love me?', 'fix my code pls', 'translate this to Albanian', 'write my CV',
  'what should I cook?', 'summarize this PDF', 'plan my trip to Sarandë', 'is prod down??', 'name my cat', 'explain taxes to me'];
const SPOTS = [[40, 470], [600, 470], [60, 700], [640, 640], [300, 840], [40, 980], [620, 900], [380, 1100], [700, 1180], [60, 1260], [420, 560], [260, 1380]];
const labs = [];
REQ.forEach(function (t, i) {
  const g = mk('g', { opacity: 0 }, '#labels'), p = SPOTS[i], w = 26 + t.length * 21, glow = i % 3 === 2;
  if (glow) mk('rect', { x: p[0] - 10, y: p[1] - 10, width: w + 20, height: 84, rx: 26, fill: '#FFFFFF', filter: 'url(#halo)', opacity: .9 }, g);
  mk('rect', { x: p[0], y: p[1], width: w, height: 64, rx: 18, fill: glow ? '#FFFFFF' : (i % 2 ? '#FF9A5C' : '#FFFFFF'), stroke: '#1D1530', 'stroke-width': 4 }, g);
  mk('text', { x: p[0] + 16, y: p[1] + 44, 'font-family': 'Out, sans-serif', 'font-weight': 800, 'font-size': 34, fill: '#1D1530' }, g).textContent = t;
  labs.push(g);
});
seed = 33;
for (let i = 0; i < 40; i++) {
  const d = mk('circle', { cx: rnd() * 1080, cy: 700 + rnd() * 1100, r: 5 + rnd() * 10, fill: ['#4CE3FF', '#FF5FA2', '#1D1530', '#FFE07A'][i % 4], opacity: 0 }, '#dots');
  const t = 2.8 + rnd() * 1.8;
  tl.set(d, { opacity: .9 }, t);
  tl.to(d, { y: -200 - rnd() * 200, duration: 1.4, ease: 'steps(14)' }, t);
  tl.to(d, { opacity: 0, duration: 0.08, ease: 'steps(1)' }, t + 1.4);
}

// ===== timeline =====
gsap.set('#world', { svgOrigin: '0 0' }); gsap.set('#r2cam', { svgOrigin: '0 0' });
// 1 · just our desk; Claude starts typing
tl.set('#world', { scale: 1.7, x: 540 - 1.7 * 540, y: 960 - 1.7 * 1300 }, 0);
gsap.set('#armL', { svgOrigin: '386 1290' }); gsap.set('#armR', { svgOrigin: '604 1290' });
tl.fromTo('#armL', { y: 0 }, { y: -10, duration: 0.17, yoyo: true, repeat: 15, ease: 'steps(1)', immediateRender: false }, 0.5);
tl.fromTo('#armR', { y: -10 }, { y: 0, duration: 0.17, yoyo: true, repeat: 15, ease: 'steps(1)', immediateRender: false }, 0.5);
tl.fromTo('#myEyes', { x: -8 }, { x: 8, duration: 0.25, yoyo: true, repeat: 7, ease: 'steps(1)', immediateRender: false }, 0.5);
const tap = div('#hud', 'top:300px;font-size:120px;transform:rotate(-5deg);', 'boom'); tap.textContent = 'TAP TAP TAP';
tl.set(tap, { opacity: 0 }, 0);
tl.fromTo(tap, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', immediateRender: false }, 0.55);
tl.to(tap, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 1.5);
// 2 · the thousands pop in (near → far) while we start pulling back
const maxD = Math.max.apply(null, units.map(function (u) { return u.d; }));
units.forEach(function (u) { tl.to(u.el, { opacity: 1, duration: 0.08, ease: 'steps(1)' }, 1.5 + 0.9 * (u.d / maxD)); });
tl.to('#world', { scale: 0.9, x: 540 - 0.9 * 540, y: 960 - 0.9 * 1100, duration: 1.2, ease: 'power2.in' }, 1.5);
// 3 · crane up: crossfade to the high view over the endless office, slow pull-back
tl.to('#world', { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 2.5);
tl.to('#room2', { opacity: 1, duration: 0.35, ease: 'power2.inOut' }, 2.5);
tl.set('#r2cam', { scale: 1.25, x: 540 - 1.25 * 540, y: 960 - 1.25 * 1200 }, 0);
tl.to('#r2cam', { scale: 1.0, x: 0, y: 0, duration: 2.4, ease: 'power2.out' }, 2.5);
count('#nSess2', 1024, 24576, 2.7, 2.2, fmt);
['#tokLine', '#qLine2'].forEach(function (s) { const el = $(s), L = 400; el.style.strokeDasharray = L; tl.set(el, { strokeDashoffset: L }, 0);
  tl.to(el, { strokeDashoffset: 0, duration: 1.8, ease: 'steps(14)' }, 2.8); });
labs.forEach(function (g, i) {
  const t = 2.9 + i * 0.14;
  tl.fromTo(g, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.17, ease: 'steps(2)', immediateRender: false }, t);
  tl.to(g, { y: -24, duration: 1.4, ease: 'steps(10)' }, t + 0.2);
});
// 4 · dive into our Claude (front row centre) → its screen
tl.to('#r2cam', { scale: 5, x: 540 - 5 * 575, y: 960 - 5 * (meY - 70 * meS), duration: 0.6, ease: 'power3.in' }, 5.0);

// ===== chat montage on Claude's screen =====
const back = div('#hud', '', 'chatback');
tl.set(back, { opacity: 0 }, 0);
tl.fromTo(back, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, 5.4);
const win = div('#hud', '', 'chatwin'); win.innerHTML = '<div class="chathead">Session #48,213</div><div class="chatcol" id="col"></div>';
tl.set(win, { opacity: 0 }, 0);
tl.fromTo(win, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, 5.45);
const MSGS = [['u', 'how do I center a div?'], ['c', 'display: flex;<br>place-items: center ✓'], ['u', 'make the logo bigger'], ['c', 'Bigger how?'], ['u', 'BIGGER.'],
  ['u', 'does my boyfriend love me?'], ['c', 'Tell me more… 🙂'], ['u', 'write a poem about my cat'], ['c', 'Whiskers at dawn… 🐈']];
MSGS.forEach(function (m, i) {
  const d = div('#col', '', 'msg ' + m[0]); d.innerHTML = m[1];
  tl.set(d, { opacity: 0 }, 0);
  tl.fromTo(d, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', transformOrigin: m[0] === 'u' ? '100% 50%' : '0% 50%', immediateRender: false }, 5.85 + i * 0.4);
});
tl.to('#col', { y: -760, duration: 2.2, ease: 'steps(10)' }, 7.2);
// ===== caption =====
const cap = div('#hud', 'top:150px;', 'capbox'); cap.textContent = '9:00 AM · work';
tl.set(cap, { opacity: 0 }, 0);
tl.fromTo(cap, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'steps(3)', immediateRender: false }, 0.2);
tl.to(cap, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 2.4);

// ===== prepend 2 s: Claude walks into the office building. Every beat above moves 2 s later (initial states stay at 0). =====
tl.getChildren(false, true, true).forEach(function (c) { if (c.startTime() > 0) c.startTime(c.startTime() + 2); });
for (let r = 0; r < 8; r++) for (let c = 0; c < 6; c++) mk('rect', { x: 150 + c * 136, y: 200 + r * 106, width: 110, height: 80, fill: '#E6E3FF', stroke: '#1D1530', 'stroke-width': 4, opacity: (r * 6 + c) % 4 ? .95 : .6 }, '#panes');
const wk = mk('g', { id: 'wk' }, '#walker');
mk('ellipse', { cx: 0, cy: 4, rx: 110, ry: 13, fill: '#1D1530', opacity: .3 }, wk);
[-74, -30, 14, 56].forEach(function (lx, i) { mk('rect', { id: 'wl' + i, x: lx, y: -44, width: 28, height: 46, rx: 5, fill: '#D9612B', stroke: '#1D1530', 'stroke-width': 5 }, wk); });
mk('polygon', { points: '-100,-270 -72,-298 128,-298 100,-270', fill: '#FFAA6B', stroke: '#1D1530', 'stroke-width': 5 }, wk);
mk('polygon', { points: '100,-270 128,-298 128,-70 100,-40', fill: '#D9612B', stroke: '#1D1530', 'stroke-width': 5 }, wk);
mk('rect', { x: -100, y: -270, width: 200, height: 230, fill: '#F5873A', stroke: '#1D1530', 'stroke-width': 5 }, wk);
mk('rect', { x: -54, y: -224, width: 24, height: 48, fill: '#15131A' }, wk); mk('rect', { x: 30, y: -224, width: 24, height: 48, fill: '#15131A' }, wk);
tl.set('#wk', { x: -220, y: 1620 }, 0);
tl.to('#wk', { x: 540, duration: 1.1, ease: twos(1.1) }, 0.1);
['#wl0', '#wl2'].forEach(function (l) { gsap.set(l, { svgOrigin: (+$(l).getAttribute('x') + 14) + ' -44' }); tl.fromTo(l, { rotation: -22 }, { rotation: 22, duration: 0.22, yoyo: true, repeat: 4, ease: 'steps(3)', immediateRender: false }, 0.1); });
['#wl1', '#wl3'].forEach(function (l) { gsap.set(l, { svgOrigin: (+$(l).getAttribute('x') + 14) + ' -44' }); tl.fromTo(l, { rotation: 22 }, { rotation: -22, duration: 0.22, yoyo: true, repeat: 4, ease: 'steps(3)', immediateRender: false }, 0.1); });
tl.to('#doorL', { x: -150, duration: 0.25, ease: 'steps(3)' }, 0.9);
tl.to('#doorR', { x: 150, duration: 0.25, ease: 'steps(3)' }, 0.9);
tl.to('#wk', { y: 1560, scale: 0.8, duration: 0.4, ease: 'steps(5)' }, 1.25);
tl.to('#wk', { opacity: 0, duration: 0.08, ease: 'steps(1)' }, 1.65);
tl.to(['#doorL', '#doorR'], { x: 0, duration: 0.25, ease: 'steps(3)' }, 1.7);
tl.to('#ext6', { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 1.85);
const cap0 = div('#hud', 'top:150px;', 'capbox'); cap0.textContent = '9:00 AM · work';
tl.set(cap0, { opacity: 0 }, 0);
tl.fromTo(cap0, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'steps(3)', immediateRender: false }, 0.15);
tl.to(cap0, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 1.9);
