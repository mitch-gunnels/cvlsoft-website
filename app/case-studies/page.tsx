"use client";

import { useState } from "react";
import SiteHeader from "../components/SiteHeader";

const ROLES = [
  {
    role: "Finance",
    summary:
      "Chief Financial Officers juggle 275 software subscriptions at $49M a year while 86% of finance teams have seen AI fabricate numbers. AIOS runs accounts payable, close, and reconciliation through one governed core with evidence-grade audit trails — priced on successful outcomes, not per-seat.",
    icon: "/use-cases/briefcase.avif",
    tasks: [
      "Ingest every inbound invoice — extract line items, match to purchase orders, post to the finance system, chase missing receipts",
      "Reconcile daily bank statements against the general ledger, flag anomalies, post corrections",
      "Run month-end close across every sub-ledger — reconcile intercompany, post accruals, surface variances",
      "Onboard a new vendor end-to-end: validate tax ID, screen sanctions lists, verify banking, create the record",
      "Draft the weekly variance report — pull actuals, compare to forecast, write commentary, send to the finance chief",
    ],
  },
  {
    role: "Operations",
    summary:
      "54% of Chief Operating Officers worry about agentic AI compliance — they own the blast radius when an agent takes the wrong action. AIOS plans before executing, scopes every tool call to a revocable identity, and replaces bot-per-process automation sprawl with one adaptive core.",
    icon: "/use-cases/clip.avif",
    tasks: [
      "Take a customer order from intake through credit check, allocation, carrier booking, invoice, and delivery — across every system it touches",
      "Handle a shipment exception: detect the delay, reroute, notify the customer, adjust downstream orders, calculate the service-level credit",
      "Process a return end-to-end: inspect, approve, issue the credit memo, update inventory, close the loop",
      "Onboard a new supplier: send the non-disclosure agreement, collect insurance certificates, verify compliance, create master data",
      "Run the overnight queue while the team is offline — resolve exceptions that don't need judgment, escalate the ones that do with full context",
    ],
  },
  {
    role: "Customer Service",
    summary:
      "91% of customer experience leaders are under board pressure to ship AI, but disconnected point agents for chat, voice, and agent-assist are drowning teams. AIOS is one governed core for every channel — you only pay for resolutions.",
    icon: "/use-cases/customer_support.avif",
    tasks: [
      "Triage an angry support email — pull billing and product history, draft a policy-grounded response, route to the right owner",
      "Resolve a password reset, subscription change, or refund request end-to-end — no human needed for tier-1",
      "Prep an escalation call: pull the full relationship history and draft a resolution plan before the human picks up",
      "Monitor every live chat, surface risk signals, and escalate when fraud, churn, or legal language appears",
      "Close the loop after every resolution — log notes, update the customer record, schedule follow-up, capture knowledge for next time",
    ],
  },
  {
    role: "Sales & Revenue",
    summary:
      "40%+ of enterprise deals stall because the full buying group isn't mapped, and AI sales-development bots burned your sender reputation in 2025. AIOS coordinates research, outbound, quoting, and contract operations through one governed core — outcome-priced.",
    icon: "/use-cases/bars.avif",
    tasks: [
      "Enrich, score, and route a new inbound lead in seconds — no more Monday-morning lead triage",
      "Research an enterprise account overnight: org chart, recent news, tech stack, competitor footprint, draft a tailored point of view",
      "Prep every meeting — pull relationship history, draft talking points, send the pre-read, log the call after",
      "Map the full buying group for a deal — find every internal and external stakeholder and coordinate outreach across them",
      "Shepherd a contract through redline, pricing, and signature — the rep stays on the phone, not in DocuSign",
    ],
  },
  {
    role: "IT & Security",
    summary:
      "1 in 5 breaches now involve shadow AI, adding $670K per incident — yet only 6% of orgs deploying agents have updated governance. AIOS is one identity-scoped, policy-enforced cognitive core, not 20 ungoverned agents with god-mode service accounts.",
    icon: "/use-cases/code.avif",
    tasks: [
      "Resolve a password reset, remote-access certificate renewal, or single sign-on group request with one message",
      "Provision a new hire across every system on day one — and de-provision the moment offboarding fires",
      "Triage a security alert: correlate signals, check the runbook, auto-remediate or page the right person with full context",
      "Run a quarterly access review: pull entitlements, flag anomalies, route to managers, close out the campaign",
      "Coordinate a laptop refresh end-to-end — order, ship, configure, pick up the old device, wipe, retire",
    ],
  },
  {
    role: "Risk & Compliance",
    summary:
      "The EU AI Act is fully enforceable August 2, 2026, and 78% of execs can't pass an AI governance audit in 90 days. AIOS ships evidence packages mapped to Articles 9, 11, 12, and 17 — built for independent audit from day one.",
    icon: "/use-cases/legal.avif",
    tasks: [
      "Pull audit evidence from every relevant system against the control checklist, identify gaps, draft the auditor's response",
      "Screen a new vendor end-to-end: sanctions lists, tax ID verification, financial health, service-level history, risk score",
      "Review a vendor contract against your playbook — extract terms, flag deviations, route non-standard clauses to legal",
      "Aggregate data across business units for a regulatory filing, validate against the rule, format and submit",
      "Monitor every AI-driven action in the organization for policy violations — automatically log incidents to the risk register",
    ],
  },
];

export default function CaseStudiesPage() {
  const [flippedRoles, setFlippedRoles] = useState<Set<number>>(new Set());

  return (
    <div className="min-h-screen bg-[#050a14] text-slate-100">
      <SiteHeader />

      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="px-6 sm:px-20 lg:px-[112px]">
          <p className="inline-block rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-1.5 font-mono text-[13px] tracking-[0.18em] text-slate-400">
            CASE STUDIES
          </p>
          <h1 className="mt-5 text-[clamp(2rem,5vw,3.5rem)] font-light tracking-[-0.03em] text-white">
            Enterprise <span className="text-cyan-400">Autonomous Agentic AI</span> Operations.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-400 md:text-xl">
            One cognitive core across every enterprise function. The same platform classifies a single ticket in seconds or runs a full operation forever.
          </p>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ROLES.map((r, i) => {
              const isFlipped = flippedRoles.has(i);
              return (
                <div key={r.role} className="min-h-[460px] [perspective:1200px]">
                  <button
                    type="button"
                    aria-pressed={isFlipped}
                    aria-label={`${r.role} — ${isFlipped ? "hide" : "show"} example use cases`}
                    onClick={() =>
                      setFlippedRoles((prev) => {
                        const next = new Set(prev);
                        if (next.has(i)) next.delete(i);
                        else next.add(i);
                        return next;
                      })
                    }
                    className={`group relative h-full min-h-[460px] w-full cursor-pointer text-left transition-transform duration-700 [transform-style:preserve-3d] ${
                      isFlipped ? "[transform:rotateY(180deg)]" : ""
                    }`}
                  >
                    <div className="absolute inset-0 flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 transition [backface-visibility:hidden] [-webkit-backface-visibility:hidden] group-hover:border-cyan-400/40">
                      <img
                        src={r.icon}
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-[40px] -right-[60px] z-0 h-72 w-72 object-contain object-right-bottom opacity-15"
                      />
                      <h3 className="relative text-lg font-semibold text-white">{r.role}</h3>
                      <p className="relative mt-3 text-sm leading-relaxed text-slate-400">{r.summary}</p>
                      <span className="relative mt-auto pt-4 font-mono text-[13px] uppercase tracking-[0.18em] text-cyan-400 transition">
                        Workflows AIOS runs autonomously &rarr;
                      </span>
                    </div>

                    <div className="absolute inset-0 flex flex-col overflow-hidden rounded-xl border border-cyan-400/40 bg-white/[0.03] p-6 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <h3 className="relative text-lg font-semibold text-white">{r.role}</h3>
                      <p className="relative mt-1 font-mono text-[13px] uppercase tracking-[0.18em] text-cyan-400">Workflows AIOS runs autonomously</p>
                      <ul className="relative mt-4 space-y-2.5">
                        {r.tasks.map((t) => (
                          <li key={t} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-300">
                            <span className="mt-[7px] block h-1 w-1 shrink-0 rounded-full bg-cyan-400" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                      <span className="relative mt-auto pt-4 font-mono text-[13px] uppercase tracking-[0.18em] text-slate-500">
                        &larr; Back
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
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
