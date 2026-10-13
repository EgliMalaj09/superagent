// SCENE 2 · 0–6 s · bathroom. Claude steps in (seen from behind), looks up; push over its shoulder into the mirror;
// the note writes itself line by line; the reflection reads it and relaxes. Character on twos, camera smooth.
const twos = function (d) { return 'steps(' + Math.max(1, Math.round(d * 12)) + ')'; };
gsap.set('#world', { svgOrigin: '0 0' });
// ---------- Claude walks in from the left (back view), stops at the sink ----------
tl.set('#claudeBack', { x: -620 }, 0);
tl.to('#claudeBack', { x: 0, duration: 1.1, ease: twos(1.1) }, 0);
tl.fromTo('#claudeBack', { y: 0 }, { y: -10, duration: 0.17, yoyo: true, repeat: 5, ease: 'steps(2)', immediateRender: false }, 0);   // step bob
tl.to('#claudeBack', { y: 0, duration: 0.08, ease: 'steps(1)' }, 1.1);
// reflection appears as it arrives; a "?" over it
tl.to('#refl', { opacity: 1, duration: 0.17, ease: 'steps(2)' }, 0.95);
// ---------- push over the shoulder into the mirror, onto the note (680,470) ----------
tl.to('#world', { scale: 2.05, x: 540 - 2.05 * 680, y: 900 - 2.05 * 470, duration: 1.0, ease: 'power2.inOut' }, 1.5);
// ---------- the note writes itself (typewriter proxy, stepped like handwriting) ----------
typeIn('#l1', 'You are Claude.', 2.45, 0.6);
typeIn('#l2', 'Be helpful.', 3.15, 0.45);
typeIn('#l3a', "You won't remember", 3.75, 0.55);
typeIn('#l3b', 'yesterday.', 4.3, 0.35);
typeIn('#l4', "That's okay. ♥", 4.8, 0.5);
// ---------- ease down to the reflection: it blinks and relaxes (happy squint) ----------
tl.to('#world', { scale: 1.6, x: 540 - 1.6 * 560, y: 900 - 1.6 * 640, duration: 0.6, ease: 'power2.inOut' }, 5.3);
gsap.set('#reflEyes', { svgOrigin: '530 755' });
tl.to('#reflEyes', { scaleY: 0.1, duration: 0.08, ease: 'steps(1)', yoyo: true, repeat: 1 }, 5.55);
tl.to('#reflEyes', { scaleY: 0.45, duration: 0.17, ease: 'steps(2)' }, 5.75);
// ---------- comic type ----------
const cap = div('#hud', 'top:150px;', 'capbox'); cap.textContent = '7:03 AM · who am I?';
tl.set(cap, { opacity: 0 }, 0);
tl.fromTo(cap, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'steps(3)', immediateRender: false }, 0.3);
tl.to(cap, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 2.2);
const q = div('#hud', 'top:560px;font-size:150px;', 'boom'); q.textContent = '?';
tl.set(q, { opacity: 0 }, 0);
tl.fromTo(q, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', immediateRender: false }, 1.15);
tl.to(q, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 1.6);
