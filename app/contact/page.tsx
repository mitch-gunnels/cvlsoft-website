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
            <h2 className="text-lg font-medium text-white">General Inquiries</h2>
            <p className="mt-3">
              For general questions about cvlSoft and the AIOS platform:<br />
              <span className="text-cyan-400">hello@cvlsoft.net</span>
            </p>
            <p className="mt-2 text-sm text-slate-500">We typically respond within one business day.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">Sales</h2>
            <p className="mt-3">
              For pricing inquiries, enterprise agreements, or partnership opportunities:<br />
              <span className="text-cyan-400">sales@cvlsoft.net</span>
            </p>
            <p className="mt-2 text-sm text-slate-500">Our sales team responds within one business day.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">Customer Support</h2>
            <p className="mt-3">
              Existing platform customers can reach our support team for technical assistance,
              account management, and service inquiries:<br />
              <span className="text-cyan-400">support@cvlsoft.net</span>
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Support SLAs are defined in your service agreement. Critical issues are triaged immediately.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">Security &amp; Privacy</h2>
            <p className="mt-3">
              To report a security vulnerability, data privacy request, or to exercise your privacy rights
              under CCPA, GDPR, or other applicable regulations:<br />
              <span className="text-cyan-400">security@cvlsoft.net</span>
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Security reports are acknowledged within 24 hours. Privacy requests are processed within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">Legal</h2>
            <p className="mt-3">
              For legal notices, subpoenas, regulatory inquiries, or questions about our Terms of Service
              and Privacy Policy:<br />
              <span className="text-cyan-400">legal@cvlsoft.net</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
