# Render check: output.mp4

**PASS**  (2026-10-06 13:26)

| Check | Result | Measured | Expected |
|---|---|---|---|
| Resolution | PASS | 1080x1920 | 1080x1920 |
| Colour tags | PASS | primaries bt709, transfer bt709, space bt709 | bt709 x3 (else run the step-8 remux) |
| Video bitrate | PASS | 10.7 Mb/s | >= 6.0 Mb/s |
| Duration | PASS | 26.200 s | 26.200 s +/- 0.033 (data-duration) |
| Video vs audio | PASS | 26.200 / 26.221 s | within 0.12 s |
| Black frames | PASS | 0 interval(s), 0 flash(es) | none (pix_th 0.08; d 0.1 plus shorter flashes) |

## Frame sheet

`render-sheet.png`: 2 frame(s) (no drawtext in this ffmpeg: times listed here, not on the tiles), read it before delivering: first frame, every card at data-start + 0.9 s, last frame.

0.00 26.15
