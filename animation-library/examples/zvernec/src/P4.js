  // ===== part 4: 2025, rabbi Pinto in Vlorë, the museum idea, the quote (Jerusalem Post) =====
  const slam = function (sel, a, b, ir) {
    tl.fromTo(sel, { opacity: 0, scale: 1.05, y: 18 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out', immediateRender: !!ir }, a);
    if (b) tl.to(sel, { opacity: 0, duration: 0.3, ease: 'power1.inOut' }, b - 0.3);
  };
  const glitch = function (s, t, dx) { tl.fromTo(s, { x: 0, opacity: 0.35 }, { x: (dx || 22) * 0.4, opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, t); };
  const flash = function (t) {};
  tl.fromTo('#cam4', { scale: 1 }, { scale: 1.04, duration: 23.2, ease: 'none', immediateRender: true }, 0);
  tl.fromTo('#cnr', { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, 0.4);
  // 2025 · the rabbi · visits Vlorë
  slam('#y0', 0.05, 2.1, true); glitch('#y0g', 0.05); flash(0.05);
  slam('#r0', 2.15, 4.45); flash(2.15);
  slam('#v0', 4.5, 5.65);
  tl.fromTo('#v0 .blk', { scaleX: 0.2 }, { scaleX: 1, duration: 0.25, ease: 'power4.out', immediateRender: false }, 4.85);
  // the photo: who is in it, then the museum
  tl.fromTo('#ph', { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out', immediateRender: false }, 5.7); flash(5.7);
  tl.fromTo('#phi', { scale: 1.0, x: 0 }, { scale: 1.12, x: 30, duration: 7.6, ease: 'none', immediateRender: false }, 5.7);
  tl.fromTo('#tg0', { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, 5.95);
  tl.fromTo('#tg1', { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, 5.85);
  tl.fromTo('#m0', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, 6.6);
  slam('#m1', 7.9, 9.3); glitch('#m1g', 7.9); flash(7.9);
  tl.to('#m0', { opacity: 0, duration: 0.28 }, 9.2);
  // "together with the rabbi, Rama expresses the idea that Albania should become:"
  tl.to('#ph', { y: -90, scale: 0.62, duration: 0.5, ease: 'power3.inOut' }, 9.3);
  tl.to(['#tg0', '#tg1'], { opacity: 0, duration: 0.2 }, 9.3);
  tl.fromTo('#b0', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, 9.5);
  tl.fromTo('#b1', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out', immediateRender: false }, 10.7);
  slam('#b2', 11.65); flash(11.65);
  tl.to(['#b0', '#b1', '#b2'], { opacity: 0, duration: 0.28 }, 13.25);
  tl.to('#ph', { y: -110, scale: 0.45, opacity: 0.35, duration: 0.4, ease: 'power3.inOut' }, 13.2);
  // the quote, phrase by phrase on the voice
  tl.fromTo('#qm', { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'power4.out', immediateRender: false }, 13.3);
  [['#l0', 13.45], ['#l1', 14.4], ['#l2', 15.9], ['#l3', 17.07], ['#l4', 19.02], ['#l5', 20.75]].forEach(function (l) {
    tl.fromTo(l[0], { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'expo.out', immediateRender: false }, l[1]);
  });
  tl.fromTo('#l5 .blk', { backgroundColor: 'rgba(255,210,63,0)', color: '#1D1C1A' }, { backgroundColor: 'rgba(255,210,63,1)', color: '#000', duration: 0.15, immediateRender: false }, 21.4);
  flash(21.4);
  tl.fromTo('#qs', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out', immediateRender: false }, 19.6);
