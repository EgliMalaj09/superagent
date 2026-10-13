// SCENE 8 · 0–7.2 s · 5:00 PM, the same bar in warm afternoon light. "The usual?" — "…yes?" The coffee has FLAMINGO latte art
// (a hint of tonight's protest). Claude tilts its head, sips, and heads out. On twos.
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
const popIn = function (el, t, t2, origin) {
  tl.set(el, { opacity: 0 }, 0);
  tl.fromTo(el, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', transformOrigin: origin || '50% 50%', immediateRender: false }, t);
  if (t2) tl.to(el, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, t2);
};
// camera (same framing as scene 4)
gsap.set('#world', { svgOrigin: '0 0' });
tl.set('#world', { scale: 1.16, x: 540 - 1.16 * 480, y: 960 - 1.16 * 900 }, 0);
tl.to('#world', { scale: 1.2, x: 540 - 1.2 * 490, y: 960 - 1.2 * 905, duration: 7.2, ease: 'none' }, 0);
// TV + dominoes keep going (running gag)
tl.fromTo('#ball', { x: 0 }, { x: 120, duration: 1.0, yoyo: true, repeat: 6, ease: 'steps(12)', immediateRender: false }, 0);
tl.fromTo('#players', { x: -6 }, { x: 6, duration: 0.33, yoyo: true, repeat: 21, ease: 'steps(4)', immediateRender: false }, 0);
gsap.set('#armA', { svgOrigin: '134 557' });
tl.to('#armA', { rotation: -40, duration: 0.17, ease: 'steps(2)', yoyo: true, repeat: 1 }, 1.0);
// Claude walks in, hops onto the stool
tl.set('#claude', { x: -220, y: 1560 }, 0);
tl.to('#claude', { x: 765, duration: 1.0, ease: twos(1.0) }, 0);
walkLegs(0, 1.0);
tl.to('#cbody', { scaleY: 0.86, scaleX: 1.08, duration: 0.08, ease: 'steps(1)' }, 1.05);
tl.to('#claude', { y: 1300, duration: 0.25, ease: 'steps(3)' }, 1.13);
tl.to('#cbody', { scaleY: 1, scaleX: 1, duration: 0.17, ease: 'steps(2)' }, 1.4);
// the barista recognises it; the kafe slides over
tl.to('#bEyes', { x: 10, duration: 0.08, ease: 'steps(1)' }, 1.2);
tl.set('#cup', { x: -140 }, 0);
gsap.set('#cup', { transformOrigin: '50% 50%' });
const b1 = div('#hud', 'left:150px;top:470px;', 'bubble tl'); b1.innerHTML = 'The usual?';
popIn(b1, 1.6, 2.9, '20% 100%');
tl.to('#bArm', { x: 30, duration: 0.17, ease: 'steps(2)', yoyo: true, repeat: 1 }, 2.0);
tl.to('#cup', { x: 100, duration: 0.42, ease: 'steps(5)' }, 2.05);
const b2 = div('#hud', 'left:560px;top:830px;', 'bubble tr'); b2.innerHTML = '…yes?';
popIn(b2, 3.0, 4.0, '80% 100%');
// close-up insert: flamingo latte art
const art = div('#hud', 'position:absolute;left:190px;top:560px;width:700px;height:700px;border-radius:50%;background:#FFFFFF;border:10px solid #1D1530;box-shadow:14px 14px 0 #1D1530;', '');
art.innerHTML = '<svg viewBox="0 0 700 700" width="680" height="680" style="position:absolute;left:0;top:0"><circle cx="340" cy="340" r="290" fill="#7A4A2B" stroke="#1D1530" stroke-width="8"/>' +
  '<circle cx="340" cy="340" r="290" fill="url(#dotsS)"/>' +
  '<g fill="#FFC9DE" stroke="#FFF4D6" stroke-width="6"><ellipse cx="300" cy="400" rx="110" ry="70"/>' +
  '<path d="M370 380 C420 330 330 280 360 210 C380 170 440 170 450 210" fill="none" stroke="#FFC9DE" stroke-width="26" stroke-linecap="round"/>' +
  '<circle cx="455" cy="210" r="30"/><path d="M480 205 L530 225 L482 232 Z" fill="#1D1530" stroke="none"/>' +
  '<path d="M290 465 L290 560 M290 515 L330 545" fill="none" stroke="#FFC9DE" stroke-width="12" stroke-linecap="round"/></g></svg>';
popIn(art, 4.05, 5.15);
tl.to(art, { rotation: 6, duration: 0.5, ease: 'steps(4)' }, 4.1);
const tag = div('#hud', 'top:1330px;font-size:100px;transform:rotate(-4deg);', 'boom'); tag.textContent = '…a flamingo?';
popIn(tag, 4.3, 5.15);
tl.to('#cbody', { rotation: 9, duration: 0.17, ease: 'steps(2)' }, 4.1);                 // head tilt
tl.to('#cbody', { rotation: 0, duration: 0.17, ease: 'steps(2)' }, 5.2);
// one sip, then off it goes (toward the Pyramid)
tl.to('#armR', { rotation: -60, duration: 0.17, ease: 'steps(2)' }, 5.25);
tl.to('#cup', { x: 300, y: 150, duration: 0.25, ease: 'steps(3)' }, 5.3);
tl.to('#cup', { rotation: -40, duration: 0.17, ease: 'steps(2)' }, 5.55);
const sip = div('#hud', 'top:300px;left:380px;right:0;width:600px;font-size:110px;transform:rotate(6deg);', 'boom'); sip.textContent = 'SIP.';
popIn(sip, 5.6, 6.05);
tl.to('#cup', { x: 100, y: 0, rotation: 0, duration: 0.25, ease: 'steps(3)' }, 5.85);
tl.to('#armR', { rotation: 0, duration: 0.17, ease: 'steps(2)' }, 5.85);
tl.to('#claude', { y: 1560, duration: 0.25, ease: 'steps(3)' }, 6.1);
tl.to('#claude', { x: 1320, duration: 0.8, ease: twos(0.8) }, 6.4);
walkLegs(6.4, 0.8);
// caption
const cap = div('#hud', 'top:150px;', 'capbox'); cap.textContent = '5:00 PM · kafe again';
tl.set(cap, { opacity: 0 }, 0);
tl.fromTo(cap, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'steps(3)', immediateRender: false }, 0.2);
