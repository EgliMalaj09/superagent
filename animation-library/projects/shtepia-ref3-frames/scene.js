// static style frames: build coins, calendar grid and crowd
const NS = 'http://www.w3.org/2000/svg';
const mk = function (p, tag, a) { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
const coins = function (svg, cx, base, n, rx) {
  for (let i = 0; i < n; i++) { const y = base - i * 26, dx = (rnd() - .5) * 8;
    mk(svg, 'rect', { x: cx - rx + dx, y: y - 22, width: rx * 2, height: 22, fill: 'url(#coinside)' });
    mk(svg, 'ellipse', { cx: cx + dx, cy: y - 22, rx: rx, ry: rx * .32, fill: 'url(#cointop)' }); }
};
const R = $('#coinsR'); coins(R, 110, 880, 26, 90); coins(R, 250, 860, 18, 70);
const Lc = $('#coinsL'); coins(Lc, 150, 690, 16, 110);
const grid = $('#cgrid'); for (let i = 0; i < 28; i++) { const d = document.createElement('i'); if (i < 19) d.className = 'x'; grid.appendChild(d); }
const C = $('#crowdsvg');
const rows = [[0, 300, .75], [80, 250, 1.0], [180, 160, 1.3]];
rows.forEach(function (r, ri) { const n = ri === 2 ? 4 : 7;
  for (let i = 0; i < n; i++) { const s = r[2] * (0.85 + rnd() * .3), w = 120 * s, h = 320 * s, x = (i + .5) * (1080 / n) - w / 2 + (rnd() - .5) * 60;
    const u = mk(C, 'use', { href: '#person', x: x, y: r[1] + (rnd() * 30), width: w, height: h, fill: 'url(#crowd)' }); u.style.opacity = (0.55 + ri * .2); } });
