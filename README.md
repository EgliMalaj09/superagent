# Egli studio

Content studio for **egli_ai** and **pattern.io**, run by a master Claude agent that hands work to specialist agents.
Open every Claude Code session in `claude-agent/`.

| Folder | What it is |
|---|---|
| `claude-agent/` | The master agent: rules (`CLAUDE.md`), profile (`ABOUT-ME.md`), knowledge map, the specialist agents, `STUDIO-MAP.html` |
| `animation-library/` | Fully animated videos (pattern.io): HyperFrames, Remotion, the huashu-art-motion styles, `docs/style-guide.md` |
| `claude-editor/` | Editing real footage: CapCut route, editing styles (e.g. Arzi) |
| `claude-sequences/` | The Claude-in-Tirana comic episodes |
| `api-keys/` | Google AI images, video and music (Vertex AI). No keys are stored here. |

**Not in the repo:** videos, audio and images (they stay on the Mac), `node_modules`, Python environments.

## Setting up on a Windows PC
1. Install: [Git](https://git-scm.com/download/win), [Node.js 22+](https://nodejs.org), [Python 3](https://www.python.org/downloads/),
   [uv](https://docs.astral.sh/uv/getting-started/installation/), FFmpeg (`winget install Gyan.FFmpeg`),
   [Google Cloud CLI](https://cloud.google.com/sdk/docs/install), and Claude Code.
2. Clone: `gh repo clone EgliMalaj09/egli-studio` (or `git clone`), then open Claude Code in `egli-studio/claude-agent`.
3. Reinstall packages: `npm install` in `animation-library` and `claude-sequences`.
4. Google login for generation (`api-keys`): `gcloud auth application-default login`. The scripts look for gcloud at
   `~/google-cloud-sdk/bin/gcloud`, which differs on Windows; ask Claude to adapt them on first use.
5. Transcription (`claude-editor`): install whisper.cpp and the `ggml-large-v3-turbo` model; ask Claude to point the
   scripts at it.
6. Claude Code settings: `claude-agent/.claude/settings.json` lists Mac folder paths; on Windows, ask Claude to
   update them to the cloned folders (you approve the change).
7. huashu styles: `uv run --with playwright playwright install chromium` once, inside
   `animation-library/.claude/skills/huashu-art-motion`.

## Keeping both machines in sync
- Before you start: `git pull`
- When you finish: `git add -A && git commit -m "what changed" && git push`
