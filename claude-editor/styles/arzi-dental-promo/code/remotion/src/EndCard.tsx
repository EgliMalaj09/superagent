import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * END CARD — "Komento HOOK për të marrë promptet" (3.6s, voice-synced).
 *   0.32  "Komento" types in as the headline; the comment bar rises
 *   0.80  "HOOK" slams in (lime, flash, shake) and types into the comment bar
 *   1.08  send pressed → your comment flies into the feed
 *   1.2+  "për të marrë promptet" lands word by word while a flood of
 *         HOOK comments scrolls up behind it
 *   2.04  a "new message" notification drops in: the prompts arriving
 * Same type as the black-screen cards (SF Pro); lime ties to the Generate button.
 */

const FONT = "-apple-system, 'SF Pro Display', 'SF Pro Text', system-ui, 'Helvetica Neue', sans-serif";
const LIME = "#DDFB2C";
const BG = "#0b0b0c";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const T_KOM: [number, number] = [0.32, 0.76];
const T_HOOK = 0.8;
const HOOK_KEYS = [0.8, 0.85, 0.9, 0.95];
const T_SEND = 1.08;
const SUB: { w: string; s: number }[] = [
  { w: "për", s: 1.2 },
  { w: "të", s: 1.34 },
  { w: "marrë", s: 1.44 },
  { w: "promptet", s: 1.68 },
];
const T_DM = 2.04;

// Invented example handles for the comment flood.
const USERS = [
  "ardi.krijon", "elira.edits", "genti.vfx", "sara.reels", "dorian.cuts", "noa.studio",
  "kreativ.al", "besi.films", "lori.motion", "arbi.shots", "ina.visual", "teo.frames",
  "kejsi.ai", "redi.clips", "mira.creates", "endi.post",
];
const COLORS = ["#ff7a59", "#5b8cff", "#ffb547", "#b07bff", "#3ecf8e", "#ff5c93", "#46c2ff", "#f4d35e"];

// Comment spawn times: yours first, then a flood that speeds up and keeps going.
const SPAWNS: number[] = [T_SEND + 0.04];
{
  let s = 1.3;
  let gap = 0.16;
  while (s < 3.6) {
    SPAWNS.push(s);
    s += gap;
    gap = Math.max(0.1, gap * 0.9);
  }
}

const ROW_H = 132;
const FEED_BOTTOM = 1500; // top edge of the newest row
const FEED_TOP_FADE = 980;

const Avatar: React.FC<{ i: number; own: boolean }> = ({ i, own }) => {
  const name = own ? "ti" : USERS[i % USERS.length];
  return (
    <div
      style={{
        width: 76,
        height: 76,
        borderRadius: "50%",
        flexShrink: 0,
        background: own ? LIME : COLORS[i % COLORS.length],
        color: own ? "#111" : "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 32,
        textTransform: "uppercase",
      }}
    >
      {name.slice(0, 2)}
    </div>
  );
};

const Feed: React.FC<{ t: number; fps: number; frame: number }> = ({ t, fps, frame }) => {
  const rows = SPAWNS.map((s, i) => {
    if (t < s) return null;
    // pushed up one row for every later comment that has arrived
    let offset = 0;
    for (let j = i + 1; j < SPAWNS.length; j++) {
      if (t < SPAWNS[j]) break;
      offset += ROW_H * spring({ frame: frame - SPAWNS[j] * fps, fps, config: { damping: 22, stiffness: 320 } });
    }
    const enter = spring({ frame: frame - (s + (i === 0 ? 0 : 0.09)) * fps, fps, config: { damping: 16, stiffness: 160 } });
    const own = i === 0;
    // your comment flies up out of the comment bar; others rise in
    const rise = own ? (1 - enter) * 240 : 0;
    const y = FEED_BOTTOM - offset + rise;
    const fadeTop = interpolate(y, [FEED_TOP_FADE - 120, FEED_TOP_FADE + 60], [0, 1], clamp);
    const liked = own ? 0 : random(`like${i}`) * 180;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: y,
          height: ROW_H - 18,
          opacity: enter * fadeTop,
          transform: own ? undefined : `scale(${0.9 + 0.1 * enter})`,
          display: "flex",
          alignItems: "center",
          gap: 26,
          padding: "0 30px",
          borderRadius: 30,
          background: own ? "rgba(221,251,44,0.10)" : "rgba(255,255,255,0.055)",
          border: own ? `2px solid ${LIME}` : "1px solid rgba(255,255,255,0.08)",
          boxShadow: own ? `0 0 40px rgba(221,251,44,0.25)` : "none",
          fontFamily: FONT,
        }}
      >
        <Avatar i={i} own={own} />
        <div style={{ flex: 1, lineHeight: 1.15 }}>
          <div style={{ fontSize: 27, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
            {own ? "ti · tani" : `${USERS[i % USERS.length]} · tani`}
          </div>
          <div style={{ fontSize: 44, color: "#fff", fontWeight: 700, letterSpacing: "0.02em" }}>HOOK</div>
        </div>
        <svg width="40" height="40" viewBox="0 0 24 24" style={{ opacity: 0.8 }}>
          <path
            d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 5 6.4 5c2 0 3.6 1.2 4.6 2.7C12 6.2 13.6 5 15.6 5 19 5 21.1 8.4 19.6 11.8 17.5 16.4 12 21 12 21z"
            fill={t - s > 0.35 + liked / 600 ? "#ff4d6d" : "none"}
            stroke={t - s > 0.35 + liked / 600 ? "#ff4d6d" : "rgba(255,255,255,0.6)"}
            strokeWidth="1.8"
          />
        </svg>
      </div>
    );
  });
  return <>{rows}</>;
};

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Screen shake on the HOOK slam.
  const shake = interpolate(t, [T_HOOK, T_HOOK + 0.25], [1, 0], clamp);
  const sx = Math.sin(frame * 2.7) * 14 * shake;
  const sy = Math.cos(frame * 3.3) * 10 * shake;

  // "Komento" types in across the spoken word.
  const kom = "Komento";
  const komShown = Math.floor(interpolate(t, T_KOM, [0, kom.length], clamp));

  // HOOK slam.
  const slam = interpolate(t, [T_HOOK, T_HOOK + 0.16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const hookScale = t < T_HOOK ? 0 : 1.9 - 0.9 * slam + 0.03 * Math.sin(Math.max(0, t - 1.2) * 5);
  const flash = interpolate(t, [T_HOOK, T_HOOK + 0.02, T_HOOK + 0.2], [0, 0.32, 0], clamp);
  const shimmer = interpolate(t, [2.35, 2.95], [-40, 140], clamp);

  // Comment bar.
  const barIn = spring({ frame: frame - 0.1 * fps, fps, config: { damping: 15, stiffness: 120 } });
  const typed = t >= T_SEND + 0.04 ? 0 : HOOK_KEYS.filter((k) => t >= k).length;
  const sendPress = interpolate(t, [T_SEND - 0.04, T_SEND, T_SEND + 0.12], [1, 0.82, 1], clamp);
  const caretOn = Math.floor(t * 3) % 2 === 0;

  // DM notification.
  const dm = spring({ frame: frame - T_DM * fps, fps, config: { damping: 14, stiffness: 140 } });

  // Floating lime particles for atmosphere.
  const particles = Array.from({ length: 28 }, (_, i) => {
    const x = random(`px${i}`) * 1080;
    const y0 = random(`py${i}`) * 1920;
    const sp = 30 + random(`ps${i}`) * 70;
    const y = (((y0 - t * sp) % 1920) + 1920) % 1920;
    const r = 2 + random(`pr${i}`) * 4;
    const o = 0.15 + 0.35 * Math.abs(Math.sin(t * 2 + i));
    return { x, y, r, o };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 40% at 50% 38%, rgba(221,251,44,${0.07 + 0.12 * slam}) 0%, rgba(221,251,44,0) 70%)`,
        }}
      />
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.r * 2,
            height: p.r * 2,
            borderRadius: "50%",
            background: LIME,
            opacity: p.o * slam,
            boxShadow: `0 0 ${p.r * 4}px ${LIME}`,
          }}
        />
      ))}

      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px)` }}>
        <Feed t={t} fps={fps} frame={frame} />

        {/* dark gradient so the headline always reads over the feed */}
        <AbsoluteFill
          style={{ background: `linear-gradient(to bottom, ${BG} 0%, ${BG} 44%, rgba(11,11,12,0.6) 54%, rgba(11,11,12,0) 62%)` }}
        />

        {/* headline */}
        <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", fontFamily: FONT }}>
          <div style={{ fontSize: 124, fontWeight: 600, color: "#f4f4f4", letterSpacing: "-0.01em", height: 140, whiteSpace: "pre" }}>
            {[...kom].slice(0, komShown).map((ch, i) => (
              <span key={i}>{ch}</span>
            ))}
          </div>
          <div
            style={{
              marginTop: 6,
              height: 290,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {t >= T_HOOK && (
              <div
                style={{
                  fontSize: 300,
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  lineHeight: 1,
                  transform: `scale(${hookScale})`,
                  filter: `blur(${(1 - slam) * 10}px) drop-shadow(0 0 36px rgba(221,251,44,0.55))`,
                  opacity: slam,
                  backgroundImage: `linear-gradient(100deg, ${LIME} ${shimmer - 20}%, #ffffff ${shimmer}%, ${LIME} ${shimmer + 20}%)`,
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  textShadow: "none",
                }}
              >
                HOOK
              </div>
            )}
          </div>
          <div style={{ marginTop: 14, fontSize: 70, fontWeight: 500, color: "#f4f4f4", whiteSpace: "pre" }}>
            {SUB.map((wd, i) => {
              const o = interpolate(t, [wd.s, wd.s + 0.1], [0, 1], clamp);
              const up = (1 - o) * 20;
              const hi = wd.w === "promptet";
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    opacity: o,
                    transform: `translateY(${up}px)`,
                    color: hi ? LIME : "#f4f4f4",
                    fontWeight: hi ? 700 : 500,
                    marginLeft: i ? 20 : 0,
                  }}
                >
                  {wd.w}
                </span>
              );
            })}
          </div>
        </div>

        {/* comment bar */}
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 1680 + (1 - barIn) * 300,
            height: 128,
            borderRadius: 64,
            background: "rgba(255,255,255,0.08)",
            border: `2px solid ${typed ? LIME : "rgba(255,255,255,0.15)"}`,
            display: "flex",
            alignItems: "center",
            padding: "0 22px 0 44px",
            fontFamily: FONT,
            opacity: barIn,
          }}
        >
          <div style={{ flex: 1, fontSize: 46, whiteSpace: "pre" }}>
            {typed > 0 ? (
              <span style={{ color: "#fff", fontWeight: 700 }}>
                {"HOOK".slice(0, typed)}
                <span style={{ color: LIME, opacity: caretOn ? 1 : 0 }}>|</span>
              </span>
            ) : (
              <span style={{ color: "rgba(255,255,255,0.4)" }}>Shto një koment…</span>
            )}
          </div>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: typed ? LIME : "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${sendPress})`,
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24">
              <path d="M3 11.5 21 3l-8.5 18-2.2-7.3L3 11.5z" fill={typed ? "#111" : "rgba(255,255,255,0.7)"} />
            </svg>
          </div>
        </div>

        {/* DM notification: the prompts arriving */}
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 70 + (1 - dm) * -260,
            height: 170,
            borderRadius: 40,
            background: "rgba(38,38,42,0.92)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            gap: 30,
            padding: "0 36px",
            fontFamily: FONT,
            opacity: dm,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 26,
              background: LIME,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="56" height="56" viewBox="0 0 24 24">
              <path d="M3 11.5 21 3l-8.5 18-2.2-7.3L3 11.5z" fill="#111" />
            </svg>
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 30, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Mesazh i ri · tani</div>
            <div style={{ fontSize: 44, color: "#fff", fontWeight: 700 }}>Promptet e tua janë gati</div>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: LIME, opacity: flash, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};
