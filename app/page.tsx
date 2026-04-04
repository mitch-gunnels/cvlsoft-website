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

function SectionScrollLine({ color = "cyan" }: { color?: "cyan" | "emerald" | "rose" } = {}) {
  const styles = {
    cyan: "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]",
    emerald: "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]",
    rose: "bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.6)]",
  };
  return (
    <div className="pointer-events-none absolute left-[175px] top-0 bottom-0 z-20 hidden lg:block">
      <div className="absolute left-[4px] top-0 bottom-0 w-px bg-white/[0.10]" />
      <div className="absolute left-0 top-[160px] bottom-0 overflow-visible">
        <div className="sticky top-[150px] h-0">
          <div className={`h-[10px] w-[10px] rounded-full ${styles[color]}`} />
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
  { label: "Experimenting with AI", pct: 88 },
  { label: "Scaling agentic AI", pct: 23 },
  { label: "Beyond proof-of-concept", pct: 22 },
  { label: "Creating substantial value", pct: 4 },
];

const BARRIERS = [
  { label: "Trust & governance", stat: "63%", statDesc: "lack AI governance policies", source: "Forrester 2025-2026" },
  { label: "No ROI proof", stat: "47%", statDesc: "have no AI strategy at all", source: "BCG 2025" },
  { label: "Cascading failure risk", stat: "75%", statDesc: "of DIY agentic architectures will fail", source: "Forrester 2026" },
  { label: "Talent gap", stat: "#1", statDesc: "barrier to integrating AI into workflows", source: "Deloitte 2026" },
  { label: "Architecture complexity", stat: "40%+", statDesc: "of agentic AI projects will be canceled by 2027", source: "Gartner 2025" },
  { label: "Regulatory acceleration", stat: "10pt", statDesc: "rise as a deployment barrier in one year", source: "Deloitte 2025" },
  { label: "Culture & process inertia", stat: "70%", statDesc: "of AI success is people/process, not tech", source: "BCG 2025" },
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
  const [expandedTiers, setExpandedTiers] = useState<Set<number>>(new Set());
  const [formMessage, setFormMessage] = useState("");
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
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
    if (!phone.trim()) {
      setFormStatus("error");
      setFormMessage("Please enter your work phone number.");
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
            <a href="#problem" className="hidden text-sm text-slate-400 transition hover:text-white md:block">
              Problem
            </a>
            <a href="#platform" className="hidden text-sm text-slate-400 transition hover:text-white md:block">
              Platform
            </a>
            <a href="#pricing" className="hidden text-sm text-slate-400 transition hover:text-white md:block">
              Pricing
            </a>
            <a href="#partnership" className="hidden text-sm text-slate-400 transition hover:text-white md:block">
              Partnership
            </a>
            <a href="#pulse" className="hidden text-sm text-slate-400 transition hover:text-white md:block">
              Pulse
            </a>
            <a href="#proof" className="hidden text-sm text-slate-400 transition hover:text-white md:block">
              Proof
            </a>
            <a href="#pedigree" className="hidden text-sm text-slate-400 transition hover:text-white md:block">
              Pedigree
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
                Enterprise AI has a 96% failure rate for a reason —{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">
                  it&rsquo;s built wrong.
                </span>
              </h1>

              <p className="reveal-up mt-6 max-w-[540px] text-xl font-normal text-slate-400 [animation-delay:100ms]">
                AIOS captures how your experts actually work, then executes autonomously with guardrails.
                Not another chatbot. Not another agent framework. An operating system for autonomous intelligence.
                <br /><br />
                No savings, no charge — ever.
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
                  Why We&rsquo;re Different
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section divider ── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

        {/* ── INDUSTRY PROBLEM ── */}
        <section id="problem" className="relative bg-[#0a0f1a] py-24 md:py-32">
          <SectionScrollLine color="rose" />
          {/* Top fade */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#050a14] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050a14] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 -z-10 h-80 w-80 rounded-full bg-rose-500/[0.06] blur-[80px]" />

          <div className=" px-6 sm:px-10 lg:pl-[205px] lg:pr-[112px]">
            <p className="reveal-up inline-block rounded-full border border-rose-500/20 bg-rose-500/5 px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] text-rose-400">
              THE INDUSTRY PROBLEM
            </p>

            <h2 className="reveal-up mt-6 text-[clamp(2rem,5vw,3.5rem)] font-light leading-snug text-white [animation-delay:60ms]">
              <span className="font-mono font-medium text-rose-400">96%</span> of enterprises <span className="underline decoration-rose-400 decoration-[3px] underline-offset-4">aren&rsquo;t creating real value from AI.</span>
            </h2>

            <p className="reveal-up mt-5 max-w-3xl text-lg leading-relaxed text-slate-400 md:text-xl [animation-delay:120ms]">
              Everyone&rsquo;s experimenting. Almost no one&rsquo;s shipping. The data is brutal, but tells a consistent story!
            </p>

            {/* Scaling Gap Funnel */}
            <div className="observe-viz reveal-up mt-12 rounded-lg border border-white/[0.06] bg-white/[0.03] p-6 md:p-8 [animation-delay:160ms]">
              <p className="font-mono text-[11px] tracking-[0.18em] text-slate-500">
                THE SCALING GAP
              </p>
              <p className="mt-3 text-base font-medium text-slate-200 md:text-lg">
                88% of organizations use AI. Only 4% are creating substantial value.
              </p>
              <div className="mt-5 space-y-3">
                {FUNNEL_STAGES.map((stage, i) => {
                  const barColor = ["bg-slate-500", "bg-amber-500", "bg-orange-500", "bg-rose-500"][i];
                  const numColor = ["text-slate-300", "text-amber-400", "text-orange-400", "text-rose-400"][i];
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
              <p className="mt-4 text-xs text-slate-500">
                Source: McKinsey State of AI, Nov 2025 &middot; BCG &ldquo;Widening AI Value Gap,&rdquo; Sept 2025
              </p>
            </div>

            {/* Kill Shot Stat */}
            <div className="reveal-up mt-5 rounded-lg border border-rose-500/15 bg-rose-500/[0.04] p-6 md:p-8 [animation-delay:220ms]">
              <p className="text-center text-3xl font-light text-white md:text-4xl">
                <span className="font-mono font-medium text-rose-400">40%+</span> of agentic AI projects will be{" "}
                <span className="underline decoration-rose-400 decoration-2 underline-offset-4">canceled</span> by 2027.
              </p>
              <p className="mt-3 text-center text-xs text-slate-500">
                Due to escalating costs, unclear business value, or inadequate risk controls. &mdash; Gartner, June 2025
              </p>
            </div>

            {/* 7 Barriers + Cost Over Time — side by side */}
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {/* 7 Barriers Grid */}
              <div className="reveal-up rounded-lg border border-white/[0.06] bg-white/[0.03] p-6 md:p-8 [animation-delay:280ms]">
                <p className="font-mono text-[11px] tracking-[0.18em] text-slate-500">
                  7 BARRIERS TO ENTERPRISE AGENTIC AI
                </p>
                <p className="mt-3 text-base font-medium text-slate-200">
                  The research converges on seven structural problems. Point solutions can&rsquo;t fix them.
                </p>

                <div className="mt-6 space-y-4">
                  {BARRIERS.map((b, i) => (
                    <div key={b.label} className="flex items-start gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/10 font-mono text-xs font-medium text-rose-400">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="text-sm font-medium text-white">{b.label}</span>
                          <span className="font-mono text-sm font-medium text-rose-400">{b.stat}</span>
                          <span className="text-xs text-slate-500">{b.statDesc}</span>
                        </div>
                        <p className="mt-0.5 text-[10px] text-slate-600">{b.source}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Over Time */}
              <div className="observe-viz reveal-up rounded-lg border border-white/[0.06] bg-white/[0.03] p-6 md:p-8 [animation-delay:340ms]">
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
                AIOS is built to solve the barriers that matter most.
              </p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  { title: "Trust & governance", desc: "Deterministic policy guardrails, plan-before-execute, evidence-grade audit trails." },
                  { title: "Cascading failure", desc: "Circuit breakers, hierarchical kill switches, deterministic safety at every step." },
                  { title: "Architecture complexity", desc: "Pre-built cognitive core replaces DIY agent sprawl. No architecture to maintain." },
                  { title: "Talent gap", desc: "AI-powered knowledge extraction from SMEs — no ML engineers required." },
                  { title: "ROI from day one", desc: "Outcome-based pricing. You pay per successful task. Failed tasks are free." },
                ].map((item) => (
                  <div key={item.title}>
                    <p className="text-sm font-medium text-cyan-400">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Automation Spectrum Infographic */}
              <div className="mt-10 border-t border-white/[0.08] pt-10">
                <svg viewBox="0 -20 1200 600" fill="none" className="w-full" role="img" aria-label="AIOS Automation Spectrum: Deterministic Automation, Deterministic Intelligence, and Full Autonomy">

                  {/* ── Full-width label above bar ── */}
                  <text x="600" y="15" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="600" letterSpacing="0.1em">AIOS COVERS THE FULL SPECTRUM (Deterministic thru Full Autonomy)</text>

                  {/* ── Spectrum bar ── */}
                  <rect x="40" y="34" width="1120" height="8" rx="4" fill="#1e293b" />
                  <rect x="40" y="34" width="280" height="8" rx="4" fill="#475569" />
                  <rect x="320" y="32" width="560" height="12" rx="6" fill="#22d3ee" opacity="0.8" />
                  <rect x="880" y="34" width="280" height="8" rx="4" fill="#475569" />
                  {/* Center marker */}
                  <circle cx="600" cy="38" r="6" fill="#22d3ee" />
                  <circle cx="600" cy="38" r="10" fill="#22d3ee" opacity="0.2">
                    <animate attributeName="r" values="10;14;10" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.2;0.08;0.2" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <text x="600" y="62" textAnchor="middle" fill="#22d3ee" fontSize="9" fontWeight="600" letterSpacing="0.1em">SWEET SPOT</text>

                  {/* ── LEFT COLUMN: Deterministic Automation ── */}
                  <rect x="40" y="100" width="340" height="410" rx="12" fill="#0a0f1a" stroke="#1e293b" strokeWidth="1" />

                  {/* Icon: rigid grid — centered */}
                  <rect x="198" y="124" width="8" height="8" rx="1" fill="#475569" />
                  <rect x="210" y="124" width="8" height="8" rx="1" fill="#475569" />
                  <rect x="222" y="124" width="8" height="8" rx="1" fill="#475569" />
                  <rect x="198" y="136" width="8" height="8" rx="1" fill="#475569" />
                  <rect x="210" y="136" width="8" height="8" rx="1" fill="#475569" />
                  <rect x="222" y="136" width="8" height="8" rx="1" fill="#475569" />

                  <text x="210" y="174" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600" letterSpacing="0.12em">DETERMINISTIC AUTOMATION</text>
                  <text x="210" y="198" textAnchor="middle" fill="#64748b" fontSize="11">Pure rule-based execution. No AI judgment.</text>
                  <text x="210" y="214" textAnchor="middle" fill="#64748b" fontSize="11">Every action follows explicit if/then logic.</text>
                  <text x="210" y="230" textAnchor="middle" fill="#64748b" fontSize="11">Predictable but brittle.</text>

                  {/* Traits — centered */}
                  <circle cx="120" cy="262" r="3" fill="#475569" />
                  <text x="132" y="266" fill="#94a3b8" fontSize="11">100% predictable</text>
                  <circle cx="120" cy="286" r="3" fill="#475569" />
                  <text x="132" y="290" fill="#94a3b8" fontSize="11">Strict decision matrix</text>
                  <circle cx="120" cy="310" r="3" fill="#475569" />
                  <text x="132" y="314" fill="#94a3b8" fontSize="11">High maintenance cost</text>
                  <circle cx="120" cy="334" r="3" fill="#475569" />
                  <text x="132" y="338" fill="#94a3b8" fontSize="11">Edge cases are hard to maintain</text>

                  {/* Use case */}
                  <text x="210" y="376" textAnchor="middle" fill="#475569" fontSize="9" fontWeight="600" letterSpacing="0.1em">USE CASE</text>
                  <text x="210" y="396" textAnchor="middle" fill="#64748b" fontSize="11">Simple automations, scripted workflows</text>

                  {/* Bottom stat */}
                  <rect x="62" y="420" width="296" height="32" rx="6" fill="#1e293b" />
                  <text x="210" y="441" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="500">~5% of enterprise needs</text>


                  {/* ── CENTER COLUMN: Deterministic Intelligence ── */}
                  <rect x="400" y="96" width="400" height="418" rx="12" fill="#0a0f1a" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.3" />
                  <rect x="401" y="97" width="398" height="416" rx="12" fill="#22d3ee" fillOpacity="0.02" />

                  {/* Icon: shield with circuit pattern inside — centered in box */}
                  <path d="M586,118 L600,110 L614,118 L614,136 C614,146 600,154 600,154 C600,154 586,146 586,136 Z" stroke="#22d3ee" strokeWidth="1.5" fill="#22d3ee" fillOpacity="0.06" />
                  {/* Circuit nodes inside shield — vertically centered */}
                  <circle cx="600" cy="123" r="2.5" fill="#22d3ee" opacity="0.8" />
                  <circle cx="593" cy="132" r="2" fill="#22d3ee" opacity="0.6" />
                  <circle cx="607" cy="132" r="2" fill="#22d3ee" opacity="0.6" />
                  <circle cx="600" cy="141" r="2" fill="#22d3ee" opacity="0.5" />
                  <line x1="600" y1="123" x2="593" y2="132" stroke="#22d3ee" strokeWidth="0.8" opacity="0.5" />
                  <line x1="600" y1="123" x2="607" y2="132" stroke="#22d3ee" strokeWidth="0.8" opacity="0.5" />
                  <line x1="593" y1="132" x2="600" y2="141" stroke="#22d3ee" strokeWidth="0.8" opacity="0.5" />
                  <line x1="607" y1="132" x2="600" y2="141" stroke="#22d3ee" strokeWidth="0.8" opacity="0.5" />

                  <text x="600" y="178" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="600" letterSpacing="0.12em">GUIDED AUTONOMY</text>
                  <text x="600" y="194" textAnchor="middle" fill="#22d3ee" fontSize="9" fontWeight="500" opacity="0.7">The AIOS default</text>

                  <text x="600" y="218" textAnchor="middle" fill="#94a3b8" fontSize="11">AI reasoning operates inside deterministic guardrails.</text>
                  <text x="600" y="234" textAnchor="middle" fill="#94a3b8" fontSize="11">The system thinks, but policy controls what it can do.</text>

                  {/* Traits with cyan checks — centered */}
                  {[
                    "AI reasoning + policy guardrails",
                    "Adapts to edge cases within bounds",
                    "Plan-before-execute architecture",
                    "Evidence-grade audit trail",
                    "Human-in-the-loop when needed",
                  ].map((trait, i) => (
                    <g key={trait}>
                      <path d={`M480,${262 + i * 24} L484,${266 + i * 24} L490,${258 + i * 24}`} stroke="#22d3ee" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      <text x="498" y={266 + i * 24} fill="#e2e8f0" fontSize="11">{trait}</text>
                    </g>
                  ))}

                  {/* 90% stat */}
                  <text x="600" y="434" textAnchor="middle" fill="#ffffff" fontSize="28" fontWeight="300">
                    <tspan fill="#22d3ee" fontWeight="500" fontFamily="var(--font-code), monospace">90%</tspan>
                    <tspan fill="#94a3b8" fontSize="14"> of enterprise workflows</tspan>
                  </text>
                  <text x="600" y="456" textAnchor="middle" fill="#94a3b8" fontSize="14">belong here</text>
                  <line x1="530" y1="462" x2="670" y2="462" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.4" />

                  {/* Bottom tag */}
                  <text x="600" y="492" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="500" letterSpacing="0.08em">WHERE COMPLIANCE MEETS INTELLIGENCE</text>


                  {/* ── RIGHT COLUMN: Full Autonomy ── */}
                  <rect x="820" y="100" width="340" height="410" rx="12" fill="#0a0f1a" stroke="#1e293b" strokeWidth="1" />

                  {/* Icon: expanding neural nodes — centered */}
                  <circle cx="978" cy="128" r="5" fill="#475569" />
                  <circle cx="996" cy="120" r="3.5" fill="#475569" />
                  <circle cx="1010" cy="134" r="4" fill="#475569" />
                  <circle cx="990" cy="142" r="3" fill="#475569" />
                  <line x1="978" y1="128" x2="996" y2="120" stroke="#475569" strokeWidth="1" />
                  <line x1="996" y1="120" x2="1010" y2="134" stroke="#475569" strokeWidth="1" />
                  <line x1="978" y1="128" x2="1010" y2="134" stroke="#475569" strokeWidth="1" />
                  <line x1="978" y1="128" x2="990" y2="142" stroke="#475569" strokeWidth="1" />
                  <line x1="1010" y1="134" x2="990" y2="142" stroke="#475569" strokeWidth="1" />

                  <text x="990" y="174" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600" letterSpacing="0.12em">FULL AUTONOMY</text>
                  <text x="990" y="198" textAnchor="middle" fill="#64748b" fontSize="11">Fully autonomous AI with maximum</text>
                  <text x="990" y="214" textAnchor="middle" fill="#64748b" fontSize="11">agency. Minimal human oversight.</text>
                  <text x="990" y="230" textAnchor="middle" fill="#64748b" fontSize="11">Requires the highest trust threshold.</text>

                  {/* Traits — centered */}
                  <circle cx="900" cy="262" r="3" fill="#475569" />
                  <text x="912" y="266" fill="#94a3b8" fontSize="11">Maximum AI agency</text>
                  <circle cx="900" cy="286" r="3" fill="#475569" />
                  <text x="912" y="290" fill="#94a3b8" fontSize="11">Minimal guardrails</text>
                  <circle cx="900" cy="310" r="3" fill="#475569" />
                  <text x="912" y="314" fill="#94a3b8" fontSize="11">Highest risk surface</text>
                  <circle cx="900" cy="334" r="3" fill="#475569" />
                  <text x="912" y="338" fill="#94a3b8" fontSize="11">Requires mature governance</text>

                  {/* Use case */}
                  <text x="990" y="376" textAnchor="middle" fill="#475569" fontSize="9" fontWeight="600" letterSpacing="0.1em">USE CASE</text>
                  <text x="990" y="396" textAnchor="middle" fill="#64748b" fontSize="11">Research, creative generation,</text>
                  <text x="990" y="412" textAnchor="middle" fill="#64748b" fontSize="11">open-ended exploration</text>

                  {/* Bottom stat */}
                  <rect x="842" y="420" width="296" height="32" rx="6" fill="#1e293b" />
                  <text x="990" y="441" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="500">~5% of enterprise needs</text>


                  {/* ── Bottom callout — larger, more space ── */}
                  <text x="600" y="548" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="400">
                    One platform. Three modes. <tspan fill="#22d3ee" fontWeight="500">The 90% in the middle</tspan> is where enterprises actually operate.
                  </text>
                  <text x="600" y="570" textAnchor="middle" fill="#64748b" fontSize="12">
                    AIOS handles all three — but the sweet spot is Deterministic Intelligence.
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section divider ── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

        {/* ── WHY CVLSOFT IS DIFFERENT ── */}
        <section id="platform" className="relative py-24 md:py-32">
          <SectionScrollLine />
          {/* Top fade */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0a0f1a] to-transparent" />
          {/* Bottom fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0f1a] to-transparent" />
          <div className="pointer-events-none absolute right-0 bottom-0 -z-10 h-96 w-96 rounded-full bg-indigo-500/[0.04] blur-[100px]" />
          <div className="pointer-events-none absolute -left-10 top-1/2 -z-10 h-72 w-72 rounded-full bg-cyan-500/[0.05] blur-[80px]" />

          <div className=" px-6 sm:px-10 lg:pl-[205px] lg:pr-[112px]">
            <p className="reveal-up inline-block rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] text-cyan-400">
              THE PLATFORM
            </p>
            <h2 className="reveal-up mt-5 text-[clamp(2rem,5vw,3.5rem)] font-light tracking-[-0.03em] text-white [animation-delay:60ms]">
              Why we&rsquo;re different.
            </h2>
            <p className="reveal-up mt-5 mb-16 md:mb-48 max-w-3xl text-lg leading-relaxed text-slate-400 md:text-xl [animation-delay:120ms]">
              The industry builds an agent for every task. AIOS builds
              cognition — adaptive intelligence that reasons about any workflow,
              selects any tool, and scales without maintenance debt. &nbsp;
              <span className="underline decoration-cyan-400 decoration-2 underline-offset-4">Stop building AI agents. Start building intelligence.</span>
            </p>

            {/* Feature rows — each with its own illustration box */}
            <div className="mt-12 space-y-20 md:mt-32 md:space-y-64">
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

          </div>
        </section>

        {/* ── Section divider ── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

        {/* ── PRICING ── */}
        <section id="pricing" className="relative bg-[#0a0f1a] py-24 md:py-32">
          <SectionScrollLine color="emerald" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0a0f1a] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0f1a] to-transparent" />
          <div className="pointer-events-none absolute left-0 bottom-0 -z-10 h-72 w-72 rounded-full bg-emerald-500/[0.04] blur-[80px]" />

          <div className="px-6 sm:px-10 lg:pl-[205px] lg:pr-[112px]">
            <p className="reveal-up inline-block rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] text-emerald-400">
              PRICING
            </p>
            <h2 className="reveal-up mt-6 text-[clamp(2rem,5vw,3.5rem)] font-light tracking-[-0.03em] text-white [animation-delay:60ms]">
              We make money when you make money.
            </h2>
            <p className="reveal-up mt-5 max-w-3xl text-lg leading-relaxed text-slate-400 md:text-xl [animation-delay:120ms]">
              You pay for successful outcomes. Failed tasks are free. Always.
              No per-seat licenses. No per-connector fees. Just the floor cost of running
              your tenant.
            </p>

            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              <div className="reveal-up rounded-lg border border-white/[0.06] bg-white/[0.03] p-6 [animation-delay:180ms]">
                <p className="font-mono text-sm font-semibold text-emerald-400">Floor Cost Only</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Your platform fee covers the bare cost of running your tenant.
                  Infrastructure, connectors, tokens, security, unlimited users. No margin added.
                </p>
              </div>
              <div className="reveal-up rounded-lg border border-white/[0.06] bg-white/[0.03] p-6 [animation-delay:240ms]">
                <p className="font-mono text-sm font-semibold text-emerald-400">Per-Task Outcomes</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Each workflow has a per-task price anchored to 20-40% of what you&rsquo;d pay
                  a human. You save 60-80% on every successful task. Token costs baked in.
                </p>
              </div>
              <div className="reveal-up rounded-lg border border-white/[0.06] bg-white/[0.03] p-6 [animation-delay:300ms]">
                <p className="font-mono text-sm font-semibold text-emerald-400">Failed = Free</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  If a task fails, escalates, or gets killed, you pay nothing.
                  AIOS only earns when it delivers. Our incentives are your incentives.
                </p>
              </div>
            </div>

            {/* Task tier table */}
            <div className="reveal-up mt-12 overflow-x-auto [animation-delay:360ms]">
              <p className="mb-4 font-mono text-[11px] tracking-[0.18em] text-emerald-400">
                TASK PRICING BY COMPLEXITY
              </p>
              <table className="w-full min-w-[750px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="py-3 pr-4 text-left font-medium text-slate-500">Tier</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-500">What it replaces</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-500">Examples</th>
                    <th className="px-4 py-3 text-right font-medium text-rose-400">Human cost**</th>
                    <th className="px-4 py-3 text-right font-medium text-emerald-400">AIOS per task*</th>
                    <th className="pl-4 py-3 text-right font-medium text-emerald-400">You save</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    {
                      tier: "Micro", desc: "~15–20 min — single action, no judgment", human: "~$32", aios: "$6 – $13", save: "59–81%",
                      examples: [
                        "Route a support ticket to the correct queue based on content",
                        "Classify an invoice as PO-matched or exception",
                        "Look up customer account status and return summary to requestor",
                        "Verify a shipping address against USPS and correct formatting",
                        "Check if a new lead exists in CRM and deduplicate",
                        "Tag and categorize an inbound email by intent and urgency",
                      ],
                    },
                    {
                      tier: "Standard", desc: "~1–2 hrs — multi-step, one system", human: "~$144", aios: "$29 – $58", save: "60–80%",
                      examples: [
                        "Extract line items from a PDF invoice, validate against PO, post to ERP",
                        "Process a new vendor submission: validate TIN, check OFAC, create record",
                        "Pull a customer's renewal data, generate a quote PDF, email to rep",
                        "Reconcile a single bank statement against GL and flag mismatches",
                        "Parse an inbound RFP and populate a response template with known answers",
                        "Generate a weekly sales anomaly report from CRM data",
                      ],
                    },
                    {
                      tier: "Complex", desc: "~3–6 hrs — multi-system, judgment calls", human: "~$432", aios: "$86 – $173", save: "60–80%",
                      examples: [
                        "Audit an expense report against travel policy, cross-check receipts, approve or flag",
                        "Customer escalation: pull history from CRM, tickets, and billing, draft resolution",
                        "New hire provisioning: create accounts across AD, Slack, email, and SaaS tools, verify each",
                        "Contract review: extract key terms, compare against procurement standards, flag deviations",
                        "Insurance claim: pull policy details, validate docs, cross-reference coverage rules, route with recommendation",
                      ],
                    },
                    {
                      tier: "Expert", desc: "~1–3 days — cross-system orchestration, decision chains", human: "~$1,536", aios: "$307 – $614", save: "60–80%",
                      examples: [
                        "Employee offboarding: revoke access across 12 systems, verify each, recover licenses, generate compliance cert",
                        "SOX audit: pull evidence from 5+ systems against control checklist, identify gaps, generate report",
                        "RFP response: retrieve case studies, pull pricing, assemble compliance matrix, draft document",
                        "Month-end close: reconcile intercompany transactions across 4 entities, resolve discrepancies, post adjustments",
                        "Vendor risk review: pull financials, check sanctions lists, review SLA performance, score and recommend",
                      ],
                    },
                    {
                      tier: "Strategic", desc: "~1–4 weeks — end-to-end process, multiple stakeholders", human: "~$7,680+", aios: "$1,536 – $3,072", save: "60–80%",
                      examples: [
                        "Annual vendor renewal cycle: pull spend data, benchmark rates, draft contracts, track through approvals",
                        "Regulatory filing: aggregate data across business units, validate against rules, resolve issues, format and submit",
                        "M&A data room: extract and organize financials, contracts, IP, compliance docs from both entities",
                        "Customer churn analysis: pull usage, support history, billing, NPS for flagged accounts, generate risk-scored report",
                      ],
                    },
                    {
                      tier: "Autonomous Ops", desc: "Ongoing — recurring orchestration, custom scope", human: "Custom", aios: "Custom", save: "Custom",
                      examples: [
                        "Process every incoming claim end-to-end: intake, validate, adjudicate, pay or deny",
                        "Handle all L1/L2 IT tickets: diagnose, attempt resolution, verify fix, close or escalate with context",
                        "Manage daily AP queue: match invoices to POs, resolve discrepancies, route approvals, schedule payments",
                      ],
                    },
                  ] as const).map((row, i) => {
                    const isExpanded = expandedTiers.has(i);
                    return (
                      <tr
                        key={i}
                        className="row-fade border-b border-white/[0.04] align-top cursor-pointer select-none transition-colors duration-200 hover:bg-emerald-500/[0.04] hover:border-emerald-500/[0.12]"
                        style={{ animationDelay: `${360 + i * 80}ms` }}
                        onClick={() => setExpandedTiers((prev) => {
                          const next = new Set(prev);
                          if (next.has(i)) next.delete(i); else next.add(i);
                          return next;
                        })}
                      >
                        <td className="py-3.5 pr-4 font-mono font-medium text-emerald-400">{row.tier}</td>
                        <td className="px-4 py-3.5 text-slate-400">{row.desc}</td>
                        <td className="px-4 py-3.5 text-slate-500">
                          <ul className="list-disc pl-4 space-y-1">
                            {isExpanded
                              ? row.examples.map((ex, j) => <li key={j}>{ex}</li>)
                              : row.examples.slice(0, 2).map((ex, j) => <li key={j}>{ex}</li>)
                            }
                          </ul>
                          {!isExpanded && row.examples.length > 2 && (
                            <p className="mt-1.5 pl-4 text-xs text-emerald-400/70">... and {row.examples.length - 2} more</p>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono text-rose-400/70">{row.human}</td>
                        <td className="px-4 py-3.5 text-right font-mono font-medium text-white">{row.aios}</td>
                        <td className="pl-4 py-3.5 text-right font-mono text-emerald-400/80">{row.save}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                *Per-task fees are anchored to 20–40% of fully loaded human cost. Pricing is agreed upon during onboarding.<br />
                **Human cost based on $150K salary (~$200K fully loaded at $96/hr).
              </p>
            </div>
          </div>
        </section>

        {/* ── Section divider ── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

        {/* ── PARTNERSHIP — WHITE GLOVE ROLLOUT ── */}
        <section id="partnership" className="relative py-24 md:py-32">
          <SectionScrollLine />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#050a14] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050a14] to-transparent" />
          <div className="pointer-events-none absolute -left-20 top-1/3 -z-10 h-80 w-80 rounded-full bg-cyan-500/[0.05] blur-[100px]" />

          <div className="px-6 sm:px-10 lg:pl-[205px] lg:pr-[112px]">
            <p className="reveal-up inline-block rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] text-cyan-400">
              WHITE GLOVE ROLLOUT
            </p>
            <h2 className="reveal-up mt-6 text-[clamp(2rem,5vw,3.5rem)] font-light leading-snug text-white [animation-delay:60ms]">
              Accelerated rollout.{" "}
              <span className="underline decoration-cyan-400 decoration-[3px] underline-offset-4">
                Optional. Hands-on.
              </span>
            </h2>
            <p className="reveal-up mt-5 max-w-3xl text-lg leading-relaxed text-slate-400 md:text-xl [animation-delay:120ms]">
              AIOS is self-serve out of the box. But if you want to move fast, our engineers
              embed directly with your team to get you to production in 90 days. An optional
              service for teams that want white glove support from day one.
            </p>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Scope & Interview",
                  desc: "We sit with your SMEs, run AIOS Interviewer sessions, capture screen workflows, and map the processes that matter most.",
                },
                {
                  step: "02",
                  title: "Build & Integrate",
                  desc: "Our engineers build agentic workflows against your real systems, configure connectors, tune policies, and wire up approval gates.",
                },
                {
                  step: "03",
                  title: "Validate & Ship",
                  desc: "Eval suites run against production data. Workflows promote through Draft, Staging, Production with governance at every gate. Live in 90 days.",
                },
                {
                  step: "04",
                  title: "Monitor & Optimize",
                  desc: "Real-time metrics, execution traces, and the agentic self-evolution memory system feed continuous improvement. We tune alongside your team.",
                },
                {
                  step: "05",
                  title: "Expand & Scale",
                  desc: "New workflows deploy faster because the cognitive core already knows your systems. Each deployment makes the next one easier.",
                },
                {
                  step: "06",
                  title: "Transfer & Own",
                  desc: "Your team learns the platform. We transition to advisory. You own the system, the workflows, and the knowledge base.",
                },
              ].map((item, i) => (
                <div key={item.step} className="reveal-up rounded-lg border border-white/[0.06] bg-white/[0.03] p-6 transition hover:bg-white/[0.05]" style={{ animationDelay: `${180 + i * 80}ms` }}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-cyan-500/10 font-mono text-sm font-medium text-cyan-400">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="reveal-up mt-12 rounded-lg border border-cyan-500/15 bg-cyan-500/[0.04] p-6 md:p-8 [animation-delay:700ms]">
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-8">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <IconRocket className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-lg font-normal text-white">90 days from kickoff to production.</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    Not a POC. Not a demo environment. Real workflows, real data, real outcomes.
                    We put skin in the game because our pricing depends on your success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section divider ── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

        {/* ── PULSE — APPLICATION SCREENS ── */}
        <section id="pulse" className="relative bg-[#0a0f1a] py-24 md:py-32">
          <SectionScrollLine />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0a0f1a] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0f1a] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-1/3 -z-10 h-80 w-80 rounded-full bg-indigo-500/[0.04] blur-[100px]" />

          <div className="px-6 sm:px-10 lg:pl-[205px] lg:pr-[112px]">
            <p className="reveal-up inline-block rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] text-cyan-400">
              INSIDE THE PLATFORM
            </p>
            <h2 className="reveal-up mt-6 text-[clamp(2rem,5vw,3.5rem)] font-light tracking-[-0.03em] text-white [animation-delay:60ms]">
              See everything. Control everything.
            </h2>
            <p className="reveal-up mt-5 max-w-3xl text-lg leading-relaxed text-slate-400 md:text-xl [animation-delay:120ms]">
              AIOS gives you full visibility into every workflow, every agent decision,
              and every outcome. No black boxes.
            </p>

            {/* Screen cards */}
            <div className="mt-16 grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "Real-Time Metrics Dashboard",
                  desc: "KPIs, success rates, token usage, and cost tracking across all workflows and tenants. Live sparklines update via WebSocket.",
                  tag: "OBSERVABILITY",
                  img: "/screen-dashboard.png",
                },
                {
                  title: "Agent Execution Traces",
                  desc: "Nested span trees across five levels: pipeline, agent, LLM, tool, and walker node. See exactly what the AI did and why.",
                  tag: "TRACING",
                  img: "/screen-execution-trace.png",
                },
                {
                  title: "Connector Marketplace",
                  desc: "Browse, install, and configure hundreds of connectors. Each one is immediately usable by the cognitive core.",
                  tag: "CONNECTORS",
                  img: "/screen-connectors.png",
                },
                {
                  title: "Evaluation Suites",
                  desc: "Test case libraries, trajectory matching, and custom LLM evaluators. Workflows can't promote to production without passing eval gates.",
                  tag: "TESTING",
                  img: "/screen-evals.png",
                },
                {
                  title: "Policy Engine & Overrides",
                  desc: "Configure deterministic allow/deny rules, priority-based overrides, risk conditions, and RBAC across 19+ resource types.",
                  tag: "GOVERNANCE",
                  img: "/screen-policy-engine.png",
                },
                {
                  title: "Audit Trail & Compliance",
                  desc: "Every action, policy decision, approval, and data access logged with timestamps, actor identity, and full request details.",
                  tag: "AUDIT",
                  img: "/screen-audit-log.png",
                },
              ].map((screen, i) => (
                <div key={screen.title} className="reveal-up group relative cursor-pointer overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1020] transition hover:border-white/[0.12]" style={{ animationDelay: `${180 + i * 80}ms` }} onClick={() => setLightboxImg(screen.img)}>
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img src={screen.img} alt={screen.title} className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.02]" loading="lazy" />
                    <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 20px 8px #0a1020" }} />
                  </div>
                  <div className="p-5">
                    <p className="font-mono text-[10px] tracking-[0.2em] text-cyan-400/50">{screen.tag}</p>
                    <h3 className="mt-1 text-base font-semibold text-white">{screen.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-slate-500">{screen.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section divider ── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

        {/* ── COMPARISON TABLE ── */}
        <section id="proof" className="relative py-24 md:py-32">
          <SectionScrollLine />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0a0f1a] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0f1a] to-transparent" />
          <div className="pointer-events-none absolute left-0 bottom-0 -z-10 h-72 w-72 rounded-full bg-cyan-500/[0.04] blur-[80px]" />

          <div className=" px-6 sm:px-10 lg:pl-[205px] lg:pr-[112px]">
            <h2 className="reveal-up text-[clamp(2rem,5vw,3.5rem)] font-light tracking-[-0.03em] text-white">
              The proof is in the platform.
            </h2>
            <p className="reveal-up mt-4 max-w-3xl text-lg leading-relaxed text-slate-400 [animation-delay:80ms]">
              Every other platform builds a separate agent for every task. AIOS builds cognition.
              See how that changes everything.
            </p>

            <div className="reveal-up mt-12 overflow-x-auto [animation-delay:150ms]">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="py-3 pr-4 text-left font-medium text-slate-500">Capability</th>
                    <th className="px-3 py-3 text-left font-medium text-cyan-400">AIOS</th>
                    <th className="px-3 py-3 text-left font-medium text-slate-500">AgentForce*</th>
                    <th className="px-3 py-3 text-left font-medium text-slate-500">LangGraph / CrewAI*</th>
                    <th className="px-3 py-3 text-left font-medium text-slate-500">RPA (UiPath, AA)*</th>
                    <th className="pl-3 py-3 text-left font-medium text-slate-500">Cloud AI (AWS, Azure)*</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    ["Agent architecture", "Single cognitive core", "Agent per task", "Agent per task", "Bot per process", "Agent templates"],
                    ["Adding new capabilities", "Add connector, done", "Build new agent", "Write new code", "Build new bot", "New template"],
                    ["Tacit knowledge capture", "AI interviews + screen capture", "No", "No", "No", "No"],
                    ["Agentic self-evolution", "Built-in", "No", "No", "No", "No"],
                    ["LLM flexibility", "Any provider — switch by config", "BYOLLM available, ecosystem-centric", "Abstraction layer, eng effort to switch", "N/A", "Multi-model (within ecosystem)"],
                    ["Security posture", "Deterministic policy engine", "Trust Layer (probabilistic)", "DIY", "Role-based", "IAM / provider-dependent"],
                    ["Pre-execution review", "Full plan visible before action", "No", "No", "No", "No"],
                    ["Kill switches", "Global + tenant + execution", "Single-level", "None", "Single-level", "Single-level"],
                    ["Compliance-grade audit trail", "Built-in, immutable", "Partial", "DIY (LangSmith separate)", "Process-level logs", "Provider-dependent"],
                    ["Human-in-the-loop gates", "Pauses execution until approved", "Notifications", "DIY", "Action Center notifications", "Notifications"],
                    ["Multi-tenancy", "Architected from day one", "Org-level", "DIY (not architectural)", "Varies", "Provider-dependent"],
                    ["Pricing model", "Outcome-based — failed = free", "$2/conversation or $0.10/action", "Open source + eng team cost", "Per-bot + platform license", "Per-token consumption"],
                    ["Time to production", "90 days with FDEs", "Weeks to months", "Months of eng build", "Weeks to months", "Weeks to months"],
                    ["Maintenance at scale", "Sublinear", "Linear (agent per task)", "Linear (code per agent)", "Linear (bot per process)", "Linear"],
                  ] as const).map((row, i) => (
                    <tr key={i} className="row-fade border-b border-white/[0.04] transition-colors duration-200 hover:bg-cyan-500/[0.04] hover:border-cyan-500/[0.12]" style={{ animationDelay: `${150 + i * 60}ms` }}>
                      <td className="py-3.5 pr-4 font-medium text-slate-300">{row[0]}</td>
                      {row.slice(1).map((cell, j) => {
                        const isPositive = ["Single cognitive core", "Add connector, done", "AI interviews + screen capture", "Built-in", "Any provider — switch by config", "Deterministic policy engine", "Full plan visible before action", "Global + tenant + execution", "Built-in, immutable", "Pauses execution until approved", "Architected from day one", "Outcome-based — failed = free", "90 days with FDEs", "Sublinear"].includes(cell);
                        const isNegative = cell === "No" || cell === "None" || cell === "N/A";
                        return (
                          <td
                            key={j}
                            className={`px-3 py-3.5 text-left text-[13px] ${
                              j === 0
                                ? isPositive
                                  ? "font-semibold text-cyan-400"
                                  : "text-slate-600"
                                : isNegative
                                  ? "text-slate-700"
                                  : "text-amber-500/80"
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
              <p className="mt-6 text-xs leading-relaxed text-slate-600">
                *Competitor comparisons based on publicly available documentation, pricing pages, and product announcements
                as of March 2026. Sources include{" "}
                <a href="https://www.salesforce.com/agentforce/pricing/" className="text-slate-500 underline hover:text-slate-400" target="_blank" rel="noopener noreferrer">salesforce.com/agentforce</a>,{" "}
                <a href="https://developer.salesforce.com/docs/ai/agentforce/guide/supported-models.html" className="text-slate-500 underline hover:text-slate-400" target="_blank" rel="noopener noreferrer">Salesforce BYOLLM docs</a>,{" "}
                <a href="https://www.uipath.com/pricing" className="text-slate-500 underline hover:text-slate-400" target="_blank" rel="noopener noreferrer">uipath.com/pricing</a>,{" "}
                <a href="https://aws.amazon.com/bedrock/model-choice/" className="text-slate-500 underline hover:text-slate-400" target="_blank" rel="noopener noreferrer">AWS Bedrock model choice</a>,{" "}
                <a href="https://langchain-ai.github.io/langgraph/" className="text-slate-500 underline hover:text-slate-400" target="_blank" rel="noopener noreferrer">LangGraph docs</a>, and{" "}
                <a href="https://docs.crewai.com" className="text-slate-500 underline hover:text-slate-400" target="_blank" rel="noopener noreferrer">CrewAI docs</a>.
                Feature availability may vary by plan or edition. AIOS capabilities reflect current production release.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section divider ── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

        {/* ── PEDIGREE — DEEP EXPERTISE ── */}
        <section id="pedigree" className="relative overflow-hidden bg-[#0a0f1a] py-24 md:py-32">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#050a14] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050a14] to-transparent" />

          {/* Subtle background glow — right side */}
          <div className="pointer-events-none absolute -right-20 top-1/2 -z-10 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-cyan-500/[0.04] blur-[140px]" />
          <div className="pointer-events-none absolute right-[10%] top-[30%] -z-10 h-[300px] w-[300px] rounded-full bg-indigo-500/[0.03] blur-[120px]" />

          {/* Large faded "cvl" watermark on right */}
          {/* Glow on right */}
          <div className="pointer-events-none absolute right-[5%] top-1/2 z-0 hidden h-[500px] w-[500px] -translate-x-[100px] -translate-y-1/2 rounded-full bg-cyan-500/[0.075] blur-[150px] lg:block" />

          <div className="px-6 sm:px-10 lg:pl-[205px] lg:pr-[112px]">
            <div>
              <p className="reveal-up inline-block rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] text-cyan-400">
                PEDIGREE
              </p>
              <h2 className="reveal-up mt-6 text-[clamp(2rem,5vw,3.5rem)] font-light tracking-[-0.03em] text-white [animation-delay:60ms]">
                Deep expertise, not just code.
              </h2>
              <div className="reveal-up mt-8 max-w-4xl space-y-5 text-lg leading-relaxed text-slate-400 [animation-delay:120ms]">
                <p>
                  Cognitive Venture Labs (cvlSoft) was founded by experts who have spent years in the trenches of enterprise
                  AI systems. Our founders were early contributors to transformer-based AI and thought leaders in agentic AI. We understand how large organizations actually operate: the
                  politics, the compliance requirements, the legacy systems, the tribal knowledge
                  that nobody has documented. That understanding is baked into the architecture
                  of AIOS itself.
                </p>
                <p>
                  When you work with cvlSoft, you benefit from that accumulated expertise and
                  intellectual property. Our cognitive core, our knowledge extraction techniques,
                  our security posture, our pricing model: these are not engineering decisions.
                  They are hard-won insights from years of watching enterprise AI projects fail
                  and understanding exactly why.
                </p>
              </div>
              <p className="reveal-up mt-8 max-w-4xl text-xl font-light leading-relaxed text-white [animation-delay:180ms]">
                The technical implementation is the icing. The foundation is knowing what to build,
                how to deploy it, and what it takes to earn trust inside an enterprise. That part
                isn&rsquo;t written in code — it&rsquo;s earned.
              </p>
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
              Not hype, real enterprise agentic AI!
            </h2>
            <p className="relative mt-4 text-center text-2xl text-slate-400 md:text-3xl">
              See it now. Work email only.
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
                required
                className="rounded-md border border-white/10 bg-white/[0.05] px-5 py-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
                placeholder="Work phone"
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
      <footer className="border-t border-white/[0.06] bg-[#050a14]">
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-16 sm:px-10 lg:px-[60px]">
          {/* Footer columns */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 48 48" fill="none" className="h-6 w-6" aria-hidden="true">
                  <path d="M32 10 A18 18 0 1 0 32 38" stroke="#0e7490" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                  <path d="M30 16 A12 12 0 1 0 30 32" stroke="#22d3ee" strokeWidth="4" fill="none" strokeLinecap="round" />
                  <path d="M28 21 A6 6 0 1 0 28 27" stroke="#67e8f9" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                </svg>
                <span className="text-sm font-medium text-white">AIOS <span className="font-normal text-slate-500">by cvlSoft</span></span>
              </div>
              <p className="mt-4 max-w-xs text-xs leading-relaxed text-slate-600">
                 Stop building AI agents. Start building intelligence.
              </p>
            </div>

            {/* Product */}
              <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-slate-500">PRODUCT</p>
              <ul className="mt-4 space-y-2.5">
                <li><a href="#problem" className="text-sm text-slate-500 transition hover:text-white">Problem</a></li>
                <li><a href="#platform" className="text-sm text-slate-500 transition hover:text-white">Platform</a></li>
                <li><a href="#pricing" className="text-sm text-slate-500 transition hover:text-white">Pricing</a></li>
                <li><a href="#partnership" className="text-sm text-slate-500 transition hover:text-white">Partnership</a></li>
                <li><a href="#pulse" className="text-sm text-slate-500 transition hover:text-white">Pulse</a></li>
                <li><a href="#proof" className="text-sm text-slate-500 transition hover:text-white">Proof</a></li>
                <li><a href="#pedigree" className="text-sm text-slate-500 transition hover:text-white">Pedigree</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-slate-500">COMPANY</p>
              <ul className="mt-4 space-y-2.5">
                <li><a href="/about" className="text-sm text-slate-500 transition hover:text-white">About</a></li>
                <li><a href="/contact" className="text-sm text-slate-500 transition hover:text-white">Contact</a></li>
                <li><a href="#demo" className="text-sm text-slate-500 transition hover:text-white">Request Demo</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-slate-500">RESOURCES</p>
              <ul className="mt-4 space-y-2.5">
                <li><a href="#problem" className="text-sm text-slate-500 transition hover:text-white">Industry Problem</a></li>
                <li><a href="#proof" className="text-sm text-slate-500 transition hover:text-white">Comparison Table</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-slate-500">LEGAL</p>
              <ul className="mt-4 space-y-2.5">
                <li><a href="/privacy" className="text-sm text-slate-500 transition hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="text-sm text-slate-500 transition hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.04] pt-6 md:flex-row">
            <span className="font-mono text-xs tracking-[0.08em] text-slate-700">
              &copy; {year} cvlSoft, LLC All rights reserved.
            </span>
            <div className="flex gap-6">
              <a href="/privacy" className="font-mono text-[10px] tracking-wider text-slate-700 transition hover:text-slate-400">Privacy</a>
              <a href="/terms" className="font-mono text-[10px] tracking-wider text-slate-700 transition hover:text-slate-400">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── LIGHTBOX ── */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxImg(null)}
        >
          <button
            className="absolute right-6 top-6 text-3xl text-white/60 transition hover:text-white"
            onClick={() => setLightboxImg(null)}
            aria-label="Close"
          >
            &times;
          </button>
          <img
            src={lightboxImg}
            alt="Full size screenshot"
            className="max-h-[90vh] max-w-[95vw] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
