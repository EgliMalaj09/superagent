// ===== SA VJET PËR NJË SHTËPI · premium pass: isometric night city + frosted-glass cards + fine charts (60 fps) =====
// Placeholder timing (≈61 s); retime to the voice-over when it arrives.
const de = function (v) { return Math.round(v).toLocaleString('de-DE'); };
const fin = function (sel, t, d) { tl.fromTo(sel, { opacity: 0, y: 24, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: d || 0.9, ease: 'power2.out', immediateRender: false }, t); };
const fout = function (sel, t, d) { tl.to(sel, { opacity: 0, filter: 'blur(10px)', duration: d || 0.6, ease: 'power2.inOut' }, t); };
const cardIn = function (sel, t) { tl.fromTo(sel, { opacity: 0, scale: 1.06, filter: 'blur(14px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power2.inOut', immediateRender: false }, t); };
const cardOut = function (sel, t) { tl.to(sel, { opacity: 0, scale: 0.97, filter: 'blur(12px)', duration: 0.8, ease: 'power2.inOut' }, t); };
const dive = function (t, d) { tl.to('#bg', { filter: 'blur(7px)', duration: (d || 0.8) * 0.6, ease: 'power2.in' }, t); tl.to('#bg', { filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' }, t + (d || 0.8) * 0.6); };   // motion blur on dives
const show1 = function (b, t) { tl.fromTo(b, { scale: 0.001 }, { scale: 1, duration: 0.7, ease: 'power3.out', immediateRender: false }, t); };           // soft, no overshoot
const hide1 = function (b, t) { tl.to(b, { scale: 0.001, duration: 0.5, ease: 'power2.in' }, t); };
const glow2 = function (x, y, r, a) { return 'background:radial-gradient(circle, rgba(232,190,120,' + a + '), rgba(232,190,120,0) 70%);'; };

// ---------- the world ----------
const WT = 3600, scrW = isoScreen(WT, WT);
const w = world('w', 'tilt', WT, WT);
div(w, 'left:-3000px;top:-3000px;width:' + (WT + 6000) + 'px;height:' + (WT + 6000) + 'px;background:#141B2C;', 'bx');
const G = layer(w, 1);
const ROADS = [700, 1450, 2250, 3000];
ROADS.forEach(function (k) {
  div(G, 'left:-600px;top:' + (k - 70) + 'px;width:' + (WT + 1200) + 'px;height:140px;background:#222B3E;', 'bx');
  div(G, 'left:' + (k - 70) + 'px;top:-600px;width:140px;height:' + (WT + 1200) + 'px;background:#222B3E;', 'bx');
  div(G, 'left:-600px;top:' + (k - 2) + 'px;width:' + (WT + 1200) + 'px;height:4px;background:repeating-linear-gradient(90deg,rgba(243,237,225,.25) 0 30px,transparent 30px 70px);', 'bx');
});
const AX = 1560, AY = 1560, AW = 400, AD = 320, CX = AX + 200, CY = AY + 160;
const BP = [['#3e4865', '#2f3852', '#242b40'], ['#475273', '#363f5a', '#2a3147'], ['#4d4763', '#3c3750', '#2e2a3d']];
const winBoxes = [];
for (let i = -1; i < 5; i++) for (let j = -1; j < 5; j++) {
  const x = i * 750 + 70, y = j * 750 + 70;
  if (Math.abs(x - AX) < 500 && Math.abs(y - AY) < 500) continue;
  const front = (x + y) > (AX + AY) - 300 && Math.abs(x - AX) < 1300 && Math.abs(y - AY) < 1300;
  const near = (x + y) > (AX + AY) - 900 && Math.abs(x - AX) < 900 && Math.abs(y - AY) < 900;
  const h = Math.round(near ? 50 + rnd() * 30 : front ? 120 + rnd() * 120 : 220 + rnd() * 420), p = BP[Math.floor(rnd() * 3)], sz = 420 + rnd() * 80;
  div(G, 'left:' + (x + 30) + 'px;top:' + (y + 40) + 'px;width:' + sz + 'px;height:' + (sz * 0.8) + 'px;background:rgba(0,0,0,.45);filter:blur(22px);', 'bx');     // contact shadow
  const b = box(G, { x: x, y: y, w: sz, d: sz * 0.8, h: h, top: p[0], s1: p[1], s2: p[2], win: true });
  const nW = Math.round(h / 45);
  for (let k = 0; k < nW; k++) { const lw = layer(b.r, 30 + rnd() * (h - 60));
    const wb = rnd() < 0.5 ? box(lw, { x: rnd() * (sz - 40), y: sz * 0.8 - 2, w: 24, d: 3, h: 16, top: '#E8C98A', s1: '#E8C98A', s2: '#c9a45c' })
                         : box(lw, { x: sz - 2, y: rnd() * (sz * 0.8 - 40), w: 3, d: 24, h: 16, top: '#E8C98A', s1: '#c9a45c', s2: '#E8C98A' });
    winBoxes.push(wb.r); }
}
// street life: lamps with a warm pool of light, trees, cars with headlights
ROADS.forEach(function (k, ri) {
  for (let s = -300; s < WT + 300; s += 420) {
    const lx = s + (ri % 2) * 210, ly = k - 86;
    div(G, 'left:' + (lx - 70) + 'px;top:' + (ly - 50) + 'px;width:140px;height:140px;border-radius:50%;' + glow2(0, 0, 0, .35), 'bx');
    const pole = div(layer(G, 0), 'left:' + lx + 'px;top:' + ly + 'px;width:0;height:0;', 'bx');
    box(pole, { x: -2, y: -2, w: 4, d: 4, h: 70, top: '#1c2232', s1: '#2a3246', s2: '#1c2232' });
    box(layer(pole, 70), { x: -6, y: -6, w: 12, d: 12, h: 6, top: '#F6DFA8', s1: '#E8C98A', s2: '#c9a45c' });
  }
});
const tree2 = function (x, y, s) { const r = div(layer(G, 0), 'left:' + x + 'px;top:' + y + 'px;width:0;height:0;', 'bx');
  box(r, { x: -3 * s, y: -3 * s, w: 6 * s, d: 6 * s, h: 14 * s, top: '#3a2c22', s1: '#33271e', s2: '#281e17' });
  box(layer(r, 12 * s), { x: -14 * s, y: -14 * s, w: 28 * s, d: 28 * s, h: 24 * s, top: '#27463c', s1: '#1f3a31', s2: '#182e27' }); };
for (let k = 0; k < 40; k++) { const k2 = ROADS[k % 4], along = (k * 397) % (WT + 400) - 200; if (Math.abs(along - CX) < 420 && Math.abs(k2 - CY) < 900) continue; tree2(along, k2 + 92 + (k % 3) * 6, 1.1); }
const cars = [];
for (let k = 0; k < 16; k++) {
  const horiz = k % 2 === 0, road = ROADS[(k >> 1) % 4], lane = (k % 4 < 2) ? -32 : 32, dir = lane < 0 ? 1 : -1;
  const cr = div(layer(G, 0), 'left:0;top:0;width:0;height:0;', 'bx');
  const col = ['#8C93A8', '#A8423A', '#D8D4CC', '#2E3A5C'][k % 4];
  if (horiz) { box(cr, { x: -26, y: road + lane - 12, w: 52, d: 24, h: 18, top: col, s1: col, s2: '#1a1f2c' }); box(layer(cr, 6), { x: dir > 0 ? 26 : -30, y: road + lane - 10, w: 4, d: 20, h: 6, top: '#FFF2C8', s1: '#FFF2C8', s2: '#FFF2C8' }); }
  else { box(cr, { x: road + lane - 12, y: -26, w: 24, d: 52, h: 18, top: col, s1: '#1a1f2c', s2: col }); box(layer(cr, 6), { x: road + lane - 10, y: dir > 0 ? 26 : -30, w: 20, d: 4, h: 6, top: '#FFF2C8', s1: '#FFF2C8', s2: '#FFF2C8' }); }
  const start = rnd() * WT, dist = 1400 + rnd() * 1200;
  if (horiz) tl.fromTo(cr, { x: start }, { x: start + dir * dist, duration: 61, ease: 'none', immediateRender: true }, 0);
  else tl.fromTo(cr, { y: start }, { y: start + dir * dist, duration: 61, ease: 'none', immediateRender: true }, 0);
  cars.push(cr);
}
// windows that switch on and off slowly
for (let k = 0; k < 24; k++) { const wb = winBoxes[(k * 7) % winBoxes.length], t0 = 2 + rnd() * 50;
  tl.to(wb, { opacity: 0.12, duration: 1.2, ease: 'power1.inOut' }, t0); tl.to(wb, { opacity: 1, duration: 1.2, ease: 'power1.inOut' }, t0 + 4 + rnd() * 6); }

// ---------- the apartment ----------
div(G, 'left:' + (AX + 10) + 'px;top:' + (AY + 30) + 'px;width:' + (AW + 40) + 'px;height:' + (AD + 40) + 'px;background:rgba(0,0,0,.5);filter:blur(20px);', 'bx');
box(G, { x: AX - 20, y: AY - 20, w: AW + 40, d: AD + 40, h: 24, top: '#333C52', s1: '#262e41', s2: '#1d2333' });
const F = layer(G, 24);
div(F, 'left:' + AX + 'px;top:' + AY + 'px;width:' + AW + 'px;height:' + AD + 'px;background:#262E42;', 'bx');
const tiles = [], bathTiles = [];
for (let ry = 0; ry < 8; ry++) for (let cx = 0; cx < 10; cx++) {
  if (cx < 3 && ry >= 5) continue;
  const d = div(F, 'left:' + (AX + cx * 40 + 2) + 'px;top:' + (AY + ry * 40 + 2) + 'px;width:36px;height:36px;background:linear-gradient(135deg,#D3AE7C,#B88E5E);box-shadow:inset 0 0 0 1px rgba(0,0,0,.18);', 'bx');
  tiles.push({ el: d, ord: (7 - ry) * 10 + cx });
}
tiles.sort(function (a, b) { return a.ord - b.ord; });
for (let k = 0; k < 12; k++) { const cx = k % 4, ry = Math.floor(k / 4);
  bathTiles.push(div(F, 'left:' + (AX + cx * 30 + 1) + 'px;top:' + (AY + 200 + ry * 40 + 1) + 'px;width:28px;height:38px;background:linear-gradient(135deg,#F2F4F6,#D8DEE4);box-shadow:inset 0 0 0 1px rgba(0,0,0,.12);', 'bx')); }
const roomLight = div(F, 'left:' + (AX - 40) + 'px;top:' + (AY - 40) + 'px;width:' + (AW + 80) + 'px;height:' + (AD + 80) + 'px;background:radial-gradient(ellipse at 55% 55%, rgba(255,205,140,.32), rgba(255,205,140,0) 65%);', 'bx');
const wall = function (x, y, ww, dd) { box(F, { x: x, y: y, w: ww, d: dd, h: 64, top: '#EFE8DA', s1: '#D6CDBB', s2: '#BEB4A1' }); };
wall(AX, AY, AW, 8); wall(AX, AY, 8, AD); wall(AX + 240, AY, 8, 180); wall(AX + 240, AY + 170, 160, 8); wall(AX, AY + 192, 120, 8); wall(AX + 120, AY + 192, 8, 70);
const tub = box(F, { x: AX + 12, y: AY + 214, w: 92, d: 40, h: 22, top: '#F7F7F7', s1: '#e2e2e2', s2: '#cdcdcd' });
const sink = box(F, { x: AX + 18, y: AY + 280, w: 30, d: 24, h: 34, top: '#F7F7F7', s1: '#e2e2e2', s2: '#cdcdcd' });
const MX = AX + 280, MY = AY + 220;
const one = div(layer(F, 1), 'left:' + (MX - 20) + 'px;top:' + (MY - 20) + 'px;width:40px;height:40px;border:2px dashed rgba(243,237,225,.8);', 'bx');
const spot = div(layer(F, 0.5), 'left:' + (MX - 90) + 'px;top:' + (MY - 90) + 'px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle, rgba(255,214,150,.55), rgba(255,214,150,0) 70%);', 'bx');
const bathSpot = div(layer(F, 0.5), 'left:' + (AX - 30) + 'px;top:' + (AY + 170) + 'px;width:190px;height:190px;border-radius:50%;background:radial-gradient(circle, rgba(255,214,150,.6), rgba(255,214,150,0) 70%);', 'bx');
const floorEdge = div(layer(F, 0.4), 'left:' + AX + 'px;top:' + AY + 'px;width:' + AW + 'px;height:' + AD + 'px;box-shadow:inset 0 0 0 3px rgba(232,201,138,.55);', 'bx');
const mat = box(layer(F, 1), { x: MX - 16, y: MY - 10, w: 32, d: 20, h: 3, top: '#6b543a', s1: '#4a3a29', s2: '#3a2d20' });
// furniture that arrives as they save
const furn = [];
const fb = function (o) { const r = div(layer(F, 1), 'left:0;top:0;width:0;height:0;', 'bx'); box(r, o); return r; };
const sofa = div(layer(F, 1), 'left:0;top:0;width:0;height:0;', 'bx');
box(sofa, { x: AX + 40, y: AY + 70, w: 130, d: 44, h: 18, top: '#4C5C8A', s1: '#3e4c74', s2: '#33405f' });
box(sofa, { x: AX + 40, y: AY + 60, w: 130, d: 12, h: 38, top: '#56679A', s1: '#46557f', s2: '#3a4669' });
const bed = div(layer(F, 1), 'left:0;top:0;width:0;height:0;', 'bx');
box(bed, { x: AX + 270, y: AY + 30, w: 104, d: 96, h: 16, top: '#F1EBDF', s1: '#d9d1c2', s2: '#c4bcad' });
box(layer(bed, 16), { x: AX + 278, y: AY + 36, w: 88, d: 18, h: 6, top: '#FFFFFF', s1: '#eee', s2: '#ddd' });
box(layer(bed, 16), { x: AX + 270, y: AY + 70, w: 104, d: 56, h: 3, top: '#C9A45C', s1: '#b08e4c', s2: '#9a7b40' });
const table = div(layer(F, 1), 'left:0;top:0;width:0;height:0;', 'bx');
box(table, { x: AX + 150, y: AY + 236, w: 60, d: 40, h: 26, top: '#9A6F45', s1: '#7d5a38', s2: '#68492d' });
box(table, { x: AX + 160, y: AY + 280, w: 16, d: 14, h: 18, top: '#7d5a38', s1: '#68492d', s2: '#573c25' });
box(table, { x: AX + 186, y: AY + 280, w: 16, d: 14, h: 18, top: '#7d5a38', s1: '#68492d', s2: '#573c25' });
furn.push(sofa, bed, table);
// the couple (hair turns grey) + their shadow
const P = layer(F, 2); const hair = [];
div(F, 'left:' + (AX + 290) + 'px;top:' + (AY + 252) + 'px;width:60px;height:36px;border-radius:50%;background:rgba(0,0,0,.4);filter:blur(6px);', 'bx');
const human = function (x, y, col) {
  const r = div(P, 'left:' + x + 'px;top:' + y + 'px;width:0;height:0;', 'bx');
  box(r, { x: -9, y: -6, w: 18, d: 12, h: 52, top: col, s1: col, s2: '#141210' });
  box(layer(r, 53), { x: -5, y: -5, w: 10, d: 10, h: 10, top: '#E9B994', s1: '#D9A47E', s2: '#C48E69' });
  const hb = box(layer(r, 63), { x: -6, y: -6, w: 12, d: 12, h: 4, top: '#2a1f17', s1: '#2a1f17', s2: '#1f1711' });
  hair.push(hb.t); hb.ns.concat(hb.we).forEach(function (e) { hair.push(e); });
};
human(AX + 300, AY + 250, '#4A6A9C'); human(AX + 332, AY + 268, '#B08A5E');
// billboards
const calL = label(F, AX + 200, AY + 6, 130, '<div class="ilab" style="font-size:30px;">VITI <span id="calY">2026</span></div>');
const ageL = label(F, AX + 316, AY + 258, 112, '<div class="ilab w" style="font-size:26px;"><span id="ageN">25</span> VJEÇ</div>');
const keyL = label(F, AX + 316, AY + 262, 98, '<svg width="120" height="48" viewBox="0 0 300 120"><defs><linearGradient id="kg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF1C8"/><stop offset=".5" stop-color="#E8C98A"/><stop offset="1" stop-color="#9C7A3C"/></linearGradient></defs><g fill="url(#kg2)"><path d="M60 14 A46 46 0 1 0 60 106 A46 46 0 1 0 60 14 Z M60 44 A16 16 0 1 1 60 76 A16 16 0 1 1 60 44 Z" fill-rule="evenodd"/><rect x="100" y="51" width="180" height="18" rx="6"/><rect x="236" y="69" width="16" height="30" rx="3"/><rect x="262" y="69" width="16" height="22" rx="3"/></g></svg>');
tl.set(keyL, { scale: 0.001 }, 0);
const priceL = label(F, AX + 200, AY + 160, 190, '<div class="ilab" style="font-size:40px;">171.000 €</div>');
const m80 = label(F, AX + 60, AY + AD - 20, 30, '<div class="ilab w" style="font-size:24px;">80 m²</div>');
const m041 = label(F, MX - 10, MY - 30, 90, '<div class="ilab" style="font-size:26px;">0,41 m²</div>');
const m49 = label(F, AX + 60, AY + 260, 90, '<div class="ilab" style="font-size:26px;">4,9 m²</div>');
[calL, ageL, priceL, m041, m49].forEach(function (b) { tl.set(b, { scale: 0.001 }, 0); });
tl.set(tiles.map(function (t) { return t.el; }).concat(bathTiles), { scale: 0, transformOrigin: '50% 50%' }, 0);
tl.set([tub.r, sink.r].concat(furn), { scale: 0.001, transformOrigin: '50% 50%' }, 0);
tl.set(mat.r, { z: 300, opacity: 0 }, 0);
tl.set(roomLight, { opacity: 0.35 }, 0);
tl.set([one, spot, bathSpot, floorEdge], { opacity: 0 }, 0); tl.set(m80, { scale: 0.001 }, 0);

// ---------- ambience: the camera never stops, grain moves ----------
const BBS = [calL, ageL, m041, m80, m49, keyL, priceL];
const view = function (t, spin, tilt, d, ease) { const e = ease || 'power2.inOut';
  tl.to(w, { rotation: spin, duration: d, ease: e }, t); tl.to('#tilt', { rotationX: tilt, duration: d, ease: e }, t);
  tl.to(BBS, { rotation: -spin, rotationX: -tilt, duration: d, ease: e }, t); };
view(0.01, -43, 60, 20.5, 'sine.inOut');
view(20.8, -58, 56, 1.4);             // the apartment from a new side
view(25.3, -46, 52, 5.0, 'sine.inOut');   // lower, closer angle while the floor fills
view(30.3, -34, 58, 1.4);             // "por jeta kushton": swing to the other side
view(33.2, -44, 54, 5.0, 'sine.inOut');
view(40.5, -45, 60, 2.0);
view(42.5, -42, 60, 18, 'sine.inOut');
tl.fromTo('#grain', { x: 0, y: 0 }, { x: -48, y: -36, duration: 61, ease: 'steps(1830)', immediateRender: true }, 0);

// ================= 1 · hook =================
tl.set('#hk', { opacity: 0 }, 0);
camTo('#cam', scrW, AX + 290, AY + 230, 40, 2.9, 1330, 0, 0);
camTo('#cam', scrW, AX + 290, AY + 230, 40, 3.3, 1330, 0, 3.7, 'power1.inOut');
tl.set(roomLight, { opacity: 0.5 }, 0);
fin('#t1 .tt', 0.15, 0.5); fin('#t1 .ts', 0.7, 0.6); tl.set('#t1', { opacity: 1 }, 0.15);
fin('#tick', 0.4, 0.4);
const LF = { v: 0 };
const lifeDraw = function () { const y = Math.round(LF.v); $('#tkY').textContent = 2026 + y; $('#tkA').textContent = 25 + y; };
tl.fromTo(LF, { v: 0 }, { v: 27, duration: 2.3, ease: 'power2.inOut', immediateRender: true, onUpdate: lifeDraw }, 0.5);   // fast-forward a life
tl.to(tiles.map(function (t) { return t.el; }), { scale: 1, duration: 0.15, stagger: 1.8 / tiles.length, ease: 'none' }, 0.6);
tl.to(furn, { scale: 1, duration: 0.4, stagger: 0.35, ease: 'power2.out' }, 1.2);
tl.to(hair, { backgroundColor: '#d2d2d2', duration: 1.0, ease: 'power1.inOut' }, 1.7);
tl.to(roomLight, { opacity: 1, duration: 0.6 }, 2.6);
show1(keyL, 2.7); tl.fromTo(keyL, { z: 180 }, { z: 98, duration: 0.6, ease: 'power2.out', immediateRender: false }, 2.7);
tl.to('#tick', { scale: 1.12, color: '#FFF1C8', duration: 0.3, ease: 'power2.out', yoyo: true, repeat: 1 }, 2.8);
// rewind to the start of the story
tl.to(LF, { v: 0, duration: 0.7, ease: 'power2.in', onUpdate: lifeDraw }, 3.5);
hide1(keyL, 3.5);
tl.to(tiles.map(function (t) { return t.el; }), { scale: 0, duration: 0.12, stagger: { each: 0.55 / tiles.length, from: 'end' }, ease: 'none' }, 3.5);
tl.to(furn, { scale: 0.001, duration: 0.3, ease: 'power2.in' }, 3.5);
tl.to(hair, { backgroundColor: '#2a1f17', duration: 0.6 }, 3.5);
tl.to(roomLight, { opacity: 0.35, duration: 0.6 }, 3.5);
tl.to('#tick', { filter: 'blur(6px)', duration: 0.7, ease: 'power2.in' }, 3.5);
fout('#tick', 4.1, 0.3); fout('#t1', 3.9);

// ================= 2 · glass card A: 2.141 €/m² =================
camTo('#cam', scrW, AX + 220, AY + 120, 24, 3.4, 1000, 4.0, 1.0, 'power2.inOut'); dive(4.0, 1.0);
cardIn('#cA', 4.4);
count('#cAv', 0, 2141, 4.8, 1.8, de);
tl.fromTo('#cAul', { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: 'power2.inOut', immediateRender: true }, 5.8);
tl.fromTo('#cAtag', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', immediateRender: true }, 8.3);
camTo('#cam', scrW, AX + 220, AY + 120, 24, 3.0, 1000, 5.0, 5.2, 'none');
cardOut('#cA', 10.0);

// ================= 3 · glass card B: 880 €, then the doormat =================
cardIn('#cB', 10.4);
count('#cBv', 0, 880, 10.7, 1.4, de);
tl.fromTo('#cBul', { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: 'power2.inOut', immediateRender: true }, 11.4);
tl.fromTo('#slip', { y: 260, rotation: 4 }, { y: 0, rotation: 0, duration: 1.0, ease: 'power3.out', immediateRender: false }, 10.4);
hide1(calL, 12.4); hide1(ageL, 12.4);
camTo('#cam', scrW, CX + 20, CY + 20, 10, 1.9, 1180, 12.6, 1.6, 'power2.inOut');
tl.to(roomLight, { opacity: 0, duration: 1.0 }, 12.8);
tl.to(floorEdge, { opacity: 1, duration: 1.0 }, 13.6); show1(m80, 13.9);
tl.to([one, spot], { opacity: 1, duration: 0.8 }, 14.0);
cardOut('#cB', 13.2);
fin('#t3', 13.8);
tl.to(mat.r, { z: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 14.3);
show1(m041, 15.0);
fout('#t3', 16.6); hide1(m041, 16.6); tl.to([one, spot], { opacity: 0, duration: 0.6 }, 16.6);

// ================= 4 · one year = a bathroom =================
camTo('#cam', scrW, CX - 40, CY + 30, 10, 1.7, 1200, 16.7, 1.3, 'power2.inOut');
tl.to(bathSpot, { opacity: 1, duration: 1.0 }, 17.3);
fin('#t4', 17.1);
bathTiles.forEach(function (b, k) { tl.to(b, { scale: 1, duration: 0.35, ease: 'power2.out' }, 17.6 + k * 0.1); });
tl.to([tub.r, sink.r], { scale: 1, duration: 0.8, ease: 'power3.out' }, 19.0);
show1(m49, 19.3);
fout('#t4', 20.7); hide1(m49, 20.7); hide1(m80, 20.7); tl.to([bathSpot, floorEdge], { opacity: 0, duration: 0.8 }, 20.7); tl.to(roomLight, { opacity: 0.35, duration: 1.0 }, 20.8);

// ================= 5 · the apartment: 171.000 €, 8 years without spending =================
camTo('#cam', scrW, CX, CY, 30, 1.8, 1220, 20.8, 1.4, 'power2.inOut');
show1(calL, 21.9); show1(ageL, 22.1);
fin('#t5', 21.2);
fout('#t5', 24.8);
fin('#t5b', 25.1);
const yr = { v: 0 };
const flip = function (t, from, to, dur) { tl.fromTo(yr, { v: from }, { v: to, duration: dur, ease: 'power2.out', immediateRender: false, onUpdate: function () { $('#calY').textContent = 2026 + Math.round(yr.v); } }, t); };
flip(25.3, 0, 8, 3.0);
tiles.forEach(function (t, k) { tl.to(t.el, { scale: 1, duration: 0.3, ease: 'power2.out' }, 25.3 + (k / tiles.length) * 3.0); });
furn.forEach(function (f, k) { tl.to(f, { scale: 1, duration: 0.8, ease: 'power3.out' }, 26.0 + k * 0.8); });
tl.to(roomLight, { opacity: 0.7, duration: 2.0 }, 26.0);
camTo('#cam', scrW, CX, CY, 30, 1.85, 1060, 25.3, 5.0, 'none');
fout('#t5b', 30.1);

// timeline: years along a gold line; 8 years first, then the scale shrinks so 27 fits and 8 looks small
const TS = { ppy: 100, prog: 0, ghost: 0 };
const tk = []; for (let i = 0; i <= 27; i++) { const e = document.createElement('i'); $('#ticks').appendChild(e); tk.push(e); }
const drawTL = function () {
  tk.forEach(function (e, i) { e.style.transform = 'translateX(' + (i * TS.ppy) + 'px)'; e.style.opacity = (i * TS.ppy <= 900) ? 1 : 0; });
  $('#tfill').style.transform = 'scaleX(' + Math.min(1, TS.prog * TS.ppy / 900) + ')';
  $('#tfill2').style.transform = 'scaleX(' + Math.min(1, TS.ghost * TS.ppy / 900) + ')';
  $('#tm8').style.transform = 'translateX(' + (8 * TS.ppy) + 'px)'; $('#tm27').style.transform = 'translateX(' + (27 * TS.ppy) + 'px)';
};
const tlTo = function (vars, t, d, ease) { tl.to(TS, Object.assign(vars, { duration: d, ease: ease || 'power1.inOut', onUpdate: drawTL }), t); };
drawTL();
fin('#tlx', 25.0, 0.7); fin('#tm0', 25.2, 0.7);
tlTo({ prog: 8 }, 25.3, 3.0, 'power2.out');
fin('#tm8', 28.0, 0.7);

// ================= 6 · but life costs: 27 years, 25 → 52, then glass card C: 52 =================
fin('#t6', 30.3);
tl.to(tiles.map(function (t) { return t.el; }), { scale: 0, duration: 0.6, ease: 'power2.in', stagger: { each: 0.006, from: 'end' } }, 30.8);
tl.to(furn, { scale: 0.001, duration: 0.6, ease: 'power2.in' }, 30.8);
tl.to(roomLight, { opacity: 0.25, duration: 1.0 }, 30.8);
fout('#t6', 32.5);
fin('#t6b', 32.8);
tlTo({ ghost: 8 }, 30.8, 0.01, 'none'); tlTo({ prog: 0 }, 30.9, 0.9, 'power2.in');
tlTo({ ppy: 30 }, 31.6, 1.4, 'power2.inOut');
tlTo({ prog: 27 }, 33.2, 5.0, 'power2.out');
fin('#tm27', 37.8, 0.7);
flip(33.2, 0, 27, 5.0);
count('#t6n', 0, 27, 33.2, 5.0, function (v) { return Math.round(v); });
count('#ageN', 25, 52, 33.2, 5.0, function (v) { return Math.round(v); });
tiles.forEach(function (t, k) { tl.to(t.el, { scale: 1, duration: 0.4, ease: 'power1.out' }, 33.2 + (k / tiles.length) * 4.8); });
furn.forEach(function (f, k) { tl.to(f, { scale: 1, duration: 0.8, ease: 'power3.out' }, 35.0 + k * 1.1); });
tl.to(hair, { backgroundColor: '#d2d2d2', duration: 3.0, ease: 'power1.inOut' }, 35.0);
tl.to(roomLight, { opacity: 1, duration: 1.2 }, 37.6);                    // the key: the lights come on
camTo('#cam', scrW, AX + 230, AY + 150, 50, 1.95, 1060, 33.2, 4.8, 'power1.inOut');
fout('#t6b', 38.1);
fout('#tlx', 38.1); hide1(ageL, 38.1); hide1(calL, 38.1);
camTo('#cam', scrW, AX + 316, AY + 262, 40, 4.4, 1250, 38.1, 1.5, 'power2.inOut');
show1(keyL, 38.9); tl.fromTo(keyL, { z: 160 }, { z: 98, duration: 1.0, ease: 'power2.out', immediateRender: false }, 38.9);
fin('#t6c', 38.6);
camTo('#cam', scrW, AX + 316, AY + 262, 40, 4.7, 1250, 39.6, 1.3, 'none');
fout('#t6c', 40.4);

// ================= 7 · glass chart D: 1 in 4 on minimum wage → 50+ years =================
camTo('#cam', scrW, CX, CY, 30, 1.4, 1200, 40.5, 7.5, 'power1.inOut');
cardIn('#cD', 40.8);
tl.fromTo('#figs .fg', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out', immediateRender: true }, 41.1);
tl.fromTo('#fg4', { opacity: 0.25 }, { opacity: 1, duration: 0.8, immediateRender: false }, 42.4);
tl.fromTo('#cDbig', { opacity: 0, filter: 'blur(12px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out', immediateRender: true }, 44.3);
tl.fromTo('#cDsub', { opacity: 0 }, { opacity: 1, duration: 0.9, immediateRender: true }, 45.3);
cardOut('#cD', 47.8);

// ================= 8 · glass chart E: 2019 vs 2026, bars to scale =================
cardIn('#cE', 48.1);
tl.fromTo('#b19', { scaleY: 0 }, { scaleY: 1, transformOrigin: '50% 100%', duration: 1.1, ease: 'power2.inOut', immediateRender: true }, 48.8);
tl.fromTo('#v19', { opacity: 0 }, { opacity: 1, duration: 0.6, immediateRender: true }, 49.6);
tl.fromTo('#b26', { scaleY: 0 }, { scaleY: 1, transformOrigin: '50% 100%', duration: 1.4, ease: 'power2.inOut', immediateRender: true }, 50.1);
tl.fromTo('#v26', { opacity: 0 }, { opacity: 1, duration: 0.6, immediateRender: true }, 51.2);
tl.fromTo('#cEtag', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', immediateRender: true }, 52.0);
cardOut('#cE', 54.5);

const gen = [];
for (let i = -1; i < 5; i++) for (let j = -1; j < 5; j++) { for (let k = 0; k < 6; k++) {
  const x = i * 750 + 70 + rnd() * 380, y = j * 750 + 70 + rnd() * 300, d = Math.hypot(x - CX, y - CY);
  const g = div(layer(G, 260 + rnd() * 300), 'left:' + x + 'px;top:' + y + 'px;width:70px;height:70px;border-radius:50%;background:radial-gradient(circle, rgba(255,236,180,1) 0%, rgba(255,210,130,.75) 25%, rgba(255,200,120,0) 70%);', 'bx');
  gen.push({ g: g, d: d }); } }
gen.forEach(function (o) { tl.set(o.g, { opacity: 0 }, 0); tl.to(o.g, { opacity: 1, duration: 0.5 }, 55.3 + o.d / 2600 * 2.4); });
// ================= 9 · close: the whole city at night, a generation, one question =================
hide1(calL, 54.4); hide1(ageL, 54.4);
camTo('#cam', scrW, CX, CY, 0, 0.36, 1250, 54.6, 4.2, 'power2.inOut');
tl.to('#night', { opacity: 1, duration: 3.0 }, 55.0);
fin('#t9', 55.4); fout('#t9', 57.8);
fin('#t9b', 58.0);
fin('#note', 59.0);
camTo('#cam', scrW, CX, CY, 0, 0.33, 1250, 58.8, 2.2, 'none');

// synced to the voice-over (media/vo.wav, Whisper word times in transcript.json): original time → voice time
remap([[0, 0], [4.0, 4.0], [8.3, 8.7], [10.4, 11.0], [10.7, 12.6], [13.2, 14.6], [14.3, 16.4], [16.6, 17.6], [17.1, 17.8], [19.0, 19.4], [20.8, 20.0], [21.2, 20.4], [24.8, 26.1], [25.3, 26.6], [28.3, 31.4], [30.1, 31.95], [30.3, 32.0], [32.8, 34.2], [33.2, 34.6], [38.1, 38.0], [38.9, 40.9], [40.5, 42.0], [40.8, 42.2], [42.4, 44.4], [44.3, 49.6], [45.3, 51.3], [47.8, 52.6], [48.1, 52.8], [48.8, 55.6], [49.6, 57.9], [50.1, 60.0], [52.0, 62.3], [54.5, 63.8], [55.4, 64.0], [57.8, 66.4], [58.0, 66.6], [61, 70.6]]);
