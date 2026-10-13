  // ===== C: dark news / kinetic type =====
  const slam = function (sel, a, b) {
    tl.fromTo(sel, { opacity: 0, scale: 1.05, y: 18 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out', immediateRender: a === 0 }, a);
    if (b) tl.to(sel, { opacity: 0, duration: 0.3, ease: 'power1.inOut' }, b - 0.3);
  };
  const glitch = function (r, b, t) {
    tl.fromTo(r, { x: 0, opacity: 0.35 }, { x: -9, opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, t);
    if (b) tl.fromTo(b, { x: 0, opacity: 0.35 }, { x: 9, opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, t);
  };
  const flash = function (t) {};
  slam('#w0', 0, 1.55); glitch('#w0r', '#w0b', 0.5); flash(0.5);
  tl.fromTo('#ccam', { scale: 1 }, { scale: 1.06, duration: 10.4, ease: 'none', immediateRender: true }, 0);
  slam('#w1', 1.6, 2.5); flash(1.6);
  slam('#w2', 2.5, 3.95);
  tl.fromTo('#w2 img', { scale: 1.2 }, { scale: 1, duration: 1.4, ease: 'power2.out', immediateRender: false }, 2.5);
  slam('#w3', 4.0, 5.75);
  tl.fromTo('#w3b', { backgroundColor: 'rgba(255,210,63,0)', color: '#1D1C1A' }, { backgroundColor: 'rgba(255,210,63,1)', color: '#000', duration: 0.15, immediateRender: false }, 4.95);
  tl.set('#w4', { opacity: 1 }, 5.8);
  [['#w4a', 6.85], ['#w4b', 7.3], ['#w4c', 7.74]].forEach(function (w) { tl.fromTo(w[0], { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power4.out', immediateRender: false }, w[1]); });
  tl.fromTo('#w4d', { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, 8.1);
  tl.to('#w4', { opacity: 0, duration: 0.1 }, 8.6);
  slam('#w5', 8.7); flash(9.65); glitch('#w5b', null, 9.65);
  tl.fromTo('#cnr', { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, 0.6);
  tl.fromTo('#bar', { x: -1080 }, { x: 0, duration: 0.45, ease: 'expo.out', immediateRender: true }, 0.2);
  flash(10.38);
