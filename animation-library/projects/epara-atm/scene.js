// ===== epara · Any ATM in Albania. 0 commission. (11.5 s) =====
const ins = function (sel, t, d) { tl.fromTo(sel, { opacity: 0, y: 40, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: d || 0.4, ease: 'power3.out', immediateRender: false }, t); };
const outs = function (sel, t, d) { tl.to(sel, { opacity: 0, y: -30, filter: 'blur(8px)', duration: d || 0.3, ease: 'power2.in' }, t); };
tl.fromTo('.o1', { x: 0, y: 0 }, { x: 180, y: 260, duration: 11.5, ease: 'sine.inOut', immediateRender: true }, 0);
tl.fromTo('.o2', { x: 0, y: 0 }, { x: -200, y: -300, duration: 11.5, ease: 'sine.inOut', immediateRender: true }, 0);

// camera on the ATM strip: show ATM i centred at scale s (screen centre y = cy)
const cam = function (i, s, t, d, ease, cy) {
  const cx = i === null ? 1540 : i * 640 + 260; const v = { x: 540 - cx * s, y: (cy || 1000) - 500 * s, scale: s };
  if (!d) tl.set('#strip', v, t); else tl.to('#strip', Object.assign(v, { duration: d, ease: ease || 'power3.inOut' }), t);
};
tl.set('.rc', { scaleY: 0, opacity: 0 }, 0);
tl.set('#card', { opacity: 0 }, 0);

// 1 · Any ATM in Albania (0–2.0): all five different ATMs side by side
cam(null, 0.34, 0, 0, null, 1150);
tl.fromTo('.atm', { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.09, ease: 'power3.out', immediateRender: true }, 0.05);
tl.set('#h1', { opacity: 1 }, 0.1);
tl.fromTo('#h1 span', { opacity: 0, y: 40, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, stagger: 0.22, ease: 'power3.out', immediateRender: true }, 0.1);
cam(null, 0.36, 0.6, 1.2, 'none', 1150);
outs('#h1', 1.85);

// 2 · 0 commission: the card goes into one ATM after another, every receipt says 0,00 ALL
const ATM = [[0, 2.05, 0.5], [1, 3.95, 0.35], [2, 4.65, 0.28], [3, 5.2, 0.25]];   // [atm, start, speed]
ins('#h2', 2.1);
ATM.forEach(function (a, k) {
  const i = a[0], t = a[1], sp = a[2];
  cam(i, 1, t, k ? sp : 0.55, 'power3.inOut', 1000);
  const tc = t + (k ? sp : 0.5);
  tl.fromTo('#card', { opacity: 1, y: 0, scaleY: 1 }, { y: -610, duration: sp * 0.8, ease: 'power3.out', immediateRender: false }, tc);           // rises to the slot (top 890)
  tl.to('#card', { scaleY: 0.02, duration: sp * 0.5, ease: 'power2.in' }, tc + sp * 0.8);                                                         // slides in
  tl.set('#card', { opacity: 0 }, tc + sp * 1.3);
  tl.fromTo('.atm.a' + i + ' .rc', { scaleY: 0, opacity: 1 }, { scaleY: 1, opacity: 1, duration: sp * 0.9, ease: 'power2.out', immediateRender: false }, tc + sp * 1.35);
});
tl.set('#card', { y: 0, scaleY: 1 }, 5.95);
// pull back: all ATMs, all receipts 0,00 ALL
tl.set('.atm.a4 .rc', { scaleY: 1, opacity: 1 }, 5.95);
cam(null, 0.34, 5.95, 0.6, 'power3.inOut', 1150);
outs('#h2', 6.4);

// 3 · All over Albania (6.3–8.6): map, pins light up city by city
const NS = 'http://www.w3.org/2000/svg';
const mk = function (p, tag, a) { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
const svg = $('#map');
const defs = mk(svg, 'defs', {}); const lg = mk(defs, 'linearGradient', { id: 'alg', x1: 0, y1: 0, x2: 1, y2: 1 });
mk(lg, 'stop', { offset: '0', 'stop-color': '#6A21E7' }); mk(lg, 'stop', { offset: '1', 'stop-color': '#3A2783' });
const al = topojson.feature(window.__WORLD__, window.__WORLD__.objects.countries).features.find(function (f) { return f.id === '008'; });
const proj = d3.geoMercator().fitExtent([[230, 560], [850, 1560]], al);
mk(svg, 'path', { d: d3.geoPath(proj)(al), class: 'al' });
const CITIES = [['Tiranë', 19.82, 41.33, 1], ['Durrës', 19.45, 41.32, -1], ['Shkodër', 19.51, 42.07, 1], ['Elbasan', 20.08, 41.11, 1], ['Vlorë', 19.49, 40.47, -1],
  ['Korçë', 20.78, 40.62, 1], ['Fier', 19.56, 40.72, -1], ['Berat', 19.95, 40.70, 1], ['Lezhë', 19.64, 41.78, -1], ['Kukës', 20.42, 42.08, 1], ['Gjirokastër', 20.14, 40.08, 1], ['Sarandë', 20.00, 39.87, -1]];
const pins = [];
CITIES.forEach(function (c) {
  const p = proj([c[1], c[2]]), g = mk(svg, 'g', { class: 'city' });
  const ring = mk(g, 'circle', { cx: p[0], cy: p[1], r: 16, fill: 'none', stroke: '#1FB979', 'stroke-width': 4 });
  mk(g, 'circle', { cx: p[0], cy: p[1], r: 11, fill: '#fff' });
  const tx = mk(g, 'text', { x: p[0] + 24 * c[3], y: p[1] + 10, 'text-anchor': c[3] > 0 ? 'start' : 'end' }); tx.textContent = c[0];
  pins.push({ g: g, ring: ring });
});
tl.to('#strip', { opacity: 0, scale: 0.28, duration: 0.4, ease: 'power2.in' }, 6.6);
tl.fromTo('#map', { opacity: 0, scale: 1.08, transformOrigin: '540px 1060px' }, { opacity: 1, scale: 1, duration: 0.55, ease: 'power3.out', immediateRender: false }, 6.75);
ins('#h3', 6.8);
pins.forEach(function (p, k) {
  const t = 7.1 + k * 0.1;
  tl.fromTo(p.g, { opacity: 0, scale: 0.4, transformOrigin: 'center' }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)', immediateRender: true }, t);
  tl.fromTo(p.ring, { attr: { r: 14 }, opacity: 1 }, { attr: { r: 46 }, opacity: 0, duration: 0.8, ease: 'power2.out', immediateRender: true }, t + 0.05);
});
outs('#h3', 8.75); tl.to('#map', { opacity: 0, scale: 0.94, duration: 0.4, ease: 'power2.in' }, 8.75);

// 4 · end card (8.8–11.5)
tl.set('#end', { opacity: 1 }, 9.05);
tl.fromTo('#tile', { opacity: 0, scale: 0.7, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(1.5)', immediateRender: true }, 9.05);
tl.fromTo(['.e1', '.e2', '.e3', '.stores', '.bkt'], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.12, ease: 'power3.out', immediateRender: true }, 9.35);
