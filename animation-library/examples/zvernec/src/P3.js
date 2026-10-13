  // ===== part 3: Ana Kohen's claim (2023) + fact-check =====
  const slam = function (sel, a, b, ir) {
    tl.fromTo(sel, { opacity: 0, scale: 1.05, y: 18 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out', immediateRender: !!ir }, a);
    if (b) tl.to(sel, { opacity: 0, duration: 0.3, ease: 'power1.inOut' }, b - 0.3);
  };
  const flash = function (t) {};
  tl.fromTo('#cam3', { scale: 1 }, { scale: 1.04, duration: 23.4, ease: 'none', immediateRender: true }, 0);
  // narrator: "Në vitin 2023, papritur, një hebreje e quajtur Ana Kohen, që ka jetuar në Vlorë, deklaron:" (0–7.5 s)
  slam('#a0', 0, 1.9, true); flash(0);
  slam('#a1', 1.95, 6.7); flash(1.95);
  tl.fromTo('#a1n', { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: 0.18, ease: 'power4.out', immediateRender: false }, 4.25);
  tl.fromTo('#a1v', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.25, ease: 'expo.out', immediateRender: false }, 5.35);
  slam('#a2', 6.7, 7.55);
  // the clip (starts 7.6)
  tl.fromTo('#cl', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, 7.40);
  tl.fromTo('#pl3', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'expo.out', immediateRender: false }, 7.40);
  tl.fromTo('#v3', { scale: 1 }, { scale: 1.08, duration: 13.5, ease: 'none', immediateRender: false }, 7.60);
  [[0, 7.60, 12.30], [1, 12.30, 14.00], [2, 14.00, 17.60], [3, 17.60, 21.10]].forEach(function (u) {
    tl.fromTo('#t' + u[0], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.18, immediateRender: false }, u[1]);
    tl.to('#t' + u[0], { opacity: 0, duration: 0.28 }, u[2] - 0.12);
  });
  tl.fromTo('#kph', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out', immediateRender: false }, 8.00);
  tl.fromTo('#k90', { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)', immediateRender: false }, 16.00);
  tl.fromTo('#k10', { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)', immediateRender: false }, 17.70);
  // verdict: freeze the last frame and stamp it
  tl.set('#v3last', { opacity: 1 }, 21.10);
  tl.to('#v3last', { filter: 'grayscale(1) brightness(.55)', duration: 0.4 }, 21.10);
  tl.fromTo('#stp', { opacity: 0, scale: 1.5, rotation: -12 }, { opacity: 1, scale: 1, rotation: -8, duration: 0.35, ease: 'power3.out', immediateRender: false }, 21.20);
  flash(21.45);
  tl.to('#sb', { opacity: 0, duration: 0.2 }, 21.45);
  tl.to('#k90', { textDecoration: 'line-through', duration: 0.01 }, 21.45);
