// SCENE 10 · 0–12.5 s · 7:00 PM, the Flamingo Revolution at the Kryeministria (look from the user's photo).
// A ground level: Claude joins the crowd, Ana recognises it, gives it a flamingo sticker. B the HQ doors open and the
// Claudes march out with flamingos. C aerial down the packed boulevard: red flags, pink flamingos, the orange river, a wave.
const NSV = 'http://www.w3.org/2000/svg';
const twos = function (d) { return 'steps(' + Math.max(1, Math.round(d * 12)) + ')'; };
const mk = function (tag, attrs, parent) { const e = document.createElementNS(NSV, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); (typeof parent === 'string' ? $(parent) : parent).appendChild(e); return e; };
const ink = { stroke: '#1D1530', 'stroke-width': 5, 'stroke-linejoin': 'round' };
const A = function (o) { return Object.assign({}, ink, o); };
const fade = function (el, t, t2, css) { tl.set(el, { opacity: 0 }, 0); tl.fromTo(el, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', transformOrigin: css || '50% 50%', immediateRender: false }, t); if (t2) tl.to(el, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, t2); };
const flag = function (p, x, y, s) { flamingo(p, x + 10, y + 30, s); };   // no flags in this video (user): a flamingo instead
const flamingo = function (p, x, y, s) {   // inflatable flamingo on a stick
  mk('line', { x1: x, y1: y + 40 * s, x2: x, y2: y + 110 * s, stroke: '#1D1530', 'stroke-width': 4 * s }, p);
  mk('ellipse', A({ cx: x, cy: y + 30 * s, rx: 34 * s, ry: 20 * s, fill: '#FF6FAE', 'stroke-width': 3 * s }), p);
  mk('path', { d: 'M' + (x + 20 * s) + ' ' + (y + 22 * s) + ' C' + (x + 40 * s) + ' ' + (y - 10 * s) + ' ' + (x + 6 * s) + ' ' + (y - 24 * s) + ' ' + (x + 18 * s) + ' ' + (y - 46 * s), fill: 'none', stroke: '#FF6FAE', 'stroke-width': 9 * s, 'stroke-linecap': 'round' }, p);
  mk('circle', A({ cx: x + 20 * s, cy: y - 50 * s, r: 10 * s, fill: '#FF6FAE', 'stroke-width': 3 * s }), p);
  mk('path', { d: 'M' + (x + 28 * s) + ' ' + (y - 52 * s) + ' l' + (14 * s) + ' ' + (6 * s) + ' l' + (-14 * s) + ' ' + (3 * s) + ' z', fill: '#1D1530' }, p);
};
const person = function (p, x, y, s, body, head, hair) {   // blocky person, feet at (x,y)
  const g = mk('g', {}, p);
  mk('rect', A({ x: x - 40 * s, y: y - 170 * s, width: 80 * s, height: 170 * s, fill: body, 'stroke-width': 4 * s }), g);
  mk('rect', A({ x: x - 30 * s, y: y - 240 * s, width: 60 * s, height: 66 * s, fill: head, 'stroke-width': 4 * s }), g);
  mk('rect', A({ x: x - 34 * s, y: y - 250 * s, width: 68 * s, height: 18 * s, fill: hair, 'stroke-width': 4 * s }), g);
  return g;
};
const claude = function (p, id, s) {   // feet at 0,0
  const g = mk('g', { id: id }, p);
  [-74, -30, 14, 56].forEach(function (lx, i) { mk('rect', A({ id: id + 'L' + i, x: lx, y: -44, width: 28, height: 46, rx: 5, fill: '#D9612B' }), g); });
  mk('polygon', A({ points: '-100,-270 -72,-298 128,-298 100,-270', fill: '#FFAA6B' }), g);
  mk('polygon', A({ points: '100,-270 128,-298 128,-70 100,-40', fill: '#D9612B' }), g);
  mk('rect', A({ x: -100, y: -270, width: 200, height: 230, fill: '#F5873A' }), g);
  mk('rect', { x: -100, y: -270, width: 200, height: 230, fill: 'url(#dotsS)' }, g);
  const e = mk('g', { id: id + 'E' }, g);
  mk('rect', { x: -54, y: -224, width: 24, height: 48, fill: '#15131A' }, e); mk('rect', { x: 30, y: -224, width: 24, height: 48, fill: '#15131A' }, e);
  return g;
};
const SKIN = ['#E9B994', '#D9A07A', '#C98B62', '#F0C9A8'], BODY = ['#2F3A55', '#7A5C3E', '#3FA66B', '#5B6B8C', '#C9533A', '#E8E4DA', '#1D1530'], HAIR = ['#2E2A26', '#5A3A28', '#1D1530', '#8A6A4A'];
seed = 51;

// ===================== A · ground level (0–5.4) =====================
for (let i = 0; i < 6; i++) {   // warm-lit buildings behind
  const x = i * 190 - 40, h = 520 + rnd() * 380;
  mk('rect', A({ x: x, y: 1380 - h, width: 180, height: h, fill: i % 2 ? '#5A3F6E' : '#4A3F8E' }), '#gBuild');
  for (let yy = 1380 - h + 40; yy < 1340; yy += 70) for (let xx = x + 18; xx < x + 160; xx += 50) mk('rect', { x: xx, y: yy, width: 30, height: 40, fill: rnd() < .7 ? '#FFD58A' : '#3A2F5E' }, '#gBuild');
}
for (let i = 0; i < 26; i++) {   // the crowd behind (smaller)
  const x = rnd() * 1080, y = 1420 + rnd() * 60;
  person('#gBack', x, y, 0.75, BODY[i % BODY.length], SKIN[i % 4], HAIR[i % 4]);
  if (i % 3 === 0) flamingo('#gBack', x + 20, y - 360, 1.0); else if (i % 4 === 1) flag('#gBack', x + 10, y - 330, 1.0);
}
const cg = claude('#gChars', 'cg');
tl.set('#cg', { x: -200, y: 1600, scale: 0.9 }, 0);
tl.to('#cg', { x: 380, duration: 1.0, ease: twos(1.0) }, 0.1);
[0, 2].forEach(function (i) { gsap.set('#cgL' + i, { svgOrigin: [-60, -16, 28, 70][i] + ' -44' }); tl.fromTo('#cgL' + i, { rotation: -20 }, { rotation: 20, duration: 0.2, yoyo: true, repeat: 4, ease: 'steps(3)', immediateRender: false }, 0.1); });
[1, 3].forEach(function (i) { gsap.set('#cgL' + i, { svgOrigin: [-60, -16, 28, 70][i] + ' -44' }); tl.fromTo('#cgL' + i, { rotation: 20 }, { rotation: -20, duration: 0.2, yoyo: true, repeat: 4, ease: 'steps(3)', immediateRender: false }, 0.1); });
tl.fromTo('#cgE', { x: -12 }, { x: 12, duration: 0.25, yoyo: true, repeat: 5, ease: 'steps(1)', immediateRender: false }, 1.1);   // looks around, amazed
// Ana (purple hoodie, round glasses, ponytail), holding a flamingo
const ana = mk('g', { id: 'ana' }, '#gChars');
mk('rect', A({ x: 680, y: 1340, width: 150, height: 260, fill: '#7B5BD6' }), ana);
mk('rect', A({ x: 700, y: 1226, width: 110, height: 112, fill: '#E9B994' }), ana);
mk('rect', A({ x: 692, y: 1210, width: 126, height: 28, fill: '#5A3A28' }), ana);
mk('rect', A({ x: 812, y: 1232, width: 28, height: 66, rx: 12, fill: '#5A3A28' }), ana);
mk('circle', { cx: 733, cy: 1284, r: 17, fill: 'none', stroke: '#1D1530', 'stroke-width': 5 }, ana); mk('circle', { cx: 777, cy: 1284, r: 17, fill: 'none', stroke: '#1D1530', 'stroke-width': 5 }, ana);
mk('path', { d: 'M738 1314 Q755 1330 772 1314', fill: 'none', stroke: '#1D1530', 'stroke-width': 5, 'stroke-linecap': 'round' }, ana);
mk('rect', { x: 700, y: 1340, width: 16, height: 220, fill: '#FFD84F' }, ana); mk('rect', { x: 794, y: 1340, width: 16, height: 220, fill: '#FFD84F' }, ana);
flamingo(ana, 860, 1010, 1.6);
tl.set('#ana', { x: 140 }, 0);
tl.to('#ana', { x: 0, duration: 0.42, ease: 'steps(5)' }, 2.0);
for (let i = 0; i < 7; i++) {   // the crowd in front (big, cut by the frame)
  const x = 60 + i * 160 + rnd() * 40;
  person('#gFront', x, 2080, 1.25, BODY[(i + 3) % BODY.length], SKIN[i % 4], HAIR[(i + 1) % 4]);
  if (i % 2 === 0) flamingo('#gFront', x + 30, 1480, 1.5); else flag('#gFront', x + 20, 1530, 1.4);
}
tl.fromTo('#gFront', { y: 0 }, { y: -14, duration: 0.33, yoyo: true, repeat: 15, ease: 'steps(2)', immediateRender: false }, 0);   // the crowd bounces
tl.fromTo('#gBack', { y: 0 }, { y: -8, duration: 0.25, yoyo: true, repeat: 21, ease: 'steps(2)', immediateRender: false }, 0.1);
// title stamp
const title = div('#hud', 'top:250px;font-size:132px;line-height:.95;color:#FF6FAE;text-shadow:8px 8px 0 #FFE14D;transform:rotate(-4deg);', 'boom'); title.innerHTML = 'FLAMINGO<br>REVOLUTION';
fade(title, 0.9, 2.0);
// Ana recognises Claude
const b1 = div('#hud', 'left:430px;top:560px;width:600px;', 'bubble tr'); b1.innerHTML = 'Hey! You helped me this morning!';
fade(b1, 2.3, 3.4, '80% 100%');
const b2 = div('#hud', 'left:150px;top:760px;font-size:60px;', 'bubble tl'); b2.innerHTML = '…I did?';
fade(b2, 3.4, 4.2, '20% 100%');
tl.to('#cgE', { scaleY: 1.3, svgOrigin: '0 -200', duration: 0.08, ease: 'steps(1)' }, 3.4);
const b3 = div('#hud', 'left:380px;top:560px;width:650px;', 'bubble tr'); b3.innerHTML = 'Write it down so you remember! 🦩';
fade(b3, 4.25, 5.35, '80% 100%');
// the flamingo sticker flies from Ana onto Claude
const st = mk('g', { id: 'sticker', opacity: 0 }, '#gChars');
mk('circle', A({ cx: 0, cy: 0, r: 46, fill: '#FFFFFF' }), st); flamingo(st, -6, 6, 0.75);
tl.set('#sticker', { x: 700, y: 1450 }, 0);
tl.set('#sticker', { opacity: 1 }, 4.5);
tl.to('#sticker', { x: 400, y: 1460, rotation: -15, duration: 0.42, ease: 'steps(5)' }, 4.55);
tl.to('#cgE', { scaleY: 0.35, duration: 0.17, ease: 'steps(2)' }, 5.0);   // happy squint
tl.to('#ground', { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 5.4);
tl.to('#hq', { opacity: 1, duration: 0.35, ease: 'power2.inOut' }, 5.4);

// ===================== B · the HQ doors open: the Claudes march out (5.4–7.8) =====================
for (let r = 0; r < 8; r++) for (let c = 0; c < 6; c++) mk('rect', { x: 150 + c * 136, y: 200 + r * 106, width: 110, height: 80, fill: (r + c) % 3 ? '#FFD58A' : '#3A2F5E', stroke: '#1D1530', 'stroke-width': 4 }, '#hqWin');
tl.to('#hDoorL', { x: -150, duration: 0.25, ease: 'steps(3)' }, 5.75);
tl.to('#hDoorR', { x: 150, duration: 0.25, ease: 'steps(3)' }, 5.75);
const MCH = [];
for (let i = 0; i < 14; i++) {
  const m = claude('#march', 'm' + i, 1);
  mk('g', {}, m); flamingo(m, 60, -420, 1.3);
  MCH.push(m);
  const lane = (i % 5) - 2, t0 = 5.95 + i * 0.12;
  tl.set(m, { x: 540, y: 1500, scale: 0.35, opacity: 0 }, 0);
  tl.set(m, { opacity: 1 }, t0);
  tl.to(m, { x: 540 + lane * 230 + (i % 2 ? 40 : -40), y: 2150, scale: 1.25, duration: 1.4, ease: twos(1.4) }, t0);
}
tl.fromTo('#march', { y: 0 }, { y: -10, duration: 0.17, yoyo: true, repeat: 13, ease: 'steps(1)', immediateRender: false }, 5.95);
const tramp = div('#hud', 'top:300px;font-size:120px;transform:rotate(-5deg);', 'boom'); tramp.textContent = 'STOMP STOMP';
fade(tramp, 6.2, 7.5);
tl.to('#hq', { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 7.75);
tl.to('#aerial', { opacity: 1, duration: 0.35, ease: 'power2.inOut' }, 7.75);

// ===================== C · aerial down the boulevard (7.8–12.5) =====================
for (let i = 0; i < 9; i++) { const x = 300 + i * 60 + rnd() * 30, h = 80 + rnd() * 220; mk('rect', A({ x: x, y: 560 - h, width: 40 + rnd() * 30, height: h, fill: '#1E1A44', 'stroke-width': 3 }), '#towers');
  for (let yy = 560 - h + 14; yy < 545; yy += 24) mk('rect', { x: x + 8, y: yy, width: 18, height: 10, fill: rnd() < .5 ? '#FFD58A' : '#7CF0FF', opacity: .8 }, '#towers'); }
mk('circle', { cx: 700, cy: 300, r: 40, fill: '#7CF0FF', opacity: .9, stroke: '#1D1530', 'stroke-width': 3 }, '#towers');
// buildings on both sides, warm-lit (Kryeministria side left)
mk('polygon', A({ points: '-300,300 470,520 470,600 -300,1720', fill: '#C9874E' }), '#lBuild');
for (let i = 0; i < 9; i++) { const k = i / 9, x = -260 + 700 * k, top = 330 + 200 * k, bot = 1660 - 1080 * k;
  for (let yy = top + 20; yy < bot - 30; yy += (bot - top) / 7) mk('rect', { x: x, y: yy, width: 50 - 30 * k, height: (bot - top) / 12, fill: '#FFD58A', opacity: .9 }, '#lBuild'); }
mk('polygon', A({ points: '1380,420 610,560 610,620 1380,1580', fill: '#B0A8C8' }), '#rBuild');
for (let i = 0; i < 7; i++) { const k = i / 7, x = 1310 - 680 * k, top = 450 + 110 * k, bot = 1520 - 900 * k;
  for (let yy = top + 20; yy < bot - 30; yy += (bot - top) / 6) mk('rect', { x: x, y: yy, width: 46 - 26 * k, height: (bot - top) / 11, fill: '#FFD58A', opacity: .85 }, '#rBuild'); }
for (let i = 0; i < 10; i++) { const k = 1 - i / 10, y = 600 + 1320 * k * k, dx = 60 + 640 * k;   // lamps + trees on the edges
  mk('circle', { cx: 540 - dx, cy: y - 40 * k, r: 50 * k + 10, fill: 'url(#glowW)' }, '#lamps'); mk('circle', { cx: 540 + dx, cy: y - 40 * k, r: 50 * k + 10, fill: 'url(#glowW)' }, '#lamps');
  if (i % 2) { mk('circle', A({ cx: 540 - dx - 70 * k, cy: y - 80 * k, r: 70 * k + 12, fill: '#1F4D3A', 'stroke-width': 3 }), '#treesA'); mk('circle', A({ cx: 540 + dx + 70 * k, cy: y - 80 * k, r: 70 * k + 12, fill: '#1F4D3A', 'stroke-width': 3 }), '#treesA'); } }
// the crowd: rows from far to near
const ROWS = 34, waveRows = [];
for (let r = 0; r < ROWS; r++) {
  const k = (r + 1) / ROWS, y = 590 + 1340 * Math.pow(k, 1.7), half = 50 + 640 * k, s = 0.12 + 0.95 * k;
  const rowG = mk('g', {}, '#crowdA'); waveRows.push({ g: rowG, k: k });
  const n = Math.round(half * 2 / (34 * s));
  for (let i = 0; i < n; i++) {
    const x = 540 - half + (i + rnd() * 0.6) * (half * 2 / n), roll = rnd();
    mk('circle', { cx: x, cy: y, r: 13 * s, fill: roll < .5 ? '#1D1530' : SKIN[Math.floor(rnd() * 4)] }, rowG);
    if (roll > .7) { mk('ellipse', { cx: x, cy: y - 34 * s, rx: 16 * s, ry: 9 * s, fill: '#FF6FAE' }, rowG); mk('circle', { cx: x + 10 * s, cy: y - 58 * s, r: 5 * s, fill: '#FF6FAE' }, rowG); }
    else if (roll > .66) mk('circle', { cx: x, cy: y - 30 * s, r: 4 * s + 1, fill: '#FFFFFF' }, rowG);
  }
  if (r % 9 === 4) { const bw = 220 * s; mk('rect', { x: 540 + (r % 2 ? 160 : -380) * k, y: y - 70 * s, width: bw, height: 50 * s, fill: '#F6E7CF', stroke: '#1D1530', 'stroke-width': 2 * s }, rowG);
    flamingo(rowG, 540 + (r % 2 ? 160 : -380) * k + bw / 2, y - 66 * s, 0.35 * s); }
}
// the orange river of Claudes flowing up the middle
for (let i = 0; i < 70; i++) {
  const lane = (rnd() * 2 - 1), sz = 1;
  const c = mk('rect', { x: -12, y: -12, width: 24, height: 24, fill: '#F5873A', stroke: '#1D1530', 'stroke-width': 3, opacity: 0 }, '#river');
  const t0 = 7.9 + rnd() * 3.6, dur = 2.2;
  const pos = function (k) { return { x: 540 + lane * (40 + 300 * k), y: 590 + 1340 * Math.pow(k, 1.7), s: 0.25 + 1.3 * k }; };
  const a = pos(1.05), b = pos(0.25);
  tl.set(c, { x: a.x, y: a.y, scale: a.s, opacity: 1 }, t0);
  tl.to(c, { x: b.x, y: b.y, scale: b.s, duration: dur, ease: twos(dur) }, t0);
  tl.set(c, { opacity: 0 }, t0 + dur);
}
// the flamingo wave: rows hop one after another, near → far
waveRows.slice().reverse().forEach(function (w, i) { tl.to(w.g, { y: -18 * w.k - 3, duration: 0.17, ease: 'steps(2)', yoyo: true, repeat: 1 }, 9.6 + i * 0.045); });
gsap.set('#acam', { svgOrigin: '540 900' });
tl.fromTo('#acam', { scale: 1.25, y: 120 }, { scale: 1.0, y: 0, duration: 4.6, ease: 'power2.out', immediateRender: false }, 7.8);
const t2 = div('#hud', 'top:1500px;font-size:118px;line-height:.95;color:#FF6FAE;text-shadow:8px 8px 0 #FFE14D;transform:rotate(-4deg);', 'boom'); t2.innerHTML = 'FLAMINGO<br>REVOLUTION';
fade(t2, 10.6);
// caption
const cap = div('#hud', 'top:150px;', 'capbox'); cap.textContent = '7:00 PM · kryeministria';
tl.set(cap, { opacity: 0 }, 0);
tl.fromTo(cap, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'steps(3)', immediateRender: false }, 0.2);
