"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS: [string, string][] = [
  ["/platform", "Platform"],
  ["/solutions", "Solutions"],
  ["/team", "Team"],
  ["/pricing", "Pricing"],
];

/* Past this scroll depth the bar slides up out of view; above it, back down. */
const HIDE_AFTER_Y = 75;

const DARK_ROUTES = new Set(["/rollout", "/platform", "/team"]);

function isDarkPath(pathname: string): boolean {
  return DARK_ROUTES.has(pathname);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const defaultTone: "dark" | "light" = isDarkPath(pathname) ? "dark" : "light";
  const [tone, setTone] = useState<"dark" | "light">(defaultTone);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const HEADER_PROBE_Y = 64;
    const onScroll = () => {
      setHidden(window.scrollY > HIDE_AFTER_Y);

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
    // Fully transparent — no fill, no blur, no rule. The nav floats over
    // whatever section is beneath it; `tone` keeps the text legible. Past
    // HIDE_AFTER_Y it slides up and fades out; it returns near the top.
    <header
      // Tailwind v4 emits `translate-y-*` as the `translate` property (not
      // `transform`), so the transition must name `translate` or the slide
      // snaps and only the fade animates.
      className={`fixed left-0 right-0 top-0 z-30 bg-transparent transition-[translate,opacity] duration-300 ease-out ${
        hidden && !mobileOpen ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      {/* skan.ai groups the links immediately after the wordmark and pushes
          only the CTA to the far right — hence gap-10 + ml-auto, not
          justify-between. */}
      <nav className="mx-auto flex w-full max-w-[1320px] items-center gap-10 px-6 py-4.5 sm:px-10 lg:px-[60px]">
        <a href="/" className="flex min-w-0 shrink-0 items-center gap-3">
          <img src="/logo-mark-256.svg" alt="" aria-hidden="true" className="h-13 w-13 shrink-0" />
          <span className={`truncate text-[19px] font-medium tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
            {/* "by cvlSoft" is dropped on the narrowest screens so the brand
                never runs under the Request Demo button. */}
            AIOS <span className="hidden font-normal text-slate-500 min-[420px]:inline">by cvlSoft</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map(([href, label]) => {
            const isActive = !href.includes("#") && pathname === href;
            const activeClass = isDark ? "text-cyan-400" : "text-cyan-700";
            const inactiveClass = isDark
              ? "text-white/85 hover:text-white"
              : "text-slate-800 hover:text-slate-950";
            return (
              <a
                key={href}
                href={href}
                className={`whitespace-nowrap text-[15px] transition-colors ${isActive ? activeClass : inactiveClass}`}
              >
                {label}
              </a>
            );
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3">
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
