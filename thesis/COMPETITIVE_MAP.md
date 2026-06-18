# AIOS Competitive Map

*Last updated: June 11, 2026*

AIOS positions as **the Enterprise Agentic Harness** — a cognitive substrate that sits between the enterprise's legacy stack (ERP, CRM, billing, HRIS, the long tail of SaaS) and the agentic world (OpenAI, Anthropic, Google, vertical agents). It does two things from one cognitive core:

1. **Inward**: agentify the legacy stack for internal efficiency.
2. **Outward**: expose the enterprise as agent-callable A2A interfaces for external agents to transact with.

This document maps the competitive field honestly. Every category that follows is *partially* doing what AIOS does. None are doing both halves from one substrate — yet. The race is to see who closes the gap first.

---

## Category 1: Hyperscaler Agent Platforms

The hyperscalers are the most well-funded competitors in raw distribution. None are structurally neutral; each is a wrapper around their own foundation model and cloud.

### Microsoft Copilot Studio + Azure AI Foundry Agent Service

**Positioning**: The agent layer for the Microsoft estate (M365, Dynamics, Power Platform, Entra). Foundry is "pro-code engine room"; Copilot Studio is "low-code front door." At Build 2026 Microsoft repositioned Windows itself as an agent platform with Project Polaris and Agent 365 governance.

**Target buyer**: Microsoft-shop CIO. Anywhere M365 + Entra is the identity backbone.

**Capabilities**: Foundry Agent Service is GA (since Build 2025); autopilot agents with Entra Agent ID, Teams presence, and org-chart placement are in public preview as of mid-2026; tracing/eval going GA in June 2026; native MCP support; Agent 365 governance plane.

**Status**: GA core; major 2026 expansions still in preview.

**Weakness vs. AIOS thesis**:
- Microsoft-native. Cross-vendor composition exists via MCP but the *runtime, identity, and billing* are anchored to Azure + Entra.
- "Trust independence" is impossible: regulated firms that already host SAP on AWS or Workday on Salesforce platform are being asked to run their cognitive layer on the *Microsoft cloud*. That's a forced bet.
- Not outcome-priced. Copilot credit consumption is per-action / per-message metering.

### Google Vertex AI Agent Builder → Gemini Enterprise Agent Platform

**Positioning**: At Cloud Next 2026, Google collapsed Vertex AI and Agentspace into the **Gemini Enterprise Agent Platform**. A2A protocol v1.2 with signed Agent Cards is core. Project Mariner (web-browsing agent), managed MCP via Apigee, and ADK v1.0 across four languages round out the stack.

**Target buyer**: GCP shops, plus enterprises that want a "Switzerland-ish" multi-vendor agent fabric. Google is leaning into A2A as the *neutral protocol* — even though the runtime is theirs.

**Capabilities**: 200+ models in Model Garden (Claude included), partner agents from Box, Workday, Salesforce, ServiceNow; A2A in production at 150+ orgs; Workspace Studio for no-code.

**Status**: GA, with deprecation of old Vertex SDK on June 24, 2026.

**Weakness vs. AIOS thesis**:
- A2A is open *protocol*; the runtime is Google. Workload pull to GCP is the unstated business model.
- Strong on inbound agentification of Google's own surfaces (Workspace, Drive). Weak on hardened ERP + HRIS integration *outside* GCP.
- Outcome pricing: no. Token + agent-engine metering.

### OpenAI: Operator → ChatGPT Agent + Apps SDK + AgentKit

**Positioning**: Operator has been folded into ChatGPT Agent (available in Enterprise/Edu plans). AgentKit is the no-code drag-and-drop builder with a Connector Registry beginning beta rollout to ChatGPT Enterprise / Edu with a Global Admin Console.

**Target buyer**: ChatGPT Enterprise customers — heavy on knowledge worker tooling, light on regulated systems-of-record.

**Capabilities**: Apps SDK lets external applications embed in ChatGPT (EU access still pending), AgentKit ships drag-and-drop, Connector Registry consolidates data sources across ChatGPT + API.

**Status**: Beta rollout of Connector Registry as of mid-2026.

**Weakness vs. AIOS thesis**:
- Strong consumer/prosumer brand pull, *weak* enterprise governance story. OpenAI is still the model vendor, not the enterprise control plane.
- No native ERP/HRIS connectivity. Enterprises bolt OpenAI on top of an existing integration layer, not the other way around.
- Outcome pricing: no. Token-metered.
- Regulated industries (banking, healthcare, gov) are largely *avoiding* OpenAI as the prime contractor today.

### Anthropic: Claude Computer Use + Managed Agents + MCP

**Positioning**: Anthropic owns the protocol (MCP) and a leading agentic model. In May 2026 they shipped **Claude Managed Agents with self-hosted sandboxes** (Cloudflare, Daytona, Modal, Vercel) and **MCP tunnels** that route to MCP servers inside private networks without public exposure. This is the most enterprise-friendly hyperscaler agent posture.

**Target buyer**: Security-conscious enterprises, regulated industries, engineering-led orgs.

**Capabilities**: Computer Use GA; Managed Agents (sandboxes + tunnels) in public beta; MCP registry now exceeds 9,400 servers; Claude in Google Workspace, Salesforce Agentforce, Cloudflare, Replit, Azure OpenAI Service all natively support MCP.

**Status**: Self-hosted sandboxes and MCP tunnels in public beta as of May 2026.

**Weakness vs. AIOS thesis**:
- Anthropic is the *model + protocol* layer. They explicitly do not want to be the enterprise control plane. That leaves a gap AIOS can fill.
- No outcome pricing.
- MCP tunnels solve network egress, not the harder problem: which agent should call which legacy system under which policy with which trust contract.

### AWS Bedrock AgentCore

**Positioning**: Production agent runtime on AWS. AgentCore Policy controls reached GA in March 2026. The May 2026 announcement of **AgentCore Payments** — agents autonomously paying for APIs/MCP servers/web content via Coinbase CDP or Stripe Privy wallets — is the boldest 2026 move.

**Target buyer**: AWS-centric enterprises, payments fintechs, AI-native startups.

**Capabilities**: Managed Agents for OpenAI runtime, automated-reasoning policy controls, multi-region deployment, multi-agent collaboration with supervisor agents, payments primitives.

**Status**: Core GA; Payments in preview.

**Weakness vs. AIOS thesis**:
- AWS lock-in. The substrate is Bedrock. Enterprises with SAP on Azure or Salesforce on its own cloud cannot make Bedrock the cognitive control plane without dragging workloads.
- Outcome pricing: no (token + inference + AgentCore service metering).
- Public sector and regulated industries get strong compliance posture but at the cost of vendor neutrality.

---

## Category 2: SaaS Vendor Agentification

The SaaS incumbents are racing to agentify their own surface. The structural question for AIOS: do they cross-vendor compose? Do they let work span *outside* their own data boundary?

### Salesforce Agentforce 2.0 + Atlas

**Positioning**: Agentforce is the most aggressive incumbent agent platform. Atlas is the reasoning engine doing "System 2" deliberative reasoning, query refinement, RAG grounding across Data Cloud + external systems via MCP. Agentforce 2DX exposes agents to developers via API.

**Target buyer**: Salesforce-installed-base — Sales Cloud, Service Cloud, Marketing Cloud, Commerce Cloud, Slack. Increasingly SMB through Industry Cloud.

**Cross-vendor composition**: Partial. Agentforce can RAG-ground over Workday, Docusign, etc. via AppExchange skills + MCP. But the *runtime, the reasoning, the billing event* all live in Salesforce Data Cloud.

**A2A surface**: Limited. Agentforce is a *consumer* of MCP, not yet a first-class A2A endpoint that other vendors' agents discover and call.

**Weakness vs. AIOS thesis**:
- Salesforce will *not* let work, identity, and audit ultimately reside outside Salesforce. That's their whole business.
- For a customer whose system of record for the workflow is *not* Salesforce (SAP financials, Workday HR, Epic clinical), Agentforce becomes a satellite — exactly the role AIOS is positioned to absorb.
- **Honest call**: Agentforce wins net-new SMB CRM agents, and wins inside its installed base. AIOS will not displace Salesforce inside Salesforce.

### ServiceNow Now Assist + AI Agents + Action Fabric

**Positioning**: ServiceNow Action Fabric (announced Knowledge 2026) opens the platform's "system of action" to any AI agent — Claude, Copilot, customer-built — through a GA MCP Server. AI Control Tower is now bundled, not an add-on. New L1 IT Service Desk, CRM, employee service, and security/risk AI specialists. IT AI specialists GA expected June 2026.

**Target buyer**: ServiceNow-installed enterprises (most of the Global 2000 IT org).

**Cross-vendor composition**: Strongest of the SaaS incumbents. ServiceNow is explicitly positioning Action Fabric as a substrate, not a destination. AI Control Tower governs AI deployed *anywhere* in the enterprise, not just on ServiceNow.

**A2A surface**: Yes, via MCP Server. This is the closest SaaS incumbent move to the AIOS thesis.

**Weakness vs. AIOS thesis**:
- Still a ServiceNow-anchored control plane. Trust independence question: does a non-ServiceNow CIO trust ServiceNow to govern *everything*?
- Action Fabric is GA; AI specialists are partially preview. Execution risk on the full vision through 2026.
- **Honest call**: ServiceNow is the most structurally threatening SaaS incumbent because their Action Fabric vision overlaps with AIOS the most.

### Workday Illuminate

**Positioning**: Illuminate ships HR + Finance agents (Business Process Copilot, Case Agent, Performance Agent, Contract Intelligence, Financial Close, Financial Audit, etc.). Workday Data Cloud + Flex Credits introduces a consumption pricing model.

**Target buyer**: Workday installed base — HR, finance.

**Cross-vendor composition**: Weak. Illuminate is deeply tied to the Workday data model. External integration is partner-led.

**A2A surface**: Limited. Workday is more visible as a *partner agent* in Google's Agent Builder than as an A2A host itself.

**Weakness vs. AIOS thesis**:
- Workday is a destination, not a substrate. The cognitive layer is unmistakably theirs.
- **Honest call**: Workday wins HR + finance agentification inside its own boundary. They will *not* be the enterprise's cognitive substrate.

### Microsoft Dynamics 365 Copilots

**Positioning**: 2026 Release Wave 1 puts agentic AI across Sales, Service, Finance, Supply Chain, HR, Commerce. Real-time voice agents in Dynamics 365 Contact Center via Copilot Studio.

**Target buyer**: Microsoft-shop Dynamics customers (mid-market sweet spot, plus enterprise contact center).

**Cross-vendor composition**: Tightly coupled to Microsoft Foundry + Copilot Studio. See Category 1.

**Weakness vs. AIOS thesis**: Same as Copilot Studio — Microsoft-anchored runtime.

### SAP Joule + Joule Studio + Business AI Platform

**Positioning**: At Sapphire 2026 SAP announced the **Autonomous Enterprise**, a fully managed Joule Studio for agent lifecycle, 50+ Joule Assistants orchestrating 200+ specialized agents, persistent memory via HANA Cloud, and partnerships with Anthropic (Claude), AWS, Google, and Microsoft for bidirectional agent-to-agent interoperability.

**Target buyer**: SAP installed base — finance, supply chain, procurement, HCM, CX.

**Cross-vendor composition**: SAP's bidirectional A2A interoperability claim is real but agent-to-agent, not full cognitive substrate. SAP is the strongest *European* counter-bet to a US-led cognitive layer.

**A2A surface**: Stated yes, via Microsoft/Google A2A bridging.

**Weakness vs. AIOS thesis**:
- SAP is grounding agents in SAP business semantics. Outside that boundary the platform is thin.
- **Honest call**: SAP wins where SAP is the system of record. They will be a peer of AIOS, not a substrate competitor — but they will absolutely try to expand.

### Oracle / NetSuite AI Agents

**Positioning**: NetSuite 2026.1 (March 2026) ships Intelligent Close Manager, EPM AI assistants, AI Canvas, Ask Oracle, NetSuite Next (Redwood UI). The **AI Connector Service** (Feb 2026) is the most notable AIOS-adjacent move: a bring-your-own-AI framework connecting OpenAI, Bedrock, Vertex AI, or Microsoft Foundry as the model layer.

**Target buyer**: NetSuite / Oracle Cloud customers, mid-market through upper-mid.

**Cross-vendor composition**: Weak. AI Connector Service swaps the *model* but not the *runtime*.

**Weakness vs. AIOS thesis**: NetSuite/Oracle is a destination. Their agent layer is intra-suite.

---

## Category 3: Direct Enterprise Agent Platforms (Closest Competition)

This is where the structural fight is. These vendors all claim some version of "the enterprise cognitive layer."

### Palantir AIP / Foundry — Most Important Structural Analog

**Positioning**: Foundry (data OS) + AIP (AI layer) + Apollo (deployment) form an enterprise operating system. The **Ontology** is the digital twin of the business — objects, actions, relationships. AIP Logic + Agent Studio build durable agent orchestrations. In May 2026 Palantir made **Ontology MCP** GA: external AI agents from Google ADK, Microsoft Agent Framework, OpenAI SDK can connect as MCP clients and execute object types, actions, and queries scoped to permissions. MCP Hub gives central management.

**Target buyer**: Public sector (defense, intel, healthcare gov), regulated commercial (banking, energy, pharma, large manufacturers — Airbus, Cleveland Clinic, etc.).

**Key strength**: The Ontology *is* the cognitive substrate AIOS describes. Palantir has 15+ years of engineering on permissioned, audited, operational data unification. They are the only vendor whose product genuinely operates as a substrate today.

**Structural weakness vs. AIOS thesis**:
- Implementation cost + Forward Deployed Engineer model is brutal. Palantir takes 6-12 months to stand up; AIOS positions for weeks.
- Closed system culture. Palantir Ontology is *theirs*. Even with Ontology MCP exposure, the substrate itself is proprietary.
- Public sector heritage scares some commercial buyers.
- Pricing is enterprise-bespoke, not outcome-based.
- **Honest call**: Palantir is the single most structurally threatening competitor. If you want exactly the AIOS thesis at scale today, Palantir is the only real option. AIOS must compete on: speed-to-value, vendor-neutrality (Ontology MCP is exposure of Palantir's substrate; AIOS aspires to be the *neutral* substrate), and outcome pricing.

### Glean Work AI

**Positioning**: Enterprise Graph + connectors + Assistant + Agents + (May 2026) AI coworker that proactively manages tasks and executes multi-step workstreams. Glean introduced the Enterprise Agent Development Lifecycle (ADLC). Booking.com runs it across 14,000 employees.

**Target buyer**: Knowledge worker-heavy enterprises — tech, professional services, financial services white-collar.

**Key strength**: Best-in-class enterprise search + graph. Strong product-led adoption motion. ADLC is a meaningful governance framework.

**Structural weakness vs. AIOS thesis**:
- Glean is fundamentally a **search-first** substrate. Strong at knowledge retrieval and assistance, weaker at *transactional* writes back into ERP/CRM/billing.
- A2A surface is internal — Glean Agents talk to each other within the Glean platform.
- **Honest call**: Glean wins knowledge worker productivity. AIOS wins systems-of-record agentification + external A2A. Adjacent, not direct.

### Sierra AI

**Positioning**: "Agent OS" for customer experience across chat, voice, email, SMS, WhatsApp. **Outcome-based pricing per resolution** — the canonical example of this model. Co-founded by Bret Taylor (ex-Salesforce CEO) and Clay Bavor.

**Target buyer**: Fortune 50 / Fortune 500 customer service. 40%+ of Fortune 50 are customers. $150M+ ARR, $950M Series E in May 2026 at $15B valuation.

**Key strength**: Outcome pricing has won the CX category. The brand and Bret Taylor's credibility are formidable.

**Structural weakness vs. AIOS thesis**:
- CX-only. Sierra does customer experience. AIOS does the entire enterprise surface.
- Not a substrate — a vertical agent platform.
- **Honest call**: Sierra wins customer experience. AIOS should *partner* with Sierra-class vertical agents, not compete with them. Sierra validates the outcome-pricing model AIOS should adopt.

### Cresta

**Positioning**: Contact center AI — AI Agent, Knowledge Agent, Agent Operations Center. SOC 2 / HIPAA / PCI / ISO 27001 / ISO 42001 certified.

**Target buyer**: Enterprise contact centers.

**Structural weakness vs. AIOS thesis**: Same as Sierra — vertical agent, not substrate. Adjacent.

### Decagon

**Positioning**: Customer support agents. $250M Series D in Jan 2026 at $4.5B valuation, $35M ARR, 100+ new enterprise customers in 2025. Customers include Notion, Duolingo, Rippling, Affirm, Chime.

**Structural weakness vs. AIOS thesis**: Vertical support agents. Adjacent to AIOS, potential partner / target acquirer of AIOS-built support agents.

### /dev/agents

**Positioning**: Cloud OS for AI agents. Founded by ex-Android leaders (David Singleton, Hugo Barra). Still relatively quiet, no public revenue figures, no enterprise GA.

**Structural weakness vs. AIOS thesis**: Aimed at *device-class* agent OS, not enterprise systems-of-record. Adjacent vision.

### Adept

**Positioning**: Effectively dissolved. Amazon hired the leadership in July 2024 to build Nova Act. As of 2026, four of five Adept co-founders have left Amazon. Not a competitive threat.

### CrewAI

**Positioning**: Open-source multi-agent orchestration framework. 47.8K+ GitHub stars, 27M+ downloads, used by 63% of Fortune 500 (claimed), 150+ enterprise customers, 1.4B+ agent executions. CrewAI AMP is the enterprise control plane with on-prem option.

**Target buyer**: Developer-led adoption inside enterprises. PwC, IBM, Capgemini, NVIDIA as logos.

**Structural weakness vs. AIOS thesis**:
- CrewAI is a *framework* + control plane. It does not own the connection to legacy ERP/CRM/billing — that's the customer's problem.
- No native A2A surface for the enterprise to expose externally.
- **Honest call**: CrewAI is the framework competitor; AIOS is the substrate. They can coexist — AIOS could run on top of, or replace, CrewAI orchestration internally.

### LangChain / LangGraph

**Positioning**: LangChain + LangGraph + LangSmith. March 2026 NVIDIA partnership delivers enterprise platform: LangSmith Fleet (agent identity / sharing / permissions), ABAC, audit logs, NIM microservices with 2.6x throughput. LangGraph Platform GA since late 2024.

**Structural weakness vs. AIOS thesis**:
- Framework + LLMOps + agent observability — *not* enterprise substrate.
- Strong developer adoption, weak C-suite enterprise governance story.
- **Honest call**: LangChain is the developer toolchain. AIOS is the enterprise substrate. Adjacent, potential complement.

### Vellum, Humanloop

**Vellum**: LLMOps + visual workflow builder. Agentic flow support, semantic routing, human-in-the-loop, SOC 2 Type II. Strong in mid-market.

**Humanloop**: Acquired by Anthropic August 2025; sunsetting as a product. Effectively absorbed.

**Structural weakness vs. AIOS thesis**: LLMOps platforms, not substrates. Adjacent.

### Writer Palmyra

**Positioning**: Enterprise LLM (Palmyra X5: 1M context, $0.60 / $6 per M tokens) + Writer Agent platform with event-based triggers across Gmail, Gong, Calendar, Drive, SharePoint, Slack. Skills launched March 2026.

**Target buyer**: Marketing, content, communications-heavy enterprises.

**Structural weakness vs. AIOS thesis**: Writer is becoming a horizontal agent platform but the gravity is content/comms-heavy. Less strong on ERP, finance, supply chain, regulated systems.

### Cohere North

**Positioning**: Private-deployable agentic AI platform — full on-prem, hybrid, or isolated VPC. Command models, Compass search, North agents, Model Vault. North Mini Code (June 2026) is a 30B MoE for agentic coding.

**Target buyer**: Regulated industries that *cannot* use cloud AI: defense, intelligence, financial services (esp. Canada / EU), healthcare, government.

**Key strength**: Best-in-class for data sovereignty. Genuine on-prem deployment of an agent platform.

**Structural weakness vs. AIOS thesis**:
- Strong substrate posture for *deployment*, but the agent capability is less mature than the hyperscalers.
- **Honest call**: Cohere North is the data-sovereign analog of AIOS. If a CIO asks "I need this on-prem only" — Cohere is the answer today. AIOS must have a credible sovereign / VPC deployment story to compete.

---

## Category 4: iPaaS / RPA / Integration Legacy

These vendors abstract integration plumbing, not cognition. Structurally disadvantaged: they own the connectors but not the brain.

### Workato

Launched **Workato ONE** in 2025 with Workato Genies (AI agents), Agent Studio, and **Enterprise MCP**. Builds in 1-2 weeks vs. MuleSoft's 8-10. Strong iPaaS-to-agent transition. Weakness: their integration model is procedural-first; cognition is bolted on, not core.

### MuleSoft (Salesforce)

Salesforce-owned, Salesforce-centric. Embedded in Agentforce strategy. Weakness: substrate is owned by Salesforce, cognition lives in Atlas, MuleSoft is the pipe.

### Boomi

Boomi **AgentStudio** — 75,000+ agents in production. Solid mid-market presence. Weakness: agents are wrapped recipes; not a cognitive substrate.

### UiPath

UiPath launched the **first enterprise-grade agentic automation platform** in April 2025. April 2026 **Automation Suite** brings the full agentic stack to on-prem (AKS, EKS, OpenShift). Strong public sector. Weakness: RPA DNA — bots-first, agents-second. Cognition is bolted on the RPA spine.

### Automation Anywhere

"Agentic RPA" framework — natural language process description spawns bot + reasoning agent. Weakness: same as UiPath. RPA spine, agent skin.

### Microsoft Power Automate

Microsoft's RPA + flow tool. Subsumed under Copilot Studio + Foundry direction. Same Microsoft-anchored weakness.

### Zapier

Zapier Central for AI agent building on 9,000+ apps. Mid-market / SMB sweet spot. Not an enterprise substrate play.

**Why this category is structurally disadvantaged**: Every iPaaS/RPA vendor's value prop is "we make integration cheaper." That doesn't matter if the substrate above them — the cognitive layer — owns the customer relationship. AIOS is built top-down (cognition first, integration as a means). iPaaS/RPA is built bottom-up. The substrate wins.

---

## Positioning Differentiation Table

| Vendor | Substrate or wrapper? | Cross-vendor composition? | Trust independence | Outcome pricing | Native A2A surface | Verdict |
|---|---|---|---|---|---|---|
| **AIOS** | Substrate | Yes (designed for it) | Yes (vendor-neutral by design) | Yes (target model) | Yes (core thesis) | The integrated bet |
| **Palantir AIP / Foundry** | Substrate | Partial (Ontology MCP exposes) | Partial (Palantir-anchored) | No | Partial (via Ontology MCP) | Closest analog; heavyweight |
| **ServiceNow Action Fabric** | Substrate-aspiring | Yes (MCP Server GA) | No (ServiceNow-anchored) | No | Yes (MCP Server) | Most threatening SaaS incumbent |
| **Salesforce Agentforce 2.0** | Wrapper (over Salesforce) | Partial (consumes MCP) | No (Salesforce-anchored) | No | Partial | Wins inside its base |
| **SAP Joule Studio** | Substrate-aspiring | Partial (A2A with MS/Google) | No (SAP-anchored) | No | Partial | EU + SAP-shop play |
| **Microsoft Foundry + Copilot Studio** | Substrate (Microsoft-anchored) | Partial (MCP) | No (Azure-anchored) | No | Partial | Microsoft-shop default |
| **Google Gemini Enterprise** | Substrate (Google-anchored) | Yes (A2A protocol) | No (GCP-anchored) | No | Yes (A2A native) | Best A2A neutrality claim |
| **AWS Bedrock AgentCore** | Substrate (AWS-anchored) | Partial | No (AWS-anchored) | No | Partial | AWS default |
| **Sierra AI** | Wrapper (vertical CX) | No | Partial | Yes (per resolution) | No | CX vertical leader |
| **Glean** | Substrate (search-first) | Partial | Partial | No | No | Knowledge work leader |
| **Cohere North** | Substrate (sovereign) | Partial | Yes (on-prem deployable) | No | Partial | Sovereign deployment leader |
| **CrewAI / LangGraph** | Framework | Yes (BYO models) | Yes (self-hosted possible) | No | Partial | Developer toolchain |
| **UiPath / Workato** | Wrapper (RPA/iPaaS evolved) | Partial | Partial | No | Partial | Integration plumbing |

**Legend**: Yes = full capability today; Partial = partial / via partner / preview; No = absent or contrary to model.

**Honest reading of the table**: AIOS is the only entry that claims *all* five dimensions. That is also its biggest execution risk. The competitive moat is the *combination*, not any single dimension — every other vendor wins one or two dimensions individually.

---

## Why AIOS Wins

**Most structurally threatening**: (1) **Palantir AIP/Foundry** is the closest structural analog and the only vendor truly executing an ontology-based cognitive substrate today; Ontology MCP exposure makes them more dangerous, not less. (2) **ServiceNow Action Fabric** is the most threatening SaaS incumbent because their Action Fabric + AI Control Tower vision overlaps the AIOS thesis directly and they have an installed-base advantage in IT operations. (3) **Google's Gemini Enterprise + A2A** is the most credible neutrality claim from a hyperscaler — if A2A becomes the de facto interop standard, Google's runtime gravity is a real risk.

**What AIOS must hold to defend**: outcome-based pricing as a contractual primitive (Sierra has proven the market will pay this way); a credible sovereign / VPC / on-prem deployment story (Cohere North is the bar); SOC 2, ISO 27001, ISO 42001, HIPAA, and FedRAMP-track certifications; first-class A2A surface exposure (not just MCP consumption); and reference customers that span at least three of {ERP, CRM, HRIS, billing} to prove cross-vendor composition is real, not aspirational.

**Where AIOS's structural position is genuinely defensible**: (1) **Vendor-neutrality of the cognitive layer** — every hyperscaler and SaaS incumbent is anchored to their own cloud or their own data model; AIOS can authentically be the Switzerland. (2) **The outward A2A thesis** — exposing the enterprise as agent-callable to external agents is a posture nobody else owns end-to-end. Palantir exposes its ontology; Salesforce exposes its records; nobody exposes the *enterprise*.

**Honest segment concessions**: Palantir wins public sector and ontology-led commercial. Salesforce wins SMB CRM agents and intra-Salesforce work. Sierra wins customer experience. Microsoft wins Microsoft shops. Workday wins HR/finance inside its base. AIOS does not need to win those segments. AIOS needs to win the *connective substrate* — the cognitive layer above the systems of record and below the external agentic world.

---

## Sources

### Category 1: Hyperscaler Agent Platforms
- [Microsoft Foundry agent service - Build 2026](https://devblogs.microsoft.com/foundry/agent-service-build2026/)
- [Build 2026: Windows as Agent Platform](https://windowsnews.ai/article/build-2026-microsoft-turns-windows-copilot-and-azure-into-an-ai-agent-platform.421835)
- [Copilot Studio vs Foundry 2026](https://www.wrvishnu.com/copilot-studio-vs-azure-ai-foundry-2026/)
- [Vertex AI Is Gone - Gemini Enterprise](https://medium.com/google-developer-experts/vertex-ai-is-gone-here-is-what-google-built-instead-92556d1c64eb)
- [A2A native on Vertex AI Agent Engine](https://discuss.google.dev/t/launched-the-a2a-protocol-is-now-natively-integrated-on-vertex-ai-agent-engine/264045)
- [A2A protocol upgrade - Google Cloud](https://cloud.google.com/blog/products/ai-machine-learning/agent2agent-protocol-is-getting-an-upgrade)
- [Introducing AgentKit - OpenAI](https://openai.com/index/introducing-agentkit/)
- [ChatGPT Agent - OpenAI](https://openai.com/index/introducing-chatgpt-agent/)
- [Anthropic MCP Tunnels - InfoQ](https://www.infoq.com/news/2026/05/claude-mcp-tunnels/)
- [Anthropic Claude Managed Agents privacy features](https://9to5mac.com/2026/05/19/anthropic-enhances-claude-managed-agents-with-two-new-privacy-and-security-features/)
- [Anthropic 2026 launches](https://linas.substack.com/p/anthropic-claude-2026-every-launch-guide)
- [Amazon Bedrock AgentCore](https://aws.amazon.com/bedrock/agentcore/)
- [AgentCore GA - Mission Cloud](https://www.missioncloud.com/blog/amazon-bedrock-agentcore-ga-building-production-ready-ai-agents-at-enterprise-scale)
- [AWS Weekly Roundup - AgentCore Payments](https://aws.amazon.com/blogs/aws/aws-weekly-roundup-amazon-bedrock-agentcore-payments-agent-toolkit-for-aws-and-more-may-11-2026/)

### Category 2: SaaS Vendor Agentification
- [Salesforce Atlas Reasoning Engine](https://engineering.salesforce.com/inside-the-brain-of-agentforce-revealing-the-atlas-reasoning-engine/)
- [Agentforce 2.0 Atlas improvements - Plative](https://plative.com/improvements-of-atlas-reasoning-engine-in-agentforce-2/)
- [ServiceNow Action Fabric press release](https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-opens-its-full-system-of-action-to-every-AI-Agent-in-the-enterprise/default.aspx)
- [ServiceNow Autonomous Workforce - Fortune](https://fortune.com/2026/05/05/servicenow-knowledge-2026-autonomous-workforce-microsoft-nvidia-ai-announcements/)
- [ServiceNow AI Control Tower](https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-expands-AI-Control-Tower-to-discover-observe-govern-secure-and-measure-AI-deployed-across-any-system-in-the-enterprise/default.aspx)
- [Workday Illuminate expansion](https://www.prnewswire.com/news-releases/workday-illuminate-expands-with-new-ai-agents-for-hr-finance-and-industry-302557725.html)
- [Workday adds 7 agents - TechTarget](https://www.techtarget.com/searchhrsoftware/news/366625056/Workday-adds-seven-agents-to-Illuminate-platform)
- [Dynamics 365 2026 Release Wave 1](https://www.microsoft.com/en-us/dynamics-365/blog/business-leader/2026/03/18/2026-release-wave-1-plans-for-microsoft-dynamics-365-microsoft-power-platform-and-copilot-studio-offerings/)
- [SAP Joule Studio Announcement](https://news.sap.com/2026/05/new-joule-studio-enterprise-scale-agentic-development/)
- [SAP Sapphire 2026 Autonomous Enterprise](https://news.sap.com/2026/05/sap-sapphire-sap-unveils-autonomous-enterprise/)
- [SAP on Azure announcements Sapphire 2026](https://azure.microsoft.com/en-us/blog/advancing-enterprise-ai-new-sap-on-azure-announcements-from-sap-sapphire-2026/)
- [NetSuite 2026.1 AI agents](https://www.netsuite.com/portal/resource/articles/financial-management/netsuite-2026-1-features-new-ai-close-and-cash-management-ai-agents-for-enterprise-performance-management-and-more.shtml)
- [NetSuite AI Connector Service - BrokenRubik](https://www.brokenrubik.com/blog/netsuite-ai-guide)

### Category 3: Direct Enterprise Agent Platforms
- [Palantir AIP Overview](https://www.palantir.com/docs/foundry/aip/overview)
- [Palantir Ontology MCP](https://www.palantir.com/docs/foundry/ontology-mcp/overview)
- [Palantir May 2026 Announcements](https://www.palantir.com/docs/foundry/announcements/2026-05)
- [Palantir Foundry Ontology](https://www.palantir.com/explore/platforms/foundry/ontology/)
- [Glean May 2026 Launch - AI Coworker](https://www.glean.com/blog/may-2026-launch)
- [Glean Enterprise Agent Development Lifecycle](https://www.glean.com/press/glean-introduces-the-enterprise-agent-development-lifecycle-codifying-how-enterprises-build-govern-and-measure-ai-agents)
- [Sierra AI $950M raise - TechCrunch](https://techcrunch.com/2026/05/04/sierra-raises-950m-as-the-race-to-own-enterprise-ai-gets-serious/)
- [Sierra outcome-based pricing](https://sierra.ai/blog/outcome-based-pricing-for-ai-agents)
- [Sierra raises $950M - The AI Insider](https://theaiinsider.tech/2026/05/05/sierra-secures-950m-at-15b-valuation-to-become-global-standard-for-ai-customer-agents/)
- [Decagon $250M Series D - TechCrunch](https://techcrunch.com/2026/03/04/decagon-completes-first-tender-offer-at-4-5b-valuation/)
- [Decagon $250M / $4.5B - CMSWire](https://www.cmswire.com/contact-center/decagon-triples-valuation-to-45b-with-250m-series-d/)
- [Cresta Knowledge Agent launch](https://www.prnewswire.com/news-releases/cresta-launches-knowledge-agent-an-agentic-assistant-delivering-proactive-intelligence-to-contact-center-workers-302715345.html)
- [Cresta Agent Operations Center](https://www.prnewswire.com/news-releases/cresta-launches-agent-operations-center-to-manage-the-human-ai-hybrid-workforce-for-the-customer-experience-302636142.html)
- [/dev/agents profile](https://aiagentstore.ai/ai-agent/dev-agents)
- [Adept Amazon - exits update GeekWire](https://www.geekwire.com/2026/head-of-amazons-agi-lab-is-leaving-in-latest-exit-from-high-profile-adept-deal/)
- [CrewAI](https://crewai.com/)
- [CrewAI statistics 2026](https://www.getpanto.ai/blog/crewai-platform-statistics)
- [LangChain NVIDIA Enterprise Platform](https://www.langchain.com/blog/nvidia-enterprise)
- [LangSmith and LangGraph 2026](https://medium.com/@sehaj23chawla/langsmith-and-langgraph-in-2026-how-langchains-agent-stack-quietly-became-the-default-f1609af5d658)
- [Vellum AI review](https://skywork.ai/blog/vellum-ai-review-prompt-management-evaluation-observability-routing/)
- [Writer Palmyra X5 release](https://writer.com/blog/long-context-palmyra-x5/)
- [Writer event-based agents](https://venturebeat.com/technology/writer-launches-ai-agents-that-can-act-without-prompts-taking-on-amazon-microsoft-and-salesforce)
- [Cohere North](https://cohere.com/north)
- [Cohere North Mini Code](https://venturebeat.com/technology/cohere-open-sources-a-coding-agent-that-runs-on-a-single-h100)

### Category 4: iPaaS / RPA / Integration Legacy
- [Workato ONE platform](https://tooldirectory.ai/tools/workato)
- [Workato vs Boomi - Zapier](https://zapier.com/blog/workato-vs-boomi/)
- [UiPath Agentic Platform launch](https://www.uipath.com/newsroom/uipath-launches-first-enterprise-grade-platform-for-agentic-automation)
- [UiPath Automation Suite on-prem agentic](https://www.uipath.com/newsroom/uipath-automation-suite-delivers-agentic-ai-for-public-sector)
- [Power Automate vs UiPath vs Zapier 2026](https://emerline.com/blog/microsoft-power-automate-vs-uipath-vs-zapier-comparison)

### Cross-cutting / Context
- [A2A protocol explained - OneReach](https://onereach.ai/blog/what-is-a2a-agent-to-agent-protocol/)
- [Enterprise Agentic AI Landscape 2026 - Kai Waehner](https://www.kai-waehner.de/blog/2026/04/06/enterprise-agentic-ai-landscape-2026-trust-flexibility-and-vendor-lock-in/)
- [Enterprise AI Agent Vendor Landscape 2026](https://vdf.ai/blog/enterprise-ai-agent-vendor-landscape-2026/)
- [IDC The Agent Takeover](https://www.idc.com/resource-center/blog/the-agent-takeover-what-happens-when-ai-becomes-the-primary-user-of-enterprise-software/)
