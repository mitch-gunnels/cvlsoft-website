import type { Metadata } from "next";
import DemoButton from "../components/DemoButton";
import SiteHeader from "../components/SiteHeader";
import CaseStudyRow from "./components/CaseStudyRow";
import { CASE_STUDIES } from "./data";

export const metadata: Metadata = {
  title: "Case Studies — AIOS by cvlSoft",
  description:
    "Enterprise deployments of AIOS — claims operations, AML, procurement, revenue cycle, customer experience, and IT identity ops.",
};

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-[#050a14] text-slate-100">
      <SiteHeader />

      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <div className="flex flex-wrap items-center gap-3">
            <p className="inline-block rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-1.5 font-mono text-[13px] tracking-[0.18em] text-slate-400">
              CASE STUDIES
            </p>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1.5 font-mono text-[12px] tracking-[0.18em] text-cyan-400">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400"></span>
              </span>
              STEALTH MODE
            </p>
          </div>
          <h1 className="mt-6 max-w-5xl text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[1.05] tracking-[-0.03em] text-white">
            Scaling AI for the world&rsquo;s largest enterprises.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-400 md:text-xl">
            One cognitive core, deployed inside the operations that matter. Outcome-priced, audit-grade, in production.
          </p>
        </div>
      </section>

      <section className="relative pb-24 md:pb-32">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <div className="border-t border-white/[0.06]">
            {CASE_STUDIES.map((study) => (
              <CaseStudyRow key={study.slug} study={study} />
            ))}
          </div>

          <p className="mt-10 max-w-2xl font-mono text-[11px] uppercase tracking-[0.18em] text-slate-600">
            Figures shown are projected or forecasted impact based on customer engagement modeling and pilot results. Customer identities are anonymized at their request.
          </p>

          <div className="mt-16">
            <DemoButton />
          </div>
        </div>
      </section>
    </div>
  );
}
