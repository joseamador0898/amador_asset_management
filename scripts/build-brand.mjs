// Builds the Amador logo kit: outlined SVGs and exact-size PNGs for the web,
// Stripe branding and Google Ads. Usage: npm run brand
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import opentype from "opentype.js";
import { Resvg } from "@resvg/resvg-js";

const require = createRequire(import.meta.url);
const root = process.cwd();
const OUT_SVG = path.join(root, "public", "brand");
const OUT_PNG = path.join(root, "public", "brand", "png");
fs.mkdirSync(OUT_PNG, { recursive: true });

const C = { ink: "#0A0E16", ivory: "#F7F5F0", brass: "#A8834A", brassLight: "#C9A96E", sea: "#0F3B47", white: "#FFFFFF", black: "#000000" };

const loadFont = (pkg, file) => {
  const p = require.resolve(`${pkg}/files/${file}`);
  const buf = fs.readFileSync(p);
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const serif = loadFont("@fontsource/newsreader", "newsreader-latin-500-normal.woff");
const serifRegular = loadFont("@fontsource/newsreader", "newsreader-latin-400-normal.woff");
const serifItalic = loadFont("@fontsource/newsreader", "newsreader-latin-300-italic.woff");
const sans = loadFont("@fontsource/inter", "inter-latin-600-normal.woff");

/**
 * A glyph's outline in SVG path syntax, transformed from font units (y up) to
 * SVG space. Reads the raw commands instead of glyph.getPath(), which corrupts
 * coordinates for some TrueType glyphs in opentype.js 2.0.
 */
function outline(glyph, x, baseline, scale) {
  const f = (n) => (Math.round(n * 100) / 100).toString();
  const X = (v) => f(x + v * scale);
  const Y = (v) => f(baseline - v * scale);
  let d = "";
  for (const c of glyph.path.commands) {
    if (c.type === "M") d += `M${X(c.x)} ${Y(c.y)}`;
    else if (c.type === "L") d += `L${X(c.x)} ${Y(c.y)}`;
    else if (c.type === "Q") d += `Q${X(c.x1)} ${Y(c.y1)} ${X(c.x)} ${Y(c.y)}`;
    else if (c.type === "C") d += `C${X(c.x1)} ${Y(c.y1)} ${X(c.x2)} ${Y(c.y2)} ${X(c.x)} ${Y(c.y)}`;
    else if (c.type === "Z") d += "Z";
  }
  return d;
}

/** Lays out text glyph by glyph with tracking (em) and kerning; returns path data and metrics. */
function textPath(font, text, size, trackingEm, x = 0, baseline = 0) {
  const scale = size / font.unitsPerEm;
  let cursor = x;
  let d = "";
  // Map characters directly (no GSUB shaping needed for Latin caps and words).
  const glyphs = Array.from(text, (ch) => font.charToGlyph(ch));
  glyphs.forEach((g, i) => {
    d += outline(g, cursor, baseline, scale);
    cursor += g.advanceWidth * scale;
    if (i < glyphs.length - 1) {
      let kern = 0;
      try {
        kern = font.getKerningValue(g, glyphs[i + 1]);
      } catch {
        kern = 0;
      }
      cursor += (Number.isFinite(kern) ? kern : 0) * scale + trackingEm * size;
    }
  });
  const capHeight = (font.tables.os2?.sCapHeight || font.unitsPerEm * 0.7) * scale;
  return { d, width: cursor - x, capHeight };
}

// The monogram, drawn on a 64-unit grid: an A whose crossbar is a brass horizon.
const MARK_A = "M32 7L47.75 38.5L35.75 38.5L32 31L28.25 38.5L16.25 38.5ZM11.75 47.5L23.75 47.5L19 57L7 57ZM40.25 47.5L52.25 47.5L57 57L45 57Z";
const mark = (x, y, s, fg, bar, barH = 4) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="${MARK_A}" fill="${fg}"/><rect x="2" y="${43 - barH / 2}" width="60" height="${barH}" fill="${bar}"/></g>`;

const svg = (w, h, body, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ""}${body}</svg>\n`;

/** Horizontal lockup: mark + AMADOR over ASSET MANAGEMENT. Returns { body, w, h }. */
function horizontal(fg, bar, sub) {
  const markSize = 120; // mark box (64 units * 1.875)
  const s = markSize / 64;
  const word = textPath(serif, "AMADOR", 86, 0.2);
  const subT = textPath(sans, "ASSET MANAGEMENT", 18.5, 0.42);
  const gap = 34;
  const textX = markSize + gap;
  const blockH = word.capHeight + 20 + subT.capHeight;
  const top = (markSize - blockH) / 2;
  const w1 = textPath(serif, "AMADOR", 86, 0.2, textX, top + word.capHeight);
  // Optically align the subtitle under the wordmark's full width.
  const subScaleTrack = 0.42 + (word.width - subT.width) / (18.5 * ("ASSET MANAGEMENT".length - 1));
  const s1 = textPath(sans, "ASSET MANAGEMENT", 18.5, subScaleTrack, textX + 2, top + word.capHeight + 20 + subT.capHeight);
  const w = Math.ceil(textX + Math.max(w1.width, s1.width) + 4);
  return { body: `${mark(0, 0, s, fg, bar)}<path d="${w1.d}" fill="${fg}"/><path d="${s1.d}" fill="${sub}"/>`, w, h: markSize };
}

/** Stacked lockup: mark above AMADOR above ASSET MANAGEMENT. */
function stacked(fg, bar, sub) {
  const word = textPath(serif, "AMADOR", 86, 0.2);
  const subTrack = 0.42 + (word.width - textPath(sans, "ASSET MANAGEMENT", 18.5, 0.42).width) / (18.5 * 15);
  const subT = textPath(sans, "ASSET MANAGEMENT", 18.5, subTrack);
  const w = Math.ceil(Math.max(word.width, subT.width) + 8);
  const markSize = 150;
  const mx = (w - markSize) / 2;
  const wordTop = markSize + 34;
  const w1 = textPath(serif, "AMADOR", 86, 0.2, (w - word.width) / 2, wordTop + word.capHeight);
  const s1 = textPath(sans, "ASSET MANAGEMENT", 18.5, subTrack, (w - subT.width) / 2, wordTop + word.capHeight + 22 + subT.capHeight);
  return { body: `${mark(mx, 0, markSize / 64, fg, bar)}<path d="${w1.d}" fill="${fg}"/><path d="${s1.d}" fill="${sub}"/>`, w, h: Math.ceil(wordTop + word.capHeight + 22 + subT.capHeight + 2) };
}

/** Nautilus Fund mark: logarithmic spiral with brass septa, on a 200-unit grid. */
function nautilusMark(stroke, septaColor) {
  const c = 100, turns = 2.7, b = Math.log(3) / (2 * Math.PI), tmax = turns * 2 * Math.PI, rmax = 92, a = rmax / Math.exp(b * tmax), rot = -0.35;
  const pt = (th, r = a * Math.exp(b * th)) => [c + r * Math.cos(th + rot), c + r * Math.sin(th + rot)];
  const f = (n) => n.toFixed(1);
  let spiral = "";
  for (let i = 0; i <= 600; i++) {
    const [x, y] = pt(0.9 + ((tmax - 0.9) * i) / 600);
    spiral += `${i ? "L" : "M"}${f(x)} ${f(y)}`;
  }
  const [e1x, e1y] = pt(tmax);
  const [e2x, e2y] = pt(tmax - 2 * Math.PI);
  let septa = "";
  for (let t = tmax - (2 * Math.PI) / 3; t > 2 * Math.PI + 0.4; t -= 0.48) {
    const [x1, y1] = pt(t);
    const [x2, y2] = pt(t - 2 * Math.PI);
    const [qx, qy] = pt(t - 0.22, a * Math.exp(b * (t - 0.22)) * 0.72);
    septa += `M${f(x1)} ${f(y1)}Q${f(qx)} ${f(qy)} ${f(x2)} ${f(y2)}`;
  }
  return `<path d="${spiral}M${f(e1x)} ${f(e1y)}L${f(e2x)} ${f(e2y)}" fill="none" stroke="${stroke}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="${septa}" fill="none" stroke="${septaColor}" stroke-width="2.2" stroke-linecap="round"/>`;
}

function fundLockup(markStroke, septa, fg, accent, sub) {
  const label = textPath(sans, "AMADOR", 17, 0.42);
  const name = textPath(serifRegular, "Nautilus Fund", 80, 0.03);
  const tag = textPath(serifItalic, "Firme en mar fuerte · Steady in rough seas", 25, 0);
  const markSize = 210;
  const tx = markSize + 38;
  const blockH = label.capHeight + 26 + name.capHeight + 30 + tag.capHeight;
  const top = (markSize - blockH) / 2;
  const l1 = textPath(sans, "AMADOR", 17, 0.42, tx + 2, top + label.capHeight);
  const n1 = textPath(serifRegular, "Nautilus Fund", 80, 0.03, tx, top + label.capHeight + 26 + name.capHeight);
  const t1 = textPath(serifItalic, "Firme en mar fuerte · Steady in rough seas", 25, 0, tx + 1, top + label.capHeight + 26 + name.capHeight + 30 + tag.capHeight);
  const w = Math.ceil(tx + Math.max(n1.width, t1.width, l1.width) + 6);
  return { body: `<g transform="scale(${markSize / 200})">${nautilusMark(markStroke, septa)}</g><path d="${l1.d}" fill="${accent}"/><path d="${n1.d}" fill="${fg}"/><path d="${t1.d}" fill="${sub}"/>`, w, h: markSize };
}

/** Fit a body of size (w, h) into a W×H canvas with padding, centered. */
const fit = (lock, W, H, pad, bg) => {
  const s = Math.min((W - pad * 2) / lock.w, (H - pad * 2) / lock.h);
  const x = (W - lock.w * s) / 2;
  const y = (H - lock.h * s) / 2;
  return svg(W, H, `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s.toFixed(5)})">${lock.body}</g>`, bg);
};

const tile = (W, bg, fg, bar, scale = 0.6, barH = 4, rounded = false) => {
  const inner = 64 * scale;
  const off = (64 - inner) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${W}" height="${W}"><rect width="64" height="64" ${rounded ? 'rx="12"' : ""} fill="${bg}"/>${mark(off, off, scale, fg, bar, barH)}</svg>\n`;
};

const files = {};
// SVG masters
files["amador-mark.svg"] = svg(64, 64, mark(0, 0, 1, C.ink, C.brass));
files["amador-mark-reverse.svg"] = svg(64, 64, mark(0, 0, 1, C.ivory, C.brassLight));
files["amador-mark-black.svg"] = svg(64, 64, mark(0, 0, 1, C.black, C.black));
files["amador-mark-white.svg"] = svg(64, 64, mark(0, 0, 1, C.white, C.white));
files["amador-icon.svg"] = tile(512, C.ink, C.ivory, C.brassLight, 0.6, 4, true);
files["amador-icon-square.svg"] = tile(512, C.ink, C.ivory, C.brassLight);
const H = horizontal(C.ink, C.brass, C.ink);
const HR = horizontal(C.ivory, C.brassLight, C.brassLight);
files["amador-logo-horizontal.svg"] = svg(H.w, H.h, H.body);
files["amador-logo-horizontal-reverse.svg"] = svg(HR.w, HR.h, HR.body);
const S = stacked(C.ink, C.brass, C.ink);
const SR = stacked(C.ivory, C.brassLight, C.brassLight);
files["amador-logo-stacked.svg"] = svg(S.w, S.h, S.body);
files["amador-logo-stacked-reverse.svg"] = svg(SR.w, SR.h, SR.body);
const F = fundLockup(C.sea, C.brass, C.sea, C.brass, "#3D4250");
const FR = fundLockup(C.ivory, C.brassLight, C.ivory, C.brassLight, "rgba(247,245,240,0.8)");
files["nautilus-fund-lockup.svg"] = svg(F.w, F.h, F.body);
files["nautilus-fund-lockup-reverse.svg"] = svg(FR.w, FR.h, FR.body);
files["nautilus-fund-mark.svg"] = svg(200, 200, nautilusMark(C.sea, C.brass));

for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(OUT_SVG, name), content);

// PNG exports
const png = (name, svgText, width) => {
  const out = new Resvg(svgText, { fitTo: { mode: "width", value: width }, background: "rgba(0,0,0,0)" }).render().asPng();
  fs.writeFileSync(path.join(OUT_PNG, name), out);
  return { name, bytes: out.length };
};
const report = [
  // Stripe: JPG/PNG, at least 128 x 128, under 512 KB.
  png("stripe-icon-512.png", files["amador-icon-square.svg"], 512),
  png("stripe-logo-1200x300.png", fit(H, 1200, 300, 24), 1200),
  png("stripe-logo-reverse-1200x300.png", fit(HR, 1200, 300, 24), 1200),
  // Google Ads: square 1:1 (1200 recommended, min 128) and landscape 4:1 (1200 x 300, min 512 x 128), max 5 MB.
  png("google-ads-logo-square-1200.png", fit(stacked(C.ivory, C.brassLight, C.brassLight), 1200, 1200, 170, C.ink), 1200),
  png("google-ads-icon-square-1200.png", tile(1200, C.ink, C.ivory, C.brassLight), 1200),
  png("google-ads-icon-square-1200-transparent.png", svg(64, 64, mark(4, 4, 56 / 64, C.ink, C.brass)), 1200),
  png("google-ads-logo-landscape-1200x300.png", fit(H, 1200, 300, 18), 1200),
  // Social and web icons.
  png("social-avatar-1080.png", tile(1080, C.ink, C.ivory, C.brassLight, 0.55), 1080),
  png("icon-512.png", files["amador-icon.svg"], 512),
  png("icon-192.png", files["amador-icon.svg"], 192),
  png("icon-32.png", tile(32, C.ink, C.ivory, C.brassLight, 0.7, 5, true), 32),
  png("apple-touch-icon-180.png", tile(180, C.ink, C.ivory, C.brassLight, 0.62), 180),
  png("nautilus-fund-lockup-1600.png", fit(F, 1600, 420, 24), 1600),
  png("logo-horizontal-2000.png", fit(H, 2000, 420, 20), 2000),
  png("logo-horizontal-reverse-2000.png", fit(HR, 2000, 420, 20), 2000),
];

// App icons used by Next.js metadata conventions.
fs.copyFileSync(path.join(OUT_PNG, "apple-touch-icon-180.png"), path.join(root, "src", "app", "apple-icon.png"));
fs.writeFileSync(path.join(root, "src", "app", "icon.svg"), tile(64, C.ink, C.ivory, C.brassLight, 0.66, 5, true));

for (const r of report) console.log(`${r.name.padEnd(48)} ${(r.bytes / 1024).toFixed(1)} KB`);
console.log(`\nSVG masters: ${Object.keys(files).length} files in public/brand`);
