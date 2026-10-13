        // ---- cyberOZ LinkedIn video (4:5) ----
        let seed = 9; const rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
        const E = 'expo.out', B = 'back.out(1.7)';
        const IC = {
          sheet: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6M8 13h2M14 13h2M8 17h2M14 17h2"/>',
          folder: '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>',
          mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
          cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
          spark: '<path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2Z"/>',
          server: '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01M6 18h.01"/>',
          laptop: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/>',
          git: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M6 9v6M18 9a9 9 0 0 1-9 9"/>',
          user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
          shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>',
          key: '<circle cx="8" cy="15" r="5"/><path d="m11.5 11.5 8-8M17 6l3 3M15 8l2 2"/>',
          alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/>'
        };
        const svg = function (k, col) { return '<svg viewBox="0 0 24 24" fill="none" stroke="' + (col || 'currentColor') + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + IC[k] + '</svg>'; };
        const up = function (sel, t, d, dy) { tl.fromTo(sel, { y: dy || 40, opacity: 0 }, { y: 0, opacity: 1, duration: d || 0.55, ease: E, immediateRender: false }, t); };
        const out = function (sel, t) { tl.to(sel, { y: -24, opacity: 0, duration: 0.3, ease: 'power2.in' }, t); };

        // ===== S1: compliance chaos =====
        tl.fromTo('#a1', { scale: 1.06 }, { scale: 1, duration: 0.6, ease: E, immediateRender: false }, 0);
        tl.fromTo('#a2', { x: -30 }, { keyframes: [{ x: 18 }, { x: -12 }, { x: 0 }], duration: 0.9, ease: 'sine.inOut', immediateRender: false }, 1.0);
        const items = [['sheet', 'Q3_Risks_FINAL_v7.xlsx', '#16A34A', 70, 430, -6, 'sh'], ['folder', 'Evidence (shared)', '#D97706', 560, 470, 5, 'fo'],
          ['mail', 'Re: Re: who owns this control?', '#2563EB', 160, 600, 3, 'ma'], ['cloud', 'New cloud account', '#0EA5E9', 640, 650, -4, 'x'],
          ['sheet', 'Asset_list_OLD.xlsx', '#16A34A', 520, 840, 7, 'sh'], ['spark', 'New AI tool', '#7C3AED', 90, 820, -8, 'x'],
          ['folder', 'Policies_2023', '#D97706', 180, 1010, 4, 'fo'], ['mail', 'Fwd: audit next week??', '#2563EB', 560, 1030, -5, 'ma']];
        const pile = document.getElementById('pile');
        items.forEach(function (it, i) {
          const c = document.createElement('div'); c.className = 'card ' + it[6]; c.style.cssText = 'left:' + it[3] + 'px;top:' + it[4] + 'px;opacity:0;';
          c.innerHTML = '<span class="ic" style="background:' + it[2] + '1A;color:' + it[2] + ';">' + svg(it[0]) + '</span>' + it[1];
          pile.appendChild(c);
          const fx = (rnd() < 0.5 ? -1 : 1) * (500 + rnd() * 300), fy = (rnd() - 0.5) * 500;
          tl.fromTo(c, { x: fx, y: fy, rotation: it[5] * 4, opacity: 0 }, { x: 0, y: 0, rotation: it[5], opacity: 1, duration: 0.6, ease: 'power3.out', immediateRender: false }, 0.25 + i * 0.28);
          tl.to(c, { x: (rnd() - 0.5) * 30, y: (rnd() - 0.5) * 24, rotation: it[5] + (rnd() - 0.5) * 6, duration: 5.5, ease: 'sine.inOut' }, 0.9 + i * 0.28);
        });
        tl.fromTo('#warn', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: B, immediateRender: false }, 2.6);
        tl.to('#warn', { scale: 1.12, duration: 0.35, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 3.0);
        // ===== S2: the words, then snapshot vs reality =====
        out(['#a1', '#a2'], 3.95);
        [['#b1', '.sh', 4.2], ['#b2', '.fo', 4.8], ['#b3', '.ma', 5.4]].forEach(function (b) {
          up(b[0], b[2], 0.45, 30);
          tl.to('#pile ' + b[1], { keyframes: [{ x: '-=10' }, { x: '+=20' }, { x: '-=10' }], duration: 0.3, ease: 'none' }, b[2] + 0.05);
          tl.to('#pile ' + b[1], { borderColor: '#DC2626', duration: 0.2 }, b[2] + 0.05);
        });
        tl.to(['#b1', '#b2', '#b3'], { x: -60, opacity: 0, duration: 0.35, stagger: 0.05, ease: 'power2.in' }, 6.25);
        tl.to(['#pile', '#warn'], { opacity: 0.12, filter: 'blur(4px)', duration: 0.5, ease: 'power2.inOut' }, 6.3);
        tl.fromTo('#cal', { opacity: 0, rotationY: 90, transformPerspective: 1200 }, { opacity: 1, rotationY: 0, duration: 0.6, ease: B, immediateRender: false }, 6.45);
        up('#c1', 7.0); up('#c2', 7.6);
        tl.fromTo('#rline', { strokeDashoffset: 1400 }, { strokeDashoffset: 0, duration: 1.8, ease: 'power1.inOut', immediateRender: false }, 6.9);
        up('#rlab', 8.3, 0.4, 20);
        // collapse into one
        tl.to(['#cal', '#pile', '#warn', '#rlab', '#chart'], { scale: 0.2, opacity: 0, duration: 0.35, ease: 'power3.in' }, 8.95);
        tl.to(['#c1', '#c2'], { opacity: 0, duration: 0.25 }, 8.95);

        // ===== S3: logo, then "Compliance Simplified" =====
        tl.fromTo('#bw', { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(80% at 50% 50%)', duration: 0.55, ease: 'power3.inOut', immediateRender: true }, 9.15);
        tl.fromTo('#lgW', { scale: 0.6, opacity: 0, rotation: -8 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: E, immediateRender: false }, 9.6);
        tl.to('#lgW', { scale: 1.05, duration: 1.4, ease: 'sine.inOut' }, 10.4);
        tl.fromTo('#bl', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power3.inOut', immediateRender: false }, 11.15);
        tl.fromTo('#lgS', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: B, immediateRender: false }, 11.45);
        tl.fromTo('#d1', { y: 50, opacity: 0, filter: 'blur(10px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: E, immediateRender: false }, 11.5);
        tl.fromTo('#d2', { y: 50, opacity: 0, filter: 'blur(10px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: E, immediateRender: false }, 11.85);
        tl.fromTo('#d2u', { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.out', immediateRender: false }, 12.25);
        up('#d3', 12.35, 0.5, 20);

        // ===== S4: the platform =====
        up('#e0', 13.1, 0.45, 16); up('#e1', 13.2); up('#e2', 13.6, 0.5, 20);
        tl.fromTo('#dB', { opacity: 0, y: 160, rotationX: 24, rotationY: -12 }, { opacity: 1, y: 0, rotationX: 12, rotationY: -8, duration: 1.0, ease: E, immediateRender: false }, 13.7);
        tl.fromTo('#dA', { opacity: 0, y: 220, rotationX: 26, rotationY: -14 }, { opacity: 1, y: 0, rotationX: 12, rotationY: -8, duration: 1.1, ease: E, immediateRender: false }, 13.9);
        tl.to('#dA', { rotationX: 4, rotationY: -2, y: -20, duration: 5.2, ease: 'sine.inOut' }, 15.0);
        tl.to('#dB', { rotationX: 6, rotationY: -4, y: -50, x: 20, duration: 5.2, ease: 'sine.inOut' }, 15.0);
        ['#m0', '#m1', '#m2', '#m3', '#m4', '#m5'].forEach(function (m, i) {
          tl.fromTo(m, { scale: 0.5, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: B, immediateRender: false }, 14.7 + i * 0.32);
          tl.to(m, { y: -8, duration: 1.4, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 15.3 + i * 0.32);
        });

        // ===== S5: Build -> Manage -> Automate =====
        up('#f1', 20.1); up('#f2', 20.35);
        [['server', 'Systems'], ['laptop', 'Devices'], ['cloud', 'Cloud'], ['git', 'Code']].forEach(function (a, i) {
          const t = document.getElementById('t' + i); t.innerHTML = svg(a[0]) + a[1];
          tl.fromTo(t, { y: -260, opacity: 0, rotation: (i % 2 ? 6 : -6) }, { y: 0, opacity: 1, rotation: 0, duration: 0.55, ease: 'bounce.out', immediateRender: false }, 20.7 + i * 0.22);
        });
        tl.to(['#t0', '#t1', '#t2', '#t3'], { scale: 0.6, opacity: 0, duration: 0.35, stagger: 0.04, ease: 'power2.in' }, 22.35);
        [['server', 'Asset'], ['alert', 'Risk'], ['shield', 'Control'], ['user', 'Owner']].forEach(function (a, i) {
          const n = document.getElementById('n' + i); n.innerHTML = '<div class="o">' + svg(a[0]) + '</div><span>' + a[1] + '</span>';
          tl.fromTo(n, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: B, immediateRender: false }, 22.7 + i * 0.32);
          if (i < 3) tl.fromTo('#fl' + i, { strokeDashoffset: 170 }, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out', immediateRender: false }, 22.95 + i * 0.32);
        });
        (function () {                                         // automate: data pulses run along the chain
          const box = document.getElementById('pulses');
          for (let k = 0; k < 6; k++) {
            const p = document.createElement('i');
            p.style.cssText = 'position:absolute;left:225px;top:461px;width:18px;height:18px;border-radius:50%;background:#B0306F;box-shadow:0 0 16px #B0306F;opacity:0;';
            box.appendChild(p);
            tl.fromTo(p, { x: 0, opacity: 0 }, { keyframes: [{ opacity: 1, duration: 0.1 }, { x: 670, duration: 1.0 }, { opacity: 0, duration: 0.1 }], ease: 'none', immediateRender: false }, 24.7 + k * 0.38);
          }
        })();
        tl.fromTo('#evc', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: E, immediateRender: false }, 24.8);
        [25.3, 25.8, 26.3].forEach(function (t, i) {
          tl.to('#x' + i, { backgroundColor: '#16A34A', borderColor: '#16A34A', duration: 0.2 }, t);
          tl.fromTo('#x' + i + ' svg', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.3, ease: B, immediateRender: false }, t);
        });
        [[0, 20.6], [1, 22.6], [2, 24.6]].forEach(function (s) {
          tl.to('#sn' + s[0], { backgroundColor: '#660033', color: '#fff', scale: 1.12, duration: 0.3, ease: B }, s[1]);
          if (s[0] > 0) tl.to('#sn' + (s[0] - 1), { scale: 1, duration: 0.3 }, s[1]);
        });
        tl.fromTo('#trk', { scaleX: 0 }, { scaleX: 1, duration: 4.2, ease: 'none', immediateRender: false }, 20.6);
        tl.fromTo(['#s0', '#s1', '#s2'], { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: E, immediateRender: false }, 20.3);

        // ===== S6: tech stack mapped to controls, drift =====
        up('#g1', 27.1); up('#g2', 27.45);
        [['cloud', 'Cloud accounts'], ['key', 'Identity provider'], ['git', 'Code repositories'], ['server', 'S3 buckets']].forEach(function (a, i) {
          const k = document.getElementById('k' + i);
          k.innerHTML = '<span class="ic" style="background:#F4E6EE;color:#660033;">' + svg(a[0]) + '</span>' + a[1];
          tl.fromTo(k, { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: E, immediateRender: false }, 27.8 + i * 0.15);
        });
        ['#q0', '#q1', '#q2'].forEach(function (q, i) { tl.fromTo(q, { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: E, immediateRender: false }, 27.9 + i * 0.15); });
        (function () {
          const W = document.getElementById('wires'); const L = [[0, 0], [0, 1], [1, 2], [2, 1], [3, 0]];
          const ny = [440, 595, 750, 905], qy = [490, 670, 850];
          L.forEach(function (l, i) {
            const y1 = ny[l[0]], y2 = qy[l[1]];
            const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            p.setAttribute('d', 'M390 ' + y1 + ' C 530 ' + y1 + ', 530 ' + y2 + ', 670 ' + y2);
            p.setAttribute('fill', 'none'); p.setAttribute('stroke', '#C99AB2'); p.setAttribute('stroke-width', '4');
            p.setAttribute('stroke-dasharray', '400'); p.setAttribute('stroke-dashoffset', '400'); p.setAttribute('id', 'wr' + i);
            W.appendChild(p);
            tl.fromTo(p, { strokeDashoffset: 400 }, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, 28.6 + i * 0.12);
          });
        })();
        ['#p0', '#p1', '#p2'].forEach(function (p, i) { tl.fromTo(p, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: B, immediateRender: false }, 29.4 + i * 0.12); });
        tl.to('#k3', { borderColor: '#DC2626', backgroundColor: '#FEF2F2', duration: 0.25 }, 30.4);
        tl.to('#k3', { keyframes: [{ x: -8 }, { x: 8 }, { x: -4 }, { x: 0 }], duration: 0.3, ease: 'none' }, 30.4);
        tl.to('#wr4', { stroke: '#DC2626', duration: 0.25 }, 30.45);
        tl.to('#p0', { opacity: 0, duration: 0.15 }, 30.5);
        tl.fromTo('#p0b', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: B, immediateRender: false }, 30.55);
        tl.to('#q0', { borderColor: '#FCA5A5', duration: 0.25 }, 30.55);
        tl.fromTo('#toast', { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: B, immediateRender: false }, 30.6);
        out(['#g1', '#g2'], 30.75);
        up('#g3', 30.95); up('#g4', 31.25);
        up('#g5', 31.8, 0.5, 20);

        // ===== S7: every framework =====
        up('#h1', 33.1); up('#h2', 33.35);
        (function () {
          const g = document.getElementById('grid');
          const F = [['soc2', 'SOC 2'], ['iso27001', 'ISO 27001'], ['gdpr', 'GDPR'], ['dora', 'DORA'], ['nis2', 'NIS2'], ['tisax', 'TISAX'], ['pcidss', 'PCI DSS'], ['iso42001', 'ISO 42001'], ['euaiact', 'EU AI Act']];
          F.forEach(function (f, i) {
            const b = document.createElement('div'); b.className = 'badge';
            b.style.cssText = 'left:' + (105 + (i % 3) * 310) + 'px;top:' + (370 + Math.floor(i / 3) * 300) + 'px;';
            b.innerHTML = '<img src="img/' + f[0] + '.svg" alt=""/><span>' + f[1] + '</span>';
            g.appendChild(b);
            tl.fromTo(b, { rotationY: 90, opacity: 0, transformPerspective: 1200 }, { rotationY: 0, opacity: 1, duration: 0.55, ease: B, immediateRender: false }, 33.7 + i * 0.11);
            tl.to(b, { y: -10, duration: 1.3, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 34.9 + (i % 3) * 0.2);
          });
        })();

        // ===== S8: trust =====
        up('#i1', 38.2); tl.fromTo('#i2', { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'expo.inOut', immediateRender: false }, 38.8); up('#i3', 39.1);

        // ===== S9: CTA =====
        tl.fromTo('#sH', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.inOut', immediateRender: true }, 41.0);
        up('#j1', 41.25); up('#j2', 41.45);
        tl.fromTo('#j3', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: B, immediateRender: false }, 41.8);
        tl.fromTo('#cur', { opacity: 0, x: 60, y: 60 }, { opacity: 1, x: 0, y: 0, duration: 0.25, ease: 'power2.out', immediateRender: false }, 42.0);
        tl.to('#cur', { x: -250, y: -320, duration: 0.5, ease: 'power3.inOut' }, 42.2);
        tl.to('#j3', { keyframes: [{ scale: 0.93, duration: 0.08 }, { scale: 1.04, duration: 0.15 }, { scale: 1, duration: 0.15 }] }, 42.7);
        tl.fromTo('#jr', { scale: 0.4, opacity: 1 }, { scale: 2.6, opacity: 0, duration: 0.6, ease: 'power2.out', immediateRender: false }, 42.72);
        tl.to('#cur', { opacity: 0, duration: 0.2 }, 43.1);
        tl.fromTo('#j4', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: E, immediateRender: false }, 43.0);
