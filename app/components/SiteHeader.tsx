"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDemoModal } from "./DemoModal";

const NAV_ITEMS: [string, string][] = [
  ["/#problem", "The Industry Problem"],
  ["/#why-aios", "Why AIOS"],
  ["/#pricing", "Pricing"],
  ["/rollout", "Rollout"],
  ["/platform", "Platform"],
  ["/team", "Team"],
];

const DARK_ROUTES = new Set(["/rollout", "/platform", "/team"]);

function isDarkPath(pathname: string): boolean {
  return DARK_ROUTES.has(pathname);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const defaultTone: "dark" | "light" = isDarkPath(pathname) ? "dark" : "light";
  const [tone, setTone] = useState<"dark" | "light">(defaultTone);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open: openDemoModal } = useDemoModal();

  useEffect(() => {
    const HEADER_PROBE_Y = 64;
    const onScroll = () => {
      const sections = document.querySelectorAll<HTMLElement>("[data-tone]");
      let active: "dark" | "light" | null = null;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= HEADER_PROBE_Y && rect.bottom > HEADER_PROBE_Y) {
          const t = section.dataset.tone;
          if (t === "light" || t === "dark") active = t;
        }
      });
      setTone(active ?? defaultTone);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [defaultTone]);

  // Close mobile menu when navigating to a different route
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isDark = tone === "dark";

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
        <div className="flex items-center gap-3 md:gap-8">
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
          {isHome ? (
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
          ) : (
            <button
              type="button"
              onClick={openDemoModal}
              className={
                isDark
                  ? "rounded-md bg-cyan-400 px-5 py-2 text-[13px] font-semibold tracking-[0.08em] text-slate-950 transition-colors hover:bg-cyan-300"
                  : "rounded-md border border-cyan-700 bg-cyan-700 px-5 py-2 text-[13px] font-semibold tracking-[0.08em] text-white transition-colors hover:bg-cyan-800"
              }
            >
              REQUEST DEMO
            </button>
          )}

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className={`md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
              isDark ? "text-white hover:bg-white/[0.06]" : "text-slate-950 hover:bg-slate-950/[0.06]"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div
          className={`md:hidden border-t ${
            isDark ? "border-white/[0.08] bg-[#050a14]" : "border-slate-950/10 bg-[var(--bg-page)]"
          }`}
        >
          <nav className="flex flex-col px-6 py-4">
            {NAV_ITEMS.map(([href, label]) => {
              const isActive = !href.includes("#") && pathname === href;
              return (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`py-3 text-[15px] transition-colors ${
                    isActive
                      ? isDark
                        ? "font-medium text-cyan-400"
                        : "font-medium text-cyan-700"
                      : isDark
                        ? "text-slate-300 hover:text-white"
                        : "text-slate-700 hover:text-slate-950"
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
