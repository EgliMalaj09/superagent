import { AbsoluteFill, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import world from "world-atlas/countries-50m.json";
import { PopCaptionsFrom, type CapChunk } from "./PopCaptionsFrom";

/**
 * VIDEO 3 — doctor hook (10.55 s, pauses trimmed, voice untouched).
 * The doctor stays on camera, so the screen does the work:
 *   1.7  "Italia"            → ITALIA card pops top-left
 *   2.38 "chi ti segue?"     → punch-in + gold "?" around his head
 *   3.5  "domande… importanti" → checklist chips (Prezzo ✓ Clinica ✓ / Chi ti segue dopo?)
 *   6.9–9.6 "trattamento dentale in Albania" → gold route + plane to the ALBANIA card
 * Camera punches alternate on the jump cuts (2.32, 3.28) and on phrases.
 */

const W = 1080;
const FONT = "'Poppins', -apple-system, sans-serif";
const GOLD = "#E2C17A";
const YELLOW = "#FFE14D";
const NAVY = "rgba(12,22,38,0.82)";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.45, 0, 0.25, 1);

const CHUNKS: CapChunk[] = [
  [["E", 0], ["quando", 0.0], ["torni", 0.0]],
  [["in", 1.5], ["Italia,", 1.8, true]],
  [["chi", 2.38, true], ["ti", 2.56, true], ["segue?", 2.86, true]],
  [["è", 2.96], ["una", 3.5], ["delle", 3.7]],
  [["domande", 4.0], ["più", 4.5, true], ["importanti", 4.8, true]],
  [["se", 5.8], ["stai", 6.0], ["valutando", 6.3]],
  [["un", 6.9], ["trattamento", 7.1, true], ["dentale", 8.1, true]],
  [["in", 9.0], ["Albania.", 9.6, true]],
];

// ---- country silhouettes -------------------------------------------------
const topo = world as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
const countries = feature(topo, topo.objects.countries).features;
const shape = (name: string, pin: [number, number], size: number) => {
  const f = countries.find((c) => c.properties?.name === name)!;
  const proj = geoMercator().fitSize([size, size], f);
  return { d: geoPath(proj)(f) ?? "", pin: proj(pin)! };
};
const ITALY = shape("Italy", [11.2558, 43.7696], 190);
const ALBANIA = shape("Albania", [19.8187, 41.3275], 170);

// card geometry (screen space)
const CARD_W = 300;
const CARD_H = 330;
const IT = { x: 46, y: 300 };
const AL = { x: W - 46 - CARD_W, y: 300 };

const T_IT = 1.7;
const T_Q = 2.38;
const T_CHIPS = 3.5;
const T_CHIPS_OUT = 5.6;
const T_FLY = [6.9, 9.5] as const;
const T_AL = 9.45;

const at = (s: number) => Math.round(s * 30);

const CountryCard: React.FC<{
  x: number;
  y: number;
  label: string;
  geo: { d: string; pin: [number, number] };
  appear: number;
  tilt: number;
  stripe: string[];
  question?: number;
}> = ({ x, y, label, geo, appear, tilt, stripe, question }) => {
  const f = useCurrentFrame();
  if (f < at(appear)) return null;
  const s = spring({ frame: f - at(appear), fps: 30, config: { damping: 11, stiffness: 170, mass: 0.7 } });
  const bob = Math.sin((f - at(appear)) / 22) * 5;
  const ring = ((f - at(appear)) % 36) / 36;
  const qs = question !== undefined && f >= at(question)
    ? spring({ frame: f - at(question), fps: 30, config: { damping: 9, stiffness: 200 } })
    : 0;
  const ox = (CARD_W - 190) / 2;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        width: CARD_W,
        height: CARD_H,
        transform: `scale(${s}) rotate(${tilt * s}deg)`,
        transformOrigin: "50% 60%",
        background: NAVY,
        border: `3px solid ${GOLD}`,
        borderRadius: 34,
        boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
        overflow: "visible",
      }}
    >
      <svg width={CARD_W} height={240} style={{ position: "absolute", top: 18, left: 0 }}>
        <g transform={`translate(${ox} 12)`}>
          <path d={geo.d} fill="rgba(226,193,122,0.22)" stroke={GOLD} strokeWidth={3} strokeLinejoin="round" />
          <circle cx={geo.pin[0]} cy={geo.pin[1]} r={10 + 26 * ring} fill="none" stroke={YELLOW} strokeWidth={3} opacity={1 - ring} />
          <circle cx={geo.pin[0]} cy={geo.pin[1]} r={10} fill={YELLOW} />
          <circle cx={geo.pin[0]} cy={geo.pin[1]} r={4} fill="#0c1626" />
        </g>
      </svg>
      <div style={{ position: "absolute", bottom: 22, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: "#fff", letterSpacing: "0.04em" }}>{label}</div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
          {stripe.map((c, i) => (
            <div key={i} style={{ width: 34, height: 7, background: c, borderRadius: 4, margin: "0 2px" }} />
          ))}
        </div>
      </div>
      {qs > 0 && (
        <div
          style={{
            position: "absolute",
            right: -26,
            top: -30,
            width: 92,
            height: 92,
            borderRadius: 46,
            background: YELLOW,
            transform: `scale(${qs}) rotate(${(1 - qs) * -40}deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 64,
            color: "#0c1626",
            boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
          }}
        >
          ?
        </div>
      )}
    </div>
  );
};

/** Gold question marks popping around the doctor's head on "chi ti segue?". */
const Questions: React.FC = () => {
  const f = useCurrentFrame();
  const marks = [
    { x: 800, y: 700, size: 150, d: 0, rot: 12 },
    { x: 540, y: 140, size: 120, d: 5, rot: -8 },
    { x: 860, y: 920, size: 95, d: 10, rot: 18 },
  ];
  const end = at(3.4);
  if (f < at(T_Q) || f > end + 8) return null;
  const out = interpolate(f, [end, end + 8], [1, 0], clamp);
  return (
    <AbsoluteFill>
      {marks.map((m, i) => {
        const s = spring({ frame: f - at(T_Q) - m.d, fps: 30, config: { damping: 8, stiffness: 190 } });
        if (f < at(T_Q) + m.d) return null;
        const wob = Math.sin((f - at(T_Q)) / 4 + i) * 6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: m.x - m.size / 2,
              top: m.y - m.size / 2,
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: m.size,
              lineHeight: 1,
              color: YELLOW,
              opacity: out,
              transform: `scale(${s * out}) rotate(${m.rot + wob}deg)`,
              textShadow: "0 6px 18px rgba(0,0,0,0.55)",
            }}
          >
            ?
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** "Prima di partire" checklist: price ✓, clinic ✓, then the real question. */
const Chips: React.FC = () => {
  const f = useCurrentFrame();
  if (f < at(T_CHIPS) || f > at(T_CHIPS_OUT) + 10) return null;
  const out = interpolate(f, [at(T_CHIPS_OUT), at(T_CHIPS_OUT) + 10], [0, 1], { ...clamp, easing: ease });
  const items = [
    { t: "Prezzo", ok: true, s: T_CHIPS, x: 120, y: 1420, w: 390 },
    { t: "Clinica", ok: true, s: T_CHIPS + 0.3, x: 570, y: 1420, w: 390 },
    { t: "Chi ti segue dopo?", ok: false, s: 4.5, x: 120, y: 1532, w: 840 },
  ];
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `translateY(${out * 60}px)` }}>
      {items.map((it, i) => {
        if (f < at(it.s)) return null;
        const p = spring({ frame: f - at(it.s), fps: 30, config: { damping: 13, stiffness: 210, mass: 0.6 } });
        const pulse = it.ok ? 1 : 1 + 0.035 * Math.sin((f - at(it.s)) / 3.2);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: it.x,
              top: it.y,
              width: it.w,
              height: 92,
              borderRadius: 46,
              background: it.ok ? NAVY : YELLOW,
              border: it.ok ? `3px solid ${GOLD}` : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 18,
              transform: `translateY(${(1 - p) * 50}px) scale(${(0.7 + 0.3 * p) * pulse})`,
              opacity: Math.min(1, p * 1.5),
              boxShadow: "0 12px 28px rgba(0,0,0,0.4)",
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 50,
              color: it.ok ? "#fff" : "#0c1626",
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                background: it.ok ? GOLD : "#0c1626",
                color: it.ok ? "#0c1626" : YELLOW,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 38,
              }}
            >
              {it.ok ? "✓" : "?"}
            </div>
            {it.t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Gold route from the ITALIA card to the ALBANIA card with a plane on it. */
const Route: React.FC = () => {
  const f = useCurrentFrame();
  if (f < at(T_FLY[0])) return null;
  const A: [number, number] = [IT.x + CARD_W - 20, IT.y + 70];
  const B: [number, number] = [AL.x + 20, AL.y + 70];
  const C: [number, number] = [(A[0] + B[0]) / 2, 110];
  const bez = (t: number): [number, number] => [
    (1 - t) ** 2 * A[0] + 2 * (1 - t) * t * C[0] + t * t * B[0],
    (1 - t) ** 2 * A[1] + 2 * (1 - t) * t * C[1] + t * t * B[1],
  ];
  let len = 0;
  for (let i = 1, p = bez(0); i <= 100; i++) {
    const q = bez(i / 100);
    len += Math.hypot(q[0] - p[0], q[1] - p[1]);
    p = q;
  }
  const fly = interpolate(f, [at(T_FLY[0]), at(T_FLY[1])], [0, 1], { ...clamp, easing: ease });
  const [px, py] = bez(fly);
  const [qx, qy] = bez(Math.min(1, fly + 0.01));
  const ang = (Math.atan2(qy - py, qx - px) * 180) / Math.PI;
  const arc = `M ${A[0]} ${A[1]} Q ${C[0]} ${C[1]} ${B[0]} ${B[1]}`;
  return (
    <svg width={W} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id="rglow" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d={arc} fill="none" stroke="rgba(226,193,122,0.35)" strokeWidth={5} strokeDasharray="14 14" />
      <path d={arc} fill="none" stroke={GOLD} strokeWidth={9} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - fly)} filter="url(#rglow)" />
      {fly < 0.995 && (
        <g transform={`translate(${px} ${py}) rotate(${ang + 90}) scale(1.6)`}>
          <path
            d="M0,-30 L6,-10 L28,4 L28,10 L6,4 L4,18 L12,25 L12,30 L0,26 L-12,30 L-12,25 L-4,18 L-6,4 L-28,10 L-28,4 L-6,-10 Z"
            fill="#fff"
            filter="url(#rglow)"
          />
        </g>
      )}
    </svg>
  );
};

// camera: [start s, base scale] — jump cuts at 2.32 / 3.28, phrase punches at 5.8 / 8.1
const CAM: [number, number][] = [
  [0, 1.0],
  [2.32, 1.13],
  [3.28, 1.0],
  [5.8, 1.1],
  [8.1, 1.02],
];
const END = 10.55;

export const DoctorHook3: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const i = CAM.filter(([s]) => t >= s).length - 1;
  const [s0, base] = CAM[i];
  const s1 = CAM[i + 1]?.[0] ?? END;
  const scale = base + interpolate(t, [s0, s1], [0, 0.03], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "52% 32%" }}>
        <OffthreadVideo src={staticFile("rec/doc3.mp4")} muted />
      </AbsoluteFill>
      {/* soft top + bottom shade so cards and captions read on the marble/desk */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 78%, rgba(0,0,0,0.25) 100%)",
        }}
      />
      <Route />
      <CountryCard x={IT.x} y={IT.y} label="ITALIA" geo={ITALY} appear={T_IT} tilt={-4} stripe={["#1f9d55", "#ffffff", "#d52b1e"]} question={T_Q} />
      <CountryCard x={AL.x} y={AL.y} label="ALBANIA" geo={ALBANIA} appear={T_AL} tilt={4} stripe={["#e41e20", "#111111", "#e41e20"]} />
      <Questions />
      <Chips />
      <PopCaptionsFrom chunks={CHUNKS} />
    </AbsoluteFill>
  );
};
