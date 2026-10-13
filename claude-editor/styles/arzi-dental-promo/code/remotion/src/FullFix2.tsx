import { AbsoluteFill, Easing, Freeze, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";

/**
 * FULL FIX — the finished 52.3s reel with two repairs:
 *  1. girl smiling → map (f1201): was a hard cut into a dark frame; now the
 *     smile pushes in and dissolves with a warm light leak into the map.
 *  2. desk scene (f1411–1507) replaced with the real reception moment
 *     (receptionist explaining to a patient with his suitcase), blended in
 *     from the chair shot and faded to black before the logo.
 */

const SRC = "rec/fullsrc.mp4";
const J = 1201;
const D0 = 1411;
const D1 = 1507;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.65, 0, 0.35, 1);

const Src: React.FC<{ at?: number }> = ({ at }) => {
  const v = <OffthreadVideo src={staticFile(SRC)} muted style={{ width: 1080, height: 1920 }} />;
  return at === undefined ? v : <Freeze frame={at}>{v}</Freeze>;
};

const Leak: React.FC<{ o: number }> = ({ o }) => (
  <AbsoluteFill
    style={{
      opacity: o,
      background: "radial-gradient(ellipse 90% 70% at 60% 30%, #fff3dc 0%, rgba(255,214,160,0.7) 40%, rgba(255,190,130,0) 80%)",
      mixBlendMode: "screen",
    }}
  />
);

export const FullFix2Video: React.FC = () => {
  const f = useCurrentFrame();

  // 1. girl → map
  if (f >= J - 6 && f < J + 14) {
    const p = interpolate(f, [J - 6, J + 13], [0, 1], { ...clamp, easing: ease });
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <AbsoluteFill>{f >= J ? <Src /> : <Src at={J + 10} />}</AbsoluteFill>
        <AbsoluteFill style={{ opacity: 1 - p, transform: `scale(${1 + 0.12 * p})`, filter: `blur(${8 * p}px)` }}>
          <Src at={Math.min(f, J - 1)} />
        </AbsoluteFill>
        <Leak o={0.7 * Math.sin(Math.PI * p)} />
      </AbsoluteFill>
    );
  }

  // 2. reception replaces the desk scene
  if (f >= D0 && f < D1) {
    const p = interpolate(f, [D0, D0 + 12], [0, 1], { ...clamp, easing: ease });
    const push = interpolate(f, [D0, D1], [1.0, 1.05], clamp);
    const black = interpolate(f, [D1 - 8, D1], [0, 1], clamp);
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <AbsoluteFill style={{ opacity: 1 - p, filter: `blur(${16 * p}px)`, transform: `scale(${1 + 0.04 * p})` }}>
          <Src at={D0 - 1} />
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: p, filter: `blur(${16 * (1 - p)}px)`, transform: `scale(${push})`, transformOrigin: "50% 45%" }}>
          <Sequence from={D0}>
            <OffthreadVideo src={staticFile("rec/recdesk2.mp4")} muted />
          </Sequence>
        </AbsoluteFill>
        <AbsoluteFill style={{ backgroundColor: "#000", opacity: black }} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Src />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Keyword captions — exact spoken wording, word-timed to the voiceover.
const SANS = "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif";
const GOLD = "#E2C17A";
type W = { w: string; s: number; gold?: boolean; br?: boolean };
const CAPS: { to: number; words: W[] }[] = [
  { to: 19.95, words: [{ w: "Il", s: 15.92 }, { w: "tuo", s: 16.04 }, { w: "caso", s: 16.26 }, { w: "viene", s: 16.84 }, { w: "valutato", s: 17.26, br: true }, { w: "dal", s: 18.34 }, { w: "team", s: 18.66, gold: true }, { w: "medico", s: 19.06, gold: true }] },
  { to: 22.5, words: [{ w: "Il", s: 20.18 }, { w: "percorso", s: 20.42 }, { w: "viene", s: 21.02, br: true }, { w: "pianificato", s: 21.38, gold: true }] },
  { to: 27.3, words: [{ w: "con", s: 22.56 }, { w: "il", s: 22.98 }, { w: "supporto", s: 23.22 }, { w: "del", s: 23.66, br: true }, { w: "laboratorio", s: 23.74, gold: true }, { w: "odontotecnico", s: 24.86, gold: true, br: true }, { w: "interno", s: 26.18, gold: true }] },
  { to: 31.7, words: [{ w: "Oltre", s: 29.44 }, { w: "1.000", s: 29.82, gold: true }, { w: "metri", s: 30.2, br: true }, { w: "quadrati", s: 30.46 }] },
  { to: 34.9, words: [{ w: "19", s: 31.84, gold: true }, { w: "poltrone", s: 32.62, br: true }, { w: "operative", s: 33.66 }] },
  { to: 41.8, words: [{ w: "Dopo", s: 40.42 }, { w: "il", s: 40.62 }, { w: "rientro,", s: 40.74 }] },
  { to: 44.2, words: [{ w: "i", s: 41.86 }, { w: "nostri", s: 41.86 }, { w: "riferimenti", s: 42.2, br: true }, { w: "a", s: 43.32 }, { w: "Firenze", s: 43.52, gold: true }] },
  { to: 47.7, words: [{ w: "possono", s: 44.22 }, { w: "seguirti", s: 44.74 }, { w: "per", s: 45.56, br: true }, { w: "i", s: 45.76 }, { w: "controlli", s: 46.12, gold: true }, { w: "concordati", s: 46.46, gold: true }] },
  { to: 49.9, words: [{ w: "Raccontaci", s: 47.8 }, { w: "il", s: 48.46, br: true }, { w: "tuo", s: 48.66 }, { w: "caso", s: 48.78, gold: true }] },
  { to: 51.6, words: [{ w: "e", s: 49.32 }, { w: "richiedi", s: 49.94, br: true }, { w: "una", s: 50.34 }, { w: "prima", s: 50.6 }, { w: "valutazione", s: 50.76, gold: true }] },
];
const clampC = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const i = CAPS.findIndex((c) => t >= c.words[0].s - 0.05 && t < c.to);
  // soft gradient behind the lower third, only while a caption is on screen
  const anyOn = CAPS.some((c) => t >= c.words[0].s - 0.3 && t < c.to + 0.3);
  const grad = interpolate(anyOn ? 1 : 0, [0, 1], [0, 1]);
  const onLogo = t >= 50.17;
  if (i < 0) return <AbsoluteFill style={{ opacity: 0 }} />;
  const cap = CAPS[i];
  const out = interpolate(t, [cap.to - 0.2, cap.to], [1, 0], clampC);
  const lines: W[][] = [[]];
  cap.words.forEach((w, k) => {
    lines[lines.length - 1].push(w);
    if (w.br && k < cap.words.length - 1) lines.push([]);
  });
  // words flagged br start a new line BEFORE them; move flag semantics: break after the word
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {!onLogo && (
        <AbsoluteFill style={{ opacity: grad * 0.9, background: "linear-gradient(to bottom, rgba(0,0,0,0) 62%, rgba(8,10,14,0.55) 80%, rgba(8,10,14,0.55) 90%, rgba(0,0,0,0) 100%)" }} />
      )}
      <div style={{ position: "absolute", left: 70, right: 70, top: onLogo ? 1180 : 1470, textAlign: "center", fontFamily: SANS, opacity: out }}>
        <div style={{ width: 64, height: 3, margin: "0 auto 26px", background: GOLD, borderRadius: 2, opacity: interpolate(t, [cap.words[0].s, cap.words[0].s + 0.25], [0, 0.9], clampC) }} />
        {lines.map((ln, li) => (
          <div key={li} style={{ fontSize: 60, fontWeight: 600, lineHeight: 1.22, letterSpacing: "-0.005em", color: "#fff" }}>
            {ln.map((w, wi) => {
              const p = interpolate(t, [w.s, w.s + 0.16], [0, 1], clampC);
              return (
                <span key={wi} style={{ display: "inline-block", margin: "0 9px", opacity: p, transform: `translateY(${(1 - p) * 14}px)`, filter: `blur(${(1 - p) * 4}px)`, color: w.gold ? GOLD : "#fff", textShadow: "0 2px 14px rgba(0,0,0,0.65)" }}>
                  {w.w}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const FullFix2: React.FC<{ captions?: boolean }> = ({ captions = false }) => (
  <AbsoluteFill>
    <FullFix2Video />
    {captions && <Captions />}
  </AbsoluteFill>
);
