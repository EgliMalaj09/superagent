        // ---- Tirana isometric data story (raw_js) ----
        let seed = 5; const rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
        const E = 'expo.out';
        const div = function (p, css, cls) { const d = document.createElement('div'); d.style.cssText = css || ''; if (cls) d.className = cls; p.appendChild(d); return d; };
        // a box with a top and four standing sides; h0 = starting height (grows later with grow())
        const box = function (p, o) {
          const r = div(p, 'left:' + o.x + 'px;top:' + o.y + 'px;width:' + o.w + 'px;height:' + o.d + 'px;', 'bx');
          const s1 = o.win ? 'repeating-linear-gradient(180deg, rgba(255,255,255,0) 0 10px, rgba(30,27,24,.16) 10px 13px), ' + o.s1 : o.s1;
          const s2 = o.win ? 'repeating-linear-gradient(180deg, rgba(255,255,255,0) 0 10px, rgba(30,27,24,.22) 10px 13px), ' + o.s2 : o.s2;
          const t = div(r, 'left:0;top:0;width:' + o.w + 'px;height:' + o.d + 'px;background:' + o.top + ';' + (o.topCss || ''));
          const n = div(r, 'left:0;top:0;width:' + o.w + 'px;height:' + o.h + 'px;background:' + s1 + ';');
          const s = div(r, 'left:0;top:' + o.d + 'px;width:' + o.w + 'px;height:' + o.h + 'px;background:' + s1 + ';');
          const w = div(r, 'left:0;top:0;width:' + o.h + 'px;height:' + o.d + 'px;background:' + s2 + ';');
          const e = div(r, 'left:' + o.w + 'px;top:0;width:' + o.h + 'px;height:' + o.d + 'px;background:' + s2 + ';');
          const k = Math.max(0.004, (o.h0 === undefined ? o.h : o.h0) / o.h);
          tl.set(t, { z: Math.max(0.6, o.h * k) }, 0);
          tl.set([n, s], { transformOrigin: '50% 0%', rotationX: 90, scaleY: k }, 0);
          tl.set([w, e], { transformOrigin: '0% 50%', rotationY: -90, scaleX: k }, 0);
          return { r: r, t: t, ns: [n, s], we: [w, e], h: o.h, k: k };
        };
        const grow = function (b, t, dur, ease) {
          tl.fromTo(b.t, { z: Math.max(0.6, b.h * b.k) }, { z: b.h, duration: dur, ease: ease || 'power3.out', immediateRender: false }, t);
          tl.fromTo(b.ns, { scaleY: b.k }, { scaleY: 1, duration: dur, ease: ease || 'power3.out', immediateRender: false }, t);
          tl.fromTo(b.we, { scaleX: b.k }, { scaleX: 1, duration: dur, ease: ease || 'power3.out', immediateRender: false }, t);
        };
        const layer = function (p, z) { const l = div(p, 'left:0;top:0;width:0;height:0;', 'bx'); tl.set(l, { z: z }, 0); return l; };
        const tree = function (p, x, y, s) {
          const r = div(p, 'left:' + x + 'px;top:' + y + 'px;width:0;height:0;', 'bx');
          box(r, { x: -3 * s, y: -3 * s, w: 6 * s, d: 6 * s, h: 16 * s, top: '#8A6A4A', s1: '#7A5C3E', s2: '#664C33' });
          const c = layer(r, 14 * s);
          box(c, { x: -15 * s, y: -15 * s, w: 30 * s, d: 30 * s, h: 26 * s, top: '#6CC27A', s1: '#3FA66B', s2: '#2F8655' });
          const c2 = layer(r, 40 * s);
          box(c2, { x: -9 * s, y: -9 * s, w: 18 * s, d: 18 * s, h: 12 * s, top: '#86D08F', s1: '#4DB277', s2: '#3A9562' });
          return r;
        };
        const person = function (p, x, y, m, col) {          // m = px per metre
          const r = div(p, 'left:' + x + 'px;top:' + y + 'px;width:0;height:0;', 'bx');
          box(r, { x: -0.22 * m, y: -0.14 * m, w: 0.45 * m, d: 0.28 * m, h: 1.48 * m, top: col || '#1E1B18', s1: col || '#2C2824', s2: '#141210' });
          const hd = layer(r, 1.5 * m);
          box(hd, { x: -0.12 * m, y: -0.12 * m, w: 0.24 * m, d: 0.24 * m, h: 0.25 * m, top: '#E9B994', s1: '#D9A47E', s2: '#C48E69' });
          return r;
        };
        const label = function (p, x, y, z, html) {           // billboard: always faces the viewer (undoes the world rotation)
          const b = div(p, 'left:' + x + 'px;top:' + y + 'px;', 'bb');
          tl.set(b, { z: z, rotation: 45, rotationX: -60 }, 0);
          const i = div(b, '', 'bbl'); i.innerHTML = html; return b;
        };
        const world = function (id, tiltId, W, D) {
          const w = document.getElementById(id);
          w.style.cssText = 'left:' + (-W / 2) + 'px;top:' + (-D / 2) + 'px;width:' + W + 'px;height:' + D + 'px;';
          tl.set('#' + tiltId, { rotationX: 60 }, 0);
          tl.set(w, { rotation: -45, transformOrigin: '50% 50%' }, 0);
          return w;
        };
        const proj = function (x, y, z) {                     // world offset from centre -> screen offset (spin -45, tilt 60)
          const a = -45 * Math.PI / 180, xr = x * Math.cos(a) - y * Math.sin(a), yr = x * Math.sin(a) + y * Math.cos(a);
          return [xr, yr * Math.cos(Math.PI / 3) - z * Math.sin(Math.PI / 3)];
        };
        const up = function (sel, t, d) { tl.fromTo(sel, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: d || 0.5, ease: E, immediateRender: false }, t); };
        const hl = function (sel, t) { tl.fromTo(sel, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power2.out', immediateRender: false }, t); };
        const count = function (sel, a, b, t, dur, fmt) {
          const el = document.querySelector(sel); const o = { v: a };
          tl.fromTo(o, { v: a }, { v: b, duration: dur, ease: 'power2.out', immediateRender: false, onUpdate: function () { el.textContent = fmt(o.v); } }, t);
        };
        const PAL = [['#FFFDF8', '#EDE6D9', '#D6CDBD'], ['#ECE9E3', '#CFC9BE', '#B3AB9E'], ['#F4D9C8', '#E3AF95', '#C98E73'], ['#E2ECF1', '#BACDD7', '#98AFBC'], ['#F7F1E3', '#E6DAC0', '#CDBE9F']];

        // ================= WORLD 1: the city (S1 + S7) =================
        const w1 = world('w1', 'tilt1', 720, 720);
        box(w1, { x: -20, y: -20, w: 760, d: 760, h: 16, top: '#D7D0C2', s1: '#BDB4A3', s2: '#A69D8C' });
        const g1 = layer(w1, 16);
        let tallest = null;
        const towers = [];
        for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) {
          const x = i * 80 + 9, y = j * 80 + 9;
          if (i === 4 && j === 4) {
            box(g1, { x: x - 4, y: y - 4, w: 70, d: 70, h: 4, top: '#7BC67E', s1: '#5FAE68', s2: '#4E9858' });
            const tr = layer(g1, 4); tree(tr, x + 31, y + 31, 1.15);
            continue;
          }
          const pal = PAL[Math.floor(rnd() * PAL.length)];
          const ring = Math.max(Math.abs(i - 4), Math.abs(j - 4));
          const h1 = Math.round(70 + rnd() * 170 + (ring === 1 ? 70 : 0) + (rnd() < 0.12 ? 120 : 0));
          const b = box(g1, { x: x, y: y, w: 62, d: 62, h: h1, h0: 14 + rnd() * 14, top: pal[0], s1: pal[1], s2: pal[2], win: true });
          towers.push({ b: b, ring: ring, r: rnd() });
          if (!tallest || h1 > tallest.h) tallest = { h: h1, x: x, y: y };
        }
        towers.sort(function (a, b) { return (b.ring - a.ring) || (a.r - b.r); });
        towers.forEach(function (o, n) { grow(o.b, 0.85 + n * 0.031, 0.55, 'power3.out'); });
        for (let n = 0; n < 46; n++) {                       // people on the streets, more and more
          const st = rnd() < 0.5;
          const px = st ? Math.floor(rnd() * 9) * 80 + 4 : rnd() * 720, py = st ? rnd() * 720 : Math.floor(rnd() * 9) * 80 + 4;
          const pr = div(g1, 'left:' + px + 'px;top:' + py + 'px;width:0;height:0;', 'bx');
          box(pr, { x: -2.5, y: -2.5, w: 5, d: 5, h: 11, top: ['#E0483E', '#1E1B18', '#3E6FB0', '#F6D743'][n % 4], s1: '#2C2824', s2: '#141210' });
          tl.fromTo(pr, { scale: 0.001 }, { scale: 1, duration: 0.25, ease: 'back.out(2)', immediateRender: false }, 1.0 + rnd() * 2.6);
        }
        const roof = layer(g1, tallest.h); const rt = tree(roof, tallest.x + 31, tallest.y + 31, 1.0);
        tl.set(rt, { scale: 0.001 }, 0);
        tl.fromTo('#cam1', { scale: 0.86, y: 40 }, { scale: 1.08, y: 60, duration: 4.0, ease: 'power1.inOut', immediateRender: false }, 0);
        tl.fromTo('#t1a', { scale: 1.06 }, { scale: 1, duration: 0.6, ease: E, immediateRender: false }, 0);
        up('#t1b', 2.1); hl('#t1hl', 2.55);
        tl.to(['#t1a', '#t1b', '#t1k'], { opacity: 0, y: -20, duration: 0.25 }, 3.7);
        // S7: back to the city, pull out, one rooftop tree
        tl.fromTo('#cam1', { scale: 1.45, y: 160 }, { scale: 0.74, y: 110, duration: 7.6, ease: 'power2.inOut', immediateRender: false }, 50.0);
        tl.fromTo('#w1', { rotation: -45 }, { rotation: -22, duration: 7.8, ease: 'power1.inOut', immediateRender: false }, 50.0);
        tl.fromTo(rt, { scale: 0.001 }, { scale: 1.4, duration: 0.8, ease: 'back.out(2)', immediateRender: false }, 52.4);
        up('#t7a', 50.3); up('#t7b', 52.0); hl('#t7hl', 52.7);
        tl.fromTo('#t7c', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)', immediateRender: false }, 55.0);
        up('#t7s', 55.4);

        // ================= WORLD 2: permits = football pitches =================
        const w2 = world('w2', 'tilt2', 590, 560);
        box(w2, { x: -24, y: -24, w: 638, d: 608, h: 14, top: '#DCD5C7', s1: '#BFB6A5', s2: '#A89F8E' });
        const g2 = layer(w2, 14);
        const pitchTop = 'radial-gradient(circle at 50% 50%, transparent 11px, #fff 11px 13px, transparent 13px), linear-gradient(90deg, transparent calc(50% - 1px), #fff calc(50% - 1px) calc(50% + 1px), transparent calc(50% + 1px)), repeating-linear-gradient(90deg,#55B267 0 13px,#4AA35B 13px 26px)';
        let pn = 0;
        for (let i = 0; i < 5; i++) for (let j = 0; j < 7; j++) {
          const x = i * 118 + 7, y = j * 80 + 7;
          const pr = div(g2, 'left:0;top:0;width:0;height:0;', 'bx');
          box(pr, { x: x, y: y, w: 104, d: 66, h: 3, top: pitchTop, topCss: 'box-shadow: inset 0 0 0 2px #fff;', s1: '#3F8F50', s2: '#357A44' });
          tl.fromTo(pr, { scale: 0.001, transformOrigin: (x + 52) + 'px ' + (y + 33) + 'px' }, { scale: 1, duration: 0.35, ease: 'back.out(1.8)', immediateRender: false }, 4.35 + pn * 0.025);
          const t2 = 8.3 + rnd() * 2.2;
          const cc = div(g2, 'left:0;top:0;width:0;height:0;', 'bx');
          box(cc, { x: x - 1, y: y - 1, w: 106, d: 68, h: 5, top: '#C9C2B4', s1: '#B0A796', s2: '#9C9382' });
          tl.set(cc, { scale: 0.001, transformOrigin: (x + 52) + 'px ' + (y + 33) + 'px' }, 0);
          tl.to(cc, { scale: 1, duration: 0.3, ease: 'power2.out' }, t2);
          const pal = PAL[Math.floor(rnd() * PAL.length)];
          const lay = layer(g2, 5);
          const b = box(lay, { x: x + 14, y: y + 10, w: 76, d: 46, h: 40 + Math.round(rnd() * 120), h0: 0.5, top: pal[0], s1: pal[1], s2: pal[2], win: true });
          grow(b, t2 + 0.2, 0.6, 'power3.out');
          pn++;
        }
        count('#s2n', 0, 1900000, 4.3, 2.0, function (v) { return Math.round(v).toLocaleString('en-US'); });
        tl.fromTo('#s2c1', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35, ease: 'back.out(2)', immediateRender: false }, 6.4);
        tl.fromTo('#s2c2', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35, ease: 'back.out(2)', immediateRender: false }, 6.8);
        up('#s2l', 7.1); hl('#s2hl', 7.5);
        tl.fromTo('#cam2', { scale: 0.92 }, { scale: 1.02, duration: 8, ease: 'none', immediateRender: false }, 4.0);
        tl.fromTo('#w2', { rotation: -45 }, { rotation: -36, duration: 8, ease: 'power1.inOut', immediateRender: false }, 4.0);

        // ================= WORLD 3: 3.44 m² per person (S3 + S4) =================
        const M = 105;                                        // px per metre
        const w3 = world('w3', 'tilt3', 420, 420);
        box(w3, { x: 0, y: 0, w: 420, d: 420, h: 12, top: '#D7D0C2', s1: '#BDB4A3', s2: '#A69D8C' });
        const g3 = layer(w3, 12);
        const sq = div(g3, 'left:210px;top:210px;width:0;height:0;', 'bx');
        const side = Math.sqrt(3.44) * M;
        box(sq, { x: -side / 2, y: -side / 2, w: side, d: side, h: 6, top: '#7BC67E', s1: '#5FAE68', s2: '#4E9858' });
        tl.set(sq, { scale: 0.001 }, 0);
        tl.to(sq, { scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, 12.3);
        const pl = layer(g3, 6);
        const per = person(pl, 210 + side / 2 - 30, 210 + side / 2 - 26, M);
        tl.set(per, { z: 400, scale: 0.001 }, 0);
        tl.to(per, { z: 0, scale: 1, duration: 0.5, ease: 'power3.out' }, 12.8);
        const bed = div(pl, 'left:210px;top:210px;width:0;height:0;', 'bx');
        const bw = 1.6 * M, bd = 2.0 * M;
        box(bed, { x: -bw / 2, y: -bd / 2, w: bw, d: bd, h: 0.32 * M, top: '#FFFFFF', s1: '#E2DCD0', s2: '#CFC8BA' });
        const bl = layer(bed, 0.32 * M);
        box(bl, { x: -bw / 2 + 10, y: -bd / 2 + 14, w: bw / 2 - 16, d: 34, h: 12, top: '#F6F2EA', s1: '#E2DCD0', s2: '#D4CDBF' });
        box(bl, { x: 6, y: -bd / 2 + 14, w: bw / 2 - 16, d: 34, h: 12, top: '#F6F2EA', s1: '#E2DCD0', s2: '#D4CDBF' });
        box(bl, { x: -bw / 2, y: -bd / 2 + 66, w: bw, d: bd - 66, h: 6, top: '#3E6FB0', s1: '#355F98', s2: '#2C507F' });
        box(bed, { x: -bw / 2, y: -bd / 2 - 12, w: bw, d: 12, h: 0.95 * M, top: '#8A6A4A', s1: '#7A5C3E', s2: '#664C33' });
        tl.set(bed, { z: 600, scale: 0.001 }, 0);
        tl.to(per, { x: 70, y: 70, duration: 0.5, ease: 'power2.inOut' }, 15.7);
        tl.to(bed, { scale: 1, duration: 0.01 }, 16.1);
        tl.to(bed, { z: 0, duration: 0.55, ease: 'bounce.out' }, 16.1);
        up('#s3b', 16.7); hl('#s3bhl', 17.1);
        tl.to(bed, { z: 700, duration: 0.6, ease: 'power3.in' }, 19.3);
        tl.to(bed, { scale: 0.001, duration: 0.01 }, 19.9);
        tl.to('#s3b', { opacity: 0, duration: 0.3 }, 19.4);
        tl.to(per, { x: 0, y: 0, duration: 0.5, ease: 'power2.inOut' }, 19.8);
        up('#s3k', 12.3); hl('#s3hl', 13.5);
        tl.fromTo('#cam3', { scale: 1.25, y: 40 }, { scale: 1.45, y: 60, duration: 9.5, ease: 'none', immediateRender: false }, 12.0);
        tl.fromTo('#w3', { rotation: -45 }, { rotation: -35, duration: 18, ease: 'none', immediateRender: false }, 12.0);
        // S4: 2009 -> 2014, the share shrinks
        tl.to('#cam3', { scale: 1.05, y: -170, duration: 0.8, ease: 'power3.inOut' }, 22.0);
        count('#s3n', 3.44, 3.93, 22.3, 0.6, function (v) { return v.toFixed(2); });
        tl.to(sq, { scale: Math.sqrt(3.93 / 3.44), duration: 0.6, ease: 'power3.out' }, 22.3);
        up('#s3y', 22.35);
        tl.fromTo('#bars', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: E, immediateRender: false }, 22.8);
        tl.fromTo('#bg1', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.out', immediateRender: false }, 23.2);
        count('#bv1', 0, 3.5, 23.2, 1.2, function (v) { return '+' + v.toFixed(1) + '%'; });
        tl.fromTo('#bg2', { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'power2.out', immediateRender: false }, 24.0);
        count('#bv2', 0, 18.6, 24.0, 1.6, function (v) { return '+' + v.toFixed(1) + '%'; });
        tl.to(sq, { scale: 1, duration: 1.0, ease: 'power2.inOut' }, 26.2);
        count('#s3n', 3.93, 3.44, 26.2, 1.0, function (v) { return v.toFixed(2); });
        tl.to('#y09', { opacity: 0, y: -20, duration: 0.3 }, 26.2); tl.fromTo('#y14', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: E, immediateRender: false }, 26.3);
        tl.to('#s3hl', { backgroundColor: '#F4A9A3', duration: 0.4 }, 26.4);

        // ================= WORLD 5: Europe vs Tirana, to scale =================
        const Q = 46;
        const w5 = world('w5', 'tilt5', 940, 860);
        box(w5, { x: -20, y: -20, w: 980, d: 900, h: 12, top: '#E4DED2', s1: '#C9C1B1', s2: '#B3AA99' });
        const g5 = layer(w5, 12);
        const cities = [
          ['Stokholm', 34.14, 20, 20, 34.6, '#7BC67E'], ['Mesatarja evropiane', 14, 420, 70, 30.8, '#7BC67E'], ['Kopenhagen', 12.89, 720, 75, 33.4, '#7BC67E'],
          ['Lisbona', 11.6, 60, 560, 32.6, '#7BC67E'], ['Jugu & Ballkani', 6, 420, 600, 38.0, '#A6D49A'], ['TIRANA', 3.44, 740, 620, 40.5, '#E0483E']];
        let tir = null;
        cities.forEach(function (c) {
          const s = Math.sqrt(c[1]) * Q;
          const r = div(g5, 'left:' + (c[2] + s / 2) + 'px;top:' + (c[3] + s / 2) + 'px;width:0;height:0;', 'bx');
          const dark = c[5] === '#E0483E' ? ['#C53B32', '#A93229'] : ['#5FAE68', '#4E9858'];
          box(r, { x: -s / 2, y: -s / 2, w: s, d: s, h: 8, top: c[5], s1: dark[0], s2: dark[1] });
          const pl = layer(r, 8); person(pl, s / 2 - 14, s / 2 - 12, Q);
          tl.set(r, { scale: 0.001 }, 0);
          tl.to(r, { scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, c[4]);
          const isT = c[0] === 'TIRANA';
          const lb = label(r, 0, 0, 70 + (isT ? 20 : 0), '<div class="k" style="font-size:' + (isT ? 26 : 20) + 'px;letter-spacing:.12em;' + (isT ? 'color:#E0483E;' : '') + '">' + c[0] + '</div>' +
            '<div class="h" style="font-size:' + (isT ? 64 : 46) + 'px;' + (isT ? 'color:#E0483E;' : '') + '">' + (c[1] < 10 ? c[1].toFixed(c[1] % 1 ? 2 : 0) : Math.round(c[1])) + ' m²</div>');
          tl.set(lb, { scale: 0.001 }, 0);
          tl.to(lb, { scale: 1, duration: 0.45, ease: 'back.out(2)' }, c[4] + 0.25);
          if (isT) tir = { x: c[2] + s / 2 - 470, y: c[3] + s / 2 - 430 };
        });
        up('#s5t', 30.2);
        tl.fromTo('#cam5', { scale: 0.74, x: 0, y: 40 }, { scale: 0.78, x: 0, y: 40, duration: 11, ease: 'none', immediateRender: false }, 30.0);
        (function () { const p = proj(tir.x, tir.y, 40); const s = 1.7;
          tl.to('#cam5', { scale: s, x: -p[0] * s, y: -p[1] * s + 40, duration: 2.2, ease: 'power3.inOut' }, 41.4); })();

        // ================= S6: four times less =================
        tl.fromTo('#q1', { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: E, immediateRender: false }, 45.2);
        tl.fromTo('#q2', { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: E, immediateRender: false }, 45.5);
        up('#q1l', 45.6); up('#q2l', 45.8);
        tl.fromTo('#x4', { scale: 2.6, opacity: 0, rotation: -12 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.35, ease: E, immediateRender: false }, 46.8);
        tl.to('#s6', { keyframes: [{ x: -14 }, { x: 10 }, { x: -6 }, { x: 0 }], duration: 0.25, ease: 'none' }, 46.85);
        up('#q3', 47.4); hl('#q3hl', 47.8);

        // ---- re-time everything to the recorded voice-over (piecewise map: old time -> new time) ----
        (function () {
          const M = [[0, 0], [2.1, 2.9], [4.0, 5.3], [4.3, 7.9], [6.3, 9.9], [6.4, 10.6], [6.8, 11.0], [7.1, 13.3], [8.3, 14.2], [12.0, 16.4], [13.5, 18.6], [16.1, 21.2], [16.7, 21.7], [19.3, 22.6], [22.0, 23.3], [23.2, 25.6], [24.0, 28.3], [26.2, 29.4], [30.0, 30.8], [30.8, 31.6], [32.6, 34.3], [33.4, 35.1], [34.6, 36.7], [38.0, 39.4], [40.5, 44.1], [41.4, 44.4], [45.0, 45.3], [46.8, 46.0], [47.4, 46.6], [50.0, 49.0], [50.3, 49.9], [52.0, 51.5], [52.7, 52.2], [55.0, 54.0], [55.4, 54.6], [58.0, 57.0]];
          const m = function (t) { for (let i = 0; i < M.length - 1; i++) { const a = M[i], c = M[i + 1]; if (t >= a[0] && t <= c[0]) return c[0] > a[0] ? a[1] + (c[1] - a[1]) * (t - a[0]) / (c[0] - a[0]) : a[1]; } return M[M.length - 1][1]; };
          tl.getChildren(false, true, true).forEach(function (tw) {
            const s = tw.startTime(), td = tw.totalDuration(), ns = m(s);
            tw.startTime(ns);
            if (td > 0) tw.totalDuration(Math.max(0.02, m(s + td) - ns));
          });
        })();
