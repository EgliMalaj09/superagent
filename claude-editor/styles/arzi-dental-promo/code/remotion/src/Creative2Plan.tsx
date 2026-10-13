import { AbsoluteFill, Freeze, OffthreadVideo, Sequence, staticFile } from "remotion";
import { EndCard } from "./Creative2";

/**
 * CREATIVE 02 — PLAN CUT. Doctor on camera for the hook (9:16), then a black
 * card per scene saying what goes there (AI / REAL / REAL + AI), timed to the
 * full voiceover. End card is real (logo + CTA).
 */

const SANS = "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif";
type Kind = "AI" | "REAL" | "REAL + AI";
const COLOR: Record<Kind, string> = { AI: "#8b5cf6", REAL: "#22c55e", "REAL + AI": "#f59e0b" };

const SCENES: { from: number; to: number; id: string; kind: Kind; text: string; line: string }[] = [
  { from: 132, to: 332, id: "2a", kind: "AI", text: "Pacienti në zonën e pritjes, kuadër i afërt në fytyrë dhe duar. Shprehje e menduar, prek nofullën.", line: "Un dente mancante o una protesi instabile possono incidere su gesti semplici…" },
  { from: 332, to: 456, id: "2b", kind: "AI", text: "Gjestet e thjeshta: pacienti ngurron para se të kafshojë, mbulon buzëqeshjen me dorë kur qesh.", line: "…mangiare, parlare, sorridere senza pensarci." },
  { from: 456, to: 582, id: "3a", kind: "REAL", text: "Mjeku / ekipi hap radiografinë në monitor. (Pamja ekzistuese me radiografinë.)", line: "Poi arrivano le domande. Quale trattamento serve?" },
  { from: 582, to: 701, id: "3b", kind: "AI", text: "Reagimi i pacientit duke parë ekranin: i menduar, me pyetje në fytyrë.", line: "Quanto durerà? A chi posso affidarmi?" },
  { from: 701, to: 810, id: "4a", kind: "REAL + AI", text: "Mjeku shpjegon mundësitë me një model dentar; pacienti dëgjon dhe pohon me kokë.", line: "Da noi a Dental Med Austria, qui a Tirana…" },
  { from: 810, to: 902, id: "4b", kind: "REAL", text: "Detaj i modelit dentar në dorë me dorashka. (Videoja e modelit blu.)", line: "…non partiamo da una soluzione uguale per tutti." },
  { from: 902, to: 1050, id: "5a", kind: "REAL", text: "Kontroll në poltronë me mjekun dhe asistentin. (pamje nga procesi / DSCF8782)", line: "Il team valuta la tua situazione clinica e pianifica il percorso…" },
  { from: 1050, to: 1235, id: "5b", kind: "REAL", text: "Laboratori: skanimi 3D, makina frezuese, tekniku me modelin.", line: "…anche con il supporto del laboratorio odontotecnico interno." },
  { from: 1235, to: 1428, id: "6", kind: "AI", text: "Fundi i konsultës: pacienti bisedon i qetë me mjekun. Qartësi, buzëqeshje e lehtë.", line: "Prima di decidere, scopri quali possibilità esistono per te." },
  { from: 1428, to: 1536, id: "7", kind: "REAL", text: "Pacienti me stafin në recepsion, plotëson formularin.", line: "Raccontaci la tua situazione e richiedi…" },
];

const Card: React.FC<{ id: string; kind: Kind; text: string; line: string; secs: number }> = ({ id, kind, text, line, secs }) => (
  <AbsoluteFill style={{ backgroundColor: "#000", padding: "0 90px", justifyContent: "center", fontFamily: SANS }}>
    <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 40, fontWeight: 600, letterSpacing: "0.12em" }}>SKENA {id}</div>
    <div
      style={{
        alignSelf: "flex-start",
        marginTop: 24,
        padding: "10px 34px",
        borderRadius: 60,
        background: COLOR[kind],
        color: "#0b0b0c",
        fontSize: 56,
        fontWeight: 800,
      }}
    >
      {kind}
    </div>
    <div style={{ marginTop: 50, color: "#fff", fontSize: 64, fontWeight: 700, lineHeight: 1.2 }}>{text}</div>
    <div style={{ marginTop: 50, color: "rgba(255,255,255,0.55)", fontSize: 40, fontStyle: "italic", lineHeight: 1.3 }}>“{line}”</div>
    <div style={{ marginTop: 50, color: "rgba(255,255,255,0.45)", fontSize: 38, fontWeight: 600 }}>{secs.toFixed(1)} s</div>
  </AbsoluteFill>
);

export const Creative2Plan: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence durationInFrames={132}>
      <OffthreadVideo src={staticFile("rec/c2doc.mp4")} muted />
    </Sequence>
    <Sequence from={130} durationInFrames={2}>
      <Freeze frame={129}>
        <OffthreadVideo src={staticFile("rec/c2doc.mp4")} muted />
      </Freeze>
    </Sequence>
    {SCENES.map((s) => (
      <Sequence key={s.id} from={s.from} durationInFrames={s.to - s.from}>
        <Card id={s.id} kind={s.kind} text={s.text} line={s.line} secs={(s.to - s.from) / 30} />
      </Sequence>
    ))}
    <Sequence from={1536}>
      <EndCard />
    </Sequence>
  </AbsoluteFill>
);
