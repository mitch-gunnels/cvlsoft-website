"use client";

import { FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
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

function IconUsers({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
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
          {/* Motion paths */}
          <path id="dot-top" d="M300,80 L300,160" />
          <path id="dot-left" d="M185,222 L238,222" />
          <path id="dot-right" d="M362,222 L415,222" />
          {/* Bottom I/O dual lanes — Core initiates */}
          <path id="out-bottom" d="M297,284 L297,364" />
          <path id="in-bottom" d="M303,364 L303,284" />
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
        {/* Bottom — dual I/O lanes offset ±3 */}
        <line x1="297" y1="284" x2="297" y2="364" stroke="#22d3ee" strokeOpacity="0.20" strokeWidth="1.5" />
        <line x1="303" y1="284" x2="303" y2="364" stroke="#22d3ee" strokeOpacity="0.20" strokeWidth="1.5" />

        {/* Connection terminals */}
        {[[300,160],[300,80],[362,222],[415,222],[300,284],[300,364],[238,222],[185,222]].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="2.5" fill="#22d3ee" opacity="0.4" />
        ))}

        {/* ── Original dots: top, left, right ── */}
        {/* Policy Engine → Core (inward) */}
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

        {/* ── Bottom I/O: Core initiates, multiple dots per lane ── */}
        {/* OUT lane (left line) — Core → Connectors, dots flowing down */}
        <circle r="3" fill="#22d3ee" opacity="0.8">
          <animateMotion dur="2s" begin="0s" repeatCount="indefinite"><mpath href="#out-bottom" /></animateMotion>
        </circle>
        <circle r="2.5" fill="#22d3ee" opacity="0.5">
          <animateMotion dur="2s" begin="1s" repeatCount="indefinite"><mpath href="#out-bottom" /></animateMotion>
        </circle>
        {/* IN lane (right line) — Connectors → Core, dots flowing up */}
        <circle r="3" fill="#67e8f9" opacity="0.8">
          <animateMotion dur="2s" begin="0.5s" repeatCount="indefinite"><mpath href="#in-bottom" /></animateMotion>
        </circle>
        <circle r="2.5" fill="#67e8f9" opacity="0.5">
          <animateMotion dur="2s" begin="1.5s" repeatCount="indefinite"><mpath href="#in-bottom" /></animateMotion>
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

const FUNNEL_STAGES = [
  { label: "Start AI initiative", pct: 100 },
  { label: "Reach proof of concept", pct: 60 },
  { label: "Reach pilot", pct: 20 },
  { label: "Full production", pct: 5 },
];

const FAILURE_REASONS = [
  { label: "Governance & compliance", pct: 34 },
  { label: "Integration complexity", pct: 28 },
  { label: "Accuracy below threshold", pct: 22 },
  { label: "Maintenance & drift", pct: 16 },
];

const DIFFERENTIATORS: { title: string; description: string; icon: ReactNode }[] = [
  {
    title: "Persona-centric, not workflow-centric",
    description: "We build around roles, not rigid flows. AIOS maps capabilities to personas so agents adapt to how your people actually work — not the other way around.",
    icon: <IconUsers className="h-5 w-5" />,
  },
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [formStatus, setFormStatus] = useState<DemoStatus>("idle");
  const [formMessage, setFormMessage] = useState("");
  const year = useMemo(() => new Date().getFullYear(), []);

  /* Scroll-triggered reveal animations */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    document
      .querySelectorAll(".reveal-up, .scale-in, .cascade, .row-fade")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (formStatus !== "success") return;
    const timer = setTimeout(() => {
      setFormStatus("idle");
      setFormMessage("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [formStatus]);

  function handleCtaClick(location: string) {
    trackEvent("bold_claim_cta_click", { location });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("idle");
    setFormMessage("");

    // Client-side validation
    if (!firstName.trim()) {
      setFormStatus("error");
      setFormMessage("Please enter your first name.");
      return;
    }
    if (!lastName.trim()) {
      setFormStatus("error");
      setFormMessage("Please enter your last name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormStatus("error");
      setFormMessage("Please enter a valid email address.");
      return;
    }
    const domain = email.split("@")[1]?.toLowerCase();
    if (["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com"].includes(domain)) {
      setFormStatus("error");
      setFormMessage("Please use a company email so we can route your request correctly.");
      return;
    }
    if (!company.trim()) {
      setFormStatus("error");
      setFormMessage("Please enter your company name.");
      return;
    }

    setFormStatus("loading");

    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          company,
          source: "website_v2",
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
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
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
            <span className="font-mono tracking-[0.12em]">cvlSoft</span>
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
        <section className="relative mx-auto grid max-w-7xl items-start gap-16 px-6 py-16 lg:grid-cols-[2fr_3fr] lg:gap-12 lg:py-24">
          {/* Background glows */}
          <div className="pointer-events-none absolute -left-40 top-0 -z-10 h-[500px] w-[600px] rounded-full bg-cyan-100/40 blur-[100px]" />
          <div className="pointer-events-none absolute -right-20 bottom-20 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-100/30 blur-[100px]" />

          {/* Floating decorative elements */}
          <div className="pointer-events-none absolute left-[12%] top-[18%] -z-10 h-2 w-2 rounded-full bg-cyan-400/60 float-slow" />
          <div className="pointer-events-none absolute right-[20%] top-[12%] -z-10 h-3 w-3 rounded-full border border-cyan-300/50 float-slow" style={{ animationDelay: "1.5s" }} />
          <div className="pointer-events-none absolute left-[8%] bottom-[15%] -z-10 h-2.5 w-2.5 rounded-full bg-indigo-300/40 float-slow" style={{ animationDelay: "3s" }} />
          <div className="pointer-events-none absolute right-[10%] bottom-[25%] -z-10 h-1.5 w-1.5 rounded-full bg-cyan-500/50 float-slow" style={{ animationDelay: "4.5s" }} />

          {/* Text — 40% */}
          <div className="reveal-up mx-auto w-full max-w-xl text-center lg:mx-0 lg:text-left">
            <p className="inline-block rounded-full border border-slate-300 bg-white px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] text-slate-600">
              INTRODUCING <span className="font-bold">AIOS</span>
            </p>

            <h1 className="mt-7 text-5xl font-bold leading-[1.05] tracking-tight text-slate-950 md:text-6xl lg:text-7xl">
              The operating system{" "}
              <br className="hidden sm:block" />
              for{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
                agentic AI.
              </span>
            </h1>

            <p className="mt-4 text-xl font-semibold tracking-tight text-slate-800 md:text-2xl">
              Enterprise scale. Zero technical debt.
            </p>

            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-slate-600 md:text-lg lg:mx-0">
              <span className="font-bold">AIOS</span> transforms your operational knowledge into reusable super agents
              with deterministic controls and evidence-grade observability.
            </p>

            <div className="mt-8 hidden flex-wrap gap-3 lg:flex">
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

          {/* CTAs — below diagram on mobile only */}
          <div className="flex flex-wrap justify-center gap-3 lg:hidden">
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
        </section>

        {/* ── INDUSTRY PROBLEM ── */}
        <section id="problem" className="relative border-y border-slate-200/80 bg-white py-20 md:py-24">
          <div className="pointer-events-none absolute right-0 top-0 -z-10 h-80 w-80 rounded-full bg-rose-100/40 blur-[80px]" />

          <div className="mx-auto max-w-7xl px-6">
            <p className="reveal-up inline-block rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] text-rose-600">
              THE INDUSTRY PROBLEM
            </p>

            <h2 className="reveal-up mt-6 max-w-4xl text-3xl font-bold leading-snug text-slate-950 md:text-5xl md:leading-snug [animation-delay:60ms]">
              <span className="font-mono text-rose-500">95%</span> of enterprise AI{" "}
              <span className="underline decoration-rose-400 decoration-[3px] underline-offset-4">
                never reaches production.
              </span>
            </h2>

            <p className="reveal-up mt-4 max-w-2xl text-lg text-slate-600 [animation-delay:120ms]">
              The agentic AI industry has structural problems that point
              solutions can&rsquo;t fix. Here&rsquo;s the data.
            </p>

            {/* ── Attrition Funnel ── */}
            <div className="reveal-up mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8 [animation-delay:160ms]">
              <p className="font-mono text-[11px] tracking-[0.18em] text-slate-400">
                CONCEPT &rarr; PRODUCTION
              </p>
              <p className="mt-3 text-base font-semibold text-slate-900 md:text-lg">
                For every 100 enterprises that start an AI initiative,
                only 5 ship to production.
              </p>
              <div className="mt-5 space-y-3">
                {FUNNEL_STAGES.map((stage, i) => {
                  const barColor = ["bg-slate-700", "bg-slate-400", "bg-amber-500", "bg-rose-500"][i];
                  const numColor = ["text-slate-700", "text-slate-500", "text-amber-600", "text-rose-500"][i];
                  return (
                    <div key={stage.label}>
                      <div className="mb-1 flex items-baseline gap-2">
                        <span className={`font-mono text-sm font-bold ${numColor}`}>
                          {stage.pct}%
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          {stage.label}
                        </span>
                      </div>
                      <div
                        className={`bar-fill h-7 rounded-lg ${barColor}`}
                        style={{ width: `${stage.pct}%`, minWidth: "16px", transitionDelay: `${400 + i * 200}ms` }}
                      />
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-slate-400">
                Source: MIT Sloan Management Review &middot; Gartner
              </p>
            </div>

            {/* ── Two-column: Why They Fail + Cost Over Time ── */}
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {/* Failure breakdown */}
              <div className="reveal-up rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8 [animation-delay:240ms]">
                <p className="font-mono text-[11px] tracking-[0.18em] text-slate-400">
                  WHY THEY FAIL
                </p>
                <p className="mt-3 text-base font-semibold text-slate-900">
                  Governance and integration account for 62% of all failures.
                </p>

                <div className="mt-5 flex h-6 gap-0.5 overflow-hidden rounded-lg">
                  {FAILURE_REASONS.map((r, i) => {
                    const color = ["bg-rose-400", "bg-amber-400", "bg-orange-400", "bg-slate-300"][i];
                    return (
                      <div
                        key={r.label}
                        className={`bar-fill ${color}`}
                        style={{ width: `${r.pct}%`, transitionDelay: `${500 + i * 150}ms` }}
                      />
                    );
                  })}
                </div>

                <div className="mt-5 space-y-2.5">
                  {FAILURE_REASONS.map((r, i) => {
                    const dot = ["bg-rose-400", "bg-amber-400", "bg-orange-400", "bg-slate-300"][i];
                    return (
                      <div
                        key={r.label}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                          <span className="text-sm text-slate-600">{r.label}</span>
                        </div>
                        <span className="font-mono text-sm font-bold text-slate-700">
                          {r.pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 text-xs text-slate-400">
                  Source: UC Berkeley &middot; Industry surveys
                </p>
              </div>

              {/* Cost over time */}
              <div className="reveal-up rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8 [animation-delay:320ms]">
                <p className="font-mono text-[11px] tracking-[0.18em] text-slate-400">
                  TOTAL COST OF OWNERSHIP
                </p>
                <p className="mt-3 text-base font-semibold text-slate-900">
                  Custom workflows compound cost. Reusable skills flatten it.
                </p>

                <svg
                  viewBox="0 0 300 160"
                  className="mt-5 w-full"
                  role="img"
                  aria-label="Cost comparison: custom workflows and RPA rise over 5 years while AIOS stays flat"
                >
                  {/* Gridlines */}
                  {[35, 70, 105].map((y) => (
                    <line
                      key={y}
                      x1="10"
                      y1={y}
                      x2="290"
                      y2={y}
                      stroke="#e2e8f0"
                      strokeWidth="0.5"
                    />
                  ))}

                  {/* Area fills — fade in after lines draw */}
                  <path
                    className="chart-area"
                    d="M10,115 C50,108 90,95 130,78 S210,35 250,20 L290,8 L290,140 L10,140 Z"
                    fill="#f43f5e"
                    fillOpacity="0.06"
                  />
                  <path
                    className="chart-area"
                    d="M10,110 C80,114 155,120 220,122 S280,124 290,125 L290,140 L10,140 Z"
                    fill="#0891b2"
                    fillOpacity="0.06"
                    style={{ transitionDelay: "1.4s" }}
                  />

                  {/* Custom workflows (rose — draws itself) */}
                  <path
                    className="chart-line"
                    d="M10,115 C50,108 90,95 130,78 S210,35 250,20 L290,8"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    style={{ transitionDelay: "0.6s" }}
                  />
                  {/* RPA (amber — draws itself) */}
                  <polyline
                    className="chart-line"
                    points="10,108 80,100 150,72 220,68 290,42"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transitionDelay: "0.9s" }}
                  />
                  {/* AIOS (cyan — draws itself) */}
                  <path
                    className="chart-line"
                    d="M10,110 C80,114 155,120 220,122 S280,124 290,125"
                    fill="none"
                    stroke="#0891b2"
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{ transitionDelay: "1.2s" }}
                  />

                  {/* Year labels */}
                  {["Yr 1", "Yr 2", "Yr 3", "Yr 4", "Yr 5"].map((yr, i) => (
                    <text
                      key={yr}
                      x={10 + i * 70}
                      y={155}
                      style={{
                        fontSize: "9px",
                        fill: "#94a3b8",
                        fontFamily: "var(--font-code), monospace",
                      }}
                    >
                      {yr}
                    </text>
                  ))}
                  <text
                    x="4"
                    y="18"
                    style={{
                      fontSize: "8px",
                      fill: "#94a3b8",
                      fontFamily: "var(--font-code), monospace",
                    }}
                  >
                    Cost &uarr;
                  </text>
                </svg>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-5 rounded bg-rose-500" />
                    <span className="text-xs text-slate-500">Custom workflows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-5 rounded bg-amber-500" />
                    <span className="text-xs text-slate-500">RPA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-5 rounded bg-cyan-600" />
                    <span className="text-xs font-semibold text-cyan-700">
                      <span className="font-bold">AIOS</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── AIOS: The Antithesis ── */}
            <div className="reveal-up mt-5 rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-white p-6 md:p-8 [animation-delay:400ms]">
              <p className="text-lg font-bold text-slate-950">
                <span className="font-bold">AIOS</span> is built for the 95%.
              </p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm font-semibold text-cyan-700">
                    Production from day one
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                    Forward-deployed engineers ship real workflows, not demos.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-cyan-700">
                    Governance built in
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                    Policy engine, circuit breakers, and evidence-grade audit.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-cyan-700">
                    Flat cost curve
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                    Reusable skills eliminate maintenance debt.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-cyan-700">
                    &gt;99% accuracy
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                    Deterministic policy controls close the reliability gap.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY CVLSOFT IS DIFFERENT ── */}
        <section id="platform" className="relative border-y border-slate-200/80 bg-gradient-to-b from-slate-50 to-white py-16 md:py-24">
          <div className="pointer-events-none absolute right-0 bottom-0 -z-10 h-96 w-96 rounded-full bg-indigo-100/20 blur-[100px]" />
          <div className="pointer-events-none absolute -left-10 top-1/2 -z-10 h-72 w-72 rounded-full bg-cyan-100/25 blur-[80px]" />

          <div className="mx-auto max-w-7xl px-6">
            <p className="reveal-up inline-block rounded-full border border-slate-300 bg-white px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] text-slate-600">
              THE PLATFORM
            </p>
            <h2 className="reveal-up mt-5 text-3xl font-bold text-slate-950 md:text-5xl [animation-delay:60ms]">
              Why we are different.
            </h2>
            <p className="reveal-up mt-4 max-w-2xl text-lg text-slate-600 [animation-delay:120ms]">
              Others stitch together point solutions. We compile durable
              operational capability from a core set of powerful super agents.
            </p>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {DIFFERENTIATORS.map((item, index) => (
                <article
                  key={item.title}
                  className="scale-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50"
                  style={{ animationDelay: `${120 + 80 * index}ms` }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>

            {/* Forward-deployed engineers — featured card */}
            <article className="reveal-up mt-8 rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-white p-8 shadow-sm md:flex md:items-center md:gap-10 [animation-delay:500ms]">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                <IconRocket className="h-7 w-7" />
              </div>
              <div className="mt-4 md:mt-0">
                <h3 className="text-lg font-bold text-slate-950">Forward-deployed <span className="font-bold">AIOS</span> engineers</h3>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600">
                  We don&rsquo;t hand you software and wish you luck. cvlSoft engineers embed
                  directly with your team to deploy <span className="font-bold">AIOS</span> against real workflows, integrate with
                  your existing systems, and drive measurable outcomes from day one.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* ── OBSERVATIONAL LEARNING ── */}
        <section className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="pointer-events-none absolute -left-20 top-1/3 -z-10 h-80 w-80 rounded-full bg-cyan-100/30 blur-[100px]" />

          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Text — left */}
            <div className="reveal-up flex flex-col justify-center">
              <p className="self-start rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] text-cyan-700">
                OBSERVATIONAL LEARNING
              </p>
              <h2 className="mt-6 text-3xl font-bold leading-snug text-slate-950 md:text-5xl md:leading-snug">
                Your best operators&rsquo; knowledge{" "}
                <span className="underline decoration-cyan-400 decoration-[3px] underline-offset-4">
                  walks out the door
                </span>{" "}
                every day.
              </h2>
              <p className="mt-3 text-xl font-semibold text-cyan-700">
                We capture it before it does.
              </p>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 md:text-lg">
                <span className="font-bold">AIOS</span> learns from screen captures, click paths, and decision logic to
                distill expert behavior into certified, reusable skills that any agent can
                execute. No documentation sprints. Just operational truth, extracted and
                deployed.
              </p>
            </div>

            {/* Visual flow — right */}
            <div className="flex flex-col items-center gap-4">
              {[
                {
                  step: "01",
                  label: "Observational Learning",
                  desc: "Observe real operator workflows across any set of applications; including legacy systems, mainframes, and swivel chair operations",
                },
                {
                  step: "02",
                  label: "Knowledge Extraction",
                  desc: "AI distills tacit patterns, decision trees, and edge cases",
                },
                {
                  step: "03",
                  label: "Certified Skill",
                  desc: "Validated, versioned skill ready for agent execution",
                },
              ].map((item, i) => (
                <div key={item.step} className="cascade flex w-full max-w-sm flex-col items-center" style={{ animationDelay: `${i * 300}ms` }}>
                  <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 font-mono text-sm font-bold text-cyan-600">
                        {item.step}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                        <p className="text-xs leading-relaxed text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                  {i < 2 && (
                    <svg className="my-1 h-6 w-6 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMPARISON TABLE ── */}
        <section className="relative border-y border-slate-200/80 bg-white py-16 md:py-24">
          <div className="pointer-events-none absolute left-0 bottom-0 -z-10 h-72 w-72 rounded-full bg-cyan-100/30 blur-[80px]" />

          <div className="mx-auto max-w-7xl px-6">
            <h2 className="reveal-up text-3xl font-bold text-slate-950 md:text-5xl">
              vs. the alternatives.
            </h2>
            <p className="reveal-up mt-4 max-w-2xl text-lg text-slate-600 [animation-delay:80ms]">
              See where <span className="font-bold">AIOS</span> fits against the options enterprises are
              actually evaluating.
            </p>

            <div className="reveal-up mt-12 overflow-x-auto [animation-delay:150ms]">
              <table className="w-full min-w-[700px] border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="py-3 pr-4 text-left font-semibold text-slate-500">Capability</th>
                    <th className="px-4 py-3 text-center font-semibold text-cyan-700"><span className="font-bold">AIOS</span></th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-500">Custom Agentic Frameworks</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-500">RPA Vendors</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-500">Cloud Platforms</th>
                    <th className="pl-4 py-3 text-center font-semibold text-slate-500">Open-Source Frameworks</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    ["Tribal knowledge capture", "Yes", "No", "No", "No", "No"],
                    ["Model agnostic", "Yes", "Varies", "No", "No", "Yes"],
                    ["Legacy connectors (mainframe, terminal)", "Full", "Manual", "Partial", "API only", "None"],
                    ["Deterministic policy engine", "Built-in", "DIY", "Limited", "Partial", "DIY"],
                    ["Evidence-grade audit", "Built-in", "No", "Partial", "Partial", "No"],
                    ["Zero maintenance debt", "Yes", "No", "No", "No", "No"],
                  ] as const).map((row, i) => (
                    <tr key={i} className="row-fade border-b border-slate-100" style={{ animationDelay: `${150 + i * 100}ms` }}>
                      <td className="py-3.5 pr-4 font-medium text-slate-800">{row[0]}</td>
                      {row.slice(1).map((cell, j) => {
                        const isPositive = cell === "Yes" || cell === "Full" || cell === "Built-in";
                        const isNegative = cell === "No" || cell === "None";
                        return (
                          <td
                            key={j}
                            className={`px-4 py-3.5 text-center font-medium ${
                              j === 0
                                ? isPositive
                                  ? "text-cyan-700"
                                  : "text-slate-400"
                                : isNegative
                                  ? "text-slate-300"
                                  : "text-amber-600"
                            }`}
                          >
                            {j === 0 && isPositive ? `\u2713 ${cell}` : cell}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── DEMO CTA ── */}
        <section id="demo" className="mx-auto max-w-7xl px-6 pt-16 pb-24 md:pt-24">
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
              <div className="grid grid-cols-2 gap-3">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  placeholder="First name"
                />
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  placeholder="Last name"
                />
              </div>
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
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                placeholder="Phone (optional)"
              />
              <input
                id="company"
                name="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                placeholder="Company"
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
                <p className={`text-center text-sm ${formStatus === "error" ? "text-rose-300" : "text-emerald-300"}`}>
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
