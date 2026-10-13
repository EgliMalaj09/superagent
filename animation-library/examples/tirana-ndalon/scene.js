// ===== TIRANA NDALON · ISOMETRIC: a screen-space opening with the phone screenshot, then a small 3D city at dusk, one camera. =====
const OPEN = 'B';   // A = windshield + phone, push into the screen · B = match cut: a red line on the map → a row of brake lights
// Placeholder timing (~50 s); remap() to the voice later. World: 7×7 lots, roads every 600 px.
const N = 6, LOT = 700, WT = N * LOT, RW = 280, LN = 70;       // road width 280, two lanes at ±70
const scrW = isoScreen(WT, WT);
const MAIN = 3 * LOT, AVE = 3 * LOT;                            // the boulevard (y) and the avenue (x)
const w = world('w', 'tilt', WT, WT);

// ---------- ground + roads ----------
div(w, 'left:-4000px;top:-2000px;width:' + (WT + 8000) + 'px;height:' + (WT + 4000) + 'px;background:#1f2633;', 'bx');
const G = layer(w, 1);
div(G, 'left:0;top:0;width:' + WT + 'px;height:' + WT + 'px;background:#262e3c;', 'bx');
for (let k = 1; k < N; k++) {
  div(G, 'left:0;top:' + (k * LOT - RW / 2) + 'px;width:' + WT + 'px;height:' + RW + 'px;background:#3a4252;', 'bx');
  div(G, 'left:' + (k * LOT - RW / 2) + 'px;top:0;width:' + RW + 'px;height:' + WT + 'px;background:#3a4252;', 'bx');
  div(G, 'left:0;top:' + (k * LOT - 2) + 'px;width:' + WT + 'px;height:4px;background:repeating-linear-gradient(90deg,#6b7486 0 40px,transparent 40px 80px);', 'bx');
  div(G, 'left:' + (k * LOT - 2) + 'px;top:0;width:4px;height:' + WT + 'px;background:repeating-linear-gradient(180deg,#6b7486 0 40px,transparent 40px 80px);', 'bx');
}

// ---------- buildings ----------
const BP = [['#5d6880', '#48526a', '#373f54'], ['#6e778c', '#566076', '#434b60'], ['#505c74', '#3f4a62', '#30394d'], ['#7a7088', '#625972', '#4c455a']];
const blds = [];
const B = layer(w, 1);
for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
  const x0 = i * LOT + RW / 2 + 20, y0 = j * LOT + RW / 2 + 20, sz = LOT - RW - 40;
  if ((i === 1 && j === 5) || (i === 5 && j === 1)) continue;                 // two open lots (park + parking)
  const n = rnd() < 0.5 ? 1 : 2;
  for (let k = 0; k < n; k++) {
    const p = BP[Math.floor(rnd() * BP.length)];
    const bw = n === 1 ? sz : sz / 2 - 10, bx = n === 1 ? x0 : x0 + k * (sz / 2 + 10);
    const h = Math.round(90 + rnd() * 330 + (rnd() < 0.12 ? 300 : 0));
    const hh = (i === 2 || i === 3 || j === 2 || j === 3) ? Math.min(h, 170) : h;   // low along the boulevard + avenue
    blds.push(box(B, { x: bx, y: y0, w: bw, d: sz, h: hh, top: p[0], s1: p[1], s2: p[2], win: true }));
  }
}
// the park lot (trees appear later) and the parking lot
const PARK = [1 * LOT + RW / 2 + 20, 5 * LOT + RW / 2 + 20];
div(G, 'left:' + PARK[0] + 'px;top:' + PARK[1] + 'px;width:380px;height:380px;background:#2c4a3c;', 'bx');
const PK = [5 * LOT + RW / 2 + 20, 1 * LOT + RW / 2 + 20];
div(G, 'left:' + PK[0] + 'px;top:' + PK[1] + 'px;width:380px;height:380px;background:#30384a;border:6px dashed #6b7486;', 'bx');

// ---------- traffic strips (like the phone map): red under the jammed lanes ----------
const TS = layer(w, 1.2); const red = [], blue = [];
[[0, MAIN - LN - 45, WT, 90], [0, MAIN + LN - 45, WT, 90], [AVE - LN - 45, 0, 90, WT], [AVE + LN - 45, 0, 90, WT]].forEach(function (r) {
  red.push(div(TS, 'left:' + r[0] + 'px;top:' + r[1] + 'px;width:' + r[2] + 'px;height:' + r[3] + 'px;background:rgba(232,69,60,.55);opacity:0;', 'bx'));
  blue.push(div(TS, 'left:' + r[0] + 'px;top:' + r[1] + 'px;width:' + r[2] + 'px;height:' + r[3] + 'px;background:rgba(127,196,255,.35);opacity:0;', 'bx'));
});
// ---------- cars: queued on the roads (white, red brake light at the back) ----------
const C = layer(w, 1);
const cars = [];
const addCar = function (x, y, horiz, wave) {
  const o = horiz ? { x: x - 60, y: y - 28, w: 120, d: 56 } : { x: x - 28, y: y - 60, w: 56, d: 120 };
  const grad = horiz ? 'linear-gradient(90deg,#E8453C 0 14%,#dfe3ea 14%)' : 'linear-gradient(180deg,#E8453C 0 14%,#dfe3ea 14%)';
  const b = box(C, Object.assign(o, { h: 46, top: '#dfe3ea', topCss: 'background:' + grad + ';', s1: '#b9bfca', s2: '#9aa1ae' }));
  const jam = horiz && Math.abs(y - (MAIN - LN)) < 1;           // the boulevard is jammed from the first frame
  tl.set(b.r, { scale: jam ? 1 : 0.001, transformOrigin: '50% 50%' }, 0);
  cars.push({ b: b, wave: jam ? -1 : wave, x: x, y: y, horiz: horiz });
};
for (let x = 120; x < WT - 60; x += 150) {                       // the boulevard: two packed lanes
  if (Math.abs(x - AVE) < 200) continue;
  addCar(x, MAIN - LN, true, rnd() < 0.35 ? 0 : (rnd() < 0.6 ? 1 : 2));
  addCar(x + 50, MAIN + LN, true, rnd() < 0.35 ? 0 : (rnd() < 0.6 ? 1 : 2));
}
for (let y = 120; y < WT - 60; y += 150) {                       // the avenue
  if (Math.abs(y - MAIN) < 200) continue;
  addCar(AVE - LN, y, false, rnd() < 0.35 ? 0 : (rnd() < 0.6 ? 1 : 2));
  addCar(AVE + LN, y + 50, false, rnd() < 0.35 ? 0 : (rnd() < 0.6 ? 1 : 2));
}
[1, 2, 5].forEach(function (k) {                             // lighter traffic elsewhere
  for (let t = 150; t < WT - 100; t += 220 + rnd() * 260) { addCar(t, k * LOT + (rnd() < 0.5 ? -LN : LN), true, 1 + Math.floor(rnd() * 2)); addCar(k * LOT + (rnd() < 0.5 ? -LN : LN), t, false, 1 + Math.floor(rnd() * 2)); }
});
const HERO = cars.reduce(function (a, c) { return (c.horiz && Math.abs(c.y - (MAIN - LN)) < 1 && Math.abs(c.x - 1500) < Math.abs(a.x - 1500)) ? c : a; }, cars[0]);

// ---------- the imagined city: bus lane, bus, trees ----------
const BL = layer(w, 1.5);
const lane = div(BL, 'left:0;top:' + (MAIN + LN - 50) + 'px;width:' + WT + 'px;height:100px;background:#3DDC84;opacity:.85;', 'bx');
tl.set(lane, { scaleX: 0, transformOrigin: '0% 50%' }, 0);
const BUS = layer(w, 1);
const busR = div(BUS, 'left:0;top:0;width:0;height:0;', 'bx');
box(busR, { x: -170, y: MAIN + LN - 36, w: 340, d: 72, h: 84, top: '#3DDC84', topCss: 'background:linear-gradient(180deg,#3DDC84 0 40%,#F4F1EA 40% 60%,#3DDC84 60%);box-shadow:0 0 40px rgba(61,220,132,.9);', s1: '#2fb46a', s2: '#23935a' });
tl.set(busR, { x: -300, scale: 0.001 }, 0);
const trees = [];
const T = layer(w, 1);
for (let k = 0; k < 9; k++) trees.push(tree(T, PARK[0] + 70 + (k % 3) * 120, PARK[1] + 70 + Math.floor(k / 3) * 120, 2.4));
for (let x = 350; x < WT; x += 700) trees.push(tree(T, x, MAIN + RW / 2 + 40, 2.2));
trees.forEach(function (t) { tl.set(t, { scale: 0.001 }, 0); });

// ---------- tram tracks (stop halfway) + train (track ends short of Durrës) ----------
const TR = layer(w, 1.6);
const tram = div(TR, 'left:' + (AVE - 70) + 'px;top:0;width:140px;height:' + WT + 'px;border-left:22px solid #F4F1EA;border-right:22px solid #F4F1EA;background:repeating-linear-gradient(180deg,rgba(244,241,234,.7) 0 18px,transparent 18px 60px);', 'bx');
tl.set(tram, { scaleY: 0, transformOrigin: '50% 0%', opacity: 0 }, 0);
const RY = 5 * LOT;   // road 5                                             // the railway leaves the city to the west on road 5
const rail = div(TR, 'left:-2200px;top:' + (RY - 26) + 'px;width:2600px;height:52px;border-top:8px solid #F5B82E;border-bottom:8px solid #F5B82E;background:repeating-linear-gradient(90deg,rgba(245,184,46,.55) 0 10px,transparent 10px 44px);', 'bx');
tl.set(rail, { scaleX: 0, transformOrigin: '100% 50%', opacity: 0 }, 0);
const gap = div(TR, 'left:-4400px;top:' + (RY - 4) + 'px;width:2200px;height:8px;background:repeating-linear-gradient(90deg,rgba(245,184,46,.6) 0 30px,transparent 30px 70px);opacity:0;', 'bx');
const TRN = layer(w, 1);
const train = div(TRN, 'left:0;top:0;width:0;height:0;', 'bx');
for (let k = 0; k < 3; k++) box(train, { x: k * 200, y: RY - 22, w: 180, d: 44, h: 56, top: k ? '#F4F1EA' : '#F5B82E', s1: '#d8d2c4', s2: '#b9b2a3' });
tl.set(train, { x: 600, scale: 0.001 }, 0);

// ---------- billboards ----------
const bb = function (x, y, z, cls, txt, fs) { const b = label(w, x, y, z, '<div class="ilab ' + cls + '" style="font-size:' + fs + 'px;">' + txt + '</div>'); tl.set(b, { scale: 0.001 }, 0); return b; };
const lP = bb(PK[0] + 190, PK[1] + 190, 60, 'p', 'P', 140);
const lQ = bb(WT - 200, MAIN, 100, 'g', 'QENDRA', 90);
const lTram = bb(AVE + 120, WT / 2, 120, '', 'TRAMVAJI?', 110);
const lDur = bb(-4300, RY, 120, 'y', 'DURRËS', 240);
const lTir = bb(WT / 2, WT / 2, 900, '', 'TIRANË', 170);
const pop1 = function (b, t) { tl.to(b, { scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, t); };
const pop0 = function (b, t) { tl.to(b, { scale: 0.001, duration: 0.3, ease: 'power2.in' }, t); };

// rain (screen space, scene 1)
for (let i = 0; i < 110; i++) {
  const d = div('#rain', 'left:' + Math.round(rnd() * 1120 - 20) + 'px;', 'raindrop');
  const sp = 0.45 + rnd() * 0.3;
  tl.fromTo(d, { y: -120 - rnd() * 400 }, { y: 2000, duration: sp, ease: 'none', repeat: Math.ceil(6 / sp), immediateRender: true }, rnd() * 0.5);
}
fadeOut('#rain', 4.6, 0.8);

// ================= OPENING A: inside a stuck car at night, the phone on the dashboard shows the map =================
const bok = [['#E8453C', 0.9], ['#E8453C', 0.7], ['#F5B82E', 0.6], ['#F4F1EA', 0.35], ['#E8453C', 0.8]];
for (let i = 0; i < 26; i++) {
  const c = bok[Math.floor(rnd() * bok.length)], r = 30 + rnd() * 90;
  const d = div('#aBok', 'left:' + Math.round(rnd() * 1080 - r) + 'px;top:' + Math.round(380 + rnd() * 700) + 'px;width:' + (2 * r) + 'px;height:' + (2 * r) + 'px;background:' + c[0] + ';opacity:' + c[1] + ';', 'bk');
  tl.fromTo(d, { x: 0 }, { x: (rnd() - 0.5) * 30, duration: 5, ease: 'none', immediateRender: true }, 0);
}
for (let i = 0; i < 70; i++) {                                    // drops on the windshield, a few slide down
  const r = 5 + rnd() * 12;
  const d = div('#aDrops', 'left:' + Math.round(rnd() * 1080) + 'px;top:' + Math.round(rnd() * 1450) + 'px;width:' + r + 'px;height:' + (r * 1.2) + 'px;', 'drop');
  if (rnd() < 0.3) tl.fromTo(d, { y: 0 }, { y: 120 + rnd() * 260, duration: 2 + rnd() * 3, ease: 'power1.in', immediateRender: true }, rnd() * 2);
}
tl.fromTo('#wiper', { rotation: -8 }, { rotation: -78, duration: 0.9, ease: 'power2.inOut', immediateRender: true }, 1.4);
tl.to('#wiper', { rotation: -8, duration: 0.9, ease: 'power2.inOut' }, 2.4);
tl.fromTo('#aCarL,#aCarR', { opacity: 0.75 }, { opacity: 1, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 7, immediateRender: true }, 0);
kenBurns('#aW', 0, 3.6, 1.0, 1.06);
tl.to('#aW', { scale: 3.3, y: -620, duration: 1.2, ease: 'power3.in' }, 3.6);      // push into the phone screen
tl.to('#openA', { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 4.6);

// ================= OPENING B: the map on glass, dive into one red line → it's a row of brake lights =================
tl.fromTo('#bW', { scale: 1, x: 0, y: 0 }, { scale: 1.1, duration: 3.4, ease: 'none', immediateRender: true }, 0);
tl.to('#bW', { scale: 16, x: 238, y: -386, duration: 1.2, ease: 'power3.in' }, 3.4);
tl.fromTo('#bRed', { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.in', immediateRender: true }, 4.25);
hide('#bW', 4.6);
tl.to('#openB', { opacity: 0, duration: 0.7, ease: 'power2.out' }, 4.6);


// ================= TIMELINE =================
const blk = function (id, t, tEnd, gap) { show(id, t); $(id).querySelectorAll('.tag').forEach(function (c, i) { up(c, t + i * (gap || 0.9), 0.45); }); if (tEnd) fadeOut(id, tEnd, 0.35); };
const strike = function (sel, t) { tl.fromTo(sel, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'power2.out', immediateRender: false }, t); };
const carsIn = function (list, t, span) { list.forEach(function (c, k) { tl.to(c.b.r, { scale: 1, duration: 0.3, ease: 'back.out(1.8)' }, t + (k / Math.max(1, list.length)) * span); }); };
const carsOut = function (list, t, span) { list.forEach(function (c, k) { tl.to(c.b.r, { scale: 0.001, duration: 0.3, ease: 'power2.in' }, t + (k / Math.max(1, list.length)) * span); }); };

// 1 · hook: the opening layer (A or B) sits over the 3D city, then hands over to it
tl.set('#b1', { opacity: 1 }, 0); up('#b1a', 0.25); up('#b1b', 1.2); up('#b1c', 3.5); fadeOut('#b1', 4.3, 0.35);
tl.set(red, { opacity: 1 }, 0);
if (OPEN === 'A') {
  hide('#openB', 0);
  camTo('#cam', scrW, WT / 2, MAIN, 0, 0.8, 1000, 0, 0);
  camTo('#cam', scrW, WT / 2, WT / 2, 0, 0.3, 1150, 4.6, 2.0, 'power3.out');
} else {
  hide('#openA', 0);
  camTo('#cam', scrW, HERO.x - 50, HERO.y, 46, 6.0, 960, 0, 0);
  camTo('#cam', scrW, HERO.x, HERO.y, 20, 1.1, 1000, 4.5, 1.0, 'power2.inOut');
  camTo('#cam', scrW, WT / 2, WT / 2, 0, 0.3, 1150, 5.5, 1.3, 'power3.inOut');
}

// 3 · numbers: the roads fill up, wave by wave
camTo('#cam', scrW, WT / 2, WT / 2, 0, 0.36, 1200, 6.8, 5.2, 'none');
show('#b2', 5.4); up('#b2a', 5.4); fadeOut('#b2', 12.3);
count('#cnt', 0, 1000000, 5.5, 1.6); up('#b2b', 5.7);
carsIn(cars.filter(function (c) { return c.wave === 0; }), 5.6, 1.6);
up('#b2c', 8.0); carsIn(cars.filter(function (c) { return c.wave === 1; }), 8.0, 1.8);
up('#b2d', 10.2); carsIn(cars.filter(function (c) { return c.wave === 2; }), 10.2, 1.6);

// 4 · one driver: dive onto one stuck car on the boulevard
camTo('#cam', scrW, HERO.x, HERO.y, 20, 1.5, 820, 12.2, 1.8, 'power3.inOut');
show('#b3', 12.9); up('#b3a', 12.9); fadeOut('#b3', 19.2);
fadeIn('#clock', 13.3); count('#hrs', 0, 185, 13.4, 1.8);
tl.fromTo('#hand', { rotation: 0 }, { rotation: 1080, svgOrigin: '110 110', duration: 1.8, ease: 'power2.out', immediateRender: true }, 13.4);
pop('#days', 15.6);
fadeIn('#fuel', 16.7); count('#lit', 0, 200, 16.8, 1.4);
tl.fromTo('#fbar', { scaleX: 1 }, { scaleX: 0.08, duration: 1.4, ease: 'power2.out', immediateRender: true }, 16.8);
camTo('#cam', scrW, HERO.x, HERO.y, 20, 1.65, 820, 14.0, 5.0, 'none');
fadeOut('#clock,#days,#fuel', 19.1);

// 5 · imagine: the cars thin out, a bus lane, a bus that passes everything, trees
camTo('#cam', scrW, WT / 2, MAIN, 0, 0.42, 1250, 19.2, 1.8, 'power3.inOut');
blk('#b4', 19.5, 23.3, 1.3);
const keep = function (c, k) { return k % 6 === 0 && !(c.horiz && c.y > MAIN && Math.abs(c.y - MAIN - LN) < 1); };
carsOut(cars.filter(function (c, k) { return !keep(c, k); }), 19.7, 1.4);
tl.to(red, { opacity: 0, duration: 1.0 }, 19.8); tl.to(blue, { opacity: 1, duration: 1.0 }, 20.0);
tl.to(lane, { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 20.6);
pop1(lQ, 21.0);
tl.to(busR, { scale: 1, duration: 0.3 }, 21.2);
tl.to(busR, { x: WT - 280, duration: 2.8, ease: 'power1.inOut' }, 21.3);
trees.forEach(function (t, k) { tl.to(t, { scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, 21.6 + k * 0.08); });
pop0(lQ, 23.4);
camTo('#cam', scrW, PK[0] + 190, PK[1] + 190, 0, 0.75, 1150, 23.4, 1.4, 'power3.inOut');
blk('#b5', 23.6, 26.1); pop1(lP, 24.0); pop('#park', 24.0); strike('#pstr', 24.9); fadeOut('#park', 26.0); pop0(lP, 26.0);
camTo('#cam', scrW, WT / 2, WT / 2, 0, 0.36, 1200, 26.0, 1.6, 'power3.inOut');
blk('#b6', 26.3, 29.1); up('#cmp', 26.5); strike('#c90s', 27.6); tl.to('#c90', { opacity: 0.45, duration: 0.4 }, 27.9); fadeOut('#cmp', 29.0);
camTo('#cam', scrW, PARK[0] + 190, PARK[1] + 190, 0, 0.7, 950, 29.0, 1.4, 'power3.inOut');
blk('#b7', 29.3, 32.2, 1.0); fadeIn('#house', 29.4, 0.45);
tl.fromTo('#win', { opacity: 0.15 }, { opacity: 1, duration: 0.8, ease: 'power2.out', immediateRender: true }, 30.0); fadeIn('#glow', 30.0, 0.8);
fadeOut('#house,#glow', 32.1);

// 6 · it's planning: rise high over the calm, green city
camTo('#cam', scrW, WT / 2, WT / 2, 0, 0.27, 1200, 32.0, 2.4, 'power2.inOut');
blk('#b8', 32.5, 35.6, 1.2);

// 7 · the tram: tracks start down the avenue and stop halfway
blk('#b9', 35.8, 38.9, 1.3);
tl.set(tram, { opacity: 1 }, 36.0); tl.to(tram, { scaleY: 0.5, duration: 1.3, ease: 'power2.out' }, 36.0);
pop1(lTram, 37.0);
tl.to(tram, { opacity: 0.25, duration: 0.8 }, 38.2); pop0(lTram, 38.6);

// 8 · the train: west out of the city; the track ends long before Durrës
camTo('#cam', scrW, -1700, RY, 0, 0.19, 880, 38.8, 2.2, 'power3.inOut');
blk('#b10', 39.6, 45.3, 1.2);
tl.set(rail, { opacity: 1 }, 40.0); tl.to(rail, { scaleX: 1, duration: 1.4, ease: 'power2.inOut' }, 40.0);
tl.to(gap, { opacity: 1, duration: 0.6 }, 41.2); pop1(lDur, 41.4);
tl.to(train, { scale: 1, duration: 0.3 }, 40.6);
show('#tline', 0); hide('#t0', 0); hide('#t1', 0); hide('#t2', 0); hide('#t3', 0);
up('#t1', 42.0); strike('#t1s', 42.8); up('#t2', 43.1); strike('#t2s', 43.7); up('#t3', 44.2);
fadeOut('#tline', 45.2); pop0(lDur, 45.2); tl.to([rail, gap], { opacity: 0, duration: 0.6 }, 45.3); tl.to(train, { scale: 0.001, duration: 0.3 }, 45.3);

// 9 · back: the cars return, the city is stuck again
camTo('#cam', scrW, WT / 2, WT / 2, 0, 0.32, 1200, 45.3, 2.2, 'power3.inOut');
tl.to(lane, { opacity: 0, duration: 0.6 }, 45.4); tl.to(busR, { scale: 0.001, duration: 0.3 }, 45.4);
carsIn(cars.filter(function (c, k) { return !keep(c, k); }), 45.6, 1.6);
tl.to(blue, { opacity: 0, duration: 0.8 }, 45.6); tl.to(red, { opacity: 1, duration: 1.0 }, 45.8);
blk('#b11', 45.8, null, 1.1);
camTo('#cam', scrW, WT / 2, WT / 2, 0, 0.28, 1200, 47.5, 2.5, 'none');

// ================= SYNC TO THE VOICE-OVER (media/vo.wav, Whisper word times) =================
// Each part moves to its words; nothing is slowed down (durations stay), the extra seconds get extra beats below.
const SEG = [[0, 0], [3.3, 3.6], [5.3, 5.0], [7.8, 8.0], [10.0, 11.4], [12.0, 12.9], [13.2, 16.9], [16.6, 21.0], [19.15, 24.55], [24.5, 30.9],
             [25.95, 31.85], [27.5, 34.9], [28.95, 36.15], [31.95, 39.1], [35.7, 42.95], [38.75, 46.05], [41.9, 53.0], [43.0, 56.1], [44.1, 58.2], [45.75, 60.4]];
(function () {
  const sh = function (s) { let d = 0; SEG.forEach(function (p) { if (s >= p[0] - 1e-6) d = p[1] - p[0]; }); return d; };
  tl.getChildren(false, true, true).forEach(function (c) { const s = c.startTime(); if (s > 0) c.startTime(s + sh(s)); });
})();
// extra beats in the new time (take 2: media/vo.wav, 64.7 s)
up('#b3b', 15.2);                                                                         // "një shofer në Tiranë"
const lMe = bb(HERO.x, HERO.y, 90, 'r', 'SHOFERI', 34); pop1(lMe, 15.7); pop0(lMe, 24.0);
camTo('#cam', scrW, HERO.x, HERO.y, 20, 1.58, 820, 14.9, 2.8, 'none');                  // slow push while he waits
tl.to(train, { x: -500, duration: 1.4, ease: 'power2.out' }, 48.4);                     // the train moves a little on each new date…
up('#t0', 50.4);
tl.to(train, { x: -1050, duration: 1.0, ease: 'power2.inOut' }, 53.9);
tl.to(train, { x: -1500, duration: 1.0, ease: 'power2.inOut' }, 56.8);
tl.to(train, { x: -1900, duration: 1.0, ease: 'power2.out' }, 58.5);                    // …and stops where the track ends
camTo('#cam', scrW, -1700, RY, 0, 0.215, 860, 48.4, 10.8, 'none');                      // slow drift over the line
camTo('#cam', scrW, WT / 2, WT / 2, 0, 0.25, 1200, 64.65, 0.8, 'none');
