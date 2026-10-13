import { AbsoluteFill, Composition, staticFile } from "remotion";
import { EditedVideo, type EditedVideoProps } from "./EditedVideo";
import { StyleShowcase } from "./StyleShowcase";
import { XrayReveal } from "./XrayReveal";
import { ScreenZoom, type ZoomCam } from "./MarkerZoom";
import markerCam from "./markerCam.json";
import { CommentCta } from "./CommentCta";
import { TalkCaptions } from "./TalkCaptions";
import { IntroHook } from "./IntroHook";
import { DragoWhip } from "./DragoWhip";
import { MemeEdit } from "./MemeEdit";
import { ToolZoom } from "./ToolZoom";
import { BlackType } from "./BlackType";
import { FairyEdit } from "./FairyEdit";
import { HookCut } from "./HookCut";
import { ParafunditEdit } from "./ParafunditEdit";
import { EndCard } from "./EndCard";
import { FinalEdit } from "./FinalEdit";
import { RewindIntro } from "./RewindIntro";
import { CaptionStyles } from "./CaptionStyles";
import { DentalCaption } from "./DentalCaption";
import { ArziHook } from "./ArziHook";
import { TriggerEdit } from "./TriggerEdit";
import { ProofEdit } from "./ProofEdit";
import { ProofEditV2 } from "./ProofEditV2";
import { SafetyEdit } from "./SafetyEdit";
import { HookNew } from "./HookNew";
import { HookFinale } from "./HookFinale";
import { FinaleFix } from "./FinaleFix";
import { SubSwap } from "./SubSwap";
import { Creative2 } from "./Creative2";
import { Creative2Plan } from "./Creative2Plan";
import { RouteMap } from "./RouteMap";
import { Fundi } from "./Fundi";
import { Fundi2 } from "./Fundi2";
import { FullFix } from "./FullFix";
import { FullFix2 } from "./FullFix2";
import { Scene2a } from "./Scene2a";
import { C2Overlay, C2Preview } from "./Creative2Final";
import { C3Card } from "./C3Card";
import { LuganoOverlay, LuganoPreview } from "./LuganoFinal";
import { C3Map } from "./C3Map";
import { FullCaptionsPop, FullCaptionsBig, CaptionsOnlyBig, V1LuganoPatch, V1TorinoMap, CaptionsOnlyTorino, LuganoTiranaMap } from "./FullCaptionsPop";
import { DoctorHook3 } from "./DoctorHook3";
import adjustCam from "./adjustCam.json";
import { DarkGridBg, LightGridBg } from "./templates/Backgrounds";
import props from "./props.json";

const DarkGridFrame = () => <AbsoluteFill><DarkGridBg /></AbsoluteFill>;
const LightGridFrame = () => <AbsoluteFill><LightGridBg /></AbsoluteFill>;

const typed = props as unknown as EditedVideoProps & {
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
};

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="EditedVideo"
        component={EditedVideo}
        durationInFrames={typed.durationInFrames}
        fps={typed.fps}
        width={typed.width}
        height={typed.height}
        defaultProps={typed}
      />
      <Composition
        id="XrayReveal"
        component={XrayReveal}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="InvertReveal"
        component={XrayReveal}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          after: "xray/dragon_invert_1080.png",
          accent: "#7FF3E6",
          card: "xray/prompt2_1080.png",
          holdEnd: 0.9,
          panEnd: 2.2,
          scanStart: 1.5,
          scanEnd: 2.6,
          endSec: 5,
        }}
      />
      <Composition
        id="MarkerZoom"
        component={ScreenZoom}
        durationInFrames={205}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ cam: markerCam as ZoomCam, titleBlock: "Shëno", titleScript: "pikat orientuese", keycap: "M" }}
      />
      <Composition
        id="AdjustZoom"
        component={ScreenZoom}
        durationInFrames={305}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ cam: adjustCam as ZoomCam, titleBlock: "Vendosi në", titleScript: "3-4 frame" }}
      />
      <Composition
        id="CommentCta"
        component={CommentCta}
        durationInFrames={49}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TalkCaptions"
        component={TalkCaptions}
        durationInFrames={303}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="IntroHook"
        component={IntroHook}
        durationInFrames={85}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DragoWhip"
        component={DragoWhip}
        durationInFrames={151}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ src: "rec/drago.mp4", cuts: [40, 83] }}
      />
      <Composition
        id="PromptsWhip"
        component={DragoWhip}
        durationInFrames={209}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ src: "rec/prompts.mp4", cuts: [107], holdOut: { 107: 102 }, fixFirst: true }}
      />
      <Composition
        id="MemeEdit"
        component={MemeEdit}
        durationInFrames={558}
        fps={30}
        width={1440}
        height={2560}
      />
      <Composition
        id="ToolZoom"
        component={ToolZoom}
        durationInFrames={100}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BlackType"
        component={BlackType}
        durationInFrames={40}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          cards: [
            { mode: "fade", text: "Këto", from: 0, to: 14 },
            { mode: "type", text: "hook-e vizuale", from: 15, to: 40, framesPerChar: 1 },
          ],
        }}
      />
      <Composition
        id="FairyEdit"
        component={FairyEdit}
        durationInFrames={241}
        fps={24}
        width={1504}
        height={1120}
      />
      <Composition
        id="HookCut"
        component={HookCut}
        durationInFrames={122}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ParafunditEdit"
        component={ParafunditEdit}
        durationInFrames={267}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EndCard"
        component={EndCard}
        durationInFrames={108}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FinalEdit"
        component={FinalEdit}
        durationInFrames={734}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RewindIntro"
        component={RewindIntro}
        durationInFrames={299}
        fps={24}
        width={1504}
        height={1120}
      />
      <Composition
        id="CaptionStyles"
        component={CaptionStyles}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ style: 1 as const }}
      />
      <Composition
        id="DentalCaption"
        component={DentalCaption}
        durationInFrames={135}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ArziHook"
        component={ArziHook}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TriggerEdit"
        component={TriggerEdit}
        durationInFrames={119}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ProofEdit"
        component={ProofEdit}
        durationInFrames={353}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ProofEditV2"
        component={ProofEditV2}
        durationInFrames={353}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SafetyEdit"
        component={SafetyEdit}
        durationInFrames={119}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MiddleEdit"
        component={ProofEditV2}
        durationInFrames={397}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          src: "rec/middle.mp4",
          cuts: [45, 105, 159, 213, 267, 338],
          end: 397,
          types: ["zoomblend", "leak", "slide", "whip", "defocus", "zoomblend"],
          origins: ["50% 45%", "50% 55%", "45% 60%", "55% 45%", "45% 45%", "55% 30%", "50% 45%"],
        }}
      />
      <Composition
        id="RecepEdit"
        component={ProofEditV2}
        durationInFrames={218}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          src: "rec/recep.mp4",
          cuts: [30, 68, 186],
          end: 218,
          types: ["leak", "zoomblend", "defocus"],
          origins: ["50% 50%", "60% 45%", "70% 55%", "45% 40%"],
        }}
      />
      <Composition
        id="HookNew"
        component={HookNew}
        durationInFrames={249}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HookFinale"
        component={HookFinale}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Video1Edit"
        component={ProofEditV2}
        durationInFrames={792}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          src: "rec/video1.mp4",
          cuts: [180, 266, 329, 409, 491, 710, 765],
          end: 792,
          types: ["zoomblend", "leak", "defocus", "zoomblend", "whip", "leak", "defocus"],
          origins: ["55% 50%", "50% 45%", "40% 35%", "50% 55%", "55% 55%", "50% 50%", "50% 60%", "45% 45%"],
        }}
      />
      <Composition
        id="FinaleFix"
        component={FinaleFix}
        durationInFrames={791}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MbylljaEdit"
        component={ProofEditV2}
        durationInFrames={174}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          src: "rec/mbyllja.mp4",
          cuts: [108, 140],
          end: 174,
          types: ["leak", "zoomblend"],
          origins: ["50% 60%", "45% 40%", "55% 40%"],
        }}
      />
      <Composition
        id="FffffEdit"
        component={FinaleFix}
        durationInFrames={241}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          src: "rec/fffff.mp4",
          fixes: [
            { a: 24, b: 36, outAt: 29, inAt: 36, type: "zoomblend" },
            { a: 100, b: 112, outAt: 105, inAt: 112, type: "defocus" },
            { a: 176, b: 188, outAt: 181, inAt: 188, type: "leak" },
            { a: 199, b: 214, outAt: 198, inAt: 214, type: "zoomblend" },
            { a: 235, b: 241, outAt: 234, inAt: 234, type: "hold" },
          ],
        }}
      />
      <Composition
        id="SubSwap"
        component={SubSwap}
        durationInFrames={118}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FinishedFix"
        component={FinaleFix}
        durationInFrames={1201}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          src: "rec/finished.mp4",
          fixes: [{ a: 331, b: 343, outAt: 336, inAt: 343, type: "leak" }],
        }}
      />
      <Composition
        id="Creative2"
        component={Creative2}
        durationInFrames={1725}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Creative2Plan"
        component={Creative2Plan}
        durationInFrames={1635}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Lab5b"
        component={ProofEditV2}
        durationInFrames={185}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          src: "rec/lab5b.mp4",
          cuts: [62, 124],
          end: 185,
          types: ["leak", "defocus"],
          origins: ["50% 40%", "45% 45%", "50% 50%"],
        }}
      />
      <Composition
        id="RouteMap"
        component={RouteMap}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Fundi"
        component={Fundi}
        durationInFrames={366}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Fundi2"
        component={Fundi2}
        durationInFrames={372}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FullFix"
        component={FullFix}
        durationInFrames={1570}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FullFix2"
        component={FullFix2}
        durationInFrames={1570}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ captions: false }}
      />
      <Composition
        id="Scene2a"
        component={Scene2a}
        durationInFrames={201}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition id="LuganoTiranaMap" component={LuganoTiranaMap} durationInFrames={150} fps={30} width={1080} height={1920} />
      <Composition id="V1TorinoMap" component={V1TorinoMap} durationInFrames={130} fps={30} width={1080} height={1920} />
      <Composition id="CaptionsOnlyTorino" component={CaptionsOnlyTorino} durationInFrames={1569} fps={30} width={1080} height={1920} />
      <Composition id="V1LuganoPatch" component={V1LuganoPatch} durationInFrames={130} fps={30} width={1080} height={1920} />
      <Composition id="C3Map" component={C3Map} durationInFrames={63} fps={30} width={1080} height={1920} />
      <Composition id="LuganoOverlay" component={LuganoOverlay} durationInFrames={1151} fps={30} width={1080} height={1920} />
      <Composition id="LuganoPreview" component={LuganoPreview} durationInFrames={1151} fps={30} width={1080} height={1920} />
      <Composition id="C3Card" component={C3Card} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ id: "3", kind: "AI", text: "", line: "", secs: 3 }} />
      <Composition id="C2Overlay" component={C2Overlay} durationInFrames={1635} fps={30} width={1080} height={1920} />
      <Composition id="C2Preview" component={C2Preview} durationInFrames={1635} fps={30} width={1080} height={1920} />
      <Composition id="CaptionsOnlyBig" component={CaptionsOnlyBig} durationInFrames={1569} fps={30} width={1080} height={1920} />
      <Composition id="FullCaptionsBig" component={FullCaptionsBig} durationInFrames={1569} fps={30} width={1080} height={1920} />
      <Composition id="DoctorHook3" component={DoctorHook3} durationInFrames={317} fps={30} width={1080} height={1920} />
      <Composition
        id="FullCaptionsPop"
        component={FullCaptionsPop}
        durationInFrames={1570}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="StyleShowcase"
        component={StyleShowcase}
        durationInFrames={30 * 125}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* 16:9 variant for verifying landscape templates side-by-side. */}
      <Composition
        id="StyleShowcaseLandscape"
        component={StyleShowcase}
        durationInFrames={30 * 125}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DarkGridFrame"
        component={DarkGridFrame}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LightGridFrame"
        component={LightGridFrame}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

// Re-exported so Remotion picks it up
export { staticFile };
