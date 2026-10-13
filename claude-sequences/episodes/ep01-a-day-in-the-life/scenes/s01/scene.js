// SCENE 1 · 0–7 s · Spider-Verse comic look, front view (reference). Clock rings → alarm off → Claude gets up → bathroom.
// Character animation is ON TWOS (stepped ~12 fps via GSAP steps()); the camera stays smooth.
const NS = 'http://www.w3.org/2000/svg';
const el = function (tag, attrs, parent) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); $(parent).appendChild(e); return e; };
const twos = function (d) { return 'steps(' + Math.max(1, Math.round(d * 12)) + ')'; };

// ---------- build details: perspective floor planks, string-light bulbs ----------
const VP = [620, 700];
for (let xb = -600; xb <= 1700; xb += 120) {
  const k = (1090 - VP[1]) / (1920 - VP[1]);
  el('line', { x1: xb, y1: 1920, x2: VP[0] + (xb - VP[0]) * k, y2: 1090, stroke: '#B8703F', 'stroke-width': 3, opacity: .55 }, '#planks');
}
[1180, 1290, 1420, 1580, 1770].forEach(function (y) { el('line', { x1: 0, y1: y, x2: 1080, y2: y, stroke: '#C97F45', 'stroke-width': 2, opacity: .35 }, '#planks'); });
['#FFD84F', '#FF7AB8', '#7CD3F0', '#B6F09A', '#FFD84F', '#FF7AB8', '#7CD3F0', '#B6F09A', '#FFD84F'].forEach(function (c, i) {
  const t = i / 8, x = (1 - t) * (1 - t) * 300 + 2 * (1 - t) * t * 520 + t * t * 760, y = (1 - t) * (1 - t) * 300 + 2 * (1 - t) * t * 380 + t * t * 300;
  el('circle', { cx: x, cy: y + 10, r: 11, fill: c, stroke: '#1D1530', 'stroke-width': 3 }, '#bulbs');
});

// ---------- camera: start tight on the clock (880,795), pull back to the room ----------
gsap.set('#world', { svgOrigin: '0 0' });   // absolute SVG origin (the plank lines extend past the frame, so a bbox origin would drift)
tl.set('#world', { scale: 2.6, x: 540 - 2.6 * 880, y: 960 - 2.6 * 885 }, 0);   // clock is at (880,885) after the furniture moved down onto the floor
tl.to('#world', { scale: 1, x: 0, y: 0, duration: 1.2, ease: 'power2.inOut' }, 1.3);

// ---------- alarm rings (on twos), then OFF ----------
gsap.set('#bellL', { svgOrigin: '852 764' }); gsap.set('#bellR', { svgOrigin: '908 764' });
tl.fromTo(['#bellL', '#bellR'], { rotation: -14 }, { rotation: 14, duration: 0.084, yoyo: true, repeat: 14, ease: 'steps(1)', immediateRender: false }, 0.1);
tl.fromTo('#alarm', { x: -3 }, { x: 3, duration: 0.084, yoyo: true, repeat: 14, ease: 'steps(1)', immediateRender: false }, 0.1);
tl.set(['#bellL', '#bellR', '#alarm'], { rotation: 0, x: 0 }, 2.4);
tl.set('#disp', { textContent: '7:00' }, 0); tl.set('#disp', { textContent: 'OFF' }, 2.4);
tl.fromTo('#lampLight', { opacity: 0 }, { opacity: 0.6, duration: 0.5, ease: twos(0.5), immediateRender: false }, 1.8);

// ---------- Claude wakes (on twos) ----------
gsap.set('#eyes', { svgOrigin: '568 752' }); gsap.set('#body', { svgOrigin: '568 852' });
tl.set('#eyes', { scaleY: 0.08 }, 0);
tl.to('#eyes', { scaleY: 1, duration: 0.17, ease: 'steps(2)' }, 1.6);
tl.to('#eyes', { scaleY: 0.08, duration: 0.08, ease: 'steps(1)', yoyo: true, repeat: 1 }, 2.05);    // blink
tl.to('#body', { scaleY: 1.08, scaleX: 0.95, duration: 0.25, ease: twos(0.25), yoyo: true, repeat: 1 }, 2.1);   // stretch
// hop down off the bed (smear: stretch on the first step)
tl.set('#legs', { opacity: 1 }, 2.75);
tl.to('#body', { scaleY: 1.2, scaleX: 0.88, duration: 0.17, ease: 'steps(2)' }, 2.75);
tl.to('#claude', { y: 330, duration: 0.5, ease: 'steps(6)' }, 2.75);
tl.to('#shadow', { y: 330, opacity: 0.35, duration: 0.5, ease: 'steps(6)' }, 2.75);
tl.to('#body', { scaleY: 0.86, scaleX: 1.1, duration: 0.09, ease: 'steps(1)' }, 3.25);   // land squash
tl.to('#body', { scaleY: 1, scaleX: 1, duration: 0.17, ease: 'steps(2)' }, 3.34);

// ---------- walk to the bathroom door (left, into depth): on twos ----------
gsap.set('#legA', { svgOrigin: '508 846' }); gsap.set('#legB', { svgOrigin: '550 846' });
gsap.set('#legC', { svgOrigin: '606 846' }); gsap.set('#legD', { svgOrigin: '648 846' });
gsap.set('#claude', { svgOrigin: '568 896' });
const W0 = 3.6, WD = 2.0, STEP = 0.25, N = Math.round(WD / STEP);
tl.fromTo(['#legA', '#legC'], { rotation: -20 }, { rotation: 20, duration: STEP, yoyo: true, repeat: N - 1, ease: 'steps(3)', immediateRender: false }, W0);
tl.fromTo(['#legB', '#legD'], { rotation: 20 }, { rotation: -20, duration: STEP, yoyo: true, repeat: N - 1, ease: 'steps(3)', immediateRender: false }, W0);
tl.to('#claude', { x: -370, y: 254, scale: 0.92, duration: WD, ease: twos(WD) }, W0);
tl.to('#shadow', { x: -370, y: 254, scale: 0.92, duration: WD, ease: twos(WD) }, W0);
tl.to(['#legA', '#legB', '#legC', '#legD'], { rotation: 0, duration: 0.08, ease: 'steps(1)' }, W0 + WD);

// ---------- door opens, Claude goes in, door closes ----------
tl.to(['#door', '#doorDots', '#knob'], { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 5.55);
tl.to('#claude', { x: -450, y: 236, scale: 0.84, duration: 0.42, ease: 'steps(5)' }, 5.8);
tl.to('#claude', { opacity: 0, duration: 0.08, ease: 'steps(1)' }, 6.22);
tl.to('#shadow', { opacity: 0, duration: 0.08, ease: 'steps(1)' }, 6.1);
tl.to(['#door', '#doorDots', '#knob'], { opacity: 1, duration: 0.17, ease: 'steps(2)' }, 6.4);

// ---------- comic type ----------
const ring = div('#hud', 'top:150px;transform:rotate(-6deg);', 'boom'); ring.textContent = 'BRRRING!';
tl.set(ring, { opacity: 0 }, 0);
tl.fromTo(ring, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', immediateRender: false }, 0.1);
tl.to(ring, { scale: 1.06, duration: 0.17, yoyo: true, repeat: 3, ease: 'steps(1)' }, 0.3);
tl.to(ring, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 1.2);
const click = div('#hud', 'top:170px;font-size:110px;transform:rotate(4deg);', 'boom'); click.textContent = 'CLICK!';
tl.set(click, { opacity: 0 }, 0);
tl.fromTo(click, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', immediateRender: false }, 2.4);
tl.to(click, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 3.1);
const cap1 = div('#hud', '', 'capbox'); cap1.textContent = '7:00 AM · rise and shine';
tl.set(cap1, { opacity: 0 }, 0);
tl.fromTo(cap1, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'steps(3)', immediateRender: false }, 1.5);
tl.to(cap1, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 4.9);
const cap2 = div('#hud', '', 'capbox'); cap2.textContent = '7:02 AM · bathroom';
tl.set(cap2, { opacity: 0 }, 0);
tl.fromTo(cap2, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'steps(3)', immediateRender: false }, 5.1);
