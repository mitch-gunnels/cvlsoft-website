import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — cvlSoft",
  description: "Terms governing your use of the AIOS platform and cvlSoft services.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[var(--bg-root)] text-slate-300">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:px-10">
        <a href="/" className="mb-12 inline-block text-sm text-slate-500 transition hover:text-white">&larr; Back to home</a>
        <h1 className="text-4xl font-light tracking-[-0.03em] text-white">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: March 28, 2026</p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-slate-400">
          <section>
            <h2 className="text-lg font-medium text-white">1. Acceptance of Terms</h2>
            <p className="mt-3">
              By accessing or using the AIOS platform and cvlsoft.net website (&ldquo;Services&rdquo;), you agree to be
              bound by these Terms of Service (&ldquo;Terms&rdquo;). If you are using the Services on behalf of an organization, you represent
              and warrant that you have the authority to bind that organization to these Terms, and &ldquo;you&rdquo; refers to
              that organization. If you do not agree to these Terms, you must not access or use the Services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">2. Description of Services</h2>
            <p className="mt-3">
              cvlSoft, LLC (&ldquo;cvlSoft,&rdquo; &ldquo;we,&rdquo; &ldquo;our&rdquo;) provides the AIOS (Autonomous Intelligence Operating System) platform, which includes
              agentic workflow execution, knowledge extraction, connector integrations, policy enforcement,
              and related tools and services. Optional white glove rollout services are available as a
              separate engagement governed by a Statement of Work (&ldquo;SOW&rdquo;).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">3. Accounts and Access</h2>
            <p className="mt-3">
              You are responsible for maintaining the confidentiality of your account credentials and for all
              activities that occur under your account. You agree to: (a) provide accurate and complete registration
              information; (b) promptly update your information to keep it current; and (c) notify cvlSoft immediately
              of any unauthorized use of your account or any other breach of security.
              cvlSoft reserves the right to suspend or terminate accounts that violate these Terms or that pose
              a security risk to the platform or other customers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">4. Pricing and Payment</h2>
            <p className="mt-3">
              AIOS uses outcome-based pricing consisting of a platform fee and per-task outcome fees as
              defined in your service agreement. Failed tasks are not billed. Payment terms, task definitions,
              and success criteria are established in Task Cards agreed upon during onboarding.
            </p>
            <p className="mt-3">
              All fees are due within thirty (30) days of invoice unless otherwise specified in your service agreement.
              Late payments accrue interest at the lesser of 1.5% per month or the maximum rate permitted by law.
              All fees are non-refundable except as expressly specified in your service agreement. cvlSoft reserves
              the right to modify pricing with sixty (60) days written notice; continued use after the effective
              date constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">5. Customer Data</h2>
            <p className="mt-3">
              You retain all rights, title, and interest in your data (&ldquo;Customer Data&rdquo;). cvlSoft processes
              Customer Data solely to provide the Services and as described in our Privacy Policy and your Data Processing
              Agreement (&ldquo;DPA&rdquo;). Per-tenant data isolation ensures your data is never accessible to other customers.
            </p>
            <p className="mt-3">
              You represent and warrant that you have all necessary rights and consents to provide Customer Data
              to cvlSoft and that your use of the Services complies with all applicable data protection laws.
              You may export or delete your data at any time in accordance with your service agreement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">6. Intellectual Property</h2>
            <p className="mt-3">
              cvlSoft retains all rights, title, and interest in and to the AIOS platform, including its cognitive
              agent architecture, algorithms, software, documentation, trade secrets, trademarks, and all
              improvements and derivative works thereof. Nothing in these Terms grants you any right to cvlSoft&rsquo;s
              intellectual property except the limited right to use the Services as expressly permitted.
            </p>
            <p className="mt-3">
              Workflow definitions, knowledge bases, and configurations created by you using the platform remain
              your intellectual property. You grant cvlSoft a limited, non-exclusive license to use such content
              solely to provide and improve the Services.
            </p>
            <p className="mt-3">
              You agree not to reverse engineer, decompile, disassemble, or otherwise attempt to derive the source
              code of the AIOS platform, except to the extent expressly permitted by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">7. Confidentiality</h2>
            <p className="mt-3">
              Each party agrees to protect the other party&rsquo;s Confidential Information using at least the same
              degree of care it uses to protect its own confidential information, but no less than reasonable care.
              &ldquo;Confidential Information&rdquo; means any non-public information disclosed by one party to the other
              that is designated as confidential or that reasonably should be understood to be confidential, including
              Customer Data, platform architecture, pricing terms, and business strategies.
            </p>
            <p className="mt-3">
              Confidential Information does not include information that: (a) is or becomes publicly available through
              no fault of the receiving party; (b) was known to the receiving party prior to disclosure; (c) is
              independently developed without use of the disclosing party&rsquo;s Confidential Information; or
              (d) is rightfully obtained from a third party without restriction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">8. Acceptable Use</h2>
            <p className="mt-3">
              You agree not to use the Services to: (a) violate any applicable law, regulation, or third-party right;
              (b) transmit malicious code, viruses, or any destructive content; (c) interfere with the integrity,
              performance, or availability of the platform; (d) attempt to gain unauthorized access to other
              tenants&rsquo; data or any systems connected to the Services; (e) use the platform for any purpose that
              could cause harm to individuals or organizations; (f) engage in unauthorized data scraping, mining, or
              harvesting; (g) sublicense, resell, or redistribute the Services without written consent; or
              (h) use the Services to develop a competing product or service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">9. Third-Party Services</h2>
            <p className="mt-3">
              The Services may integrate with or contain links to third-party services, APIs, and connectors.
              cvlSoft does not control and is not responsible for the availability, accuracy, or content of
              third-party services. Your use of third-party services is subject to their respective terms and
              policies. cvlSoft shall not be liable for any loss or damage arising from your use of or reliance
              on any third-party service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">10. Service Level</h2>
            <p className="mt-3">
              cvlSoft will use commercially reasonable efforts to maintain platform availability. Specific
              uptime commitments, scheduled maintenance windows, and remedies are defined in your service
              agreement or Service Level Agreement (SLA) where applicable. Scheduled maintenance will be
              communicated with reasonable advance notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">11. Warranty Disclaimer</h2>
            <p className="mt-3 uppercase">
              The Services are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties
              of any kind, whether express, implied, statutory, or otherwise, including but not limited to
              implied warranties of merchantability, fitness for a particular purpose, title, and
              non-infringement. cvlSoft does not warrant that the Services will be uninterrupted,
              error-free, secure, or free of harmful components, or that any defects will be corrected.
            </p>
            <p className="mt-3">
              cvlSoft makes no representations regarding the accuracy or completeness of any outputs generated
              by AI-powered features of the platform. You are solely responsible for evaluating and verifying
              the suitability of any outputs for your intended use.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">12. Limitation of Liability</h2>
            <p className="mt-3 uppercase">
              To the maximum extent permitted by applicable law, cvlSoft&rsquo;s total aggregate liability for
              any and all claims arising from or related to these Terms or your use of the Services shall not
              exceed the total fees actually paid by you to cvlSoft in the twelve (12) months immediately
              preceding the event giving rise to the claim.
            </p>
            <p className="mt-3 uppercase">
              In no event shall cvlSoft be liable for any indirect, incidental, special, consequential,
              exemplary, or punitive damages, including but not limited to loss of profits, revenue, data,
              business opportunities, goodwill, or anticipated savings, regardless of the theory of liability
              (contract, tort, strict liability, or otherwise) and even if cvlSoft has been advised of the
              possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">13. Indemnification</h2>
            <p className="mt-3">
              You agree to indemnify, defend, and hold harmless cvlSoft, its officers, directors, employees,
              agents, and affiliates from and against any and all claims, damages, losses, liabilities, costs,
              and expenses (including reasonable attorneys&rsquo; fees) arising out of or related to: (a) your
              use of the Services; (b) your violation of these Terms; (c) your violation of any applicable law
              or third-party right; (d) any Customer Data you submit through the Services; or (e) any dispute
              between you and a third party relating to the Services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">14. Dispute Resolution and Arbitration</h2>
            <p className="mt-3">
              Any dispute, controversy, or claim arising out of or relating to these Terms or the Services shall
              be resolved through binding arbitration administered by the American Arbitration Association (&ldquo;AAA&rdquo;)
              under its Commercial Arbitration Rules. The arbitration shall be conducted by a single arbitrator
              in the State of Texas. The arbitrator&rsquo;s decision shall be final and binding and may be entered
              as a judgment in any court of competent jurisdiction.
            </p>
            <p className="mt-3 font-medium text-slate-300">
              CLASS ACTION WAIVER: You agree that any dispute resolution proceedings will be conducted only on
              an individual basis and not in a class, consolidated, or representative action. If for any reason
              a claim proceeds in court rather than arbitration, you waive any right to a jury trial.
            </p>
            <p className="mt-3">
              Notwithstanding the foregoing, either party may seek injunctive or equitable relief in any court
              of competent jurisdiction to protect its intellectual property rights or Confidential Information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">15. Termination</h2>
            <p className="mt-3">
              Either party may terminate the service agreement with thirty (30) days written notice. cvlSoft may
              suspend or terminate your access immediately if you breach these Terms or if continued provision of
              the Services poses a security risk. Upon termination, cvlSoft will provide a commercially reasonable
              period (no less than thirty days) for you to export your data, after which cvlSoft may delete
              your data in accordance with its data retention policies.
            </p>
            <p className="mt-3">
              The following sections survive termination: Intellectual Property, Confidentiality, Warranty Disclaimer,
              Limitation of Liability, Indemnification, Dispute Resolution, and Governing Law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">16. Export Compliance</h2>
            <p className="mt-3">
              You agree to comply with all applicable export and import control laws and regulations, including
              the U.S. Export Administration Regulations (EAR) and sanctions programs administered by the
              U.S. Office of Foreign Assets Control (OFAC). You represent that you are not located in, or a
              national or resident of, any country subject to U.S. trade sanctions, and that you are not on any
              U.S. government restricted party list.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">17. Force Majeure</h2>
            <p className="mt-3">
              Neither party shall be liable for any failure or delay in performance due to causes beyond its
              reasonable control, including but not limited to acts of God, natural disasters, pandemics,
              war, terrorism, riots, government actions, power failures, internet or telecommunications failures,
              cyberattacks, or third-party service outages. The affected party shall provide prompt notice and
              use commercially reasonable efforts to mitigate the impact.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">18. Beta and Preview Features</h2>
            <p className="mt-3">
              cvlSoft may offer certain features designated as &ldquo;beta,&rdquo; &ldquo;preview,&rdquo;
              &ldquo;early access,&rdquo; or similar. Such features are provided for evaluation purposes only,
              may not be feature-complete, and may contain bugs or errors. Beta features are provided &ldquo;as is&rdquo;
              without any warranty, and cvlSoft may modify or discontinue them at any time without notice or liability.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">19. Modifications to Terms</h2>
            <p className="mt-3">
              cvlSoft reserves the right to modify these Terms at any time. We will provide at least thirty (30)
              days notice of material changes by posting the updated Terms on this page and updating the
              &ldquo;Last updated&rdquo; date. Your continued use of the Services after the effective date of any
              modifications constitutes your acceptance of the updated Terms. If you do not agree to the modified
              Terms, you must discontinue use of the Services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">20. Governing Law</h2>
            <p className="mt-3">
              These Terms shall be governed by and construed in accordance with the laws of the State of Texas,
              without regard to its conflict of law principles. Subject to the arbitration provision above, any
              legal action or proceeding not subject to arbitration shall be brought exclusively in the state or
              federal courts located in Texas, and each party consents to the personal jurisdiction of such courts.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">21. General Provisions</h2>
            <p className="mt-3">
              <strong className="text-slate-300">Entire Agreement:</strong> These Terms, together with your service
              agreement, DPA, and any applicable SOW, constitute the entire agreement between you and cvlSoft
              regarding the Services and supersede all prior or contemporaneous agreements, representations, and
              understandings.
            </p>
            <p className="mt-3">
              <strong className="text-slate-300">Severability:</strong> If any provision of these Terms is held to
              be invalid or unenforceable, that provision shall be modified to the minimum extent necessary to make
              it enforceable, and the remaining provisions shall continue in full force and effect.
            </p>
            <p className="mt-3">
              <strong className="text-slate-300">No Waiver:</strong> The failure of cvlSoft to enforce any right or
              provision of these Terms shall not constitute a waiver of such right or provision. Any waiver must be
              in writing and signed by an authorized representative of cvlSoft.
            </p>
            <p className="mt-3">
              <strong className="text-slate-300">Assignment:</strong> You may not assign or transfer these Terms or
              your rights hereunder without cvlSoft&rsquo;s prior written consent. cvlSoft may assign these Terms
              in connection with a merger, acquisition, or sale of all or substantially all of its assets.
            </p>
            <p className="mt-3">
              <strong className="text-slate-300">Notices:</strong> All legal notices must be sent in writing to
              support@cvlsoft.com or to the address specified in your service agreement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">22. Contact</h2>
            <p className="mt-3">
              Questions about these Terms? Contact us at:<br />
              <span className="text-cyan-400">support@cvlsoft.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
