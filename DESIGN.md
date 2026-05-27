# cvlSoft — Design System

> Visual contract for the Impeccable design skill. Tokens, type, components, and motion. Source of truth lives in `app/globals.css` (CSS custom properties); this file and `STYLE_GUIDE.md` document intent and usage. When changing tokens, update all three in the same commit.

---

## Surfaces

| Token | Hex | When |
|---|---|---|
| `--bg-page` | `#fafaf9` | Near-white body — every section between hero and demo CTA |
| `--bg-deep` | `#050a14` | Hero, demo CTA, footer (bookends) |
| `--bg-card` | `#ffffff` | Cards on near-white — funnel, metric, role, screen, table rows |
| `--bg-tint` | `#ecfeff` | Cyan-50 — subtle accent fill (badge bg, diagram emphasis) |

**Section tone API.** Every `<section>` declares `data-tone="light" | "dark"`. The sticky header reads this on scroll (see `useEffect` in `app/page.tsx`) and flips its palette: text color, background opacity, CTA color all swap. Adding a new section without a `data-tone` will break header contrast.

## Ink

| Token | Hex | When |
|---|---|---|
| `--ink-primary` | `#0f172a` (slate-950) | Headlines, primary text on near-white |
| `--ink-secondary` | `#334155` (slate-700) | Body emphasis |
| `--ink-muted` | `#64748b` (slate-500) | Captions, source lines, secondary nav |
| `--ink-faint` | `#94a3b8` (slate-400) | Faint labels on dark sections |

Never use `#000` or `#fff` directly for text. Always go through these tokens (which are tinted neutrals — slate, not pure gray).

## Accent — cvlSoft cyan (the only color)

The brand is **slate + one cyan**. No other color is permitted.

| Token | Hex | When |
|---|---|---|
| `--accent-on-light` | `#0e7490` (cyan-700) | Cyan against near-white — links, emphasis spans, primary CTA bg, diagram strokes |
| `--accent-on-dark` | `#22d3ee` (cyan-400) | Cyan against deep ink — hero CTA, hero spiral, demo CTA button |
| `--accent-on-light-soft` | `#67e8f9` (cyan-300) | Tonal accent — hover/focus halos |

**Forbidden:** rose, amber, emerald, violet, indigo, sky, any second hue. Differentiation between "good/bad", "before/after", "human/AI" must be carried by typography, weight, position, or `line-through` — *never* by adding a second color.

## Hairlines / rules

| Token | Hex | When |
|---|---|---|
| `--rule-cool` | `#e2e8f0` (slate-200) | Card borders on near-white |
| `--rule-warm` | `#ededeb` | Vertical column rules (`.col-rules`) |
| `--rule-dark` | `rgba(255,255,255,0.10)` | Card borders, hairlines on dark |

`.col-rules` / `.col-rules-dark` draws faint vertical rules at 1/6 intervals across the section's content width — the architectural-grid look. Apply to a section wrapper for editorial pages.

## Typography

| Role | Font | Weight | Variable | Letter-spacing |
|---|---|---|---|---|
| Headings | **Space Grotesk** | 300 | `--font-heading` | `-0.03em` |
| Body | **Manrope** | 400 (regular), 500 (emphasis) | `--font-body` | default |
| Mono | **IBM Plex Mono** | 400 / 500 | `--font-code` | `0.18em–0.22em` for eyebrows |

Loaded via `next/font/google` in `app/layout.tsx`. All weights are subset to latin.

**Heading conventions:**
- Sentence case, terminal period: *"Why we're different."* not *"Why We're Different"*.
- Hero h1: `text-[clamp(2.8rem,6vw,5rem)]`, weight 300, `leading-[1.08]`.
- Section h2: `text-[clamp(2rem,5vw,3.5rem)]`, weight 300.
- Inline emphasis is a single cyan-700 (or cyan-400 on dark) span. **No gradient text.**
  - *Known drift:* the current hero h1 has a `bg-gradient-to-r from-cyan-300 to-cyan-500` on the word "Weeks." This violates the rule and should be flattened to a solid `text-cyan-400` span in the next pass.

**Body conventions:**
- Default `text-base` (16px) on near-white, `text-xl` (20px) for hero subtitle.
- Long-form paragraphs cap at `max-w-[720px]`.

**Mono conventions:**
- Eyebrows: `font-mono text-[11–13px] tracking-[0.18em–0.22em] uppercase` for section labels.
- Stat tickers, code-like UI, source lines.

## Layout

- **Container inner:** `lg:pl-[205px] lg:pr-[112px]` — leaves room for the `SectionScrollLine` (sticky dot + vertical rail) on the left.
- **Section spacing:** `py-24 md:py-32`. Heavier than typical SaaS to read as editorial, not as a feature grid.
- **Hero:** `flex min-h-screen items-center` — fills the viewport so the page break lands exactly at the dark/near-white boundary.
- **Max content width:** `max-w-7xl` (80rem).
- **Column rules:** `.col-rules` divides the 80rem at 1/6 intervals.

## Components

### Pill badge

```html
<!-- on near-white -->
<span class="inline-block rounded-full border border-slate-300 bg-white px-4 py-1.5
             font-mono text-[13px] tracking-[0.18em] text-slate-600">
  EYEBROW LABEL
</span>

<!-- on dark -->
<span class="... border-white/[0.10] bg-white/[0.04] text-slate-300">EYEBROW LABEL</span>
```

### Card on near-white

```html
<div class="rounded-lg border border-slate-200 bg-white p-6 md:p-8">…</div>
```

**No shadows.** Hairline border only. Elevation in this system is communicated by border contrast, not by drop shadow.

### Primary button on near-white

```html
<button class="rounded-md border border-cyan-700 bg-cyan-700 px-5 py-2 text-[13px]
               font-semibold tracking-[0.08em] text-white hover:bg-cyan-800">
  Request demo
</button>
```

### Primary button on dark

```html
<button class="rounded-md bg-cyan-400 px-7 py-3.5 text-sm font-semibold text-slate-950
               hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20">
  Request demo
</button>
```

### Secondary button

```html
<button class="rounded-md border border-slate-300 px-5 py-3 text-sm font-medium
               text-slate-700 hover:border-slate-500 hover:text-slate-950">
  Why we're different
</button>
```

### Architecture diagrams (`DiagramFrame` + 5 diagrams in Why AIOS)

Always render on a white card over near-white body. No vignettes, no glow, no dark backgrounds.

- Grid pattern: `#cbd5e1` (slate-300) @ 0.5 opacity
- Strokes: `#0e7490` (cyan-700) for accent; `#94a3b8` / `#cbd5e1` for hairlines
- Fills: `#ffffff` (panels), `#ecfeff` (cyan-50 accent regions), `#f8fafc` (sub-panels)
- Text: `#0f172a` primary, `#475569` secondary, `#64748b` muted, `#0e7490` cyan labels

### Section scroll line (`SectionScrollLine` component)

Sticky dot + vertical rail at `left-[175px]`, hidden below `lg`. Tone matches the section (`tone="light" | "dark"`):
- Light: cyan-700 dot, slate-300 rail
- Dark: cyan-400 dot with subtle cyan glow, white/10 rail

## Motion

All motion is **deliberate and short**. AIOS-slop motion (continuous floating, parallax everywhere, scroll-jacking) is forbidden.

| Pattern | Duration | Curve | When |
|---|---|---|---|
| `.hero-fade-up` | 900ms | `cubic-bezier(0.22, 1, 0.36, 1)` | One-shot on mount, sequenced via per-element `animation-delay` |
| `.hero-stagger` | 700ms | same | Hero sub-elements (logos cascade) |
| `.reveal-up` | 750ms | same | IntersectionObserver — fires when an element crosses the reading line |
| `.scale-in` | 650ms | same | Card / diagram reveal on scroll |
| `.cascade` | 650ms | same | Sibling cascade with stagger |
| `.row-fade` | 500ms | same | Table row reveal |
| `.bar-fill` | 1000ms | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Horizontal bar fills in charts |
| `.chart-line` | 1800ms | same | SVG path draw on charts |
| `.marquee-track` | 28s linear infinite | — | Mobile partner-logo marquee only |
| `.glow-pulse` | 6s infinite | ease-in-out | Dark hero ambient orb only |
| `.float-slow` | 8s infinite | ease-in-out | Dark hero ambient elements only |

**All motion is gated behind `@media (prefers-reduced-motion: reduce)`** — animations collapse to final state. Confirm any new motion respects this.

**No motion in body sections beyond the entrance reveal.** Once content is on screen, it stays still. No idle hover-floats on cards, no parallax, no continuous scroll-jacked progress bars.

## Iconography

Lucide-style hand-coded SVGs (see `IconEye`, `IconCpu`, `IconGrid`, `IconRocket`, `IconShield`, `IconUsers`, `IconLink` in `app/page.tsx`):
- `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `strokeWidth="1.5"`, round caps/joins.
- Always inherit color from parent — no hard-coded colors inside icons.

Do NOT add icon libraries (lucide-react, heroicons). Keep icons as inline SVG components for tree-shake and explicit ownership.

## Imagery

- **Architecture diagrams** > generated illustrations. SVG, never raster.
- **No stock photography.** Headshots on `/team` only, against a neutral background.
- **Partner / Built-On logos** render as flat SVG, color-neutralized to slate-600 on near-white, slate-400 on dark. No original brand colors.

## Anti-patterns (what to reject in critique / audit)

- Gradient text (current hero h1 violates this — known drift).
- Drop shadows on cards on near-white.
- A second accent color, anywhere.
- Pure `#000` or `#fff` for text.
- Title Case headlines without terminal period.
- Floating / parallax / scroll-jacked motion on body sections.
- "Powered by [model]" badges or any LLM-vendor mention.
- App-screenshot hero treatments.
- Generated illustrations or Midjourney-style hero art.
- Multi-color status pills ("✅ live", "⚠️ beta") — use mono eyebrows instead.
- Nested cards (cards inside cards inside cards). One level only.
- Hover effects that move content position (jank).
