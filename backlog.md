# Site Upgrade Backlog

Follow-up work from the 12-recommendation design handoff. Items here were intentionally out of scope for the initial ship of each Rec, but still need to be addressed before the site is "done."

---

## From Rec 01 — Hero KPI Ticker

- [ ] **Replace seed values with real platform metrics.** Ticker currently uses hard-coded seeds with random-walk deltas (`app/components/HeroKpiTicker.tsx`). Needs: metrics endpoint (REST or SSE), refresh cadence (suggest 10–30s poll or WS push), fallback behavior when endpoint is unreachable (freeze on last-good value, log silently, don't show a broken UI).
- [ ] **GTM sign-off on the 4 signals.** Confirm "tasks executed / saved this week / policy-compliant / approvals logged" are the right 4 KPIs to lead with — these were chosen from the handoff spec, not validated with sales/marketing.
- [ ] **Pulse-dot timing vs spec.** Handoff asks for ≥0.5 opacity swing over 1.5s; we're using Tailwind's `animate-pulse` (2s, 50% min opacity). Either document as an accepted deviation or add a custom `@keyframes` block that matches the spec exactly.
- [ ] **Optics of the "saved this week" counter at week boundary.** Currently monotonically increments forever. Real behavior should reset (or snap) at the start of each week, otherwise the number will eventually lose meaning.

## From Rec 02 — Interactive Savings Calculator

- [ ] **Rates sign-off (blocker for marketing push).** AIOS rates `$0.50 / $6 / $45` per simple/complex/strategic task and human baselines `$2 / $24 / $180` are illustrative values from the handoff spec. Ops + finance need to confirm before the hedge copy ("Estimate only — final pricing is set during onboarding.") is removed.
- [ ] **Reconcile 3-tier calculator with 6-tier pricing table.** The calculator collapses the 6-row table (Micro → Autonomous Ops) into 3 buckets (simple/complex/strategic). Decide: (a) keep both, (b) collapse the table to 3 rows to match, or (c) add an explicit mapping note so the two aren't read as conflicting sources.
- [ ] **Placement judgment call.** Calculator currently renders *after* the 3-col value props and *before* the table. Handoff said "lead with the interactive" — if GTM reads "lead" more literally, move it directly below the headline (before the value props). One-line swap in `app/page.tsx`.
- [ ] **Clamping feedback.** When `complex% + strategic%` hits the 90% ceiling, the "capped" slider silently ignores further drags. Add a subtle visual cue (brief thumb pulse, or inline helper text) so the user understands *why* the slider stopped moving.
- [ ] **URL-state persistence / shareable scenarios.** Not shipped. Would let sales send a pre-filled link ("here's the math on your 47K/mo volume"). Candidate: encode state in query params (`?v=47000&c=40&s=15`), hydrate on mount.
- [ ] **Soft lead-capture hook.** Optional: after a user has interacted with all 3 sliders, surface a small "Want a detailed proposal based on these numbers?" CTA that pipes values into the existing demo-request form. Check with GTM on demand signal before building.
- [ ] **Screen-reader labeling.** Confirm each `<input type="range">` has an adequate `aria-label` / `aria-valuetext` so the live-computed output makes sense via assistive tech. Native browser defaults announce raw numbers, which is fine for the inputs but may underspecify the derived savings.

---

## Remaining recs — not yet planned

Priority 2 (Recs 03, 04, 05, 06, 08) and Priority 3 (Recs 07, 09, 11, 12) are pending individual plans. See `~/Desktop/design_handoff_cvlsoft_site_upgrade/README.md` for specs.

## Dropped from scope

- **Rec 10 — Cinema Platform Screen.** Decided 2026-04-30 not to ship. The existing 2×3 "Inside the Platform" screenshot grid stays. Note: this also affects Rec 03, which referenced Rec 10 as the mid-page set piece — Rec 03 will need an alternative mid-page anchor (e.g., the savings calculator or a different visual moment) when it gets planned.
