import type { Metadata } from "next";
import DemoButton from "../components/DemoButton";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Team — cvlSoft",
  description: "Deep expertise behind AIOS. cvlSoft was founded by experts in enterprise agentic AI.",
};

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#050a14] text-slate-100">
      <SiteHeader />

      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <div className="reveal-up flex flex-wrap items-center gap-3">
            <p className="inline-block rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-1.5 font-mono text-[13px] tracking-[0.18em] text-slate-400">
              PEDIGREE
            </p>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1.5 font-mono text-[12px] tracking-[0.18em] text-cyan-400">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400"></span>
              </span>
              STEALTH MODE
            </p>
          </div>
          <h1 className="reveal-up mt-6 text-[clamp(2rem,5vw,3.5rem)] font-light tracking-[-0.03em] text-white [animation-delay:60ms]">
            Deep expertise, not just code.
          </h1>

          <div className="reveal-up mt-8 max-w-4xl space-y-5 text-lg leading-relaxed text-slate-400 [animation-delay:120ms]">
            <p>
              Cognitive Venture Labs (cvlSoft) was founded by experts who have spent years in the trenches of enterprise
              AI systems. Our founders were early contributors to transformer-based AI and thought leaders in agentic AI. We understand how large organizations actually operate: the
              politics, the compliance requirements, the legacy systems, the tribal knowledge
              that nobody has documented. That understanding is baked into the architecture
              of AIOS itself.
            </p>
            <p>
              When you work with cvlSoft, you benefit from that accumulated expertise and
              intellectual property. Our cognitive core, our knowledge extraction techniques,
              our security posture, our pricing model: these are not engineering decisions.
              They are hard-won insights from years of watching enterprise AI projects fail
              and understanding exactly why.
            </p>
          </div>

          <p className="reveal-up mt-8 max-w-4xl text-xl font-light leading-relaxed text-white [animation-delay:180ms]">
            The technical implementation is the icing. The foundation is knowing what to build,
            how to deploy it, and what it takes to earn trust inside an enterprise. That part
            isn&rsquo;t written in code — it&rsquo;s earned.
          </p>

          {/* ── Anonymous credentials grid ── */}
          <div className="mt-20">
            <p className="reveal-up font-mono text-[12px] tracking-[0.22em] text-slate-500">BACKGROUNDS</p>
            <h2 className="reveal-up mt-3 text-[clamp(1.5rem,3vw,2rem)] font-light tracking-[-0.02em] text-white [animation-delay:60ms]">
              The team behind AIOS.
            </h2>

            <div className="reveal-up mt-5 flex items-start gap-3 rounded-lg border border-cyan-400/25 bg-cyan-400/[0.04] p-4 [animation-delay:120ms]">
              <svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.6" className="mt-0.5 h-5 w-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <p className="font-mono text-[12px] tracking-[0.2em] text-cyan-400">CURRENTLY IN STEALTH</p>
                <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-slate-300">
                  Individual identities aren&rsquo;t public yet. Below is the verified pedigree of the people building AIOS today. Identities and bios will publish at launch.
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  role: "Former AI Research Lead",
                  tag: "Frontier lab. Early contributor to transformer-based agentic systems.",
                  delay: 180,
                },
                {
                  role: "Ex-Principal Engineer",
                  tag: "Hyperscaler agent platform. Shipped LLM products at production scale.",
                  delay: 240,
                },
                {
                  role: "PhD, Agentic Systems",
                  tag: "Multi-agent reasoning, planning, and tool use. Published in top-tier venues.",
                  delay: 300,
                },
                {
                  role: "Former CTO, Fortune 500 SaaS",
                  tag: "Built and ran AI/ML org through scale. Knows where enterprise AI breaks.",
                  delay: 360,
                },
                {
                  role: "Ex-VP Engineering, Enterprise Security",
                  tag: "Identity, audit, and policy at regulated enterprises. SOC 2 / HIPAA / SOX.",
                  delay: 420,
                },
                {
                  role: "Forward-Deployed Engineers",
                  tag: "Veterans of financial services AI. Embedded with operators, paid on outcomes.",
                  delay: 480,
                },
              ].map((person) => (
                <div
                  key={person.role}
                  className="reveal-up rounded-lg border border-white/[0.08] bg-white/[0.03] p-6 transition hover:border-cyan-400/30"
                  style={{ animationDelay: `${person.delay}ms` }}
                >
                  <h3 className="text-base font-semibold tracking-tight text-white">{person.role}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{person.tag}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-up mt-16">
            <DemoButton />
          </div>
        </div>
      </section>
    </div>
  );
}
