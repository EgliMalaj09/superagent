  // ===== part 7: Rama met Netanyahu after the warrant · emigration · KLSH =====
  const T = { a: 0.1, pas: 2.05, b: 4.05, shp: 4.92, mas: 6.1, c: 7.35, instat: 9.2, pese: 10.76, cdo: 12.8,
              d: 13.6, klsh: 14.8, y2013: 17.6, mld: 20.5, dem: 21.7, korr: 22.64, end: 25.2 };
  const slam = function (sel, a, b, ir) {
    tl.fromTo(sel, { opacity: 0, scale: 1.05, y: 18 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out', immediateRender: !!ir }, a);
    if (b) tl.to(sel, { opacity: 0, duration: 0.3, ease: 'power1.inOut' }, b - 0.3);
  };
  const glitch = function (s, t) { tl.fromTo(s, { x: 0, opacity: 0.35 }, { x: 9, opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, t); };
  const flash = function (t) {};
  const shake = function (t) {};
  const up = function (sel, t) { tl.fromTo(sel, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, t); };
  const off = function (sels, t) { tl.to(sels, { opacity: 0, duration: 0.28 }, t); };
  tl.fromTo('#cam7', { scale: 1 }, { scale: 1.04, duration: T.end, ease: 'none', immediateRender: true }, 0);
  // A · the meeting
  tl.fromTo('#fa', { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out', immediateRender: true }, T.a); flash(T.a);
  tl.fromTo('#fai', { scale: 1 }, { scale: 1.1, duration: 4, ease: 'none', immediateRender: true }, T.a);
  tl.fromTo('#ta0', { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, 0.4);
  tl.fromTo('#ta1', { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, 1.1);
  up('#a0', 0.5);
  tl.fromTo('#a0b', { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: 0.2, ease: 'power4.out', immediateRender: false }, T.pas); flash(T.pas); shake(T.pas);
  tl.fromTo('#tl', { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, 1.4);
  tl.fromTo('#tli', { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.inOut', immediateRender: false }, 1.5);
  up('#a1', 2.6);
  off(['#fa', '#a0', '#tl', '#a1'], T.b - 0.1);
  // B · emigration
  slam('#b0', T.b, T.shp);
  tl.fromTo('#fb', { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out', immediateRender: false }, T.shp); flash(T.shp);
  tl.fromTo('#fbi', { scale: 1.05, y: 0 }, { scale: 1.2, y: -20, duration: 2.6, ease: 'none', immediateRender: false }, T.shp);
  tl.fromTo('#tb', { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, T.shp + 0.3);
  up('#b1', T.shp + 0.1);
  tl.fromTo('#b1 .R', { scale: 1.5 }, { scale: 1, duration: 0.2, ease: 'power4.out', immediateRender: false }, T.mas); glitch('#b1g', T.mas); flash(T.mas);
  off(['#fb', '#b1'], T.c - 0.1);
  // C · 5 Albanians leave every hour
  slam('#c0', T.c); flash(T.c);
  up('#c1', T.instat);
  (function () {                                        // 5 figures walk out of frame, one by one
    const box = document.getElementById('ppl');
    for (let i = 0; i < 5; i++) {
      const p = document.createElement('i'); p.className = 'pp'; p.style.left = (300 + i * 100) + 'px'; p.style.top = '10px'; box.appendChild(p);
      tl.fromTo(p, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.2, ease: 'back.out(2)', immediateRender: false }, T.pese + i * 0.12);
      tl.to(p, { x: 900 - i * 60, opacity: 0, duration: 1.1, ease: 'power2.in' }, T.cdo - 0.2 + i * 0.08);
    }
  })();
  slam('#c2', T.pese); flash(T.pese);
  tl.fromTo('#c2 .blk', { scaleX: 0.2 }, { scaleX: 1, duration: 0.25, ease: 'power4.out', immediateRender: false }, T.cdo);
  up('#c3', T.cdo + 0.2);
  off(['#c0', '#c1', '#c2', '#c3'], T.d - 0.1);
  // D · KLSH
  slam('#d0', T.d, T.klsh);
  slam('#d1', T.klsh); flash(T.klsh);
  up('#d2', T.y2013);
  slam('#d3', T.mld); glitch('#d3g', T.mld); flash(T.mld); shake(T.mld + 0.05);
  up('#d4', T.dem);
  up('#d5', T.korr);
