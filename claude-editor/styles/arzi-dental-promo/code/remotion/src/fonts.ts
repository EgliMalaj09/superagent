import { continueRender, delayRender, staticFile } from "remotion";

// Block the render until the WordPop fonts are loaded, so no frame is
// captured with a fallback font. Bundled locally (Latin subset covers the
// Albanian ë / ç) so renders never depend on the network.
const handle = delayRender("Loading local fonts");
const faces = [
  new FontFace("Space Grotesk", `url(${staticFile("fonts/SpaceGrotesk-700.woff2")}) format("woff2")`, { weight: "700" }),
  new FontFace("Poppins", `url(${staticFile("fonts/Poppins-800.woff2")}) format("woff2")`, { weight: "800" }),
  new FontFace("Caveat", `url(${staticFile("fonts/Caveat-700.woff2")}) format("woff2")`, { weight: "700" }),
];
Promise.all(faces.map((f) => f.load().then((loaded) => document.fonts.add(loaded))))
  .catch((err) => console.error("Font load failed", err))
  .finally(() => continueRender(handle));
