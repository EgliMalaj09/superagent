// ===== TIRANA NDALON: one map, one camera. World coords = pixels of media/start-map.png (1284×970). =====
// Placeholder timing (~50 s); remap([[old,new],…]) to the voice-over once it is recorded.
const NS = 'http://www.w3.org/2000/svg';
const svg = $('#world');
const g = function (parent, attrs) { const e = document.createElementNS(NS, 'g'); for (const k in (attrs || {})) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
const el = function (parent, tag, attrs) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
const pd = function (pts) { return 'M' + pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' L'); };

// camera: put world point (x, y) at screen centre (540, cy) with zoom s
const cam = function (x, y, s, t, dur, ease, cy) {
  const v = { x: 540 - s * x, y: (cy || 960) - s * y, scale: s };
  if (!dur) tl.set('#cam', v, t); else tl.to('#cam', Object.assign(v, { duration: dur, ease: ease || 'power2.inOut' }), t);
};

// ---------- ground ----------
el(svg, 'rect', { x: -9000, y: -6000, width: 18000, height: 14000, fill: '#1c3b33' });                     // green land
el(svg, 'rect', { x: -9000, y: -6000, width: 5650, height: 14000, fill: '#123049' });                      // the Adriatic, west of Durrës
el(svg, 'path', { d: 'M-3350,-6000 C-3250,-1000 -3550,400 -3250,1100 C-3050,1600 -3350,3000 -3350,8000', fill: 'none', stroke: '#2a5a78', 'stroke-width': 30 });
el(svg, 'path', { d: 'M0,330 L150,250 L250,120 L600,200 L1000,120 L1284,100 L1300,800 L1100,780 L950,820 L820,840 L700,900 L500,880 L300,900 L100,900 L0,750 Z', fill: '#262d3d' });  // the city
el(svg, 'path', { d: 'M-3300,700 C-3150,560 -2850,640 -2780,860 C-2720,1060 -3050,1180 -3300,1060 Z', fill: '#262d3d' });                                                   // Durrës
el(svg, 'path', { d: 'M790,850 C830,820 880,840 875,900 C870,960 850,1010 810,1000 C790,960 770,900 790,850 Z', fill: '#1e3f8a' });                                       // the lake
el(svg, 'path', { d: 'M880,800 L1284,780 L1284,1000 L900,1000 Z', fill: '#1f5a45', opacity: .7 });                                                                        // the big park

// minor streets: a seeded scatter of short grey segments inside the city
const minor = g(svg, { stroke: '#3a4256', 'stroke-width': 3, 'stroke-linecap': 'round' });
for (let i = 0; i < 260; i++) {
  const x = 60 + rnd() * 1200, y = 160 + rnd() * 700, a = rnd() * Math.PI, l = 30 + rnd() * 70;
  el(minor, 'line', { x1: x, y1: y, x2: x + Math.cos(a) * l, y2: y + Math.sin(a) * l });
}

// ---------- roads (traced from the screenshot) ----------
const ROADS = [
  [[-3000, 900], [-1500, 600], [-400, 300], [0, 180], [110, 235], [300, 320], [450, 385], [560, 425], [690, 490], [840, 560]],   // SH2 → Durrës
  [[470, 240], [480, 280], [460, 340], [440, 390], [415, 470], [420, 540], [450, 600], [480, 680]],                               // north road
  [[160, 395], [230, 460], [260, 500]],
  [[240, 400], [300, 460], [390, 540], [440, 580]],
  [[200, 820], [330, 760], [400, 720], [470, 690], [520, 680], [600, 650], [700, 615], [780, 600], [840, 600]],                    // SH56
  [[480, 680], [520, 730], [580, 780], [640, 830], [720, 860], [780, 900], [820, 960]],                                           // south
  [[950, 640], [970, 720], [1050, 780], [1080, 830], [1120, 920]],                                                                // east arc
  [[1000, 370], [1060, 330], [1150, 280], [1240, 240]],
  [[1000, 560], [1080, 520], [1160, 480], [1270, 460]],
  [[640, 175], [760, 170], [900, 165], [1020, 160], [1200, 150], [1270, 130]],                                                    // Paskuqan ring
  [[690, 480], [760, 460], [850, 450]],
  [[700, 520], [680, 560], [660, 620], [680, 690], [720, 730], [800, 760], [880, 740]],                                           // inner ring
  [[940, 390], [1000, 380], [1020, 400]],
  [[1050, 480], [1060, 560], [1080, 580]],
  [[290, 615], [330, 600], [420, 570]],
  [[290, 620], [330, 660], [400, 690], [420, 720]],
  [[350, 210], [380, 250], [410, 280], [440, 295]],
  [[720, 170], [730, 240], [790, 250], [790, 280]],
  [[760, 880], [800, 920], [860, 960], [960, 990]],
  [[850, 450], [850, 560], [880, 640], [950, 640]],
];
const base = g(svg, { fill: 'none', stroke: '#6b7486', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
ROADS.forEach(function (r) { el(base, 'path', { d: pd(r) }); });

// traffic: red + yellow dashes that crawl (almost stopped); a glow layer thickens it on "+9%"
const glow = g(svg, { fill: 'none', stroke: '#E8453C', 'stroke-width': 26, 'stroke-linecap': 'round', opacity: 0 });
const traffic = g(svg, { fill: 'none', 'stroke-width': 10, 'stroke-linecap': 'butt', 'stroke-linejoin': 'round' });
const calm = g(svg, { fill: 'none', stroke: '#7FC4FF', 'stroke-width': 8, 'stroke-linecap': 'round', opacity: 0 });
ROADS.slice(1).forEach(function (r) {
  el(glow, 'path', { d: pd(r) });
  el(traffic, 'path', { d: pd(r), stroke: '#E8453C', 'stroke-dasharray': '46 10', class: 'crawl' });
  const yl = el(traffic, 'path', { d: pd(r), stroke: '#F5B82E', 'stroke-dasharray': (60 + Math.round(rnd() * 80)) + ' ' + (90 + Math.round(rnd() * 160)), class: 'crawl2' });
  yl.style.strokeDashoffset = Math.round(rnd() * 200);
  el(calm, 'path', { d: pd(r) });
});
tl.fromTo('.crawl', { strokeDashoffset: 0 }, { strokeDashoffset: -170, duration: 50, ease: 'none', immediateRender: true }, 0);
tl.to('.crawl2', { strokeDashoffset: '-=120', duration: 50, ease: 'none' }, 0);

// bus lane (scene 5) + bus
const lane = el(svg, 'path', { id: 'lane', d: pd(ROADS[4]), fill: 'none', stroke: '#3DDC84', 'stroke-width': 16, 'stroke-linecap': 'round' });
const bus = g(svg, { id: 'bus', opacity: 0 });
el(bus, 'rect', { x: -26, y: -11, width: 52, height: 22, rx: 5, fill: '#F4F1EA', stroke: '#3DDC84', 'stroke-width': 4 });
el(bus, 'rect', { x: 12, y: -7, width: 9, height: 14, fill: '#3DDC84' });

// one stuck car (scene 4) on the north road
const car = g(svg, { id: 'car', transform: 'translate(424,520) rotate(84)', opacity: 0 });
el(car, 'rect', { x: -15, y: -8, width: 30, height: 16, rx: 4, fill: '#F4F1EA' });
el(car, 'rect', { x: -16, y: -7, width: 4, height: 4, fill: '#E8453C' }); el(car, 'rect', { x: -16, y: 3, width: 4, height: 4, fill: '#E8453C' });

// plan grid (scene 6)
const grid = g(svg, { id: 'grid', stroke: 'rgba(127,196,255,.22)', 'stroke-width': 2, opacity: 0 });
for (let x = -200; x <= 1500; x += 100) el(grid, 'line', { x1: x, y1: -100, x2: x, y2: 1100 });
for (let y = -100; y <= 1100; y += 100) el(grid, 'line', { x1: -200, y1: y, x2: 1500, y2: y });

// tram (scene 7): dots that stop halfway
const TRAM = [[60, 560], [400, 590], [700, 600], [1000, 600], [1260, 560]];
const tramPath = el(svg, 'path', { d: pd(TRAM), fill: 'none', stroke: 'none' });
const tramG = g(svg, { id: 'tram' }); const tramDots = [];
const TL = tramPath.getTotalLength();
for (let i = 0; i <= 40; i++) { const p = tramPath.getPointAtLength(TL * i / 40); tramDots.push(el(tramG, 'circle', { cx: p.x, cy: p.y, r: 12, fill: '#F4F1EA', opacity: 0 })); }

// train (scene 8)
const TRAIN = [[520, 410], [300, 330], [-400, 330], [-1500, 640], [-2400, 840], [-2950, 880]];
const train = el(svg, 'path', { id: 'train', d: pd(TRAIN), fill: 'none', stroke: '#F5B82E', 'stroke-width': 40, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0 });

// map labels (sized for the zoom they are seen at)
const lab = function (id, x, y, size, text) { const d = div('#pins', 'left:' + x + 'px;top:' + y + 'px;font-size:' + size + 'px;opacity:0;', 'mlab'); d.id = id; d.textContent = text; return d; };
lab('lTir', 250, 120, 210, 'TIRANË'); lab('lDur', -2700, 540, 210, 'DURRËS');

// rain (screen space, scene 1)
for (let i = 0; i < 110; i++) {
  const d = div('#rain', 'left:' + Math.round(rnd() * 1120 - 20) + 'px;', 'raindrop');
  const sp = 0.45 + rnd() * 0.3;
  tl.fromTo(d, { y: -120 - rnd() * 400 }, { y: 2000, duration: sp, ease: 'none', repeat: Math.ceil(6 / sp), immediateRender: true }, rnd() * 0.5);
}
fadeOut('#rain', 4.6, 0.8);

// ================= TIMELINE =================
// tag blocks: show the block, rise its lines one by one, fade it out
const blk = function (id, t, tEnd, gap) { show(id, t); $(id).querySelectorAll('.tag').forEach(function (c, i) { up(c, t + i * (gap || 0.9), 0.45); }); if (tEnd) fadeOut(id, tEnd, 0.35); };
const strike = function (sel, t) { tl.fromTo(sel, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'power2.out', immediateRender: false }, t); };

// 1 · hook: the real screenshot, rain, slow push
cam(640, 470, 2.05, 0, 0);
cam(560, 520, 2.3, 0, 4.6, 'none');
tl.set('#b1', { opacity: 1 }, 0); up('#b1a', 0.25); up('#b1b', 1.2); up('#b1c', 2.3); fadeOut('#b1', 4.3, 0.35);
// 2 · handoff: the screenshot dissolves into our map (same framing)
fadeOut('#shot', 3.9, 1.0);
cam(640, 520, 1.3, 4.6, 2.2, 'power3.inOut', 1150);

// 3 · numbers
show('#b2', 5.4); up('#b2a', 5.4); fadeOut('#b2', 12.3);
up('#b2b', 5.7); count('#cnt', 0, 1000000, 5.5, 1.6);
up('#b2c', 8.0); fadeIn('#ring', 7.9, 0.4); fadeIn('#ringtx', 8.1, 0.4);
tl.fromTo('#rarc', { strokeDasharray: '1885 1885', strokeDashoffset: 1885 }, { strokeDashoffset: 1885 * 0.65, duration: 1.0, ease: 'power3.out', immediateRender: true }, 8.0);
up('#b2d', 10.2); tl.to(glow, { opacity: 0.35, duration: 1.2, ease: 'power2.out' }, 10.2);
fadeOut('#ring', 12.1); fadeOut('#ringtx', 12.1);

// 4 · one driver: push onto a stuck car
cam(424, 520, 3.2, 12.2, 1.6, 'power3.inOut', 760);
fadeIn(car, 12.8, 0.4);
blk('#b3', 12.9, 19.2);
fadeIn('#clock', 13.3); count('#hrs', 0, 185, 13.4, 1.8);
tl.fromTo('#hand', { rotation: 0 }, { rotation: 1080, svgOrigin: '110 110', duration: 1.8, ease: 'power2.out', immediateRender: true }, 13.4);
pop('#days', 15.6);
fadeIn('#fuel', 16.7); count('#lit', 0, 200, 16.8, 1.4);
tl.fromTo('#fbar', { scaleX: 1 }, { scaleX: 0.08, duration: 1.4, ease: 'power2.out', immediateRender: true }, 16.8);
fadeOut('#clock,#days,#fuel', 19.1);

// 5 · imagine: the city calms down
cam(560, 640, 1.25, 19.2, 1.8, 'power3.inOut', 1150);
tl.to(traffic, { opacity: 0, duration: 1.0, ease: 'power2.inOut' }, 19.5); tl.to(glow, { opacity: 0, duration: 1.0 }, 19.5);
tl.to(calm, { opacity: 0.55, duration: 1.0, ease: 'power2.inOut' }, 19.6); fadeOut(car, 19.4);
blk('#b4', 19.5, 23.3, 1.3);
draw(lane, 20.6, 1.4);
tl.set(lane, { opacity: 0 }, 0); tl.set(lane, { opacity: 1 }, 20.6);
const LL = lane.getTotalLength(), bo = { v: 0 };
fadeIn(bus, 21.3, 0.3);
tl.fromTo(bo, { v: 0 }, { v: 1, duration: 3.2, ease: 'power1.inOut', immediateRender: true, onUpdate: function () {
  const p = lane.getPointAtLength(bo.v * LL), q = lane.getPointAtLength(Math.min(LL, bo.v * LL + 2));
  bus.setAttribute('transform', 'translate(' + p.x + ',' + p.y + ') rotate(' + Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI + ')'); } }, 21.3);
blk('#b5', 23.6, 26.1); pop('#park', 23.8); strike('#pstr', 24.8); fadeOut('#park', 26.0);
blk('#b6', 26.3, 29.1); up('#cmp', 26.5); strike('#c90s', 27.6); tl.to('#c90', { opacity: 0.45, duration: 0.4 }, 27.9); fadeOut('#cmp', 29.0);
blk('#b7', 29.3, 32.2, 1.0); fadeIn('#house', 29.4, 0.45);
tl.fromTo('#win', { opacity: 0.15 }, { opacity: 1, duration: 0.8, ease: 'power2.out', immediateRender: true }, 30.0); fadeIn('#glow', 30.0, 0.8);
fadeOut('#house,#glow', 32.1);

// 6 · it's planning
cam(640, 520, 1.15, 32.0, 2.0, 'power2.inOut', 1150);
tl.to(grid, { opacity: 1, duration: 1.0 }, 32.5); fadeOut(bus, 32.2); tl.to(lane, { opacity: 0.5, duration: 0.6 }, 32.4);
blk('#b8', 32.5, 35.6, 1.2);

// 7 · the tram that never came
blk('#b9', 35.8, 38.9, 1.3);
tramDots.forEach(function (d, i) { if (i <= 20) tl.fromTo(d, { opacity: 0 }, { opacity: 1, duration: 0.12, immediateRender: false }, 36.0 + i * 0.065); });
tl.to(tramDots.slice(0, 21), { opacity: 0.2, duration: 0.8, ease: 'power2.inOut' }, 38.0);
tl.to(grid, { opacity: 0, duration: 0.6 }, 38.4);

// 8 · the train: glide west to Durrës
cam(-1250, 600, 0.24, 38.8, 2.0, 'power3.inOut', 1020);
tl.to(tramG, { opacity: 0, duration: 0.5 }, 38.8); tl.to(lane, { opacity: 0, duration: 0.5 }, 38.8);
blk('#b10', 39.6, 45.3, 1.2);
tl.set(train, { opacity: 1 }, 40.0); draw(train, 40.0, 1.8);
fadeIn('#lTir', 40.0); fadeIn('#lDur', 41.6);
show('#tline', 0); hide('#t1', 0); hide('#t2', 0); hide('#t3', 0);
up('#t1', 42.0); strike('#t1s', 42.8); up('#t2', 43.1); strike('#t2s', 43.7); up('#t3', 44.2);
fadeOut('#tline', 45.2); fadeOut('#lTir,#lDur', 45.2); tl.to(train, { opacity: 0, duration: 0.6 }, 45.3);

// 9 · back to the red city
cam(620, 520, 1.3, 45.3, 2.2, 'power3.inOut', 1180);
tl.to(calm, { opacity: 0, duration: 1.0 }, 45.6);
tl.to(traffic, { opacity: 1, duration: 1.0 }, 45.6); tl.to(glow, { opacity: 0.4, duration: 1.4 }, 45.8);
blk('#b11', 45.8, null, 1.4);
cam(620, 520, 1.2, 47.6, 2.4, 'none', 1180);
