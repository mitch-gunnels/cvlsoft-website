import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About cvlSoft — The Company Behind AIOS",
  description: "cvlSoft builds AIOS, the autonomous intelligence operating system for enterprises.",
};

export default function About() {
  return (
    <div className="min-h-screen bg-[var(--bg-root)] text-slate-300">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:px-10">
        <a href="/" className="mb-12 inline-block text-sm text-slate-500 transition hover:text-white">&larr; Back to home</a>
        <h1 className="text-4xl font-light tracking-[-0.03em] text-white">About cvlSoft</h1>

        <div className="mt-12 space-y-10 text-base leading-relaxed text-slate-400">
          <section>
            <h2 className="text-lg font-medium text-white">The Mission</h2>
            <p className="mt-3">
              cvlSoft builds AIOS, the Autonomous Intelligence Operating System. We believe enterprise AI
              should work like your best employee: it should reason about problems, learn from experience,
              and earn trust through transparency. Not like a thousand brittle bots duct-taped together.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">The Problem We Solve</h2>
            <p className="mt-3">
              95% of enterprise AI never reaches production. The industry builds a separate agent for every
              task, creating an ever-growing maintenance burden that collapses under its own weight.
              Meanwhile, the most valuable operational knowledge lives in the heads of experts who are
              one resignation away from walking out the door.
            </p>
            <p className="mt-3">
              AIOS solves both problems. A single cognitive core replaces hundreds of specialized agents.
              An AI interviewer captures tacit knowledge before it disappears. And a security-first
              architecture ensures every action is auditable, every decision is explainable, and every
              workflow earns the trust of the people who depend on it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">Deep Expertise, Not Just Code</h2>
            <p className="mt-3">
              cvlSoft was founded by experts who have spent years in the trenches of enterprise
              agentic AI. We understand how large organizations actually operate: the
              politics, the compliance requirements, the legacy systems, the tribal knowledge
              that nobody has documented. That understanding is baked into the architecture
              of AIOS itself.
            </p>
            <p className="mt-3">
              When you work with cvlSoft, you benefit from that accumulated expertise and
              intellectual property. Our cognitive core, our knowledge extraction techniques,
              our security posture, our pricing model: these are not engineering decisions.
              They are hard-won insights from years of watching enterprise AI projects fail
              and understanding exactly why.
            </p>
            <p className="mt-3">
              The technical implementation is the icing. The foundation is knowing what to build,
              how to deploy it, and what it takes to earn trust inside an enterprise. That part
              isn&rsquo;t written in code — it&rsquo;s earned.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">How We Work</h2>
            <p className="mt-3">
              We are not a software vendor that hands you a login and wishes you luck. cvlSoft offers
              optional white glove rollout services where our engineers embed directly with your team
              to scope workflows, integrate systems, and ship to production in 90 days. Our pricing
              is outcome-based: we make money when you make money. Failed tasks are free.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">Get in Touch</h2>
            <p className="mt-3">
              Interested in learning more? <a href="/#demo" className="text-cyan-400 underline hover:text-cyan-300">Request a demo</a> or
              email us at <span className="text-cyan-400">hello@cvlsoft.net</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
