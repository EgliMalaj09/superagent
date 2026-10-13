import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import world from "world-atlas/countries-50m.json";

/**
 * ROUTE MAP — "Dopo il rientro…": Tirana → Firenze (or Lugano via `dest`).
 * Natural Earth countries (world-atlas, 50m). Camera opens on Tirana, a gold
 * route draws to Firenze with a plane gliding along it, pins pop, then the
 * camera pulls back to show both cities connected (continuity of care).
 */

const W = 1080;
const H = 1920;
const SANS = "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif";
const GOLD = "#E2C17A";
const SEA = "#0E1A2B";
const LAND = "#1C2A3F";
const HOME = "#2A3D58"; // Italy + Albania
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.45, 0, 0.25, 1);

const TIRANA: [number, number] = [19.8187, 41.3275];
const FIRENZE: [number, number] = [11.2558, 43.7696];
const LUGANO: [number, number] = [8.9511, 46.0037];
const TORINO: [number, number] = [7.6869, 45.0703];

const topo = world as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
const countries = feature(topo, topo.objects.countries).features;

// Fit the Adriatic region (Italy + Balkans) into the vertical frame.
const projection = geoMercator().fitExtent(
  [[-40, 420], [W + 40, H - 420]],
  { type: "MultiPoint", coordinates: [[8.8, 38.2], [21.5, 38.2], [21.5, 46.2], [8.8, 46.2]] } as GeoJSON.MultiPoint,
);
const path = geoPath(projection);
const PATHS = countries.map((c) => ({ d: path(c) ?? "", name: c.properties?.name ?? "" }));

const route = (dest: [number, number], origin: [number, number] = TIRANA) => {
  const A = projection(origin)!;
  const B = projection(dest)!;
  // Curved flight arc: control point lifted above the midpoint.
  const C: [number, number] = [(A[0] + B[0]) / 2 + 30, Math.min(A[1], B[1]) - 120];
  const bez = (t: number): [number, number] => [
    (1 - t) ** 2 * A[0] + 2 * (1 - t) * t * C[0] + t * t * B[0],
    (1 - t) ** 2 * A[1] + 2 * (1 - t) * t * C[1] + t * t * B[1],
  ];
  const ARC = `M ${A[0]} ${A[1]} Q ${C[0]} ${C[1]} ${B[0]} ${B[1]}`;
  let ARC_LEN = 0;
  let p = bez(0);
  for (let i = 1; i <= 200; i++) {
    const q = bez(i / 200);
    ARC_LEN += Math.hypot(q[0] - p[0], q[1] - p[1]);
    p = q;
  }
  return { A, B, bez, ARC, ARC_LEN };
};
const DEST = {
  firenze: { coords: FIRENZE, label: "Firenze", side: "left" as const, home: ["Italy", "Albania"] },
  // Lugano sits at the top-left edge of the frame: label above the pin (clear of the route), Switzerland lit like Italy
  // Torino is just west of the framed area: same treatment as Lugano (label above the pin)
  luganoToTirana: { coords: TIRANA, label: "Tirana", side: "left" as const, home: ["Italy", "Albania", "Switzerland"], from: "Lugano", fromSide: "above" as const },
  torino: { coords: TORINO, label: "Torino", side: "above" as const, home: ["Italy", "Albania"] },
  lugano: { coords: LUGANO, label: "Lugano", side: "above" as const, home: ["Italy", "Albania", "Switzerland"] },
};
export type RouteDest = keyof typeof DEST;
// reverse trip for the Lugano campaign: Lugano → Tirana (pin labels swap accordingly)
const ROUTES = { firenze: route(FIRENZE), lugano: route(LUGANO), torino: route(TORINO), luganoToTirana: route(TIRANA, LUGANO) };

// Timeline (frames @30fps)
// Synced to the trimmed voiceover: Tirana pin on "Dopo il rientro", flight on
// "i nostri riferimenti", landing on "Firenze" (3.46 s), pull-back after,
// check-up badge on "controlli" (6.08 s).
const T_PIN_A = 8;
const T_FLY = [44, 104] as const;
const T_PIN_B = 102;
const END = 150;
const T_CHECK = 182;

const Pin: React.FC<{ x: number; y: number; label: string; appear: number; side: "left" | "right" | "above" }> = ({ x, y, label, appear, side }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - appear, fps, config: { damping: 11, stiffness: 160 } });
  const ring = interpolate(f - appear, [0, 28], [0, 1], clamp);
  const lab = interpolate(f - appear - 4, [0, 10], [0, 1], clamp);
  return (
    <g>
      <circle cx={x} cy={y} r={14 + 46 * ring} fill="none" stroke={GOLD} strokeWidth={4} opacity={(1 - ring) * 0.8} />
      <circle cx={x} cy={y} r={15 * s} fill={GOLD} />
      <circle cx={x} cy={y} r={6 * s} fill={SEA} />
      <text
        x={side === "above" ? x : x + (side === "right" ? 34 : -34)}
        y={side === "above" ? y - 34 : y + 14}
        textAnchor={side === "above" ? "middle" : side === "right" ? "start" : "end"}
        fontFamily={SANS}
        fontWeight={700}
        fontSize={46}
        fill="#fff"
        opacity={lab}
        style={{ paintOrder: "stroke", stroke: SEA, strokeWidth: 10 }}
      >
        {label}
      </text>
    </g>
  );
};

/** Small "follow-up check" badge that pops beside the Firenze pin. */
const Check: React.FC<{ x: number; y: number; appear: number }> = ({ x, y, appear }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - appear, fps, config: { damping: 12, stiffness: 170 } });
  if (f < appear) return null;
  const cx = x + 10;
  const cy = y - 110;
  const draw = interpolate(f - appear, [4, 14], [1, 0], clamp);
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <circle r={44} fill={GOLD} />
      <path d="M -18 0 L -5 14 L 20 -14" fill="none" stroke={SEA} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={60} strokeDashoffset={60 * draw} />
    </g>
  );
};

export const RouteMap: React.FC<{ dest?: RouteDest }> = ({ dest = "firenze" }) => {
  const f = useCurrentFrame();
  const { A, B, bez, ARC, ARC_LEN } = ROUTES[dest];
  const D = DEST[dest];

  const fly = interpolate(f, [T_FLY[0], T_FLY[1]], [0, 1], { ...clamp, easing: ease });
  const [px, py] = bez(fly);
  const [qx, qy] = bez(Math.min(1, fly + 0.01));
  const angle = (Math.atan2(qy - py, qx - px) * 180) / Math.PI;

  // Camera: open close on Tirana, follow the plane, pull back to show both.
  const mid: [number, number] = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2 - 60];
  const followX = interpolate(f, [0, T_FLY[0], T_FLY[1], END], [A[0], A[0], B[0], mid[0]], { ...clamp, easing: ease });
  const followY = interpolate(f, [0, T_FLY[0], T_FLY[1], END], [A[1], A[1], B[1], mid[1]], { ...clamp, easing: ease });
  const zoom = interpolate(f, [0, 20, T_FLY[1], END], [2.1, 1.8, 1.6, 0.86], { ...clamp, easing: ease }) * interpolate(f, [END, 240], [1, 1.04], clamp);
  const fade = interpolate(f, [0, 10], [0, 1], clamp);
  const tx = W / 2 - followX * zoom;
  const ty = H / 2 - followY * zoom;

  return (
    <AbsoluteFill style={{ backgroundColor: SEA }}>
      <svg width={W} height={H} style={{ opacity: fade }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="vig" cx="50%" cy="45%" r="75%">
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
        </defs>
        <g transform={`translate(${tx} ${ty}) scale(${zoom})`}>
          {PATHS.map((p, i) => (
            <path
              key={i}
              d={p.d}
              fill={D.home.includes(p.name) ? HOME : LAND}
              stroke={D.home.includes(p.name) ? "rgba(226,193,122,0.55)" : "rgba(255,255,255,0.10)"}
              strokeWidth={1.4 / zoom}
            />
          ))}
          {/* faint full route, then the drawn gold route on top */}
          <path d={ARC} fill="none" stroke="rgba(226,193,122,0.18)" strokeWidth={4 / zoom * 1.6} strokeDasharray={`${10 / zoom} ${10 / zoom}`} />
          <path
            d={ARC}
            fill="none"
            stroke={GOLD}
            strokeWidth={6 / zoom * 1.5}
            strokeLinecap="round"
            strokeDasharray={ARC_LEN}
            strokeDashoffset={ARC_LEN * (1 - fly)}
            filter="url(#glow)"
          />
        </g>
        {/* pins + plane drawn in screen space so they keep a constant size */}
        <Pin x={tx + A[0] * zoom} y={ty + A[1] * zoom} label={"from" in D ? D.from : "Tirana"} appear={T_PIN_A} side={"fromSide" in D ? D.fromSide : "right"} />
        <Pin x={tx + B[0] * zoom} y={ty + B[1] * zoom} label={D.label} appear={T_PIN_B} side={D.side} />
        {f >= T_FLY[0] && fly < 0.995 && (
          <g transform={`translate(${tx + px * zoom} ${ty + py * zoom}) rotate(${angle + 90})`}>
            <path
              d="M0,-30 L6,-10 L28,4 L28,10 L6,4 L4,18 L12,25 L12,30 L0,26 L-12,30 L-12,25 L-4,18 L-6,4 L-28,10 L-28,4 L-6,-10 Z"
              fill="#fff"
              filter="url(#glow)"
            />
          </g>
        )}
        <Check x={tx + B[0] * zoom} y={ty + B[1] * zoom} appear={T_CHECK} />
        <rect width={W} height={H} fill="url(#vig)" />
      </svg>
    </AbsoluteFill>
  );
};
