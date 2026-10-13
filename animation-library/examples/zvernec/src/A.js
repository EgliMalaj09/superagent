  // ===== A: investigative dossier =====
  const typeIn = function (sel, txt, t, dur) {
    const el = document.querySelector(sel); const o = { n: 0 };
    tl.fromTo(o, { n: 0 }, { n: txt.length, duration: dur, ease: 'none', immediateRender: false, onUpdate: function () { el.textContent = txt.slice(0, Math.round(o.n)); } }, t);
  };
  const stamp = function (sel, t, r) { tl.fromTo(sel, { scale: 2.4, opacity: 0, rotation: (r || 0) - 10 }, { scale: 1, opacity: 0.92, rotation: r || 0, duration: 0.22, ease: 'power4.in', immediateRender: false }, t); };
  tl.fromTo('#fold', { y: 900, rotation: -6 }, { y: 0, rotation: -1.5, duration: 0.7, ease: 'expo.out', immediateRender: true }, 0);
  tl.fromTo('#pap', { y: 900, rotation: 4 }, { y: 0, rotation: 0.8, duration: 0.75, ease: 'expo.out', immediateRender: true }, 0.08);
  tl.fromTo('#hdr', { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, 0.35);
  stamp('#s2022', 0.48, -9);
  typeIn('#locx', '📍 JERUSALEM', 1.6, 0.6);
  tl.fromTo('#pol', { y: -500, rotation: 14, opacity: 0 }, { y: 0, rotation: -4, opacity: 1, duration: 0.55, ease: 'back.out(1.4)', immediateRender: false }, 2.5);
  [['#fj0', 4.0], ['#fj1', 4.5], ['#fj2', 4.95]].forEach(function (f) { tl.fromTo(f[0], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.15, immediateRender: false }, f[1]); });
  tl.fromTo('#mk', { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut', immediateRender: false }, 5.2);
  tl.fromTo('#note', { x: 500, rotation: 12, opacity: 0 }, { x: 0, rotation: 3, opacity: 1, duration: 0.5, ease: 'expo.out', immediateRender: false }, 5.9);
  [6.85, 7.3, 7.75, 8.15, 8.5].forEach(function (t, i) { tl.fromTo('#n' + i, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.15, immediateRender: false }, t); });
  tl.fromTo('#cl0', { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, 8.65);
  typeIn('#cl1', '„… janë ndërtuar nga hebrenjtë.”', 8.7, 1.2);
  tl.set('#cl1', { opacity: 1 }, 8.7);
  stamp('#spr', 9.75, -6);
  tl.fromTo('#iacam', { scale: 1.0, x: 0, y: 0 }, { scale: 1.05, x: 0, y: -20, duration: 4.5, ease: 'sine.inOut', immediateRender: false }, 0.5);
  tl.to('#iacam', { scale: 1.08, x: 0, y: -90, duration: 4.0, ease: 'power2.inOut' }, 5.6);
  tl.to('#flick', { keyframes: [{ opacity: 1, duration: 0.05 }, { opacity: 0, duration: 0.1 }, { opacity: 0.7, duration: 0.05 }, { opacity: 0, duration: 0.2 }] }, 3.3);
  tl.to('#iacam', { y: -1400, rotation: -4, duration: 0.45, ease: 'power3.in' }, 10.3);
