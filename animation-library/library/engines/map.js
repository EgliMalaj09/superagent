// ===== MAP ENGINE (d3 + topojson, offline world map). Needs motion.js. Page needs:
//   <div class="L" style="overflow:hidden"><div id="mcam" style="position:absolute;left:0;top:0;transform-origin:0 0">
//     <svg id="map" width="2400" height="2400"></svg><svg id="routes" width="2400" height="2400" style="position:absolute;left:0;top:0"></svg><div id="pins"></div></div></div>
// usage: const M = makeMap({ center:[20,41], scale:5000, highlight:['008'] });  (ISO numeric ids: 008 Albania, 380 Italy, 300 Greece …)
//        M.pin('tr', 19.82, 41.33, 'Tiranë'); M.route([19.8,41.3],[12.5,41.9], t, dur); M.camTo([19.8,41.3], 1.8, t, dur)
const makeMap = function (o) {
  const world = window.__WORLD__;
  const proj = d3.geoMercator().center(o.center).scale(o.scale).translate([1200, 1200]);
  const path = d3.geoPath(proj);
  const land = topojson.feature(world, world.objects.countries).features;
  d3.select('#map').selectAll('path').data(land).enter().append('path').attr('d', path)
    .attr('fill', function (d) { return (o.highlight || []).indexOf(d.id) >= 0 ? 'var(--accent)' : 'var(--land, #1D3352)'; })
    .attr('stroke', 'var(--border, rgba(255,255,255,.25))').attr('stroke-width', 1.2);
  const P = function (lon, lat) { return proj([lon, lat]); };
  const pin = function (id, lon, lat, label, side) {
    const p = P(lon, lat); const d = div('#pins', 'left:' + (p[0] - 11) + 'px;top:' + (p[1] - 11) + 'px;', 'pin'); d.id = id;
    if (label) { const s = div(d, 'position:absolute;top:-8px;white-space:nowrap;font:700 30px var(--body);color:var(--ink);' + (side === 'l' ? 'right:34px;' : 'left:34px;')); s.setAttribute('data-layout-allow-overflow', ''); s.textContent = label; }
    tl.set(d, { scale: 0 }, 0); return { el: d, p: p, show: function (t) { tl.to(d, { scale: 1, duration: 0.35, ease: 'back.out(2)' }, t); } };
  };
  const route = function (a, b, t, dur, bend) {
    const A = P(a[0], a[1]), B = P(b[0], b[1]), mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2 - (bend == null ? 200 : bend);
    const r = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    r.setAttribute('d', 'M' + A[0] + ' ' + A[1] + ' Q ' + mx + ' ' + my + ' ' + B[0] + ' ' + B[1]); r.setAttribute('class', 'route');
    document.getElementById('routes').appendChild(r); draw(r, t, dur || 1.4); return r;
  };
  const cam = function (pt, s, Y) { return { scale: s, x: W / 2 - s * pt[0], y: (Y || H * 0.43) - s * pt[1] }; };
  const camTo = function (lonlat, s, t, dur, ease, Y) { const v = cam(P(lonlat[0], lonlat[1]), s, Y);
    if (!dur) tl.set('#mcam', v, t || 0); else tl.to('#mcam', Object.assign(v, { duration: dur, ease: ease || 'power2.inOut' }), t); };
  return { P: P, pin: pin, route: route, camTo: camTo, proj: proj };
};
