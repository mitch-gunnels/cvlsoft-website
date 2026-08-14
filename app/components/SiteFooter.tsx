import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] bg-[#15181b]">
      <div className="px-6 pb-10 pt-16 sm:px-20 lg:px-[112px]">
        {/* Footer columns */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo-mark-256.svg" alt="" aria-hidden="true" className="h-6 w-6" />
              <span className="text-sm font-medium text-white">AIOS <span className="font-normal text-slate-500">by cvlSoft</span></span>
            </div>
            <p className="mt-1 text-[13px] leading-tight text-slate-600 whitespace-nowrap">
              Autonomous Intelligence Operating System
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-[13px] font-semibold tracking-[0.12em] text-slate-500">PRODUCT</p>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/#commitments" className="text-sm text-slate-500 transition hover:text-white">Commitments</Link></li>
              <li><Link href="/#problem" className="text-sm text-slate-500 transition hover:text-white">One Core</Link></li>
              <li><Link href="/#platform" className="text-sm text-slate-500 transition hover:text-white">Operating System</Link></li>
              <li><Link href="/#learning" className="text-sm text-slate-500 transition hover:text-white">Self-Evolving Intelligence</Link></li>
              <li><Link href="/#how-it-works" className="text-sm text-slate-500 transition hover:text-white">Process</Link></li>
              <li><Link href="/#validation" className="text-sm text-slate-500 transition hover:text-white">Production Governance</Link></li>
              <li><Link href="/#security" className="text-sm text-slate-500 transition hover:text-white">Trust &amp; Security</Link></li>
              <li><Link href="/#rollout" className="text-sm text-slate-500 transition hover:text-white">Rollout</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-[13px] font-semibold tracking-[0.12em] text-slate-500">COMPANY</p>
            <ul className="mt-4 space-y-2.5">
              <li><a href="/about" className="text-sm text-slate-500 transition hover:text-white">About</a></li>
              <li><a href="/contact" className="text-sm text-slate-500 transition hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[13px] font-semibold tracking-[0.12em] text-slate-500">LEGAL</p>
            <ul className="mt-4 space-y-2.5">
              <li><a href="/privacy" className="text-sm text-slate-500 transition hover:text-white">Privacy Policy</a></li>
              <li><a href="/terms" className="text-sm text-slate-500 transition hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-white/[0.04] pt-6 md:flex-row md:items-center">
          <span className="font-mono text-[13px] tracking-[0.08em] text-slate-700">
            &copy; {year} cvlSoft, LLC. All rights reserved.
          </span>
          {/* Compliance badges */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 md:justify-end">
            <img src="/compliance/hipaa.svg" alt="HIPAA Certified" className="h-12 w-auto opacity-85 transition hover:opacity-100" />
            <img src="/compliance/soc2.svg" alt="SOC 2 Type II Certified" className="h-12 w-auto opacity-85 transition hover:opacity-100" />
            <img src="/compliance/sox.svg" alt="SOX Compliant" className="h-12 w-auto opacity-85 transition hover:opacity-100" />
          </div>
        </div>
      </div>
    </footer>
  );
}
