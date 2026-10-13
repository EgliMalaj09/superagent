import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

/**
 * BLACK TYPE — black-screen title cards: the first word fades in whole,
 * then (after one empty frame) the phrase types out letter by letter.
 * Each new letter lands grey and brightens to white; the line stays
 * centred, so it grows from the middle as it types.
 */

const BG = "#0b0b0c";
const FONT = "-apple-system, 'SF Pro Display', 'SF Pro Text', system-ui, 'Helvetica Neue', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Card =
  | { mode: "fade"; text: string; from: number; to: number }
  | { mode: "type"; text: string; from: number; to: number; framesPerChar: number };

export type BlackTypeProps = { cards: Card[] };

const Line: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      top: "55%",
      left: 0,
      right: 0,
      transform: "translateY(-50%)",
      textAlign: "center",
      fontFamily: FONT,
      fontWeight: 500,
      fontSize: 140,
      letterSpacing: "-0.01em",
      color: "#f4f4f4",
      whiteSpace: "pre",
    }}
  >
    {children}
  </div>
);

export const BlackType: React.FC<BlackTypeProps> = ({ cards }) => {
  const frame = useCurrentFrame();
  const card = cards.find((c) => frame >= c.from && frame < c.to);

  let content: React.ReactNode = null;
  if (card?.mode === "fade") {
    const o = interpolate(frame, [card.from, card.from + 3], [0.4, 1], clamp);
    content = <Line><span style={{ opacity: o }}>{card.text}</span></Line>;
  } else if (card?.mode === "type") {
    const chars = [...card.text];
    const shown = Math.min(chars.length, Math.floor((frame - card.from) / card.framesPerChar) + 1);
    content = (
      <Line>
        {chars.slice(0, shown).map((ch, i) => {
          const appear = card.from + i * card.framesPerChar;
          const o = interpolate(frame, [appear, appear + 3], [0.4, 1], clamp);
          return (
            <span key={i} style={{ opacity: o }}>
              {ch}
            </span>
          );
        })}
      </Line>
    );
  }

  return <AbsoluteFill style={{ backgroundColor: BG }}>{content}</AbsoluteFill>;
};
