"use client";

import { FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { trackEvent } from "@/app/lib/analytics";

const LearningLoopPlayer = dynamic(() => import("@/app/components/remotion/LearningLoopPlayer"), { ssr: false });
const CognitiveCorePlayer = dynamic(() => import("@/app/components/remotion/CognitiveCorePlayer"), { ssr: false });
const TacitKnowledgePlayer = dynamic(() => import("@/app/components/remotion/TacitKnowledgePlayer"), { ssr: false });
const SecurityPosturePlayer = dynamic(() => import("@/app/components/remotion/SecurityPosturePlayer"), { ssr: false });
const ConnectorFabricPlayer = dynamic(() => import("@/app/components/remotion/ConnectorFabricPlayer"), { ssr: false });

type DemoStatus = "idle" | "loading" | "success" | "error";

/* ── Icon components ── */

function IconEye({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2.5 12C4.5 7 8 4.5 12 4.5S19.5 7 21.5 12c-2 5-5.5 7.5-9.5 7.5S4.5 17 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconCpu({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
    </svg>
  );
}

function IconGrid({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconRocket({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M13.13 22a10 10 0 0 1-1.3-3.43 10 10 0 0 1 3.43 1.3L13.13 22ZM6.87 2a10 10 0 0 1 1.3 3.43 10 10 0 0 1-3.43-1.3L6.87 2Z" />
      <path d="M2 12h5M17 12h5" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconLink({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/* ── Section scroll indicator (sticky dot + line) ── */

function SectionScrollLine() {
  return (
    <div className="pointer-events-none absolute left-[175px] top-0 bottom-0 z-20 hidden lg:block">
      {/* Vertical line spanning full section */}
      <div className="absolute left-[4px] top-0 bottom-0 w-px bg-white/[0.10]" />
      {/* Dot container: starts 160px below section top, stretches to bottom so sticky has room */}
      <div className="absolute left-0 top-[160px] bottom-0 overflow-visible">
        <div className="sticky top-[150px] h-0">
          <div className="h-[10px] w-[10px] rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
        </div>
      </div>
    </div>
  );
}

/* ── Hero spiral — inline SVG with animated stroke pulses ── */

function HeroSpiral() {
  const rightPaths = [
    "M515 315.071C823.527 315.071 853.487 619.089 1056.54 619.089C1230.97 619.089 1321.64 315.07 1572.07 315.07",
    "M515 315.071C823.527 315.071 853.487 610.748 1056.54 610.748C1230.97 610.748 1321.64 315.071 1572.07 315.071",
    "M515 315.07C823.527 315.07 853.487 598.698 1056.54 598.698C1230.97 598.698 1321.64 315.07 1572.07 315.07",
    "M515 315.07C823.527 315.07 853.487 584.794 1056.54 584.794C1230.97 584.794 1321.64 315.07 1572.07 315.07",
    "M515 315.071C823.527 315.071 853.487 565.33 1056.54 565.33C1230.97 565.33 1321.64 315.071 1572.07 315.071",
    "M515 315.071C823.527 315.071 853.487 540.304 1056.54 540.304C1230.97 540.304 1321.64 315.071 1572.07 315.071",
    "M515 315.071C823.527 315.071 853.487 506.936 1056.54 506.936C1230.97 506.936 1321.64 315.07 1572.07 315.07",
    "M515 315.07C823.527 315.07 853.487 468.934 1056.54 468.934C1230.97 468.934 1321.64 315.07 1572.07 315.07",
    "M515 315.071C823.527 315.071 853.487 424.443 1056.54 424.443C1230.97 424.443 1321.64 315.071 1572.07 315.071",
    "M515 315.071C823.527 315.071 853.487 371.611 1056.54 371.611C1230.97 371.611 1321.64 315.071 1572.07 315.071",
    "M515 315.071C823.527 315.071 853.487 315.071 1056.54 315.071C1230.97 315.071 1321.64 315.071 1572.07 315.071",
    "M515 315.071C823.527 315.071 853.487 258.53 1056.54 258.53C1230.97 258.53 1321.64 315.07 1572.07 315.07",
    "M515 315.071C823.527 315.071 853.487 204.771 1056.54 204.771C1230.97 204.771 1321.64 315.071 1572.07 315.071",
    "M515 315.07C823.527 315.07 853.487 160.28 1056.54 160.28C1230.97 160.28 1321.64 315.07 1572.07 315.07",
    "M515 315.071C823.527 315.071 853.487 122.278 1056.54 122.278C1230.97 122.278 1321.64 315.071 1572.07 315.071",
    "M515 315.07C823.527 315.07 853.487 89.8369 1056.54 89.8369C1230.97 89.8369 1321.64 315.07 1572.07 315.07",
    "M515 315.071C823.527 315.071 853.487 64.811 1056.54 64.811C1230.97 64.811 1321.64 315.07 1572.07 315.07",
    "M515 315.071C823.527 315.071 853.487 45.3467 1056.54 45.3466C1230.97 45.3466 1321.64 315.071 1572.07 315.071",
    "M515 315.071C823.527 315.071 853.487 31.4433 1056.54 31.4433C1230.97 31.4433 1321.64 315.071 1572.07 315.071",
    "M515 315.07C823.527 315.07 853.487 19.3935 1056.54 19.3935C1230.97 19.3935 1321.64 315.07 1572.07 315.07",
    "M515 315.071C823.527 315.071 853.487 11.0517 1056.54 11.0517C1230.97 11.0517 1321.64 315.071 1572.07 315.071",
  ];

  const leftPaths = [
    "M0.427716 314.859C159.246 314.859 174.668 455.394 279.193 455.394C368.982 455.394 415.656 314.859 544.571 314.859",
    "M0.427716 314.859C159.246 314.859 174.668 451.538 279.193 451.538C368.982 451.538 415.656 314.859 544.571 314.859",
    "M0.427717 314.859C159.246 314.859 174.668 445.968 279.193 445.968C368.982 445.968 415.656 314.859 544.571 314.859",
    "M0.427718 314.859C159.246 314.859 174.668 439.541 279.193 439.541C368.982 439.541 415.656 314.859 544.571 314.859",
    "M0.427719 314.86C159.246 314.86 174.668 430.543 279.193 430.543C368.982 430.543 415.656 314.86 544.571 314.859",
    "M0.427721 314.86C159.246 314.86 174.668 418.975 279.193 418.975C368.982 418.975 415.656 314.86 544.571 314.86",
    "M0.427723 314.859C159.246 314.859 174.668 403.55 279.193 403.55C368.982 403.55 415.656 314.859 544.571 314.859",
    "M0.427725 314.859C159.246 314.859 174.668 385.983 279.193 385.983C368.982 385.983 415.656 314.859 544.571 314.859",
    "M0.427728 314.859C159.246 314.859 174.668 365.417 279.193 365.417C368.982 365.417 415.656 314.859 544.571 314.859",
    "M0.427731 314.859C159.246 314.859 174.668 340.995 279.193 340.995C368.982 340.995 415.656 314.859 544.571 314.859",
    "M0.427734 314.859C159.246 314.859 174.668 314.859 279.193 314.859C368.982 314.859 415.656 314.859 544.571 314.859",
    "M0.427738 314.859C159.246 314.859 174.668 288.723 279.193 288.723C368.982 288.723 415.656 314.859 544.571 314.859",
    "M0.427741 314.859C159.246 314.859 174.668 263.873 279.193 263.873C368.982 263.873 415.656 314.859 544.571 314.859",
    "M0.427744 314.859C159.246 314.859 174.668 243.307 279.193 243.307C368.982 243.307 415.656 314.859 544.571 314.859",
    "M0.427746 314.859C159.246 314.859 174.668 225.74 279.193 225.74C368.982 225.74 415.656 314.859 544.571 314.859",
    "M0.427748 314.859C159.246 314.859 174.668 210.744 279.193 210.744C368.982 210.744 415.656 314.859 544.571 314.859",
    "M0.42775 314.859C159.246 314.859 174.668 199.175 279.193 199.175C368.982 199.175 415.656 314.859 544.571 314.859",
    "M0.427751 314.859C159.246 314.859 174.668 190.178 279.193 190.178C368.982 190.178 415.656 314.859 544.571 314.859",
    "M0.427752 314.859C159.246 314.859 174.668 183.751 279.193 183.751C368.982 183.751 415.656 314.859 544.571 314.859",
    "M0.427752 314.859C159.246 314.859 174.668 178.181 279.193 178.181C368.982 178.181 415.656 314.859 544.571 314.859",
    "M0.427753 314.859C159.246 314.859 174.668 174.325 279.193 174.325C368.982 174.325 415.656 314.859 544.571 314.859",
  ];

  /* Select a few paths for traveling dot pulses */
  const pulsePaths = [1, 5, 10, 15, 19];

  return (
    <svg viewBox="0 0 1573 630" fill="none" className="h-full w-full" aria-hidden="true">
      <defs>
        <clipPath id="clip0_6057_8963">
          <rect width="629.356" height="1179" fill="white" transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 1573 629.356)" />
        </clipPath>
        <clipPath id="clip1_6057_8963">
          <rect width="290.924" height="545" fill="white" transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 545 460.14)" />
        </clipPath>
      </defs>

      {/* Right group — base strokes */}
      <g clipPath="url(#clip0_6057_8963)">
        {rightPaths.map((d, i) => (
          <path key={`r${i}`} d={d} stroke="#22d3ee" strokeOpacity="0.18" strokeWidth="2" strokeLinecap="round" fill="none" />
        ))}
      </g>

      {/* Left group — base strokes */}
      <g clipPath="url(#clip1_6057_8963)">
        {leftPaths.map((d, i) => (
          <path key={`l${i}`} d={d} stroke="#22d3ee" strokeOpacity="0.18" strokeWidth="2" strokeLinecap="round" fill="none" />
        ))}
      </g>

      {/* Animated pulse dots traveling along select right paths */}
      {pulsePaths.map((idx) => (
        <g key={`pulse-r-${idx}`}>
          <path id={`spiralR${idx}`} d={rightPaths[idx]} fill="none" />
          <circle r="4" fill="#22d3ee" opacity="0">
            <animateMotion dur={`${4 + (idx % 4) * 1.5}s`} begin={`${idx * 0.7}s`} repeatCount="indefinite">
              <mpath href={`#spiralR${idx}`} />
            </animateMotion>
            <animate attributeName="opacity" values="0;0.6;0.6;0" dur={`${4 + (idx % 4) * 1.5}s`} begin={`${idx * 0.7}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* Animated pulse dots traveling along select left paths */}
      {pulsePaths.map((idx) => (
        <g key={`pulse-l-${idx}`}>
          <path id={`spiralL${idx}`} d={leftPaths[idx]} fill="none" />
          <circle r="3" fill="#22d3ee" opacity="0">
            <animateMotion dur={`${3 + (idx % 3) * 1.2}s`} begin={`${idx * 0.5 + 2}s`} repeatCount="indefinite">
              <mpath href={`#spiralL${idx}`} />
            </animateMotion>
            <animate attributeName="opacity" values="0;0.5;0.5;0" dur={`${3 + (idx % 3) * 1.2}s`} begin={`${idx * 0.5 + 2}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
}

/* ── Floating particles ── */

function Particles() {
  const [particles, setParticles] = useState<
    { id: number; left: string; top: string; size: number; delay: string; duration: string; opacity: number }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 1.5 + Math.random() * 3,
        delay: `${Math.random() * 6}s`,
        duration: `${5 + Math.random() * 6}s`,
        opacity: 0.15 + Math.random() * 0.35,
      })),
    );
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="float-slow absolute rounded-full bg-cyan-400"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

/* ── Data ── */

const FUNNEL_STAGES = [
  { label: "Start AI initiative", pct: 100 },
  { label: "Reach proof of concept", pct: 60 },
  { label: "Reach pilot", pct: 20 },
  { label: "Full production", pct: 5 },
];

const FAILURE_REASONS = [
  { label: "Governance & compliance", pct: 34 },
  { label: "Integration complexity", pct: 28 },
  { label: "Accuracy below threshold", pct: 22 },
  { label: "Maintenance & drift", pct: 16 },
];

const DIFFERENTIATORS: { title: string; description: string; icon: ReactNode }[] = [
  {
    title: "One brain. Every workflow.",
    description: "Traditional platforms build a separate agent for every task — hundreds of brittle bots you have to maintain. AIOS operates like a single brilliant employee: one cognitive engine that reasons about intent, selects the right tools, and adapts to any workflow. Add a new capability and every process gets smarter immediately.",
    icon: <IconCpu className="h-5 w-5" />,
  },
  {
    title: "AIOS interviews your experts",
    description: "AIOS conducts voice interviews just like a human, using seven science-backed elicitation techniques to understand how your experts complete complex tasks. While they talk, AIOS captures their screen, detects decision signals, and automatically builds certified, executable agentic workflows from what it learns.",
    icon: <IconEye className="h-5 w-5" />,
  },
  {
    title: "Self-evolving autonomous agents",
    description: "Every execution makes the system smarter. A three-role memory engine — Generator, Reflector, Curator — captures outcomes, surfaces patterns, and persists validated insights as reusable knowledge. No manual retraining. No prompt tuning. Continuous autonomous improvement.",
    icon: <IconGrid className="h-5 w-5" />,
  },
  {
    title: "Security first posture.",
    description: "Every action is blocked unless an explicit policy allows it. A deterministic policy engine with allow/deny controls, global and per-execution kill switches that halt instantly, and human-in-the-loop approval gates with compliance-grade audit logging.",
    icon: <IconShield className="h-5 w-5" />,
  },
  {
    title: "Universal connector fabric",
    description: "Hundreds of connectors — REST, Slack, Jira, Google Workspace, databases, terminal, and a growing marketplace — unified under one execution contract. Add a connector and every cognitive agent uses it immediately.",
    icon: <IconLink className="h-5 w-5" />,
  },
];

/* ── Page ── */

export default function Home() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [formStatus, setFormStatus] = useState<DemoStatus>("idle");
  const [formMessage, setFormMessage] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const year = useMemo(() => new Date().getFullYear(), []);
  const featureObserverRef = useRef<IntersectionObserver | null>(null);

  /* Scroll-triggered reveal animations */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    document
      .querySelectorAll(".reveal-up, .scale-in, .cascade, .row-fade")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* Navbar scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scrollytelling feature observer */
  useEffect(() => {
    featureObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-feature-index"));
            if (!isNaN(idx)) setActiveFeature(idx);
          }
        });
      },
      { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" },
    );
    document.querySelectorAll("[data-feature-index]").forEach((el) => featureObserverRef.current?.observe(el));
    return () => featureObserverRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (formStatus !== "success") return;
    const timer = setTimeout(() => {
      setFormStatus("idle");
      setFormMessage("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [formStatus]);

  function handleCtaClick(location: string) {
    trackEvent("bold_claim_cta_click", { location });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("idle");
    setFormMessage("");

    if (!firstName.trim()) {
      setFormStatus("error");
      setFormMessage("Please enter your first name.");
      return;
    }
    if (!lastName.trim()) {
      setFormStatus("error");
      setFormMessage("Please enter your last name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormStatus("error");
      setFormMessage("Please enter a valid email address.");
      return;
    }
    const domain = email.split("@")[1]?.toLowerCase();
    if (["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com"].includes(domain)) {
      setFormStatus("error");
      setFormMessage("Please use a company email so we can route your request correctly.");
      return;
    }
    if (!company.trim()) {
      setFormStatus("error");
      setFormMessage("Please enter your company name.");
      return;
    }

    setFormStatus("loading");

    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          company,
          source: "website_v2",
        }),
      });

      const data = (await response.json()) as { ok?: boolean; message?: string };
      trackEvent("demo_form_submit", { status: response.ok ? "success" : "error" });

      if (!response.ok) {
        setFormStatus("error");
        setFormMessage(data.message ?? "Unable to submit demo request.");
        return;
      }

      setFormStatus("success");
      setFormMessage(data.message ?? "Thanks. We will follow up to schedule your demo.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setCompany("");
    } catch {
      setFormStatus("error");
      setFormMessage("Network error. Please try again.");
      trackEvent("demo_form_submit", { status: "error" });
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[var(--bg-root)] text-slate-300">
      {/* Grid background */}
      <div className="grid-bg pointer-events-none fixed inset-0 -z-20" />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[800px] w-[1200px] -translate-x-1/2 rounded-full bg-cyan-500/[0.06] blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 top-40 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-500/[0.04] blur-[120px]" />


      {/* ── HEADER ── */}
      <header className="sticky top-0 z-30 px-10 pt-2 sm:px-14 lg:px-[88px]">
        <nav className={`mx-auto flex items-center justify-between rounded-md px-6 py-4.5 backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? "border border-white/[0.10] bg-[#050a14]/70"
            : "border border-transparent bg-transparent"
        }`}>
          <a href="#top" className="flex items-center gap-3">
            <svg viewBox="0 0 48 48" fill="none" className="h-7 w-7" aria-hidden="true">
              <path d="M32 10 A18 18 0 1 0 32 38" stroke="#0e7490" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
              <path d="M30 16 A12 12 0 1 0 30 32" stroke="#22d3ee" strokeWidth="4" fill="none" strokeLinecap="round"/>
              <path d="M28 21 A6 6 0 1 0 28 27" stroke="#67e8f9" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            </svg>
            <span className="text-sm font-medium tracking-tight text-white">AIOS <span className="font-normal text-slate-500">by cvlSoft</span></span>
          </a>
          <div className="flex items-center gap-8">
            <a href="#platform" className="hidden text-sm text-slate-400 transition hover:text-white md:block">
              Platform
            </a>
            <a href="#problem" className="hidden text-sm text-slate-400 transition hover:text-white md:block">
              The Problem
            </a>
            <a
              href="#demo"
              onClick={() => handleCtaClick("header")}
              className="rounded-md border border-white/[0.10] bg-cyan-400 px-5 py-2 text-xs font-semibold tracking-[0.08em] text-slate-950 transition hover:bg-cyan-300"
            >
              REQUEST DEMO
            </a>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* ── HERO ── */}
        <section className="relative min-h-[70vh] overflow-hidden">

          {/* Spiral background */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {/* Subtle glow behind spiral */}
            <div className="absolute right-[5%] top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-cyan-500/[0.06] blur-[120px]" />
            {/* Spiral with left fade */}
            <div className="absolute top-1/2 h-[153.3%] w-[93.7%]" style={{ right: "0", top: "50%", transform: "translate(375px, calc(-50% - 20px))", maskImage: "linear-gradient(to right, transparent 0%, black 35%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 35%)" }}>
              <HeroSpiral />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 px-6 pb-24 pt-16 sm:px-10 lg:pb-32 lg:pl-[120px] lg:pr-[112px] lg:pt-24">
            <div className="max-w-2xl">
              <h1 className="reveal-up text-[clamp(2.8rem,6vw,5rem)] font-light leading-[1.08] tracking-[-0.03em] text-white">
                Your most expensive people do the same work{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">
                  every day.
                </span>
              </h1>

              <p className="reveal-up mt-6 max-w-[540px] text-xl font-normal text-slate-400 [animation-delay:100ms]">
                That&rsquo;s not strategy — it&rsquo;s waste! AIOS learns how your experts
                actually work — then executes it autonomously, at scale.
                <br /><br />
                Outcome-based pricing. No savings, no charge — ever.
              </p>

              <div className="reveal-up mt-10 flex flex-wrap gap-3 [animation-delay:200ms]">
                <a
                  href="#demo"
                  onClick={() => handleCtaClick("hero_primary")}
                  className="rounded-md bg-cyan-400 px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20"
                >
                  Request Demo
                </a>
                <a
                  href="#platform"
                  onClick={() => handleCtaClick("hero_secondary")}
                  className="rounded-md border border-slate-600 px-7 py-3.5 text-sm font-medium text-slate-300 transition hover:border-slate-400 hover:text-white"
                >
                  How It Works
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section divider ── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

        {/* ── WHY CVLSOFT IS DIFFERENT ── */}
        <section id="platform" className="relative bg-[#0a0f1a] py-24 md:py-32">
          <SectionScrollLine />
          {/* Top fade */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#050a14] to-transparent" />
          {/* Bottom fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050a14] to-transparent" />
          <div className="pointer-events-none absolute right-0 bottom-0 -z-10 h-96 w-96 rounded-full bg-indigo-500/[0.04] blur-[100px]" />
          <div className="pointer-events-none absolute -left-10 top-1/2 -z-10 h-72 w-72 rounded-full bg-cyan-500/[0.05] blur-[80px]" />

          <div className=" px-6 sm:px-10 lg:pl-[205px] lg:pr-[112px]">
            <p className="reveal-up inline-block rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] text-cyan-400">
              THE PLATFORM
            </p>
            <h2 className="reveal-up mt-5 text-[clamp(2rem,5vw,3.5rem)] font-light tracking-[-0.03em] text-white [animation-delay:60ms]">
              Why we are different.
            </h2>
            <p className="reveal-up mt-5 mb-48 max-w-3xl text-lg leading-relaxed text-slate-400 md:text-xl [animation-delay:120ms]">
              The industry builds an agent for every task. AIOS builds
              cognition — adaptive intelligence that reasons about any workflow,
              selects any tool, and scales without maintenance debt.
              Stop building AI agents. Start building intelligence.
            </p>

            {/* Feature rows — each with its own illustration box */}
            <div className="mt-32 space-y-64">
              {DIFFERENTIATORS.map((item, i) => {
                const illustrations = [
                  /* 0: Persona-centric */ <svg key="i0" viewBox="0 0 400 300" fill="none" className="h-full w-full"><circle cx="200" cy="150" r="40" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.3" fill="#0e3a4a" fillOpacity="0.5"/><text x="200" y="145" textAnchor="middle" fill="#22d3ee" fontSize="9" fontWeight="600" letterSpacing="0.1em">PERSONA</text><text x="200" y="160" textAnchor="middle" fill="#64748b" fontSize="8">Operator Role</text>{[0,60,120,180,240,300].map((a,j)=>{const l=["APPROVE","QUERY","EXECUTE","REVIEW","ROUTE","AUDIT"];return(<g key={j}><circle cx="200" cy="150" r="110" stroke="#22d3ee" strokeOpacity="0.06" strokeWidth="1" fill="none"/><g><animateTransform attributeName="transform" type="rotate" from={`${a} 200 150`} to={`${a+360} 200 150`} dur={`${20+j*2}s`} repeatCount="indefinite"/><rect x="185" y="36" width="30" height="18" rx="4" fill="#0d1322" stroke="#1e293b" strokeWidth="1"/><text x="200" y="48" textAnchor="middle" fill="#94a3b8" fontSize="6" fontWeight="600" letterSpacing="0.05em">{l[j]}</text></g></g>);})}<circle cx="200" cy="150" r="40" stroke="#22d3ee" strokeOpacity="0.15" strokeWidth="1" fill="none"><animate attributeName="r" values="40;55;40" dur="3s" repeatCount="indefinite"/><animate attributeName="stroke-opacity" values="0.15;0.05;0.15" dur="3s" repeatCount="indefinite"/></circle></svg>,
                  /* 1: Tacit knowledge (Remotion) */ <TacitKnowledgePlayer key="i1" />,
                  /* 2: Cognitive core (Remotion) */ <CognitiveCorePlayer key="i2" />,
                  /* 3: Learning loop (Remotion) */ <LearningLoopPlayer key="i3" />,
                  /* 4: Security (Remotion) */ <SecurityPosturePlayer key="i4" />,
                  /* 5: Connector (Remotion) */ <ConnectorFabricPlayer key="i5" />,
                ];

                return (
                  <div key={item.title} className="reveal-up grid items-center gap-10 lg:grid-cols-[5fr_6fr]" style={{ animationDelay: `${i * 60}ms` }}>
                    {/* Text — vertically centered, horizontally centered between line and box */}
                    <div className="flex flex-col items-start justify-center px-4 py-8 lg:mx-auto lg:px-0">
                      <h3 className="max-w-md text-2xl font-light tracking-[-0.02em] text-white md:text-[36px] md:leading-[1.15]">{item.title}</h3>
                      <p className="mt-6 max-w-md text-[15px] leading-relaxed text-slate-400">{item.description}</p>
                      <a href="#demo" className="mt-8 inline-flex w-fit items-center gap-2 rounded-md border border-slate-600 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-400 hover:text-white">
                        Learn more <span className="text-xs">&#8599;</span>
                      </a>
                    </div>
                    {/* Illustration box */}
                    <div className="relative overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0a1020]">
                      <div className="pointer-events-none absolute bottom-0 right-0 h-[70%] w-[70%] rounded-full bg-cyan-500/[0.06] blur-[80px]" />
                      <div className="flex aspect-[16/10] items-center justify-center p-10">
                        {illustrations[[2, 1, 3, 4, 5][i]]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Forward-deployed engineers — featured card */}
            <article className="reveal-up mt-16 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-8 md:flex md:items-center md:gap-10 [animation-delay:500ms]">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                <IconRocket className="h-7 w-7" />
              </div>
              <div className="mt-4 md:mt-0">
                <h3 className="text-lg font-normal text-white">Forward-deployed AIOS engineers</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                  We don&rsquo;t hand you software and wish you luck. cvlSoft engineers embed
                  directly with your team to deploy AIOS against real workflows, integrate with
                  your existing systems, and drive measurable outcomes from day one. From scoping
                  to production, we stay in the trenches — tuning agent behavior, hardening
                  guardrails, and ensuring every automation earns the trust of the people who
                  depend on it.
                </p>
              </div>
            </article>

            {/* ── Outcomes-based pricing ── */}
            <div className="reveal-up mt-32 [animation-delay:600ms]">
              <p className="inline-block rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] text-emerald-400">
                PRICING
              </p>
              <h2 className="mt-6 text-[clamp(2rem,5vw,3.5rem)] font-light tracking-[-0.03em] text-white">
                We make money when you make money.
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-400 md:text-xl">
                No per-seat licenses. No per-connector fees. AIOS uses outcome-based pricing:
                you pay a low platform fee to keep the lights on, plus a per-task fee for every
                successful execution. Failed tasks are free. Always.
              </p>

              <div className="mt-12 grid gap-5 sm:grid-cols-3">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-6">
                  <p className="font-mono text-sm font-semibold text-emerald-400">Platform Fee</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    A deliberately low monthly fee covering infrastructure, connectors,
                    security stack, and unlimited users. Not a profit center.
                  </p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-6">
                  <p className="font-mono text-sm font-semibold text-emerald-400">Per-Task Outcomes</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    Each workflow has a per-task price anchored to 20-40% of what you&rsquo;d pay
                    a human. You save 60-80% on every successful task. Token costs baked in.
                  </p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-6">
                  <p className="font-mono text-sm font-semibold text-emerald-400">Failed = Free</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    If a task fails, escalates, or gets killed, you pay nothing.
                    AIOS only earns when it delivers. Our incentives are your incentives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section divider ── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

        {/* ── INDUSTRY PROBLEM ── */}
        <section id="problem" className="relative py-24 md:py-32">
          <SectionScrollLine />
          {/* Top fade */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0a0f1a] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0f1a] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 -z-10 h-80 w-80 rounded-full bg-rose-500/[0.06] blur-[80px]" />

          <div className=" px-6 sm:px-10 lg:pl-[205px] lg:pr-[112px]">
            <p className="reveal-up inline-block rounded-full border border-rose-500/20 bg-rose-500/5 px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] text-rose-400">
              THE INDUSTRY PROBLEM
            </p>

            <h2 className="reveal-up mt-6 max-w-4xl text-[clamp(2rem,5vw,3.5rem)] font-light leading-snug text-white [animation-delay:60ms]">
              <span className="font-mono font-medium text-rose-400">95%</span> of enterprise AI{" "}
              <span className="underline decoration-rose-400 decoration-[3px] underline-offset-4">
                never reaches production.
              </span>
            </h2>

            <p className="reveal-up mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-400 [animation-delay:120ms]">
              The agentic AI industry has structural problems that point
              solutions can&rsquo;t fix. Here&rsquo;s the data.
            </p>

            {/* Attrition Funnel */}
            <div className="reveal-up mt-12 rounded-lg border border-white/[0.06] bg-white/[0.03] p-6 md:p-8 [animation-delay:160ms]">
              <p className="font-mono text-[11px] tracking-[0.18em] text-slate-500">
                CONCEPT &rarr; PRODUCTION
              </p>
              <p className="mt-3 text-base font-medium text-slate-200 md:text-lg">
                For every 100 enterprises that start an AI initiative,
                only 5 ship to production.
              </p>
              <div className="mt-5 space-y-3">
                {FUNNEL_STAGES.map((stage, i) => {
                  const barColor = ["bg-slate-700", "bg-slate-400", "bg-amber-500", "bg-rose-500"][i];
                  const numColor = ["text-slate-300", "text-slate-400", "text-amber-500", "text-rose-400"][i];
                  return (
                    <div key={stage.label}>
                      <div className="mb-1 flex items-baseline gap-2">
                        <span className={`font-mono text-sm font-medium ${numColor}`}>
                          {stage.pct}%
                        </span>
                        <span className="text-xs text-slate-500">
                          {stage.label}
                        </span>
                      </div>
                      <div
                        className={`bar-fill h-7 rounded-md ${barColor}`}
                        style={{ width: `${stage.pct}%`, minWidth: "16px", transitionDelay: `${400 + i * 200}ms` }}
                      />
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-slate-400">
                Source: MIT Sloan Management Review &middot; Gartner
              </p>
            </div>

            {/* Two-column: Why They Fail + Cost Over Time */}
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {/* Failure breakdown */}
              <div className="reveal-up rounded-lg border border-white/[0.06] bg-white/[0.03] p-6 md:p-8 [animation-delay:240ms]">
                <p className="font-mono text-[11px] tracking-[0.18em] text-slate-500">
                  WHY THEY FAIL
                </p>
                <p className="mt-3 text-base font-medium text-slate-200">
                  Governance and integration account for 62% of all failures.
                </p>

                <div className="mt-5 flex h-6 gap-0.5 overflow-hidden rounded-md">
                  {FAILURE_REASONS.map((r, i) => {
                    const color = ["bg-rose-400", "bg-amber-400", "bg-orange-400", "bg-slate-300"][i];
                    return (
                      <div
                        key={r.label}
                        className={`bar-fill ${color}`}
                        style={{ width: `${r.pct}%`, transitionDelay: `${500 + i * 150}ms` }}
                      />
                    );
                  })}
                </div>

                <div className="mt-5 space-y-2.5">
                  {FAILURE_REASONS.map((r, i) => {
                    const dot = ["bg-rose-400", "bg-amber-400", "bg-orange-400", "bg-slate-300"][i];
                    return (
                      <div key={r.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                          <span className="text-sm text-slate-400">{r.label}</span>
                        </div>
                        <span className="font-mono text-sm font-medium text-slate-300">
                          {r.pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 text-xs text-slate-400">
                  Source: UC Berkeley &middot; Industry surveys
                </p>
              </div>

              {/* Cost over time */}
              <div className="reveal-up rounded-lg border border-white/[0.06] bg-white/[0.03] p-6 md:p-8 [animation-delay:320ms]">
                <p className="font-mono text-[11px] tracking-[0.18em] text-slate-500">
                  TOTAL COST OF OWNERSHIP
                </p>
                <p className="mt-3 text-base font-medium text-slate-200">
                  Custom workflows compound cost. Reusable skills flatten it.
                </p>

                <svg
                  viewBox="0 0 300 160"
                  className="mt-5 w-full"
                  role="img"
                  aria-label="Cost comparison: custom workflows and RPA rise over 5 years while AIOS stays flat"
                >
                  {[35, 70, 105].map((y) => (
                    <line key={y} x1="10" y1={y} x2="290" y2={y} stroke="#1e293b" strokeWidth="0.5" />
                  ))}

                  <path className="chart-area" d="M10,115 C50,108 90,95 130,78 S210,35 250,20 L290,8 L290,140 L10,140 Z" fill="#f43f5e" fillOpacity="0.06" />
                  <path className="chart-area" d="M10,110 C80,114 155,120 220,122 S280,124 290,125 L290,140 L10,140 Z" fill="#0891b2" fillOpacity="0.06" style={{ transitionDelay: "1.4s" }} />

                  <path className="chart-line" d="M10,115 C50,108 90,95 130,78 S210,35 250,20 L290,8" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" style={{ transitionDelay: "0.6s" }} />
                  <polyline className="chart-line" points="10,108 80,100 150,72 220,68 290,42" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transitionDelay: "0.9s" }} />
                  <path className="chart-line" d="M10,110 C80,114 155,120 220,122 S280,124 290,125" fill="none" stroke="#0891b2" strokeWidth="3" strokeLinecap="round" style={{ transitionDelay: "1.2s" }} />

                  {["Yr 1", "Yr 2", "Yr 3", "Yr 4", "Yr 5"].map((yr, i) => (
                    <text key={yr} x={10 + i * 70} y={155} style={{ fontSize: "9px", fill: "#94a3b8", fontFamily: "var(--font-code), monospace" }}>
                      {yr}
                    </text>
                  ))}
                  <text x="4" y="18" style={{ fontSize: "8px", fill: "#94a3b8", fontFamily: "var(--font-code), monospace" }}>
                    Cost &uarr;
                  </text>
                </svg>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-5 rounded bg-rose-500" />
                    <span className="text-xs text-slate-500">Custom workflows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-5 rounded bg-amber-500" />
                    <span className="text-xs text-slate-500">RPA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-5 rounded bg-cyan-500" />
                    <span className="text-xs font-medium text-cyan-400">AIOS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AIOS: The Antithesis */}
            <div className="reveal-up mt-5 rounded-lg border border-cyan-500/15 bg-cyan-500/[0.04] p-6 md:p-8 [animation-delay:400ms]">
              <p className="text-lg font-medium text-white">
                AIOS is built for the 95%.
              </p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { title: "Production from day one", desc: "Forward-deployed engineers ship real workflows, not demos." },
                  { title: "Governance built in", desc: "Policy engine, circuit breakers, and evidence-grade audit." },
                  { title: "Flat cost curve", desc: "Reusable skills eliminate maintenance debt." },
                  { title: ">99% accuracy", desc: "Deterministic policy controls close the reliability gap." },
                ].map((item) => (
                  <div key={item.title}>
                    <p className="text-sm font-medium text-cyan-400">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section divider ── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

        {/* ── OBSERVATIONAL LEARNING ── */}
        <section className="relative bg-[#0a0f1a] py-24 md:py-32">
          <SectionScrollLine />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#050a14] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050a14] to-transparent" />
          <div className="pointer-events-none absolute -left-20 top-1/3 -z-10 h-80 w-80 rounded-full bg-cyan-500/[0.05] blur-[100px]" />

          <div className=" px-6 sm:px-10 lg:pl-[205px] lg:pr-[112px]">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Text — left */}
              <div className="reveal-up flex flex-col justify-center">
                <p className="self-start rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] text-cyan-400">
                  OBSERVATIONAL LEARNING
                </p>
                <h2 className="mt-6 text-[clamp(2rem,5vw,3.5rem)] font-light leading-snug text-white">
                  Your best operators&rsquo; knowledge{" "}
                  <span className="underline decoration-cyan-400 decoration-[3px] underline-offset-4">
                    walks out the door
                  </span>{" "}
                  every day.
                </h2>
                <p className="mt-3 text-xl font-normal text-cyan-400">
                  We capture it before it does.
                </p>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-400 md:text-lg">
                  AIOS learns from screen captures, click paths, and decision logic to
                  distill expert behavior into certified, reusable skills that any agent can
                  execute. No documentation sprints. Just operational truth, extracted and
                  deployed.
                </p>
              </div>

              {/* Visual flow — right */}
              <div className="flex flex-col items-center gap-4">
                {[
                  {
                    step: "01",
                    label: "Observational Learning",
                    desc: "Observe real operator workflows across any set of applications; including legacy systems, mainframes, and swivel chair operations",
                  },
                  {
                    step: "02",
                    label: "Knowledge Extraction",
                    desc: "AI distills tacit patterns, decision trees, and edge cases",
                  },
                  {
                    step: "03",
                    label: "Certified Skill",
                    desc: "Validated, versioned skill ready for agent execution",
                  },
                ].map((item, i) => (
                  <div key={item.step} className="cascade flex w-full max-w-sm flex-col items-center" style={{ animationDelay: `${i * 300}ms` }}>
                    <div className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] p-5 transition hover:bg-white/[0.05]">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-cyan-500/10 font-mono text-sm font-medium text-cyan-400">
                          {item.step}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{item.label}</p>
                          <p className="text-xs leading-relaxed text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                    {i < 2 && (
                      <svg className="my-1 h-6 w-6 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section divider ── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

        {/* ── COMPARISON TABLE ── */}
        <section className="relative py-24 md:py-32">
          <SectionScrollLine />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0a0f1a] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0f1a] to-transparent" />
          <div className="pointer-events-none absolute left-0 bottom-0 -z-10 h-72 w-72 rounded-full bg-cyan-500/[0.04] blur-[80px]" />

          <div className=" px-6 sm:px-10 lg:pl-[205px] lg:pr-[112px]">
            <h2 className="reveal-up text-[clamp(2rem,5vw,3.5rem)] font-light tracking-[-0.03em] text-white">
              vs. the alternatives.
            </h2>
            <p className="reveal-up mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-400 [animation-delay:80ms]">
              See where AIOS fits against the options enterprises are
              actually evaluating.
            </p>

            <div className="reveal-up mt-12 overflow-x-auto [animation-delay:150ms]">
              <table className="w-full min-w-[700px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="py-3 pr-4 text-left font-medium text-slate-500">Capability</th>
                    <th className="px-4 py-3 text-center font-medium text-cyan-400">AIOS</th>
                    <th className="px-4 py-3 text-center font-medium text-slate-500">Custom Agentic Frameworks</th>
                    <th className="px-4 py-3 text-center font-medium text-slate-500">RPA Vendors</th>
                    <th className="px-4 py-3 text-center font-medium text-slate-500">Cloud Platforms</th>
                    <th className="pl-4 py-3 text-center font-medium text-slate-500">Open-Source Frameworks</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    ["Tribal knowledge capture", "Yes", "No", "No", "No", "No"],
                    ["Model agnostic", "Yes", "Varies", "No", "No", "Yes"],
                    ["Legacy connectors (mainframe, terminal)", "Full", "Manual", "Partial", "API only", "None"],
                    ["Deterministic policy engine", "Built-in", "DIY", "Limited", "Partial", "DIY"],
                    ["Evidence-grade audit", "Built-in", "No", "Partial", "Partial", "No"],
                    ["Zero maintenance debt", "Yes", "No", "No", "No", "No"],
                  ] as const).map((row, i) => (
                    <tr key={i} className="row-fade border-b border-white/[0.04]" style={{ animationDelay: `${150 + i * 100}ms` }}>
                      <td className="py-3.5 pr-4 font-medium text-slate-300">{row[0]}</td>
                      {row.slice(1).map((cell, j) => {
                        const isPositive = cell === "Yes" || cell === "Full" || cell === "Built-in";
                        const isNegative = cell === "No" || cell === "None";
                        return (
                          <td
                            key={j}
                            className={`px-4 py-3.5 text-center font-medium ${
                              j === 0
                                ? isPositive
                                  ? "text-cyan-400"
                                  : "text-slate-600"
                                : isNegative
                                  ? "text-slate-700"
                                  : "text-amber-500"
                            }`}
                          >
                            {j === 0 && isPositive ? `\u2713 ${cell}` : cell}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Section divider ── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

        {/* ── DEMO CTA ── */}
        <section id="demo" className="relative bg-[#0a0f1a] py-24 md:py-32">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#050a14] to-transparent" />
          <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="relative overflow-hidden rounded-lg border border-white/[0.06] bg-[#0d1322] p-10 md:p-16">
            {/* Decorative orbs */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[60px]" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-[60px]" />

            <h2 className="relative text-center text-[clamp(2rem,5vw,3.5rem)] font-light tracking-[-0.03em] text-white">
              See it in your environment.
            </h2>
            <p className="relative mt-4 text-center text-base text-slate-400">
              Work email only. Fast architecture walkthrough.
            </p>

            <form className="relative mx-auto mt-8 grid max-w-md gap-3" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="rounded-md border border-white/10 bg-white/[0.05] px-5 py-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
                  placeholder="First name"
                />
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="rounded-md border border-white/10 bg-white/[0.05] px-5 py-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
                  placeholder="Last name"
                />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-md border border-white/10 bg-white/[0.05] px-5 py-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
                placeholder="Work email"
              />
              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-md border border-white/10 bg-white/[0.05] px-5 py-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
                placeholder="Phone (optional)"
              />
              <input
                id="company"
                name="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="rounded-md border border-white/10 bg-white/[0.05] px-5 py-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
                placeholder="Company"
              />
              <div className="mt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={formStatus === "loading"}
                  onClick={() => handleCtaClick("demo_form")}
                  className="flex-1 rounded-md bg-cyan-400 px-8 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {formStatus === "loading" ? "Submitting..." : "Request Demo"}
                </button>
                <a
                  href="#platform"
                  className="rounded-md border border-slate-600 px-6 py-3.5 text-sm font-medium text-slate-300 transition hover:border-slate-400 hover:text-white"
                >
                  Learn More
                </a>
              </div>
              {formMessage ? (
                <p className={`text-center text-sm ${formStatus === "error" ? "text-rose-400" : "text-emerald-400"}`}>
                  {formMessage}
                </p>
              ) : null}
            </form>
          </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.04] py-8">
        <div className="flex flex-col items-center justify-between gap-3 px-6 sm:px-10 md:flex-row lg:px-[60px]">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 48 48" fill="none" className="h-5 w-5" aria-hidden="true">
              <path d="M32 10 A18 18 0 1 0 32 38" stroke="#0e7490" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <path d="M30 16 A12 12 0 1 0 30 32" stroke="#22d3ee" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M28 21 A6 6 0 1 0 28 27" stroke="#67e8f9" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </svg>
            <span className="font-mono text-xs tracking-[0.12em] text-slate-600">
              &copy; {year} cvlSoft
            </span>
          </div>
          <p className="font-mono text-[10px] tracking-wider text-slate-700">
            Enterprise autonomy without automation debt.
          </p>
        </div>
      </footer>
    </div>
  );
}
