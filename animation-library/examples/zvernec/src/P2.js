  // ===== part 2: "Por kjo nuk është e vërtetë. Orikumi dokumentohet ... nga Hekateu i Miletit." =====
  const slam = function (sel, a, b, ir) {
    tl.fromTo(sel, { opacity: 0, scale: 1.05, y: 18 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out', immediateRender: !!ir }, a);
    if (b) tl.to(sel, { opacity: 0, duration: 0.3, ease: 'power1.inOut' }, b - 0.3);
  };
  const glitch = function (s, t, dx) { tl.fromTo(s, { x: 0, opacity: 0.35 }, { x: (dx || 22) * 0.4, opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, t); };
  const flash = function (t) {};
  tl.fromTo('#cam2', { scale: 1 }, { scale: 1.05, duration: 8.3, ease: 'none', immediateRender: true }, 0);
  // the claim, struck through on "nuk"
  slam('#q', 0, 1.6, true); flash(0.0);
  tl.fromTo('#qs', { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power3.out', immediateRender: false }, 0.32);
  slam('#n1', 0.3, 1.6); slam('#n2', 0.8, 1.6); glitch('#n2g', 0.8); flash(0.8);
  // Orikumi + documented
  slam('#o1', 1.67); glitch('#o1g', 1.67, -22); flash(1.67);
  tl.fromTo('#o2', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power4.out', immediateRender: false }, 2.45);
  tl.to('#o1', { y: -40, scale: 0.7, duration: 0.45, ease: 'power3.inOut' }, 3.3);
  tl.to('#o2', { y: -70, scale: 0.85, duration: 0.45, ease: 'power3.inOut' }, 3.3);
  tl.to(['#o1', '#o2'], { opacity: 0, duration: 0.28 }, 5.85);
  // timeline: back to the 6th century BC
  tl.fromTo('#tln', { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, 3.35);
  tl.fromTo('#tlb', { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: 'power3.inOut', immediateRender: false }, 3.35);
  tl.fromTo('#tdot', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)', immediateRender: false }, 4.25);
  slam('#t1', 4.23, 5.85); flash(4.23);
  tl.set('#t1', { y: 0 }, 0);
  tl.fromTo('#t2', { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, 3.45);
  (function () { const el = document.getElementById('ty'); const o = { v: 0 };
    tl.fromTo(o, { v: 0 }, { v: 2500, duration: 1.4, ease: 'power2.out', immediateRender: false, onUpdate: function () { el.textContent = (o.v >= 2499 ? 'Mbi ' : '') + Math.round(o.v).toLocaleString('en-US'); } }, 3.45); })();
  tl.to(['#tln', '#t2'], { opacity: 0, duration: 0.28 }, 5.85);
  // Hecataeus + source
  slam('#h1', 6.0); flash(6.0);
  tl.fromTo('#src', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out', immediateRender: false }, 6.5);
