/**
 * Generates a paper-ream SVG for every catalog product into
 * /public/products/<slug>.svg, tinted to the product's color and branded with
 * the Dunder Mifflin band. Single source of truth = lib/catalog.ts.
 *
 *   pnpm images        (alias for: tsx scripts/gen-product-images.ts)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PRODUCTS, type CatalogProduct } from "../lib/catalog";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "products");

const NAVY = "#1b3c6e";
const INK = "#15233a";

function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}
function shade(hex: string, factor: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const f = (c: number) =>
    clamp(factor < 1 ? c * factor : c + (255 - c) * (factor - 1));
  return `#${[f(r), f(g), f(b)].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}
function brightness(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}
function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Split a display name into at most two centered lines. */
function wrap(name: string): string[] {
  const words = name.split(/\s+/);
  if (name.length <= 13 || words.length === 1) return [name];
  // Find the split that best balances the two lines.
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ").length;
    const b = words.slice(i).join(" ").length;
    if (Math.abs(a - b) < bestDiff) {
      bestDiff = Math.abs(a - b);
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

function chipLabel(p: CatalogProduct): string {
  const parts = [
    p.specs.Weight,
    p.specs.Sheets || p.specs.Count || p.specs.Pack || p.specs.Pages,
  ].filter(Boolean);
  return (parts.join("  ·  ") || p.material).toUpperCase();
}

function svgFor(p: CatalogProduct): string {
  const face = p.colorHex;
  const top = shade(face, 1.08);
  const side = shade(face, 0.82);
  const edge = shade(face, 0.6);
  const pageLine = shade(face, 0.78);
  const isLight = brightness(face) > 150;
  const nameColor = isLight ? INK : "#ffffff";
  const subColor = isLight ? "#5d6675" : "rgba(255,255,255,0.82)";

  const displayName = esc(p.name.split("—")[0].trim());
  const lines = wrap(displayName);
  const lineLabel = p.line.toUpperCase() === "DUNDER MIFFLIN" ? "" : esc(p.line.toUpperCase());

  // Page lines along the right (side) face to suggest stacked sheets.
  const pages = Array.from({ length: 9 }, (_, i) => {
    const t = i / 9;
    const x1 = 560 + t * 60;
    const y1 = 230 - t * 50;
    const x2 = 560 + t * 60;
    const y2 = 760 - t * 50;
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${pageLine}" stroke-width="2" opacity="0.5"/>`;
  }).join("");

  const nameTspans =
    lines.length === 1
      ? `<tspan x="415" dy="0">${lines[0]}</tspan>`
      : `<tspan x="415" dy="0">${esc(lines[0])}</tspan><tspan x="415" dy="42">${esc(lines[1])}</tspan>`;
  const nameY = lines.length === 1 ? 486 : 466;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900" width="900" height="900" role="img" aria-label="${esc(p.name)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fbfaf7"/>
      <stop offset="1" stop-color="#ecefe8"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="900" height="900" fill="url(#bg)"/>
  <ellipse cx="455" cy="788" rx="240" ry="34" fill="#15233a" opacity="0.10"/>

  <!-- top face -->
  <polygon points="270,230 560,230 620,180 330,180" fill="${top}" stroke="${edge}" stroke-width="2" stroke-linejoin="round"/>
  <!-- right face (ream thickness) -->
  <polygon points="560,230 620,180 620,710 560,760" fill="${side}" stroke="${edge}" stroke-width="2" stroke-linejoin="round"/>
  ${pages}
  <!-- front face -->
  <rect x="270" y="230" width="290" height="530" fill="${face}" stroke="${edge}" stroke-width="2"/>
  <rect x="270" y="230" width="290" height="530" fill="url(#sheen)"/>

  <!-- brand band -->
  <rect x="270" y="284" width="290" height="74" fill="${NAVY}"/>
  <text x="415" y="319" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="23" font-weight="700" letter-spacing="1.6" fill="#ffffff">DUNDER MIFFLIN</text>
  <text x="415" y="344" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="11" letter-spacing="4" fill="#ffffff" opacity="0.72">PAPER COMPANY, INC.</text>

  ${lineLabel ? `<text x="415" y="408" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="3" fill="${isLight ? NAVY : "#ffffff"}">${lineLabel}</text>` : ""}

  <!-- product name -->
  <text x="415" y="${nameY}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="36" font-weight="600" fill="${nameColor}">${nameTspans}</text>

  <!-- color name -->
  <text x="415" y="${nameY + (lines.length === 1 ? 50 : 92)}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="17" fill="${subColor}">${esc(p.colorway)}</text>

  <!-- format / weight chip -->
  <rect x="305" y="690" width="220" height="38" rx="19" fill="${isLight ? NAVY : "#ffffff"}" opacity="${isLight ? 1 : 0.92}"/>
  <text x="415" y="715" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5" fill="${isLight ? "#ffffff" : INK}">${esc(chipLabel(p))}</text>
</svg>
`;
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const p of PRODUCTS) {
    writeFileSync(join(OUT_DIR, `${p.slug}.svg`), svgFor(p), "utf8");
  }
  console.log(`✅ Wrote ${PRODUCTS.length} ream SVGs → public/products/`);
}

main();
