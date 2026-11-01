'use strict';
/* ---------- dane: struktury ---------- */
const B = (x, y) => ({ t: 'block', x, y });
const S = (x, y, r = 0) => ({ t: 'spike', x, y, r });
const row = (x0, x1, y) => { const a = []; for (let x = x0; x <= x1; x++) a.push(B(x, y)); return a; };
const col = (x, y0, y1) => { const a = []; for (let y = y0; y <= y1; y++) a.push(B(x, y)); return a; };
const spikes = (x0, x1, y = 0, r = 0) => { const a = []; for (let x = x0; x <= x1; x++) a.push(S(x, y, r)); return a; };

const STRUCTS = [
  { id: 'flat', name: 'Płaski odcinek', cat: 'basic', w: 4, o: [] },
  { id: 'spike1', name: 'Kolec', cat: 'spikes', w: 3, o: [S(1, 0)] },
  { id: 'spike2', name: 'Dwa kolce', cat: 'spikes', w: 4, o: spikes(1, 2) },
  { id: 'spike3', name: 'Trzy kolce', cat: 'spikes', w: 5, o: spikes(1, 3) },
  { id: 'trap', name: 'Pułapka', cat: 'spikes', w: 7, o: [S(1, 0), S(5, 0)] },
  { id: 'block1', name: 'Blok', cat: 'blocks', w: 3, o: [B(1, 0)] },
  { id: 'blockspike', name: 'Blok + kolec', cat: 'blocks', w: 6, o: [B(1, 0), S(4, 0)] },
  { id: 'stairsup', name: 'Schody w górę', cat: 'blocks', w: 6, o: [B(1, 0), B(2, 0), B(2, 1), B(3, 0), B(3, 1), B(3, 2)] },
  { id: 'stairsdown', name: 'Schody w dół', cat: 'blocks', w: 6, o: [B(1, 0), B(1, 1), B(1, 2), B(2, 0), B(2, 1), B(3, 0)] },
  { id: 'pit', name: 'Dół z kolcami', cat: 'spikes', w: 7, o: [...spikes(1, 5), B(0, 0), B(6, 0)] },
  { id: 'platform', name: 'Platforma z kolcami', cat: 'blocks', w: 8, o: [...row(1, 6, 0), S(3, 1), S(4, 1)] },
  { id: 'pillars', name: 'Filary', cat: 'blocks', w: 10, o: [...col(1, 0, 1), ...col(4, 0, 2), ...col(7, 0, 1), ...spikes(2, 3), ...spikes(5, 6), S(8, 0)] },
  { id: 'ceiling', name: 'Kolce z sufitu', cat: 'spikes', w: 5, o: [...row(0, 4, 4), S(1, 3, 180), S(2, 3, 180), S(1, 0)] },
  { id: 'pad', name: 'Pad skokowy', cat: 'special', w: 6, o: [{ t: 'pad', x: 1, y: 0 }, ...spikes(2, 4)] },
  { id: 'orb', name: 'Orb skokowy', cat: 'special', w: 7, o: [{ t: 'orb', x: 3, y: 2 }, ...spikes(2, 4)] },
  { id: 'saw', name: 'Piła', cat: 'special', w: 4, o: [{ t: 'saw', x: 1, y: 1 }] },
  { id: 'sawrow', name: 'Piły i kolce', cat: 'special', w: 8, o: [{ t: 'saw', x: 1, y: 1 }, S(4, 0), { t: 'saw', x: 6, y: 1 }] },
  { id: 'shipin', name: 'Portal: statek', cat: 'ship', w: 3, o: [{ t: 'portal', x: 1, y: 2, m: 'ship' }, ...row(1, 2, 9)] },
  { id: 'shiptunnel', name: 'Tunel statku', cat: 'ship', w: 10, o: [...row(0, 9, 9), S(3, 0), S(7, 0), S(5, 8, 180)] },
  { id: 'shipblocks', name: 'Statek: bloki', cat: 'ship', w: 10, o: [...row(0, 9, 9), ...col(3, 0, 3), ...col(7, 5, 8)] },
  { id: 'shipzig', name: 'Statek: zygzak', cat: 'ship', w: 12, o: [...row(0, 11, 9), ...col(2, 0, 4), ...col(5, 4, 8), ...col(8, 0, 4), S(11, 0)] },
  { id: 'shipout', name: 'Portal: kostka', cat: 'ship', w: 3, o: [{ t: 'portal', x: 1, y: 2, m: 'cube' }, B(0, 9)] },
];
const SBY = Object.fromEntries(STRUCTS.map(s => [s.id, s]));
const CATS = [['all', 'Wszystkie'], ['basic', 'Podstawowe'], ['spikes', 'Kolce'], ['blocks', 'Bloki'], ['special', 'Specjalne'], ['ship', 'Statek']];
const CUBE_POOL = STRUCTS.filter(s => !['ship', 'basic'].includes(s.cat)).map(s => s.id);
const SHIP_POOL = ['shiptunnel', 'shipblocks', 'shipzig'];

/* ---------- dane: dekoracje ---------- */
const OPTIONS = {
  block: { label: 'Blok', list: [['classic', 'Klasyczny'], ['neon', 'Neon'], ['brick', 'Cegła'], ['ice', 'Lód'], ['lava', 'Lawa'], ['tech', 'Tech'], ['wood', 'Drewno'], ['gold', 'Złoto'], ['candy', 'Cukierek']] },
  spike: { label: 'Kolec', list: [['classic', 'Klasyczny'], ['neon', 'Neon'], ['crystal', 'Kryształ'], ['fire', 'Ogień'], ['ice', 'Lód'], ['thorn', 'Cierń'], ['bone', 'Kość']] },
  saw: { label: 'Piła', list: [['classic', 'Klasyczna'], ['gear', 'Zębatka'], ['star', 'Gwiazda'], ['neon', 'Neon']] },
  orb: { label: 'Orb i pad', list: [['classic', 'Klasyczny'], ['ring', 'Pierścień'], ['star', 'Gwiazda']] },
  ground: { label: 'Podłoże', list: [['line', 'Linia'], ['grass', 'Trawa'], ['stone', 'Kamień'], ['lava', 'Lawa'], ['neon', 'Neon'], ['snow', 'Śnieg']] },
  bg: { label: 'Tło', list: [['blue', 'Niebieskie'], ['purple', 'Fiolet'], ['sunset', 'Zachód'], ['dark', 'Ciemne'], ['green', 'Zielone'], ['red', 'Czerwone'], ['cyan', 'Turkus']] },
  extra: { label: 'Dodatki w tle', list: [['none', 'Brak'], ['stars', 'Gwiazdy'], ['squares', 'Kwadraty'], ['bubbles', 'Bąbelki'], ['lines', 'Linie']] },
};
const BG = { blue: ['#1e3c9e', '#0a1550'], purple: ['#6a22b5', '#1c0a40'], sunset: ['#ff8a3d', '#7a1f6b'], dark: ['#2a2a30', '#050505'], green: ['#22b050', '#07391b'], red: ['#c4202f', '#3a050a'], cyan: ['#18c4d6', '#064a63'] };
const COLORS = ['#38d6ff', '#ffd23a', '#3cff7a', '#ff4ad1', '#ff5a3d', '#ffffff', '#9b6bff'];
const DEFAULT_PRESET = { block: 'classic', spike: 'classic', saw: 'classic', orb: 'classic', ground: 'line', bg: 'blue', extra: 'none', color: '#38d6ff' };
const SEC_COLORS = ['#38d6ff', '#ffd23a', '#3cff7a', '#ff4ad1', '#ff7a3d', '#9b6bff', '#ff4d6d', '#7affd0'];
const SONGS = ['Stereo Madness', 'Back on Track', 'Polargeist', 'Dry Out', 'Base After Base', "Can't Let Go", 'Jumper', 'Time Machine', 'Cycles', 'xStep', 'Clutterfunk', 'Theory of Everything', 'Electroman Adventures', 'Clubstep', 'Electrodynamix', 'Hexagon Force', 'Blast Processing', 'Theory of Everything 2', 'Geometrical Dominator', 'Deadlocked', 'Fingerdash'];
const GD_ID = { block: 1, spike: 8, saw: 88, pad: 35, orb: 36, portalcube: 12, portalship: 13 };

/* ---------- stan ---------- */
const DEFAULT_STATE = () => ({
  step: 1, items: [], scope: 'whole', sel: 0,
  deco: { global: { ...DEFAULT_PRESET }, sections: [] },
  meta: { name: '', author: '', song: 0, custom: '', diff: 'normal', desc: '' },
});
let state = DEFAULT_STATE();
let cat = 'all';
const $ = id => document.getElementById(id);
const KEY = 'gdgen_state_v1';
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { } }
function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.items) state = { ...DEFAULT_STATE(), ...s }; } catch (e) { }
}

/* ---------- layout ---------- */
const START = 10, END = 8, ROWS = 11;
function buildLayout(items) {
  const objs = [], secs = [];
  let c = START, from = 0, si = 0;
  items.forEach((it, i) => {
    const s = SBY[it.sid];
    s.o.forEach(o => objs.push({ ...o, x: c + o.x, sec: si }));
    c += s.w;
    if (it.cut && i < items.length - 1) { secs.push({ from, to: c }); from = c; si++; }
  });
  c += END;
  secs.push({ from, to: c });
  return { objs, secs, total: c };
}
function presetFor(si) {
  if (state.scope === 'sections') return state.deco.sections[si] || state.deco.global;
  return state.deco.global;
}

/* ---------- rysowanie ---------- */
const rgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const alpha = (h, a) => { const [r, g, b] = rgb(h); return `rgba(${r},${g},${b},${a})`; };
const lighten = (h, k) => { const [r, g, b] = rgb(h).map(v => Math.round(v + (255 - v) * k)); return `rgb(${r},${g},${b})`; };
const glow = (c, col, b = 8) => { c.shadowColor = col; c.shadowBlur = b; };

function drawBlock(c, st, x, y, s, col) {
  c.save();
  c.lineWidth = 2;
  const g = (a, b) => { const gr = c.createLinearGradient(x, y, x, y + s); gr.addColorStop(0, a); gr.addColorStop(1, b); return gr; };
  switch (st) {
    case 'neon':
      c.fillStyle = alpha(col, .14); c.fillRect(x, y, s, s);
      c.strokeStyle = col; glow(c, col); c.strokeRect(x + 1, y + 1, s - 2, s - 2); break;
    case 'brick':
      c.fillStyle = '#b5502f'; c.fillRect(x, y, s, s);
      c.strokeStyle = '#5a2514'; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(x, y + s / 2); c.lineTo(x + s, y + s / 2); c.moveTo(x + s / 2, y); c.lineTo(x + s / 2, y + s / 2);
      c.moveTo(x + s / 4, y + s / 2); c.lineTo(x + s / 4, y + s); c.moveTo(x + s * .75, y + s / 2); c.lineTo(x + s * .75, y + s); c.stroke();
      c.lineWidth = 2; c.strokeRect(x + 1, y + 1, s - 2, s - 2); break;
    case 'ice':
      c.fillStyle = g('#e8fbff', '#6fc8ff'); c.fillRect(x, y, s, s);
      c.strokeStyle = '#fff'; c.strokeRect(x + 1, y + 1, s - 2, s - 2);
      c.strokeStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.moveTo(x + s * .2, y + s * .6); c.lineTo(x + s * .6, y + s * .2); c.stroke(); break;
    case 'lava':
      c.fillStyle = '#2a0a05'; c.fillRect(x, y, s, s);
      c.strokeStyle = '#ff8a00'; c.lineWidth = 1.5; c.beginPath();
      c.moveTo(x + s * .1, y + s * .3); c.lineTo(x + s * .45, y + s * .5); c.lineTo(x + s * .35, y + s * .9);
      c.moveTo(x + s * .45, y + s * .5); c.lineTo(x + s * .9, y + s * .6); c.stroke();
      c.lineWidth = 2; c.strokeStyle = '#ff4a00'; c.strokeRect(x + 1, y + 1, s - 2, s - 2); break;
    case 'tech':
      c.fillStyle = '#0e1c26'; c.fillRect(x, y, s, s);
      c.strokeStyle = col; c.lineWidth = 1.5; c.strokeRect(x + 1, y + 1, s - 2, s - 2);
      c.beginPath(); c.moveTo(x + s * .2, y + s * .5); c.lineTo(x + s * .5, y + s * .5); c.lineTo(x + s * .5, y + s * .2); c.moveTo(x + s * .5, y + s * .5); c.lineTo(x + s * .8, y + s * .8); c.stroke();
      c.fillStyle = col; c.fillRect(x + s * .15, y + s * .45, 4, 4); break;
    case 'wood':
      c.fillStyle = '#8a5a2b'; c.fillRect(x, y, s, s);
      c.strokeStyle = '#4b2f14'; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(x, y + s / 3); c.lineTo(x + s, y + s / 3); c.moveTo(x, y + s * 2 / 3); c.lineTo(x + s, y + s * 2 / 3); c.stroke();
      c.lineWidth = 2; c.strokeRect(x + 1, y + 1, s - 2, s - 2); break;
    case 'gold':
      c.fillStyle = g('#fff3a0', '#d4a017'); c.fillRect(x, y, s, s);
      c.strokeStyle = '#8a6500'; c.strokeRect(x + 1, y + 1, s - 2, s - 2);
      c.strokeStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.moveTo(x + s * .2, y + s * .75); c.lineTo(x + s * .75, y + s * .2); c.stroke(); break;
    case 'candy':
      c.fillStyle = '#ff7aa8'; c.fillRect(x, y, s, s);
      c.save(); c.beginPath(); c.rect(x, y, s, s); c.clip();
      c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = s * .14;
      for (let k = -s; k < s * 2; k += s * .4) { c.beginPath(); c.moveTo(x + k, y + s); c.lineTo(x + k + s, y); c.stroke(); }
      c.restore();
      c.strokeStyle = '#fff'; c.strokeRect(x + 1, y + 1, s - 2, s - 2); break;
    default:
      c.fillStyle = '#05050a'; c.fillRect(x, y, s, s);
      c.strokeStyle = '#fff'; c.strokeRect(x + 1, y + 1, s - 2, s - 2);
      c.strokeStyle = alpha(col, .7); c.lineWidth = 1.5; c.strokeRect(x + s * .22, y + s * .22, s * .56, s * .56);
  }
  c.restore();
}

function spikePath(c, s) { c.beginPath(); c.moveTo(-s / 2, s / 2); c.lineTo(0, -s / 2); c.lineTo(s / 2, s / 2); c.closePath(); }
function drawSpike(c, st, x, y, s, r, col) {
  c.save(); c.translate(x + s / 2, y + s / 2); c.rotate(r * Math.PI / 180); c.lineWidth = 2; c.lineJoin = 'round';
  switch (st) {
    case 'neon': spikePath(c, s); c.fillStyle = alpha(col, .18); c.fill(); c.strokeStyle = col; glow(c, col); c.stroke(); break;
    case 'crystal': {
      const gr = c.createLinearGradient(0, -s / 2, 0, s / 2); gr.addColorStop(0, '#fff'); gr.addColorStop(1, col);
      spikePath(c, s); c.fillStyle = gr; c.fill(); c.strokeStyle = '#fff'; c.stroke();
      c.beginPath(); c.moveTo(0, -s / 2); c.lineTo(0, s / 2); c.strokeStyle = 'rgba(255,255,255,.6)'; c.stroke(); break;
    }
    case 'fire': {
      const gr = c.createLinearGradient(0, -s / 2, 0, s / 2); gr.addColorStop(0, '#ffe14a'); gr.addColorStop(1, '#d6200a');
      spikePath(c, s); c.fillStyle = gr; c.fill(); c.strokeStyle = '#7a0f00'; c.stroke();
      c.beginPath(); c.moveTo(-s * .18, s / 2); c.lineTo(0, 0); c.lineTo(s * .18, s / 2); c.fillStyle = 'rgba(255,240,150,.8)'; c.fill(); break;
    }
    case 'ice': spikePath(c, s); c.fillStyle = '#bff0ff'; c.fill(); c.strokeStyle = '#fff'; c.stroke();
      c.beginPath(); c.moveTo(0, -s / 2); c.lineTo(-s * .12, s / 2); c.lineTo(s * .12, s / 2); c.fillStyle = 'rgba(255,255,255,.7)'; c.fill(); break;
    case 'thorn':
      spikePath(c, s); c.fillStyle = '#2f8a3a'; c.fill(); c.strokeStyle = '#14451b'; c.stroke();
      c.fillStyle = '#2f8a3a';
      c.beginPath(); c.moveTo(-s * .2, s * .1); c.lineTo(-s * .45, 0); c.lineTo(-s * .3, s * .3); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(s * .2, s * .1); c.lineTo(s * .45, 0); c.lineTo(s * .3, s * .3); c.fill(); c.stroke(); break;
    case 'bone': spikePath(c, s); c.fillStyle = '#f2ead8'; c.fill(); c.strokeStyle = '#8a8470'; c.stroke(); break;
    default: spikePath(c, s); c.fillStyle = '#000'; c.fill(); c.strokeStyle = '#fff'; c.stroke();
  }
  c.restore();
}

function drawSaw(c, st, cx, cy, r, col, ang = 0) {
  c.save(); c.translate(cx, cy); c.rotate(ang); c.lineWidth = 2; c.lineJoin = 'round';
  const n = st === 'star' ? 8 : 12, inner = st === 'star' ? .45 : .72;
  c.beginPath();
  for (let i = 0; i < n * 2; i++) { const a = i * Math.PI / n, rr = i % 2 ? r * inner : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  c.closePath();
  if (st === 'neon') { c.fillStyle = alpha(col, .12); c.fill(); c.strokeStyle = col; glow(c, col); c.stroke(); c.beginPath(); c.arc(0, 0, r * .3, 0, 7); c.stroke(); }
  else if (st === 'gear') { c.fillStyle = '#9aa4b0'; c.fill(); c.strokeStyle = '#3c4350'; c.stroke(); c.beginPath(); c.arc(0, 0, r * .28, 0, 7); c.fillStyle = '#3c4350'; c.fill(); }
  else if (st === 'star') { c.fillStyle = col; c.fill(); c.strokeStyle = '#fff'; c.stroke(); c.beginPath(); c.arc(0, 0, r * .2, 0, 7); c.fillStyle = '#fff'; c.fill(); }
  else { c.fillStyle = '#000'; c.fill(); c.strokeStyle = '#fff'; c.stroke(); c.beginPath(); c.arc(0, 0, r * .3, 0, 7); c.stroke(); }
  c.restore();
}

function starPath(c, r) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); }
function drawOrb(c, st, x, y, s, col) {
  const cx = x + s / 2, cy = y + s / 2;
  c.save(); c.lineWidth = 3;
  if (st === 'ring') { c.strokeStyle = col; glow(c, col); c.beginPath(); c.arc(cx, cy, s * .36, 0, 7); c.stroke(); c.beginPath(); c.arc(cx, cy, s * .12, 0, 7); c.fillStyle = col; c.fill(); }
  else if (st === 'star') { c.translate(cx, cy); starPath(c, s * .42); c.fillStyle = '#ffd400'; c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 2; c.stroke(); }
  else { c.beginPath(); c.arc(cx, cy, s * .34, 0, 7); c.fillStyle = 'rgba(255,212,0,.35)'; c.fill(); c.strokeStyle = '#ffd400'; c.stroke(); c.beginPath(); c.arc(cx, cy, s * .14, 0, 7); c.fillStyle = '#ffd400'; c.fill(); }
  c.restore();
}
function drawPad(c, st, x, y, s, col) {
  c.save();
  const px = x + s * .1, py = y + s * .74, pw = s * .8, ph = s * .26;
  if (st === 'ring') { c.fillStyle = col; glow(c, col); c.beginPath(); c.roundRect(px, py, pw, ph, ph / 2); c.fill(); }
  else { c.fillStyle = '#ffd400'; c.beginPath(); c.roundRect(px, py, pw, ph, 3); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.stroke(); }
  if (st === 'star') { c.translate(x + s / 2, y + s * .5); starPath(c, s * .18); c.fillStyle = '#fff'; c.fill(); }
  c.restore();
}
function drawPortal(c, x, y, s, mode) {
  const cx = x + s / 2, cy = y + s / 2, col = mode === 'ship' ? '#ff4ad1' : '#3cff7a';
  c.save(); c.lineWidth = 4; c.strokeStyle = col; c.fillStyle = alpha(col, .22); glow(c, col, 10);
  c.beginPath(); c.ellipse(cx, cy, s * .38, s * 1.5, 0, 0, 7); c.fill(); c.stroke(); c.restore();
}

function drawBg(c, key, extra, x0, x1, H, gy, color) {
  const [a, b] = BG[key] || BG.blue;
  const gr = c.createLinearGradient(0, 0, 0, gy); gr.addColorStop(0, a); gr.addColorStop(1, b);
  c.fillStyle = gr; c.fillRect(x0, 0, x1 - x0, H);
  c.save(); c.beginPath(); c.rect(x0, 0, x1 - x0, gy); c.clip();
  const n = Math.ceil((x1 - x0) / 38) + 2, i0 = Math.floor(x0 / 38);
  for (let k = i0; k < i0 + n; k++) {
    const rx = (k * 7919 % 1000) / 1000, ry = (k * 104729 % 1000) / 1000, rs = (k * 31 % 100) / 100;
    const x = k * 38 + rx * 30, y = ry * (gy - 10);
    if (extra === 'stars') { c.fillStyle = `rgba(255,255,255,${.4 + rs * .6})`; c.beginPath(); c.arc(x, y, .8 + rs * 1.8, 0, 7); c.fill(); }
    else if (extra === 'squares') { const q = 14 + rs * 40; c.fillStyle = alpha(color, .08 + rs * .08); c.fillRect(x, y, q, q); }
    else if (extra === 'bubbles') { c.strokeStyle = 'rgba(255,255,255,.28)'; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, 5 + rs * 16, 0, 7); c.stroke(); }
    else if (extra === 'lines') { c.fillStyle = alpha(color, .1 + rs * .08); c.fillRect(x, 0, 2 + rs * 3, gy); }
  }
  c.restore();
}
function drawGround(c, st, x0, x1, H, gy, s, color) {
  c.save(); c.beginPath(); c.rect(x0, gy, x1 - x0, H - gy); c.clip();
  const fill = (a, b) => { const g = c.createLinearGradient(0, gy, 0, H); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g; c.fillRect(x0, gy, x1 - x0, H - gy); };
  const top = (col, w = 3) => { c.fillStyle = col; c.fillRect(x0, gy, x1 - x0, w); };
  const start = Math.floor(x0 / 12) * 12;
  switch (st) {
    case 'grass': fill('#6b4423', '#3a2410'); top('#37c24a', 9); c.fillStyle = '#37c24a';
      for (let x = start; x < x1; x += 12) { c.beginPath(); c.moveTo(x, gy); c.lineTo(x + 3, gy - 6); c.lineTo(x + 6, gy); c.fill(); } break;
    case 'stone': fill('#5a606c', '#2c3038'); top('#aab', 3); c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 1.5;
      for (let y = gy + s * .7; y < H; y += s * .7) { c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); }
      for (let x = Math.floor(x0 / s) * s; x < x1; x += s) for (let r = 0; r * s * .7 + gy < H; r++) { c.beginPath(); c.moveTo(x + (r % 2) * s / 2, gy + r * s * .7); c.lineTo(x + (r % 2) * s / 2, gy + (r + 1) * s * .7); c.stroke(); } break;
    case 'lava': fill('#ff6a00', '#6a0800'); c.fillStyle = '#ffe14a'; c.beginPath(); c.moveTo(x0, gy + 6);
      for (let x = x0; x <= x1; x += 4) c.lineTo(x, gy + 3 + Math.sin(x / 9) * 3); c.lineTo(x1, gy - 2); c.lineTo(x0, gy - 2); c.fill(); break;
    case 'neon': fill('#07071e', '#02020a'); top(color, 3); c.strokeStyle = alpha(color, .35); c.lineWidth = 1;
      for (let x = Math.floor(x0 / s) * s; x < x1; x += s) { c.beginPath(); c.moveTo(x, gy); c.lineTo(x, H); c.stroke(); }
      for (let y = gy + s * .5; y < H; y += s * .5) { c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); }
      c.shadowColor = color; c.shadowBlur = 10; top(color, 2); break;
    case 'snow': fill('#8fc4ee', '#3f6c9e'); top('#fff', 9); c.fillStyle = '#fff';
      for (let x = start; x < x1; x += 12) { c.beginPath(); c.arc(x + 6, gy + 9, 6, 0, Math.PI); c.fill(); } break;
    default: fill('#0a0a1c', '#02020a'); c.shadowColor = color; c.shadowBlur = 10; top(color, 3);
  }
  c.restore();
}

/* rysuje cały level; opts.sel — podświetlenie kawałka, opts.labels — etykiety kawałków */
function renderLevel(cv, s, opts = {}) {
  const L = buildLayout(state.items);
  const gh = Math.round(s * 2.2), H = ROWS * s + gh, gy = ROWS * s;
  cv.width = Math.max(L.total * s, 600); cv.height = H;
  const c = cv.getContext('2d');
  // tło + podłoże dla każdego kawałka
  L.secs.forEach((sec, i) => {
    const p = opts.preset ? opts.preset(i) : presetFor(i);
    const x0 = i === 0 ? 0 : sec.from * s, x1 = i === L.secs.length - 1 ? cv.width : sec.to * s;
    c.save(); c.beginPath(); c.rect(x0, 0, x1 - x0, H); c.clip();
    drawBg(c, p.bg, p.extra, x0, x1, H, gy, p.color);
    drawGround(c, p.ground, x0, x1, H, gy, s, p.color);
    c.restore();
  });
  if (!state.items.length) { c.fillStyle = 'rgba(255,255,255,.55)'; c.font = '600 18px Segoe UI'; c.fillText('Dodaj struktury z panelu po lewej…', 20, gy / 2); }
  // obiekty: najpierw bloki/portale, potem reszta
  const order = { block: 0, portal: 1, pad: 2, orb: 2, saw: 3, spike: 4 };
  const sorted = [...L.objs].sort((a, b) => order[a.t] - order[b.t]);
  sorted.forEach(o => {
    const p = opts.preset ? opts.preset(o.sec) : presetFor(o.sec);
    const x = o.x * s, y = gy - (o.y + 1) * s;
    if (o.t === 'block') drawBlock(c, p.block, x, y, s, p.color);
    else if (o.t === 'spike') drawSpike(c, p.spike, x, y, s, o.r, p.color);
    else if (o.t === 'saw') drawSaw(c, p.saw, x + s / 2, y + s / 2, s * .85, p.color, o.x * .7);
    else if (o.t === 'orb') drawOrb(c, p.orb, x, y, s, p.color);
    else if (o.t === 'pad') drawPad(c, p.orb, x, y, s, p.color);
    else if (o.t === 'portal') drawPortal(c, x, y, s, o.m);
  });
  // start / meta
  c.fillStyle = 'rgba(255,255,255,.7)'; c.font = '700 12px Segoe UI';
  c.fillText('START', 8, gy - 8);
  // granice kawałków
  if (opts.sections) {
    L.secs.forEach((sec, i) => {
      const x0 = sec.from * s, x1 = sec.to * s;
      if (i > 0) { c.save(); c.setLineDash([6, 5]); c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, 0); c.lineTo(x0, H); c.stroke(); c.restore(); }
      const sx0 = i === 0 ? 0 : x0, sx1 = i === L.secs.length - 1 ? cv.width : x1;
      const col = SEC_COLORS[i % SEC_COLORS.length];
      c.fillStyle = col; c.fillRect(sx0, 0, sx1 - sx0, 22);
      c.fillStyle = '#04223a'; c.font = '700 13px Segoe UI'; c.fillText('Kawałek ' + (i + 1), sx0 + 8, 16);
      if (opts.sel === i) { c.strokeStyle = col; c.lineWidth = 4; c.strokeRect(sx0 + 2, 2, sx1 - sx0 - 4, H - 4); c.fillStyle = alpha(col, .08); c.fillRect(sx0, 22, sx1 - sx0, H - 22); }
    });
  }
  return L;
}

/* miniatury */
function thumbStruct(cv, st) {
  const cells = Math.max(st.w, 6), s = 10, W = cells * s, H = 12 * s;
  cv.width = 96; cv.height = 64;
  const c = cv.getContext('2d'), k = Math.min(96 / W, 64 / H), gy = 11 * s;
  c.fillStyle = '#1e3c9e'; c.fillRect(0, 0, 96, 64);
  c.save(); c.scale(k, k);
  const dx = (96 / k - W) / 2;
  c.fillStyle = '#0a0a1c'; c.fillRect(0, gy, 96 / k, 40);
  c.fillStyle = '#38d6ff'; c.fillRect(0, gy, 96 / k, 2);
  st.o.forEach(o => {
    const x = dx + o.x * s, y = gy - (o.y + 1) * s;
    if (o.t === 'block') drawBlock(c, 'classic', x, y, s, '#38d6ff');
    else if (o.t === 'spike') drawSpike(c, 'classic', x, y, s, o.r, '#38d6ff');
    else if (o.t === 'saw') drawSaw(c, 'classic', x + s / 2, y + s / 2, s * .85, '#38d6ff');
    else if (o.t === 'orb') drawOrb(c, 'classic', x, y, s, '#38d6ff');
    else if (o.t === 'pad') drawPad(c, 'classic', x, y, s, '#38d6ff');
    else if (o.t === 'portal') drawPortal(c, x, y, s, o.m);
  });
  c.restore();
}
function thumbOption(cv, key, val, color) {
  cv.width = 56; cv.height = 40;
  const c = cv.getContext('2d'); c.fillStyle = '#16205e'; c.fillRect(0, 0, 56, 40);
  const s = 24, x = 16, y = 8;
  if (key === 'block') drawBlock(c, val, x, y, s, color);
  else if (key === 'spike') drawSpike(c, val, x, y, s, 0, color);
  else if (key === 'saw') drawSaw(c, val, 28, 20, 17, color);
  else if (key === 'orb') { drawOrb(c, val, 4, 6, 28, color); drawPad(c, val, 28, 6, 24, color); }
  else if (key === 'ground') drawGround(c, val, 0, 56, 40, 14, 14, color);
  else if (key === 'bg') drawBg(c, val, 'none', 0, 56, 40, 40, color);
  else if (key === 'extra') { drawBg(c, 'blue', val, 0, 56, 40, 40, color); }
}

/* ---------- UI: krok 1 ---------- */
const h = (tag, props = {}, ...kids) => { const e = document.createElement(tag); Object.assign(e, props); kids.forEach(k => e.append(k)); return e; };

function buildPalette() {
  const tabs = $('catTabs'); tabs.innerHTML = '';
  CATS.forEach(([k, n]) => { const b = h('button', { textContent: n, className: k === cat ? 'active' : '' }); b.onclick = () => { cat = k; buildPalette(); }; tabs.append(b); });
  const cards = $('cards'); cards.innerHTML = '';
  STRUCTS.filter(s => cat === 'all' || s.cat === cat).forEach(st => {
    const cv = h('canvas'); thumbStruct(cv, st);
    const b = h('button', { className: 'card', title: 'Dodaj do levelu' }, cv, st.name);
    b.onclick = () => { state.items.push({ sid: st.id, cut: false }); changed(); $('prev1').scrollLeft = 1e6; };
    cards.append(b);
  });
}
function renderTimeline() {
  const tl = $('timeline'); tl.innerHTML = '';
  if (!state.items.length) { tl.append(h('span', { className: 'empty', textContent: 'Pusto — dodaj pierwszą strukturę albo kliknij „Losuj”.' })); return; }
  let si = 0;
  state.items.forEach((it, i) => {
    const st = SBY[it.sid], cv = h('canvas'); thumbStruct(cv, st);
    const mk = (t, f, cls = '') => { const b = h('button', { textContent: t, className: cls }); b.onclick = f; return b; };
    const ctl = h('div', { className: 'ctl' },
      mk('◀', () => move(i, -1)), mk('✕', () => { state.items.splice(i, 1); changed(); }, 'x'), mk('▶', () => move(i, 1)));
    const chip = h('div', { className: 'chip' }, cv, st.name, ctl);
    chip.style.borderBottomColor = SEC_COLORS[si % SEC_COLORS.length];
    tl.append(chip);
    if (i < state.items.length - 1) {
      const cut = h('button', { className: 'cut' + (it.cut ? ' on' : ''), textContent: '✂', title: 'Koniec kawałka' });
      cut.onclick = () => { it.cut = !it.cut; changed(); };
      tl.append(cut);
    }
    if (it.cut) si++;
  });
}
function move(i, d) { const j = i + d; if (j < 0 || j >= state.items.length) return; [state.items[i], state.items[j]] = [state.items[j], state.items[i]]; changed(); }
function randomLevel() {
  const pick = a => a[Math.floor(Math.random() * a.length)], items = [];
  const n = 10 + Math.floor(Math.random() * 6);
  while (items.length < n) {
    if (Math.random() < .15) {
      items.push({ sid: 'shipin' }); for (let k = 0; k < 2 + Math.floor(Math.random() * 2); k++) items.push({ sid: pick(SHIP_POOL) }); items.push({ sid: 'shipout' });
    } else { items.push({ sid: pick(CUBE_POOL) }); if (Math.random() < .3) items.push({ sid: 'flat' }); }
  }
  state.items = items.map(i => ({ ...i, cut: false }));
  changed();
}

/* ---------- UI: krok 2 ---------- */
function secCount() { return buildLayout(state.items).secs.length; }
function curPreset() { return state.scope === 'whole' ? state.deco.global : (state.deco.sections[state.sel] || state.deco.global); }
function editPreset(k, v) {
  if (state.scope === 'whole') state.deco.global[k] = v;
  else { if (!state.deco.sections[state.sel]) state.deco.sections[state.sel] = { ...state.deco.global }; state.deco.sections[state.sel][k] = v; }
  changed(false);
}
function renderStep2() {
  const n = secCount();
  if (state.sel >= n) state.sel = 0;
  $('secBox').hidden = state.scope !== 'sections';
  document.querySelectorAll('#scopeSeg button').forEach(b => b.classList.toggle('active', b.dataset.scope === state.scope));
  if (state.scope === 'sections') {
    const list = $('secList'); list.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const b = h('button', { textContent: 'Kawałek ' + (i + 1), className: i === state.sel ? 'active' : '' });
      b.style.borderBottomColor = SEC_COLORS[i % SEC_COLORS.length];
      b.onclick = () => { state.sel = i; renderStep2(); }; list.append(b);
    }
    const own = !!state.deco.sections[state.sel];
    $('secInfo').textContent = n === 1 ? 'Masz tylko 1 kawałek — wróć do kroku 1 i zaznacz ✂ między strukturami.' : own ? 'Ten kawałek ma własny styl.' : 'Ten kawałek używa stylu całego levelu — zmień dowolną opcję, aby dać mu własny.';
    $('btnInherit').hidden = !own;
  }
  const p = curPreset(), box = $('options'); box.innerHTML = '';
  Object.entries(OPTIONS).forEach(([key, def]) => {
    const g = h('div', { className: 'optgroup' }, h('h3', { textContent: def.label }));
    const o = h('div', { className: 'opts' });
    def.list.forEach(([val, name]) => {
      const cv = h('canvas'); thumbOption(cv, key, val, p.color);
      const b = h('button', { className: 'opt' + (p[key] === val ? ' sel' : ''), title: name }, cv, name);
      b.onclick = () => { editPreset(key, val); renderStep2(); }; o.append(b);
    });
    g.append(o); box.append(g);
  });
  const g = h('div', { className: 'optgroup' }, h('h3', { textContent: 'Kolor akcentu' }));
  const r = h('div', { className: 'colorrow' });
  COLORS.forEach(c => { const sw = h('div', { className: 'sw' + (p.color === c ? ' sel' : '') }); sw.style.background = c; sw.onclick = () => { editPreset('color', c); renderStep2(); }; r.append(sw); });
  const ci = h('input', { type: 'color', value: p.color }); ci.onchange = () => { editPreset('color', ci.value); renderStep2(); }; r.append(ci);
  g.append(r); box.append(g);
  drawPreviews();
  $('hint2').textContent = state.scope === 'sections' ? 'Kliknij kawałek na podglądzie, aby go wybrać.' : 'Wybrany styl dotyczy całego levelu.';
  $('prevInfo').textContent = n + (n === 1 ? ' kawałek' : n < 5 ? ' kawałki' : ' kawałków');
}

/* ---------- UI: krok 3 ---------- */
function stats() {
  const L = buildLayout(state.items), c = { block: 0, spike: 0, saw: 0, orb: 0, pad: 0, portal: 0 };
  L.objs.forEach(o => c[o.t]++);
  return { L, c, len: L.total * 30 };
}
function renderStep3() {
  const m = state.meta;
  $('fName').value = m.name; $('fAuthor').value = m.author; $('fSong').value = m.song; $('fCustom').value = m.custom; $('fDiff').value = m.diff; $('fDesc').value = m.desc;
  $('customSongRow').hidden = m.song !== 'custom';
  drawPreviews();
  const { L, c } = stats(), sec = L.secs.length;
  const sum = $('summary'); sum.innerHTML = '';
  [['Długość', Math.round(L.total / 10.4) + ' s (ok.)'], ['Struktury', state.items.length], ['Kawałki', state.scope === 'sections' ? sec : 'cały level'],
  ['Bloki', c.block], ['Kolce', c.spike], ['Piły / orby / pady', c.saw + c.orb + c.pad]].forEach(([k, v]) => sum.append(h('div', { innerHTML: `${k}<b>${v}</b>` })));
  $('btnDownload').disabled = $('btnGmd').disabled = !state.items.length;
  $('dlHint').textContent = state.items.length ? '' : 'Najpierw zbuduj gameplay w kroku 1.';
}
function bindForm() {
  const f = (id, k, fn = v => v) => $(id).addEventListener('input', () => { state.meta[k] = fn($(id).value); if (k === 'song') $('customSongRow').hidden = state.meta.song !== 'custom'; save(); });
  SONGS.forEach((n, i) => $('fSong').append(h('option', { value: i, textContent: n })));
  $('fSong').append(h('option', { value: 'custom', textContent: 'Własna (ID z Newgrounds)…' }));
  f('fName', 'name'); f('fAuthor', 'author'); f('fSong', 'song', v => v === 'custom' ? v : +v); f('fCustom', 'custom'); f('fDiff', 'diff'); f('fDesc', 'desc');
}

/* ---------- eksport / import ---------- */
function buildExport() {
  const L = buildLayout(state.items), m = state.meta;
  const objects = L.objs.map(o => {
    const p = presetFor(o.sec);
    const key = o.t === 'portal' ? 'portal' + o.m : o.t;
    const deco = o.t === 'portal' ? null : p[o.t === 'pad' ? 'orb' : o.t];
    return { type: o.t, gdId: GD_ID[key], x: 375 + o.x * 30, y: 15 + o.y * 30, rot: o.r || 0, section: o.sec, style: deco, color: p.color };
  });
  const levelString = 'kS38,1_40_2_125_3_255_11_255_12_255_13_255_4_-1_6_1000_7_1_15_1_18_0_8_1|1_0_2_102_3_255_11_255_12_255_13_255_4_-1_6_1001_7_1_15_1_18_0_8_1|;kA13,0;kA15,0;kA16,0;kA14,;kA6,0;kA7,0;kA17,0;kA18,0;kS39,0;kA2,0;kA3,0;kA8,0;kA4,0;kA9,0;kA10,0;kA11,0;;'
    + objects.map(o => `1,${o.gdId},2,${o.x},3,${o.y}` + (o.rot ? `,6,${o.rot}` : '') + ';').join('');
  const song = m.song === 'custom' ? { custom: m.custom } : { id: m.song, name: SONGS[m.song] };
  return {
    format: 'gdlvl', version: 1, generator: 'GD Generator',
    name: m.name || 'Bez nazwy', author: m.author || 'Anonim', description: m.desc, difficulty: m.diff, song,
    length: L.total, sections: L.secs.map((s, i) => ({ from: s.from, to: s.to, preset: presetFor(i) })),
    objects, levelString,
    editor: { items: state.items, scope: state.scope, deco: state.deco },
  };
}
async function gzipB64(str) {
  if (!window.CompressionStream) return null;
  const cs = new CompressionStream('gzip'), w = cs.writable.getWriter(); w.write(new TextEncoder().encode(str)); w.close();
  const buf = new Uint8Array(await new Response(cs.readable).arrayBuffer());
  let bin = ''; buf.forEach(b => bin += String.fromCharCode(b));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_');
}
const xe = t => String(t).replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
const b64u = t => btoa(String.fromCharCode(...new TextEncoder().encode(t))).replace(/\+/g, '-').replace(/\//g, '_');
async function buildGmd() {
  const d = buildExport(), gz = await gzipB64(d.levelString);
  const song = d.song.custom !== undefined ? `<k>k45</k><i>${+d.song.custom || 0}</i>` : `<k>k8</k><i>${d.song.id}</i>`;
  const diff = { auto: 0, easy: 1, normal: 2, hard: 3, harder: 4, insane: 5, demon: 6 }[d.difficulty] || 0;
  const editor = b64u(JSON.stringify({ name: d.name, author: d.author, description: d.description, difficulty: d.difficulty, song: d.song, editor: d.editor }));
  return { d, xml: `<?xml version="1.0"?><plist version="1.0" gjver="2.0"><dict><k>kCEK</k><i>4</i><k>k2</k><s>${xe(d.name)}</s><k>k3</k><s>${b64u(d.description || '')}</s><k>k4</k><s>${gz}</s><k>k5</k><s>${xe(d.author)}</s>${song}<k>k13</k><t/><k>k21</k><i>2</i><k>k16</k><i>1</i><k>k80</k><i>0</i><k>k50</k><i>35</i><k>k47</k><t/><k>k42</k><i>0</i><k>k11</k><i>0</i><k>k36</k><i>0</i><k>k23</k><i>${diff}</i></dict></plist><!--GDGEN:${editor}-->` };
}
async function download(ext) {
  const { d, xml } = await buildGmd();
  const blob = new Blob([xml], { type: 'application/xml' });
  const slug = (d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) || 'level';
  const a = h('a', { href: URL.createObjectURL(blob), download: slug + ext });
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  $('dlHint').textContent = 'Pobrano ' + slug + ext;
}
function importFile(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      let d;
      const m = /<!--GDGEN:([\w-]+)-->/.exec(r.result);
      if (m) { const bin = atob(m[1].replace(/-/g, '+').replace(/_/g, '/')); d = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)))); }
      else d = JSON.parse(r.result);
      if (!d.editor) throw new Error('brak danych edytora');
      state = { ...DEFAULT_STATE(), step: 3, items: d.editor.items, scope: d.editor.scope, deco: d.editor.deco,
        meta: { ...DEFAULT_STATE().meta, name: d.name, author: d.author, desc: d.description || '', diff: d.difficulty || 'normal', song: d.song && d.song.custom !== undefined ? 'custom' : (d.song ? d.song.id : 0), custom: d.song && d.song.custom || '' } };
      go(3);
    } catch (e) { alert('Nie udało się wczytać pliku: ' + e.message); }
  };
  r.readAsText(file);
}

/* ---------- nawigacja / podgląd ---------- */
function drawPreviews() {
  const cell = 26;
  if (state.step === 1) renderLevel($('cv1'), cell, { preset: () => ({ ...DEFAULT_PRESET }) });
  if (state.step === 2) {
    const opts = state.scope === 'sections' ? { sections: true, sel: state.sel } : {};
    const L = renderLevel($('cv2'), cell, opts); $('cv2').L = L;
  }
  if (state.step === 3) renderLevel($('cv3'), cell, {});
  const { L, c } = stats(); $('stats').textContent = state.items.length + ' struktur · ' + L.total + ' bloków długości';
}
function changed(rebuild = true) {
  if (rebuild) { renderTimeline(); if (state.step === 2) renderStep2(); }
  drawPreviews(); save();
}
function go(n) {
  state.step = n;
  document.querySelectorAll('.step').forEach((s, i) => s.classList.toggle('active', i + 1 === n));
  document.querySelectorAll('#stepper button').forEach((b, i) => { b.classList.toggle('active', i + 1 === n); b.classList.toggle('done', i + 1 < n); });
  $('btnBack').style.visibility = n === 1 ? 'hidden' : 'visible';
  $('btnNext').style.display = n === 3 ? 'none' : '';
  if (n === 1) { renderTimeline(); drawPreviews(); }
  if (n === 2) renderStep2();
  if (n === 3) renderStep3();
  window.scrollTo(0, 0); save();
}
let playTimer = null;
function togglePlay(id) {
  if (playTimer) { clearInterval(playTimer); playTimer = null; document.querySelectorAll('[id^=btnPlay]').forEach(b => b.textContent = '▶ Podgląd'); return; }
  const box = $(id); box.scrollLeft = 0;
  document.querySelectorAll('[id^=btnPlay]').forEach(b => b.textContent = '⏸ Stop');
  playTimer = setInterval(() => {
    box.scrollLeft += 6;
    if (box.scrollLeft + box.clientWidth >= box.scrollWidth - 1) togglePlay(id);
  }, 16);
}

function init() {
  load(); bindForm(); buildPalette();
  document.querySelectorAll('#stepper button').forEach(b => b.onclick = () => go(+b.dataset.step));
  $('btnBack').onclick = () => go(state.step - 1);
  $('btnNext').onclick = () => go(state.step + 1);
  $('btnRandom').onclick = randomLevel;
  $('btnClear').onclick = () => { if (!state.items.length || confirm('Wyczyścić cały level?')) { state.items = []; state.deco.sections = []; changed(); } };
  $('btnPlay').onclick = () => togglePlay('prev1');
  $('btnPlay2').onclick = () => togglePlay('prev2');
  $('btnPlay3').onclick = () => togglePlay('prev3');
  document.querySelectorAll('#scopeSeg button').forEach(b => b.onclick = () => { state.scope = b.dataset.scope; renderStep2(); save(); });
  $('btnInherit').onclick = () => { state.deco.sections[state.sel] = null; renderStep2(); save(); };
  $('cv2').addEventListener('click', e => {
    if (state.scope !== 'sections' || !$('cv2').L) return;
    const r = $('cv2').getBoundingClientRect(), x = (e.clientX - r.left) * ($('cv2').width / r.width) / 26;
    const i = $('cv2').L.secs.findIndex(s => x >= s.from && x < s.to);
    if (i >= 0) { state.sel = i; renderStep2(); }
  });
  $('btnDownload').onclick = () => download('.gdlvl');
  $('btnGmd').onclick = () => download('.gmd');
  $('btnLoad').onclick = () => $('fileLoad').click();
  $('fileLoad').onchange = e => { if (e.target.files[0]) importFile(e.target.files[0]); e.target.value = ''; };
  go(state.step || 1);
}
init();
