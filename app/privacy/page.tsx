import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — cvlSoft",
  description: "How cvlSoft collects, uses, and protects your data.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[var(--bg-root)] text-slate-300">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:px-10">
        <a href="/" className="mb-12 inline-block text-sm text-slate-500 transition hover:text-white">&larr; Back to home</a>
        <h1 className="text-4xl font-light tracking-[-0.03em] text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: March 28, 2026</p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-slate-400">
          <section>
            <h2 className="text-lg font-medium text-white">1. Introduction</h2>
            <p className="mt-3">
              cvlSoft, LLC (&ldquo;cvlSoft,&rdquo; &ldquo;we,&rdquo; &ldquo;our&rdquo;) operates the AIOS platform
              and the cvlsoft.net, cvlsoft.com, and cvlsoft.ai websites (collectively, the &ldquo;Services&rdquo;). This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you visit our website, request a demo, or use our platform.
            </p>
            <p className="mt-3">
              By accessing or using the Services, you acknowledge that you have read and understood this Privacy Policy.
              If you do not agree with our practices, please do not use the Services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">2. Information We Collect</h2>
            <p className="mt-3"><strong className="text-slate-300">Personal Information:</strong> When you request a demo, contact us, or create an account, we may collect your name, email address, phone number, company name, job title, and mailing address.</p>
            <p className="mt-3"><strong className="text-slate-300">Usage Data:</strong> We automatically collect information about how you interact with our website, including IP address, browser type and version, operating system, device identifiers, referring URLs, pages visited, time spent on pages, and clickstream data.</p>
            <p className="mt-3"><strong className="text-slate-300">Platform Data:</strong> For AIOS platform customers, we process workflow definitions, execution logs, configuration data, and usage metrics as defined in your service agreement. Customer data processed by AIOS workflows is governed by your Data Processing Agreement (DPA).</p>
            <p className="mt-3"><strong className="text-slate-300">Communications:</strong> When you contact us via email, phone, or our website forms, we retain the content of those communications along with your contact information to respond and maintain records.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">3. Legal Basis for Processing</h2>
            <p className="mt-3">We process your personal information based on the following legal grounds:</p>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li><strong className="text-slate-300">Contract Performance:</strong> Processing necessary to provide the Services you have requested or to take steps at your request before entering into an agreement.</li>
              <li><strong className="text-slate-300">Legitimate Interest:</strong> Processing necessary for our legitimate business interests, such as improving the Services, preventing fraud, and ensuring platform security, where those interests are not overridden by your rights.</li>
              <li><strong className="text-slate-300">Consent:</strong> Where you have given explicit consent for a specific processing activity, such as receiving marketing communications.</li>
              <li><strong className="text-slate-300">Legal Obligation:</strong> Processing necessary to comply with applicable laws, regulations, or legal proceedings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">4. How We Use Your Information</h2>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li>To provide, maintain, operate, and improve our platform and Services</li>
              <li>To process demo requests and communicate with you about our products and services</li>
              <li>To send you technical notices, security alerts, and support messages</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To comply with legal obligations and enforce our Terms of Service</li>
              <li>To detect, investigate, and prevent fraudulent, unauthorized, or illegal activity</li>
              <li>To monitor and analyze trends, usage, and activities in connection with the Services</li>
              <li>To personalize and improve your experience with the Services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">5. Data Sharing and Disclosure</h2>
            <p className="mt-3">
              We do not sell, rent, or trade your personal information. We may share information in the following circumstances:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li><strong className="text-slate-300">Service Providers:</strong> We share information with trusted third-party service providers who assist in operating our platform (cloud infrastructure, analytics, email delivery, payment processing) under strict confidentiality and data processing agreements.</li>
              <li><strong className="text-slate-300">Legal Requirements:</strong> We may disclose information if required to do so by law, regulation, legal process, or governmental request, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.</li>
              <li><strong className="text-slate-300">Business Transfers:</strong> In connection with a merger, acquisition, reorganization, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control.</li>
              <li><strong className="text-slate-300">With Your Consent:</strong> We may share your information with third parties when you have given us explicit consent to do so.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">6. Sub-Processors</h2>
            <p className="mt-3">
              We use a limited number of third-party sub-processors to help deliver the Services. These may include
              cloud hosting providers, monitoring and analytics services, email delivery platforms, and payment
              processors. Each sub-processor is bound by data processing agreements that require them to protect
              your data to standards no less protective than those described in this policy. A current list of
              sub-processors is available upon request to platform customers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">7. Data Security</h2>
            <p className="mt-3">
              We implement robust, industry-standard security measures to protect your information, including:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li>AES-256-GCM encryption for credentials, secrets, and sensitive data at rest</li>
              <li>TLS 1.2+ encryption for all data in transit</li>
              <li>Per-tenant data isolation ensuring strict separation between customers</li>
              <li>Role-based access controls (RBAC) and principle of least privilege</li>
              <li>Compliance-grade audit logging of all platform actions</li>
              <li>Regular security assessments and vulnerability testing</li>
            </ul>
            <p className="mt-3">
              Despite these measures, no method of transmission over the Internet or electronic storage is 100% secure.
              We cannot guarantee absolute security, but we are committed to protecting your information using
              commercially reasonable safeguards.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">8. Data Breach Notification</h2>
            <p className="mt-3">
              In the event of a data breach that affects your personal information, cvlSoft will notify affected
              individuals and relevant regulatory authorities as required by applicable law. We will provide
              notification without unreasonable delay and no later than seventy-two (72) hours after becoming
              aware of a breach where feasible. Notification will include the nature of the breach, the types of
              data affected, steps taken to address the breach, and recommended actions for affected individuals.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">9. Data Retention</h2>
            <p className="mt-3">
              We retain personal information for as long as necessary to fulfill the purposes outlined in this
              policy, comply with legal obligations, resolve disputes, and enforce our agreements. Specifically:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li><strong className="text-slate-300">Account data:</strong> Retained for the duration of your account and for a reasonable period thereafter for legal and audit purposes.</li>
              <li><strong className="text-slate-300">Usage data:</strong> Retained in identifiable form for up to twenty-four (24) months, then aggregated or anonymized.</li>
              <li><strong className="text-slate-300">Platform data:</strong> Retained in accordance with your service agreement and DPA.</li>
              <li><strong className="text-slate-300">Communication records:</strong> Retained for up to thirty-six (36) months for support and compliance purposes.</li>
            </ul>
            <p className="mt-3">
              Platform customers may request deletion of their data at any time in accordance with their service
              agreement. Upon account termination, we will delete or anonymize your data within a commercially
              reasonable period unless retention is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">10. Your Privacy Rights</h2>
            <p className="mt-3">
              Depending on your jurisdiction, you may have the following rights regarding your personal information:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li><strong className="text-slate-300">Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong className="text-slate-300">Correction:</strong> Request correction of inaccurate or incomplete data.</li>
              <li><strong className="text-slate-300">Deletion:</strong> Request deletion of your personal data, subject to legal retention requirements.</li>
              <li><strong className="text-slate-300">Portability:</strong> Request a machine-readable copy of your data for transfer to another service.</li>
              <li><strong className="text-slate-300">Restriction:</strong> Request that we restrict processing of your data in certain circumstances.</li>
              <li><strong className="text-slate-300">Objection:</strong> Object to processing based on legitimate interest or for direct marketing purposes.</li>
              <li><strong className="text-slate-300">Withdraw Consent:</strong> Where processing is based on consent, you may withdraw that consent at any time.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at <span className="text-cyan-400">privacy@cvlsoft.net</span>.
              We will respond to verified requests within thirty (30) days. We will not discriminate against you for
              exercising your privacy rights.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">11. California Privacy Rights (CCPA/CPRA)</h2>
            <p className="mt-3">
              If you are a California resident, the California Consumer Privacy Act (CCPA) and California Privacy
              Rights Act (CPRA) provide you with additional rights:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li><strong className="text-slate-300">Right to Know:</strong> You have the right to request disclosure of the categories and specific pieces of personal information we have collected, the sources of collection, the business purposes, and the categories of third parties with whom we share it.</li>
              <li><strong className="text-slate-300">Right to Delete:</strong> You have the right to request deletion of your personal information, subject to certain exceptions.</li>
              <li><strong className="text-slate-300">Right to Correct:</strong> You have the right to request correction of inaccurate personal information.</li>
              <li><strong className="text-slate-300">Right to Opt-Out of Sale/Sharing:</strong> We do not sell or share your personal information for cross-context behavioral advertising purposes.</li>
              <li><strong className="text-slate-300">Right to Limit Use of Sensitive Personal Information:</strong> You may request that we limit our use of sensitive personal information to what is necessary to provide the Services.</li>
              <li><strong className="text-slate-300">Non-Discrimination:</strong> We will not discriminate against you for exercising any of your CCPA/CPRA rights.</li>
            </ul>
            <p className="mt-3">
              To submit a request, email <span className="text-cyan-400">privacy@cvlsoft.net</span> with the subject
              line &ldquo;California Privacy Request.&rdquo; We may need to verify your identity before processing your request.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">12. International Data Transfers</h2>
            <p className="mt-3">
              cvlSoft is headquartered in the United States. If you access the Services from outside the United States,
              your information may be transferred to, stored, and processed in the United States or other countries
              where our service providers operate. These countries may have data protection laws that differ from
              those of your jurisdiction.
            </p>
            <p className="mt-3">
              Where required by applicable law, we implement appropriate safeguards for international data transfers,
              including Standard Contractual Clauses (SCCs) approved by the European Commission, or other lawful
              transfer mechanisms. By using the Services, you consent to the transfer of your information as described
              in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">13. Automated Decision-Making</h2>
            <p className="mt-3">
              The AIOS platform may use automated processing, including artificial intelligence and machine learning,
              to execute workflows and make operational decisions on behalf of customers. These automated processes
              operate under customer-defined policies and approval gates.
            </p>
            <p className="mt-3">
              We do not use automated decision-making that produces legal or similarly significant effects on
              individuals without human oversight. Platform customers maintain control over approval gates and
              can configure human-in-the-loop requirements for any workflow.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">14. Children&rsquo;s Privacy</h2>
            <p className="mt-3">
              The Services are not intended for individuals under the age of 16 (or the applicable age of consent
              in your jurisdiction). We do not knowingly collect personal information from children. If we become
              aware that we have collected personal information from a child without appropriate consent, we will
              take steps to delete that information promptly. If you believe we have inadvertently collected information
              from a child, please contact us at <span className="text-cyan-400">privacy@cvlsoft.net</span>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">15. Cookies and Tracking Technologies</h2>
            <p className="mt-3">
              We use the following types of cookies and similar tracking technologies:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li><strong className="text-slate-300">Essential Cookies:</strong> Required for the operation of our website and platform. These cannot be disabled.</li>
              <li><strong className="text-slate-300">Analytics Cookies:</strong> Help us understand how visitors interact with our website so we can improve the user experience. These are collected in aggregate form.</li>
              <li><strong className="text-slate-300">Functional Cookies:</strong> Remember your preferences and settings to provide a personalized experience.</li>
            </ul>
            <p className="mt-3">
              We do not use advertising or cross-site tracking cookies. You can manage cookie preferences through
              your browser settings. Disabling certain cookies may affect the functionality of the Services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">16. Do Not Track Signals</h2>
            <p className="mt-3">
              Some browsers transmit &ldquo;Do Not Track&rdquo; (DNT) signals. As there is no industry-standard
              interpretation of DNT signals, our website does not currently respond to DNT signals. However,
              we do not engage in cross-site tracking of our users.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">17. Changes to This Policy</h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology,
              legal requirements, or other factors. We will notify you of material changes by posting the updated
              policy on this page, updating the &ldquo;Last updated&rdquo; date, and where required by law, providing
              direct notification via email. Your continued use of the Services after any changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white">18. Contact Us</h2>
            <p className="mt-3">
              If you have questions about this Privacy Policy, wish to exercise your privacy rights, or have concerns
              about our data practices, contact us at:
            </p>
            <p className="mt-3">
              <strong className="text-slate-300">cvlSoft, LLC</strong><br />
              Email: <span className="text-cyan-400">privacy@cvlsoft.net</span><br />
              General: <span className="text-cyan-400">hello@cvlsoft.net</span>
            </p>
            <p className="mt-3">
              If you are not satisfied with our response, you may have the right to lodge a complaint with your
              local data protection authority.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
