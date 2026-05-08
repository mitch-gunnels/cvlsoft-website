# cvlSoft Style Guide

**Aesthetic:** Enterprise editorial — distyl.ai-style. Cream body, dark bookends (hero + closing band + footer), single cyan accent, slate-only neutrals.

## Surfaces

| Token | Hex | When |
|---|---|---|
| `--bg-page` | `#f4f1ea` | Warm cream — every section between hero and the demo CTA |
| `--bg-deep` | `#050a14` | Hero, Demo CTA, Footer (bookends) |
| `--bg-card` | `#ffffff` | Cards on cream — funnel, metric, role, screen, table rows |
| `--bg-tint` | `#ecfeff` | Cyan-50 — subtle accent fill (badge bg, diagram emphasis) |

Sections opt in to a tone via `data-tone="light" | "dark"`. The sticky header reads this on scroll and flips its palette to match the section under it.

## Ink

| Token | Hex | When |
|---|---|---|
| `--ink-primary` | `#0f172a` (slate-950) | Headlines, primary text on cream |
| `--ink-secondary` | `#334155` (slate-700) | Body emphasis on cream |
| `--ink-muted` | `#64748b` (slate-500) | Captions, source lines, secondary nav links |
| `--ink-faint` | `#94a3b8` (slate-400) | Faint labels (rarely used) |

## Single Accent — cvlSoft cyan

The brand mark is the only color allowed besides slate.

| Token | Hex | When |
|---|---|---|
| `--accent-on-light` | `#0e7490` (cyan-700) | Cyan against cream — links, emphasis spans, primary CTA bg, diagram strokes |
| `--accent-on-dark` | `#22d3ee` (cyan-400) | Cyan against deep ink — hero CTA, hero spiral, demo CTA button |
| `--accent-on-light-soft` | `#67e8f9` (cyan-300) | Tonal accent — hover/focus halos |

**No other colors are allowed.** No rose, amber, emerald, violet, indigo, sky. Multi-color affordance was removed in the 2026-05 redesign — the story is told through copy and white space, not color.

## Hairlines / borders

| Token | Hex | When |
|---|---|---|
| `--rule-cool` | `#e2e8f0` (slate-200) | Card borders on cream |
| `--rule-warm` | `#e6e0d4` | Vertical column rules (utility class `.col-rules`) |
| `--rule-dark` | `rgba(255,255,255,0.10)` | Card borders, hairlines on dark |

## Typography

| Role | Font | Variable |
|---|---|---|
| Headings | **Space Grotesk** 300 | `--font-heading` |
| Body | **Manrope** | `--font-body` |
| Mono | **IBM Plex Mono** 400/500 | `--font-code` |

Headings: `letter-spacing: -0.03em`, weight 300.

**Headline conventions (distyl-style):**
- Sentence case, terminal period: *"Why we're different."* not *"Why We're Different"*
- Sizes: `text-[clamp(2rem,5vw,3.5rem)]` for h2; hero h1 uses `text-[clamp(2.8rem,6vw,5rem)]`
- Inline emphasis is a single cyan-700 (or cyan-400 on dark) span — never a gradient.

## Components

### Pill badge

```
inline-block rounded-full border border-slate-300 bg-white px-4 py-1.5
font-mono text-[13px] tracking-[0.18em] text-slate-600
```

On dark sections, swap to `border-white/[0.10] bg-white/[0.04] text-slate-300`.

### Card on cream

```
rounded-lg border border-slate-200 bg-white p-6 md:p-8
```

No shadow. Hairline border only.

### Primary button on cream

```
rounded-md border border-cyan-700 bg-cyan-700 px-5 py-2 text-[13px]
font-semibold tracking-[0.08em] text-white hover:bg-cyan-800
```

### Primary button on dark

```
rounded-md bg-cyan-400 px-7 py-3.5 text-sm font-semibold text-slate-950
hover:bg-cyan-300
```

### Secondary button

```
rounded-md border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700
hover:border-slate-500 hover:text-slate-950
```

## Layout

- Container inner: `lg:pl-[205px] lg:pr-[112px]` to leave room for the SectionScrollLine on the left
- Section spacing: `py-24 md:py-32`
- Hero: `flex min-h-screen items-center` — fills the viewport so the page break lands at the cream/dark boundary

## Diagrams (Why AIOS section)

`DiagramFrame` and the 5 architecture diagrams render on white cards over cream:
- Grid pattern: `#cbd5e1` (slate-300) at 0.5 opacity
- Strokes: `#0e7490` (cyan-700) for accent, `#94a3b8`/`#cbd5e1` for hairlines
- Fills: `#ffffff` for panels, `#ecfeff` (cyan-50) for accent regions, `#f8fafc` for sub-panels
- Text: `#0f172a` for primary, `#475569` for secondary, `#64748b` for muted, `#0e7490` for cyan labels
- No vignette, no glow, no dark backgrounds anywhere

## Hero (dark only)

The hero keeps the spiral SVG and a single cyan-500/[0.06] ambient orb. Indigo and other multi-color orbs were removed. Particles still float subtle cyan.

## Sticky header — dynamic tone

The header palette flips based on the section currently under it:

- **Dark tone:** transparent → `bg-[#050a14]/70` on scroll, white text, slate-400 nav links, cyan-400 CTA pill on slate-950 text
- **Light tone:** transparent → cream/80 on scroll, slate-950 logo, slate-600 nav links, cyan-700 CTA pill on white text

Detection runs in `useEffect` via a scroll listener that reads `[data-tone]` on each section.

## Vertical column rules (utility)

`.col-rules` (light) / `.col-rules-dark` (dark) draws faint vertical rules at 1/6 intervals across the section's content width. Apply to the section wrapper for the architectural-grid look.
