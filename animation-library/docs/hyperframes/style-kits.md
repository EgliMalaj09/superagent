# Style kits (`library/styles/*.css`, on top of `base.css`)

Pick with `new_project.py --style <kit>`. Each kit only sets tokens + a few classes, so mixing is easy: put overrides in
`scene.css` or a `reference.css`. A working minimal scene for every kit is in `examples/style-tests/<kit>/`.

| Kit | Use for | Background / ink / accent / highlight | Head · body · quote fonts | Extras | Default bed |
|---|---|---|---|---|---|
| **news** | investigative, political, breaking | #0B0C0E · #F4F1EA · red #E3262F · red | Oswald 700 caps · Hanken Grotesk · Source Serif italic | `.scan` lines, grey photos | bed-news-tension |
| **vox** | documentary explainer (the user's pick for politics) | paper #EEE8DC · #1D1C1A · #C8202F · yellow #FFD23F | Archivo Condensed 800 · Hanken · Source Serif italic | `.halftone`, B&W photos with white borders | bed-vox |
| **dossier** | archive, case files, leaks | manila #D9CBAA · #231F1A · #9E1B1B | Special Elite (typewriter) · Spectral italic | `.redact` bars (scaleX), sepia photos | bed-news-tension |
| **map** | geography, migration, routes | navy #0C1626 · #EAF0F7 · teal #4FD1C5 · gold #F6C344 | Outfit 800 · Inter | `.route` (draw), `.pin` | bed-explainer |
| **isometric** | 3D city / data worlds | paper #F2EEE6 · #1E1B18 · green #3FA66B · yellow #F6D743 | Bricolage 800 · Hanken | `.cam .tilt .spin .bx .chip .paper` | bed-explainer |
| **luxury** | premium, real estate, fashion | #0A0907 · ivory #F3EBDD · gold #C9A45C | Instrument Serif · Outfit | `.gold` sweep text, `.hairline` | bed-luxury-pad |
| **brand** | product / SaaS / marketing | #0E1116 · white · #5B8CFF (replace from `capture`) | Outfit 800 · Inter | `.glass`, `.ui` screenshots | bed-tech |

**doc-reel look (Remotion)** for comparison: black + red #e21818 + gold #d4a040, Anton + Oswald, film grain + scan lines +
vignette + gate weave, grayscale-on-stamp portraits. See `docs/doc-reel/06-film-look-and-color.md`.

## Tokens every kit defines

`--bg --ink --mute --accent --hi --red --card --head --headw --track --body --quote --bgfx --shadow --radius`
(map adds `--land --border`; isometric adds `--green --green2 --paper`). A style reference (`style-reference` skill)
writes the same tokens into `reference.css`.

## Fonts in `library/fonts/` (all with ë ç)

Arc = Archivo Condensed 600/800 · BG = Bricolage Grotesque 800 · DM = DM Sans 400/500/700 · HG = Hanken Grotesk
300/500/700 · IS = Instrument Serif regular/italic · Inter 400/500/600 · Osw = Oswald 500/700 · Out = Outfit 500/700/800 ·
Ser = Source Serif 4 italic 600/700 · Type = Special Elite · Spec = Spectral italic 600/700.
