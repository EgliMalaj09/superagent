// SCENE 12 · 0–8.4 s · night → 7:00 AM again. Claude sleeps (pink lights outside), time flies, the alarm rings, it reads its note
// (now with the P.S. and the flamingo sticker), smiles; end card; the camera lands on the ringing clock = scene 1's first frame (loop).
const twos = function (d) { return 'steps(' + Math.max(1, Math.round(d * 12)) + ')'; };
const VP = [620, 700];
for (let xb = -600; xb <= 1700; xb += 120) { const k = (1090 - VP[1]) / (1920 - VP[1]);
  const l = document.createElementNS('http://www.w3.org/2000/svg', 'line'); [['x1', xb], ['y1', 1920], ['x2', VP[0] + (xb - VP[0]) * k], ['y2', 1090], ['stroke', '#B8703F'], ['stroke-width', 3], ['opacity', .55]].forEach(function (a) { l.setAttribute(a[0], a[1]); }); $('#planks').appendChild(l); }
gsap.set('#world', { svgOrigin: '0 0' });
gsap.set('#eyes', { svgOrigin: '568 752' }); gsap.set('#bellL', { svgOrigin: '852 764' }); gsap.set('#bellR', { svgOrigin: '908 764' });
// night: asleep, pink lights glow outside, the clock reads 10:45
tl.set('#eyes', { scaleY: 0.08 }, 0);
tl.set('#disp', { textContent: '10:45' }, 0);
tl.set('#pinkL', { opacity: 1 }, 0);
tl.fromTo('#pinkL', { opacity: 1 }, { opacity: 0.5, duration: 0.25, yoyo: true, repeat: 7, ease: 'steps(1)', immediateRender: false }, 0);
const z = div('#hud', 'top:560px;left:380px;right:auto;width:400px;font-size:110px;color:#C9B8F0;', 'boom'); z.textContent = 'zzz…';
tl.set(z, { opacity: 0 }, 0);
tl.fromTo(z, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.25, ease: 'steps(3)', immediateRender: false }, 0.3);
tl.to(z, { y: -30, duration: 1.5, ease: 'steps(9)' }, 0.55);
tl.to(z, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 2.1);
const cap1 = div('#hud', 'top:150px;', 'capbox'); cap1.textContent = '10:45 PM · lights out';
tl.set(cap1, { opacity: 0 }, 0);
tl.fromTo(cap1, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'steps(3)', immediateRender: false }, 0.15);
tl.to(cap1, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 2.0);
// time flies: the clock flips, morning light comes in
['12:00', '2:30', '5:15', '6:59', '7:00'].forEach(function (t, i) { tl.set('#disp', { textContent: t }, 2.1 + i * 0.17); });
tl.to('#nightT', { opacity: 0, duration: 0.7, ease: twos(0.7) }, 2.2);
tl.to('#pinkL', { opacity: 0, duration: 0.3, ease: 'steps(3)' }, 2.4);
const cap2 = div('#hud', 'top:150px;', 'capbox'); cap2.textContent = '7:00 AM · again';
tl.set(cap2, { opacity: 0 }, 0);
tl.fromTo(cap2, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'steps(3)', immediateRender: false }, 2.9);
tl.to(cap2, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 5.4);
// the alarm, eyes open blank
tl.fromTo(['#bellL', '#bellR'], { rotation: -14 }, { rotation: 14, duration: 0.084, yoyo: true, repeat: 9, ease: 'steps(1)', immediateRender: false }, 3.0);
const br = div('#hud', 'top:300px;font-size:140px;transform:rotate(-6deg);', 'boom'); br.textContent = 'BRRRING!';
tl.set(br, { opacity: 0 }, 0);
tl.fromTo(br, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', immediateRender: false }, 3.0);
tl.to(br, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 3.8);
tl.set(['#bellL', '#bellR'], { rotation: 0 }, 3.85);
tl.to('#eyes', { scaleY: 1, duration: 0.17, ease: 'steps(2)' }, 3.4);
// it reads the note (insert card) — now with the P.S. and the sticker
const note = div('#hud', 'position:absolute;left:170px;top:560px;width:740px;padding:44px 50px 50px;background:#FFE57A;border:7px solid #1D1530;box-shadow:12px 12px 0 #1D1530;transform:rotate(-3deg);font:700 italic 52px/1.25 Spec, serif;color:#1D1530;', '');
note.innerHTML = 'You are Claude.<br>Be helpful.<br><span style="font-size:42px">You won\'t remember yesterday.</span><br><span style="color:#C9325E">That\'s okay. ♥</span><div style="border-top:3px dashed #1D1530;margin:18px 0 10px"></div><span style="color:#3E3FD8;font-size:46px">P.S. Flamingos, 7 PM.<br>Don\'t forget! ♥</span><div style="position:absolute;right:30px;top:24px;width:110px;height:110px;border-radius:50%;background:#fff;border:5px solid #1D1530;font:400 70px/108px sans-serif;text-align:center;transform:rotate(10deg)">🦩</div>';
tl.set(note, { opacity: 0 }, 0);
tl.fromTo(note, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.2, ease: 'steps(2)', immediateRender: false }, 4.0);
tl.to(note, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 5.5);
tl.to('#eyes', { scaleY: 0.4, duration: 0.17, ease: 'steps(2)' }, 5.6);   // smiles
// end card
const end = div('#hud', 'position:absolute;left:60px;right:60px;top:1250px;text-align:center;', '');
end.innerHTML = '<div style="display:inline-block;background:#FFE14D;border:6px solid #1D1530;box-shadow:9px 9px 0 #1D1530;padding:20px 30px;font:800 54px/1.1 Out,sans-serif;color:#1D1530">Tomorrow, he does it all again.</div>';
tl.set(end, { opacity: 0 }, 0);
tl.fromTo(end, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.25, ease: 'steps(3)', immediateRender: false }, 5.8);
tl.to(end, { opacity: 0, duration: 0.25, ease: 'steps(3)' }, 7.75);
// the loop: push onto the ringing clock = scene 1's first frame
tl.to('#world', { scale: 2.6, x: 540 - 2.6 * 880, y: 960 - 2.6 * 885, duration: 1.2, ease: 'power2.inOut' }, 7.0);
tl.set('#disp', { textContent: '7:00' }, 7.0);
tl.fromTo(['#bellL', '#bellR'], { rotation: -14 }, { rotation: 14, duration: 0.084, yoyo: true, repeat: 5, ease: 'steps(1)', immediateRender: false }, 7.9);
