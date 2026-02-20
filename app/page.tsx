"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/app/lib/analytics";

type FormStatus = "idle" | "loading" | "success" | "error";

/* ── Capabilities teasers ── */

const CAPABILITIES = [
  {
    label: "Observational Learning",
    detail: "Captures how your best operators actually work — not just what's documented.",
  },
  {
    label: "Deterministic Policy Engine",
    detail: "Enterprise-grade governance with circuit breakers, kill switches, and audit trails.",
  },
  {
    label: "Connector Fabric",
    detail: "Mainframe to modern API — one unified execution contract.",
  },
  {
    label: "Evidence-First Observability",
    detail: "Replay-grade logs with full redaction. Every action traceable.",
  },
];

/* ── Floating particles (client-only to avoid hydration mismatch) ── */

function Particles() {
  const [particles, setParticles] = useState<
    { id: number; left: string; top: string; size: number; delay: string; duration: string; opacity: number }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 1.5 + Math.random() * 3,
        delay: `${Math.random() * 6}s`,
        duration: `${5 + Math.random() * 6}s`,
        opacity: 0.15 + Math.random() * 0.35,
      })),
    );
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="float-slow absolute rounded-full bg-cyan-400"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

/* ── Page ── */

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formMessage, setFormMessage] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    document
      .querySelectorAll(".reveal-up, .reveal-scale, .reveal-left, .reveal-right")
      .forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (formStatus !== "success") return;
    const timer = setTimeout(() => {
      setFormStatus("idle");
      setFormMessage("");
    }, 6000);
    return () => clearTimeout(timer);
  }, [formStatus]);

  function handleCtaClick(location: string) {
    trackEvent("coming_soon_cta_click", { location });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormStatus("idle");
    setFormMessage("");

    if (!firstName.trim()) {
      setFormStatus("error");
      setFormMessage("First name is required.");
      return;
    }
    if (!lastName.trim()) {
      setFormStatus("error");
      setFormMessage("Last name is required.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormStatus("error");
      setFormMessage("Please enter a valid email.");
      return;
    }
    const domain = email.split("@")[1]?.toLowerCase();
    if (["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com"].includes(domain)) {
      setFormStatus("error");
      setFormMessage("Please use a company email.");
      return;
    }
    if (!company.trim()) {
      setFormStatus("error");
      setFormMessage("Company name is required.");
      return;
    }

    setFormStatus("loading");

    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          company,
          source: "coming_soon",
        }),
      });

      const data = (await res.json()) as { ok?: boolean; message?: string };
      trackEvent("coming_soon_form_submit", { status: res.ok ? "success" : "error" });

      if (!res.ok) {
        setFormStatus("error");
        setFormMessage(data.message ?? "Unable to submit. Try again.");
        return;
      }

      setFormStatus("success");
      setFormMessage("You're on the list. We'll be in touch soon.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setCompany("");
    } catch {
      setFormStatus("error");
      setFormMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[var(--bg-root)] text-slate-200">
      {/* Grid background */}
      <div className="grid-bg pointer-events-none fixed inset-0 -z-20" />

      {/* Top gradient wash */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[800px] w-[1200px] -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 top-40 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-500/[0.05] blur-[120px]" />

      <Particles />

      {/* ── HEADER ── */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a href="#" className="flex items-center gap-3">
          <svg viewBox="0 0 48 48" fill="none" className="h-8 w-8" aria-hidden="true">
            <path d="M32 10 A18 18 0 1 0 32 38" stroke="#0e7490" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            <path d="M30 16 A12 12 0 1 0 30 32" stroke="#22d3ee" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M28 21 A6 6 0 1 0 28 27" stroke="#67e8f9" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </svg>
          <span className="font-mono text-sm tracking-[0.14em] text-slate-400">cvlSoft</span>
        </a>
        <a
          href="#early-access"
          onClick={() => handleCtaClick("header")}
          className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-xs font-semibold tracking-[0.10em] text-cyan-300 transition hover:bg-cyan-400/20"
        >
          REQUEST EARLY ACCESS
        </a>
      </header>

      <main>
        {/* ── HERO ── */}
        <section className="relative mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
          {/* Central glow */}
          <div className="glow-pulse pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.08] blur-[100px]" />

          {/* Eyebrow */}
          <p
            className="reveal-up inline-block rounded-full border border-cyan-500/20 bg-cyan-500/5 px-5 py-2 font-mono text-[11px] tracking-[0.22em] text-cyan-400"
            style={{ animationDelay: "0ms" }}
          >
            ENTERPRISE AUTONOMY PLATFORM
          </p>

          {/* Product name */}
          <h1
            className="reveal-up mt-8 text-[clamp(4rem,12vw,9rem)] font-bold leading-[0.9] tracking-[-0.04em]"
            style={{ animationDelay: "100ms" }}
          >
            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
              AIOS
            </span>
          </h1>

          {/* Tagline */}
          <p
            className="reveal-up mt-6 text-xl font-semibold tracking-tight text-white md:text-3xl"
            style={{ animationDelay: "200ms" }}
          >
            The operating system for{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">
              agentic AI.
            </span>
          </p>

          {/* Sub-tagline */}
          <p
            className="reveal-up mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg"
            style={{ animationDelay: "300ms" }}
          >
            Transform your operational knowledge — SOPs, runbooks, tribal expertise — into
            safe, auditable autonomous execution. No brittle workflows. No automation debt.
          </p>

          {/* Shimmer divider */}
          <div
            className="reveal-up mx-auto mt-10 h-px w-48 shimmer-line"
            style={{ animationDelay: "400ms" }}
          />

          {/* Terminal teaser */}
          <div
            className="reveal-up mt-10 w-full max-w-lg rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 text-left backdrop-blur-sm"
            style={{ animationDelay: "500ms" }}
          >
            <div className="mb-3 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
              <span className="ml-3 font-mono text-[10px] tracking-wider text-slate-600">aios-core</span>
            </div>
            <div className="space-y-1.5 font-mono text-[13px] leading-relaxed">
              <p className="text-slate-500">
                <span className="text-cyan-500">$</span> aios deploy --skill &quot;invoice-reconciliation&quot;
              </p>
              <p className="text-slate-400">
                <span className="text-emerald-400">[ok]</span> Skill certified. Policy gates active.
              </p>
              <p className="text-slate-400">
                <span className="text-emerald-400">[ok]</span> Connector fabric initialized (SAP, Oracle DB, Mainframe TN3270)
              </p>
              <p className="text-slate-400">
                <span className="text-emerald-400">[ok]</span> Evidence store: recording. Redaction: enabled.
              </p>
              <p className="text-cyan-400 cursor-blink">
                Agent executing autonomously...
              </p>
            </div>
          </div>

          {/* CTA */}
          <a
            href="#early-access"
            onClick={() => handleCtaClick("hero")}
            className="reveal-up mt-10 inline-block rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 px-8 py-4 text-sm font-bold tracking-wide text-slate-950 transition hover:shadow-lg hover:shadow-cyan-400/20"
            style={{ animationDelay: "600ms" }}
          >
            Request Early Access
          </a>
        </section>

        {/* ── CAPABILITIES ── */}
        <section className="relative mx-auto max-w-5xl px-6 py-16 md:py-24">
          <div className="pointer-events-none absolute -left-40 top-0 -z-10 h-96 w-96 rounded-full bg-cyan-500/[0.04] blur-[120px]" />

          <p
            className="reveal-up font-mono text-[11px] tracking-[0.22em] text-cyan-500"
          >
            WHAT AIOS DELIVERS
          </p>
          <h2
            className="reveal-up mt-4 max-w-2xl text-2xl font-bold text-white md:text-4xl"
            style={{ animationDelay: "80ms" }}
          >
            Enterprise autonomy.{" "}
            <span className="text-slate-500">Not another point solution.</span>
          </h2>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] md:grid-cols-2">
            {CAPABILITIES.map((cap, i) => (
              <div
                key={cap.label}
                className="reveal-up group relative border-white/[0.04] p-7 transition hover:bg-white/[0.04]"
                style={{
                  animationDelay: `${150 + i * 100}ms`,
                  borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-cyan-400/70 transition group-hover:bg-cyan-400 group-hover:shadow-sm group-hover:shadow-cyan-400/50" />
                  <h3 className="font-mono text-xs font-medium tracking-[0.12em] text-cyan-400">
                    {cap.label.toUpperCase()}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {cap.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="relative mx-auto max-w-5xl px-6 py-16 md:py-20">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                stat: "95%",
                label: "of enterprise AI projects never reach production.",
                source: "MIT / Gartner",
              },
              {
                stat: "34%",
                label: "cite governance gaps as the #1 adoption blocker.",
                source: "UC Berkeley",
              },
              {
                stat: ">99%",
                label: "accuracy threshold for AIOS autonomous workflows.",
                source: "cvlSoft benchmark",
              },
            ].map((item, i) => (
              <div
                key={item.stat}
                className="reveal-up text-center"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <p className="font-mono text-5xl font-bold tracking-tight text-white md:text-6xl">
                  {item.stat}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {item.label}
                </p>
                <p className="mt-1 font-mono text-[10px] tracking-wider text-slate-600">
                  {item.source}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── EARLY ACCESS FORM ── */}
        <section id="early-access" className="relative mx-auto max-w-5xl px-6 py-16 md:py-24">
          <div className="pointer-events-none absolute right-0 top-1/3 -z-10 h-80 w-80 rounded-full bg-indigo-500/[0.05] blur-[100px]" />

          <div className="reveal-up relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-10 backdrop-blur-sm md:p-16">
            {/* Corner glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/[0.08] blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-indigo-500/[0.06] blur-[60px]" />

            <div className="relative text-center">
              <p className="font-mono text-[11px] tracking-[0.22em] text-cyan-500">
                EARLY ACCESS
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white md:text-4xl">
                Be first in line.
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-base text-slate-400">
                We&rsquo;re onboarding a small group of design partners. Request early access
                and a member of our team will reach out to schedule a walkthrough.
              </p>

              <form className="mx-auto mt-8 grid max-w-md gap-3" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="First name"
                    className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Last name"
                    className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Work email"
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone (optional)"
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
                />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  placeholder="Company"
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
                />
                <button
                  type="submit"
                  disabled={formStatus === "loading"}
                  onClick={() => handleCtaClick("form")}
                  className="mt-2 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 px-8 py-3.5 text-sm font-bold text-slate-950 transition hover:shadow-lg hover:shadow-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {formStatus === "loading" ? "Submitting..." : "Request Early Access"}
                </button>
                {formMessage && (
                  <p
                    className={`text-center text-sm ${
                      formStatus === "error" ? "text-rose-400" : "text-emerald-400"
                    }`}
                  >
                    {formMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.04] py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 md:flex-row">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 48 48" fill="none" className="h-5 w-5" aria-hidden="true">
              <path d="M32 10 A18 18 0 1 0 32 38" stroke="#0e7490" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <path d="M30 16 A12 12 0 1 0 30 32" stroke="#22d3ee" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M28 21 A6 6 0 1 0 28 27" stroke="#67e8f9" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </svg>
            <span className="font-mono text-xs tracking-[0.12em] text-slate-600">
              &copy; {year} cvlSoft
            </span>
          </div>
          <p className="font-mono text-[10px] tracking-wider text-slate-700">
            Enterprise autonomy without automation debt.
          </p>
        </div>
      </footer>
    </div>
  );
}
