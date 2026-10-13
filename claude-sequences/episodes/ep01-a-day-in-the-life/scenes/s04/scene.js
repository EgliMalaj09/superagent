// SCENE 4 · 0–6.5 s · corner coffee bar. Claude walks in, hops on the stool; the barista slides a kafe AND a rakia:
// "The usual? Kafe me raki?" — Claude: "…I have a usual?" Football on the TV, old men slapping dominoes outside. On twos.
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
// ---------- camera: frame the bar closer (the floor below is empty), slow push ----------
gsap.set('#world', { svgOrigin: '0 0' });
tl.set('#world', { scale: 1.16, x: 540 - 1.16 * 480, y: 960 - 1.16 * 900 }, 0);
tl.to('#world', { scale: 1.2, x: 540 - 1.2 * 490, y: 960 - 1.2 * 905, duration: 10, ease: 'none' }, 0);
// ---------- background life: football on the TV (on twos) ----------
tl.fromTo('#ball', { x: 0 }, { x: 120, duration: 1.0, yoyo: true, repeat: 9, ease: 'steps(12)', immediateRender: false }, 0);
tl.fromTo('#players', { x: -6 }, { x: 6, duration: 0.33, yoyo: true, repeat: 29, ease: 'steps(4)', immediateRender: false }, 0);
// ---------- Claude walks in and hops onto the stool ----------
tl.set('#claude', { x: -220, y: 1560 }, 0);
tl.to('#claude', { x: 765, duration: 1.0, ease: twos(1.0) }, 0);
walkLegs(0, 1.0);
tl.to('#cbody', { scaleY: 0.86, scaleX: 1.08, duration: 0.08, ease: 'steps(1)' }, 1.05);
tl.to('#claude', { y: 1300, duration: 0.25, ease: 'steps(3)' }, 1.13);
tl.to('#cbody', { scaleY: 1.1, scaleX: 0.93, duration: 0.17, ease: 'steps(2)' }, 1.13);
tl.to('#cbody', { scaleY: 0.9, scaleX: 1.06, duration: 0.08, ease: 'steps(1)' }, 1.38);
tl.to('#cbody', { scaleY: 1, scaleX: 1, duration: 0.17, ease: 'steps(2)' }, 1.46);
// ---------- the barista looks over and slides the kafe, then the rakia ----------
tl.to('#bEyes', { x: 10, duration: 0.08, ease: 'steps(1)' }, 1.2);
tl.set('#cup', { x: -140 }, 0); tl.set('#raki', { x: -140, opacity: 0 }, 0);
tl.to('#bArm', { x: 30, duration: 0.17, ease: 'steps(2)', yoyo: true, repeat: 1 }, 1.55);
tl.to('#cup', { x: 100, duration: 0.42, ease: 'steps(5)' }, 1.6);
tl.set('#raki', { opacity: 1 }, 1.95);
tl.to('#bArm', { x: 30, duration: 0.17, ease: 'steps(2)', yoyo: true, repeat: 1 }, 1.95);
tl.to('#raki', { x: 170, duration: 0.42, ease: 'steps(5)' }, 2.0);
// ---------- speech ----------
const b1 = div('#hud', 'left:150px;top:470px;', 'bubble tl'); b1.innerHTML = 'The usual?<br><span style="color:#C93A3A">Kafe me raki?</span>';
tl.set(b1, { opacity: 0 }, 0);
tl.fromTo(b1, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', transformOrigin: '20% 100%', immediateRender: false }, 2.45);
tl.to(b1, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 3.75);
const b2 = div('#hud', 'left:540px;top:830px;', 'bubble tr'); b2.innerHTML = '…I have<br>a usual?';
tl.set(b2, { opacity: 0 }, 0);
tl.fromTo(b2, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', transformOrigin: '80% 100%', immediateRender: false }, 3.9);
tl.to('#eyes', { scaleY: 1.25, duration: 0.08, ease: 'steps(1)' }, 3.9);                                 // surprised
tl.to('#eyes', { scaleY: 0.08, duration: 0.08, ease: 'steps(1)', yoyo: true, repeat: 1 }, 4.6);        // blink
tl.to('#eyes', { scaleY: 1, duration: 0.08, ease: 'steps(1)' }, 4.8);
tl.to(['#armL', '#armR'], { rotation: function (i) { return i ? -35 : 35; }, duration: 0.17, ease: 'steps(2)', yoyo: true, repeat: 1 }, 4.25);   // shrug
tl.to(b2, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 5.4);
// ---------- outside: an old man slaps a domino ----------
gsap.set('#armA', { svgOrigin: '134 557' });
tl.to('#armA', { rotation: -40, duration: 0.17, ease: 'steps(2)' }, 8.25);
tl.to('#armA', { rotation: 0, duration: 0.08, ease: 'steps(1)' }, 8.45);
const clack = div('#hud', 'top:440px;left:40px;right:auto;width:420px;font-size:90px;transform:rotate(-8deg);', 'boom'); clack.textContent = 'CLACK!';
tl.set(clack, { opacity: 0 }, 0);
tl.fromTo(clack, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', immediateRender: false }, 8.45);
tl.to(clack, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 9.2);
tl.to('#bEyes', { x: -10, duration: 0.08, ease: 'steps(1)' }, 8.5);                                     // barista glances at them
// ---------- caption ----------
const cap = div('#hud', 'top:150px;', 'capbox'); cap.textContent = '7:35 AM · kafe';
tl.set(cap, { opacity: 0 }, 0);
tl.fromTo(cap, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'steps(3)', immediateRender: false }, 0.2);

// ---------- one shot: the kafe, then the rakia ----------
// rotation origins are set once (changing svgOrigin inside a tween makes GSAP re-offset x/y)
gsap.set('#cup', { transformOrigin: '50% 50%' }); gsap.set('#raki', { transformOrigin: '50% 50%' });
const gulp = function (t, txt) {
  const g = div('#hud', 'top:300px;left:380px;right:0;width:600px;font-size:110px;transform:rotate(6deg);', 'boom'); g.textContent = txt;
  tl.set(g, { opacity: 0 }, 0);
  tl.fromTo(g, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', immediateRender: false }, t);
  tl.to(g, { opacity: 0, duration: 0.08, ease: 'steps(1)' }, t + 0.5);
};
tl.to('#armR', { rotation: -60, duration: 0.17, ease: 'steps(2)' }, 5.6);
tl.to('#cup', { x: 300, y: 150, duration: 0.25, ease: 'steps(3)' }, 5.65);                      // to its face
tl.to('#cup', { rotation: -70, duration: 0.17, ease: 'steps(2)' }, 5.9);   // down in one
gulp(5.95, 'GULP!');
tl.to('#cup', { x: 100, y: 0, rotation: 0, duration: 0.25, ease: 'steps(3)' }, 6.3);             // back on the counter, empty
tl.to('#raki', { x: 330, y: 140, duration: 0.25, ease: 'steps(3)' }, 6.6);
tl.to('#raki', { rotation: -80, duration: 0.17, ease: 'steps(2)' }, 6.85);
gulp(6.9, 'GLUG!');
tl.to('#raki', { x: 170, y: 0, rotation: 0, duration: 0.25, ease: 'steps(3)' }, 7.2);
tl.to('#armR', { rotation: 0, duration: 0.17, ease: 'steps(2)' }, 7.2);
// ---------- lemon face: the rakia hits ----------
tl.set('#eyes', { opacity: 0 }, 7.3); tl.set('#sour', { opacity: 1 }, 7.3);
tl.to('#cbody', { scaleY: 0.8, scaleX: 1.12, duration: 0.08, ease: 'steps(1)' }, 7.3);
tl.fromTo('#claude', { x: 757 }, { x: 773, duration: 0.08, yoyo: true, repeat: 9, ease: 'steps(1)', immediateRender: false }, 7.35);   // shudder
const brr = div('#hud', 'top:820px;left:440px;right:0;width:620px;font-size:120px;transform:rotate(-5deg);color:#B6F09A;', 'boom'); brr.textContent = 'BRRR!';
tl.set(brr, { opacity: 0 }, 0);
tl.fromTo(brr, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.17, ease: 'steps(2)', immediateRender: false }, 7.35);
tl.to(brr, { opacity: 0, duration: 0.17, ease: 'steps(2)' }, 8.15);
tl.set('#claude', { x: 765 }, 8.2);
tl.to('#cbody', { scaleY: 1, scaleX: 1, duration: 0.17, ease: 'steps(2)' }, 8.2);
tl.set('#sour', { opacity: 0 }, 8.4); tl.set('#eyes', { opacity: 1 }, 8.4);
// ---------- hop off the stool and leave (right) ----------
tl.to('#claude', { y: 1560, duration: 0.25, ease: 'steps(3)' }, 8.6);
tl.to('#claude', { x: 1320, duration: 0.9, ease: twos(0.9) }, 8.95);
walkLegs(8.95, 0.9);
