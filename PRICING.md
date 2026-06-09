# AIOS Pricing Model

> **Internal source of truth** for how AIOS charges. The customer-facing pricing
> section in `app/page.tsx` derives its copy from this file; the platform billing
> implementation derives its logic from this file. If copy and this document
> ever disagree, **this document wins.**
>
> Last revised: 2026-06-05.

## Principles

1. **Outcome-based.** The customer pays an *outcome fee* only when a task is
   successfully delivered. A failed, escalated, or killed task carries **no
   outcome fee**.
2. **Deterministic tiers, no arbitration.** A task's complexity tier is a
   computed function of execution telemetry — never a negotiated judgment.
   "What tier is this?" is answered by a query against the immutable execution
   record, not a meeting.
3. **Layered.** Three independent layers, each charging a *different unit of
   value*. Stacking them is not double-dipping because the bases differ.
4. **Floor cost on platform.** We do not profit on infrastructure. Margin lives
   in the outcome layer (primary) and a thin 5% compute margin.

---

## Layer A — The three billing layers

| # | Layer | Basis | Rate | Billed when | If BYOK | On failed task |
|---|---|---|---|---|---|---|
| **1** | **Platform floor** | Tenant infra, connectors, security, unlimited users | **At cost, no margin** | Recurring (mo/yr) | unchanged | still billed (recurring) |
| **2** | **Token / compute** | Metered usage (`LlmUsage.costUsd`) | **Provider cost + 5%** | **Every run** (success or fail) | **$0 to us** — tenant pays provider | **still charged** — separate pass-through, not an outcome fee |
| **3** | **Per-task outcome** | Delivered successful task, tier by hard params | **$10 / $35 / $175 / $450** | **On `success` only** | unchanged | **$0** |

**Why stacking is defensible:** Layer 2 recovers *compute consumed*; Layer 3
prices the *delivered outcome* (a fixed value price by tier, **not** cost-plus on
tokens). Different bases → not the same charge twice.

**On "failed = free":** the customer never pays an *outcome fee* for a failed
task. Compute (Layer 2) is a separate pass-through for resources actually
consumed — it is not a charge *for the failed task*.

---

## Layer B — Per-task complexity tiers

`billedTier = max-of(nodeBand, toolCallBand, computeTimeBand)`, then apply
escalators. The heaviest single axis sets the tier.

| Tier | Nodes | Tool calls | Compute time¹ | Approval floor | **Outcome price** |
|---|---|---|---|---|---|
| **Simple** | ≤ 3 | ≤ 3 | ≤ 30s | — | **$10** |
| **Standard** | 4–10 | 4–10 | ≤ 2 min | — | **$35** |
| **Complex** | 11–15 | 11–15 | ≤ 8 min | ≥ 1 | **$175** |
| **Strategic** | 16 + | 16 + | > 8 min | ≥ 2 | **$450** |

¹ `computeTime = totalDurationMs − approvalWaitMs − llmLatencyMs − connectorLatencyMs`
— pure orchestration time, stripping human wait and provider latency the customer
does not control.

**Escalators (deterministic):**

- **Approval floor** — ≥ 1 executed human-in-the-loop gate → at least Complex;
  ≥ 2 → at least Strategic.
- **Token-cost signal** — a run whose `costUsd` lands in a higher tier's cost
  band escalates one tier (a run burning Strategic-level compute *is* Strategic,
  even with few nodes).

---

## Tier computation — telemetry mapping

Every input is already persisted in the immutable execution record, so every bill
is customer-inspectable (this is what the dispute window relies on).

| Signal | Field | Source model |
|---|---|---|
| Nodes | `stepsAttempted` | `ExecutionMetrics` |
| Tool calls | count of actual tool/connector invocations | `PlanStep` / `stepResults` |
| Compute time | `totalDurationMs − approvalWaitMs − llmLatencyMs − connectorLatencyMs` | `ExecutionMetrics` |
| Approvals | executed gate steps / `approvalWaitMs > 0` | `ExecutionMetrics` / `PlanStep` |
| Token cost | sum `costUsd` for `executionId` | `LlmUsage` |
| Success | `overallOutcome === 'success'` + locked criteria | `ExecutionSummary` |

```text
signals = aggregate(ExecutionMetrics, PlanStep, LlmUsage for executionId + child executions)
tier    = maxOf(bandByNodes, bandByToolCalls, bandByComputeTime)
tier    = escalate(tier, approvals, tokenCostSignal)

outcomeCharge = isSuccess(signals) ? PRICE[tier] : 0
tokenCharge   = BYOK ? 0 : signals.costUsd * 1.05
platformCharge = recurring floor (tenant infra cost, billed separately)
```

---

## Layer C — Anti-gaming rules

| # | Gaming vector | Rule | Enforced on |
|---|---|---|---|
| **G1** | Split one Complex task into many Simple tasks | Tier computed on the **full call tree** rooted at the billable outcome; child/sub-workflow signals **roll up** into the parent | aggregated signals across `executionId` + children |
| **G2** | Fire N near-identical Simple tasks to fragment a batch | **Burst aggregation**: ≥ K same-signature outcomes from one trigger within window W bill as **one** task, re-tiered on combined signals | trigger id + input hash + timestamp |
| **G3** | Cram work into one "fat" node to dodge node count | Tool-call axis counts **actual invocations**, not plan-step rows; cost signal escalates a high-cost node; `max-of` makes the spike win | actual invocations, `costUsd` |
| **G4** | Deliver output, then abort to claim "failed = free" | **Billable success = locked success-terminal reached + defined artifact recorded in ledger.** Delivered-then-cancelled still bills | `overallOutcome` + locked criteria + ledger artifact |
| **G5** | Self-report a success as a failure | Outcome status is **engine-computed** from locked criteria, written immutably — never client-supplied | server-computed `overallOutcome` |
| **G6** | Retry-spam to inflate, or pay-per-attempt abuse | **One charge per outcome**, never per attempt; retries capped by `maxRetries`; failed attempts free | `retriesUsed`, single outcome record |
| **G7** | Quote a trivial WDF, then run a heavy variant | **Invoice uses the run-time measured tier, not the quote**; quote→bill drift auto-updates the quoted tier per published rule | run-time `ExecutionMetrics` |
| **G8** | BYOK to hide the cost signal | BYOK waives **only Layer 2 charging**; `costUsd` still metered for tiering | metered `costUsd` regardless of payer |
| **G9** | Suspect token padding on the +5% | Pass-through at provider **published rates** from the immutable `LlmUsage` ledger; **platform-fault retries (5xx/infra) absorbed, never billed**; BYOK is the ultimate audit | `LlmUsage` ledger + fault class |
| **G10** | Idle/long-poll to inflate compute time | Compute time **strips `approvalWaitMs` + provider latency**; only active orchestration counts | latency decomposition fields |
| **G11** | Harvest value from partial successes | `partial_success` bills **only if** the locked success criteria were met, else $0 | `overallOutcome` + criteria |
| **G12** | Runaway/looping failures burn the customer's token budget | Hard **per-attempt token budget cap** (`planConstraints`) + `maxRetries`; **platform-fault errors absorbed** | `planConstraints`, fault class, `retriesUsed` |

---

## Worked invoice

| Event | Layer 2 (token) | Layer 3 (outcome) | Total |
|---|---|---|---|
| Successful **Complex** (managed key, $0.80 tokens) | $0.84 | $175 | $175.84 |
| Successful **Complex** (**BYOK**) | $0 | $175 | $175.00 |
| **Failed** task (managed key, $0.30 tokens burned) | $0.32 | $0 | $0.32 |
| **Failed** task (BYOK) | $0 | $0 | $0.00 |
| Interactive usage (managed, $4 tokens) | $4.20 | — | $4.20 |

Platform floor billed separately as a recurring line.

---

## Governance (locked at go-live)

- **Success criteria locked** per workflow before go-live (defines the billable
  terminal node + artifact).
- **Quarterly not-to-exceed cap.**
- **Dispute window** with full trace evidence from the immutable ledger.
- **Annual true-up.**

---

## Calibration

The node / tool-call / compute-time band cutoffs are **starter values**. Calibrate
once by running the scorer over historical `execution_metrics`, then pin the band
cutoffs at fixed percentiles (e.g. 60th / 85th / 97th), publish, and lock. After
that, tier assignment is a query — permanently arbitration-free.

---

## Copy implications (website)

- The pricing-section card *"token costs baked in"* → *"Compute is passed through
  at provider cost + 5% — or nothing, if you bring your own key."*
- *"Failed = Free"* is scoped to the outcome fee: the customer only pays for
  successful runs; compute is a separate pass-through (or $0 under BYOK).
