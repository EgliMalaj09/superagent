// ===== animation-library MOTION KIT — loaded into every page before scene.js. `tl` (paused GSAP timeline), W, H exist already. =====
// Rules baked in: transforms + opacity only (no top/left/width/height tweens), fromTo with immediateRender:false for later entrances,
// seeded random only (never Math.random), soft eases (power3.out 0.3–0.45 s), no shakes, no flashes.
let seed = 5; const rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const E = 'expo.out';
const $ = function (s) { return typeof s === 'string' ? document.querySelector(s) : s; };
const div = function (p, css, cls) { const d = document.createElement('div'); d.style.cssText = css || ''; if (cls) d.className = cls; $(p).appendChild(d); return d; };
const show = function (sel, t) { tl.set(sel, { opacity: 1 }, t); };
const hide = function (sel, t) { tl.set(sel, { opacity: 0 }, t); };
// entrances
const up = function (sel, t, d) { tl.fromTo(sel, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: d || 0.5, ease: E, immediateRender: false }, t); };
const fadeIn = function (sel, t, d) { tl.fromTo(sel, { opacity: 0 }, { opacity: 1, duration: d || 0.4, ease: 'power2.out', immediateRender: false }, t); };
const pop = function (sel, t, d) { tl.fromTo(sel, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: d || 0.45, ease: 'back.out(1.7)', immediateRender: false }, t); };
const slideIn = function (sel, t, from, d) { const v = { opacity: 0 }; v[from === 'left' || from === 'right' ? 'x' : 'y'] = (from === 'left' || from === 'top' ? -1 : 1) * 120;
  tl.fromTo(sel, v, { x: 0, y: 0, opacity: 1, duration: d || 0.45, ease: 'power3.out', immediateRender: false }, t); };
const blurIn = function (sel, t, d) { tl.fromTo(sel, { opacity: 0, filter: 'blur(18px)', scale: 1.06 }, { opacity: 1, filter: 'blur(0px)', scale: 1, duration: d || 0.6, ease: 'power3.out', immediateRender: false }, t); };
const words = function (sel, t, gap) {   // word-by-word reveal: wraps each word of the element in a span
  const el = $(sel); const w = el.textContent.trim().split(/\s+/); el.innerHTML = w.map(function (x) { return '<span style="display:inline-block;opacity:0">' + x + '</span>'; }).join(' ');
  el.querySelectorAll('span').forEach(function (s, i) { tl.fromTo(s, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', immediateRender: false }, t + i * (gap || 0.07)); });
};
// exits
const out = function (sel, t, d) { tl.to(sel, { opacity: 0, y: -20, duration: d || 0.35, ease: 'power2.in' }, t); };
const fadeOut = function (sel, t, d) { tl.to(sel, { opacity: 0, duration: d || 0.35, ease: 'power2.inOut' }, t); };
// emphasis
const hl = function (sel, t) { tl.fromTo(sel, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power2.out', immediateRender: false }, t); };   // .hl > i, .rule
const growY = function (sel, t, d, stagger) { tl.fromTo(sel, { scaleY: 0 }, { scaleY: 1, duration: d || 0.7, ease: 'power3.out', stagger: stagger || 0.08, immediateRender: false }, t); };  // .bar
const stamp = function (sel, t) { tl.fromTo(sel, { scale: 2.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.32, ease: 'power4.in', immediateRender: false }, t); };
const count = function (sel, a, b, t, dur, fmt) {   // fmt e.g. function (v) { return v.toFixed(1) + ' m²'; }
  const el = $(sel); const o = { v: a }; fmt = fmt || function (v) { return Math.round(v).toLocaleString('de-DE'); };
  tl.fromTo(o, { v: a }, { v: b, duration: dur, ease: 'power2.out', immediateRender: false, onUpdate: function () { el.textContent = fmt(o.v); } }, t);
  el.textContent = fmt(a);
};
const typeIn = function (sel, text, t, dur) {   // typewriter: GSAP cannot tween textContent, so drive a proxy
  const el = $(sel); const o = { n: 0 };
  tl.fromTo(o, { n: 0 }, { n: text.length, duration: dur || text.length * 0.04, ease: 'none', immediateRender: false, onUpdate: function () { el.textContent = text.slice(0, Math.round(o.n)); } }, t);
};
const draw = function (path, t, dur) {   // SVG line draw
  const p = $(path); const L = p.getTotalLength(); p.style.strokeDasharray = L;
  tl.fromTo(p, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: dur || 1.2, ease: 'power2.inOut', immediateRender: true }, t);
};
const kenBurns = function (sel, t, dur, from, to) { tl.fromTo(sel, { scale: from || 1.0 }, { scale: to || 1.12, duration: dur, ease: 'none', immediateRender: true }, t); };
const drift = function (sel, t, dur, dx, dy) { tl.to(sel, { x: '+=' + (dx || 0), y: '+=' + (dy || -30), duration: dur, ease: 'none' }, t); };
// scene change inside one page: fade the old layer out while the new one fades in (0.35–0.4 s)
const xfade = function (a, b, t, d) { tl.to(a, { opacity: 0, duration: d || 0.4, ease: 'power2.inOut' }, t); tl.fromTo(b, { opacity: 0 }, { opacity: 1, duration: d || 0.4, ease: 'power2.inOut', immediateRender: false }, t); };
// After the voice-over arrives: retime the whole timeline. pts = [[oldTime, newTime], ...] ascending, e.g. [[0,0],[3.2,2.9],[8,9.4]]
const remap = function (pts) {
  const m = function (s) { for (let i = 1; i < pts.length; i++) if (s <= pts[i][0]) { const a = pts[i - 1], b = pts[i]; return a[1] + (s - a[0]) * (b[1] - a[1]) / (b[0] - a[0]); }
    const a = pts[pts.length - 2], b = pts[pts.length - 1]; return b[1] + (s - b[0]) * (b[1] - a[1]) / (b[0] - a[0]); };
  tl.getChildren(false, true, true).forEach(function (c) { const s = c.startTime(), e = s + c.totalDuration(), ns = m(s); c.startTime(ns); if (c.totalDuration() > 0) c.totalDuration(Math.max(0.001, m(e) - ns)); });
};
