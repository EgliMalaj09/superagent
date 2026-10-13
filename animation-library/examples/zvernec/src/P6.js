  // ===== part 6: next project — Kushner in Zvërnec; Kushner & Netanyahu; ICC warrant =====
  const T = { tani: 0.05, radhes: 0.95, cut1: 2.3, kushner: 2.4, qytet: 4.0, sazan: 5.0, zvernec: 6.3, proj: 7.58, mijera: 8.5, njesi: 9.3,
              cut2: 10.62, mbes: 11.2, netan: 13.7, gjyk: 15.2, mandat: 17.75, end: 20.0 };
  let seed = 21; const rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const slam = function (sel, a, b, ir) {
    tl.fromTo(sel, { opacity: 0, scale: 1.05, y: 18 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out', immediateRender: !!ir }, a);
    if (b) tl.to(sel, { opacity: 0, duration: 0.3, ease: 'power1.inOut' }, b - 0.3);
  };
  const glitch = function (s, t) { tl.fromTo(s, { x: 0, opacity: 0.35 }, { x: 9, opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, t); };
  const flash = function (t) {};
  const shake = function (t) {};
  const frameIn = function (sel, t) { tl.fromTo(sel, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out', immediateRender: false }, t); };
  tl.fromTo('#cam6', { scale: 1 }, { scale: 1.04, duration: T.end, ease: 'none', immediateRender: true }, 0);
  // 1 · "Dhe tani… projekti i radhës."
  slam('#a0', T.tani, T.radhes - 0.05, true);
  slam('#a1', T.radhes, T.cut1); glitch('#a1g', T.radhes); flash(T.radhes);
  // 2 · Kushner wants to build a city opposite Sazan, in Zvërnec — thousands of units
  flash(T.cut1); tl.fromTo('#cnr', { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, T.cut1);
  frameIn('#fk', T.kushner); tl.fromTo('#fki', { scale: 1 }, { scale: 1.1, duration: 3, ease: 'none', immediateRender: false }, T.kushner);
  tl.fromTo('#tk', { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, T.kushner + 0.3);
  tl.fromTo('#b0', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, 3.2);
  tl.fromTo('#b0 > div:last-child', { scale: 1.3 }, { scale: 1, duration: 0.2, ease: 'power4.out', immediateRender: false }, T.qytet);
  tl.to('#b0', { opacity: 0, duration: 0.28 }, T.sazan - 0.1);
  frameIn('#fz', T.sazan - 0.05); flash(T.sazan - 0.05);
  tl.fromTo('#fzi', { scale: 1.05, x: 0 }, { scale: 1.22, x: -40, duration: 5.6, ease: 'none', immediateRender: false }, T.sazan - 0.05);
  tl.fromTo('#tz', { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, T.sazan + 0.3);
  tl.fromTo('#b1', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, T.sazan);
  tl.fromTo('#b1 .blk', { scaleX: 0.15 }, { scaleX: 1, duration: 0.25, ease: 'power4.out', immediateRender: false }, T.zvernec);
  tl.to('#b1', { opacity: 0, duration: 0.28 }, T.proj - 0.1);
  tl.fromTo('#c0', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, T.proj);
  tl.fromTo('#c0 .R', { scale: 1.6 }, { scale: 1, duration: 0.2, ease: 'power4.out', immediateRender: false }, T.mijera); glitch('#c0g', T.mijera); flash(T.mijera);
  (function () {                                       // "thousands of units": white blocks fill the render
    const box = document.getElementById('units');
    for (let i = 0; i < 160; i++) {
      const u = document.createElement('i'); u.className = 'unit';
      u.style.left = (40 + rnd() * 870) + 'px'; u.style.top = (210 + rnd() * 230) + 'px';
      box.appendChild(u);
      tl.fromTo(u, { opacity: 0, scale: 0 }, { opacity: 0.9, scale: 1, duration: 0.15, ease: 'back.out(2)', immediateRender: false }, T.mijera + rnd() * 1.6);
    }
  })();
  tl.to(['#fz', '#units', '#c0', '#fk'], { opacity: 0, duration: 0.28 }, T.cut2 - 0.1);
  // 3 · Kushner backs Netanyahu, who has an ICC arrest warrant
  flash(T.cut2); shake(T.cut2);
  frameIn('#fn', T.cut2); tl.fromTo('#fni', { scale: 1 }, { scale: 1.1, duration: 9, ease: 'none', immediateRender: false }, T.cut2);
  tl.fromTo('#tn0', { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, T.cut2 + 0.3);
  tl.fromTo('#tn1', { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, T.netan - 0.1);
  tl.set('#bt1', { opacity: 0 }, T.cut2); tl.set('#bt2', { opacity: 1 }, T.cut2);
  tl.fromTo('#d0', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, T.mbes);
  tl.fromTo('#d0 > div:last-child', { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: 'power4.out', immediateRender: false }, T.netan);
  tl.to('#d0', { opacity: 0, duration: 0.28 }, T.gjyk - 0.1);
  slam('#d1', T.gjyk); flash(T.gjyk);
  tl.to('#fni', { filter: 'grayscale(1) brightness(.55)', duration: 0.4 }, T.mandat - 0.1);
  tl.fromTo('#stp', { opacity: 0, scale: 1.5, rotation: -12 }, { opacity: 1, scale: 1, rotation: -7, duration: 0.35, ease: 'power3.out', immediateRender: false }, T.mandat);
  flash(T.mandat + 0.25); shake(T.mandat + 0.25);
  tl.fromTo('#d2', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out', immediateRender: false }, T.mandat + 0.5);
