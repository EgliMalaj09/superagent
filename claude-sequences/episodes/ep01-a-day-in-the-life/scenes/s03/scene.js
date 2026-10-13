// SCENE 3 · 0–6 s · breakfast → leaving home. Claude walks in from the left, the toast pops, Claude jumps and catches it,
// walks to the table, sits, eats (3 bites), then gets up and leaves through the front door. Character on twos.
const NSV = 'http://www.w3.org/2000/svg';
const twos = function (d) { return 'steps(' + Math.max(1, Math.round(d * 12)) + ')'; };
const LEGS = ['#legA', '#legB', '#legC', '#legD'];
gsap.set('#legA', { svgOrigin: '-67 -44' }); gsap.set('#legB', { svgOrigin: '-21 -44' });
gsap.set('#legC', { svgOrigin: '25 -44' }); gsap.set('#legD', { svgOrigin: '69 -44' });
gsap.set('#cbody', { svgOrigin: '0 -40' }); gsap.set('#eyes', { svgOrigin: '0 -200' });
gsap.set('#armL', { svgOrigin: '-104 -150' }); gsap.set('#armR', { svgOrigin: '104 -150' });
const walkLegs = function (t, d) {
  const n = Math.max(2, Math.round(d / 0.25));
  tl.fromTo(['#legA', '#legC'], { rotation: -20 }, { rotation: 20, duration: d / n, yoyo: true, repeat: n - 1, ease: 'steps(3)', immediateRender: false }, t);
  tl.fromTo(['#legB', '#legD'], { rotation: 20 }, { rotation: -20, duration: d / n, yoyo: true, repeat: n - 1, ease: 'steps(3)', immediateRender: false }, t);
  tl.to(LEGS, { rotation: 0, duration: 0.08, ease: 'steps(1)' }, t + d);
};

// ---------- 1 · walk in from the left (0–1.0) ----------
tl.set('#claude', { x: -220, y: 1400, scale: 0.92 }, 0);
tl.to('#claude', { x: 595, duration: 1.0, ease: twos(1.0) }, 0);   // right up to the counter, under the toaster
walkLegs(0, 1.0);
// ---------- 2 · POP (1.0): the toast pops up; Claude jumps straight up and grabs it from the toaster ----------
tl.to('#flyToast', { y: -170, duration: 0.25, ease: 'steps(3)' }, 1.0);
tl.to('#cbody', { scaleY: 0.86, scaleX: 1.08, duration: 0.08, ease: 'steps(1)' }, 1.05);              // anticipation
tl.to('#claude', { y: 1030, duration: 0.25, ease: 'steps(3)' }, 1.13);                                 // jump up to the toast
tl.to('#cbody', { scaleY: 1.12, scaleX: 0.92, duration: 0.17, ease: 'steps(2)' }, 1.13);              // stretch (smear)
tl.to(['#armL', '#armR'], { rotation: function (i) { return i ? -50 : 50; }, duration: 0.17, ease: 'steps(2)' }, 1.2);
tl.set('#flyToast', { opacity: 0 }, 1.38); tl.set('#heldToast', { opacity: 1 }, 1.38);                // grabbed
tl.to('#claude', { y: 1400, duration: 0.25, ease: 'steps(3)' }, 1.38);                                 // drop back down
tl.to('#cbody', { scaleY: 0.88, scaleX: 1.08, duration: 0.08, ease: 'steps(1)' }, 1.63);              // land squash
tl.to('#cbody', { scaleY: 1, scaleX: 1, duration: 0.17, ease: 'steps(2)' }, 1.71);
// ---------- 3 · walk to the table and sit (2.1–3.0) ----------
tl.to('#claude', { x: 540, y: 1540, scale: 1, duration: 0.8, ease: twos(0.8) }, 2.1);   // onto the chair, behind the centred table
walkLegs(2.1, 0.8);
tl.to('#cbody', { scaleY: 0.92, duration: 0.17, ease: 'steps(2)' }, 2.95);                             // sits
// ---------- 4 · eat: three bites, crumbs, MUNCH (3.15–4.3) ----------
[[3.15, '#b1'], [3.55, '#b2'], [3.95, '#b3']].forEach(function (b) {
  tl.set(b[1], { opacity: 1 }, b[0]);
  tl.to('#cbody', { scaleY: 0.86, duration: 0.08, ease: 'steps(1)', yoyo: true, repeat: 1 }, b[0]);    // chomp
  for (let i = 0; i < 4; i++) {
    const c = document.createElementNS(NSV, 'rect');
    c.setAttribute('x', 40); c.setAttribute('y', -140); c.setAttribute('width', 12); c.setAttribute('height', 10);
    c.setAttribute('fill', '#E7A55C'); c.setAttribute('stroke', '#1D1530'); c.setAttribute('stroke-width', 2); c.setAttribute('opacity', 0);
    $('#crumbs').appendChild(c);
    const a = rnd();
    tl.set(c, { opacity: 1 }, b[0]);
    tl.to(c, { x: 30 + a * 120, y: 60 + rnd() * 90, rotation: a * 200, duration: 0.42, ease: 'steps(5)' }, b[0]);
    tl.to(c, { opacity: 0, duration: 0.08, ease: 'steps(1)' }, b[0] + 0.42);
  }
});
tl.set('#heldToast', { opacity: 0 }, 4.32);
tl.to('#eyes', { scaleY: 0.35, duration: 0.17, ease: 'steps(2)' }, 4.3);                               // happy squint
tl.to(['#armL', '#armR'], { rotation: 0, duration: 0.17, ease: 'steps(2)' }, 4.3);
// ---------- 5 · get up and leave through the front door (4.6–5.8) ----------
tl.to('#eyes', { scaleY: 1, duration: 0.08, ease: 'steps(1)' }, 4.6);
tl.to('#cbody', { scaleY: 1, duration: 0.08, ease: 'steps(1)' }, 4.6);
tl.to('#claude', { x: 990, y: 1420, scale: 0.88, duration: 0.6, ease: twos(0.6) }, 4.62);   // to the front door on the right wall
walkLegs(4.62, 0.6);
tl.to('#door', { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 5.05);
tl.to('#claude', { x: 1010, y: 1400, scale: 0.76, duration: 0.25, ease: 'steps(3)' }, 5.25);
tl.to('#claude', { opacity: 0, duration: 0.08, ease: 'steps(1)' }, 5.5);
tl.to('#door', { opacity: 1, duration: 0.17, ease: 'steps(2)' }, 5.65);
// ---------- comic type ----------
const pop1 = div('#hud', 'top:300px;left:300px;right:0;transform:rotate(8deg);font-size:130px;', 'boom'); pop1.textContent = 'POP!';
tl.set(pop1, { opacity: 0 }, 0);
tl.fromTo(pop1, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', immediateRender: false }, 1.0);
tl.to(pop1, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 1.7);
const munch = div('#hud', 'top:300px;left:0;right:200px;transform:rotate(-7deg);font-size:130px;', 'boom'); munch.textContent = 'MUNCH!';
tl.set(munch, { opacity: 0 }, 0);
tl.fromTo(munch, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', immediateRender: false }, 3.15);
tl.to(munch, { scale: 1.08, duration: 0.08, ease: 'steps(1)', yoyo: true, repeat: 1 }, 3.55);
tl.to(munch, { scale: 1.08, duration: 0.08, ease: 'steps(1)', yoyo: true, repeat: 1 }, 3.95);
tl.to(munch, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 4.35);
const cap1 = div('#hud', 'top:150px;', 'capbox'); cap1.textContent = '7:15 AM · breakfast';
tl.set(cap1, { opacity: 0 }, 0);
tl.fromTo(cap1, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'steps(3)', immediateRender: false }, 0.15);
tl.to(cap1, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 4.5);
const cap2 = div('#hud', 'top:150px;', 'capbox'); cap2.textContent = '7:30 AM · off to work!';
tl.set(cap2, { opacity: 0 }, 0);
tl.fromTo(cap2, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'steps(3)', immediateRender: false }, 4.7);
