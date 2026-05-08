import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import ChallengeSolution from "../components/ChallengeSolution";
import InlineDemoForm from "../components/InlineDemoForm";
import PullQuote from "../components/PullQuote";
import StatRow from "../components/StatRow";
import { CASE_STUDIES } from "../data";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = CASE_STUDIES.find((s) => s.slug === slug);
  if (!study) return { title: "Case Study — AIOS by cvlSoft" };
  return {
    title: `${study.vertical} — ${study.category} | Case Study`,
    description: study.summary,
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((s) => s.slug === slug);
  if (!study) notFound();

  return (
    <div className="min-h-screen bg-[#050a14] text-slate-100">
      <SiteHeader />

      {/* Hero band */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <Link
            href="/case-studies"
            className="font-mono text-[12px] uppercase tracking-[0.22em] text-slate-500 transition hover:text-cyan-400"
          >
            &larr; All Case Studies
          </Link>

          <div className="mt-10 grid gap-12 md:grid-cols-[1fr_320px] md:items-center md:gap-16">
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-cyan-400">Case Study</p>
              <h1 className="mt-5 text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[1.05] tracking-[-0.03em] text-white">
                {study.vertical}
              </h1>
              <p className="mt-4 font-mono text-[13px] uppercase tracking-[0.22em] text-slate-400">
                {study.category}
              </p>
              <p className="mt-8 max-w-xl text-[clamp(1.125rem,1.6vw,1.375rem)] leading-relaxed text-slate-300">
                {study.lede}
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[320px]">
              <div
                className={`relative aspect-square overflow-hidden rounded-lg ${study.gradient}`}
              >
                <img
                  src={study.image}
                  alt=""
                  className="h-full w-full object-cover saturate-[0.55] brightness-[0.9] contrast-[1.08]"
                  aria-hidden="true"
                />
                {/* Per-study hue overlay — keeps the set cohesive while giving each hero its own tone */}
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br mix-blend-color ${study.overlay}`} />
                {/* Soft vignette to anchor edges and add depth */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(5,10,20,0.55))]" />
              </div>
              {/* Circular vertical badge overlay */}
              <div className="absolute -bottom-4 -right-4 flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-[#050a14] text-center">
                <span className="px-2 font-mono text-[10px] uppercase leading-tight tracking-[0.16em] text-slate-300">
                  {study.vertical}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metadata strip */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <dl className="grid gap-8 border-y border-white/[0.06] py-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Client</dt>
              <dd className="mt-2 text-sm text-white">{study.client}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Vertical</dt>
              <dd className="mt-2 text-sm text-white">{study.vertical}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Category</dt>
              <dd className="mt-2 text-sm text-white">{study.category}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Timeframe</dt>
              <dd className="mt-2 text-sm text-white">{study.timeframe}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Impact stats */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <StatRow stats={study.impact} />
        </div>
      </section>

      {/* Challenge */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <ChallengeSolution label="Challenge" paragraphs={study.challenge} />
        </div>
      </section>

      {/* Solution (with emphasized thesis paragraph at end) */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <ChallengeSolution label="Solution" paragraphs={study.solution} emphasizeLast />
        </div>
      </section>

      {/* Pull quote */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <PullQuote text={study.quote.text} attribution={study.quote.attribution} />
        </div>
      </section>

      {/* Inline demo form */}
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <InlineDemoForm />
      </div>
    </div>
  );
}
