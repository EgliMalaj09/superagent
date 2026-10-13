  // ===== part 3B: Ana Kohen asks for a Jewish museum in Vlorë =====
  const slam = function (sel, a, b, ir) {
    tl.fromTo(sel, { opacity: 0, scale: 1.05, y: 18 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out', immediateRender: !!ir }, a);
    if (b) tl.to(sel, { opacity: 0, duration: 0.3, ease: 'power1.inOut' }, b - 0.3);
  };
  const flash = function (t) {};
  tl.fromTo('#cam3b', { scale: 1 }, { scale: 1.03, duration: 15.4, ease: 'none', immediateRender: true }, 0);
  slam('#a0', 0.05, 3.5, true);
  tl.fromTo('#a0 .blk', { scaleX: 0.2 }, { scaleX: 1, duration: 0.4, ease: 'power3.out', immediateRender: false }, 0.9);
  tl.fromTo('#cl', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', immediateRender: false }, 3.4);
  tl.fromTo('#pl3', { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out', immediateRender: false }, 3.35);
  tl.fromTo('#v3', { scale: 1 }, { scale: 1.06, duration: 11.1, ease: 'none', immediateRender: false }, 3.6);
  [[0, 3.6, 5.85], [1, 5.85, 9.0], [2, 9.0, 12.0], [3, 12.0, 14.75]].forEach(function (u) {
    tl.fromTo('#t' + u[0], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.25, immediateRender: false }, u[1]);
    tl.to('#t' + u[0], { opacity: 0, duration: 0.2 }, u[2] - 0.2);
  });
  tl.fromTo('#kph', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', immediateRender: false }, 4.0);
  tl.fromTo('#k90', { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.6)', immediateRender: false }, 4.8);
  tl.fromTo('#k10', { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.6)', immediateRender: false }, 8.3);
  tl.set('#v3last', { opacity: 1 }, 14.72);
