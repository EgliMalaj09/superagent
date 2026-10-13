// static style frames: coins + calendar grid
const NS = 'http://www.w3.org/2000/svg';
const mk = function (p, tag, a) { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
const coins = function (svg, cx, base, n, rx) {
  for (let i = 0; i < n; i++) { const y = base - i * 26, dx = (rnd() - .5) * 8;
    mk(svg, 'rect', { x: cx - rx + dx, y: y - 22, width: rx * 2, height: 22, fill: 'url(#coinside)' });
    mk(svg, 'ellipse', { cx: cx + dx, cy: y - 22, rx: rx, ry: rx * .32, fill: 'url(#cointop)' }); }
};
coins($('#coinsR'), 110, 760, 24, 90); coins($('#coinsR'), 240, 740, 15, 66);
coins($('#coinsL'), 150, 560, 15, 110);
const grid = $('#cgrid'); for (let i = 0; i < 28; i++) { const d = document.createElement('i'); if (i < 19) d.className = 'x'; grid.appendChild(d); }
