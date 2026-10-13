// ===== SA VJET PËR NJË SHTËPI · chrome & frosted glass, black → grey → white. Placeholder timing (≈61 s); remap to the voice later. =====
const NS = 'http://www.w3.org/2000/svg';
const mk = function (p, tag, a) { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
const coins = function (svg, cx, base, n, rx) {
  const g = mk(svg, 'g', {});
  for (let i = 0; i < n; i++) { const y = base - i * (rx * .26), dx = (rnd() - .5) * rx * .08;
    mk(g, 'rect', { x: cx - rx + dx, y: y - rx * .22, width: rx * 2, height: rx * .22, fill: 'url(#coinside)' });
    mk(g, 'ellipse', { cx: cx + dx, cy: y - rx * .22, rx: rx, ry: rx * .32, fill: 'url(#cointop)' }); }
  return g;
};
// soft focus-pull in/out (the reference's main text move)
const fin = function (sel, t, d) { tl.fromTo(sel, { opacity: 0, filter: 'blur(14px)', scale: 1.04 }, { opacity: 1, filter: 'blur(0px)', scale: 1, duration: d || 0.5, ease: 'power3.out', immediateRender: false }, t); };
const fout = function (sel, t, d) { tl.to(sel, { opacity: 0, filter: 'blur(14px)', duration: d || 0.4, ease: 'power2.in' }, t); };
const on = function (sel, t) { tl.set(sel, { opacity: 1 }, t); };
const de = function (v) { return Math.round(v).toLocaleString('de-DE'); };

// ---------- build ----------
const g3 = coins($('#coins3'), 120, 450, 12, 100);
const cR1 = coins($('#cR'), 110, 900, 26, 90), cR2 = coins($('#cR'), 245, 880, 17, 66), cL1 = coins($('#cL'), 150, 680, 16, 110);
const cg = $('#cg'); for (let i = 0; i < 28; i++) { const d = document.createElement('i'); if (i < 19) d.className = 'x'; cg.appendChild(d); }
const months = [];
for (let i = 0; i < 12; i++) {
  const s = mk($('#months'), 'svg', { width: 140, height: 260 }); s.style.position = 'absolute';
  s.style.left = (75 + (i % 6) * 155) + 'px'; s.style.top = (Math.floor(i / 6) * 270) + 'px'; s.style.overflow = 'visible';
  coins(s, 70, 250, 7, 55); months.push(s);
}
const C = $('#crowdsvg');
[[0, 300, .75], [80, 250, 1.0], [180, 160, 1.3]].forEach(function (r, ri) { const n = ri === 2 ? 4 : 7;
  for (let i = 0; i < n; i++) { const s = r[2] * (0.85 + rnd() * .3), w = 120 * s, h = 320 * s, x = (i + .5) * (1080 / n) - w / 2 + (rnd() - .5) * 60;
    const u = mk(C, 'use', { href: '#person', x: x, y: r[1] + rnd() * 30, width: w, height: h, fill: 'url(#crowd)' }); u.style.opacity = 0.55 + ri * .2; } });

// 3D poses
tl.set('#ph1', { rotationY: -18, rotationX: 6 }, 0);
tl.set('#ph2', { x: 70, y: -30, z: -150, rotationY: -18, rotationX: 6 }, 0);
tl.set('#ph3', { x: 130, y: -70, z: -300, rotationY: -18, rotationX: 6 }, 0);
tl.set(['#ph2', '#ph3'], { opacity: 0 }, 0);
tl.set('#plan svg', { rotationX: 50, transformOrigin: '50% 60%' }, 0);
tl.set(['#c19 svg', '#c26 svg', '#lc19 svg', '#col26b'], { scaleY: 0, transformOrigin: '50% 100%' }, 0);
tl.set(['#cR', '#cL'], { scaleY: 0, transformOrigin: '50% 100%' }, 0);
tl.set('#key6', { opacity: 0 }, 0);

// ---------- background ramp + ambience ----------
tl.fromTo('#rings', { scale: 0.85, rotation: 0 }, { scale: 1.15, rotation: 25, duration: 61, ease: 'none', immediateRender: true }, 0);
tl.fromTo('#bk1', { x: 0, y: 0 }, { x: -60, y: 90, duration: 61, ease: 'none', immediateRender: true }, 0);
tl.fromTo('#bk2', { x: 0, y: 0 }, { x: 80, y: -60, duration: 61, ease: 'none', immediateRender: true }, 0);
tl.fromTo('#bk3', { x: 0, y: 0 }, { x: -40, y: -120, duration: 61, ease: 'none', immediateRender: true }, 0);
tl.to('#bgG', { opacity: 0.55, duration: 2.5, ease: 'power1.inOut' }, 22.0);
tl.to('#bgG', { opacity: 1, duration: 2.0, ease: 'power1.inOut' }, 30.4);
tl.to('#bgW', { opacity: 1, duration: 2.6, ease: 'power1.inOut' }, 54.8);
tl.to('#fx', { opacity: 0, duration: 2.0 }, 54.8);

// ---------- 1 · hook: the photo splits into 3 layers, the camera dives in, SA VJET? prints on the banner ----------
const BX = 590, BY = 925;                                       // banner centre (screen px) = the dive target
tl.set(['#hFar', '#hMid', '#hNear'], { transformOrigin: BX + 'px ' + BY + 'px' }, 0);
tl.fromTo('#hNear', { scale: 1.06, x: 0 }, { scale: 1.75, x: -240, y: 60, duration: 3.6, ease: 'power2.in', immediateRender: true }, 0.0);      // near: moves most, leaves past the lens
tl.to('#hNear', { opacity: 0, filter: 'blur(10px)', duration: 0.6, ease: 'power1.in' }, 3.0);
tl.fromTo('#hMid', { scale: 1.04 }, { scale: 1.55, duration: 3.9, ease: 'power2.inOut', immediateRender: true }, 0.25);                          // middle: the block + banner
tl.fromTo('#hFar', { scale: 1.03 }, { scale: 1.14, duration: 4.0, ease: 'power1.inOut', immediateRender: true }, 0.4);                          // far: moves least
['#hFar', '#hMid'].forEach(function (s, i) { tl.fromTo(s, { y: 0 }, { y: i ? -3 : 2, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 7, immediateRender: false }, 0.2 + i * 0.13); });   // slight jitter
fin('#hcap', 0.3, 0.6);
tl.fromTo('#banTxt span', { opacity: 0, filter: 'blur(6px)', scale: 1.15 }, { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 0.45, stagger: 0.25, ease: 'power3.out', immediateRender: true }, 2.2);   // printed onto the banner
fout('#hcap', 3.7, 0.4);
// the dive continues through the banner into black, where the chrome world begins
tl.to('#hMid', { scale: 4.2, duration: 0.9, ease: 'power2.in' }, 3.9);
tl.to('#hFar', { scale: 1.4, duration: 0.9, ease: 'power2.in' }, 3.9);
tl.to('#hcam', { opacity: 0, filter: 'blur(14px)', duration: 0.6, ease: 'power2.in' }, 4.2);
tl.to(['#hGrain', '#hVig', '.ilu'], { opacity: 0, duration: 0.4 }, 4.3);
tl.set('#hook', { background: 'rgba(0,0,0,0)' }, 4.75);
on('#phones', 4.4);
tl.fromTo('#ph1', { z: -1600, rotationY: -55, opacity: 0, filter: 'blur(20px)' }, { z: 0, rotationY: -18, opacity: 1, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out', immediateRender: false }, 4.5);
tl.to('#ph1', { rotationY: -10, duration: 6, ease: 'none' }, 5.9);

// ---------- 2 · price per m² ----------
fin('#cp2', 4.6);
fin('#n2', 4.8); count('#n2v', 0, 2141, 4.9, 1.6, de); fin('#l2', 5.1);
tl.fromTo('#ph2', { opacity: 0, x: 400 }, { opacity: 0.8, x: 70, duration: 0.8, ease: 'power3.out', immediateRender: false }, 5.2);
tl.fromTo('#ph3', { opacity: 0, x: 500 }, { opacity: 0.55, x: 130, duration: 0.8, ease: 'power3.out', immediateRender: false }, 5.5);
fout('#phones', 7.6, 0.5);
on('#cols', 7.7);
tl.to('#c19 svg', { scaleY: 1, duration: 0.9, ease: 'power3.out' }, 7.9);
tl.to('#c26 svg', { scaleY: 1, duration: 1.1, ease: 'power3.out' }, 8.4);
pop('#rek', 9.4);
fout('#cols', 10.7); fout(['#cp2', '#n2', '#l2'], 10.7);

// ---------- 3 · salary → doormat ----------
on('#s3', 11.0); tl.set('#s3 .floor', { opacity: 0 }, 0);
fin('#cp3', 11.0);
tl.fromTo('#coins3', { y: -420, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', immediateRender: false }, 11.2);
fin('#n3', 11.4); fin('#l3', 11.6);
fout(['#cp3', '#n3', '#l3'], 14.1);
fin('#cp3b', 14.3);
tl.to('#coins3', { opacity: 0, y: 120, scale: 0.6, duration: 0.6, ease: 'power2.in' }, 14.3);
fin('#s3 .floor', 14.4, 0.6);
tl.fromTo('#corner', { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out', immediateRender: true }, 15.0);
tl.fromTo('#mat', { z: 260, opacity: 0 }, { z: 0, opacity: 1, duration: 0.7, ease: 'power3.out', immediateRender: true }, 15.4);
fin('#n3b', 15.6); fin('#l3b', 15.9);
fout('#s3', 17.7); fout(['#cp3b', '#n3b', '#l3b'], 17.7);

// ---------- 4 · one year → bathroom ----------
on('#s4', 18.0); tl.set('#bath', { opacity: 0 }, 0);
fin('#cp4', 18.0);
months.forEach(function (m, i) { tl.fromTo(m, { y: -260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', immediateRender: true }, 18.15 + i * 0.12); });
tl.to('#months', { opacity: 0, scale: 0.8, filter: 'blur(12px)', duration: 0.5, ease: 'power2.in' }, 19.9);
tl.fromTo('#bath', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', immediateRender: false }, 20.1);
fin('#n4', 19.8); fin('#l4', 20.1);
fout('#s4', 21.7); fout(['#cp4', '#n4', '#l4'], 21.7);

// ---------- 5 · the apartment, 8 years ----------
on('#plan', 22.0); tl.set('#plan svg', { opacity: 0 }, 0);
fin('#cp5', 22.0);
tl.fromTo('#plan svg', { opacity: 0, rotationX: 70, y: 80 }, { opacity: 1, rotationX: 50, y: 0, duration: 1.0, ease: 'power3.out', immediateRender: false }, 22.1);
fin('#n5', 22.4); count('#n5v', 0, 171000, 22.5, 1.8, de); fin('#l5', 22.7);
fout('#plan', 25.6); fout(['#cp5', '#n5', '#l5'], 25.6);
on('#s56', 25.8); tl.set(['#s56 .ped', '#cal', '#pencil'], { opacity: 0 }, 0);
fin('#cp5b', 25.8);
fin(['#s56 .ped', '#cal'], 25.9, 0.6); fin('#pencil', 26.3);
const yr = { v: 0 };
const flip = function (t, from, to, dur) { tl.fromTo(yr, { v: from }, { v: to, duration: dur, ease: 'power1.inOut', immediateRender: false, onUpdate: function () { $('#calY').textContent = 2026 + Math.round(yr.v); } }, t); };
flip(26.3, 0, 8, 2.4);
tl.to(['#cR', '#cL'], { scaleY: 1, duration: 2.4, ease: 'power1.inOut' }, 26.3);
fin('#n5b', 26.7); fin('#l5b', 27.0);
fout(['#cp5b', '#n5b', '#l5b'], 30.2);

// ---------- 6 · real life: 27 years, 25 → 52 ----------
fin('#cp6', 30.4);
tl.to(['#cR', '#cL'], { scaleY: 0.33, duration: 1.0, ease: 'power2.inOut' }, 30.6);
fin('#n6', 32.2); fin('#l6', 32.5);
flip(33.0, 0, 27, 4.6);
count('#n6v', 0, 27, 33.0, 4.6, function (v) { return Math.round(v); });
tl.to(['#cR', '#cL'], { scaleY: 1, duration: 4.6, ease: 'power1.inOut' }, 33.0);
tl.fromTo('#pencil', { rotation: -6 }, { rotation: 6, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 8, immediateRender: false }, 33.0);
fout(['#cp6', '#n6', '#l6'], 37.8);
fin('#cp6b', 38.0);
fin('#n6b', 38.0); count('#n6bv', 25, 52, 38.2, 1.4, function (v) { return Math.round(v); }); fin('#l6b', 38.3);
tl.fromTo('#key6', { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', immediateRender: false }, 39.5);
fout('#s56', 40.4); fout(['#cp6b', '#n6b', '#l6b'], 40.4);

// ---------- 7 · minimum wage ----------
on('#s7', 40.6);
fin('#cp7', 40.6);
tl.fromTo('#wheel', { rotation: -140, scale: 0.7, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out', immediateRender: false }, 40.7);
tl.to('#seg4d', { opacity: 0.85, duration: 0.5 }, 42.4);
fin('#n7', 42.4); fin('#l7', 42.7);
fout(['#n7', '#l7'], 44.2);
fin('#n7b', 44.4); fin('#l7b', 44.8);
tl.to('#wheel', { scale: 0.62, y: 60, duration: 3.0, ease: 'none' }, 45.0);
fout('#s7', 47.8); fout(['#cp7', '#n7b', '#l7b'], 47.8);

// ---------- 8 · prices since 2019 (columns to scale: 77.000 vs 171.000) ----------
on('#s8', 48.0); tl.set(['#lc19', '#lc26'], { opacity: 0 }, 0);
fin('#cp8', 48.0);
fin('#lc19', 48.6); tl.to('#lc19 svg', { scaleY: 1, duration: 0.9, ease: 'power3.out' }, 48.7);
fin('#lc26', 49.6); tl.to('#col26b', { scaleY: 1, duration: 1.2, ease: 'power3.out' }, 49.8);
fin('#n8', 51.6); fin('#l8', 51.9);
fout('#s8', 54.6); fout(['#cp8', '#n8', '#l8'], 54.6);

// ---------- 9 · close: a generation, one key ----------
on('#s9', 55.0); tl.set(['#keyG', '#crowdsvg'], { opacity: 0 }, 0);
fin('#cp9', 55.2);
tl.fromTo('#crowdsvg', { y: 260, opacity: 0 }, { y: 0, opacity: 1, duration: 2.2, ease: 'power3.out', immediateRender: false }, 55.4);
fin('#keyG', 56.2, 0.7);
tl.fromTo(['#keyG', '#keyY'], { y: 0 }, { y: -24, duration: 4.8, ease: 'sine.inOut', immediateRender: false }, 56.2);
tl.to('#keyY', { opacity: 1, duration: 1.6, ease: 'power1.inOut' }, 57.6);
tl.to('#glowY', { opacity: 1, duration: 1.6, ease: 'power1.inOut' }, 57.6);
fout('#cp9', 57.8);
fin('#fin', 58.0, 0.6);
fin('#srcs', 59.0);
