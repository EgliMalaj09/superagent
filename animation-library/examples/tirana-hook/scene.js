        // ===== HOOK: "Në Tiranë, hapësira e gjelbër për banor është më e vogël se një krevat dopio." =====
        // It opens so close that the patch of grass reads as a park; the camera pulls back to reveal a tiny patch among towers,
        // then returns and lays a 180×200 cm bed outline over it.
        const MM = 40;                                          // px per metre
        const LOT = 560, N = 9, W0 = LOT * N;
        const w = world('wh', 'tilth', W0, W0);
        const PI = 0, PJ = N - 1;                              // the patch sits in the front corner lot, so every tower stands behind it
        const C = 0;                                            // (C is only used through CX / CY below)
        const CX = (PI + 0.5) * LOT, CY = (PJ + 0.5) * LOT;
        const wr = div(w, 'left:' + (W0 / 2 - CX) + 'px;top:' + (W0 / 2 - CY) + 'px;width:0;height:0;', 'bx');   // shift the city so the patch sits on the camera axis
        box(wr, { x: -40, y: -40, w: W0 + 80, d: W0 + 80, h: 18, top: '#CFC8BA', s1: '#B7AE9D', s2: '#A1988A' });
        const g = layer(wr, 18);
        // the central plaza (concrete) with the green patch: 3.44 m² ≈ 1.855 m a side
        box(g, { x: CX - 260, y: CY - 260, w: 520, d: 520, h: 4, top: '#D9D3C6', s1: '#C3BBAA', s2: '#ADA597' });
        const g2 = layer(g, 4);
        const side = Math.sqrt(3.44) * MM;
        box(g2, { x: CX - side / 2, y: CY - side / 2, w: side, d: side, h: 3, topCss: 'background:repeating-linear-gradient(45deg,#7BC67E 0 4px,#72BD75 4px 8px);', top: '#7BC67E', s1: '#5FAE68', s2: '#4E9858' });
        const g3 = layer(g2, 3);
        for (let i = 0; i < 14; i++) {                          // grass tufts so the close-up reads as a lawn
          const a = (i * 137.5) * Math.PI / 180, r = 6 + (i * 53) % 28;
          box(g3, { x: CX + Math.cos(a) * r - 1, y: CY + Math.sin(a) * r - 1, w: 2, d: 2, h: 3 + (i % 3), top: '#5FAE68', s1: '#4E9858', s2: '#3F8A4E' });
        }
        person(g3, CX + 14, CY + 10, MM, '#1E1B18');
        // the city: tall towers on every other lot
        seed = 3;
        for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
          const pal = PAL[Math.floor(rnd() * PAL.length)];
          if (i === PI && j === PJ) continue;
          const ring = Math.max(Math.abs(i - PI), Math.abs(j - PJ));
          const h = Math.round((20 + rnd() * 38 + (ring === 1 ? 10 : 0)) * MM);
          box(g, { x: i * LOT + 60, y: j * LOT + 60, w: LOT - 120, d: LOT - 120, h: h, top: pal[0], s1: pal[1], s2: pal[2], win: true });
        }
        // the bed outline (180 × 200 cm) and the labels, hidden until "krevat dopio"
        const bw = 1.8 * MM, bd = 2.0 * MM;
        const bedL = layer(g2, 3.2);
        const bed = div(bedL, 'left:' + (CX - bw / 2) + 'px;top:' + (CY - bd / 2) + 'px;width:' + bw + 'px;height:' + bd + 'px;border:2.5px dashed #1E1B18;background:rgba(255,255,255,.28);', 'bx');
        const pil = div(bed, 'left:6px;top:5px;width:' + (bw - 12) + 'px;height:13px;border:1.5px solid #1E1B18;border-radius:4px;background:rgba(255,255,255,.6);');
        tl.set(bed, { opacity: 0 }, 0);
        const lab1 = label(g2, CX - 52, CY + 46, 70, '<div style="background:#7BC67E;color:#0f2a17;font-family:BG,sans-serif;font-weight:800;font-size:15px;padding:3px 8px;border-radius:3px;">3.4 m² gjelbërim</div>');
        const lab2 = label(g2, CX + 60, CY - 40, 74, '<div style="background:#fff;color:#1E1B18;font-family:BG,sans-serif;font-weight:800;font-size:15px;padding:3px 8px;border-radius:3px;box-shadow:0 2px 6px rgba(0,0,0,.2);">krevat dopio · 180×200 = 3.6 m²</div>');
        tl.set([lab1, lab2], { scale: 0.001 }, 0);

        // ---- camera ----
        tl.fromTo('#camh', { scale: 7.5 }, { scale: 8.2, duration: 0.9, ease: 'none', immediateRender: true }, 0);
        tl.to('#camh', { scale: 0.3, duration: 2.9, ease: 'power2.inOut' }, 0.9);
        tl.fromTo('#wh', { rotation: -45 }, { rotation: -36, duration: 3.8, ease: 'power1.inOut', immediateRender: false }, 0);
        tl.to('#camh', { scale: 3.2, duration: 0.75, ease: 'power3.inOut' }, 3.75);
        tl.to('#wh', { rotation: -45, duration: 0.75, ease: 'power3.inOut' }, 3.75);
        tl.fromTo(bed, { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out', immediateRender: false }, 4.3);
        tl.fromTo(lab1, { scale: 0.001 }, { scale: 1, duration: 0.35, ease: 'back.out(1.6)', immediateRender: false }, 4.55);
        tl.fromTo(lab2, { scale: 0.001 }, { scale: 1, duration: 0.35, ease: 'back.out(1.6)', immediateRender: false }, 4.75);
        tl.to('#camh', { scale: 3.4, duration: 1.0, ease: 'none' }, 4.5);

        // ---- words, in step with the voice ----
        const upT = function (s, t) { tl.fromTo(s, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', immediateRender: false }, t); };
        upT('#h0', 0.0); upT('#h1', 0.45); upT('#h2', 2.68); upT('#h3', 4.09);
        tl.fromTo('#h3hl', { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power2.out', immediateRender: false }, 4.4);
        tl.fromTo('#h0', { opacity: 1 }, { opacity: 1, duration: 0.01, immediateRender: true }, 0);
