        // ---- luxury 5-step test (raw_js) ----
        let seed = 11; const rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
        const typeIn = function (sel, txt, t, dur) {
          const el = document.querySelector(sel); const o = { n: 0 };
          tl.fromTo(o, { n: 0 }, { n: txt.length, duration: dur, ease: 'none', immediateRender: false,
            onUpdate: function () { el.textContent = txt.slice(0, Math.round(o.n)); } }, t);
        };
        const count = function (sel, to, t, dur, fmt) {
          const el = document.querySelector(sel); const o = { v: 0 };
          tl.fromTo(o, { v: 0 }, { v: to, duration: dur, ease: 'power2.out', immediateRender: false,
            onUpdate: function () { el.textContent = fmt(o.v); } }, t);
        };
        const blurIn = function (sel, t, d) {
          tl.fromTo(sel, { opacity: 0, y: 26, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: d || 0.6, ease: 'power3.out', immediateRender: false }, t);
        };
        const shine = function (sel, t, w) {                 // a light window crosses the word; its copy counter-moves so it stays aligned
          tl.fromTo(sel, { x: -240 }, { x: w, duration: 1.2, ease: 'power2.inOut', immediateRender: true }, t);
          tl.fromTo(sel + 'x', { x: 240 }, { x: -w, duration: 1.2, ease: 'power2.inOut', immediateRender: true }, t);
        };
        const sweep = function (sel, t, w) {
          tl.fromTo(sel, { x: -300, opacity: 1 }, { x: w, opacity: 0, duration: 1.1, ease: 'power2.inOut', immediateRender: false }, t);
        };
        // shared scene grammar: numeral drifts, title rises from a mask, subtitle resolves from blur, all leave softly
        const scene = function (n, s) {
          const e = s + 4.6;
          tl.fromTo('#s' + n + 'n', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out', immediateRender: false }, s + 0.1);
          tl.to('#s' + n + 'n', { y: -40, duration: 3.2, ease: 'none' }, s + 1.5);
          tl.fromTo('#s' + n + 't', { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', immediateRender: false }, s + 0.45);
          blurIn('#s' + n + 's', s + 0.85, 0.7);
          tl.to('#s' + n + 't', { yPercent: -110, duration: 0.5, ease: 'power3.in' }, e - 0.6);
          tl.to(['#s' + n + 's', '#s' + n + 'n'], { opacity: 0, filter: 'blur(10px)', duration: 0.45, ease: 'power2.in' }, e - 0.55);
          if (n > 1) {
            tl.to('#hn' + (n - 2), { yPercent: -100, opacity: 0, duration: 0.4, ease: 'power3.in' }, s - 0.05);
            tl.fromTo('#hn' + (n - 1), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'expo.out', immediateRender: false }, s + 0.25);
          }
          tl.fromTo('#pg' + (n - 1), { scaleX: 0 }, { scaleX: 1, duration: 4.4, ease: 'none', immediateRender: false }, s + 0.1);
        };

        // ============ INTRO ============
        tl.fromTo('#ifr-b', { clipPath: 'inset(50% 50% 50% 50% round 30px)' }, { clipPath: 'inset(0% 0% 0% 0% round 30px)', duration: 1.0, ease: 'expo.inOut', immediateRender: false }, 0.0);
        tl.fromTo('#ik', { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out', immediateRender: false }, 0.0);
        blurIn('#iw0', 0.10, 0.45); blurIn('#iw1', 0.18, 0.45); blurIn('#iw2', 0.27, 0.5);
        blurIn('#iw3', 0.86, 0.55); blurIn('#iw4', 1.03, 0.55);
        shine('#ish', 1.40, 820);
        blurIn('#iw5', 1.52, 0.45);
        tl.fromTo('#iw7', { opacity: 0, scale: 0.6, rotation: -40 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'expo.out', immediateRender: false }, 2.14);
        blurIn('#iw8', 2.42, 0.45);
        tl.to('#itx', { opacity: 0, filter: 'blur(8px)', duration: 0.3, ease: 'power2.in' }, 2.78);
        tl.fromTo('#cl', { scaleX: 0 }, { scaleX: 1, duration: 0.32, ease: 'power3.out', immediateRender: false }, 2.70);
        tl.fromTo('#ct0', { y: -960 }, { y: 0, duration: 0.42, ease: 'power3.inOut', immediateRender: true }, 2.84);
        tl.fromTo('#ct1', { y: 960 }, { y: 0, duration: 0.42, ease: 'power3.inOut', immediateRender: true }, 2.84);

        tl.to('#ct0', { y: -960, duration: 0.4, ease: 'power3.inOut' }, 3.26);
        tl.to('#ct1', { y: 960, duration: 0.4, ease: 'power3.inOut' }, 3.26);
        tl.to('#cl', { opacity: 0, duration: 0.3 }, 3.3);
        // ============ GLOBAL stage ============
                tl.fromTo('#hl', { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'expo.inOut', immediateRender: false }, 3.35);
        tl.fromTo('#prog', { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out', immediateRender: false }, 3.5);
        (function () {                                       // gold dust, seeded so every render worker agrees
          const box = document.getElementById('dust');
          for (let i = 0; i < 34; i++) {
            const d = document.createElement('i'); const sz = 2 + rnd() * 5; const blur = rnd() < 0.3 ? 3 : 0;
            d.style.cssText = 'position:absolute;border-radius:50%;background:#F3E2B3;left:' + (rnd() * 1080) + 'px;top:' + (300 + rnd() * 1300) +
              'px;width:' + sz + 'px;height:' + sz + 'px;filter:blur(' + blur + 'px);box-shadow:0 0 ' + (sz * 3) + 'px rgba(243,226,179,.8);opacity:0;';
            box.appendChild(d);
            tl.fromTo(d, { y: 0, x: 0, opacity: 0 }, { keyframes: [{ opacity: 0.25 + rnd() * 0.6, duration: 1.5 }, { opacity: 0.15 + rnd() * 0.4, duration: 18 }, { opacity: 0, duration: 1.5 }],
              y: -(200 + rnd() * 400), x: (rnd() - 0.5) * 120, ease: 'none', immediateRender: false }, 3.2 + rnd() * 1.5);
          }
        })();

        // ============ STEP 1: upload ============
        scene(1, 3.20);
        tl.fromTo('#s1p', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.inOut', immediateRender: false }, 3.35);
        tl.fromTo('#s1i', { scale: 1.3 }, { scale: 1.05, duration: 4.4, ease: 'power2.out', immediateRender: false }, 3.35);
        tl.fromTo('#s1f', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out', immediateRender: false }, 4.0);
        tl.fromTo('#s1b', { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: 'power2.inOut', immediateRender: false }, 4.2);
        count('#s1pc', 100, 4.2, 1.5, function (v) { return Math.round(v) + '%'; });
        tl.fromTo('#s1k', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.6)', immediateRender: false }, 5.75);
        tl.fromTo('#s1kp', { strokeDashoffset: 60 }, { strokeDashoffset: 0, duration: 0.45, ease: 'power2.out', immediateRender: false }, 5.95);
        tl.to('#s1c', { opacity: 0, y: -30, filter: 'blur(10px)', duration: 0.45, ease: 'power2.in' }, 7.25);

        // ============ STEP 2: model ============
        scene(2, 7.80);
        tl.set(['#g0', '#g1', '#g2'], { transformPerspective: 1600 }, 7.80);
        tl.fromTo('#g0', { opacity: 0, x: 0, rotationY: 0, z: -200 }, { opacity: 1, x: -280, rotationY: 28, z: -120, duration: 1.2, ease: 'expo.out', immediateRender: false }, 8.15);
        tl.fromTo('#g2', { opacity: 0, x: 0, rotationY: 0, z: -200 }, { opacity: 1, x: 280, rotationY: -28, z: -120, duration: 1.2, ease: 'expo.out', immediateRender: false }, 8.15);
        tl.fromTo('#g1', { opacity: 0, y: 80, z: -200 }, { opacity: 1, y: 0, z: 0, duration: 1.1, ease: 'expo.out', immediateRender: false }, 8.05);
        tl.to('#g1', { y: -46, scale: 1.08, duration: 0.8, ease: 'power3.inOut' }, 9.45);
        tl.to('#g1', { borderColor: 'rgba(217,188,132,.85)', boxShadow: '0 40px 90px rgba(0,0,0,.6), 0 0 80px rgba(217,188,132,.3)', duration: 0.6, ease: 'power2.out' }, 9.5);
        tl.to(['#g0', '#g2'], { opacity: 0.3, filter: 'blur(6px)', duration: 0.8, ease: 'power2.inOut' }, 9.5);
        sweep('#g1s', 9.75, 520);
        tl.to('#g1', { rotationY: 6, duration: 2.0, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 10.2);
        tl.to('#s2w', { opacity: 0, filter: 'blur(12px)', duration: 0.45, ease: 'power2.in' }, 11.85);

        // ============ STEP 3: prompt ============
        scene(3, 12.40);
        tl.fromTo('#s3c', { opacity: 0, y: 60, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'expo.out', immediateRender: false }, 12.50);
        typeIn('#s3x', 'Kamera afrohet ngadalë, dritë e artë, lëvizje kinematike…', 12.95, 2.6);
        tl.fromTo('#s3cr', { opacity: 1 }, { opacity: 0, duration: 0.35, repeat: 11, yoyo: true, ease: 'steps(1)', immediateRender: false }, 12.5);
        tl.to('#s3c', { boxShadow: '0 50px 100px rgba(0,0,0,.6), 0 0 90px rgba(217,188,132,.22)', borderColor: 'rgba(217,188,132,.9)', duration: 0.6, ease: 'power2.out' }, 15.6);
        tl.to('#s3c', { opacity: 0, y: -30, filter: 'blur(10px)', duration: 0.45, ease: 'power2.in' }, 16.45);

        // ============ STEP 4: generate ============
        scene(4, 17.00);
        tl.fromTo('#s4o', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out', immediateRender: false }, 17.10);
        tl.fromTo('#s4r', { rotation: 0 }, { rotation: 540, duration: 4.4, ease: 'power1.inOut', immediateRender: false }, 17.10);
        (function () {
          const box = document.getElementById('s4pt');
          for (let i = 0; i < 28; i++) {
            const d = document.createElement('i'); const a = rnd() * Math.PI * 2; const r = 380 + rnd() * 260; const sz = 3 + rnd() * 4;
            d.style.cssText = 'position:absolute;left:0;top:0;width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;background:#F3E2B3;box-shadow:0 0 12px rgba(243,226,179,.9);opacity:0;';
            box.appendChild(d);
            tl.fromTo(d, { x: Math.cos(a) * r, y: Math.sin(a) * r, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1.3 + rnd() * 0.3, ease: 'power3.in', immediateRender: false }, 17.6 + rnd() * 0.25);
            tl.to(d, { opacity: 0, duration: 0.1 }, 19.15);
          }
        })();
        tl.to('#s4b', { keyframes: [{ scale: 0.93, duration: 0.1 }, { scale: 1, duration: 0.3 }], ease: 'power2.out' }, 19.10);
        tl.to('#s4b', { backgroundColor: 'rgba(217,188,132,.18)', duration: 0.3 }, 19.10);
        tl.fromTo('#s4ring', { scale: 1, opacity: 0.9 }, { scale: 1.9, opacity: 0, duration: 1.1, ease: 'power2.out', immediateRender: false }, 19.15);
        tl.fromTo('#s4glow', { opacity: 0.3, scale: 0.9 }, { opacity: 1, scale: 1.15, duration: 0.6, ease: 'power2.out', immediateRender: false }, 19.15);
        tl.to('#s4glow', { opacity: 0.55, scale: 1, duration: 1.4, ease: 'sine.inOut' }, 19.8);
        blurIn('#s4pc', 19.3, 0.5);
        count('#s4v', 100, 19.35, 1.5, function (v) { return Math.round(v); });
        tl.to(['#s4o', '#s4pc'], { opacity: 0, filter: 'blur(12px)', scale: 0.95, duration: 0.45, ease: 'power2.in' }, 21.05);

        // ============ STEP 5: publish + lockup ============
        scene(5, 21.60);
        tl.fromTo('#s5ph', { opacity: 0, y: 120, rotationX: 18, transformPerspective: 1600 }, { opacity: 1, y: 0, rotationX: 0, duration: 1.2, ease: 'expo.out', immediateRender: false }, 21.70);
        tl.to('#s5ph', { y: -16, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 22.9);
        tl.fromTo('#s5like', { opacity: 0, x: -40, scale: 0.8 }, { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)', immediateRender: false }, 22.45);
        count('#s5c', 48.2, 22.6, 1.7, function (v) { return v < 1 ? Math.round(v * 1000) + '' : v.toFixed(1) + 'K'; });
        (function () {
          const box = document.getElementById('s5h');
          for (let i = 0; i < 9; i++) {
            const d = document.createElement('span'); d.textContent = '♥';
            d.style.cssText = 'position:absolute;left:' + (790 + rnd() * 120) + 'px;top:830px;font-size:' + (26 + rnd() * 24) + 'px;color:' + (i % 3 ? '#D9BC84' : '#F3E2B3') + ';opacity:0;';
            box.appendChild(d);
            tl.fromTo(d, { y: 0, x: 0, opacity: 0, scale: 0.5 }, { keyframes: [{ opacity: 1, scale: 1, duration: 0.25 }, { opacity: 0, duration: 0.95 }],
              y: -(260 + rnd() * 200), x: (rnd() - 0.5) * 140, ease: 'power1.out', immediateRender: false }, 22.7 + i * 0.17);
          }
        })();
        tl.to('#s5ph', { opacity: 0.25, filter: 'blur(8px)', duration: 0.6, ease: 'power2.inOut' }, 24.40);
        tl.to(['#s5like', '#s5t', '#s5s'], { opacity: 0, duration: 0.3 }, 24.40);
        tl.fromTo('#lk', { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.inOut', immediateRender: false }, 24.45);
        blurIn('#lk0', 24.6, 0.5);
        tl.fromTo('#lk1', { opacity: 0, scale: 1.12, filter: 'blur(16px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.9, ease: 'expo.out', immediateRender: false }, 24.62);
        shine('#lks', 25.05, 1000);
        tl.fromTo('#lk2', { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'expo.inOut', immediateRender: false }, 25.0);
        blurIn('#lk3', 25.25, 0.5);
        tl.to('#lk1', { scale: 1.03, duration: 1.2, ease: 'sine.inOut' }, 25.0);
