import {
  AbsoluteFill,
  Easing,
  Freeze,
  interpolate,
  Video,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * PARAFUNDIT EDIT — 8.9s, voice untouched.
 *   0.00–1.00  desk shot (source)
 *   1.00–5.90  the tool recording, re-timed to the voice: photo on "foton",
 *              Seedance 2.5 row held on "Seedance 2.5", prompt pastes on
 *              "prompt", Generate clicked on "gjenero"
 *   5.90–6.05  "generation" dive into the lime Generate button
 *   6.05–8.90  zoom-through into the monitor: "BRRAVO ZEMËRR" appears on
 *              "Urime", then a slow push lands on the screen at "scroll-in"
 * Captions on the instructions and the payoff line; none on "Urime" (the
 * monitor already says it).
 */

const FPS = 30;
const END = 8.9;
const FONT = "-apple-system, 'SF Pro Display', 'SF Pro Text', system-ui, 'Helvetica Neue', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.45, 0, 0.2, 1);

// ---- tool recording camera (same keys as ToolZoom, in recording frames) ----
const SW = 688;
const SH = 1492;
const OW = 1080;
const OH = 1920;
const BASE = OW / SW;
const OVERSCROLL = 320;
const PANEL_BG = "#0f1112";
const KEYS: [number, number, number, number][] = [
  [0, 352, 660, 1.75],
  [12, 352, 670, 1.6],
  [26, 300, 1196, 1.35],
  [32, 300, 1196, 1.4],
  [40, 344, 1010, 1.0],
  [48, 352, 1340, 1.12],
  [51, 352, 1372, 1.38],
  [58, 352, 1372, 1.32],
  [99, 344, 760, 1.0],
];
const camAt = (f: number): [number, number, number] => {
  const i = Math.max(0, KEYS.findIndex((k, j) => f >= k[0] && f < (KEYS[j + 1]?.[0] ?? Infinity)));
  const a = KEYS[i];
  const b = KEYS[i + 1] ?? a;
  const t = b === a ? 0 : interpolate(f, [a[0], b[0]], [0, 1], { ...clamp, easing: ease });
  const s = BASE * (a[3] + (b[3] - a[3]) * t);
  const w = OW / s;
  const h = OH / s;
  const cx = a[1] + (b[1] - a[1]) * t;
  const cy = a[2] + (b[2] - a[2]) * t;
  return [
    w >= SW ? SW / 2 : Math.min(Math.max(cx, w / 2), SW - w / 2),
    Math.min(Math.max(cy, h / 2 - OVERSCROLL), SH - h / 2 + OVERSCROLL),
    s,
  ];
};

// Voice time (s) → tool recording frame. Recording beats: paste = f33, click = f50.
const TOOL_MAP: [number, number][] = [
  [1.0, 0], // "…foton" — photo just landed
  [1.6, 12],
  [2.2, 26], // "modelin" — arrive on the model row
  [3.46, 32], // hold through "Seedance 2.5"
  [4.27, 32.9],
  [4.3, 33], // prompt pastes on "prompt"
  [4.7, 40], // pull back so the lines read
  [5.2, 48], // glide to Generate during "kliko"
  [5.4, 50], // click on "gjenero"
  [5.46, 51],
  [5.9, 58],
];
const toolFrame = (t: number) =>
  interpolate(t, TOOL_MAP.map((m) => m[0]), TOOL_MAP.map((m) => m[1]), clamp);

// ---- captions ----
type W = { w: string; s: number; e: number };
const CAPTIONS: { to: number; y: number; words: W[] }[] = [
  { to: 1.84, y: 0.84, words: [{ w: "Ngarko", s: 0.74, e: 0.98 }, { w: "foton", s: 1.0, e: 1.44 }] },
  { to: 2.54, y: 0.86, words: [{ w: "zgjidh", s: 1.84, e: 2.02 }, { w: "modelin", s: 2.04, e: 2.46 }] },
  { to: 3.9, y: 0.86, words: [{ w: "Seedance", s: 2.54, e: 2.88 }, { w: "2.5", s: 2.94, e: 3.46 }] },
  { to: 4.28, y: 0.86, words: [{ w: "përdor", s: 3.9, e: 4.02 }, { w: "këtë", s: 4.04, e: 4.18 }] },
  { to: 5.14, y: 0.86, words: [{ w: "prompt", s: 4.28, e: 4.66 }] },
  { to: 5.38, y: 0.86, words: [{ w: "kliko", s: 5.14, e: 5.36 }] },
  { to: 5.92, y: 0.86, words: [{ w: "gjenero", s: 5.38, e: 5.9 }] },
  { to: 7.5, y: 0.86, words: [{ w: "sapo", s: 6.84, e: 7.04 }, { w: "krijove", s: 7.06, e: 7.5 }] },
  { to: 7.98, y: 0.86, words: [{ w: "një", s: 7.5, e: 7.64 }, { w: "hook", s: 7.74, e: 7.86 }, { w: "që", s: 7.86, e: 7.98 }] },
  { to: END, y: 0.86, words: [{ w: "ndalon", s: 7.98, e: 8.3 }, { w: "scroll-in.", s: 8.34, e: 8.62 }] },
];

const Caption: React.FC<{ t: number }> = ({ t }) => {
  const cap = CAPTIONS.find((c) => t >= c.words[0].s && t < c.to);
  if (!cap) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: `${cap.y * 100}%`,
        left: 60,
        right: 60,
        transform: "translateY(-50%)",
        textAlign: "center",
        fontFamily: FONT,
        fontWeight: 500,
        fontSize: 64,
        color: "#fff",
        textShadow: "0 2px 14px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.7)",
        whiteSpace: "pre",
      }}
    >
      {cap.words.map((wd, i) => (
        <span key={i} style={{ opacity: interpolate(t, [wd.s, wd.s + 0.08], [0, 1], clamp) }}>
          {i > 0 ? " " : ""}
          {wd.w}
        </span>
      ))}
    </div>
  );
};

// ---- source shots (desk + monitor) from the original video ----
const Src: React.FC<{ at: number }> = ({ at }) => (
  <Freeze frame={Math.round(at * FPS)}>
    <Video src={staticFile("rec/parafundit.mp4")} muted />
  </Freeze>
);

const TOOL_IN = 1.0;
const DIVE = 5.9;
const MON_IN = 6.05;
const MON_SRC_IN = 4.9; // monitor shot entry in the source (text already brightening, full on "Urime")
const MON_SRC_LAST = 5.7; // last clean monitor frame before the black

export const ParafunditEdit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  let layer: React.ReactNode;
  if (t < TOOL_IN) {
    layer = <Src at={t} />;
  } else if (t < MON_IN) {
    // tool recording, re-timed; dive into the Generate button after the click
    const f = Math.round(toolFrame(t));
    const [cx, cy, s] = camAt(f);
    const dive = interpolate(t, [DIVE, MON_IN], [1, 2.4], { ...clamp, easing: Easing.in(Easing.cubic) });
    const glow = interpolate(t, [DIVE - 0.05, MON_IN], [0, 0.95], clamp);
    layer = (
      <AbsoluteFill style={{ backgroundColor: PANEL_BG, overflow: "hidden" }}>
        <AbsoluteFill style={{ transform: `scale(${dive})`, transformOrigin: "50% 50%", filter: `brightness(${1 + glow * 0.6})` }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: SW,
              height: SH,
              transformOrigin: "0 0",
              transform: `translate(${OW / 2 - cx * s}px, ${OH / 2 - cy * s}px) scale(${s})`,
            }}
          >
            <Freeze frame={f}>
              <Video src={staticFile("rec/tool2x.mp4")} muted style={{ width: SW, height: SH }} />
            </Freeze>
          </div>
        </AbsoluteFill>
        {/* lime energy burst from the Generate button */}
        <AbsoluteFill
          style={{
            opacity: glow,
            background: "radial-gradient(circle at 50% 50%, rgba(236,255,120,1) 0%, rgba(214,242,0,0.85) 25%, rgba(214,242,0,0.25) 55%, rgba(214,242,0,0) 75%)",
            mixBlendMode: "screen",
          }}
        />
      </AbsoluteFill>
    );
  } else {
    // monitor: zoom-through settle, then a slow push that lands on the screen
    const src = Math.min(MON_SRC_LAST, MON_SRC_IN + (t - MON_IN));
    const settle = interpolate(t, [MON_IN, MON_IN + 0.3], [1.22, 1.0], { ...clamp, easing: Easing.out(Easing.cubic) });
    const push = interpolate(t, [MON_IN + 0.3, 8.62], [1.0, 1.32], { ...clamp, easing: ease });
    const flash = interpolate(t, [MON_IN, MON_IN + 0.22], [0.8, 0], clamp);
    // soft bloom on the screen as "BRRAVO ZEMËRR" lands with "Urime"
    const bloom = interpolate(t, [6.12, 6.4, 7.2], [0, 0.35, 0.12], clamp);
    layer = (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <AbsoluteFill style={{ transform: `scale(${settle * push})`, transformOrigin: "54% 49%" }}>
          <Src at={src} />
          <AbsoluteFill style={{ mixBlendMode: "screen", opacity: bloom, filter: "blur(18px) brightness(1.4)" }}>
            <Src at={src} />
          </AbsoluteFill>
        </AbsoluteFill>
        <AbsoluteFill style={{ backgroundColor: "rgb(236,255,160)", opacity: flash }} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {layer}
      {/* soft dark band behind captions over the busy tool interface */}
      <AbsoluteFill
        style={{
          opacity: interpolate(t, [TOOL_IN - 0.1, TOOL_IN, DIVE - 0.1, DIVE], [0, 1, 1, 0], clamp),
          background: "linear-gradient(to bottom, rgba(0,0,0,0) 72%, rgba(0,0,0,0.65) 82%, rgba(0,0,0,0.65) 92%, rgba(0,0,0,0) 100%)",
        }}
      />
      <Caption t={t} />
    </AbsoluteFill>
  );
};
