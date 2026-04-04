import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact cvlSoft",
  description: "Get in touch with the cvlSoft team.",
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-[var(--bg-root)] text-slate-300">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:px-10">
        <a href="/" className="mb-12 inline-block text-sm text-slate-500 transition hover:text-white">&larr; Back to home</a>
        <h1 className="text-4xl font-light tracking-[-0.03em] text-white">Contact Us</h1>

        <div className="mt-12 space-y-10 text-base leading-relaxed text-slate-400">
          <section>
            <h2 className="text-lg font-medium text-white">Request a Demo</h2>
            <p className="mt-3">
              Ready to see AIOS in action? <a href="/#demo" className="text-cyan-400 underline hover:text-cyan-300">Request a demo</a> and
              we&rsquo;ll walk you through the platform with your specific use cases. Demo sessions are typically
              scheduled within two business days of your request.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">Sales &amp; General Inquiries</h2>
            <p className="mt-3">
              For general questions, pricing inquiries, enterprise agreements, demo requests,
              or partnership opportunities:<br />
              <span className="text-cyan-400">sales@cvlsoft.com</span>
            </p>
            <p className="mt-2 text-sm text-slate-500">We typically respond within one business day.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">Support, Security &amp; Legal</h2>
            <p className="mt-3">
              For technical assistance, account management, security vulnerabilities,
              privacy requests, legal notices, or questions about our Terms of Service
              and Privacy Policy:<br />
              <span className="text-cyan-400">support@cvlsoft.com</span>
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Support SLAs are defined in your service agreement. Security reports are acknowledged within 24 hours. Privacy requests are processed within 30 days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
