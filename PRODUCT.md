# cvlSoft — Product Context

> Project context for the Impeccable design skill. Source of truth for *who this is for*, *what the product is*, and *how the brand sounds*. Design decisions check against this file.

**register**: brand

The site is marketing for an enterprise services + platform business. Design IS the product on this surface — long-form editorial layouts, hero/CTA bookends, distinctive typography. Internal app UI (when it ships) would use `register: product`.

---

## Company

cvlSoft (CVL Software) sells **AIOS — Autonomous Intelligence Operating System**. AIOS turns tribal SOPs and SME knowledge into safe, auditable autonomous execution: a cognitive core, a connector fabric, a three-role memory engine (Generator / Reflector / Curator), policy-gated actions, an immutable audit ledger, and outcome-based pricing.

Pre-revenue / pre-customer. The site has to compensate for the absence of named-logo proof through *process IP*, *partner ecosystem signal*, and *editorial polish*. Mitchell Gunnels (founder) is the voice and signatory.

## Users

Primary: **Fortune 500 operations executives, CIOs/CTOs, and transformation leads** evaluating whether AI can actually replace operational headcount — not whether it can demo well.

What they care about, in order:
1. **Risk.** Audit trail, human-in-the-loop approval, kill-switch, policy enforcement, governance posture. Anything that lets compliance sign off.
2. **Outcomes.** Will this actually reduce cost / cycle time / error rate on a named process? Show me the math, not the vision.
3. **Path to value.** How fast from intro to first working autonomous workflow? Who does the embedding? What does week 1 look like?
4. **Defensibility.** Why not just wait for OpenAI / Microsoft / their incumbent SaaS to do this? (Answer: process is the moat, not the tech.)

Secondary: **F500 line-of-business leaders** (Ops VPs, Finance ops, Supply chain) who feel the pain but route the buy through IT.

What they explicitly are NOT:
- Developers shopping for a framework. AIOS is not a dev tool.
- Startups looking for the cheapest agent API.
- AI hobbyists. The site should look indifferent to them and they will self-select out.

## Product purpose

> *Your processes. Autonomous. Guaranteed.*

AIOS replaces operational labor — not augments it, not assists it. The product extracts tacit knowledge from SMEs, encodes it as a governed cognitive process, and runs that process autonomously with deterministic safety rails. Customers pay only when an outcome is successfully delivered.

Three things AIOS does that the market does not:
- **Single cognitive core** instead of a swarm of brittle agents. Adding capabilities makes every process smarter, not more fragile.
- **Compounding intelligence** via the Generator / Reflector / Curator loop. Every execution is a training signal, persisted as reusable validated knowledge — no manual retraining, no prompt tuning.
- **Forward-deployed engineering** model. cvlSoft engineers embed with the customer until the process works, then step back. Customers do not run a "platform implementation project."

## Voice

**Founder-voice. Brevity with depth. Outcomes first, technology never.**

We sell *process* and *guarantee*, not *features*. Mention the tech only as supporting evidence — never as the headline.

Sentence-case headlines with terminal periods (distyl-style): *"Why we're different."* not *"Why We're Different"*. Inline emphasis is a single cyan span, never a gradient (see anti-pattern). Captions and small labels use IBM Plex Mono with wide tracking.

Words and phrases that are us:
- "Your processes. Autonomous. Guaranteed."
- "We embed until it works."
- "Outcome-based pricing. Failed tasks are free."
- "Docs in, autonomy out."
- "Policy-gated. Plan-before-execute. Human-in-the-loop."
- "Immutable audit ledger."
- "Tribal knowledge → permanent knowledge."

Words and phrases that are NOT us:
- "Default-deny" / "default-deny by construction." Banned — AIOS does not implement a default-deny security model. Use "policy-gated", "governed by construction", "every action gated by policy" instead.
- "AI agents," "agent swarm," "multi-agent." We have one cognitive core, not many agents.
- "Empower," "unlock," "leverage," "synergize," "supercharge," "revolutionize." Buzzwords.
- "Powered by GPT-4 / Claude / [model name]." Models are interchangeable plumbing; naming them dates the copy and confuses the moat.
- "AI copilot," "AI assistant." We replace labor, not assist it.
- "Pilot" as a verb for the engagement. We don't do pilots — we do forward-deployed implementations with outcome guarantees.

## Strategic principles

1. **Process is the moat.** In a post-SaaS world where any tech stack is replicable in months, the defensible asset is the captured operational process. Lead every conversation here.
2. **Show, don't claim.** Diagrams of the cognitive architecture, named SOPs, audit-ledger screenshots, and concrete savings math do the persuasion. Adjectives don't.
3. **Risk frame before opportunity frame.** F500 buyers buy *de-risked outcomes*. Audit, governance, and kill-switch evidence comes before TCO and ROI.
4. **One accent, one voice.** Visual restraint signals seriousness. Color and copy should both feel curated, not generated. The single cyan accent + slate neutrals on near-white is the deliberate counter to AI-slop maximalism.
5. **Founder-signed.** Decisions, claims, and the closing CTA read as Mitchell speaking, not as marketing-speak.

## Anti-references (do NOT look like these)

- **OpenAI / Anthropic product pages** — too consumer-tech, too colorful, too playful for our F500 audience.
- **Generic SaaS marketing sites** (Intercom, Notion, Linear's marketing pages) — too app-screenshot-heavy and feature-grid-heavy; we are not selling an app.
- **AI agent startup landing pages** circa 2024–2025 — gradient hero text, neon glows, "Powered by GPT-4" badges, generated-illustration hero art. Everything we are not.
- **Enterprise SI/consulting sites** (Accenture, Deloitte) — too stock-photo, too generic, no point of view.

## Positive references

- **distyl.ai** — enterprise editorial, cream body + dark bookends, single accent, restrained type. Direct visual ancestor of the current redesign.
- **Stripe Press** (for typography discipline and editorial pacing, not aesthetic).
- **Linear's *changelog* and *manual* pages** (not their product marketing) — for restraint and information density.

## Surfaces on this site

| Route | Purpose | Tone |
|---|---|---|
| `/` | Hero → Problem → Why AIOS → Platform → Compare → Pricing → Rollout → Team → Demo CTA | Dark hero/CTA/footer, near-white body |
| `/platform` | Deep-dive: cognitive core, connector fabric, memory engine, governance | Same bookend pattern as `/` |
| `/about`, `/team`, `/rollout` | Founder + process IP signal | Near-white throughout |
| `/contact` | Single funnel: demo request | Near-white |
| `/privacy`, `/terms` | Long-form legal | Near-white |

## Anti-patterns specific to this project

In addition to the global Impeccable anti-patterns:

- **No multi-color affordances.** Rose for "bad", emerald for "good", amber for "warning" — all removed in 2026-05. Differential is carried by typography, weight, and `line-through`, not color.
- **No "Powered by [model]" trust badges.** Trust comes from process IP and partner logos (Built On / Member of rows), not from naming the underlying LLM.
- **No app-screenshot hero.** AIOS is not a UI you log into and click around in. Hero is editorial copy + the spiral SVG.
- **No generated illustrations.** SVG architecture diagrams (DiagramFrame + 5 architecture diagrams) carry the visual interest. Anything that looks like a Midjourney render is wrong.
- **No countdown timers, no "join 10,000 customers" social proof inflation, no chat widget.** Tone is consultative, not transactional.
