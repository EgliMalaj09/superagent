import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame } from "remotion";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import world from "world-atlas/countries-50m.json";

/**
 * CREATIVE 03 · scene 7a "E al rientro," — full-screen navy map of the Adriatic.
 * Starts close on Tirana, pulls back while a dotted gold flight path draws to
 * Rome with a plane on it; a pin lands in Italy with "ITALIA · CONTROLLI".
 * 63 frames (32.2–34.3 s): pulls back and flies in ~1 s, pin lands at 1.2 s
 * so the label reads before "puoi". Different look from the hook's floating country cards.
 */

const FONT = "'Poppins', -apple-system, sans-serif";
const GOLD = "#E2C17A";
const YELLOW = "#FFE14D";
const INK = "#0c1626";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.45, 0, 0.25, 1);

const topo = world as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
const countries = feature(topo, topo.objects.countries).features;
const near = countries.filter((c) =>
  ["Italy", "Albania", "Greece", "Montenegro", "Croatia", "Bosnia and Herz.", "Serbia", "Macedonia", "North Macedonia", "Kosovo", "Slovenia", "Austria", "Switzerland", "France", "Tunisia", "Bulgaria", "Hungary", "San Marino", "Vatican"].includes(
    c.properties?.name ?? "",
  ),
);
const italy = countries.find((c) => c.properties?.name === "Italy")!;
const albania = countries.find((c) => c.properties?.name === "Albania")!;

const W = 1080;
const proj = geoMercator().fitExtent(
  [
    [60, 260],
    [W - 60, 1080],
  ],
  { type: "FeatureCollection", features: [italy, albania] },
);
const path = geoPath(proj);
const TIRANA = proj([19.8187, 41.3275])!;
const ROMA = proj([12.4964, 41.9028])!;
const CTRL: [number, number] = [(TIRANA[0] + ROMA[0]) / 2, Math.min(TIRANA[1], ROMA[1]) - 200];
const bez = (t: number): [number, number] => [
  (1 - t) ** 2 * TIRANA[0] + 2 * (1 - t) * t * CTRL[0] + t * t * ROMA[0],
  (1 - t) ** 2 * TIRANA[1] + 2 * (1 - t) * t * CTRL[1] + t * t * ROMA[1],
];
const ARC = `M ${TIRANA[0]} ${TIRANA[1]} Q ${CTRL[0]} ${CTRL[1]} ${ROMA[0]} ${ROMA[1]}`;
const ARC_LEN = 1100;

const FLY = [4, 36] as const;
const LAND = 36;

export const C3Map: React.FC = () => {
  const f = useCurrentFrame();
  // camera: starts close on Tirana, pulls back to the whole Adriatic
  const zoom = interpolate(f, [0, 34], [1.9, 1], { ...clamp, easing: ease });
  const fly = interpolate(f, [FLY[0], FLY[1]], [0, 1], { ...clamp, easing: ease });
  const [px, py] = bez(fly);
  const [qx, qy] = bez(Math.min(1, fly + 0.01));
  const ang = (Math.atan2(qy - py, qx - px) * 180) / Math.PI;
  const land = f < LAND ? 0 : spring({ frame: f - LAND, fps: 30, config: { damping: 9, stiffness: 170, mass: 0.6 } });
  const ring = f < LAND ? 0 : ((f - LAND) % 24) / 24;
  const tPulse = (f % 24) / 24;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 40%, #16294a 0%, ${INK} 70%)` }}>
      {/* faint lat/long grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(226,193,122,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(226,193,122,0.07) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
        }}
      />
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${TIRANA[0]}px ${TIRANA[1]}px` }}>
        <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`}>
          {near.map((c, i) => (
            <path key={i} d={path(c) ?? ""} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" strokeWidth={1.5} />
          ))}
          <path d={path(italy) ?? ""} fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.55)" strokeWidth={2} />
          <path d={path(albania) ?? ""} fill="rgba(226,193,122,0.35)" stroke={GOLD} strokeWidth={2.5} />
          {/* flight path: dotted gold, drawn behind the plane */}
          <path
            d={ARC}
            fill="none"
            stroke={GOLD}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray="2 18"
            style={{ clipPath: "none" }}
            strokeDashoffset={0}
            opacity={0.95}
            mask="url(#reveal)"
          />
          <defs>
            <mask id="reveal" maskUnits="userSpaceOnUse">
              <path d={ARC} fill="none" stroke="#fff" strokeWidth={14} strokeDasharray={`${ARC_LEN}`} strokeDashoffset={ARC_LEN * (1 - fly)} />
            </mask>
          </defs>
          {/* Tirana dot with a soft pulse */}
          <circle cx={TIRANA[0]} cy={TIRANA[1]} r={14 + 26 * tPulse} fill="none" stroke={GOLD} strokeWidth={3} opacity={1 - tPulse} />
          <circle cx={TIRANA[0]} cy={TIRANA[1]} r={12} fill={GOLD} stroke="#fff" strokeWidth={4} />
          {/* landing ring at Roma */}
          {f >= LAND && <circle cx={ROMA[0]} cy={ROMA[1]} r={16 + 40 * ring} fill="none" stroke={YELLOW} strokeWidth={4} opacity={1 - ring} />}
        </svg>
        {/* Tirana label */}
        <div
          style={{
            position: "absolute", left: TIRANA[0] + 22, top: TIRANA[1] + 6, fontFamily: FONT, fontWeight: 800, fontSize: 30,
            color: GOLD, letterSpacing: "0.08em", textShadow: "0 3px 10px rgba(0,0,0,0.6)", transform: `scale(${1 / zoom})`, transformOrigin: "left top",
          }}
        >
          TIRANA
        </div>
        {/* plane */}
        {f >= FLY[0] && f <= FLY[1] + 2 && (
          <svg
            width="70" height="70" viewBox="0 0 24 24"
            style={{ position: "absolute", left: px - 35, top: py - 35, transform: `rotate(${ang + 90}deg) scale(${1 / zoom})`, filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.5))" }}
          >
            <path fill="#fff" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
          </svg>
        )}
      </AbsoluteFill>
      {/* pin + chip at Roma, drawn outside the zoom layer (zoom has settled to 1 by then) */}
      {f >= LAND && (
        <>
          <svg
            width="96" height="130" viewBox="0 0 100 136"
            style={{ position: "absolute", left: ROMA[0] - 48, top: ROMA[1] - 126, transform: `translateY(${(1 - land) * -120}px)`, opacity: Math.min(1, land * 2), filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.5))" }}
          >
            <path d="M50 4C26 4 8 22 8 46c0 32 42 82 42 82s42-50 42-82C92 22 74 4 50 4z" fill={YELLOW} stroke="#fff" strokeWidth="5" />
            <circle cx="50" cy="46" r="16" fill={INK} />
          </svg>
          <div
            style={{
              position: "absolute", left: ROMA[0] - 300, top: ROMA[1] + 34, width: 600, display: "flex", justifyContent: "center",
              transform: `scale(${land})`,
            }}
          >
            <div
              style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 30px", borderRadius: 50, background: "rgba(12,22,38,0.9)",
                border: `3px solid ${GOLD}`, fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#fff", letterSpacing: "0.04em", whiteSpace: "nowrap",
                boxShadow: "0 12px 28px rgba(0,0,0,0.45)",
              }}
            >
              <span style={{ width: 46, height: 46, borderRadius: 23, background: YELLOW, color: INK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>✓</span>
              ITALIA · CONTROLLI
            </div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
