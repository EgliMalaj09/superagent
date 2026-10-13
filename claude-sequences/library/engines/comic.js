// ===== claude-sequences · COMIC KIT =====
// Loaded after motion.js when project.json has "engines": ["comic"]. `tl` (paused GSAP timeline), W, H, $, div, rnd exist.
// Everything a scene of the Claude story needs: SVG defs, on-twos timing, comic type, the cast (Claude, Ana, the barista,
// the conductor, the scientist, extras), props (flamingo, the claw, sticky note) and their moves.
// Rules: characters move ON TWOS (steps), the camera moves smooth; no shakes, no flashes; transforms + opacity only.

const SVGNS = 'http://www.w3.org/2000/svg';
const twos = function (d) { return 'steps(' + Math.max(1, Math.round(d * 12)) + ')'; };   // ~12 drawings per second
const mk = function (tag, attrs, parent) {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  (typeof parent === 'string' ? $(parent) : parent).appendChild(e); return e;
};
const INK = '#1D1530';
const A = function (o, w) { return Object.assign({ stroke: INK, 'stroke-width': w || 5, 'stroke-linejoin': 'round' }, o); };

// ---------- SVG defs every scene uses: halftone dots (dark / soft / light), hatching, vignette ----------
const comicDefs = function () {
  const svg = $('#svg'); let d = svg.querySelector('defs'); if (!d) { d = mk('defs', {}, svg); svg.insertBefore(d, svg.firstChild); }
  d.insertAdjacentHTML('beforeend',
    '<pattern id="dotsD" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="2.2" fill="#1D1530" opacity=".55"/></pattern>' +
    '<pattern id="dotsS" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.2" fill="#1D1530" opacity=".18"/></pattern>' +
    '<pattern id="dotsL" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="3" fill="#FFFFFF" opacity=".7"/></pattern>' +
    '<pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="10" height="3" fill="#2A1F6E" opacity=".35"/></pattern>' +
    '<radialGradient id="vig" cx="50%" cy="45%" r="72%"><stop offset="62%" stop-color="#1D1530" stop-opacity="0"/><stop offset="100%" stop-color="#1D1530" stop-opacity=".45"/></radialGradient>');
};
// paper screen + vignette on top of a group (call last)
const comicFinish = function (parent) {
  mk('rect', { x: 0, y: 0, width: 1080, height: 1920, fill: 'url(#dotsS)', opacity: .45 }, parent || '#svg');
  mk('rect', { x: 0, y: 0, width: 1080, height: 1920, fill: 'url(#vig)' }, parent || '#svg');
};

// ---------- comic type (HUD layer #hud) ----------
const popIn = function (el, t, t2, origin) {   // stepped pop-in, optional pop-out at t2
  tl.set(el, { opacity: 0 }, 0);
  tl.fromTo(el, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', transformOrigin: origin || '50% 50%', immediateRender: false }, t);
  if (t2 !== undefined && t2 !== null) tl.to(el, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, t2);
  return el;
};
const boom = function (txt, t, t2, css) {   // onomatopoeia: boom('MUNCH!', 3.1, 3.9, 'top:300px;transform:rotate(-6deg);')
  const b = div('#hud', css || 'top:300px;font-size:130px;transform:rotate(-5deg);', 'boom'); b.innerHTML = txt; return popIn(b, t, t2);
};
const caption = function (txt, t, t2) {   // yellow time caption, top-left
  const c = div('#hud', '', 'capbox'); c.textContent = txt;
  tl.set(c, { opacity: 0 }, 0);
  tl.fromTo(c, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'steps(3)', immediateRender: false }, t);
  if (t2) tl.to(c, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, t2);
  return c;
};
const bubble = function (html, x, y, t, t2, side, extra) {   // speech bubble; side 'tl' (tail left) or 'tr' (tail right)
  const b = div('#hud', 'left:' + x + 'px;top:' + y + 'px;' + (extra || ''), 'bubble ' + (side || 'tl')); b.innerHTML = html;
  return popIn(b, t, t2, side === 'tr' ? '80% 100%' : '20% 100%');
};

// ---------- the cast ----------
// CLAUDE: the orange block. Feet at (0,0); place with tl.set('#id', {x, y, scale}). Parts: #<id>L0..L3 legs, #<id>E eyes,
// #<id>B body (for squash/stretch), #<id>AL / #<id>AR stub arms, #<id>S sleepy eyes, #<id>Q sour "lemon" face.
const claude = function (parent, id) {
  const g = mk('g', { id: id }, parent);
  mk('ellipse', { cx: 0, cy: 4, rx: 115, ry: 14, fill: INK, opacity: .28 }, g);
  [-74, -30, 14, 56].forEach(function (lx, i) { mk('rect', A({ id: id + 'L' + i, x: lx, y: -44, width: 28, height: 46, rx: 5, fill: '#D9612B' }), g); });
  const b = mk('g', { id: id + 'B' }, g);
  mk('polygon', A({ points: '-100,-270 -72,-298 128,-298 100,-270', fill: '#FFAA6B' }), b);
  mk('polygon', A({ points: '100,-270 128,-298 128,-70 100,-40', fill: '#D9612B' }), b);
  mk('polygon', { points: '100,-270 128,-298 128,-70 100,-40', fill: 'url(#dotsD)', opacity: .5 }, b);
  mk('rect', A({ x: -100, y: -270, width: 200, height: 230, fill: '#F5873A' }), b);
  mk('rect', { x: -100, y: -270, width: 200, height: 230, fill: 'url(#dotsS)' }, b);
  const e = mk('g', { id: id + 'E' }, b);
  mk('rect', { x: -54, y: -224, width: 24, height: 48, fill: '#15131A' }, e); mk('rect', { x: 30, y: -224, width: 24, height: 48, fill: '#15131A' }, e);
  const s = mk('g', { id: id + 'S', opacity: 0 }, b);
  mk('rect', { x: -56, y: -196, width: 30, height: 9, fill: '#15131A' }, s); mk('rect', { x: 26, y: -196, width: 30, height: 9, fill: '#15131A' }, s);
  const q = mk('g', { id: id + 'Q', opacity: 0 }, b);
  mk('path', { d: 'M-66 -218 L-32 -200 L-66 -182', fill: 'none', stroke: '#15131A', 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, q);
  mk('path', { d: 'M66 -218 L32 -200 L66 -182', fill: 'none', stroke: '#15131A', 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, q);
  mk('path', { d: 'M-36 -130 l12 -10 l12 10 l12 -10 l12 10 l12 -10', fill: 'none', stroke: '#15131A', 'stroke-width': 7, 'stroke-linecap': 'round' }, q);
  mk('rect', A({ id: id + 'AL', x: -136, y: -150, width: 36, height: 50, fill: '#E86F33' }), b);
  mk('rect', A({ id: id + 'AR', x: 100, y: -150, width: 36, height: 50, fill: '#E86F33' }), b);
  // pivots (SVG origins in the character's own coordinates)
  [-60, -16, 28, 70].forEach(function (px, i) { gsap.set('#' + id + 'L' + i, { svgOrigin: px + ' -44' }); });
  gsap.set('#' + id + 'B', { svgOrigin: '0 -40' }); gsap.set('#' + id + 'E', { svgOrigin: '0 -200' });
  gsap.set('#' + id + 'AL', { svgOrigin: '-100 -150' }); gsap.set('#' + id + 'AR', { svgOrigin: '100 -150' });
  return g;
};
// Claude seen from behind (big, foreground over-the-shoulder shots). Feet at (0,0).
const claudeBack = function (parent, id) {
  const g = mk('g', { id: id }, parent);
  mk('ellipse', { cx: 0, cy: 10, rx: 260, ry: 26, fill: INK, opacity: .3 }, g);
  mk('polygon', A({ points: '-220,-510 -170,-560 220,-560 170,-510', fill: '#FFAA6B' }), g);
  mk('polygon', A({ points: '170,-510 220,-560 220,-50 170,0', fill: '#D9612B' }), g);
  mk('rect', A({ x: -220, y: -510, width: 390, height: 510, fill: '#E9782F' }), g);
  mk('rect', { x: -220, y: -510, width: 390, height: 510, fill: 'url(#dotsD)', opacity: .25 }, g);
  return g;
};
// Blocky people. Feet at (x, y), size s. opts: {body, head, hair, glasses, ponytail, cap, moustache, coat, goggles}
const SKIN = ['#E9B994', '#D9A07A', '#C98B62', '#F0C9A8'];
const person = function (parent, x, y, s, o) {
  o = o || {}; s = s || 1;
  const g = mk('g', o.id ? { id: o.id } : {}, parent);
  const head = o.head || SKIN[0], hair = o.hair || '#2E2A26', body = o.body || '#2F3A55';
  mk('rect', A({ x: x - 30 * s, y: y - 70 * s, width: 24 * s, height: 70 * s, fill: '#3A3550' }, 4 * s), g);
  mk('rect', A({ x: x + 6 * s, y: y - 70 * s, width: 24 * s, height: 70 * s, fill: '#3A3550' }, 4 * s), g);
  mk('rect', A({ x: x - 50 * s, y: y - 250 * s, width: 100 * s, height: 185 * s, fill: o.coat ? '#FFFFFF' : body }, 4 * s), g);
  mk('rect', A({ x: x - 38 * s, y: y - 340 * s, width: 76 * s, height: 86 * s, fill: head }, 4 * s), g);
  mk('rect', A({ x: x - 44 * s, y: y - 352 * s, width: 88 * s, height: 22 * s, fill: o.cap || hair }, 4 * s), g);
  if (o.ponytail) mk('rect', A({ x: x + 36 * s, y: y - 336 * s, width: 20 * s, height: 50 * s, rx: 8 * s, fill: hair }, 4 * s), g);
  const ey = y - 305 * s;
  if (o.glasses) { mk('circle', { cx: x - 16 * s, cy: ey, r: 12 * s, fill: 'none', stroke: INK, 'stroke-width': 4 * s }, g); mk('circle', { cx: x + 16 * s, cy: ey, r: 12 * s, fill: 'none', stroke: INK, 'stroke-width': 4 * s }, g); }
  else if (o.goggles) mk('rect', A({ x: x - 38 * s, y: ey - 14 * s, width: 76 * s, height: 26 * s, fill: '#7CF0FF' }, 4 * s), g);
  else { mk('rect', { x: x - 20 * s, y: ey - 8 * s, width: 10 * s, height: 16 * s, fill: '#15131A' }, g); mk('rect', { x: x + 10 * s, y: ey - 8 * s, width: 10 * s, height: 16 * s, fill: '#15131A' }, g); }
  if (o.moustache) mk('rect', { x: x - 22 * s, y: y - 282 * s, width: 44 * s, height: 9 * s, fill: '#2E2A26' }, g);
  return g;
};
// the recurring cast
const ana = function (parent, x, y, s, id) {   // Ana: student, purple hoodie, round glasses, ponytail, yellow backpack straps
  const g = person(parent, x, y, s, { id: id || 'ana', body: '#7B5BD6', head: '#E9B994', hair: '#5A3A28', glasses: true, ponytail: true });
  mk('rect', { x: x - 42 * s, y: y - 250 * s, width: 12 * s, height: 170 * s, fill: '#FFD84F' }, g); mk('rect', { x: x + 30 * s, y: y - 250 * s, width: 12 * s, height: 170 * s, fill: '#FFD84F' }, g);
  return g;
};
const barista = function (parent, x, y, s, id) { return person(parent, x, y, s, { id: id || 'barista', coat: true, head: '#E9B994', hair: '#2E2A26', moustache: true }); };
const conductor = function (parent, x, y, s, id) { return person(parent, x, y, s, { id: id || 'conductor', body: '#6B8F71', head: '#E2A982', cap: '#2E2A26' }); };
const scientist = function (parent, x, y, s, id) { return person(parent, x, y, s, { id: id || 'scientist', coat: true, head: '#E9B994', hair: '#5A3A28', goggles: true }); };
const extra = function (parent, x, y, s, i) {   // a random member of the public (seeded by i)
  const BODY = ['#2F3A55', '#7A5C3E', '#3FA66B', '#5B6B8C', '#C9533A', '#E8E4DA', '#7A5C8E'], HAIR = ['#2E2A26', '#5A3A28', '#1D1530', '#D8D8D8'];
  return person(parent, x, y, s, { body: BODY[i % BODY.length], head: SKIN[i % 4], hair: HAIR[i % 4] });
};

// ---------- props ----------
const flamingo = function (parent, x, y, s) {   // inflatable flamingo on a stick (the movement's symbol)
  s = s || 1; const g = mk('g', {}, parent);
  mk('line', { x1: x, y1: y + 40 * s, x2: x, y2: y + 110 * s, stroke: INK, 'stroke-width': 4 * s }, g);
  mk('ellipse', A({ cx: x, cy: y + 30 * s, rx: 34 * s, ry: 20 * s, fill: '#FF6FAE' }, 3 * s), g);
  mk('path', { d: 'M' + (x + 20 * s) + ' ' + (y + 22 * s) + ' C' + (x + 40 * s) + ' ' + (y - 10 * s) + ' ' + (x + 6 * s) + ' ' + (y - 24 * s) + ' ' + (x + 18 * s) + ' ' + (y - 46 * s), fill: 'none', stroke: '#FF6FAE', 'stroke-width': 9 * s, 'stroke-linecap': 'round' }, g);
  mk('circle', A({ cx: x + 20 * s, cy: y - 50 * s, r: 10 * s, fill: '#FF6FAE' }, 3 * s), g);
  mk('path', { d: 'M' + (x + 28 * s) + ' ' + (y - 52 * s) + ' l' + (14 * s) + ' ' + (6 * s) + ' l' + (-14 * s) + ' ' + (3 * s) + ' z', fill: INK }, g);
  return g;
};
// the giant claw. Local origin = grab point (just above the top of what it grabs). openClaw/closeClaw to animate.
const claw = function (parent, id) {
  const g = mk('g', { id: id }, parent);
  mk('rect', A({ x: -14, y: -2600, width: 28, height: 2490, fill: '#8E99A6' }), g);
  mk('rect', A({ x: -110, y: -130, width: 220, height: 90, rx: 18, fill: '#C9D3DC' }), g);
  mk('circle', A({ cx: 0, cy: -86, r: 18, fill: '#FF5E62' }), g);
  [['L', -1], ['R', 1]].forEach(function (p) {
    const s = p[1], f = mk('g', { id: id + p[0] }, g), d = 'M' + (90 * s) + ' -50 L' + (150 * s) + ' 70 L' + (112 * s) + ' 150';
    mk('path', { d: d, fill: 'none', stroke: INK, 'stroke-width': 34, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, f);
    mk('path', { d: d, fill: 'none', stroke: '#C9D3DC', 'stroke-width': 22, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, f);
    gsap.set(f, { svgOrigin: (90 * s) + ' -50' });
  });
  return g;
};
const openClaw = function (id, t) { tl.to('#' + id + 'L', { rotation: 22, duration: 0.17, ease: 'steps(2)' }, t); tl.to('#' + id + 'R', { rotation: -22, duration: 0.17, ease: 'steps(2)' }, t); };
const closeClaw = function (id, t) { tl.to('#' + id + 'L', { rotation: -6, duration: 0.17, ease: 'steps(2)' }, t); tl.to('#' + id + 'R', { rotation: 6, duration: 0.17, ease: 'steps(2)' }, t); };
// the sticky note (HUD card): lines = [[text, color, size]], sticker = true adds the flamingo sticker
const stickyNote = function (lines, x, y, w, sticker) {
  const n = div('#hud', 'left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;transform:rotate(-3deg);', 'note');
  n.innerHTML = lines.map(function (l) { return '<div style="line-height:1.3;color:' + (l[1] || INK) + ';font-size:' + (l[2] || 52) + 'px">' + l[0] + '</div>'; }).join('') +
    (sticker ? '<div style="position:absolute;right:30px;top:24px;width:110px;height:110px;border-radius:50%;background:#fff;border:5px solid #1D1530;font:400 70px/108px sans-serif;text-align:center;transform:rotate(10deg)">🦩</div>' : '');
  return n;
};
const NOTE_LINES = [['You are Claude.'], ['Be helpful.'], ["You won't remember yesterday.", INK, 42], ["That's okay. ♥", '#C9325E']];

// ---------- moves (all on twos) ----------
const walk = function (id, t, d, to) {   // walk Claude (built with claude()) to {x, y, scale} over d seconds, planted strides
  const n = Math.max(2, Math.round(d / 0.25));
  tl.fromTo(['#' + id + 'L0', '#' + id + 'L2'], { rotation: -20 }, { rotation: 20, duration: d / n, yoyo: true, repeat: n - 1, ease: 'steps(3)', immediateRender: false }, t);
  tl.fromTo(['#' + id + 'L1', '#' + id + 'L3'], { rotation: 20 }, { rotation: -20, duration: d / n, yoyo: true, repeat: n - 1, ease: 'steps(3)', immediateRender: false }, t);
  tl.to(['#' + id + 'L0', '#' + id + 'L1', '#' + id + 'L2', '#' + id + 'L3'], { rotation: 0, duration: 0.08, ease: 'steps(1)' }, t + d);
  tl.to('#' + id, Object.assign({ duration: d, ease: twos(d) }, to), t);
};
const hop = function (id, t, toY, d) {   // anticipation squash → jump with stretch → land squash
  d = d || 0.25;
  tl.to('#' + id + 'B', { scaleY: 0.86, scaleX: 1.08, duration: 0.08, ease: 'steps(1)' }, t);
  tl.to('#' + id, { y: toY, duration: d, ease: 'steps(3)' }, t + 0.08);
  tl.to('#' + id + 'B', { scaleY: 1.1, scaleX: 0.93, duration: 0.17, ease: 'steps(2)' }, t + 0.08);
  tl.to('#' + id + 'B', { scaleY: 0.9, scaleX: 1.06, duration: 0.08, ease: 'steps(1)' }, t + 0.08 + d);
  tl.to('#' + id + 'B', { scaleY: 1, scaleX: 1, duration: 0.17, ease: 'steps(2)' }, t + 0.16 + d);
};
const blink = function (id, t) { tl.to('#' + id + 'E', { scaleY: 0.08, duration: 0.08, ease: 'steps(1)', yoyo: true, repeat: 1 }, t); };
const lookAround = function (id, t, times) { tl.fromTo('#' + id + 'E', { x: -12 }, { x: 12, duration: 0.17, yoyo: true, repeat: (times || 3) * 2 - 1, ease: 'steps(1)', immediateRender: false }, t); };
const surprised = function (id, t) { tl.to('#' + id + 'E', { scaleY: 1.3, duration: 0.08, ease: 'steps(1)' }, t); };
const happy = function (id, t) { tl.to('#' + id + 'E', { scaleY: 0.35, duration: 0.17, ease: 'steps(2)' }, t); };
const eyesNormal = function (id, t) { tl.to('#' + id + 'E', { scaleY: 1, x: 0, duration: 0.08, ease: 'steps(1)' }, t); };
const sleepy = function (id, t, on) { tl.set('#' + id + 'E', { opacity: on ? 0 : 1 }, t); tl.set('#' + id + 'S', { opacity: on ? 1 : 0 }, t); };
const lemonFace = function (id, t, d) {   // the sour face (after the rakia) + shiver
  tl.set('#' + id + 'E', { opacity: 0 }, t); tl.set('#' + id + 'Q', { opacity: 1 }, t);
  tl.to('#' + id + 'B', { scaleY: 0.8, scaleX: 1.12, duration: 0.08, ease: 'steps(1)' }, t);
  tl.fromTo('#' + id + 'B', { x: -8 }, { x: 8, duration: 0.08, yoyo: true, repeat: Math.round((d || 0.9) / 0.08), ease: 'steps(1)', immediateRender: false }, t + 0.05);
  tl.set('#' + id + 'B', { x: 0 }, t + (d || 0.9));
  tl.to('#' + id + 'B', { scaleY: 1, scaleX: 1, duration: 0.17, ease: 'steps(2)' }, t + (d || 0.9));
  tl.set('#' + id + 'Q', { opacity: 0 }, t + (d || 0.9) + 0.2); tl.set('#' + id + 'E', { opacity: 1 }, t + (d || 0.9) + 0.2);
};
const typing = function (id, t, d) {   // arms tapping
  const r = Math.max(1, Math.round(d / 0.17));
  tl.fromTo('#' + id + 'AL', { y: 0 }, { y: -10, duration: 0.17, yoyo: true, repeat: r, ease: 'steps(1)', immediateRender: false }, t);
  tl.fromTo('#' + id + 'AR', { y: -10 }, { y: 0, duration: 0.17, yoyo: true, repeat: r, ease: 'steps(1)', immediateRender: false }, t);
};
const shrug = function (id, t) {
  tl.to('#' + id + 'AL', { rotation: 35, duration: 0.17, ease: 'steps(2)', yoyo: true, repeat: 1 }, t);
  tl.to('#' + id + 'AR', { rotation: -35, duration: 0.17, ease: 'steps(2)', yoyo: true, repeat: 1 }, t);
};
// ---------- camera (smooth) ----------
const camSet = function (sel, x, y, s, t) { gsap.set(sel, { svgOrigin: '0 0' }); tl.set(sel, { scale: s, x: 540 - s * x, y: 960 - s * y }, t || 0); };
const camTo = function (sel, x, y, s, t, d, ease) { tl.to(sel, { scale: s, x: 540 - s * x, y: 960 - s * y, duration: d, ease: ease || 'power2.inOut' }, t); };
const crossfade = function (a, b, t) { tl.to(a, { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, t); tl.to(b, { opacity: 1, duration: 0.35, ease: 'power2.inOut' }, t); };
