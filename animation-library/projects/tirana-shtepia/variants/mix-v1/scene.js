// ===== SA VJET PËR NJË SHTËPI · mixed system: isometric dusk world (story) + flat number cards + simple charts =====
// Placeholder timing (≈61 s); retime to the voice-over when it arrives.
const de = function (v) { return Math.round(v).toLocaleString('de-DE'); };
const fin = function (sel, t, d) { tl.fromTo(sel, { opacity: 0, y: 30, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: d || 0.5, ease: 'power3.out', immediateRender: false }, t); };
const fout = function (sel, t, d) { tl.to(sel, { opacity: 0, filter: 'blur(10px)', duration: d || 0.4, ease: 'power2.in' }, t); };
const cardIn = function (sel, t) { tl.fromTo(sel, { opacity: 0, scale: 1.18, filter: 'blur(16px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out', immediateRender: false }, t); };
const cardOut = function (sel, t) { tl.to(sel, { opacity: 0, scale: 0.9, filter: 'blur(14px)', duration: 0.5, ease: 'power2.in' }, t); };

// ---------- the world ----------
const WT = 3600, scrW = isoScreen(WT, WT);
const w = world('w', 'tilt', WT, WT);
div(w, 'left:-3000px;top:-3000px;width:' + (WT + 6000) + 'px;height:' + (WT + 6000) + 'px;background:#1A2134;', 'bx');
const G = layer(w, 1);
[700, 1450, 2250, 3000].forEach(function (k) {
  div(G, 'left:-600px;top:' + (k - 70) + 'px;width:' + (WT + 1200) + 'px;height:140px;background:#2A3346;', 'bx');
  div(G, 'left:' + (k - 70) + 'px;top:-600px;width:140px;height:' + (WT + 1200) + 'px;background:#2A3346;', 'bx');
});
const AX = 1560, AY = 1560, AW = 400, AD = 320;                 // the apartment (between the roads)
const BP = [['#4b5570', '#3a435c', '#2c3348'], ['#55607c', '#434c66', '#333a51'], ['#5d5670', '#4a4459', '#383447']];
for (let i = -1; i < 5; i++) for (let j = -1; j < 5; j++) {
  const x = i * 750 - 20 + 90, y = j * 750 - 20 + 90;
  if (Math.abs(x - AX) < 500 && Math.abs(y - AY) < 500) continue;
  const front = (x + y) > (AX + AY) - 300 && Math.abs(x - AX) < 1300 && Math.abs(y - AY) < 1300;    // blocks in front of the flat stay low
  const h = Math.round(front ? 120 + rnd() * 120 : 220 + rnd() * 420), p = BP[Math.floor(rnd() * 3)], sz = 420 + rnd() * 80;
  const b = box(G, { x: x, y: y, w: sz, d: sz * 0.8, h: h, top: p[0], s1: p[1], s2: p[2], win: true });
  const nW = Math.round(h / 60);
  for (let k = 0; k < nW; k++) { const lw = layer(b.r, 30 + rnd() * (h - 60));
    if (rnd() < 0.5) box(lw, { x: rnd() * (sz - 40), y: sz * 0.8 - 2, w: 26, d: 3, h: 18, top: '#F5B82E', s1: '#F5B82E', s2: '#d99a1a' });
    else box(lw, { x: sz - 2, y: rnd() * (sz * 0.8 - 40), w: 3, d: 26, h: 18, top: '#F5B82E', s1: '#d99a1a', s2: '#F5B82E' }); }
}
// the apartment: slab, low walls (roof cut away), empty floor, bathroom corner, door
box(G, { x: AX - 20, y: AY - 20, w: AW + 40, d: AD + 40, h: 24, top: '#3a4359', s1: '#2c3447', s2: '#232a3a' });
const F = layer(G, 24);
div(F, 'left:' + AX + 'px;top:' + AY + 'px;width:' + AW + 'px;height:' + AD + 'px;background:#2E364A;', 'bx');
const tiles = [], bathTiles = [];
for (let ry = 0; ry < 8; ry++) for (let cx = 0; cx < 10; cx++) {
  if (cx < 3 && ry >= 5) continue;                               // bathroom corner gets its own small tiles
  const d = div(F, 'left:' + (AX + cx * 40 + 2) + 'px;top:' + (AY + ry * 40 + 2) + 'px;width:36px;height:36px;background:#C9A06B;box-shadow:inset 0 0 0 2px rgba(0,0,0,.12);', 'bx');
  tiles.push({ el: d, ord: (7 - ry) * 10 + cx });
}
tiles.sort(function (a, b) { return a.ord - b.ord; });
for (let k = 0; k < 12; k++) { const cx = k % 4, ry = Math.floor(k / 4);
  bathTiles.push(div(F, 'left:' + (AX + cx * 30 + 1) + 'px;top:' + (AY + 200 + ry * 40 + 1) + 'px;width:28px;height:38px;background:#E8EEF2;box-shadow:inset 0 0 0 2px rgba(0,0,0,.1);', 'bx')); }
const wall = function (x, y, ww, dd) { box(F, { x: x, y: y, w: ww, d: dd, h: 64, top: '#E9E3D6', s1: '#CFC7B6', s2: '#B8AF9D' }); };
wall(AX, AY, AW, 8); wall(AX, AY, 8, AD); wall(AX + 240, AY, 8, 180); wall(AX + 240, AY + 170, 160, 8); wall(AX, AY + 192, 120, 8); wall(AX + 120, AY + 192, 8, 70);
const tub = box(F, { x: AX + 12, y: AY + 214, w: 92, d: 40, h: 22, top: '#F4F4F4', s1: '#dcdcdc', s2: '#c8c8c8' });
const sink = box(F, { x: AX + 18, y: AY + 280, w: 30, d: 24, h: 34, top: '#F4F4F4', s1: '#dcdcdc', s2: '#c8c8c8' });
const matL = layer(F, 1); const mat = box(matL, { x: AX + 180, y: AY + AD - 30, w: 46, d: 26, h: 3, top: '#6b543a', s1: '#4a3a29', s2: '#3a2d20' });
// the couple (with hair that turns grey)
const P = layer(F, 2); const hair = [];
const human = function (x, y, col) {
  const r = div(P, 'left:' + x + 'px;top:' + y + 'px;width:0;height:0;', 'bx');
  box(r, { x: -9, y: -6, w: 18, d: 12, h: 52, top: col, s1: col, s2: '#141210' });
  const hd = layer(r, 53); box(hd, { x: -5, y: -5, w: 10, d: 10, h: 10, top: '#E9B994', s1: '#D9A47E', s2: '#C48E69' });
  const hr = layer(r, 63); const hb = box(hr, { x: -6, y: -6, w: 12, d: 12, h: 4, top: '#2a1f17', s1: '#2a1f17', s2: '#1f1711' });
  hair.push(hb.t); hb.ns.concat(hb.we).forEach(function (e) { hair.push(e); });
  return r;
};
const he = human(AX + 300, AY + 250, '#2F6FE0'), she = human(AX + 332, AY + 268, '#E8453C');
// billboards
const calL = label(F, AX + 120, AY + 6, 120, '<div class="ilab" style="font-size:30px;">VITI <span id="calY">2026</span></div>');
const ageL = label(F, AX + 316, AY + 258, 112, '<div class="ilab w" style="font-size:26px;"><span id="ageN">25</span> VJEÇ</div>');
const priceL = label(F, AX + 200, AY + 160, 190, '<div class="ilab" style="font-size:40px;">171.000 €</div>');
const m041 = label(F, AX + 203, AY + AD - 17, 50, '<div class="ilab" style="font-size:26px;">0,41 m²</div>');
const m49 = label(F, AX + 60, AY + 260, 90, '<div class="ilab" style="font-size:26px;">4,9 m²</div>');
[calL, ageL].forEach(function (b) { tl.set(b, { scale: 0.001 }, 0); });
[priceL, m041, m49].forEach(function (b) { tl.set(b, { scale: 0.001 }, 0); });
tl.set(tiles.map(function (t) { return t.el; }).concat(bathTiles), { scale: 0, transformOrigin: '50% 50%' }, 0);
tl.set([tub.r, sink.r], { scale: 0.001, transformOrigin: '50% 50%' }, 0);
tl.set(mat.r, { z: 300, opacity: 0 }, 0);
const pop1 = function (b, t) { tl.to(b, { scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, t); };
const pop0 = function (b, t) { tl.to(b, { scale: 0.001, duration: 0.3, ease: 'power2.in' }, t); };
const CX = AX + 200, CY = AY + 160;

// ================= 1 · hook (iso): down onto the empty apartment =================
camTo('#cam', scrW, CX, CY, 0, 0.42, 1250, 0, 0);
camTo('#cam', scrW, CX, CY, 30, 1.8, 1220, 0.2, 3.4, 'power3.inOut');
fin('#t1', 0.4, 0.6);
pop1(calL, 2.6); pop1(ageL, 2.9);
fout('#t1', 4.0);

// ================= 2 · card A: 2.141 €/m² (dive into one floor tile) =================
camTo('#cam', scrW, AX + 220, AY + 120, 24, 7, 960, 4.1, 0.8, 'power2.in');
cardIn('#cA', 4.6);
count('#cAv', 0, 2141, 4.8, 1.6, de);
tl.fromTo('#cAul', { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out', immediateRender: true }, 5.6);
tl.fromTo('#cAtag', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.7)', immediateRender: true }, 8.4);
cardOut('#cA', 10.2);

// ================= 3 · card B: 880 €, then the doormat (iso) =================
cardIn('#cB', 10.5);
count('#cBv', 0, 880, 10.7, 1.2, de);
tl.fromTo('#cBul', { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out', immediateRender: true }, 11.3);
pop0(calL, 12.9); pop0(ageL, 12.9);
camTo('#cam', scrW, AX + 203, AY + AD - 20, 10, 3.2, 1200, 13.0, 0.01);
cardOut('#cB', 13.4);
camTo('#cam', scrW, AX + 203, AY + AD - 40, 10, 2.6, 1200, 13.5, 1.2, 'power3.out');
fin('#t3', 13.8);
tl.to(mat.r, { z: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 14.3);
pop1(m041, 15.0);
fout('#t3', 16.8); pop0(m041, 16.8);

// ================= 4 · one year = a bathroom (iso) =================
camTo('#cam', scrW, AX + 70, AY + 260, 10, 2.8, 1250, 16.9, 1.0, 'power3.inOut');
fin('#t4', 17.2);
bathTiles.forEach(function (b, k) { tl.to(b, { scale: 1, duration: 0.25, ease: 'back.out(2)' }, 17.6 + k * 0.1); });
tl.to([tub.r, sink.r], { scale: 1, duration: 0.5, ease: 'back.out(1.6)' }, 19.0);
pop1(m49, 19.3);
fout('#t4', 20.8); pop0(m49, 20.8);

// ================= 5 · the apartment: 171.000 €, 8 years without spending (iso) =================
camTo('#cam', scrW, CX, CY, 30, 1.8, 1220, 20.9, 1.2, 'power3.inOut');
pop1(calL, 21.9); pop1(ageL, 22.1);
fin('#t5', 21.2); pop1(priceL, 21.6);
fout('#t5', 24.8); pop0(priceL, 24.8);
fin('#t5b', 25.1);
const yr = { v: 0 };
const flip = function (t, from, to, dur) { tl.fromTo(yr, { v: from }, { v: to, duration: dur, ease: 'power2.out', immediateRender: false, onUpdate: function () { $('#calY').textContent = 2026 + Math.round(yr.v); } }, t); };
flip(25.3, 0, 8, 3.0);
tiles.forEach(function (t, k) { tl.to(t.el, { scale: 1, duration: 0.2, ease: 'power2.out' }, 25.3 + (k / tiles.length) * 3.0); });
camTo('#cam', scrW, CX, CY, 30, 1.9, 1220, 25.3, 5.0, 'none');
fout('#t5b', 30.2);

// ================= 6 · but life costs: 27 years, 25 → 52 (iso) + card C: 52 =================
fin('#t6', 30.4);
tl.to(tiles.map(function (t) { return t.el; }), { scale: 0, duration: 0.5, ease: 'power2.in', stagger: { each: 0.006, from: 'end' } }, 30.8);
fout('#t6', 32.6);
fin('#t6b', 32.9);
flip(33.2, 0, 27, 5.0);
count('#t6n', 0, 27, 33.2, 5.0, function (v) { return Math.round(v); });
count('#ageN', 25, 52, 33.2, 5.0, function (v) { return Math.round(v); });
tiles.forEach(function (t, k) { tl.to(t.el, { scale: 1, duration: 0.3, ease: 'power1.out' }, 33.2 + (k / tiles.length) * 4.8); });
tl.to(hair, { backgroundColor: '#cfcfcf', duration: 3.0, ease: 'power1.inOut' }, 35.0);
camTo('#cam', scrW, AX + 230, AY + 150, 50, 2.0, 1200, 33.2, 5.0, 'power1.inOut');
fout('#t6b', 38.2);
camTo('#cam', scrW, AX + 316, AY + 258, 112, 7, 960, 38.3, 0.7, 'power2.in');
cardIn('#cC', 38.7);
count('#cCv', 25, 52, 38.8, 0.9, function (v) { return Math.round(v); });
cardOut('#cC', 40.6);

// ================= 7 · chart D: 1 in 4 on minimum wage → 50+ years =================
cardIn('#cD', 40.9);
tl.fromTo('#figs .fg', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.12, ease: 'power3.out', immediateRender: true }, 41.1);
tl.to('#fg4', { fill: '#E8453C', duration: 0.5 }, 42.3);
tl.fromTo('#cDbig', { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out', immediateRender: true }, 44.3);
tl.fromTo('#cDsub', { opacity: 0 }, { opacity: 1, duration: 0.6, immediateRender: true }, 45.3);
cardOut('#cD', 47.9);

// ================= 8 · chart E: 2019 vs 2026, bars to scale =================
cardIn('#cE', 48.2);
tl.fromTo('#b19', { scaleY: 0 }, { scaleY: 1, transformOrigin: '50% 100%', duration: 0.8, ease: 'power3.out', immediateRender: true }, 48.9);
tl.fromTo('#v19', { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: true }, 49.5);
tl.fromTo('#b26', { scaleY: 0 }, { scaleY: 1, transformOrigin: '50% 100%', duration: 1.1, ease: 'power3.out', immediateRender: true }, 50.2);
tl.fromTo('#v26', { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: true }, 51.1);
tl.fromTo('#cEtag', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.7)', immediateRender: true }, 52.0);
cardOut('#cE', 54.6);

// ================= 9 · close (iso): the whole city at night, a generation, one question =================
pop0(calL, 54.5); pop0(ageL, 54.5);
camTo('#cam', scrW, CX, CY, 30, 2.0, 1300, 54.6, 0.01);
camTo('#cam', scrW, CX, CY, 0, 0.36, 1250, 54.8, 4.0, 'power2.inOut');
tl.to('#night', { opacity: 1, duration: 3.0 }, 55.0);
fin('#t9', 55.4, 0.6); fout('#t9', 57.9);
fin('#t9b', 58.1, 0.6);
fin('#note', 59.0);
camTo('#cam', scrW, CX, CY, 0, 0.33, 1250, 58.8, 2.2, 'none');
