import { ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, random, Sequence, useCurrentFrame } from "remotion";
import { at, sceneStart } from "../timing";
import { motionBlur, posterizeTime } from "../motion/helpers";
import { Photo, Shade } from "../effects/Photo";
import { Bar, Slam } from "../effects/Type";
import { Sfx } from "../effects/Sfx";
import { DISPLAY, GOLD, LABEL, RED } from "../fonts";

// Beat boundaries in voiceover seconds
const BEATS = { incinerator: [33.1, 37.5], tunnel: [37.5, 39.2], akshi: [39.2, 41.0], vault: [41.0, 45.25] } as const;
type Beat = keyof typeof BEATS;
const beatFrom = (b: Beat) => at(BEATS[b][0]) - sceneStart("loot");
const beatLen = (b: Beat) => at(BEATS[b][1]) - at(BEATS[b][0]);
/** Beat-local frame for a voiceover timestamp. */
const bc = (b: Beat, voSec: number) => at(voSec) - at(BEATS[b][0]);

/** Push-in camera shared by every beat; overlays inside move with the photo. */
const Push: React.FC<{ len: number; from?: number; to?: number; origin?: string; children: ReactNode }> = ({
  len,
  from = 1.06,
  to = 1.22,
  origin = "50% 50%",
  children,
}) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, len], [from, to], { easing: Easing.out(Easing.quad) });
  const blur = interpolate(frame, [0, 5, len - 5, len], [8, 0, 0, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: origin, filter: motionBlur(blur) }}>
      {children}
    </AbsoluteFill>
  );
};

// Soft crossfade between beats: each beat holds XF frames past its end while the next fades in on top.
const XF = 10;
const FadeIn: React.FC<{ children: ReactNode; skip?: boolean }> = ({ children, skip }) => {
  const frame = useCurrentFrame();
  const o = skip ? 1 : interpolate(frame, [0, XF], [0, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const Incinerator: React.FC = () => {
  const frame = useCurrentFrame();
  const len = beatLen("incinerator");
  const countAt = bc("incinerator", 35.0);
  const value = Math.round(interpolate(frame, [countAt, countAt + 18], [0, 430], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill>
      <Push len={len} origin="45% 60%">
        <Photo src="scandals/llogara-money-pile.jpg" filter="contrast(1.1) saturate(1.1)" />
      </Push>
      <Shade from="top" strength={0.85} size="40%" />
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, textAlign: "center" }}>
        <Bar at={bc("incinerator", 33.6)} size={58}>Inceneratorët</Bar>
      </div>
      {frame >= countAt && (
        <div style={{ position: "absolute", top: 380, left: 0, right: 0, textAlign: "center" }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 240, color: GOLD, lineHeight: 1, textShadow: "0 8px 0 #000, 0 0 60px rgba(212,160,64,0.6)" }}>
            €{value}
          </div>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 64, letterSpacing: 18, color: "#fff", textShadow: "0 4px 10px #000" }}>
            MILIONË
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const Tunnel: React.FC = () => {
  const frame = useCurrentFrame();
  const len = beatLen("tunnel");
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.6);
  const beacon = (x: number, y: number, phase: number) => (
    <div
      style={{
        position: "absolute",
        left: x - 160,
        top: y - 160,
        width: 320,
        height: 320,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,40,30,0.9) 0%, rgba(255,0,0,0) 65%)",
        opacity: phase ? pulse : 1 - pulse,
        mixBlendMode: "screen",
      }}
    />
  );
  return (
    <AbsoluteFill>
      <Push len={len} from={1.08} to={1.2} origin="55% 50%">
        <Photo src="scandals/llogara-tunnel.jpg" filter="contrast(1.1)" />
        {beacon(221, 1117, 0)}
        {beacon(808, 1138, 1)}
        {/* Hides the filename the image generator burned into the road sign */}
        <div style={{ position: "absolute", left: 868, top: 908, width: 182, height: 66, backdropFilter: "blur(10px)", background: "rgba(40,35,30,0.55)" }} />
      </Push>
      <Shade from="top" strength={0.8} size="35%" />
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, textAlign: "center" }}>
        <Bar at={bc("tunnel", 37.8)} size={58}>Tuneli i Llogarasë</Bar>
      </div>
    </AbsoluteFill>
  );
};

const Akshi: React.FC = () => {
  const frame = useCurrentFrame();
  const len = beatLen("akshi");
  const scanY = interpolate(frame, [0, len], [300, 1600]);
  const glitchOn = random(`akshi-${posterizeTime(frame, 3)}`) > 0.7;
  const sliceY = 400 + random(`slice-${posterizeTime(frame, 3)}`) * 1000;
  return (
    <AbsoluteFill>
      <Push len={len} from={1.05} to={1.18} origin="30% 45%">
        <Photo src="scandals/akshi-server-room.jpg" filter="contrast(1.15) saturate(1.1)" />
      </Push>
      {glitchOn && (
        <div style={{ position: "absolute", left: 0, right: 0, top: sliceY, height: 70, overflow: "hidden", transform: "translateX(28px)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: -sliceY, height: 1920 }}>
            <Photo src="scandals/akshi-server-room.jpg" zoom={1.12} origin="30% 45%" filter="hue-rotate(160deg) saturate(2)" />
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: scanY, height: 3, background: RED, boxShadow: "0 0 25px 4px rgba(255,30,30,0.8)" }} />
      <Shade from="top" strength={0.8} size="35%" />
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, textAlign: "center" }}>
        <Bar at={bc("akshi", 39.4)} size={58}>Tenderat e AKSHI-t</Bar>
      </div>
    </AbsoluteFill>
  );
};

const Vault: React.FC = () => {
  const frame = useCurrentFrame();
  const len = beatLen("vault");
  const candle = 0.75 + random(`candle-${posterizeTime(frame, 2)}`) * 0.25;
  const askAt = bc("vault", 43.5);
  const chars = "ASKUSH NUK PYET KU.";
  const typed = Math.max(0, Math.min(chars.length, Math.floor((frame - askAt) / 1.5)));
  return (
    <AbsoluteFill>
      <Push len={len} from={1.0} to={1.18} origin="50% 26%">
        <Photo src="characters/rama-vault.jpg" filter={`brightness(${candle}) contrast(1.1)`} />
      </Push>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 75%, rgba(255,160,60,0.18), transparent 60%)", mixBlendMode: "screen" }} />
      <Shade from="bottom" strength={0.75} size="30%" />
      <div style={{ position: "absolute", top: 760, left: 0, right: 0 }}>
        <Slam at={bc("vault", 41.3)} size={130} color={GOLD} glow="rgba(212,160,64,0.6)">
          MILIARDA
          <br />
          TË ZHDUKURA
        </Slam>
      </div>
      {frame >= askAt && (
        <div
          style={{
            position: "absolute",
            bottom: 170,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: LABEL,
            fontWeight: 700,
            fontSize: 60,
            letterSpacing: 6,
            color: "#fff",
            textShadow: "0 4px 12px #000",
          }}
        >
          {chars.slice(0, typed)}
          <span style={{ opacity: Math.floor(frame / 8) % 2 ? 1 : 0 }}>▌</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Scene 4 — The Loot. One beat per scandal, each landing on its spoken name. */
export const Scene4Loot: React.FC = () => {
  const beats: [Beat, React.FC][] = [
    ["incinerator", Incinerator],
    ["tunnel", Tunnel],
    ["akshi", Akshi],
    ["vault", Vault],
  ];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {beats.map(([b, C], i) => (
        <Sequence key={b} from={beatFrom(b)} durationInFrames={beatLen(b) + (i < beats.length - 1 ? XF : 0)} name={b}>
          <FadeIn skip={i === 0}>
            <C />
          </FadeIn>
          <Sfx name="whoosh" at={0} volume={0.5} />
        </Sequence>
      ))}
      <Sfx name="stamp" at={at(35.0) - sceneStart("loot") + 18} volume={0.8} />
      <Sfx name="boom" at={at(41.3) - sceneStart("loot")} volume={0.8} />
    </AbsoluteFill>
  );
};
