export type IndustryMistake = {
  title: string;
  problem: string;
  impact: string;
};

export type Differentiator = {
  title: string;
  detail: string;
  proof: string;
};

export type ProofPoint = {
  label: string;
  statement: string;
};

export type Connector = {
  type: string;
  description: string;
};

export type RuntimeStep = {
  step: string;
  description: string;
};

export const siteContent = {
  brand: "cvlSoft",
  nav: [
    { label: "Platform", href: "#platform" },
    { label: "Safety", href: "#safety" },
    { label: "Connectors", href: "#connectors" },
    { label: "Flow", href: "#how-it-works" },
    { label: "Request Demo", href: "#demo" },
  ],
  hero: {
    eyebrow: "Enterprise Autonomy Platform",
    headline: "Stop Building Brittle Agent Workflows",
    categoryStatement:
      "cvlSoft turns tribal operational knowledge into safe autonomous execution.",
    contrarianStatement:
      "Most vendors hand-build custom agent flows that decay into maintenance debt.",
    thesis:
      "We ingest observational knowledge + SOPs + MPs into reusable super agents with deterministic controls.",
    subhead:
      "Enterprise autonomy without automation debt.",
    primaryCta: "Request Demo",
    secondaryCta: "See Platform",
  },
  industry_mistakes: [
    {
      title: "Workflow sprawl",
      problem: "Every use case becomes bespoke logic.",
      impact: "Result: fragile systems and poor reuse.",
    },
    {
      title: "Point solutions",
      problem: "Automation is tied to individual apps.",
      impact: "Result: breakage when environments shift.",
    },
    {
      title: "Maintenance tax",
      problem: "Teams spend cycles patching drift.",
      impact: "Result: reliability erodes over time.",
    },
  ] satisfies IndustryMistake[],
  industryClose:
    "Point solutions create automation debt. cvlSoft creates operational leverage.",
  differentiatorLine:
    "Others stitch flows. We compile durable capability.",
  differentiators: [
    {
      title: "Observational learning",
      detail: "Capture tacit operator behavior.",
      proof: "Real-world execution logic.",
    },
    {
      title: "SOP + MP ingestion",
      detail: "Convert process docs into action.",
      proof: "Certified machine-operable skills.",
    },
    {
      title: "Core super agents",
      detail: "Reusable agent system, not one-offs.",
      proof: "Lower brittleness, less overhead.",
    },
    {
      title: "Composable SME layer",
      detail: "SMEs compose outcomes directly.",
      proof: "No agentic AI expertise required.",
    },
    {
      title: "Forward deploy teams",
      detail: "Built for enterprise reality.",
      proof: "Faster integration adoption.",
    },
    {
      title: "Security + observability",
      detail: "Deterministic policy and evidence.",
      proof: "Traceable, auditable autonomy.",
    },
    {
      title: "Connector fabric",
      detail: "API and no-API under one contract.",
      proof: "Swap backends without skill rewrites.",
    },
  ] satisfies Differentiator[],
  proof_points: [
    {
      label: "SOP Compiler",
      statement: "SOPs become constrained skill specs.",
    },
    {
      label: "Capability Graph",
      statement: "Typed capability nodes, system-agnostic.",
    },
    {
      label: "Policy Gate",
      statement: "Deterministic allow/deny enforcement.",
    },
    {
      label: "Evidence Store",
      statement: "Replay-grade logs with redaction.",
    },
  ] satisfies ProofPoint[],
  platform: {
    controlPlane: [
      "Ingest + normalize SOP/MP",
      "Compile + certify skills",
      "Govern policy and approvals",
    ],
    dataPlane: [
      "Orchestrate isolated execution",
      "Route via tool gateway",
      "Breakers, budgets, kill switches",
    ],
  },
  safety: [
    "Multi-level circuit breakers",
    "Hard kill, soft kill, quarantine",
    "Ephemeral scoped credentials",
    "Evidence-first replay and audit",
  ],
  connectors: [
    {
      type: "Native API",
      description: "REST, GraphQL, SOAP, gRPC",
    },
    {
      type: "Database",
      description: "Read replicas and governed writes",
    },
    {
      type: "Event and Queue",
      description: "Kafka, MQ, pub-sub workflows",
    },
    {
      type: "RPA",
      description: "Deterministic UI automation",
    },
    {
      type: "Terminal and Mainframe",
      description: "TN3270, TN5250, SSH flows",
    },
    {
      type: "Browser and Desktop",
      description: "Computer-use orchestration",
    },
  ] satisfies Connector[],
  flow: [
    {
      step: "Select certified skill",
      description: "Pick constrained execution plan.",
    },
    {
      step: "Policy validates action",
      description: "Allow or deny before execution.",
    },
    {
      step: "Connector executes",
      description: "Run capability with scoped creds.",
    },
    {
      step: "Evidence and postcheck",
      description: "Verify outcome or stop safely.",
    },
  ] satisfies RuntimeStep[],
} as const;
