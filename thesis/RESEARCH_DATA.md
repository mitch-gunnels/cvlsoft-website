# AIOS Thesis — Sourced Research Data

Compiled 2026-06-11. Real citations only. Where a claim cannot be substantiated from primary sources, it is flagged. Where the thesis can be strengthened with a better number, a suggested revision is given.

---

## 1. Nikesh Arora at the "2026 Liquidity Summit"

**Claim in thesis:** "Paraphrasing Nikesh Arora, CEO of Palo Alto Networks, at the 2026 Liquidity Summit — the most important lever in the industry today is the ability to run the most efficient enterprise."

**What we found:**
- The 2026 Liquidity Summit is a real, verifiable event. It ran May 31 – June 3, 2026, in Yountville, Napa Valley, presented by the All-In podcast team. Attendance was capped at ~500 LPs and operators at $10,000/person.
- Nikesh Arora was a confirmed on-stage speaker. Other confirmed speakers included Andrej Karpathy (OpenAI), Sarah Friar (CFO, OpenAI), Andrew Feldman (CEO, Cerebras), Senators Dave McCormick and John Fetterman.
- The All-In podcast published an Arora episode on June 8, 2026, titled "Mythos is Real, Analytical SaaS is Dead, and Google can be a $10T company." It is widely understood to draw from his on-stage Liquidity Summit appearance. Published topics include: "Analytical SaaS is dead, so what survives the AI wave?" and "Palo Alto's M&A playbook and the path to $1 trillion." We could not retrieve a written transcript with a literal "most efficient enterprise" quote.
- What is verifiable from Palo Alto Networks' own Q3 FY26 release: PANW hit a record 30.3% non-GAAP operating margin and reaffirmed a target of 40% adjusted FCF margin by FY28. Arora's own quoted commentary on the print was efficiency-flavored: "executing ahead of M&A integration plans and improving profitability across businesses."

**Sources:**
- Local News Matters, "Inside the Liquidity Summit," May 30, 2026: https://localnewsmatters.org/2026/05/30/inside-the-liquidity-summit-private-investor-group-plans-takeover-of-yountville/
- Liquidity Summit official site: https://allinliquidity.com/
- All-In podcast episode (Spotify): https://open.spotify.com/episode/71pSJ1jGYuCig4zqbc3cKr
- Palo Alto Networks Q3 FY26 press release: https://www.paloaltonetworks.com/company/press/2026/palo-alto-networks-reports-fiscal-third-quarter-2026-financial-results

**Verdict:** Needs softening. The event is real and Arora spoke there, but we cannot cite a verbatim "most efficient enterprise" quote from any transcript or recap. Either (a) link to the All-In episode and paraphrase, or (b) ground the efficiency thesis in Arora's documented operating record at PANW (30.3% non-GAAP op margin, 40% FCF margin target).

**Suggested revised language:**
> "Efficiency has become the strategic asset. Palo Alto Networks — whose CEO Nikesh Arora spoke at the 2026 Liquidity Summit and on the June 8 All-In podcast about how AI is reshaping the enterprise software stack — is itself a proof point: 30.3% non-GAAP operating margins in Q3 FY26 with a stated target of 40% adjusted free cash flow margin by FY28. Efficiency generates free cash; free cash buys capability; capability compounds into market position."

---

## 2. "96% of AI pilots fail"

**Claim in thesis:** "96% of AI pilots fail."

**What we found:**
- The widely cited number is **95%**, not 96%. Source: MIT NANDA, "The GenAI Divide: State of AI in Business 2025."
- Methodology: 150 leader interviews, 350 employee survey, 300 public AI deployments analyzed.
- Precise framing: 95% of generative AI pilots fail to deliver measurable P&L impact. Only ~5% achieve rapid revenue acceleration.
- Root cause per MIT: not model quality or regulation, but approach. Buying from specialized vendors / partnering succeeds ~67% of the time; internal builds succeed ~1/3 as often.
- More than half of GenAI budgets go to sales/marketing tools, but the highest ROI is in back-office automation — directly supportive of the AIOS "agentify the legacy stack" play.

**Sources:**
- Fortune, "MIT report: 95% of generative AI pilots at companies are failing," Aug 18, 2025: https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/
- Healthcare IT News summary: https://www.healthcareitnews.com/news/mit-95-enterprise-ai-pilots-fail-deliver-measurable-roi

**Verdict:** Needs replacement (number). Survives in spirit but the correct stat is 95%, not 96%.

**Suggested revised language:**
> "MIT's NANDA initiative (State of AI in Business 2025) found that 95% of enterprise GenAI pilots deliver no measurable P&L impact. Vendor-led / partnered deployments succeed ~2x more often than internal builds, and back-office automation produces the highest ROI — both directly support AIOS's positioning."

---

## 3. MCP (Model Context Protocol) — Roadmap & Adoption

**Claim in thesis:** "MCP and A2A protocols stabilizing inside 12 months."

**What we found:**
- MCP was open-sourced by Anthropic in November 2024.
- Current spec release: **November 2025**.
- In December 2025 Anthropic donated MCP to the **Agentic AI Foundation (AAIF)** under the Linux Foundation, co-founded with Block and OpenAI. This is the strongest possible "stabilization" signal — neutral governance, multi-vendor stewardship.
- The 2026 MCP roadmap (modelcontextprotocol.io) explicitly targets: transport scalability (Streamable HTTP at scale, MCP Server Cards via .well-known URLs), agent communication (Tasks primitive lifecycle), governance maturation (Contributor Ladder SEP), and enterprise readiness (audit trails, SSO, gateway behavior, config portability).
- Adoption signals: native MCP support shipped in Copilot Studio, Claude, ChatGPT, Cursor, and is used by Block, Replit, Sourcegraph, and others.

**Sources:**
- MCP official roadmap: https://modelcontextprotocol.io/development/roadmap
- 2026 MCP Roadmap blog: https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/
- The New Stack on MCP production growing pains: https://thenewstack.io/model-context-protocol-roadmap-2026/
- Original Anthropic announcement: https://www.anthropic.com/news/model-context-protocol

**Verdict:** Survives, strengthen. MCP is already governed under the Linux Foundation. "Stabilizing inside 12 months" understates it.

**Suggested revised language:**
> "MCP is already past the protocol-war phase: Anthropic donated it to the Linux Foundation's Agentic AI Foundation in December 2025 (co-founded with Block and OpenAI). The 2026 roadmap is focused on enterprise-readiness — SSO, audit trails, gateway behavior, transport scalability — not on whether the protocol survives."

---

## 4. Google A2A Protocol — Roadmap, Version, Partners

**Claim in thesis:** "expose the enterprise as agent-callable surfaces via A2A protocols."

**What we found:**
- A2A was announced **April 9, 2025** at Google Cloud Next.
- Launch partners (50+): Atlassian, Box, Cohere, Intuit, Langchain, MongoDB, PayPal, Salesforce, SAP, ServiceNow, UKG, Workday, plus Accenture, BCG, Capgemini, Cognizant, Deloitte, HCLTech, Infosys, KPMG, McKinsey, PwC, TCS, Wipro.
- **June 23, 2025**: Google donated A2A to the Linux Foundation, establishing the Agent2Agent Protocol Project. Founding LF members: AWS, Cisco, Google, Microsoft, Salesforce, SAP, ServiceNow.
- By April 2026, the contributor/adopter list had grown to 150+ organizations.

**Sources:**
- Google Developers Blog announcement (April 9, 2025): https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/
- Linux Foundation press release on A2A Project: https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project-to-enable-secure-intelligent-communication-between-ai-agents
- Google Cloud blog "A2A is getting an upgrade": https://cloud.google.com/blog/products/ai-machine-learning/agent2agent-protocol-is-getting-an-upgrade

**Verdict:** Survives, strengthen with specifics. The A2A claim is well-supported.

**Suggested revised language:**
> "A2A (Agent2Agent) launched April 2025 with 50+ launch partners — Salesforce, SAP, ServiceNow, Workday, Atlassian, Box, MongoDB, PayPal, and the Big 5 consultancies — and was donated to the Linux Foundation in June 2025 under a board that includes AWS, Microsoft, Google, Cisco, Salesforce, SAP, and ServiceNow. By April 2026 the project lists 150+ contributing organizations."

---

## 5. F500 Enterprise SaaS Procurement Cycle Length

**Claim in thesis:** Not in the current thesis as a number, but referenced as context for "18-24 month window."

**What we found:**
- **Forrester 2023 B2B Buying Study**: average enterprise sales cycle rose from 6.4 months (2015) to **9.3 months (2023)**.
- B2B SaaS deals $50K–$500K ACV typically close in 6–9 months. Deals over $500K typically run **9–18 months**.
- Gartner B2B buying journey research: 6–10 stakeholders per buying committee. 77% of buyers describe evaluation as "complex."
- 73% of enterprises added CFO-level approval thresholds above $100K (Gartner 2023 CFO survey), adding ~45 days.
- 82% of enterprise contracts over $500K include a formal POC stage (SAP data 2022-23), adding ~2.4 months.

**Sources:**
- Optifai benchmark (Forrester citation): https://optif.ai/learn/questions/sales-cycle-length-benchmark/
- Gartner SaaS sales cycle guidance: https://www.gartner.com/en/digital-markets/insights/shorten-sales-cycle
- Andrew Turner, "The 9+ Month Reality of Enterprise Sales": https://andrewjturner.substack.com/p/the-9-month-reality-of-enterprise

**Verdict:** Add. Strengthens the "18-24 month window" framing — if a single F500 procurement runs 9-18 months, AIOS realistically gets one to maybe two real shots inside the window before the category is owned.

---

## 6. S&P 500 Cash on Balance Sheets

**Claim in thesis:** Not directly stated; relevant to the "free cash buys capability" argument.

**What we found:**
- Aggregate FactSet figure for total S&P 500 cash & short-term investments not directly retrievable via web search. **This number requires a FactSet subscription to source authoritatively** — not citing it from secondary sources here.
- What is verifiable: the **Magnificent 7** (Alphabet, Amazon, Meta, Microsoft, Apple, Nvidia, Tesla) collectively hold ~$597 billion in cash. The S&P 500 Financials sector alone holds $1.2 trillion (top-50 subset).
- Verifiable adjacent number: S&P 500 12-month buybacks hit a record $1.020 trillion through Sept 2025 (S&P Dow Jones Indices). Total shareholder returns reached a record $1.685 trillion. Companies are deploying cash aggressively — supportive of the "efficiency → free cash → capability" argument.

**Sources:**
- Visual Capitalist on S&P 500 cash by sector: https://www.visualcapitalist.com/which-sp-500-sectors-hold-the-most-cash/
- PR Newswire / S&P Dow Jones Indices on Q3 2025 buybacks: https://www.prnewswire.com/news-releases/sp-500-q3-2025-buybacks-post-modest-6-2-gain-to-249-0-billion-after-declining-20-1-amidst-uncertainty-in-q2-q4-2025-expenditures-expected-to-post-similar-growth-as-2025-anticipates-a-record-1-trillion-302645583.html

**Verdict:** Cannot verify a clean F500/S&P 500 aggregate cash number without FactSet access. Replace with the verifiable buyback record number if you want to make the "deployable cash" point.

**Suggested revised language (if used):**
> "S&P 500 buybacks hit a record ~$1.0 trillion in the 12 months through September 2025 (S&P Dow Jones Indices). Capital allocation, not capital availability, is the binding constraint — making efficiency the lever that compounds."

---

## 7. F500 Operating Efficiency Gap (Top vs. Bottom)

**Claim in thesis:** Not directly stated; implicitly behind the "efficiency as strategic asset" argument.

**What we found:**
- McKinsey "Power Curve" / *Strategy Beyond the Hockey Stick* (Bradley, Hirt, Smit): companies in the **top quintile capture nearly 90% of all economic profit**, averaging $1.4B/year. Middle three quintiles average **$47M/year**. The top is **~30x** the middle.
- Fortune 2025: asset-light tech and finance companies routinely generate 30%+ margins and now account for **53% of all Fortune 500 profits**.
- Only **8% chance** of a mid-quintile company moving to the top quintile over a 10-year horizon.

**Sources:**
- McKinsey "Strategy to beat the odds": https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/strategy-to-beat-the-odds
- McKinsey "Is your strategy good enough to move you up on the power curve?": https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/the-strategy-and-corporate-finance-blog/is-your-strategy-good-enough-to-move-you-up-on-the-power-curve
- Fortune 2025 F500 analysis: https://fortune.com/2025/06/02/fortune-500-profits-revenue-assets-alphabet-apple-2/

**Verdict:** Add. The McKinsey Power Curve is the most legitimizing single data point we have for the "efficiency compounds into market position" thesis. Top quintile takes 90% of profit, middle takes ~3%.

**Suggested revised language:**
> "The economics are stark: McKinsey's Power Curve (Strategy Beyond the Hockey Stick) shows the top quintile of public companies captures ~90% of all economic profit — averaging $1.4B/year vs. $47M for the middle. Efficiency isn't a quality-of-life improvement; it's the difference between the top of the curve and the long flat middle."

---

## 8. Enterprise AI CapEx Trajectory

**Claim in thesis:** Not explicit; implicit in the "shift" narrative.

**What we found (Gartner, May 2026):**
- Worldwide AI spending forecast at **$2.59 trillion in 2026**, **+47% YoY**.
- GenAI spending was $644B in 2025 (+76.4% YoY).
- AI-optimized infrastructure (servers, IaaS, network fabric, AI semis/devices) is the largest segment at 45%+ of spend.
- AI agent software market: **$206.5B in 2026 → $376.3B in 2027** (Gartner).
- Only **17%** of organizations have deployed AI agents to date; **>60%** expect to within 2 years.
- **40% of enterprise applications** will feature task-specific AI agents by end of 2026, up from <5% in 2025 (Gartner).
- Counter-signal: Gartner predicts **>40% of agentic AI projects will be cancelled by end of 2027** due to escalating costs, unclear value, and inadequate controls. This is a direct narrative match for "the harness layer is what's missing."

**Sources:**
- Gartner, "Worldwide AI Spending to Grow 47% in 2026," May 19, 2026: https://www.gartner.com/en/newsroom/press-releases/2026-05-19-gartner-forecasts-worldwide-ai-spending-to-grow-47-percent-in-2026
- Gartner, "40% of Enterprise Apps Will Feature Task-Specific AI Agents by 2026": https://www.gartner.com/en/newsroom/press-releases/2025-08-26-gartner-predicts-40-percent-of-enterprise-apps-will-feature-task-specific-ai-agents-by-2026-up-from-less-than-5-percent-in-2025
- Gartner 2026 Hype Cycle for Agentic AI: https://www.gartner.com/en/articles/hype-cycle-for-agentic-ai

**Verdict:** Add. These are the strongest market-sizing numbers for the deck. Especially the "40% of agentic AI projects will be canceled by 2027" — it lets AIOS position as the harness that prevents that outcome.

---

## 9. EU AI Act — Enforcement Timeline & High-Risk Definition

**Claim in thesis:** "EU AI Act compliance."

**What we found:**
- The bulk of the AI Act becomes enforceable **August 2, 2026**, including most Article 6–15 obligations.
- **Important nuance from May 2026:** the EU agreed to **postpone the Annex III high-risk system obligations** from August 2, 2026 to **December 2, 2027** — a 16-month deferral. Providers selling into Annex III use cases (employment, credit scoring, critical infrastructure, etc.) have more time.
- The Commission has committed to publishing guidelines on Article 6 (high-risk classification) and a "comprehensive list of practical examples" by **February 2, 2026**.
- Article 6: an AI system is high-risk if (a) it is a safety component of a product covered by Annex I EU legislation, or (b) it is listed in Annex III.
- Articles 9–15 obligations for high-risk systems:
  - **Art. 9** — Continuous risk management system across lifecycle
  - **Art. 10** — Data governance, quality, bias mitigation
  - **Art. 11** — Technical documentation
  - **Art. 12** — Automatic logging / record-keeping
  - **Art. 13** — Transparency / information to users
  - **Art. 14** — Human oversight by qualified personnel
  - **Art. 15** — Accuracy, robustness, cybersecurity
- For agentic AI specifically: regulators have flagged that multi-step, multi-tool agentic flows create unique traceability burdens — logging must capture intermediate events, not just final outputs.

**Sources:**
- EU AI Act Article 6: https://artificialintelligenceact.eu/article/6/
- EU AI Act Implementation Timeline: https://artificialintelligenceact.eu/implementation-timeline/
- Travers Smith on May 2026 delay: https://www.traverssmith.com/knowledge/knowledge-container/eu-agrees-to-delay-key-ai-act-compliance-deadlines/
- Inside Privacy (Covington): https://www.insideprivacy.com/artificial-intelligence/eu-ai-act-update-timeline-relief-targeted-simplification-and-new-prohibitions/

**Verdict:** Survives, but **must update for the May 2026 delay** if the thesis pitches an imminent compliance forcing function. The August 2026 deadline still applies to GPAI obligations and the broad architecture; the high-risk deployer obligations are now December 2027.

**Suggested revised language:**
> "Most of the EU AI Act becomes enforceable on August 2, 2026; Annex III high-risk obligations were deferred in May 2026 to December 2, 2027. Either way, autonomous enterprise agents that touch employment, credit, critical infrastructure or essential services hit Articles 9–15 — continuous risk management, full logging of intermediate steps (not just outputs), human oversight, and audit-grade documentation. That stack of controls is the AIOS substrate, not an application-layer concern."

---

## 10. Hyperscaler Agentic AI Roadmaps

**OpenAI**
- January 2025: launched Operator as a research preview (Computer-Using Agent).
- July 17, 2025: launched **ChatGPT Agent**, consolidating Operator + Deep Research + chat into one agentic surface.
- August 31, 2025: standalone Operator shut down; capabilities folded into ChatGPT Agent.
- 2026: agent capabilities exposed via OpenAI Agents SDK and the `computer-use` tool. Available across Plus, Pro, Business, Enterprise.
- Source: https://openai.com/index/introducing-chatgpt-agent/

**Anthropic**
- October 2024: Computer Use launched (Claude as a desktop operator).
- 2026: **Claude Managed Agents** with self-hosted sandboxes — agents can run in your own infra (or via Cloudflare, Daytona, Modal, Vercel) while orchestration loop stays on Anthropic.
- Dynamic Workflows (research preview, Enterprise/Team/Max tiers) — Claude Code planning and running hundreds of parallel sub-agents in one session for codebase-scale migrations.
- Pre-built Skills for Excel, PowerPoint, Word, PDF in 2026. Claude Cowork desktop automation.
- Source: https://www.anthropic.com (verified via Releasebot summary): https://releasebot.io/updates/anthropic/claude

**Google**
- April 2025: A2A protocol announced at Cloud Next.
- 2026: **Vertex AI Agent Builder** rebranded as part of the **Gemini Enterprise Agent Platform** at Cloud Next 2026. Bundles ADK (code-first SDK), Agent Studio (low-code), 200+ foundation models including Gemini and Claude, Agent Engine runtime, persistent memory (Sessions and Memory Bank now GA, billed at $0.25 per 1,000 events from Jan 28, 2026), and governance.
- Source: https://uibakery.io/blog/vertex-ai-agent-builder

**Microsoft**
- May 13, 2026: **Copilot Studio Computer-Using Agents shipped to GA**. Production models include Claude Sonnet 4.5 and OpenAI CUA. Adds Azure Key Vault credential storage, Purview audit logging, human-in-the-loop routing via Outlook.
- November 24, 2025: GPT-5 Chat rolled out to Copilot Studio GA in EU + US regions.
- Source: https://www.microsoft.com/en-us/microsoft-copilot/blog/copilot-studio/new-and-improved-computer-using-agents-a-new-workflows-experience-and-real-time-voice-experiences/

**Verdict:** All four shipped agentic surfaces in 2025-2026. Confirms the macro thesis but raises a real competitive question for AIOS: every hyperscaler is now in this space. The defensible position is the cross-stack abstraction layer, not the agent itself.

---

## 11. Salesforce / ServiceNow / Workday Agents

**Salesforce Agentforce**
- October 2025: **Agentforce 360** announced GA at Dreamforce '25.
- Components GA: Agentforce Builder (conversational dev studio), Agentforce Voice, Agent Script (control language), Agentforce Observability (Analytics + Optimization), Agentforce Vibes (dev productivity), Setup with Agentforce.
- March 2026: **Agentforce Contact Center** launched.
- June 15, 2026: Summer '26 release — **multi-agent orchestration graduates from beta to GA**. New: Customer Engagement Agent (autonomous lead qualification), Momentum (Zoom/Google Meet capture into Salesforce).
- Source: https://www.salesforce.com/news/press-releases/2025/10/13/agentic-enterprise-announcement/

**ServiceNow Now Assist**
- March 2025: AI Agent Orchestrator went GA.
- 2026: Now Assist evolving from GenAI assistant to full agentic platform.
- Specialist agents in rollout: Level 1 Service Desk AI Specialist (Q2 2026), Employee Service Agent, Security Operations Analyst.
- December 2025: **acquired Moveworks**. EmployeeWorks combines Moveworks conversational AI/search with ServiceNow workflows.
- AI Control Tower governs ServiceNow-native agents; third-party agent observability is still limited.
- Source: https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-opens-its-full-system-of-action-to-every-AI-Agent-in-the-enterprise/default.aspx

**Workday Illuminate**
- GA now: Contract Intelligence Agent, Contract Negotiation Agent.
- End of 2025 GA: Self-Service Agent.
- Early 2026 GA: Contingent Sourcing Agent, Document-Driven Accounting Agent, Frontline Agent, Supplier Contracts Agent.
- September 2025: announced new HR/Finance/Industry agents and Workday Data Cloud.
- Source: https://newsroom.workday.com/2025-09-16-Workday-Illuminate-TM-Expands-with-New-AI-Agents-for-HR,-Finance,-and-Industry

**Verdict:** Useful background. Every major SaaS vendor is shipping a native agent layer — strengthens the AIOS argument that the orchestration / abstraction layer above them is the contested ground, not the agents themselves.

---

## 12. Palantir AIP — Direct Competitor Signal

**What we found (verifiable from earnings releases):**
- Total customers: **954 as of Q4 2025**, +34% YoY.
- Customer count grew +45% YoY in Q3 2025 (acceleration earlier in the year, modest deceleration into Q4 as denominator grew).
- ACV expansion examples cited by Palantir leadership: $7M → $31M in a single customer over 2025; $4M → $20M+ in another.
- Top 20 customers TTM revenue: $94M per customer average, +45% YoY.
- Net Dollar Retention: **139%**, +500 bps QoQ.
- **2026 full-year guidance**: revenue $7.182B–$7.198B (midpoint **+61% YoY**). US commercial revenue >$3.144B (**+115%+ YoY**). Adjusted operating income $4.126B–$4.142B. Adjusted FCF $3.925B–$4.125B.

**Sources:**
- Palantir Q3 2025 earnings (8-K): https://www.sec.gov/Archives/edgar/data/0001321655/000132165525000130/a2025q3ex991earningsrelease.htm
- Palantir Q4 2025 earnings highlights: https://www.themarketsdaily.com/2026/02/02/palantir-technologies-q4-earnings-call-highlights.html

**Verdict:** Direct competitor signal. Palantir AIP is the closest large-cap public proxy for "enterprise agentic harness" — and is growing US commercial revenue 115%+ in 2026 guidance. AIOS needs to articulate why it wins the bottom 95% of the F500 that Palantir doesn't serve (price point, deployment time, vertical depth, no-FDE-army model).

---

## Data points the thesis should add

1. **Gartner 2026 AI agent software TAM**: $206.5B in 2026 → $376.3B in 2027. (Direct market sizing for AIOS.) Source: Gartner press release, May 19, 2026.

2. **Gartner: >40% of agentic AI projects will be cancelled by end of 2027** due to cost, unclear value, inadequate controls. (This is the "why AIOS exists" stat — it's the harness layer that prevents that outcome.) Source: Gartner 2026 Hype Cycle for Agentic AI.

3. **MIT NANDA: 95% of GenAI pilots deliver no measurable P&L impact; vendor-led deployments succeed ~2x more than internal builds; back-office automation is the highest-ROI category.** (All three points support the AIOS positioning.) Source: MIT NANDA "State of AI in Business 2025."

4. **McKinsey Power Curve: top quintile captures ~90% of all economic profit; 30x the middle.** (Anchors "efficiency compounds into market position.") Source: Bradley/Hirt/Smit, *Strategy Beyond the Hockey Stick* / McKinsey.

5. **A2A is governed by the Linux Foundation under a board that includes AWS, Microsoft, Google, Cisco, Salesforce, SAP, ServiceNow — 150+ contributing organizations by April 2026. MCP is governed by the Linux Foundation's Agentic AI Foundation, co-founded with Block and OpenAI.** (Removes the "but will the protocol survive?" objection.) Sources: Linux Foundation press releases.

## Claims that cannot be verified

1. **Nikesh Arora's verbatim "most efficient enterprise" quote at the Liquidity Summit.** The event is real, he spoke, but no transcript or written recap with this line is publicly retrievable. Recommend: paraphrase + link to the All-In podcast episode, or pivot to Arora's documented 30.3% op margin / 40% FCF margin target at PANW.

2. **"96% of AI pilots fail."** Real number is 95% per MIT NANDA. Trivial fix.

3. **"18-24 month window before this layer is owned."** No public source for this specific window. It's a defensible opinion grounded in protocol consolidation timelines (MCP and A2A are LF-governed now) and hyperscaler agent GA dates (May 2026 for Copilot Studio CUA, June 2026 for Agentforce multi-agent orchestration). Recommend framing as a thesis, not a sourced fact.

4. **"Outcome-based pricing."** Not researched — this is a positioning claim, not an external data point.

5. **Aggregate S&P 500 cash on balance sheets.** FactSet-gated. Recommend substituting the verifiable $1.0T 2025 buyback record from S&P Dow Jones Indices if you want to make the "deployable cash" point.

6. **"Customer interface moving off the screen inside 18 months — a meaningful share of enterprise interactions will happen through ChatGPT, Claude, and vertical agents."** Defensible directionally but no clean source for "18 months" or "meaningful share." Gartner's "40% of enterprise apps will feature task-specific AI agents by end of 2026" is the closest hard number.
