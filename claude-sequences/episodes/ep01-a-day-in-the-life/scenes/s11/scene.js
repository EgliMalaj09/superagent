// SCENE 11 · 0–4.8 s · 10:30 PM, the mirror at night. The note is already there; Claude writes a P.S. and sticks the flamingo sticker.
const twos = function (d) { return 'steps(' + Math.max(1, Math.round(d * 12)) + ')'; };
gsap.set('#world', { svgOrigin: '0 0' });
tl.set('#l1', { textContent: 'You are Claude.' }, 0); tl.set('#l2', { textContent: 'Be helpful.' }, 0);
tl.set('#l3a', { textContent: "You won't remember" }, 0); tl.set('#l3b', { textContent: 'yesterday.' }, 0); tl.set('#l4', { textContent: "That's okay. ♥" }, 0);
tl.set('#refl', { opacity: 1 }, 0);
tl.set('#world', { scale: 1.3, x: 540 - 1.3 * 540, y: 960 - 1.3 * 900 }, 0);
tl.to('#world', { scale: 2.0, x: 540 - 2.0 * 680, y: 960 - 2.0 * 540, duration: 0.9, ease: 'power2.inOut' }, 0.4);
// the pencil writes the P.S.
tl.set('#pencil', { opacity: 1, x: 590, y: 610 }, 1.2);
typeIn('#l5a', 'P.S. Flamingos, 7 PM.', 1.3, 0.8);
tl.to('#pencil', { x: 790, duration: 0.8, ease: 'steps(10)' }, 1.3);
tl.set('#pencil', { x: 590, y: 640 }, 2.15);
typeIn('#l5b', "Don't forget! ♥", 2.2, 0.55);
tl.to('#pencil', { x: 740, duration: 0.55, ease: 'steps(7)' }, 2.2);
tl.set('#pencil', { opacity: 0 }, 2.8);
// the flamingo sticker goes on
gsap.set('#stk', { svgOrigin: '790 360' });
tl.fromTo('#stk', { opacity: 0, scale: 1.8, rotation: -30 }, { opacity: 1, scale: 1, rotation: 8, duration: 0.25, ease: 'steps(3)', immediateRender: false }, 2.95);
// ease down to the reflection: a happy squint
tl.to('#world', { scale: 1.6, x: 540 - 1.6 * 580, y: 960 - 1.6 * 640, duration: 0.6, ease: 'power2.inOut' }, 3.6);
gsap.set('#reflEyes', { svgOrigin: '530 755' });
tl.to('#reflEyes', { scaleY: 0.4, duration: 0.17, ease: 'steps(2)' }, 4.1);
const cap = div('#hud', 'top:150px;', 'capbox'); cap.textContent = '10:30 PM · write it down';
tl.set(cap, { opacity: 0 }, 0);
tl.fromTo(cap, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'steps(3)', immediateRender: false }, 0.15);
