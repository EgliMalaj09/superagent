import { CSSProperties } from "react";
import { Img, staticFile } from "remotion";

/** Full-frame photo layer with zoom, drift and grade. */
export const Photo: React.FC<{
  src: string;
  zoom?: number;
  x?: number;
  y?: number;
  rot?: number;
  origin?: string;
  filter?: string;
  position?: string;
  style?: CSSProperties;
}> = ({ src, zoom = 1, x = 0, y = 0, rot = 0, origin = "50% 50%", filter, position = "50% 50%", style }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      transform: `translate(${x}px, ${y}px) scale(${zoom}) rotate(${rot}deg)`,
      transformOrigin: origin,
      filter,
      ...style,
    }}
  >
    <Img
      src={staticFile(`images/${src}`)}
      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position }}
    />
  </div>
);

/** Bottom/top darkening so text stays readable over busy photos. */
export const Shade: React.FC<{ from?: "top" | "bottom"; strength?: number; size?: string }> = ({
  from = "bottom",
  strength = 0.85,
  size = "45%",
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      [from]: 0,
      height: size,
      background: `linear-gradient(${from === "bottom" ? "0deg" : "180deg"}, rgba(0,0,0,${strength}), transparent)`,
    }}
  />
);
