// One world, one camera, no cuts. World units: px; MM = px per metre. See examples/tirana-one/scene.js for a full film.
const LOT = 560, N = 5, WT = LOT * N, HT = LOT * N;
const w = world('w', 'tilt', WT, HT);
box(w, { x: -40, y: -40, w: WT + 80, d: HT + 80, h: 18, top: '#D6CFC1', s1: '#BDB4A3', s2: '#A69D8C' });
const G = layer(w, 18);
seed = 3; const towers = [];
for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
  const pal = PAL[Math.floor(rnd() * PAL.length)];
  const b = box(G, { x: i * LOT + 60, y: j * LOT + 60, w: LOT - 120, d: LOT - 120, h: Math.round(500 + rnd() * 1500), top: pal[0], s1: pal[1], s2: pal[2], win: true, h0: 10 });
  towers.push(b);
}
towers.forEach(function (b, i) { grow(b, 0.6 + i * 0.06, 0.9); });
const scrW = isoScreen(WT, HT);
camTo('#cam', scrW, WT / 2, HT / 2, 0, 0.55, H * 0.58, 0, 0);
camTo('#cam', scrW, WT / 2, HT / 2, 0, 0.32, H * 0.6, 0.2, D - 0.4, 'power1.inOut');
tl.fromTo('#w', { rotation: -45 }, { rotation: -36, duration: D, ease: 'none', immediateRender: true }, 0);
up('#h1', 0.3); hl('#hl1', 1.0); fadeIn('#src1', 1.4);
