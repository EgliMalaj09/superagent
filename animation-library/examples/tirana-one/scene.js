        // ===== ONE WORLD, ONE CAMERA: the Tirana green-space story without cuts =====
        const MM = 40;                                   // px per metre, everywhere
        const LOT = 560, N = 9;                          // the city: 9×9 lots, x 0..5040, y 0..5040
        const WT = 10600, HT = 7400, WC = WT / 2, HC = HT / 2;
        const A = -45 * Math.PI / 180;
        const scr = function (x, y, z) { const dx = x - WC, dy = y - HC; return [dx * Math.cos(A) - dy * Math.sin(A), (dx * Math.sin(A) + dy * Math.cos(A)) * 0.5 - (z || 0) * 0.866]; };
        const camTo = function (x, y, z, s, Y, t, dur, ease) {     // put world point (x,y,z) at screen (540, Y) with zoom s
          const p = scr(x, y, z); const v = { x: -s * p[0], y: (Y - 960) - s * p[1], scale: s, duration: dur, ease: ease || 'power2.inOut' };
          if (t === 0 && dur === 0) { tl.set('#cam', v, 0); } else { tl.to('#cam', v, t); }
        };
        const w = world('w', 'tilt', WT, HT);
        box(w, { x: -60, y: -60, w: WT + 120, d: HT + 120, h: 18, top: '#D6CFC1', s1: '#BDB4A3', s2: '#A69D8C' });
        const G = layer(w, 18);
        let sd = 7; const rr = function () { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };

        // ---------- the patch (front corner lot) ----------
        const PX = 280, PY = 4760;
        box(G, { x: PX - 260, y: PY - 260, w: 520, d: 520, h: 4, top: '#DCD6C9', s1: '#C3BBAA', s2: '#ADA597' });
        const G2 = layer(G, 4);
        const pat = div(G2, 'left:' + PX + 'px;top:' + PY + 'px;width:0;height:0;', 'bx');
        const side = Math.sqrt(3.44) * MM;
        box(pat, { x: -side / 2, y: -side / 2, w: side, d: side, h: 3, topCss: 'background:repeating-linear-gradient(45deg,#7BC67E 0 4px,#72BD75 4px 8px);', top: '#7BC67E', s1: '#5FAE68', s2: '#4E9858' });
        const tufts = layer(pat, 3);
        for (let i = 0; i < 14; i++) { const a = (i * 137.5) * Math.PI / 180, r = 6 + (i * 53) % 28;
          box(tufts, { x: Math.cos(a) * r - 1, y: Math.sin(a) * r - 1, w: 2, d: 2, h: 3 + (i % 3), top: '#5FAE68', s1: '#4E9858', s2: '#3F8A4E' }); }
        const per = person(layer(G2, 3), PX + 14, PY + 10, MM, '#1E1B18');
        const bw = 1.8 * MM, bd = 2.0 * MM;
        const bedO = div(layer(G2, 3.4), 'left:' + (PX - bw / 2) + 'px;top:' + (PY - bd / 2) + 'px;width:' + bw + 'px;height:' + bd + 'px;border:2.5px dashed #1E1B18;background:rgba(255,255,255,.28);', 'bx');
        div(bedO, 'left:6px;top:5px;width:' + (bw - 12) + 'px;height:13px;border:1.5px solid #1E1B18;border-radius:4px;background:rgba(255,255,255,.6);');
        tl.set(bedO, { opacity: 0 }, 0);
        const lb1 = label(G2, PX - 52, PY + 46, 70, '<div class="tagw" style="background:#7BC67E;color:#0f2a17;">3.4 m² gjelbërim</div>');
        const lb2 = label(G2, PX + 60, PY - 40, 74, '<div class="tagw">krevat dopio · 180×200 = 3.6 m²</div>');
        tl.set([lb1, lb2], { scale: 0.001 }, 0);
        // a real bed that drops in on "krevat dopio" (main part)
        const bedL = layer(G2, 3.6);
        const bed = div(bedL, 'left:' + PX + 'px;top:' + PY + 'px;width:0;height:0;', 'bx');
        box(bed, { x: -bw / 2, y: -bd / 2, w: bw, d: bd, h: 0.3 * MM, top: '#FFFFFF', s1: '#E2DCD0', s2: '#CFC8BA' });
        const bl = layer(bed, 0.3 * MM);
        box(bl, { x: -bw / 2 + 6, y: -bd / 2 + 8, w: bw / 2 - 9, d: 16, h: 6, top: '#F6F2EA', s1: '#E2DCD0', s2: '#D4CDBF' });
        box(bl, { x: 3, y: -bd / 2 + 8, w: bw / 2 - 9, d: 16, h: 6, top: '#F6F2EA', s1: '#E2DCD0', s2: '#D4CDBF' });
        box(bl, { x: -bw / 2, y: -bd / 2 + 30, w: bw, d: bd - 30, h: 3, top: '#3E6FB0', s1: '#355F98', s2: '#2C507F' });
        tl.set(bed, { z: 900, scale: 0.001 }, 0);

        // ---------- the city ----------
        const PI = 0, PJ = N - 1;
        const parks = [[0, 6], [0, 4], [0, 2], [2, 8], [4, 8], [6, 8], [2, 6]];
        const isPark = function (i, j) { return parks.some(function (p) { return p[0] === i && p[1] === j; }); };
        let tallest = null; const parkLots = [];
        for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
          if (i === PI && j === PJ) continue;
          const x = i * LOT + 60, y = j * LOT + 60, sz = LOT - 120;
          const pal = PAL[Math.floor(rr() * PAL.length)];
          const ring = Math.max(Math.abs(i - PI), Math.abs(j - PJ));
          const h = Math.round((20 + rr() * 38 + (ring === 1 ? 10 : 0)) * MM);
          if (isPark(i, j)) {                                  // a green lot that will disappear
            const pk = div(G, 'left:0;top:0;width:0;height:0;', 'bx');
            box(pk, { x: x, y: y, w: sz, d: sz, h: 5, top: '#7BC67E', s1: '#5FAE68', s2: '#4E9858' });
            const tr = layer(pk, 5); const trees = [];
            for (let k = 0; k < 4; k++) trees.push(tree(tr, x + 110 + (k % 2) * 220, y + 110 + Math.floor(k / 2) * 220, 3.2));
            const cc = div(G, 'left:0;top:0;width:0;height:0;', 'bx');
            box(cc, { x: x - 1, y: y - 1, w: sz + 2, d: sz + 2, h: 7, top: '#CFC8BA', s1: '#B7AE9D', s2: '#A1988A' });
            tl.set(cc, { scale: 0.001, transformOrigin: (x + sz / 2) + 'px ' + (y + sz / 2) + 'px' }, 0);
            const tw = box(layer(G, 7), { x: x, y: y, w: sz, d: sz, h: h, h0: 0.5, top: pal[0], s1: pal[1], s2: pal[2], win: true });
            tl.set(tw.r, { scale: 0.001, transformOrigin: (x + sz / 2) + 'px ' + (y + sz / 2) + 'px' }, 0);
            parkLots.push({ trees: trees, cc: cc, tw: tw });
          } else {
            const b = box(G, { x: x, y: y, w: sz, d: sz, h: h, top: pal[0], s1: pal[1], s2: pal[2], win: true });
            if (!tallest || h > tallest.h) tallest = { h: h, x: x + sz / 2, y: y + sz / 2 };
          }
        }
        const roofT = tree(layer(G, tallest.h), tallest.x, tallest.y, 6);
        tl.set(roofT, { scale: 0.001 }, 0);

        // ---------- the football pitch (true size: 105 × 68 m) ----------
        const FX = 6000, FY = 4300, FW = 105 * MM, FD = 68 * MM;
        const pitch = div(G, 'left:0;top:0;width:0;height:0;', 'bx');
        box(pitch, { x: FX, y: FY, w: FW, d: FD, h: 4, top: '#4AA35B', s1: '#3F8F50', s2: '#357A44',
          topCss: 'background: radial-gradient(circle at 50% 50%, transparent 360px, #fff 360px 376px, transparent 376px), linear-gradient(90deg, transparent calc(50% - 8px), #fff calc(50% - 8px) calc(50% + 8px), transparent calc(50% + 8px)), repeating-linear-gradient(90deg,#55B267 0 210px,#4AA35B 210px 420px); box-shadow: inset 0 0 0 16px #fff;' });
        const pcc = div(G, 'left:0;top:0;width:0;height:0;', 'bx');
        box(pcc, { x: FX - 2, y: FY - 2, w: FW + 4, d: FD + 4, h: 6, top: '#CFC8BA', s1: '#B7AE9D', s2: '#A1988A' });
        tl.set(pcc, { scaleY: 0.001, transformOrigin: '0px ' + (FY + FD / 2) + 'px' }, 0);
        const pTowers = [];
        for (let k = 0; k < 6; k++) {
          const pal = PAL[k % PAL.length];
          pTowers.push(box(layer(G, 6), { x: FX + 200 + (k % 3) * 1350, y: FY + 260 + Math.floor(k / 3) * 1250, w: 1000, d: 1000, h: Math.round((30 + rr() * 30) * MM), h0: 0.5, top: pal[0], s1: pal[1], s2: pal[2], win: true }));
        }
        pTowers.forEach(function (b) { tl.set(b.r, { scale: 0.001 }, 0); });
        const pLab = label(G, FX + FW / 2, FY + FD / 2, 260, '<div class="tagw" style="font-size:150px;padding:20px 50px;">1 fushë futbolli · 105 × 68 m</div>');
        tl.set(pLab, { scale: 0.001 }, 0);

        // ---------- the comparison plaza (in front of the city, to scale) ----------
        const QX = 400, QY = 5600;
        box(G, { x: QX - 200, y: QY - 200, w: 3000, d: 1500, h: 3, top: '#E4DED2', s1: '#C9C1B1', s2: '#B3AA99' });
        const Q = layer(G, 3);
        const QC = [QX + 1200, QY + 560];
        const at = function (k, row) { return [QC[0] + k * 255 + (row ? -200 : 200), QC[1] + k * 255 + (row ? 200 : -200)]; };
        const cities = [['Stokholm', 34.14, -1, 0, 'g'], ['Kopenhagen', 12.89, 0, 0, 'g'], ['Lisbona', 11.6, 1, 0, 'g'],
                        ['Jugu & Ballkani', 6, -1, 1, 'l'], ['Mesatarja evropiane', 14, 0, 1, 'g'], ['TIRANA', 3.44, 1, 1, 'r']];
        const sq = {};
        cities.forEach(function (c) {
          const s = Math.sqrt(c[1]) * MM, pos = at(c[2], c[3]), cx = pos[0], cy = pos[1];
          const r = div(Q, 'left:' + cx + 'px;top:' + cy + 'px;width:0;height:0;', 'bx');
          const col = c[4] === 'r' ? ['#E0483E', '#C53B32', '#A93229'] : c[4] === 'l' ? ['#A6D49A', '#5FAE68', '#4E9858'] : ['#7BC67E', '#5FAE68', '#4E9858'];
          box(r, { x: -s / 2, y: -s / 2, w: s, d: s, h: 5, top: col[0], s1: col[1], s2: col[2] });
          person(layer(r, 5), s / 2 - 12, s / 2 - 10, MM);
          const isT = c[0] === 'TIRANA';
          const lb = label(r, 0, 0, 120, '<div class="k" style="font-size:' + (isT ? 26 : 22) + 'px;letter-spacing:.08em;' + (isT ? 'color:#E0483E;' : '') + '">' + c[0] + '</div><div class="h" style="font-size:' + (isT ? 64 : 50) + 'px;' + (isT ? 'color:#E0483E;' : '') + '">' + (c[1] % 1 && c[1] < 10 ? c[1].toFixed(2) : Math.round(c[1])) + ' m²</div>');
          tl.set([r, lb], { scale: 0.001 }, 0);
          sq[c[0]] = { r: r, lb: lb, x: cx, y: cy };
        });

        // ================= CAMERA + EVENTS, all on the voice =================
        // HOOK 0–5.9 · the patch looks like a park, the city is revealed, then the bed outline
        camTo(PX, PY, 40, 7.5, 1180, 0, 0);
        camTo(PX, PY, 40, 8.2, 1180, 0.0, 0.9, 'none');
        camTo(PX + 1800, PY - 1800, 0, 0.3, 1250, 0.9, 2.9, 'power2.inOut');
        camTo(PX, PY, 40, 3.2, 1180, 3.75, 0.8, 'power3.inOut');
        tl.fromTo(bedO, { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out', immediateRender: false }, 4.3);
        tl.fromTo(lb1, { scale: 0.001 }, { scale: 1, duration: 0.35, ease: 'back.out(1.6)', immediateRender: false }, 4.55);
        tl.fromTo(lb2, { scale: 0.001 }, { scale: 1, duration: 0.35, ease: 'back.out(1.6)', immediateRender: false }, 4.75);
        tl.to([lb1, lb2], { scale: 0.001, duration: 0.3, ease: 'power2.in' }, 5.9);
        tl.to(bedO, { opacity: 0, duration: 0.3 }, 5.9);
        // 1 · "Tirana po ndërton… dhe hapësirat e gjelbra po zhduken" (6.1–10.3): rise over the city, parks vanish
        camTo(PX + 2200, PY - 2200, 0, 0.36, 1200, 5.95, 1.9, 'power2.inOut');
        parkLots.forEach(function (p, k) {
          const t0 = 8.6 + k * 0.22;
          tl.to(p.trees, { scale: 0.001, duration: 0.4, ease: 'power2.in' }, t0);
          tl.to(p.cc, { scale: 1, duration: 0.35, ease: 'power2.out' }, t0 + 0.3);
          tl.set(p.tw.r, { scale: 1 }, t0 + 0.5); grow(p.tw, t0 + 0.5, 0.9, 'power3.out');
        });
        camTo(PX + 2200, PY - 2200, 0, 0.4, 1200, 8.0, 2.0, 'none');
        // 2 · permits (10.3–21.6): glide to the pitch; counter; 266 pitches; it becomes concrete and towers
        camTo(FX + FW / 2, FY + FD / 2, 0, 0.21, 1150, 10.2, 1.6, 'power2.inOut');
        tl.fromTo(pLab, { scale: 0.001 }, { scale: 1, duration: 0.4, ease: 'back.out(1.6)', immediateRender: false }, 18.7);
        tl.to(pLab, { scale: 0.001, duration: 0.3, ease: 'power2.in' }, 20.0);
        tl.to(pcc, { scaleY: 1, duration: 0.8, ease: 'power2.inOut' }, 20.2);
        pTowers.forEach(function (b, k) { tl.set(b.r, { scale: 1 }, 20.6 + k * 0.12); grow(b, 20.6 + k * 0.12, 0.9, 'power3.out'); });
        camTo(FX + FW / 2, FY + FD / 2, 0, 0.19, 1150, 19.0, 2.5, 'none');
        // 3 · "çdo banor ka rreth 3.4 m² … sa një krevat dopio" (22.2–28.2): back to the patch
        camTo(PX, PY, 40, 3.4, 1180, 21.6, 1.8, 'power2.inOut');
        tl.to(per, { x: 60, y: 60, duration: 0.5, ease: 'power2.inOut' }, 26.6);
        tl.to(bed, { scale: 1, duration: 0.01 }, 27.0);
        tl.to(bed, { z: 0, duration: 0.6, ease: 'bounce.out' }, 27.0);
        tl.to(bed, { z: 1400, duration: 0.6, ease: 'power3.in' }, 28.4);
        tl.to(bed, { scale: 0.001, duration: 0.01 }, 29.0);
        tl.to(per, { x: 0, y: 0, duration: 0.5, ease: 'power2.inOut' }, 29.0);
        // 4 · 2009 → 2014 (29.0–35.8): the patch grows to 3.93 then shrinks back while the bars race
        camTo(PX, PY, 40, 2.6, 900, 28.6, 0.9, 'power2.inOut');
        tl.to(pat, { scale: Math.sqrt(3.93 / 3.44), duration: 0.6, ease: 'power3.out' }, 29.0);
        tl.to(pat, { scale: 1, duration: 1.0, ease: 'power2.inOut' }, 34.6);
        // 5 · Europe vs Tirana (36.2–50.4): glide to the plaza, each square appears on its name
        camTo(QC[0], QC[1], 60, 0.88, 1150, 35.9, 1.6, 'power2.inOut');
        camTo(QC[0], QC[1], 60, 0.94, 1150, 37.5, 11.5, 'none');
        [['Mesatarja evropiane', 37.2], ['Lisbona', 39.9], ['Kopenhagen', 40.7], ['Stokholm', 42.3], ['Jugu & Ballkani', 44.9], ['TIRANA', 49.6]].forEach(function (e) {
          tl.to([sq[e[0]].r], { scale: 1, duration: 0.55, ease: 'back.out(1.6)' }, e[1]);
          tl.to([sq[e[0]].lb], { scale: 1, duration: 0.45, ease: 'back.out(2)' }, e[1] + 0.2);
        });
        // 6 · ×4 (50.4–54.4): frame Europe's average next to Tirana
        camTo((sq['Mesatarja evropiane'].x + sq['TIRANA'].x) / 2, (sq['Mesatarja evropiane'].y + sq['TIRANA'].y) / 2, 0, 1.55, 1150, 50.2, 1.4, 'power2.inOut');
        // 7 · ending (54.5–63): rise over everything; a tree on the tallest roof
        camTo(2600, 2600, 0, 0.17, 1250, 54.3, 4.5, 'power2.inOut');
        tl.to(roofT, { scale: 1, duration: 0.8, ease: 'back.out(2)' }, 57.5);
        camTo(2600, 2600, 0, 0.15, 1250, 58.8, 4.0, 'none');

        // ================= words on screen (screen space, in step with the voice) =================
        const ON = function (sel, t, d) { tl.fromTo(sel, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: d || 0.45, ease: 'power3.out', immediateRender: false }, t); };
        const OFF = function (sel, t) { tl.to(sel, { opacity: 0, duration: 0.35, ease: 'power1.inOut' }, t); };
        tl.set('#h0', { opacity: 1 }, 0); ON('#h1', 0.45); ON('#h2', 2.68); ON('#h3', 4.09); hl('#h3hl', 4.4); OFF('#hook', 5.75);
        ON('#a1', 6.1); ON('#a2', 8.4); hl('#a2hl', 9.4); OFF('#ta', 10.1);
        ON('#b0', 10.4); ON('#b1', 11.0); count('#b1n', 0, 1900000, 12.6, 1.9, function (v) { return Math.round(v).toLocaleString('en-US'); });
        ON('#b2', 16.4); ON('#b3', 16.9); ON('#b4', 18.7); hl('#b4hl', 19.1); OFF('#tb', 21.4);
        ON('#c0', 22.2); ON('#c1', 23.4); hl('#c1hl', 23.8); ON('#c2', 27.0); hl('#c2hl', 27.3); OFF('#c2', 28.4);
        ON('#c3', 28.9); count('#c1n', 3.44, 3.93, 29.0, 0.6, function (v) { return v.toFixed(2); });
        ON('#c4', 30.6); tl.fromTo('#c4b', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.out', immediateRender: false }, 30.9);
        count('#c4v', 0, 3.5, 30.9, 1.2, function (v) { return '+' + v.toFixed(1) + '%'; });
        ON('#c5', 33.4); tl.fromTo('#c5b', { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'power2.out', immediateRender: false }, 33.7);
        count('#c5v', 0, 18.6, 33.7, 1.6, function (v) { return '+' + v.toFixed(1) + '%'; });
        count('#c1n', 3.93, 3.44, 34.6, 1.0, function (v) { return v.toFixed(2); });
        OFF('#tc', 35.8);
        ON('#d0', 36.4); ON('#d1', 36.7); OFF('#td', 50.1);
        ON('#e0', 50.6); tl.fromTo('#e1', { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'power3.out', immediateRender: false }, 51.5); hl('#e0hl', 51.9); OFF('#te', 54.2);
        ON('#f0', 54.5); ON('#f1', 56.9); hl('#f1hl', 57.6); ON('#f2', 59.5); ON('#f3', 60.0);
