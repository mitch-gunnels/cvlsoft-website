import SiteHeader from "../components/SiteHeader";

const CAPABILITIES = [
  {
    num: "01",
    title: "Capture knowledge from your experts",
    lead: "AIOS AI interviews (voice & chat) your experts and watches them work, converting tribal knowledge, undocumented processes, and SOPs into structured workflow primitives.",
    stinger: "AIOS AI extracts SME tacit knowledge.",
  },
  {
    num: "02",
    title: "Generate workflows that adapt",
    lead: "The cognitive core converts captured processes into intent-based, AI-native workflows. Steps describe what to do; the runtime resolves how at execution time.",
    stinger: "Scripted workflows lock you in. AIOS resolves how at runtime.",
  },
  {
    num: "03",
    title: "Govern and validate every action",
    lead: "Plan-before-execute, policy-gated tool calls, and human-in-the-loop approval at every action. Safety is the substrate, not a feature.",
    stinger: "Most platforms claim guardrails. AIOS proves it with the immutable audit ledger.",
  },
  {
    num: "04",
    title: "Execute adaptively across every system",
    lead: "Adaptive execution against your real systems, with every action audited and scoped to a revocable identity.",
    stinger: "Enterprise reliability is a phrase. AIOS proves it with the sandbox and the audit ledger.",
  },
  {
    num: "05",
    title: "Observe everything in real time",
    lead: "See every step the platform takes, from the overall workflow down to each individual decision and tool call. Every action is timed, costed, and replayable.",
    stinger: "Observability isn't a phrase. AIOS ships the spend ledger, the OTLP pipe, and the dashboard.",
  },
  {
    num: "06",
    title: "Memory that compounds with every run",
    lead: "Every execution feeds layered memory and a self-improving context playbook. The platform doesn't just run workflows; it remembers them.",
    stinger: "Most platforms forget between runs. AIOS gets smarter every run.",
  },
];

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-[#050a14] text-slate-100">
      <SiteHeader />

      {/* ── PLATFORM CAPABILITIES — capabilities list + flow graphic side-by-side ── */}
      <section data-tone="dark" className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <p className="reveal-up inline-block rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-1.5 font-mono text-[13px] tracking-[0.18em] text-slate-400">
            HOW AIOS WORKS
          </p>
          <h2 className="reveal-up mt-6 text-[clamp(1.75rem,4vw,2.75rem)] font-light leading-[1.1] tracking-[-0.03em] text-white [animation-delay:60ms]">
            From tribal knowledge to <span className="text-cyan-400">auditable execution</span>.
          </h2>
          <p className="reveal-up mt-5 max-w-2xl text-lg leading-relaxed text-slate-400 [animation-delay:120ms]">
            AIOS captures what your experts know, converts it into adaptive cognitive workflows, and runs them under policy-gated governance, with every action logged for audit.
          </p>

          <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_minmax(360px,440px)] lg:items-start lg:gap-16">
            {/* LEFT — capabilities list */}
            <div className="space-y-12">
              {CAPABILITIES.map((cap, i) => (
                <div
                  key={cap.num}
                  className={i < 2 ? "hero-fade-up" : "reveal-up"}
                  style={i === 1 ? { animationDelay: "220ms" } : undefined}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[13px] tracking-[0.22em] text-cyan-400">{cap.num}</span>
                    <h3 className="text-xl font-medium tracking-tight text-white md:text-2xl">{cap.title}</h3>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-300">{cap.lead}</p>
                  <p className="mt-4 border-l-2 border-cyan-400 pl-4 text-[13px] italic leading-relaxed text-slate-500">
                    {cap.stinger}
                  </p>
                </div>
              ))}
            </div>

            {/* RIGHT — sticky flow graphic + memory callout + badges */}
            <div className="lg:sticky lg:top-28">
              <div className="relative mx-auto w-full max-w-md">
                <div className="flow-graphic relative pl-12">
                  {/* Loop arrow on the left — annotated with self-evolution */}
                  <svg
                    viewBox="0 0 60 760"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    className="flow-loop pointer-events-none absolute left-0 top-0 h-full w-12"
                  >
                    <defs>
                      <marker id="aios-flow-arrow" viewBox="0 0 12 12" refX="6" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                        <path d="M2 2 L10 6 L2 10 Z" fill="#22d3ee" />
                      </marker>
                    </defs>
                    <path
                      d="M 52 740 Q 8 740 8 700 L 8 60 Q 8 20 52 20"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="1.5"
                      strokeDasharray="5 5"
                      markerEnd="url(#aios-flow-arrow)"
                    />
                    <circle cx="52" cy="740" r="4" fill="#22d3ee" />
                  </svg>

                  {/* Loop label — "Self-Evolving System" rotated along the loop arrow */}
                  <div className="pointer-events-none absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap bg-[#050a14] px-2">
                    <span className="flow-piece block font-mono text-[11px] font-medium tracking-[0.18em] text-cyan-400 [animation-delay:220ms]">
                      SELF-EVOLVING SYSTEM
                    </span>
                  </div>

                  <div className="flow-piece rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 py-3.5 text-center [animation-delay:80ms]">
                    <p className="text-[14px] font-semibold tracking-tight text-white">
                      Knowledge & Context Engine
                    </p>
                  </div>

                  <div className="mt-2 space-y-1.5">
                    {[
                      {
                        num: "01",
                        title: "Capture",
                        copy: "AIOS Interviewer + Observer extract tribal knowledge from SMEs and screens.",
                        bg: "bg-cyan-400/[0.06]",
                      },
                      {
                        num: "02",
                        title: "Generate",
                        copy: "Cognitive core converts processes into intent-based AI-native workflows.",
                        bg: "bg-cyan-400/[0.10]",
                      },
                      {
                        num: "03",
                        title: "Govern",
                        copy: "Plan-before-execute, policy-gated tool calls, and human-in-the-loop approval at every action.",
                        bg: "bg-cyan-400/[0.16]",
                      },
                      {
                        num: "04",
                        title: "Execute",
                        copy: "Adaptive execution across connectors with full audit logging on every action.",
                        bg: "bg-cyan-400/[0.18]",
                      },
                      {
                        num: "05",
                        title: "Observe",
                        copy: "Live traces, spend ledger, and OTLP telemetry to Grafana. Every run visible in real time.",
                        bg: "bg-cyan-400/[0.24]",
                      },
                      {
                        num: "06",
                        title: "Memory & Self-Evolve",
                        copy: "Every run feeds episodic, semantic-graph, and procedural memory. Each execution makes the next one cheaper, faster, more accurate.",
                        bg: "bg-cyan-400/[0.32]",
                      },
                    ].map((row) => (
                      <div
                        key={row.num}
                        className={`flow-piece flex items-start gap-3 rounded-md px-4 py-4 ${row.bg}`}
                        style={{ animationDelay: `${180 + Number(row.num) * 80}ms` }}
                      >
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-400/40 bg-[#050a14] font-mono text-[11px] font-medium text-cyan-400">
                          {row.num}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold tracking-tight text-white">{row.title}</p>
                          <p className="mt-0.5 text-[13px] leading-snug text-slate-300">{row.copy}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flow-piece mt-2 rounded-full bg-cyan-400 px-6 py-3.5 text-center shadow-[0_4px_16px_rgba(34,211,238,0.25)] [animation-delay:760ms]">
                    <p className="text-[14px] font-semibold tracking-tight text-slate-950">
                      Cognitive Execution Engine
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ── Compliance badges — full content-width row below grid ── */}
          <div className="reveal-up mt-16 rounded-lg border border-white/[0.08] bg-white/[0.03] p-6">
            <p className="font-mono text-[12px] tracking-[0.22em] text-slate-500">CERTIFIED FOR ENTERPRISE</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-10 gap-y-5">
              <img src="/compliance/soc2.svg" alt="SOC 2 Type II" className="reveal-up h-12 w-auto [animation-delay:120ms]" />
              <img src="/compliance/hipaa.svg" alt="HIPAA Certified" className="reveal-up h-12 w-auto [animation-delay:200ms]" />
              <img src="/compliance/sox.svg" alt="SOX Compliant" className="reveal-up h-12 w-auto [animation-delay:280ms]" />
              <div className="reveal-up flex items-center gap-2.5 [animation-delay:360ms]">
                <img src="/compliance/eu-ai-act.svg" alt="" aria-hidden="true" className="h-12 w-12" />
                <div className="leading-tight text-left">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-white">EU AI ACT</p>
                  <p className="text-[11px] tracking-[0.14em] text-slate-500">READY</p>
                </div>
              </div>
              <div className="reveal-up flex items-center gap-2.5 [animation-delay:440ms]">
                <img src="/compliance/gdpr.svg" alt="" aria-hidden="true" className="h-12 w-12" />
                <div className="leading-tight text-left">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-white">GDPR</p>
                  <p className="text-[11px] tracking-[0.14em] text-slate-500">COMPLIANT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIME TO EARNINGS — light background break ── */}
      <section data-tone="light" className="relative bg-[var(--bg-page)] py-24 text-slate-950 md:py-32">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <p className="reveal-up inline-block rounded-full border border-slate-300 bg-white px-4 py-1.5 font-mono text-[13px] tracking-[0.18em] text-slate-600">
            TIME TO EARNINGS
          </p>
          <h2 className="reveal-up mt-6 text-[clamp(1.75rem,4vw,2.75rem)] font-light leading-[1.1] tracking-[-0.03em] text-slate-950 [animation-delay:60ms]">
            Earnings in weeks. <span className="text-cyan-700">Not pilots in years.</span>
          </h2>
          <p className="reveal-up mt-5 max-w-2xl text-lg leading-relaxed text-slate-700 [animation-delay:120ms]">
            AIOS is outcome-priced infrastructure, not a science project. Failed tasks are free, every workflow is metered to the token, and our engineers embed with your team to ship measurable savings to your P&amp;L from the very first month.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Observational Learning",
                body: "The AIOS Interviewer and Observer let your SMEs author workflows by talking, not coding. Time-to-first-workflow is measured in hours, not quarters.",
              },
              {
                title: "Compounding Returns",
                body: "Every successful run feeds layered memory and prunes the cost of the next one. Outcome-based pricing keeps the incentives aligned: failed tasks are free, every win compounds.",
              },
              {
                title: "Forward-Deployed Engineers",
                body: "cvlSoft engineers embed with your team to scope, build, and ship workflows to production in weeks. We carry the skin in the game; we get paid when you save.",
              },
            ].map((card, i) => (
              <div
                key={card.title}
                className="reveal-up rounded-lg border border-slate-300 bg-white p-6"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <h3 className="text-base font-semibold text-cyan-700">{card.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-700">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
