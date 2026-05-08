import Link from "next/link";
import type { CaseStudy } from "../data";

export default function CaseStudyRow({ study }: { study: CaseStudy }) {
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="group flex items-stretch gap-6 overflow-hidden border-b border-white/[0.06] py-8 transition-colors hover:bg-white/[0.02] sm:gap-10 sm:py-10"
    >
      {/* Hero image with cohesive color treatment */}
      <div
        className={`relative shrink-0 overflow-hidden rounded-lg ${study.gradient}`}
        style={{ width: "180px", height: "180px" }}
        aria-hidden="true"
      >
        <img
          src={study.image}
          alt=""
          className="h-full w-full object-cover saturate-[0.55] brightness-[0.9] contrast-[1.08] transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
        {/* Per-study hue overlay — keeps the set cohesive while giving each card its own tone */}
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br mix-blend-color ${study.overlay}`} />
        {/* Soft vignette to anchor edges and add depth */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(5,10,20,0.55))]" />
      </div>

      {/* Text block */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 py-1 pr-2">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-slate-500">
            {study.vertical}
          </p>
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-slate-500">
            {study.category}
          </p>
        </div>

        <h3 className="break-words text-[clamp(1.375rem,2.4vw,1.875rem)] font-light leading-tight tracking-[-0.02em] text-white">
          {study.headlineStat}
        </h3>

        <span className="font-mono text-[13px] tracking-[0.04em] text-cyan-400 transition-colors group-hover:text-cyan-300">
          Read Case Study <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">&rarr;</span>
        </span>
      </div>
    </Link>
  );
}
