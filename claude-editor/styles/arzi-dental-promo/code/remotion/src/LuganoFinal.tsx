import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";

/**
 * LUGANO–TIRANA — captions + on-screen animations (38.36 s, 1151 f), built from
 * the Creative 02 overlay components. Original header follows:
 * CREATIVE 02 — final overlay (54.5 s, 1635 f). Video 1 caption style
 * (Poppins 800, 132 px, word pops, yellow caps keywords) plus the approved
 * on-screen animations, each synced to the voiceover word timings.
 * Rendered transparent and composited over build/c2final/base.mp4.
 */

const FONT = "'Poppins', -apple-system, sans-serif";
const YELLOW = "#FFE14D";
const GOLD = "#E2C17A";
const INK = "#0c1626";
const NAVY = "rgba(12,22,38,0.84)";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.45, 0, 0.25, 1);
const at = (s: number) => Math.round(s * 30);
const pop = (f: number, s: number, cfg = { damping: 13, stiffness: 210, mass: 0.6 }) =>
  f < at(s) ? 0 : spring({ frame: f - at(s), fps: 30, config: cfg });
/** 0→1 fade-out over 8 frames starting at `s`. */
const out = (f: number, s: number) => interpolate(f, [at(s), at(s) + 8], [0, 1], { ...clamp, easing: ease });
const SHADOW = "0 12px 28px rgba(0,0,0,0.42)";

/* ------------------------------- captions -------------------------------- */

type W = [string, number, boolean?];
const CHUNKS: W[][] = [
  [["Da", 1.34], ["quanto", 1.58], ["tempo", 1.9]],
  [["rimandi", 2.3, true]],
  [["il", 2.84], ["sorriso", 3.1, true]],
  [["che", 3.5], ["desideri?", 3.74]],
  [["Con", 5.02], ["Dental", 5.24, true], ["Med", 5.58, true]],
  [["Austria", 5.84, true]],
  [["a", 6.12], ["Tirana,", 6.4, true]],
  [["scopri", 6.88]],
  [["impianti", 7.52, true], ["dentali", 8.1, true]],
  [["e", 8.56], ["faccette", 8.82, true], ["E.max", 9.36, true]],
  [["a", 9.96], ["prezzi", 10.32, true]],
  [["competitivi.", 10.8, true]],
  [["Ti", 12.04], ["offriamo", 12.2]],
  [["consulenza", 12.68, true]],
  [["a", 13.34], ["Lugano,", 13.54, true]],
  [["viaggio", 14.54, true], ["organizzato", 14.78, true]],
  [["e", 15.66], ["assistenza", 15.96, true]],
  [["completa,", 16.64, true]],
  [["dall'aeroporto", 17.84]],
  [["alla", 18.8], ["clinica.", 19.02]],
  [["Grazie", 20.22], ["al", 20.5], ["nostro", 20.7]],
  [["laboratorio", 21.26, true], ["interno,", 22.0, true]],
  [["realizziamo", 22.96]],
  [["trattamenti", 23.76], ["su", 24.42, true], ["misura.", 24.6, true]],
  [["E", 25.14], ["dopo", 25.82], ["il", 26.0], ["trattamento", 26.18]],
  [["continueremo", 26.96]],
  [["a", 27.72], ["seguirti", 27.96]],
  [["anche", 28.48], ["a", 28.8], ["Lugano.", 28.9, true]],
  [["Non", 29.98], ["rimandare", 30.3, true]],
  [["il", 30.96], ["tuo", 31.14], ["sorriso!", 31.32, true]],
  [["Compila", 32.5], ["il", 32.8], ["modulo", 33.08, true]],
  [["e", 33.48], ["richiedi", 33.76]],
  [["la", 34.26], ["tua", 34.42], ["consulenza", 34.62, true]],
  [["personalizzata.", 35.58, true]],
];

let ctx: CanvasRenderingContext2D | null = null;
const fitSize = (words: W[], size: number, max: number) => {
  ctx = ctx ?? document.createElement("canvas").getContext("2d");
  if (!ctx) return size;
  ctx.font = `800 ${size}px Poppins`;
  const widest = Math.max(...words.map(([w, , hi]) => ctx!.measureText(hi ? w.toUpperCase() : w).width + 28));
  return widest > max ? Math.floor((size * max) / widest) : size;
};

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const idx = CHUNKS.findIndex((c, i) => {
    const next = CHUNKS[i + 1]?.[0][1] ?? 99;
    return t >= c[0][1] && t < Math.min(next, c[c.length - 1][1] + 0.9, 36.6);
  });
  if (idx < 0) return null;
  const chunk = CHUNKS[idx];
  return (
    <div
      style={{
        position: "absolute",
        left: 30,
        right: 30,
        top: 1120,
        textAlign: "center",
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: fitSize(chunk, 132, 1000),
        lineHeight: 1.08,
        letterSpacing: "-0.01em",
      }}
    >
      {chunk.map(([w, s, hi], i) => {
        if (t < s) return null;
        const instant = s === 0;
        const p = instant ? 1 : spring({ frame: f - at(s), fps: 30, config: { damping: 14, stiffness: 260, mass: 0.6 } });
        const o = instant ? 1 : interpolate(f - s * 30, [0, 3], [0, 1], clamp);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              margin: "0 14px",
              color: hi ? YELLOW : "#ffffff",
              textTransform: hi ? "uppercase" : "none",
              opacity: o,
              transform: `scale(${0.85 + 0.15 * p})`,
              textShadow: "0 4px 14px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/* ------------------------------ shared bits ------------------------------ */

const Pill: React.FC<{
  x: number; y: number; w: number; h?: number; s: number; hide: number; icon?: string; gold?: boolean; size?: number;
  children: React.ReactNode;
}> = ({ x, y, w, h = 92, s, hide, icon, gold, size = 46, children }) => {
  const f = useCurrentFrame();
  if (f < at(s) || f > at(hide) + 8) return null;
  const p = pop(f, s);
  const o = out(f, hide);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: h / 2,
        background: gold ? YELLOW : NAVY,
        border: gold ? "none" : `3px solid ${GOLD}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        color: gold ? INK : "#fff",
        boxShadow: SHADOW,
        opacity: Math.min(1, p * 1.5) * (1 - o),
        transform: `translateY(${(1 - p) * 50 + o * 40}px) scale(${0.7 + 0.3 * p})`,
      }}
    >
      {icon && (
        <div
          style={{
            width: h - 38, height: h - 38, borderRadius: (h - 38) / 2,
            background: gold ? INK : GOLD, color: gold ? YELLOW : INK,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.8,
          }}
        >
          {icon}
        </div>
      )}
      {children}
    </div>
  );
};

/* --------------------------------- hook ---------------------------------- */

/** Calendar beside the doctor: pages flip giorni → mesi → anni, "ANNI" lands yellow on "rimandi". */
const Calendar: React.FC = () => {
  const f = useCurrentFrame();
  const S = 0.15, HIDE = 4.1;
  if (f > at(HIDE) + 8) return null;
  const p = pop(f, S, { damping: 11, stiffness: 170, mass: 0.7 });
  const o = out(f, HIDE);
  const pages = [
    { t: 0.0, n: "7", u: "GIORNI" },
    { t: 0.58, n: "6", u: "MESI" },
    { t: 1.32, n: "2", u: "ANNI" },
  ];
  const cur = pages.filter((pg) => f >= at(pg.t)).length - 1;
  const pg = pages[cur];
  const flip = interpolate(f - at(pg.t), [0, 6], [-90, 0], { ...clamp, easing: ease });
  const last = cur === pages.length - 1;
  const bob = Math.sin(f / 20) * 4;
  return (
    <div
      style={{
        position: "absolute", left: 770, top: 230 + bob, width: 260, height: 300,
        transform: `scale(${p * (1 - o * 0.3)}) rotate(4deg)`, opacity: 1 - o,
        borderRadius: 26, background: "#fff", boxShadow: SHADOW, overflow: "hidden", fontFamily: FONT, perspective: 800,
      }}
    >
      <div style={{ height: 70, background: last ? YELLOW : INK, display: "flex", alignItems: "center", justifyContent: "center", gap: 46 }}>
        {[0, 1].map((k) => (
          <div key={k} style={{ width: 16, height: 36, borderRadius: 8, background: last ? INK : GOLD, marginTop: -40 }} />
        ))}
      </div>
      <div
        style={{
          height: 230, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          transform: `rotateX(${flip}deg)`, transformOrigin: "top",
        }}
      >
        <div style={{ fontSize: 120, fontWeight: 800, color: INK, lineHeight: 1 }}>{pg.n}</div>
        <div style={{ fontSize: 40, fontWeight: 800, color: last ? "#C99A00" : "#5a6577", letterSpacing: "0.08em" }}>{pg.u}</div>
      </div>
    </div>
  );
};

/* -------------------------------- 2a / 2b -------------------------------- */

const Problems: React.FC = () => (
  <>
    <Pill x={150} y={1520} w={780} s={4.96} hide={9.3} icon="!">Dente mancante</Pill>
    <Pill x={150} y={1634} w={780} s={6.8} hide={9.3} icon="!">Protesi instabile</Pill>
  </>
);

const ICON = { stroke: INK, strokeWidth: 7, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;
const Fork = () => (
  <svg width="86" height="86" viewBox="0 0 100 100"><path {...ICON} d="M32 14v28c0 8 6 12 12 12v34M44 14v24M56 14v28c0 8-6 12-12 12M72 14c-8 6-10 22-10 34h10v40" /></svg>
);
const Talk = () => (
  <svg width="86" height="86" viewBox="0 0 100 100"><path {...ICON} d="M18 26h64a6 6 0 0 1 6 6v32a6 6 0 0 1-6 6H44l-16 14V70H18a6 6 0 0 1-6-6V32a6 6 0 0 1 6-6zM32 48h4M50 48h4M68 48h4" /></svg>
);
const Smile = () => (
  <svg width="86" height="86" viewBox="0 0 100 100"><circle {...ICON} cx="50" cy="50" r="36" /><path {...ICON} d="M34 58c8 10 24 10 32 0M38 40v2M62 40v2" /></svg>
);

const Gestures: React.FC = () => {
  const f = useCurrentFrame();
  const HIDE = 14.7;
  if (f < at(11.16) || f > at(HIDE) + 8) return null;
  const o = out(f, HIDE);
  const items = [
    { s: 11.16, el: <Fork />, x: 160 },
    { s: 12.1, el: <Talk />, x: 420 },
    { s: 13.18, el: <Smile />, x: 680 },
  ];
  return (
    <>
      {items.map((it, i) => {
        if (f < at(it.s)) return null;
        const p = pop(f, it.s, { damping: 10, stiffness: 200, mass: 0.6 });
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: it.x, top: 1470, width: 240, height: 240, borderRadius: 120,
              background: GOLD, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: SHADOW, border: "6px solid #fff",
              transform: `scale(${p * (1 - o * 0.4)})`, opacity: 1 - o,
            }}
          >
            <div style={{ transform: "scale(1.7)" }}>{it.el}</div>
          </div>
        );
      })}
    </>
  );
};

/* -------------------------------- 3a / 3b -------------------------------- */

/** The questions stack up through 3a/3b, then dissolve as 4a answers them. */
const Questions: React.FC = () => {
  const f = useCurrentFrame();
  const HIDE = 22.85;
  const items = [
    { t: "Quale trattamento serve?", s: 17.6, gold: false },
    { t: "Quanto durerà?", s: 19.88, gold: false },
    { t: "A chi posso affidarmi?", s: 21.3, gold: true },
  ];
  const big = pop(f, 16.4, { damping: 8, stiffness: 190, mass: 0.6 });
  const bigOut = out(f, 17.5);
  return (
    <>
      {f >= at(16.4) && f < at(17.5) + 8 && (
        <div
          style={{
            position: "absolute", left: 800, top: 1380, fontFamily: FONT, fontWeight: 800, fontSize: 260, lineHeight: 1,
            color: YELLOW, textShadow: "0 8px 22px rgba(0,0,0,0.55)",
            transform: `scale(${big}) rotate(${12 + Math.sin(f / 4) * 6}deg)`, opacity: 1 - bigOut,
          }}
        >
          ?
        </div>
      )}
      {items.map((it, i) => (
        <Pill key={i} x={110} y={1530 + i * 108} w={860} s={it.s} hide={HIDE} icon="?" gold={it.gold} size={44}>
          {it.t}
        </Pill>
      ))}
    </>
  );
};

/* ----------------------------------- 4a ---------------------------------- */

const Pin: React.FC<{ S: number; HIDE: number; label: string; left?: number }> = ({ S, HIDE, label, left = 70 }) => {
  const f = useCurrentFrame();
  if (f < at(S) || f > at(HIDE) + 8) return null;
  const o = out(f, HIDE);
  const drop = f < at(S) ? 0 : spring({ frame: f - at(S), fps: 30, config: { damping: 9, stiffness: 160, mass: 0.7 } });
  const lab = pop(f, S + 0.15);
  const ring = f < at(S) ? 0 : ((f - at(S)) % 30) / 30;
  return (
    <div style={{ position: "absolute", left, top: 150, width: 620, height: 380, opacity: 1 - o, transform: `translateY(${-o * 30}px)` }}>
      {/* ground pulse */}
      {f >= at(S) && (
        <div
          style={{
            position: "absolute", left: 310 - 60 * (1 + ring), top: 222 - 18 * (1 + ring), width: 120 * (1 + ring), height: 36 * (1 + ring),
            borderRadius: "50%", border: `4px solid ${GOLD}`, opacity: 1 - ring,
          }}
        />
      )}
      {f >= at(S) && (
        <svg
          width="140" height="190" viewBox="0 0 100 136"
          style={{ position: "absolute", left: 240, top: 40, transform: `translateY(${(1 - drop) * -260}px)`, filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.45))" }}
        >
          <path d="M50 4C26 4 8 22 8 46c0 32 42 82 42 82s42-50 42-82C92 22 74 4 50 4z" fill={YELLOW} stroke="#fff" strokeWidth="5" />
          <circle cx="50" cy="46" r="16" fill={INK} />
        </svg>
      )}
      <div
        style={{
          position: "absolute", left: 0, top: 270, width: 620, height: 92, borderRadius: 46, whiteSpace: "nowrap", background: NAVY, border: `3px solid ${GOLD}`,
          display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#fff",
          letterSpacing: "0.04em", boxShadow: SHADOW, opacity: lab, transform: `scale(${0.7 + 0.3 * lab})`,
        }}
      >
        {label}
      </div>
    </div>
  );
};

/* ----------------------------------- 4b ---------------------------------- */

const Tooth: React.FC<{ fill: string; stroke: string }> = ({ fill, stroke }) => (
  <svg width="120" height="140" viewBox="0 0 100 116">
    <path d="M50 14c-8-8-34-10-38 12-3 16 4 26 8 40 3 12 2 38 12 38 9 0 8-24 18-24s9 24 18 24c10 0 9-26 12-38 4-14 11-24 8-40C84 4 58 6 50 14z" fill={fill} stroke={stroke} strokeWidth="5" strokeLinejoin="round" />
  </svg>
);

const Teeth: React.FC = () => {
  const f = useCurrentFrame();
  const S = 23.76, PICK = 24.6, HIDE = 25.6;
  if (f < at(S) || f > at(HIDE) + 8) return null;
  const o = out(f, HIDE);
  const picked = pop(f, PICK, { damping: 9, stiffness: 200, mass: 0.6 });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1500, opacity: 1 - o }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 26 }}>
        {[0, 1, 2, 3, 4].map((k) => {
          const p = pop(f, S + k * 0.1);
          const me = k === 2;
          return (
            <div key={k} style={{ transform: `scale(${p * (me ? 1 + 0.25 * picked : 1 - 0.1 * picked)})`, opacity: me ? 1 : 1 - 0.45 * picked }}>
              <Tooth fill={me && picked > 0.05 ? YELLOW : "rgba(255,255,255,0.92)"} stroke={me && picked > 0.05 ? "#fff" : "#9aa7ba"} />
            </div>
          );
        })}
      </div>
      {f >= at(PICK) && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <div
            style={{
              padding: "14px 40px", borderRadius: 40, background: YELLOW, color: INK, fontFamily: FONT, fontWeight: 800, fontSize: 44,
              boxShadow: SHADOW, transform: `scale(${picked})`,
            }}
          >
            SU MISURA
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------------------- 5a / 5b -------------------------------- */

/** Valutazione → Piano → Laboratorio step line across the top, ending as the lab badge. */
const Steps: React.FC = () => {
  const f = useCurrentFrame();
  const S = 30.62, BADGE = 39.82, HIDE = 40.9;
  if (f < at(S) || f > at(HIDE) + 8) return null;
  const o = out(f, HIDE);
  const steps = [
    { t: "Valutazione", on: 31.2 },
    { t: "Piano", on: 34.32 },
    { t: "Laboratorio", on: 37.78 },
  ];
  const into = pop(f, S);
  const toBadge = interpolate(f, [at(BADGE), at(BADGE) + 9], [0, 1], { ...clamp, easing: ease });
  const draw = (k: number) => interpolate(f, [at(steps[k + 1].on) - 10, at(steps[k + 1].on)], [0, 1], clamp);
  const X = [185, 540, 895];
  return (
    <div style={{ position: "absolute", left: 0, top: 140, width: 1080, height: 320, opacity: 1 - o }}>
      <div style={{ opacity: 1 - toBadge, transform: `translateY(${(1 - into) * -40}px)`, position: "absolute", inset: 0 }}>
        {[0, 1].map((k) => (
          <div key={k} style={{ position: "absolute", left: X[k] + 60, top: 58, width: X[k + 1] - X[k] - 120, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.45)" }}>
            <div style={{ width: `${draw(k) * 100}%`, height: "100%", borderRadius: 4, background: GOLD }} />
          </div>
        ))}
        {steps.map((st, k) => {
          const lit = pop(f, st.on, { damping: 10, stiffness: 200, mass: 0.6 });
          const on = f >= at(st.on);
          return (
            <div key={k} style={{ position: "absolute", left: X[k] - 150, top: 0, width: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 124, height: 124, borderRadius: 62, background: on ? YELLOW : NAVY, border: `5px solid ${on ? "#fff" : GOLD}`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58,
                  color: on ? INK : "#fff", boxShadow: SHADOW, transform: `scale(${(0.6 + 0.4 * into) * (1 + 0.15 * lit * (1 - lit) * 4 * 0.25)})`,
                }}
              >
                {on ? "✓" : k + 1}
              </div>
              <div
                style={{
                  padding: "8px 22px", borderRadius: 30, background: NAVY, fontFamily: FONT, fontWeight: 800, fontSize: 36,
                  color: on ? YELLOW : "#fff", boxShadow: SHADOW,
                }}
              >
                {st.t}
              </div>
            </div>
          );
        })}
      </div>
      {f >= at(BADGE) && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "flex", alignItems: "center", gap: 20, padding: "22px 46px", borderRadius: 60, background: YELLOW,
              fontFamily: FONT, fontWeight: 800, fontSize: 54, color: INK, boxShadow: SHADOW, transform: `scale(${pop(f, BADGE)})`,
            }}
          >
            <span style={{ width: 70, height: 70, borderRadius: 35, background: INK, color: YELLOW, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>✓</span>
            LABORATORIO INTERNO
          </div>
        </div>
      )}
    </div>
  );
};

/** Thin gold scan line sweeping the lab shot once. */
const Scan: React.FC = () => {
  const f = useCurrentFrame();
  const A = 35.4, B = 36.9;
  if (f < at(A) || f > at(B)) return null;
  const y = interpolate(f, [at(A), at(B)], [420, 1380], { ...clamp, easing: ease });
  const o = interpolate(f, [at(A), at(A) + 5, at(B) - 6, at(B)], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, height: 6, opacity: o, background: GOLD, boxShadow: `0 0 26px 8px ${GOLD}` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: -120, height: 120, background: `linear-gradient(to bottom, transparent, rgba(226,193,122,0.22))` }} />
    </div>
  );
};

/* ----------------------------------- 7 ----------------------------------- */

const Form: React.FC = () => {
  const f = useCurrentFrame();
  const S = 32.5, HIDE = 36.45;
  if (f < at(S) || f > at(HIDE) + 8) return null;
  const p = pop(f, S);
  const o = out(f, HIDE);
  const rows = [
    { t: "Nome", s: 32.95 },
    { t: "Telefono", s: 33.55 },
    { t: "Il tuo caso", s: 34.2 },
  ];
  return (
    <div
      style={{
        position: "absolute", left: 190, top: 150, width: 700, padding: "34px 40px", borderRadius: 34, background: "rgba(255,255,255,0.96)",
        boxShadow: SHADOW, fontFamily: FONT, display: "flex", flexDirection: "column", gap: 18,
        opacity: Math.min(1, p * 1.5) * (1 - o), transform: `translateY(${(1 - p) * 80 - o * 40}px) scale(${0.8 + 0.2 * p})`,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 40, color: INK, letterSpacing: "0.02em" }}>Consulenza personalizzata</div>
      {rows.map((r, i) => {
        const fill = interpolate(f, [at(r.s), at(r.s) + 9], [0, 1], { ...clamp, easing: ease });
        const ok = pop(f, r.s + 0.3, { damping: 10, stiffness: 220, mass: 0.5 });
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, height: 74, borderRadius: 18, background: "#eef1f5", padding: "0 22px" }}>
            <div style={{ flex: 1, position: "relative", height: 74, display: "flex", alignItems: "center" }}>
              <span style={{ fontWeight: 800, fontSize: 34, color: "#8a95a6" }}>{r.t}</span>
              <div style={{ position: "absolute", left: 0, bottom: 14, height: 5, width: `${fill * 100}%`, borderRadius: 3, background: GOLD }} />
            </div>
            <div
              style={{
                width: 52, height: 52, borderRadius: 26, background: YELLOW, color: INK, fontWeight: 800, fontSize: 32,
                display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${ok})`,
              }}
            >
              ✓
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------------------------------- end ---------------------------------- */

/** End card: only the clinic logo, centred, fading in with the base edit's dissolve to black. */
const EndLogo: React.FC = () => {
  const f = useCurrentFrame();
  const S = 1531; // matches the base edit's dissolve into the end card
  if (f < S) return null;
  const o = interpolate(f, [S, S + 10], [0, 1], clamp);
  const settle = interpolate(f, [S, S + 40], [1.05, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: o, alignItems: "center", justifyContent: "center" }}>
      <Img src={staticFile("rec/dma_logo_alpha.png")} style={{ width: 760, transform: `scale(${settle})` }} />
    </AbsoluteFill>
  );
};

/* -------------------------------- assembly ------------------------------- */

export const LuganoOverlay: React.FC = () => (
  <AbsoluteFill>
    <Pin S={6.4} HIDE={7.3} label="TIRANA · ALBANIA" />
    <Pill x={150} y={1520} w={780} s={7.52} hide={11.8} icon="✓">Impianti dentali</Pill>
    <Pill x={150} y={1634} w={780} s={8.82} hide={11.8} icon="✓">Faccette E.max</Pill>
    <Pill x={150} y={1748} w={780} s={10.32} hide={11.8} icon="€" gold>Prezzi competitivi</Pill>
    <Pin S={13.54} HIDE={14.3} label="CONSULENZA A LUGANO" />
    <Pill x={150} y={1520} w={780} s={16.6} hide={20.0} icon="✓">Viaggio organizzato</Pill>
    <Pill x={150} y={1634} w={780} s={17.84} hide={20.0} icon="✓" gold>Aeroporto → Clinica</Pill>
    <Pill x={140} y={170} w={800} s={21.26} hide={22.8} icon="✓" gold size={44}>LABORATORIO INTERNO</Pill>
    <Teeth />
    <Pin S={28.9} HIDE={29.8} label="CONTROLLI A LUGANO" />
    <Form />
    <Captions />
  </AbsoluteFill>
);

export const LuganoPreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo src={staticFile("rec/lugbase.mp4")} muted style={{ width: 1080, height: 1920 }} />
    <LuganoOverlay />
  </AbsoluteFill>
);
