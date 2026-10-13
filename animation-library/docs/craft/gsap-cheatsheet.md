# GSAP 3.14 cheat-sheet (for HyperFrames)

Since 3.13 every GSAP plugin is free (SplitText, DrawSVG, MorphSVG, CustomEase, MotionPath, ScrambleText, Flip…).
The library ships `library/vendor/gsap.min.js` (core); load plugins from the jsdelivr CDN or copy them into `vendor/`.

## Seek-safe timeline (HyperFrames renders by seeking)

```js
const tl = gsap.timeline({ paused: true });            // build_page.py creates it for you
tl.fromTo('#h1', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out', immediateRender: false }, 1.2);
tl.to('#cam', { scale: 1.1, duration: 4, ease: 'none' }, 0);
tl.set('#badge', { opacity: 1 }, 3.0);
window.__timelines['<composition-id>'] = tl;           // key = data-composition-id
```
- Always give an explicit position (the last argument, seconds). Prefer `fromTo` when start and end both matter.
- Only transforms (`x y scale scaleX scaleY rotation rotationX rotationY skewX`) + `opacity` + `filter` + CSS vars.
- `immediateRender:false` for entrances that happen later; `true` for things that must be in their start state at t=0.
- No `Math.random`, `Date.now`, `setTimeout`, unbounded `repeat:-1`.

## Eases

`none` · `power1–4.in/out/inOut` (`power2` = quad, `power3` = cubic, `power4` = quart) · `expo` · `sine` · `circ` ·
`back.out(1.7)` · `elastic.out(1, 0.4)` · `bounce.out` · `steps(n)` · `CustomEase.create('x', 'M0,0 C0.2,0 0,1 1,1')`.

## Patterns

```js
// stagger
tl.fromTo('.chip', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.08, immediateRender: false }, 2);
// counter via proxy (never one tl.set per number)
const o = { v: 0 }; tl.to(o, { v: 430, duration: 1.2, ease: 'power2.out', onUpdate: () => el.textContent = Math.round(o.v) }, 3);
// mask reveal
tl.fromTo('#title', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power3.inOut' }, 1);
// gold sweep on text (.gold class, luxury kit)
tl.fromTo('.gold', { backgroundPosition: '100% 0' }, { backgroundPosition: '-100% 0', duration: 1.6, ease: 'sine.inOut' }, 2);
// SVG line draw
tl.fromTo(path, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, 4);
// 3D tilt card
tl.fromTo('#card', { rotationY: -25, transformPerspective: 1200 }, { rotationY: 0, duration: 0.8, ease: 'expo.out' }, 5);
```

## SplitText (per word / letter)

```js
const s = SplitText.create('#h1', { type: 'words,chars' });
tl.from(s.chars, { yPercent: 100, opacity: 0, duration: 0.5, ease: 'expo.out', stagger: 0.02 }, 1);
```
The library's `words(sel, t, gap)` helper does a dependency-free word reveal.
