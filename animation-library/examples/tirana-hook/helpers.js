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
