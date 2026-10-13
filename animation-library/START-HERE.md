# Start here

1. Open this folder in Claude Code. The first time on a computer, run `bash setup.sh`.
2. Say what you want in one line. Claude picks the right tool:

| You say | You get |
|---|---|
| "Edit this reel" + drop a phone clip | retakes and pauses cut, captions, hook, zooms, pop-ins → 9:16 MP4 |
| "Make an explainer / data video about Tirana's parks" | script with sources → animation in a style kit (vox, news, map, isometric…) → MP4 |
| "Make a documentary video about <scandal>" | research → Albanian script → ElevenLabs prompt → image prompts → Remotion film → MP4 |
| "Use this style" + a clip / screenshots / link | a reusable style card in `references/` |
| "Make a marketing video for <url>" | the site's real brand colours, fonts and screenshots, animated |

3. Every video stops twice for you: the **script** and the **plan/stills**. Nothing renders before you approve.
4. Give notes in plain words, with a time or frame number if you can ("at 0:12 the text covers the face",
   "frame 1150, move the number up"). Say "I like this" / "I don't like that" and it's saved to `TASTE.md`.
5. Results land in `results/` (MP4 + cover). Upload the file as-is, with "Upload at highest quality" on in Instagram.

Style kits to ask for by name: **news** (dark, red, investigative) · **vox** (paper, highlighter) · **dossier**
(typewriter, stamps) · **map** (routes, pins) · **isometric** (3D city, data) · **luxury** (black + gold) ·
**brand** (from a website) · **doc-reel** (AI photos, film look, like "Zoti i Shqipërisë").
