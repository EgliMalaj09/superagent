  // ===== part 8: water, railway, Rama's quote, the answer =====
  const T = { tirana: 0.05, pa: 1.03, uje: 2.1, rail: 3.29, hek: 4.3, sepse: 5.36, rama: 6.1, q0: 7.14, q1: 8.06, q2: 9.83, q3: 11.22,
              por: 12.2, sh: 14.23, eshte: 15.23, shq: 15.6, end: 18.2 };
  const slam = function (sel, a, b, ir) {
    tl.fromTo(sel, { opacity: 0, scale: 1.05, y: 18 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out', immediateRender: !!ir }, a);
    if (b) tl.to(sel, { opacity: 0, duration: 0.3, ease: 'power1.inOut' }, b - 0.3);
  };
  const flash = function (t) {};
  const shake = function (t) {};
  const up = function (sel, t) { tl.fromTo(sel, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, t); };
  const off = function (sels, t) { tl.to(sels, { opacity: 0, duration: 0.28 }, t); };
  tl.fromTo('#cam8', { scale: 1 }, { scale: 1.04, duration: T.end, ease: 'none', immediateRender: true }, 0);
  // 1 · Tirana without normal drinking water: the tap drips, then dries up
  slam('#w0', T.tirana, null, true); flash(T.tirana);
  tl.fromTo('#tap', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, 0.4);
  (function () {
    const box = document.getElementById('drops');
    for (let i = 0; i < 3; i++) {
      const d = document.createElement('i'); d.className = 'drop'; d.style.left = '242px'; d.style.top = '210px'; box.appendChild(d);
      tl.fromTo(d, { y: 0, opacity: 0 }, { keyframes: [{ opacity: 1, duration: 0.08 }, { y: 200, duration: 0.5, ease: 'power2.in' }, { opacity: 0, duration: 0.05 }], immediateRender: false }, 0.6 + i * 0.45);
    }
  })();
  tl.fromTo('#tapx', { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2)', immediateRender: false }, T.uje);
  up('#w1', T.pa);
  tl.fromTo('#w1 .blk', { scaleX: 0.2 }, { scaleX: 1, duration: 0.25, ease: 'power4.out', immediateRender: false }, T.uje); flash(T.uje);
  off(['#w0', '#tap', '#w1'], T.rail - 0.1);
  // 2 · no modern railway: the track draws, then breaks
  tl.fromTo('#rail', { opacity: 0 }, { opacity: 1, duration: 0.15, immediateRender: false }, T.rail);
  tl.fromTo(['#rl', '#rr'], { strokeDashoffset: 680 }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out', immediateRender: false }, T.rail);
  (function () {
    const g = document.getElementById('sleepers');
    for (let i = 0; i < 9; i++) {
      const y = 680 - i * 72, k = 1 - i * 0.085, half = 210 * k;
      const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      r.setAttribute('x', 540 - half); r.setAttribute('y', y); r.setAttribute('width', half * 2); r.setAttribute('height', 14 * k + 4); r.setAttribute('fill', '#6b4a33'); r.setAttribute('opacity', '0');
      g.appendChild(r);
      tl.fromTo(r, { opacity: 0 }, { opacity: 1, duration: 0.1, immediateRender: false }, T.rail + i * 0.07);
    }
  })();
  tl.fromTo('#railx', { opacity: 0 }, { opacity: 1, duration: 0.15, immediateRender: false }, T.hek); flash(T.hek); shake(T.hek);
  up('#r1', T.rail + 0.1);
  tl.fromTo('#r1 .blk', { scaleX: 0.2 }, { scaleX: 1, duration: 0.25, ease: 'power4.out', immediateRender: false }, T.hek);
  off(['#rail', '#r1'], T.sepse - 0.1);
  // 3 · "because according to Edi Rama:"
  slam('#e0', T.sepse, T.q0 - 0.05); flash(T.rama);
  // the quote, line by line on the voice
  tl.fromTo('#qm', { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'power4.out', immediateRender: false }, T.q0 - 0.05);
  [['#q0', T.q0], ['#q1', T.q1], ['#q2', T.q2], ['#q3', T.q3]].forEach(function (q) {
    tl.fromTo(q[0], { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'expo.out', immediateRender: false }, q[1]);
  });
  flash(T.q1); shake(T.q1 + 0.05);
  up('#qs', T.q3 + 0.3);
  off(['#qq'], T.por - 0.1);
  // 4 · "but the Albanians have an answer:"
  slam('#p0', T.por, T.sh - 0.05); flash(T.por);
  // final: over the flag
  tl.fromTo('#fin', { opacity: 0 }, { opacity: 1, duration: 0.25, immediateRender: false }, T.sh - 0.1);
  tl.fromTo('#fflag', { scale: 1.15, x: 0 }, { scale: 1.0, x: 60, duration: T.end - T.sh, ease: 'power1.out', immediateRender: false }, T.sh - 0.1);
  tl.to('#bar', { opacity: 0, duration: 0.2 }, T.sh - 0.1);
  slam('#f0', T.sh); slam('#f1', T.eshte); slam('#f2', T.shq); flash(T.shq);
