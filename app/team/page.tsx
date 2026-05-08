import type { Metadata } from "next";
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
        <div className="px-6 sm:px-20 lg:px-[112px]">
          <p className="inline-block rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-1.5 font-mono text-[13px] tracking-[0.18em] text-slate-400">
            PEDIGREE
          </p>
          <h1 className="mt-6 text-[clamp(2rem,5vw,3.5rem)] font-light tracking-[-0.03em] text-white">
            Deep expertise, not just code.
          </h1>

          <div className="mt-8 max-w-4xl space-y-5 text-lg leading-relaxed text-slate-400">
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

          <p className="mt-8 max-w-4xl text-xl font-light leading-relaxed text-white">
            The technical implementation is the icing. The foundation is knowing what to build,
            how to deploy it, and what it takes to earn trust inside an enterprise. That part
            isn&rsquo;t written in code — it&rsquo;s earned.
          </p>

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
