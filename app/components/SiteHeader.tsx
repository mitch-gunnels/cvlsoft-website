"use client";

import { usePathname } from "next/navigation";

const NAV_ITEMS: [string, string][] = [
  ["/#problem", "The Industry Problem"],
  ["/#why-aios", "Why AIOS"],
  ["/#pricing", "Pricing"],
  ["/rollout", "Rollout"],
  ["/case-studies", "Case Studies"],
  ["/platform", "Platform"],
  ["/team", "Team"],
];

const DARK_ROUTES = new Set(["/rollout", "/case-studies", "/platform", "/team"]);

export default function SiteHeader() {
  const pathname = usePathname();
  const isDark = DARK_ROUTES.has(pathname);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-30 backdrop-blur-xl ${
        isDark
          ? "border-b border-white/[0.06] bg-[#050a14]/80"
          : "border-b border-slate-950/10 bg-[var(--bg-page)]/80"
      }`}
    >
      <nav className="flex items-center justify-between px-6 py-4.5 sm:px-20 lg:px-[112px]">
        <a href="/" className="flex items-center gap-3">
          <img src="/logo-mark-256.svg" alt="" aria-hidden="true" className="h-7 w-7" />
          <span className={`text-sm font-medium tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
            AIOS <span className="font-normal text-slate-500">by cvlSoft</span>
          </span>
        </a>
        <div className="flex items-center gap-8">
          {NAV_ITEMS.map(([href, label]) => {
            const isActive = !href.includes("#") && pathname === href;
            const activeClass = isDark
              ? "font-medium text-cyan-400 underline decoration-2 underline-offset-[6px]"
              : "font-medium text-cyan-700 underline decoration-2 underline-offset-[6px]";
            const inactiveClass = isDark
              ? "text-slate-400 hover:text-white"
              : "text-slate-600 hover:text-slate-950";
            return (
              <a
                key={href}
                href={href}
                className={`hidden text-sm transition-colors md:block ${isActive ? activeClass : inactiveClass}`}
              >
                {label}
              </a>
            );
          })}
          <a
            href="/#demo"
            className={
              isDark
                ? "rounded-md bg-cyan-400 px-5 py-2 text-[13px] font-semibold tracking-[0.08em] text-slate-950 transition-colors hover:bg-cyan-300"
                : "rounded-md border border-cyan-700 bg-cyan-700 px-5 py-2 text-[13px] font-semibold tracking-[0.08em] text-white transition-colors hover:bg-cyan-800"
            }
          >
            REQUEST DEMO
          </a>
        </div>
      </nav>
    </header>
  );
}
