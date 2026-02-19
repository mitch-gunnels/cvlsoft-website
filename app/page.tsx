"use client";

import { FormEvent, type ReactNode, useMemo, useState } from "react";
import { trackEvent } from "@/app/lib/analytics";

type DemoStatus = "idle" | "loading" | "success" | "error";

/* ── Icon components ── */

function IconEye({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2.5 12C4.5 7 8 4.5 12 4.5S19.5 7 21.5 12c-2 5-5.5 7.5-9.5 7.5S4.5 17 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconCpu({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
    </svg>
  );
}

function IconGrid({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconRocket({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M13.13 22a10 10 0 0 1-1.3-3.43 10 10 0 0 1 3.43 1.3L13.13 22ZM6.87 2a10 10 0 0 1 1.3 3.43 10 10 0 0 1-3.43-1.3L6.87 2Z" />
      <path d="M2 12h5M17 12h5" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconLink({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/* ── Architecture diagram ── */

const NODE_LABEL: React.CSSProperties = {
  fontSize: "9px",
  fontWeight: 600,
  letterSpacing: "0.1em",
  fill: "#334155",
};

const CORE_LABEL: React.CSSProperties = {
  fontSize: "9.5px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  fill: "#0e7490",
};

const SUB_LABEL: React.CSSProperties = {
  fontSize: "7px",
  fontWeight: 600,
  letterSpacing: "0.06em",
  fill: "#475569",
};

const POLICY_ITEMS = [
  { label: "CSO", cx: 153 },
  { label: "SOX CONTROLS", cx: 251 },
  { label: "DATA REDACTION", cx: 349 },
  { label: "CONSTITUTIONS", cx: 447 },
];

const KNOWLEDGE_ITEMS = [
  { label: "SOPS / MP", cx: 12 },
  { label: "RUNBOOKS", cx: 110 },
  { label: "SCREEN CAPTURE", cx: 208 },
];

const CONNECTOR_ITEMS = [
  { label: "MAINFRAME", cx: 108 },
  { label: "SHARED DBS", cx: 204 },
  { label: "APIS", cx: 300 },
  { label: "ERP / SAP", cx: 396 },
  { label: "LEGACY ECOSYSTEM", cx: 492 },
];

function ArchitectureDiagram() {
  return (
    <div className="reveal-up relative [animation-delay:200ms]">
      <div className="hero-glow" />
      <svg
        viewBox="-50 -5 700 510"
        fill="none"
        className="relative z-10 mx-auto w-full"
        role="img"
        aria-label="Architecture: Agnostic Agent Core connected to Operational Knowledge, Policy Engine, Evidence/Observability, and Connectors Layer"
      >
        <defs>
          <radialGradient id="core-glow">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="core-fill">
            <stop offset="0%" stopColor="#ecfeff" />
            <stop offset="100%" stopColor="#cffafe" />
          </radialGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.07" />
          </filter>
          {/* Animation motion paths (invisible) */}
          <path id="dot-top" d="M300,80 L300,160" />
          <path id="dot-left" d="M185,222 L238,222" />
          <path id="dot-right" d="M362,222 L415,222" />
          <path id="dot-bottom-out" d="M300,284 L300,364" />
          <path id="dot-bottom-in" d="M300,364 L300,284" />
        </defs>

        {/* Pulse rings */}
        <circle cx="300" cy="222" r="100" stroke="#22d3ee" strokeOpacity="0.07" strokeWidth="1">
          <animate attributeName="stroke-opacity" values="0.05;0.14;0.05" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="300" cy="222" r="140" stroke="#22d3ee" strokeOpacity="0.05" strokeWidth="1">
          <animate attributeName="stroke-opacity" values="0.03;0.09;0.03" dur="4s" begin="0.7s" repeatCount="indefinite" />
        </circle>
        <circle cx="300" cy="222" r="185" stroke="#22d3ee" strokeOpacity="0.03" strokeWidth="1">
          <animate attributeName="stroke-opacity" values="0.02;0.06;0.02" dur="4s" begin="1.4s" repeatCount="indefinite" />
        </circle>

        {/* Visible connection lines */}
        <line x1="300" y1="80" x2="300" y2="160" stroke="#22d3ee" strokeOpacity="0.25" strokeWidth="1.5" />
        <line x1="185" y1="222" x2="238" y2="222" stroke="#22d3ee" strokeOpacity="0.25" strokeWidth="1.5" />
        <line x1="362" y1="222" x2="415" y2="222" stroke="#22d3ee" strokeOpacity="0.25" strokeWidth="1.5" />
        <line x1="300" y1="284" x2="300" y2="364" stroke="#22d3ee" strokeOpacity="0.25" strokeWidth="1.5" />

        {/* Connection terminals */}
        {[[300,160],[300,80],[362,222],[415,222],[300,284],[300,364],[238,222],[185,222]].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="2.5" fill="#22d3ee" opacity="0.4" />
        ))}

        {/* Animated dots — Policy Engine → Core (inward) */}
        <circle r="3" fill="#22d3ee" opacity="0.8">
          <animateMotion dur="2.5s" repeatCount="indefinite"><mpath href="#dot-top" /></animateMotion>
        </circle>
        {/* Operational Knowledge → Core (inward) */}
        <circle r="3" fill="#22d3ee" opacity="0.8">
          <animateMotion dur="2.8s" begin="0.4s" repeatCount="indefinite"><mpath href="#dot-left" /></animateMotion>
        </circle>
        {/* Core → Evidence/Observability (outward) */}
        <circle r="3" fill="#22d3ee" opacity="0.8">
          <animateMotion dur="2.6s" begin="0.8s" repeatCount="indefinite"><mpath href="#dot-right" /></animateMotion>
        </circle>
        {/* Core → Connectors (outward) */}
        <circle r="3" fill="#22d3ee" opacity="0.8">
          <animateMotion dur="2.6s" repeatCount="indefinite"><mpath href="#dot-bottom-out" /></animateMotion>
        </circle>
        {/* Connectors → Core (inward) */}
        <circle r="3" fill="#22d3ee" opacity="0.8">
          <animateMotion dur="2.6s" begin="1.3s" repeatCount="indefinite"><mpath href="#dot-bottom-in" /></animateMotion>
        </circle>

        {/* Center glow */}
        <circle cx="300" cy="222" r="88" fill="url(#core-glow)">
          <animate attributeName="r" values="84;92;84" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* Center node — Agnostic Agent Core */}
        <circle cx="300" cy="222" r="62" fill="url(#core-fill)" stroke="#22d3ee" strokeOpacity="0.3" strokeWidth="1.5" filter="url(#shadow)" />
        <text x="300" y="216" textAnchor="middle" dominantBaseline="middle" style={CORE_LABEL}>AGNOSTIC</text>
        <text x="300" y="232" textAnchor="middle" dominantBaseline="middle" style={CORE_LABEL}>AGENT CORE</text>

        {/* Top — Policy Engine */}
        <rect x="243" y="36" width="114" height="44" rx="10" fill="white" stroke="#e2e8f0" strokeWidth="1.5" filter="url(#shadow)" />
        <text x="300" y="60" textAnchor="middle" dominantBaseline="middle" style={NODE_LABEL}>POLICY ENGINE</text>

        {/* Policy sub-items fan (above) */}
        <circle cx="300" cy="36" r="2" fill="#94a3b8" opacity="0.5" />
        {POLICY_ITEMS.map((item) => (
          <g key={item.label}>
            <line x1="300" y1="36" x2={item.cx} y2="26" stroke="#94a3b8" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 2" />
            <circle cx={item.cx} cy="26" r="1.5" fill="#94a3b8" opacity="0.4" />
            <rect x={item.cx - 45} y="2" width="90" height="22" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
            <text x={item.cx} y="15" textAnchor="middle" dominantBaseline="middle" style={SUB_LABEL}>{item.label}</text>
          </g>
        ))}

        {/* Right — Evidence / Observability */}
        <rect x="415" y="197" width="150" height="50" rx="10" fill="white" stroke="#e2e8f0" strokeWidth="1.5" filter="url(#shadow)" />
        <text x="490" y="216" textAnchor="middle" dominantBaseline="middle" style={NODE_LABEL}>EVIDENCE /</text>
        <text x="490" y="232" textAnchor="middle" dominantBaseline="middle" style={NODE_LABEL}>OBSERVABILITY</text>

        {/* Bottom — Connectors Layer */}
        <rect x="238" y="364" width="124" height="50" rx="10" fill="white" stroke="#e2e8f0" strokeWidth="1.5" filter="url(#shadow)" />
        <text x="300" y="384" textAnchor="middle" dominantBaseline="middle" style={NODE_LABEL}>CONNECTORS</text>
        <text x="300" y="400" textAnchor="middle" dominantBaseline="middle" style={NODE_LABEL}>LAYER</text>

        {/* Left — Operational Knowledge */}
        <rect x="35" y="197" width="150" height="50" rx="10" fill="white" stroke="#e2e8f0" strokeWidth="1.5" filter="url(#shadow)" />
        <text x="110" y="216" textAnchor="middle" dominantBaseline="middle" style={NODE_LABEL}>OPERATIONAL</text>
        <text x="110" y="232" textAnchor="middle" dominantBaseline="middle" style={NODE_LABEL}>KNOWLEDGE</text>

        {/* Op Knowledge sub-items fan (below) */}
        <circle cx="110" cy="247" r="2" fill="#94a3b8" opacity="0.5" />
        {KNOWLEDGE_ITEMS.map((item) => (
          <g key={item.label}>
            <line x1="110" y1="247" x2={item.cx} y2="264" stroke="#94a3b8" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 2" />
            <circle cx={item.cx} cy="264" r="1.5" fill="#94a3b8" opacity="0.4" />
            <rect x={item.cx - 45} y="266" width="90" height="22" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
            <text x={item.cx} y="279" textAnchor="middle" dominantBaseline="middle" style={SUB_LABEL}>{item.label}</text>
          </g>
        ))}

        {/* Connector sub-items fan */}
        <circle cx="300" cy="414" r="2" fill="#94a3b8" opacity="0.5" />
        {CONNECTOR_ITEMS.map((item) => (
          <g key={item.label}>
            <line x1="300" y1="414" x2={item.cx} y2="450" stroke="#94a3b8" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 2" />
            <circle cx={item.cx} cy="450" r="1.5" fill="#94a3b8" opacity="0.4" />
            <rect x={item.cx - 45} y="452" width="90" height="22" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
            <text x={item.cx} y="465" textAnchor="middle" dominantBaseline="middle" style={SUB_LABEL}>{item.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ── Data ── */

const PROBLEMS = [
  {
    title: "Workflow sprawl",
    description: "Every use case becomes bespoke logic. Fragile systems, zero reuse.",
  },
  {
    title: "Point solutions",
    description: "Automation tied to individual apps. Breaks when environments shift.",
  },
  {
    title: "Maintenance tax",
    description: "Teams spend more time patching drift than delivering value.",
  },
];

const DIFFERENTIATORS: { title: string; description: string; icon: ReactNode }[] = [
  {
    title: "Observational learning",
    description: "We capture tacit operator behavior — not just what's documented, but how work actually gets done.",
    icon: <IconEye className="h-5 w-5" />,
  },
  {
    title: "Core super agents",
    description: "A reusable agent system ingests operational knowledge. No more building one-off workflows for every use case.",
    icon: <IconCpu className="h-5 w-5" />,
  },
  {
    title: "Composable SME layer",
    description: "Subject matter experts compose outcomes directly. Zero agentic AI expertise required.",
    icon: <IconGrid className="h-5 w-5" />,
  },
  {
    title: "Forward deploy teams",
    description: "Our engineers embed with yours to drive adoption in real enterprise environments.",
    icon: <IconRocket className="h-5 w-5" />,
  },
  {
    title: "Security & observability",
    description: "Deterministic policy gates, circuit breakers, ephemeral credentials, and evidence-grade audit trails.",
    icon: <IconShield className="h-5 w-5" />,
  },
  {
    title: "Connector fabric",
    description: "API, database, event queue, RPA, terminal, and browser — unified under one execution contract.",
    icon: <IconLink className="h-5 w-5" />,
  },
];

/* ── Page ── */

export default function Home() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [formStatus, setFormStatus] = useState<DemoStatus>("idle");
  const [formMessage, setFormMessage] = useState("");
  const year = useMemo(() => new Date().getFullYear(), []);

  function handleCtaClick(location: string) {
    trackEvent("bold_claim_cta_click", { location });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("loading");
    setFormMessage("");

    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company,
          source: "website_v2",
          timestamp: new Date().toISOString(),
        }),
      });

      const data = (await response.json()) as { ok?: boolean; message?: string };
      trackEvent("demo_form_submit", { status: response.ok ? "success" : "error" });

      if (!response.ok) {
        setFormStatus("error");
        setFormMessage(data.message ?? "Unable to submit demo request.");
        return;
      }

      setFormStatus("success");
      setFormMessage(data.message ?? "Thanks. We will follow up to schedule your demo.");
      setEmail("");
      setCompany("");
    } catch {
      setFormStatus("error");
      setFormMessage("Network error. Please try again.");
      trackEvent("demo_form_submit", { status: "error" });
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[var(--bg-root)] text-[var(--text-primary)]">
      <div className="hero-noise pointer-events-none fixed inset-0 -z-20" />

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-3 text-sm font-semibold text-slate-950">
            <svg viewBox="0 0 48 48" fill="none" className="h-8 w-8" aria-hidden="true">
              <path d="M32 10 A18 18 0 1 0 32 38" stroke="#0e7490" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
              <path d="M30 16 A12 12 0 1 0 30 32" stroke="#22d3ee" strokeWidth="4" fill="none" strokeLinecap="round"/>
              <path d="M28 21 A6 6 0 1 0 28 27" stroke="#67e8f9" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            </svg>
            <span>
              <span className="text-slate-500">Converged Value Layer Software</span>{" "}
              <span className="font-mono tracking-[0.12em]">(cvlSoft)</span>
            </span>
          </a>
          <div className="flex items-center gap-8">
            <a href="#problem" className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-950 md:block">
              The Problem
            </a>
            <a href="#platform" className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-950 md:block">
              Platform
            </a>
            <a
              href="#demo"
              onClick={() => handleCtaClick("header")}
              className="rounded-full bg-slate-950 px-5 py-2.5 text-xs font-semibold tracking-[0.12em] text-white transition hover:bg-slate-800"
            >
              REQUEST DEMO
            </a>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* ── HERO ── */}
        <section className="relative mx-auto grid max-w-7xl items-start gap-10 px-6 py-16 lg:min-h-[88vh] lg:grid-cols-[2fr_3fr] lg:gap-12 lg:py-0 lg:pt-24">
          {/* Background glows */}
          <div className="pointer-events-none absolute -left-40 top-0 -z-10 h-[500px] w-[600px] rounded-full bg-cyan-100/40 blur-[100px]" />
          <div className="pointer-events-none absolute -right-20 bottom-20 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-100/30 blur-[100px]" />

          {/* Floating decorative elements */}
          <div className="pointer-events-none absolute left-[12%] top-[18%] -z-10 h-2 w-2 rounded-full bg-cyan-400/60 float-slow" />
          <div className="pointer-events-none absolute right-[20%] top-[12%] -z-10 h-3 w-3 rounded-full border border-cyan-300/50 float-slow" style={{ animationDelay: "1.5s" }} />
          <div className="pointer-events-none absolute left-[8%] bottom-[15%] -z-10 h-2.5 w-2.5 rounded-full bg-indigo-300/40 float-slow" style={{ animationDelay: "3s" }} />
          <div className="pointer-events-none absolute right-[10%] bottom-[25%] -z-10 h-1.5 w-1.5 rounded-full bg-cyan-500/50 float-slow" style={{ animationDelay: "4.5s" }} />

          {/* Text — 40% */}
          <div className="reveal-up max-w-xl">
            <p className="inline-block rounded-full border border-slate-300 bg-white px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] text-slate-600">
              ENTERPRISE AUTONOMY PLATFORM
            </p>

            <h1 className="mt-7 text-5xl font-bold leading-[1.05] tracking-tight text-slate-950 md:text-6xl lg:text-7xl">
              Agentic AI,{" "}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
                done right.
              </span>
            </h1>

            <p className="mt-4 text-xl font-semibold tracking-tight text-slate-800 md:text-2xl">
              Enterprise scale. Zero technical debt.
            </p>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 md:text-lg">
              Your operational knowledge becomes reusable super agents
              with deterministic controls and evidence-grade observability.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#demo"
                onClick={() => handleCtaClick("hero_primary")}
                className="rounded-full bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-950/20"
              >
                Request Demo
              </a>
              <a
                href="#platform"
                onClick={() => handleCtaClick("hero_secondary")}
                className="rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-slate-500"
              >
                How It Works
              </a>
            </div>
          </div>

          {/* Architecture diagram — 60% */}
          <ArchitectureDiagram />
        </section>

        {/* ── INDUSTRY PROBLEM ── */}
        <section id="problem" className="relative border-y border-slate-200/80 bg-white px-6 py-20 md:py-24">
          <div className="pointer-events-none absolute right-0 top-0 -z-10 h-80 w-80 rounded-full bg-rose-100/40 blur-[80px]" />

          <div className="mx-auto max-w-7xl">
            <h2 className="reveal-up max-w-4xl text-3xl font-bold leading-snug text-slate-950 md:text-5xl md:leading-snug">
              The industry is building{" "}
              <span className="underline decoration-rose-400 decoration-[3px] underline-offset-4">
                brittle, error-prone
              </span>{" "}
              agentic workflows at scale.
            </h2>
            <p className="reveal-up mt-5 max-w-2xl text-lg text-slate-600 [animation-delay:80ms]">
              Custom point solutions with a hidden maintenance cost that
              compounds over time. Every new workflow is more debt.
            </p>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {PROBLEMS.map((item, index) => (
                <article
                  key={item.title}
                  className="reveal-up rounded-2xl border border-slate-200 border-l-4 border-l-rose-400 bg-slate-50 p-5"
                  style={{ animationDelay: `${120 + 80 * index}ms` }}
                >
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY CVLSOFT IS DIFFERENT ── */}
        <section id="platform" className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="pointer-events-none absolute right-0 bottom-0 -z-10 h-96 w-96 rounded-full bg-indigo-100/20 blur-[100px]" />
          <div className="pointer-events-none absolute -left-10 top-1/2 -z-10 h-72 w-72 rounded-full bg-cyan-100/25 blur-[80px]" />

          <h2 className="reveal-up text-3xl font-bold text-slate-950 md:text-5xl">
            Why cvlSoft is different.
          </h2>
          <p className="reveal-up mt-4 max-w-2xl text-lg text-slate-600 [animation-delay:80ms]">
            Others stitch together point solutions. We compile durable
            operational capability from a core set of powerful super agents.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {DIFFERENTIATORS.map((item, index) => (
              <article
                key={item.title}
                className="reveal-up rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50"
                style={{ animationDelay: `${120 + 60 * index}ms` }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── DEMO CTA ── */}
        <section id="demo" className="mx-auto max-w-7xl px-6 pb-24">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-10 md:p-16">
            {/* Decorative orbs inside dark section */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[60px]" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-[60px]" />

            <h2 className="relative text-center text-3xl font-bold text-white md:text-5xl">
              See it in your environment.
            </h2>
            <p className="relative mt-4 text-center text-base text-slate-400">
              Work email only. Fast architecture walkthrough.
            </p>

            <form className="relative mx-auto mt-8 grid max-w-md gap-3" onSubmit={handleSubmit}>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                placeholder="Work email"
              />
              <input
                id="company"
                name="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                placeholder="Company (optional)"
              />
              <button
                type="submit"
                disabled={formStatus === "loading"}
                onClick={() => handleCtaClick("demo_form")}
                className="mt-2 rounded-full bg-cyan-400 px-8 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formStatus === "loading" ? "Submitting..." : "Request Demo"}
              </button>
              {formMessage ? (
                <p className={`text-sm ${formStatus === "error" ? "text-rose-300" : "text-emerald-300"}`}>
                  {formMessage}
                </p>
              ) : null}
            </form>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 text-xs text-slate-500 md:flex-row">
          <p>&copy; {year} cvlSoft</p>
          <p>Enterprise autonomy without automation debt.</p>
        </div>
      </footer>
    </div>
  );
}
