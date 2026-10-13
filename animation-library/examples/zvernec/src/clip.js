  // ===== shared evidence section =====
  tl.fromTo('#cz', { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'none', immediateRender: true }, 10.45);
  tl.fromTo('#jv', { scale: 1.3, opacity: 0, rotation: -6 }, { scale: 1, opacity: 1, rotation: -3, duration: 0.4, ease: 'power3.out', immediateRender: true }, 10.5);
  tl.to('#jv', { scale: 0.9, opacity: 0, duration: 0.2, ease: 'power2.in' }, 11.1);
  tl.fromTo('#czl', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'expo.out', immediateRender: false }, 11.0);
  tl.fromTo('#czc', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'expo.out', immediateRender: false }, 11.15);
  tl.fromTo('#pl', { scale: 0.88, opacity: 0, y: 40 }, { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', immediateRender: false }, 11.05);
  tl.fromTo('#v1', { scale: 1.0 }, { scale: 1.08, duration: 10, ease: 'none', immediateRender: false }, 11.25);
  tl.fromTo('#v2', { scale: 1.0 }, { scale: 1.08, duration: 9.27, ease: 'none', immediateRender: false }, 21.25);
  tl.set('#pv1', { display: 'none' }, 21.25); tl.set('#pv2', { display: 'inline' }, 21.25);
  // captions, one phrase at a time (clip-relative times + clip start)
  [[0, 11.25, 13.1], [1, 13.1, 15.15], [2, 15.15, 17.1], [3, 17.1, 19.05], [4, 19.05, 21.2],
   [5, 21.25, 24.1], [6, 24.1, 26.6], [7, 26.6, 30.5]].forEach(function (u) {
    tl.fromTo('#u' + u[0], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out', immediateRender: false }, u[1]);
    tl.to('#u' + u[0], { opacity: 0, duration: 0.28 }, u[2] - 0.12);
  });
  // key points
  tl.fromTo('#k1h', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out', immediateRender: false }, 11.6);
  [[0, 15.6], [1, 17.3], [2, 19.3]].forEach(function (c) {
    tl.fromTo('#ch' + c[0], { scale: 1.3, opacity: 0, rotation: -4 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.4, ease: 'back.out(1.5)', immediateRender: false }, c[1]);
  });
  tl.to('#kp1 > *', { opacity: 0, y: -20, duration: 0.3, stagger: 0.05, ease: 'power2.in' }, 20.85);
  tl.fromTo('#k2h', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out', immediateRender: false }, 21.6);
  tl.fromTo('#k2b', { scale: 2.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'expo.out', immediateRender: false }, 24.6);
  tl.fromTo('#k2s', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out', immediateRender: false }, 28.7);
