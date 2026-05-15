export type Stat = { value: string; label: string };

export type CaseStudy = {
  slug: string;
  vertical: string; // e.g., "F100 P&C Insurer"
  category: string; // e.g., "Claims Operations"
  headlineStat: string; // for the index row
  summary: string; // 1-line lede
  lede: string; // 2–3 sentence summary on detail page
  timeframe: string; // e.g., "14 weeks to production"
  client: string; // e.g., "Top-5 P&C carrier (anonymized)"
  impact: [Stat, Stat, Stat];
  challenge: string[]; // paragraphs
  solution: string[]; // paragraphs (last one is treated as the thesis)
  quote: { text: string; attribution: string };
  // Path to the hero image (square crop)
  image: string;
  // CSS gradient classes — used as the loading background behind the image
  gradient: string;
  // Tailwind gradient stop classes for the per-study mix-blend-color overlay
  // (e.g. "from-cyan-500/35 to-[#0c4a6e]/40")
  overlay: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "f100-insurer-claims",
    vertical: "F100 P&C Insurer",
    category: "Claims Operations",
    headlineStat: "$180M Projected Annual Loss-Adjustment Savings",
    summary:
      "A top-five property and casualty carrier collapsed first-notice-of-loss intake and adjuster workflows behind one cognitive core.",
    lede:
      "A top-five property and casualty carrier was processing millions of claims a year across 14 systems and 200+ adjusters. AIOS replaced nine siloed automations with one cognitive core that learns from every claim it touches.",
    timeframe: "14 weeks to production",
    client: "Top-5 P&C carrier",
    impact: [
      { value: "73%", label: "Touchless FNOL intake" },
      { value: "4.2×", label: "Faster adjuster cycle time" },
      { value: "$180M", label: "Projected annual savings" },
    ],
    challenge: [
      "Every claim moved through six tools and four handoffs before an adjuster could make a decision. Average cycle time was twelve days. Senior adjusters were carrying tribal knowledge that no rules engine had ever captured.",
      "Existing automations covered the easy paths and brittled on edge cases. Each new product, jurisdiction, or regulatory change meant another bot, another integration, another thing to maintain.",
    ],
    solution: [
      "AIOS Interviewer ran structured sessions with senior adjusters to capture jurisdictional heuristics and reserve-setting logic. The Observer watched live FNOL workflows to fill in what the experts had stopped explaining out loud.",
      "A single cognitive core then ran intake, triage, reserve-setting, and routing across the carrier's 14 systems. Default-deny policy enforced state-specific compliance. The audit ledger captured every decision in evidence-grade detail.",
      "One cognitive core replaced nine siloed bots — and got better with every claim it ran.",
    ],
    quote: {
      text: "We stopped writing automation. We started encoding judgement.",
      attribution: "VP, Claims Operations",
    },
    image: "/case-studies/insurer.jpg",
    gradient:
      "bg-[radial-gradient(ellipse_at_top_left,#1e3a8a_0%,#0c4a6e_45%,#020617_100%)]",
    overlay: "from-cyan-400/55 to-sky-700/50",
  },
  {
    slug: "regional-bank-aml",
    vertical: "Regional Bank",
    category: "Compliance & AML",
    headlineStat: "92% Forecasted False-Positive Reduction",
    summary:
      "A regional commercial bank put AML transaction monitoring under one auditable cognitive core — faster reviews, fewer false positives, evidence-grade trails.",
    lede:
      "A $40B regional commercial bank was triaging 9,000+ AML alerts a week against a legacy rules engine with an 82% false-positive rate. AIOS encoded senior investigators' judgement and gave regulators an evidence-grade audit trail in the same deployment.",
    timeframe: "11 weeks to production",
    client: "$40B regional commercial bank",
    impact: [
      { value: "92%", label: "False-positive reduction" },
      { value: "6.5×", label: "Analyst capacity unlocked" },
      { value: "100%", label: "Audit-trail coverage" },
    ],
    challenge: [
      "Forty analysts were triaging more than nine thousand alerts a week. Eighty-two percent were false positives. The team's most senior investigators carried the pattern recognition; their notes were in spreadsheets.",
      "Regulators were tightening explainability requirements. The bank needed every decision — not just the audit-flagged ones — to be reviewable, time-stamped, and tied to the policy that authorized it.",
    ],
    solution: [
      "AIOS Interviewer captured the senior investigators' triage logic in structured sessions. The Observer ran alongside live alert review to encode the exception handling that never made it into a runbook.",
      "The cognitive core ran adaptive triage under a default-deny policy: every action was gated, every tool call scoped to a revocable identity, and every decision logged to an immutable audit ledger. The OCC audit closed without a finding.",
      "Compliance got faster — and explainable in the same deployment.",
    ],
    quote: {
      text: "Every action has a paper trail. Every decision is reviewable.",
      attribution: "Chief Compliance Officer",
    },
    image: "/case-studies/bank.jpg",
    gradient:
      "bg-[radial-gradient(ellipse_at_top_right,#312e81_0%,#1e1b4b_50%,#020617_100%)]",
    overlay: "from-cyan-400/55 to-sky-700/50",
  },
  {
    slug: "f500-manufacturer-procurement",
    vertical: "F500 Manufacturer",
    category: "Procurement Operations",
    headlineStat: "$65M Projected Working Capital Released",
    summary:
      "An industrial manufacturer collapsed multi-system procurement workflows across vendor onboarding, PO matching, and invoice resolution.",
    lede:
      "An F500 industrial manufacturer ran procurement across twelve ERPs and five business units. AIOS connector fabric and adaptive cognitive core stitched the systems together and turned the long-tenured AP team into the leverage point, not the bottleneck.",
    timeframe: "16 weeks to production",
    client: "F500 industrial manufacturer",
    impact: [
      { value: "$65M", label: "Working capital released" },
      { value: "91%", label: "Touchless invoice processing" },
      { value: "3 days", label: "Vendor onboarding (was 21)" },
    ],
    challenge: [
      "Twelve ERPs. Five business units. Two hundred thousand invoices a year, seventeen percent of which required manual intervention. Vendor onboarding averaged twenty-one days because every business unit had its own approval chain.",
      "The accounts payable team had decades of tacit knowledge for resolving exceptions — knowledge that turned over every time someone retired.",
    ],
    solution: [
      "The AIOS connector fabric brought all twelve ERPs into one execution surface. The AI Interviewer captured the AP team's exception heuristics — the small judgement calls that kept the books clean.",
      "The cognitive core then ran autonomous matching, vendor screening, and exception triage. Default-deny policy gated every dollar threshold; the audit ledger captured each authorization and the policy that allowed it.",
      "We didn't replace the AP team — we gave them an apprentice that scales.",
    ],
    quote: {
      text: "It learns our exceptions. The rules engines never did.",
      attribution: "Director, Procurement Operations",
    },
    image: "/case-studies/manufacturer.jpg",
    gradient:
      "bg-[radial-gradient(ellipse_at_bottom_right,#134e4a_0%,#083344_50%,#020617_100%)]",
    overlay: "from-cyan-400/55 to-sky-700/50",
  },
  {
    slug: "health-system-rev-cycle",
    vertical: "National Health System",
    category: "Revenue Cycle",
    headlineStat: "$42M Forecasted Annual Recovery",
    summary:
      "A multi-state health system put denials and underpayment recovery on autopilot — surfacing systemic billing gaps along the way.",
    lede:
      "A multi-state health system was writing off more than $200M annually to denials and underpayments. The denials team was burning out, payor contracts were changing faster than rules engines could keep up. AIOS encoded the senior specialists' workflow and let it compound.",
    timeframe: "18 weeks to production",
    client: "Multi-state health system",
    impact: [
      { value: "$42M", label: "Forecasted annual recovery" },
      { value: "87%", label: "Denial appeals automated" },
      { value: "2.1×", label: "Analyst leverage" },
    ],
    challenge: [
      "Two hundred million dollars in annual write-offs. A denials team running on tribal knowledge, with payor contracts that changed faster than the rules engine could be updated. CFO bandwidth was spent on weekly variance commentary instead of strategic decisions.",
      "Every payor was different. Every state added its own wrinkle. The team's senior specialists were the only ones who knew which appeals were worth pursuing — and they were burning out.",
    ],
    solution: [
      "AIOS Observer watched senior denial specialists work — not just the happy path, but the way they handled odd payor responses, partial reimbursements, and contractual ambiguities. The cognitive core authored adaptive workflows from those patterns.",
      "Layered memory captured payor-specific behavior over time. HIPAA-grade policy gated escalations to humans. The Evolving Context Playbook surfaced systemic billing gaps the team had been working around for years.",
      "The system gets better at every payor. The rules engine never did.",
    ],
    quote: {
      text: "It surfaces patterns we'd never have caught manually.",
      attribution: "VP, Revenue Cycle",
    },
    image: "/case-studies/health.jpg",
    gradient:
      "bg-[radial-gradient(ellipse_at_top,#0e7490_0%,#0f172a_55%,#020617_100%)]",
    overlay: "from-cyan-400/55 to-sky-700/50",
  },
  {
    slug: "f100-retailer-cx",
    vertical: "F100 Retailer",
    category: "Customer Experience",
    headlineStat: "4.2× Faster Tier-1 Resolution",
    summary:
      "A national retailer collapsed seven disconnected vendor agents into one outcome-priced cognitive core spanning email, chat, voice, and agent-assist.",
    lede:
      "An F100 retailer was running seven disconnected AI vendors across customer experience — chatbot, voice, agent-assist, email triage, returns, and two more. Brand voice was fragmented, audit visibility was nil. AIOS replaced the stack with one cognitive core priced on resolutions.",
    timeframe: "9 weeks to production",
    client: "F100 specialty retailer",
    impact: [
      { value: "4.2×", label: "Faster tier-1 resolution" },
      { value: "78%", label: "Containment without human" },
      { value: "+31", label: "NPS point lift" },
    ],
    challenge: [
      "Seven specialized agents from seven vendors, each with its own logs, prompts, and brand voice. Customer service leadership was under board pressure to ship more AI — and getting nothing back that resembled accountability.",
      "Tier-1 contacts moved between agents and humans without context. Returns, billing, and shipment exceptions each took a different escalation path. Customers felt the seams.",
    ],
    solution: [
      "AIOS replaced the seven agents with one cognitive core, governed by a single brand-voice policy and a single audit trail. Identity-scoped tool calls protected customer PII. The cognitive core handled email, chat, voice, and agent-assist from the same memory.",
      "Layered memory remembered every interaction across channels — so a customer who chatted yesterday didn't have to re-explain anything to the voice agent today. Pricing tied to resolutions, not seats.",
      "One brand voice. One audit trail. One agent that gets smarter.",
    ],
    quote: {
      text: "Customer service finally feels like our team — at every channel.",
      attribution: "SVP, Customer Experience",
    },
    image: "/case-studies/retailer.jpg",
    gradient:
      "bg-[radial-gradient(ellipse_at_top_left,#9f1239_0%,#831843_45%,#1e1b4b_100%)]",
    overlay: "from-cyan-400/55 to-sky-700/50",
  },
];
