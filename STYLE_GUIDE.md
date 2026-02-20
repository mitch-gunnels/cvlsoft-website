# cvlSoft Style Guide

## Typography

| Role | Font | CSS Variable | Usage |
|---|---|---|---|
| Headings | **Space Grotesk** | `--font-heading` | h1–h6, section titles |
| Body | **Manrope** | `--font-body` | Paragraphs, descriptions, UI text |
| Mono | **IBM Plex Mono** 400/500 | `--font-code` | Pills, badges, stats, product names |

**Heading sizes** (Tailwind):
- `h1`: `text-5xl md:text-6xl lg:text-7xl` — `leading-[1.05] tracking-tight`
- `h2`: `text-3xl md:text-5xl` — `leading-snug font-bold`
- `h3`: `text-base font-semibold`

**Body sizes**:
- Primary: `text-base md:text-lg` — `leading-relaxed`
- Secondary: `text-sm` — `leading-relaxed`
- Small/labels: `text-xs`

All headings get `letter-spacing: -0.02em` via `globals.css`.

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| **Slate 950** | `#0f172a` | Primary text, dark backgrounds, buttons |
| **Slate 800** | `#1e293b` | Subheadings, hover states |
| **Slate 600** | `#475569` | Body text, secondary labels |
| **Slate 500** | `#64748b` | Muted text, nav links |
| **Slate 300** | `#cbd5e1` | Borders, disabled text |
| **Slate 200** | `#e2e8f0` | Card borders, dividers |
| **Slate 50** | `#f8fafc` | Subtle backgrounds |
| **Cyan 700** | `#0e7490` | Brand accent, highlights, AIOS column |
| **Cyan 600** | `#0891b2` | Gradient start |
| **Cyan 400** | `#22d3ee` | Gradient end, diagram lines, animations |
| **Cyan 50** | `#ecfeff` | Icon backgrounds, accent pills |
| **Rose 500** | `#f43f5e` | Problem stats |
| **Rose 400** | `#fb7185` | Problem card left border, underline accent |
| **Amber 600** | `#d97706` | Partial/mixed values in comparison table |

**CSS variables**:
- `--bg-root`: `#f7f8fb` — page background
- `--text-primary`: `#0f172a` — default text

**Brand gradient**: `bg-gradient-to-r from-cyan-600 to-cyan-400`

---

## Layout

**Container**: `mx-auto max-w-7xl px-6`

Two section patterns:
- **No background** (hero, observational learning, demo): `max-w-7xl px-6` directly on `<section>`
- **Full-width background** (problem, differentiators, comparison): `px-6` on inner `<div class="mx-auto max-w-7xl px-6">`, NOT on the section

**Section spacing**: `py-16 md:py-24`

**Grid breakpoints**:
- 2-column: `lg:grid-cols-2`
- 3-column cards: `md:grid-cols-2 lg:grid-cols-3`
- Hero split: `lg:grid-cols-[2fr_3fr]`

---

## Components

### Pill Badges

```
rounded-full border px-4 py-1.5 font-mono text-[11px] tracking-[0.18em]
```

- Standard: `border-slate-300 bg-white text-slate-600`
- Accent: `border-cyan-200 bg-cyan-50 text-cyan-700`
- Sizing: use `inline-block` or `self-start` — never stretch to fill parent

### Cards

```
rounded-2xl border border-slate-200 bg-white p-6 shadow-sm
```

- Hover: `hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50`

Problem cards add: `border-l-4 border-l-rose-400 bg-slate-50`

### Primary Button

```
rounded-full bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white
hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-950/20
```

### Secondary Button

```
rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-900
hover:border-slate-500
```

### CTA Button (on dark)

```
rounded-full bg-cyan-400 px-8 py-3.5 text-sm font-semibold text-slate-900
hover:bg-cyan-300
```

### Form Inputs (on dark)

```
rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 text-white
placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400
```

---

## Animations

| Class | Effect | Duration |
|---|---|---|
| `reveal-up` | Fade in + slide up 20px | 800ms, `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| `float-slow` | Gentle vertical bob 12px | 8s, `ease-in-out`, infinite |
| `hero-glow` | Cyan radial glow, blurred | Static (pulsed via SVG `<animate>`) |

Stagger with `[animation-delay: Xms]` or inline `style={{ animationDelay }}`.

All animations disabled under `prefers-reduced-motion: reduce`.

---

## SVG Diagram Tokens

| Constant | Size | Color |
|---|---|---|
| `NODE_LABEL` | 9px / 600 weight | `#334155` (slate-700) |
| `CORE_LABEL` | 9.5px / 700 weight | `#0e7490` (cyan-700) |
| `SUB_LABEL` | 7px / 600 weight | `#475569` (slate-600) |

Diagram accent: `#22d3ee` (cyan-400) for lines, dots, pulses.

---

## Dark Sections

Used for Demo CTA and email header:
- Background: `bg-slate-950` / `#0f172a`
- Decorative orbs: `bg-cyan-500/10`, `bg-indigo-500/10` with `blur-[60px]`
- Text: `text-white` primary, `text-slate-400` secondary

---

## Email

- Max width: 560px, white card on `#f7f8fb` background
- Header: `#0f172a` background, `cvlSoft` in Courier New 18px bold white
- Info boxes: `#f0fdfa` (cyan tint) and `#f8fafc` (slate tint), 12px radius
- Button: `#0f172a` pill, white text, centered with `margin: auto`
- Footer: 12px text, `#0e7490` links
