import SiteHeader from "../components/SiteHeader";

const STEPS = [
  {
    step: "01",
    title: "Scope & Interview",
    desc: "We sit with your SMEs, run AIOS Interviewer sessions, capture screen workflows, and map the processes that matter most.",
  },
  {
    step: "02",
    title: "Build & Integrate",
    desc: "Our engineers build agentic workflows against your real systems, configure connectors, tune policies, and wire up approval gates.",
  },
  {
    step: "03",
    title: "Validate & Ship",
    desc: "Eval suites run against production data. Workflows promote through Draft, Staging, Production with governance at every gate. Live in weeks.",
  },
  {
    step: "04",
    title: "Monitor & Optimize",
    desc: "Real-time metrics, execution traces, and the agentic self-evolution memory system feed continuous improvement. We tune alongside your team.",
  },
  {
    step: "05",
    title: "Expand & Scale",
    desc: "New workflows deploy faster because the cognitive core already knows your systems. Each deployment makes the next one easier.",
  },
  {
    step: "06",
    title: "Transfer & Own",
    desc: "Your team learns the platform. We transition to advisory. You own the system, the workflows, and the knowledge base.",
  },
];

function IconRocket({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  );
}

export default function RolloutPage() {
  return (
    <div className="min-h-screen bg-[#050a14] text-slate-100">
      <SiteHeader />

      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="px-6 sm:px-20 lg:px-[112px]">
          <p className="inline-block rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-1.5 font-mono text-[13px] tracking-[0.18em] text-slate-400">
            WHITE GLOVE ROLLOUT
          </p>
          <h1 className="mt-6 text-[clamp(2rem,5vw,3.5rem)] font-light leading-snug text-white">
            Accelerated rollout. <span className="text-cyan-400">Optional. Hands-on.</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-400 md:text-xl">
            AIOS is self-serve out of the box. But if you want to move fast, our engineers
            embed directly with your team to get you to production in weeks. An optional
            service for teams that want white glove support from day one.
          </p>

          <div className="mt-12 rounded-lg border border-white/[0.08] bg-white/[0.03] p-6 md:p-8">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-8">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                <IconRocket className="h-7 w-7" />
              </div>
              <div>
                <p className="text-lg font-normal text-white">Weeks from kickoff to production.</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">
                  Not a proof of concept. Not a demo environment. Real workflows, real data, real outcomes.
                  We put skin in the game because our pricing depends on your success.
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-16">
            <div className="pointer-events-none absolute left-0 right-0 top-[18px] hidden h-px bg-white/[0.08] lg:block" aria-hidden="true" />
            <div className="pointer-events-none absolute bottom-4 left-[18px] top-4 w-px bg-white/[0.08] lg:hidden" aria-hidden="true" />

            <ol className="grid gap-10 lg:grid-cols-6 lg:gap-6">
              {STEPS.map((item) => (
                <li key={item.step} className="relative flex items-start gap-5 lg:block">
                  <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/60 bg-[#050a14] font-mono text-[13px] font-medium text-cyan-400 shadow-[0_0_0_4px_rgba(34,211,238,0.08)]">
                    {item.step}
                  </div>
                  <div className="min-w-0 flex-1 lg:mt-5 lg:border-t lg:border-dashed lg:border-white/[0.08] lg:pt-4">
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
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
