  // ===== part 5: "Vlora është qyteti ku u ngrit Flamuri i Pavarësisë. Kush do ta shkruajë historinë e saj: vlonjatët, apo vendimet e marra në zyrat e Ramës?" =====
  // T = word times (estimated until the voice arrives; retime here only)
  const T = { flag: 0.0, vlora: 0.07, date: 1.85, museum: 3.5, who: 3.68, story: 4.4, vlon: 5.83, apo: 7.0, rama: 8.3, end: 9.9 };
  const slam = function (sel, a, b, ir) {
    tl.fromTo(sel, { opacity: 0, scale: 1.05, y: 18 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out', immediateRender: !!ir }, a);
    if (b) tl.to(sel, { opacity: 0, duration: 0.3, ease: 'power1.inOut' }, b - 0.3);
  };
  const flash = function (t) {};
  tl.fromTo('#cam5', { scale: 1 }, { scale: 1.04, duration: T.end, ease: 'none', immediateRender: true }, 0);
  // the flag rises over Vlora
  tl.fromTo('#f0', { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: true }, T.flag);
  tl.fromTo('#flag', { y: 0 }, { y: -400, duration: 2.0, ease: 'power2.out', immediateRender: true }, T.flag);
  tl.fromTo('#flag', { skewY: 0, scaleX: 1 }, { keyframes: [{ skewY: 3, scaleX: 0.96 }, { skewY: -2, scaleX: 1 }, { skewY: 2, scaleX: 0.97 }, { skewY: 0, scaleX: 1 }], duration: 3.4, ease: 'sine.inOut', immediateRender: false }, T.flag + 0.2);
  slam('#f1', T.vlora, null, true); flash(T.vlora);
  tl.fromTo('#f2', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out', immediateRender: false }, T.date);
  tl.to(['#f0', '#f1', '#f2'], { opacity: 0, duration: 0.28 }, T.museum - 0.1);
  // the museum project
  tl.fromTo('#mu', { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out', immediateRender: false }, T.museum); flash(T.museum);
  tl.fromTo('#mui', { scale: 1 }, { scale: 1.12, duration: T.end - T.museum, ease: 'none', immediateRender: false }, T.museum);
  tl.fromTo('#k0', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, T.who);
  tl.fromTo('#k0 .R', { color: '#1D1C1A' }, { color: '#C8202F', duration: 0.15, immediateRender: false }, T.story);
  tl.to('#k0', { opacity: 0, duration: 0.28 }, T.vlon - 0.12);
  // the choice
  tl.to('#mu', { y: -60, scale: 0.86, duration: 0.4, ease: 'power3.inOut' }, T.vlon - 0.2);
  slam('#c0', T.vlon);
  tl.fromTo('#c1', { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, T.apo);
  slam('#c2', T.rama); flash(T.rama);
  tl.fromTo('#c2g', { x: 0, opacity: 0.35 }, { x: 9, opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, T.rama);
