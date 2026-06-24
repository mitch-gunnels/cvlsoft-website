"use client";

import { useDemoModal } from "../components/DemoModal";

const CAPABILITIES = [
  "Knowledge capture",
  "Adaptive workflows",
  "Policy-gated governance",
  "Auditable execution",
  "Compounding memory",
];

export default function ComingSoon() {
  const { open: openDemoModal } = useDemoModal();

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[var(--bg-deep)] text-slate-300">
      {/* Ambient cyan glow — same treatment as the home hero */}
      <div
        aria-hidden="true"
        className="glow-pulse pointer-events-none absolute left-1/2 top-1/3 -z-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]"
      />

      {/* Minimal brand bar — no nav; the site isn't live yet */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-[112px]">
        <div className="flex items-center gap-3">
          <img src="/logo-mark-256.svg" alt="" aria-hidden="true" className="h-7 w-7" />
          <span className="text-sm font-medium tracking-tight text-white">
            AIOS <span className="font-normal text-slate-500">by cvlSoft</span>
          </span>
        </div>
      </header>

      {/* Centered content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
        <div className="w-full max-w-3xl text-center">
          <p className="hero-fade-up inline-block rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-1.5 font-mono text-[12px] tracking-[0.22em] text-cyan-400">
            LAUNCHING SOON
          </p>

          <h1 className="hero-fade-up mt-7 text-[clamp(1.9rem,5vw,4rem)] font-light leading-[1.08] tracking-[-0.03em] text-white [animation-delay:120ms]">
            <span className="whitespace-nowrap">The Autonomous Intelligence</span>
            <br />
            Operating System
            <br />
            is{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent [filter:drop-shadow(0_0_22px_rgba(34,211,238,0.45))]">
              almost here.
            </span>
          </h1>

          <p className="hero-fade-up mx-auto mt-6 max-w-[640px] text-lg font-normal leading-relaxed text-slate-400 [animation-delay:280ms]">
            AIOS turns what your experts know into safe, auditable, autonomous
            execution. We&rsquo;re onboarding a first cohort of enterprise design
            partners now.
          </p>

          <div className="hero-fade-up mt-10 flex flex-wrap items-center justify-center gap-3 [animation-delay:440ms]">
            <button
              type="button"
              onClick={openDemoModal}
              className="rounded-md bg-cyan-400 px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20"
            >
              Request early access
            </button>
          </div>

          {/* Capability keywords */}
          <div className="hero-fade-up mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 [animation-delay:600ms]">
            {CAPABILITIES.map((label) => (
              <span
                key={label}
                className="flex items-center gap-2.5 font-mono text-[12px] tracking-[0.12em] text-slate-500"
              >
                <span className="block h-1 w-1 shrink-0 rounded-full bg-cyan-400" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
