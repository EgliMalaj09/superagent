// frame 1: isometric dusk block with a cut-away 80 m² apartment, the couple, tiles filling, a doormat, a calendar
const WT = 2400, scrW = isoScreen(WT, WT);
const w = world('w', 'tilt', WT, WT);
div(w, 'left:-2000px;top:-2000px;width:' + (WT + 4000) + 'px;height:' + (WT + 4000) + 'px;background:#1A2134;', 'bx');
const G = layer(w, 1);
div(G, 'left:0;top:1150px;width:' + WT + 'px;height:180px;background:#2A3346;', 'bx');                    // roads
div(G, 'left:880px;top:0;width:150px;height:' + WT + 'px;background:#2A3346;', 'bx');
// neighbours: dusk blocks with lit windows
const BP = [['#4b5570', '#3a435c', '#2c3348'], ['#55607c', '#434c66', '#333a51'], ['#5d5670', '#4a4459', '#383447']];
const lots = [[300, 300, 420], [380, 1400, 300], [1150, 300, 520], [1600, 320, 380], [1900, 900, 300], [1750, 1500, 200], [300, 1900, 160], [1950, 1950, 140]];
lots.forEach(function (l, k) { const p = BP[k % 3], sz = 360;
  const b = box(G, { x: l[0], y: l[1], w: sz, d: sz * 0.8, h: l[2], top: p[0], s1: p[1], s2: p[2], win: true });
  for (let i = 0; i < 5; i++) { const lw = layer(b.r, 40 + rnd() * (l[2] - 80)); box(lw, { x: rnd() * (sz - 40), y: sz * 0.8 - 2, w: 26, d: 3, h: 18, top: '#F5B82E', s1: '#F5B82E', s2: '#d99a1a' }); }
});
// the apartment: slab, low walls (roof cut away), floor tiles, bathroom, doormat, couple, calendar
const AX = 1080, AY = 1380, AW = 400, AD = 320;
box(G, { x: AX - 20, y: AY - 20, w: AW + 40, d: AD + 40, h: 24, top: '#3a4359', s1: '#2c3447', s2: '#232a3a' });
const F = layer(G, 24);
div(F, 'left:' + AX + 'px;top:' + AY + 'px;width:' + AW + 'px;height:' + AD + 'px;background:#2E364A;', 'bx');
for (let i = 0; i < 80; i++) { const cx = i % 10, cy = Math.floor(i / 10); if (cy * 10 + cx > 46) continue;
  div(F, 'left:' + (AX + cx * 40 + 2) + 'px;top:' + (AY + (7 - cy) * 40 + 2) + 'px;width:36px;height:36px;background:#C9A06B;box-shadow:inset 0 0 0 2px rgba(0,0,0,.12);', 'bx'); }
const wall = function (x, y, ww, dd) { box(F, { x: x, y: y, w: ww, d: dd, h: 64, top: '#E9E3D6', s1: '#CFC7B6', s2: '#B8AF9D' }); };
wall(AX, AY, AW, 8); wall(AX, AY, 8, AD); wall(AX + 240, AY, 8, 180); wall(AX + 240, AY + 170, 160, 8); wall(AX, AY + 200, 120, 8);
box(F, { x: AX + 14, y: AY + 220, w: 90, d: 40, h: 22, top: '#F4F4F4', s1: '#dcdcdc', s2: '#c8c8c8' });            // tub
box(F, { x: AX + 20, y: AY + 280, w: 30, d: 24, h: 34, top: '#F4F4F4', s1: '#dcdcdc', s2: '#c8c8c8' });            // sink
box(F, { x: AX + 180, y: AY + AD - 6, w: 46, d: 26, h: 2, top: '#5a4632', s1: '#4a3a29', s2: '#3a2d20' });        // doormat at the door
const P = layer(F, 2);
person(P, AX + 300, AY + 250, 40, '#2F6FE0'); person(P, AX + 330, AY + 270, 40, '#E8453C');
const cal = label(F, AX + 120, AY + 6, 120, '<div class="ilab" style="font-size:30px;">2034</div>');
const ape = label(F, AX + 300, AY + 250, 120, '<div class="ilab" style="font-size:24px;background:#F4F1EA;">25 VJEÇ</div>');
camTo('#cam', scrW, AX + 230, AY + 150, 30, 1.85, 1180, 0, 0);
