// ===== epara · 10 s promo: cash → card → rewards → 0% ATM → business QR → end card =====
const ins = function (sel, t, d) { tl.fromTo(sel, { opacity: 0, y: 40, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: d || 0.45, ease: 'power3.out', immediateRender: false }, t); };
const outs = function (sel, t, d) { tl.to(sel, { opacity: 0, y: -30, filter: 'blur(8px)', duration: d || 0.3, ease: 'power2.in' }, t); };
// pseudo QR (seeded) with three finder squares
const qr = $('#qr');
for (let r = 0; r < 29; r++) for (let c = 0; c < 29; c++) {
  const f = function (x, y) { return r >= y && r < y + 7 && c >= x && c < x + 7; };
  let on = rnd() < 0.48;
  [[0, 0], [22, 0], [0, 22]].forEach(function (p) { if (f(p[0], p[1])) { const rr = r - p[1], cc = c - p[0]; on = (rr === 0 || rr === 6 || cc === 0 || cc === 6) || (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4); } });
  const i = document.createElement('i'); i.style.background = on ? '#1A1060' : 'transparent'; qr.appendChild(i);
}
tl.fromTo('.o1', { x: 0, y: 0 }, { x: 160, y: 220, duration: 10, ease: 'sine.inOut', immediateRender: true }, 0);
tl.fromTo('.o2', { x: 0, y: 0 }, { x: -140, y: -260, duration: 10, ease: 'sine.inOut', immediateRender: true }, 0);

// 1 · better than cash (0–1.6)
ins('#h1', 0.1);
tl.fromTo('#note', { opacity: 0, scale: 0.9, rotation: -6 }, { opacity: 1, scale: 1, rotation: -3, duration: 0.4, ease: 'power3.out', immediateRender: false }, 0.1);
tl.to('#note', { scaleX: 0.15, scaleY: 0.7, rotation: 12, opacity: 0, filter: 'blur(6px)', duration: 0.45, ease: 'power3.in' }, 0.75);
tl.fromTo('#card', { opacity: 0, rotationY: -90, scale: 0.8 }, { opacity: 1, rotationY: 0, scale: 1, duration: 0.55, ease: 'back.out(1.4)', immediateRender: false }, 1.05);
outs('#h1', 1.5);

// 2 · rewards on every payment (1.6–3.6)
ins('#h2', 1.65);
tl.to('#card', { y: -330, scale: 0.55, rotationX: 18, duration: 0.5, ease: 'power3.inOut' }, 1.6);
tl.fromTo('#phone', { opacity: 0, y: 700 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', immediateRender: false }, 1.7);
tl.to('#card', { opacity: 0, duration: 0.25 }, 2.0);
tl.fromTo('#tap', { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 0.8, duration: 0.25, ease: 'power2.out', immediateRender: false }, 2.4);
tl.to('#tap', { opacity: 0, scale: 1.3, duration: 0.25 }, 2.65);
tl.fromTo('#payBtn', { scale: 1 }, { scale: 0.94, duration: 0.1, yoyo: true, repeat: 1, immediateRender: false }, 2.45);
tl.fromTo('#coin', { opacity: 0, scale: 0.3, x: -120, y: 600 }, { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.45, ease: 'back.out(1.8)', immediateRender: false }, 2.65);
tl.to('#coin', { opacity: 0, scale: 0.4, x: -140, y: -20, duration: 0.3, ease: 'power2.in' }, 3.1);
count('#rw', 120, 145, 3.15, 0.35, function (v) { return Math.round(v); });
outs('#h2', 3.45);

// 3 · 0% ATM fees (3.6–5.6)
tl.to('#phone', { opacity: 0, x: -700, duration: 0.4, ease: 'power3.in' }, 3.5);
ins('#h3', 3.7);
tl.fromTo('#atm', { opacity: 0, x: 700 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out', immediateRender: false }, 3.65);
tl.set('#card', { y: 0, scale: 0.6, rotationX: 0, x: 0 }, 3.6);
tl.fromTo('#card', { opacity: 0, x: 0, y: 700, scale: 0.5, rotation: 0 }, { opacity: 1, y: 160, duration: 0.4, ease: 'power2.out', immediateRender: false }, 3.95);
tl.to('#card', { y: 80, scaleY: 0.04, duration: 0.3, ease: 'power2.in' }, 4.4);
tl.to('#card', { opacity: 0, duration: 0.1 }, 4.65);
tl.fromTo('#rcpt', { opacity: 0, y: -260, scaleY: 0.2, transformOrigin: '50% 0%' }, { opacity: 1, y: 0, scaleY: 1, duration: 0.5, ease: 'power2.out', immediateRender: false }, 4.75);
outs('#h3', 5.45);

// 4 · business QR (5.6–7.6)
tl.to(['#atm', '#rcpt'], { opacity: 0, x: -700, duration: 0.4, ease: 'power3.in' }, 5.5);
tl.set('#scrA', { opacity: 0 }, 5.6); tl.set('#scrB', { opacity: 1 }, 5.6);
tl.fromTo('#phone', { opacity: 0, x: 700 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out', immediateRender: false }, 5.65);
ins('#h4', 5.75); ins('#s4', 5.95);
tl.fromTo('.qrbox', { scale: 0.7 }, { scale: 1, duration: 0.45, ease: 'back.out(1.6)', immediateRender: false }, 5.9);
tl.fromTo('.ok', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.8)', immediateRender: false }, 6.7);
outs(['#h4', '#s4'], 7.4);

// 5 · end card (7.6–10)
tl.to('#phone', { opacity: 0, scale: 0.85, y: 120, duration: 0.4, ease: 'power3.in' }, 7.45);
tl.set('#end', { opacity: 1 }, 7.7);
tl.fromTo('#logoMark', { opacity: 0, scale: 0.4, rotation: -20 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.55, ease: 'back.out(1.7)', immediateRender: true }, 7.7);
tl.fromTo('.wm', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', immediateRender: true }, 7.95);
tl.fromTo('.tg span', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.18, ease: 'power3.out', immediateRender: true }, 8.25);
tl.fromTo(['.dl', '.bkt'], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.12, ease: 'power3.out', immediateRender: true }, 8.85);
tl.fromTo('#sweep', { opacity: 1, x: 0 }, { x: 2200, duration: 0.9, ease: 'power2.inOut', immediateRender: false }, 9.0);
