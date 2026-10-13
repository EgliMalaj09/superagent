import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";

export const DISPLAY = loadAnton("normal", { subsets: ["latin", "latin-ext"] }).fontFamily;
export const LABEL = loadOswald("normal", {
  weights: ["400", "700"],
  subsets: ["latin", "latin-ext"],
}).fontFamily;

export const RED = "#e21818";
export const GOLD = "#d4a040";
