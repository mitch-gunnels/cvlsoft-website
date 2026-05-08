import SiteHeader from "../components/SiteHeader";

const CAPABILITIES = [
  {
    num: "01",
    title: "Authored by SMEs, not engineers",
    lead: "The platform interviews your experts and watches them work — workflows write themselves before a single line of code is touched.",
    proofs: [
      "AI Interviewer runs structured elicitation conversations and authors workflows live.",
      "AIOS Observer watches a desktop, converses via voice, and documents undocumented processes.",
      "Visual Workflow Studio — drag-and-drop ReactFlow editor with 10 node types and live validation.",
    ],
    stinger: "Most platforms ask SMEs to provide feedback. AIOS lets them author.",
  },
  {
    num: "02",
    title: "Adaptive cognitive execution",
    lead: "Steps describe what to do; the runtime resolves how at execution time using available connectors. New systems plug in without rewriting workflows.",
    proofs: [
      "Intent-based nodes plus a LangGraph-powered Super Agent and a deterministic DAG walker.",
      "Conditional branching with replan-on-rerun — three-way verdicts (approved / rerun / rejected) feed back into the plan.",
      "Scheduling, webhook gates, and a documented REST API drive runs from any system.",
    ],
    stinger: "Scripted workflows lock you in. AIOS resolves how at runtime.",
  },
  {
    num: "03",
    title: "Default-deny by construction",
    lead: "Every action is gated, every tool call is scoped, every execution is reversible. Safety is the substrate, not a feature.",
    proofs: [
      "Default-deny policy engine with per-tenant overrides.",
      "Circuit breakers, kill switches, and human-in-the-loop gates at any node.",
      "Per-tenant LLM guardrails via LiteLLM proxy and an immutable audit ledger that survives cascade deletes.",
    ],
    stinger: "Most platforms claim guardrails. AIOS commits to default-deny — and proves it with the audit ledger.",
  },
  {
    num: "04",
    title: "Compounding memory",
    lead: "The platform doesn't just run workflows — it remembers them. Every execution makes the next one cheaper, faster, and more accurate.",
    proofs: [
      "Layered memory — episodic, semantic-graph, and procedural memory that persists across runs.",
      "Knowledge RAG — upload, chunk, embed; attach Knowledge Sets to specific nodes for context-aware execution.",
      "Evolving Context Playbook — self-improving bullet library with auto-creation, dedup, pruning, and preview.",
    ],
    stinger: "Most platforms forget between runs. AIOS gets smarter every run.",
  },
  {
    num: "05",
    title: "Enterprise-ready operations, day one",
    lead: "Multi-tenant, observable, governed, and metered to the token. Built for the people who have to sign off, not just the people who build.",
    proofs: [
      "Connector ecosystem — REST, DB, terminal, email, Jira, Slack, Google Workspace, LinkedIn, webhooks; encrypted credential vault with auto OAuth refresh.",
      "Spend tracking — token-level cost ledger per execution, workflow, and tenant.",
      "Live observability — WebSocket execution streams plus OTLP telemetry to Grafana Cloud (Tempo / Loki / Prometheus); MFA + SAML/OIDC + RBAC + sandbox environments.",
    ],
    stinger: "Enterprise reliability is a phrase. AIOS ships the spend ledger, the OTLP pipe, and the sandbox.",
  },
];

const FEATURE_GROUPS = [
  {
    title: "Build & Design",
    items: ["Visual Workflow Studio", "AI Interviewer", "AIOS Observer", "Workflow Templates"],
  },
  {
    title: "Autonomous Execution",
    items: ["Intent-Based Nodes", "Agentic Executor", "Conditional Branching & Approvals", "Scheduling & Webhook Gates"],
  },
  {
    title: "Safety & Governance",
    items: [
      "Default-Deny Policy Engine",
      "Circuit Breakers & Kill Switches",
      "Human-in-the-Loop Gates",
      "Per-Tenant LLM Guardrails",
      "Immutable Audit Ledger",
      "Release Pipeline",
      "MFA + SSO",
    ],
  },
  {
    title: "Knowledge & Memory",
    items: ["Layered Memory", "Knowledge RAG", "Evolving Context Playbook"],
  },
  {
    title: "Connectors & Integrations",
    items: ["Connector Ecosystem", "Encrypted Credential Vault", "Native + Community Connectors"],
  },
  {
    title: "Enterprise Operations",
    items: [
      "Multi-Tenant Isolation",
      "Spend Tracking",
      "Sandbox Environments",
      "Live Observability",
      "Operator Dashboard",
      "Admin Controls",
      "Public REST API",
    ],
  },
];

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-[#050a14] text-slate-100">
      <SiteHeader />

      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="px-6 sm:px-20 lg:px-[112px]">
          <p className="inline-block rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-1.5 font-mono text-[13px] tracking-[0.18em] text-slate-400">
            INSIDE THE PLATFORM
          </p>
          <h1 className="mt-6 text-[clamp(2rem,5vw,3.75rem)] font-light leading-[1.05] tracking-[-0.03em] text-white">
            One cognitive core. <span className="text-cyan-400">Default-deny by construction.</span> Memory that compounds.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-400 md:text-xl">
            AIOS is the autonomous intelligence operating system for enterprises that need outcomes, not experiments.
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS — flow graphic + compliance badges ── */}
      <section className="relative pb-20 md:pb-28">
        <div className="px-6 sm:px-20 lg:px-[112px]">
          <div className="grid gap-12 lg:grid-cols-[1fr_minmax(360px,440px)] lg:items-center lg:gap-16">
            <div>
              <p className="inline-block rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-1.5 font-mono text-[13px] tracking-[0.18em] text-slate-400">
                HOW AIOS WORKS
              </p>
              <h2 className="mt-6 text-[clamp(1.75rem,4vw,2.75rem)] font-light leading-[1.1] tracking-[-0.03em] text-white">
                From tribal knowledge to <span className="text-cyan-400">auditable execution</span>.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-400">
                AIOS captures what your experts know, converts it into adaptive cognitive workflows, and runs them under default-deny governance — with every action logged for audit.
              </p>

              <div className="mt-8">
                <p className="font-mono text-[12px] tracking-[0.22em] text-slate-500">CERTIFIED FOR ENTERPRISE</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <div className="flex items-center gap-2.5">
                    <img src="/compliance/soc2.svg" alt="" aria-hidden="true" className="h-10 w-auto" />
                    <div className="leading-tight">
                      <p className="text-[11px] font-semibold tracking-[0.14em] text-white">SOC 2</p>
                      <p className="text-[11px] tracking-[0.14em] text-slate-500">TYPE II</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <img src="/compliance/hipaa.svg" alt="" aria-hidden="true" className="h-10 w-auto" />
                    <div className="leading-tight">
                      <p className="text-[11px] font-semibold tracking-[0.14em] text-white">HIPAA</p>
                      <p className="text-[11px] tracking-[0.14em] text-slate-500">CERTIFIED</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <img src="/compliance/sox.svg" alt="" aria-hidden="true" className="h-10 w-auto" />
                    <div className="leading-tight">
                      <p className="text-[11px] font-semibold tracking-[0.14em] text-white">SOX</p>
                      <p className="text-[11px] tracking-[0.14em] text-slate-500">COMPLIANT</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.6" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="leading-tight">
                      <p className="text-[11px] font-semibold tracking-[0.14em] text-white">EU AI ACT</p>
                      <p className="text-[11px] tracking-[0.14em] text-slate-500">READY</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.6" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.105.895-2 2-2s2 .895 2 2v2a2 2 0 01-4 0v-2zM5 13a7 7 0 1114 0 7 7 0 01-14 0z" />
                      </svg>
                    </div>
                    <div className="leading-tight">
                      <p className="text-[11px] font-semibold tracking-[0.14em] text-white">GDPR</p>
                      <p className="text-[11px] tracking-[0.14em] text-slate-500">COMPLIANT</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Flow graphic — numbered pipeline with self-evolution loop ── */}
            <div className="relative mx-auto w-full max-w-md">
              <div className="relative pl-12">
                {/* Loop arrow on the left — annotated with self-evolution */}
                <svg
                  viewBox="0 0 60 760"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 h-full w-12"
                >
                  <defs>
                    <marker id="aios-flow-arrow" viewBox="0 0 12 12" refX="6" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                      <path d="M2 2 L10 6 L2 10 Z" fill="#22d3ee" />
                    </marker>
                  </defs>
                  {/* dashed loop path — origin from bottom output up to top input */}
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

                {/* "Self-Evolution" label vertically centered on the loop */}
                <div className="pointer-events-none absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap font-mono text-[10px] tracking-[0.22em] text-cyan-400">
                  SELF-EVOLUTION
                </div>

                {/* Top pill — input */}
                <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 py-3.5 text-center">
                  <p className="text-[14px] font-semibold tracking-tight text-white">
                    Tribal Knowledge · SOPs · Tools
                  </p>
                </div>

                {/* Stacked numbered stages with icons */}
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
                      copy: "Plan-before-execute, default-deny policy, and human-in-the-loop gates approve every action.",
                      bg: "bg-cyan-400/[0.16]",
                    },
                    {
                      num: "04",
                      title: "Execute & Learn",
                      copy: "Adaptive execution across connectors. Every outcome flows back into layered memory.",
                      bg: "bg-cyan-400/[0.22]",
                    },
                  ].map((row) => (
                    <div key={row.num} className={`flex items-start gap-3 rounded-md px-4 py-4 ${row.bg}`}>
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

                {/* Bottom pill — output */}
                <div className="mt-2 rounded-full bg-cyan-400 px-6 py-3.5 text-center shadow-[0_4px_16px_rgba(34,211,238,0.25)]">
                  <p className="text-[14px] font-semibold tracking-tight text-slate-950">
                    Executed Workflow + Audit Trail
                  </p>
                </div>
              </div>

              {/* Memory layer — facts about self-evolution */}
              <div className="mt-6 rounded-lg border border-cyan-400/20 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.6" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <p className="font-mono text-[12px] tracking-[0.2em] text-cyan-400">MEMORY · SELF-EVOLUTION</p>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-slate-300">
                  Every run feeds <span className="font-medium text-white">episodic, semantic-graph, and procedural memory</span>. The Evolving Context Playbook auto-creates, dedups, and prunes itself. Each execution makes the next one cheaper, faster, and more accurate.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="font-mono text-lg font-medium text-cyan-400">3×</p>
                    <p className="mt-1 text-[11px] leading-tight text-slate-500">memory layers per run</p>
                  </div>
                  <div className="border-x border-white/[0.08]">
                    <p className="font-mono text-lg font-medium text-cyan-400">∞</p>
                    <p className="mt-1 text-[11px] leading-tight text-slate-500">runs informing the core</p>
                  </div>
                  <div>
                    <p className="font-mono text-lg font-medium text-cyan-400">↓</p>
                    <p className="mt-1 text-[11px] leading-tight text-slate-500">cost per task over time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-16 md:pb-24">
        <div className="px-6 sm:px-20 lg:px-[112px]">
          <div className="space-y-px overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.06]">
            {CAPABILITIES.map((cap) => (
              <div key={cap.num} className="bg-[#050a14] p-6 md:p-10">
                <div className="grid gap-6 md:grid-cols-[120px_1fr] md:gap-10">
                  <div>
                    <p className="font-mono text-[13px] tracking-[0.22em] text-cyan-400">{cap.num}</p>
                  </div>
                  <div>
                    <h2 className="text-2xl font-medium tracking-tight text-white md:text-3xl">
                      {cap.title}
                    </h2>
                    <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-slate-300 md:text-base">
                      {cap.lead}
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {cap.proofs.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-slate-400">
                          <span className="mt-[7px] block h-1 w-1 shrink-0 rounded-full bg-cyan-400" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 border-l-2 border-cyan-400 pl-4 text-[14px] italic leading-relaxed text-slate-500">
                      {cap.stinger}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-24 md:pb-32">
        <div className="px-6 sm:px-20 lg:px-[112px]">
          <p className="inline-block rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-1.5 font-mono text-[13px] tracking-[0.18em] text-slate-400">
            FEATURE INDEX
          </p>
          <h2 className="mt-6 text-[clamp(1.75rem,4vw,2.5rem)] font-light tracking-[-0.03em] text-white">
            Everything <span className="text-cyan-400">in the box.</span>
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FEATURE_GROUPS.map((group) => (
              <div key={group.title} className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-6">
                <h3 className="font-mono text-[13px] tracking-[0.18em] text-cyan-400">{group.title.toUpperCase()}</h3>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-slate-300">
                      <span className="mt-[7px] block h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <a
              href="/#demo"
              className="inline-block rounded-md bg-cyan-400 px-7 py-3.5 text-sm font-semibold tracking-tight text-slate-950 transition hover:bg-cyan-300"
            >
              Request a Demo
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
