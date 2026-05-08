"use client";

import { FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/app/lib/analytics";

// ── Remotion animation players — commented out while Why AIOS uses static architecture diagrams ──
// import dynamic from "next/dynamic";
// const LearningLoopPlayer = dynamic(() => import("@/app/components/remotion/LearningLoopPlayer"), { ssr: false });
// const CognitiveCorePlayer = dynamic(() => import("@/app/components/remotion/CognitiveCorePlayer"), { ssr: false });
// const TacitKnowledgePlayer = dynamic(() => import("@/app/components/remotion/TacitKnowledgePlayer"), { ssr: false });
// const SecurityPosturePlayer = dynamic(() => import("@/app/components/remotion/SecurityPosturePlayer"), { ssr: false });
// const ConnectorFabricPlayer = dynamic(() => import("@/app/components/remotion/ConnectorFabricPlayer"), { ssr: false });

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
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
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

/* ── Section scroll indicator (sticky dot + line) ──
   Single accent (cvlSoft cyan). `tone` lets each section pick the
   surface its rule renders against — `light` for cream sections,
   `dark` for hero/CTA/footer. */

function SectionScrollLine({ tone = "light" }: { tone?: "light" | "dark" } = {}) {
  const dotClass =
    tone === "dark"
      ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]"
      : "bg-cyan-700 shadow-[0_0_10px_rgba(14,116,144,0.35)]";
  const railClass = tone === "dark" ? "bg-white/[0.10]" : "bg-slate-300/60";
  return (
    <div className="pointer-events-none absolute left-[175px] top-0 bottom-0 z-20 hidden lg:block">
      <div className={`absolute left-[4px] top-0 bottom-0 w-px ${railClass}`} />
      <div className="absolute left-0 top-[142px] bottom-[2px] overflow-visible">
        <div className="sticky top-[142px] h-0">
          <div className={`h-[10px] w-[10px] -translate-y-1/2 rounded-full ${dotClass}`} />
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

const DIFFERENTIATORS: { title: string; description: string; icon: ReactNode }[] = [
  {
    title: "One brain. Every workflow.",
    description: "Traditional platforms build a separate agent for every task — hundreds of brittle bots you have to maintain. AIOS operates like a single brilliant employee: one cognitive core that reasons about intent, selects the right tools, and adapts to any workflow. Add a new capability and every process gets smarter immediately.",
    icon: <IconCpu className="h-5 w-5" />,
  },
  {
    title: "AIOS AI interviews your experts",
    description: "AIOS AI conducts voice interviews just like a human, using seven science-backed elicitation techniques to understand how your experts complete complex tasks. While they talk, AIOS AI captures their screen, detects decision signals, and automatically builds certified, executable agentic workflows from what it learns.",
    icon: <IconEye className="h-5 w-5" />,
  },
  {
    title: "Self-evolving autonomous agents",
    description: "Every execution makes the system smarter. A three-role memory engine — Generator, Reflector, Curator — captures outcomes, surfaces patterns, and persists validated insights as reusable knowledge. No manual retraining. No prompt tuning. Continuous autonomous improvement.",
    icon: <IconGrid className="h-5 w-5" />,
  },
  {
    title: "Security-first posture.",
    description: "Every action is blocked unless an explicit policy allows it. A deterministic policy engine with allow/deny controls, global and per-execution kill switches that halt instantly, and human-in-the-loop approval gates with compliance-grade audit logging.",
    icon: <IconShield className="h-5 w-5" />,
  },
  {
    title: "Universal connector fabric",
    description: "Hundreds of connectors — REST, Slack, Jira, Google Workspace, databases, terminal, and a growing marketplace — unified under one execution contract. Add a connector and every cognitive core uses it immediately.",
    icon: <IconLink className="h-5 w-5" />,
  },
];

/* ── "Why AIOS" architecture diagrams (Option A + D — static diagram + hero stat) ── */

function DiagramFrame({ id, children }: { id: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 500 320" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={`grid-${id}`} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 L 0 24" stroke="#cbd5e1" strokeWidth="0.5" strokeOpacity="0.5" />
        </pattern>
      </defs>
      <rect width="500" height="320" fill={`url(#grid-${id})`} />
      {children}
    </svg>
  );
}

/* 1. One brain. Every workflow. — TODAY vs AIOS split contrast */
function DiagramOneBrain() {
  const todayBots = [
    { x: 38, y: 80 }, { x: 72, y: 70 }, { x: 108, y: 86 }, { x: 150, y: 72 }, { x: 186, y: 86 },
    { x: 42, y: 112 }, { x: 82, y: 104 }, { x: 126, y: 118 }, { x: 170, y: 104 }, { x: 200, y: 120 },
    { x: 58, y: 144 }, { x: 100, y: 138 }, { x: 142, y: 150 }, { x: 186, y: 138 },
    { x: 72, y: 174 }, { x: 120, y: 170 }, { x: 166, y: 180 },
  ];
  const aiosPills = [
    { x: 272, label: "FINANCE", width: 68 },
    { x: 360, label: "OPERATIONS", width: 88 },
    { x: 448, label: "SALES", width: 60 },
  ];
  const coreX = 360;
  const coreY = 162;
  return (
    <DiagramFrame id="onebrain">
      <text x="28" y="48" fill="#64748b" fontSize="9" fontWeight="600" letterSpacing="0.16em">TODAY</text>
      <text x="28" y="60" fill="#475569" fontSize="8.5">agent per task</text>
      {todayBots.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r="3" stroke="#94a3b8" strokeWidth="0.8" fill="#ffffff" />
      ))}
      {[
        [40, 80, 70, 72],
        [78, 104, 124, 118],
        [108, 86, 148, 72],
        [144, 148, 186, 138],
        [60, 144, 100, 138],
        [168, 180, 200, 120],
      ].map((seg, i) => (
        <line key={i} x1={seg[0]} y1={seg[1]} x2={seg[2]} y2={seg[3]} stroke="#94a3b8" strokeWidth="0.6" strokeOpacity="0.7" strokeDasharray="2 3" />
      ))}
      <line x1="222" y1="40" x2="222" y2="212" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 4" />
      {/* AIOS labels aligned to FINANCE pill left edge */}
      <text x="238" y="48" fill="#0e7490" fontSize="9" fontWeight="600" letterSpacing="0.16em">AIOS</text>
      <text x="238" y="60" fill="#475569" fontSize="8.5">one cognitive core</text>
      {aiosPills.map((w) => (
        <g key={w.label}>
          <rect x={w.x - w.width / 2} y="74" width={w.width} height="20" rx="3" stroke="#0e7490" strokeWidth="1" strokeOpacity="0.5" fill="#ecfeff" />
          <text x={w.x} y="88" textAnchor="middle" fill="#0f172a" fontSize="8.5" fontWeight="600" letterSpacing="0.1em">{w.label}</text>
          <line x1={w.x} y1="94" x2={coreX} y2={coreY - 40} stroke="#0e7490" strokeWidth="0.8" strokeOpacity="0.55" />
        </g>
      ))}
      {/* Cognitive core \u2014 enlarged so label fits */}
      <circle cx={coreX} cy={coreY} r="66" stroke="#0e7490" strokeWidth="0.8" strokeOpacity="0.18" fill="none" />
      <circle cx={coreX} cy={coreY} r="52" stroke="#0e7490" strokeWidth="1" strokeOpacity="0.4" fill="none" />
      <circle cx={coreX} cy={coreY} r="40" stroke="#0e7490" strokeWidth="2" fill="#ecfeff" />
      <text x={coreX} y={coreY - 2} textAnchor="middle" fill="#0e7490" fontSize="9.5" fontWeight="600" letterSpacing="0.12em">COGNITIVE</text>
      <text x={coreX} y={coreY + 11} textAnchor="middle" fill="#0e7490" fontSize="9.5" fontWeight="600" letterSpacing="0.12em">CORE</text>
      <line x1="30" y1="238" x2="470" y2="238" stroke="#cbd5e1" strokeWidth="1" />
      <text x="56" y="298" fill="#0e7490" fontSize="64" fontWeight="300" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">1</text>
      <text x="118" y="272" fill="#0e7490" fontSize="10" fontWeight="600" letterSpacing="0.16em">COGNITIVE CORE</text>
      <text x="118" y="288" fill="#0f172a" fontSize="10.5">Not one-hundred task-specific AI agents.</text>
      <text x="118" y="303" fill="#64748b" fontSize="10">{"Add a capability \u2014 every workflow inherits it."}</text>
    </DiagramFrame>
  );
}

/* 2. AIOS interviews your experts */
function DiagramInterview() {
  // Speech-like waveform: asymmetric heights above/below a centerline, with silence gaps
  const waveHeights: [number, number][] = [
    [6, 4], [10, 8], [14, 10], [8, 6], [0, 0], [12, 8], [18, 14], [22, 16], [14, 10], [8, 4],
    [0, 0], [6, 8], [16, 12], [20, 16], [24, 18], [18, 12], [10, 6], [4, 2], [0, 0], [8, 4], [10, 8],
  ];
  return (
    <DiagramFrame id="interview">
      <text x="250" y="28" textAnchor="middle" fill="#475569" fontSize="9" fontWeight="600" letterSpacing="0.16em">KNOWLEDGE CAPTURE</text>

      {/* ── Panel 1: VOICE ── */}
      <g>
        <rect x="26" y="56" width="132" height="118" rx="8" stroke="#cbd5e1" strokeWidth="1" fill="#ffffff" />
        <text x="92" y="76" textAnchor="middle" fill="#0e7490" fontSize="9" fontWeight="600" letterSpacing="0.14em">VOICE</text>
        {/* Centerline */}
        <line x1="36" y1="120" x2="148" y2="120" stroke="#cbd5e1" strokeWidth="0.5" />
        {/* Speech waveform — bars around centerline, asymmetric */}
        {waveHeights.map(([up, down], idx) => {
          const barX = 38 + idx * 5.2;
          const opacity = up === 0 ? 0 : 0.45 + ((idx % 5) * 0.1);
          return (
            <g key={idx}>
              {up > 0 && <rect x={barX} y={120 - up} width="2" height={up} rx="1" fill="#0e7490" fillOpacity={opacity} />}
              {down > 0 && <rect x={barX} y={120} width="2" height={down} rx="1" fill="#0e7490" fillOpacity={opacity} />}
            </g>
          );
        })}
        <text x="92" y="158" textAnchor="middle" fill="#64748b" fontSize="8.5" letterSpacing="0.08em">Expert explains</text>
      </g>

      {/* Arrow 1 — thicker, cyan */}
      <g>
        <line x1="162" y1="115" x2="188" y2="115" stroke="#0e7490" strokeWidth="1.8" strokeOpacity="0.85" />
        <path d="M 186 109 L 196 115 L 186 121 Z" fill="#0e7490" />
      </g>

      {/* ── Panel 2: SCREEN ── */}
      <g>
        <rect x="200" y="56" width="132" height="118" rx="8" stroke="#cbd5e1" strokeWidth="1" fill="#ffffff" />
        <text x="266" y="76" textAnchor="middle" fill="#0e7490" fontSize="9" fontWeight="600" letterSpacing="0.14em">SCREEN</text>
        {/* Mock app window */}
        <rect x="214" y="86" width="104" height="64" rx="3" stroke="#cbd5e1" strokeWidth="0.8" fill="#f8fafc" />
        {/* Traffic-light dots */}
        <circle cx="220" cy="92" r="1.5" fill="#475569" />
        <circle cx="226" cy="92" r="1.5" fill="#475569" />
        <circle cx="232" cy="92" r="1.5" fill="#475569" />
        {/* Sidebar */}
        <rect x="218" y="100" width="20" height="46" rx="1" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="221" y="104" width="14" height="2" rx="0.5" fill="#334155" />
        <rect x="221" y="110" width="10" height="2" rx="0.5" fill="#cbd5e1" />
        <rect x="221" y="116" width="12" height="2" rx="0.5" fill="#cbd5e1" />
        {/* Main content rows */}
        <rect x="244" y="100" width="68" height="3" rx="0.5" fill="#334155" />
        <rect x="244" y="108" width="54" height="3" rx="0.5" fill="#cbd5e1" />
        <rect x="244" y="116" width="62" height="3" rx="0.5" fill="#cbd5e1" />
        {/* Highlighted selection button with cyan corner brackets */}
        <rect x="246" y="126" width="58" height="18" rx="2" fill="#0e7490" fillOpacity="0.12" />
        <path d="M 246 130 L 246 126 L 250 126" stroke="#0e7490" strokeWidth="1.2" fill="none" />
        <path d="M 304 126 L 304 130" stroke="#0e7490" strokeWidth="1.2" fill="none" />
        <path d="M 304 140 L 304 144 L 300 144" stroke="#0e7490" strokeWidth="1.2" fill="none" />
        <path d="M 246 140 L 246 144 L 250 144" stroke="#0e7490" strokeWidth="1.2" fill="none" />
        {/* Cursor arrow near highlighted button */}
        <path d="M 310 138 L 310 148 L 313 145 L 316 152 L 319 150 L 316 143 L 320 143 Z" fill="#0e7490" />
        {/* Pulse ring over a captured click point */}
        <circle cx="260" cy="100" r="3" fill="#0e7490" />
        <circle cx="260" cy="100" r="6" stroke="#0e7490" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
        <text x="266" y="166" textAnchor="middle" fill="#64748b" fontSize="8.5" letterSpacing="0.08em">Decisions captured</text>
      </g>

      {/* Arrow 2 */}
      <g>
        <line x1="336" y1="115" x2="362" y2="115" stroke="#0e7490" strokeWidth="1.8" strokeOpacity="0.85" />
        <path d="M 360 109 L 370 115 L 360 121 Z" fill="#0e7490" />
      </g>

      {/* ── Panel 3: WORKFLOW (payoff — stronger styling) ── */}
      <g>
        <rect x="374" y="56" width="100" height="118" rx="8" stroke="#0e7490" strokeWidth="1.2" strokeOpacity="0.7" fill="#ffffff" />
        <rect x="376" y="58" width="96" height="114" rx="7" stroke="#0e7490" strokeWidth="0.5" strokeOpacity="0.18" fill="none" />
        <text x="424" y="76" textAnchor="middle" fill="#0e7490" fontSize="9" fontWeight="600" letterSpacing="0.14em">WORKFLOW</text>
        {/* Branching DAG — 5 nodes, one fan-out, one merge */}
        {/* Start */}
        <circle cx="388" cy="104" r="4.5" fill="#ecfeff" stroke="#0e7490" strokeWidth="1.2" />
        {/* Branch up */}
        <circle cx="420" cy="90" r="4.5" fill="#ecfeff" stroke="#0e7490" strokeWidth="1.2" />
        {/* Branch down */}
        <circle cx="420" cy="118" r="4.5" fill="#ecfeff" stroke="#0e7490" strokeWidth="1.2" />
        {/* Merge */}
        <circle cx="452" cy="104" r="4.5" fill="#ecfeff" stroke="#0e7490" strokeWidth="1.2" />
        {/* Terminal (cert) */}
        <circle cx="424" cy="140" r="5.5" fill="#ecfeff" stroke="#0e7490" strokeWidth="1.4" />
        {/* Check glyph inside terminal */}
        <path d="M 421 140 L 423 142 L 427 138" stroke="#0e7490" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Edges with arrowheads */}
        <line x1="392" y1="102" x2="416" y2="92" stroke="#0e7490" strokeWidth="1" strokeOpacity="0.7" />
        <line x1="392" y1="106" x2="416" y2="116" stroke="#0e7490" strokeWidth="1" strokeOpacity="0.7" />
        <line x1="424" y1="92" x2="448" y2="102" stroke="#0e7490" strokeWidth="1" strokeOpacity="0.7" />
        <line x1="424" y1="116" x2="448" y2="106" stroke="#0e7490" strokeWidth="1" strokeOpacity="0.7" />
        <line x1="450" y1="108" x2="428" y2="136" stroke="#0e7490" strokeWidth="1" strokeOpacity="0.7" />
        <text x="424" y="164" textAnchor="middle" fill="#64748b" fontSize="8.5" letterSpacing="0.08em">Ready to ship</text>
      </g>

      {/* Baseline progress rail connecting panel bottoms */}
      <g>
        <line x1="40" y1="182" x2="460" y2="182" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2 4" />
        <circle cx="92" cy="182" r="2" fill="#0e7490" fillOpacity="0.5" />
        <circle cx="266" cy="182" r="2" fill="#0e7490" fillOpacity="0.5" />
        <circle cx="424" cy="182" r="2" fill="#0e7490" fillOpacity="0.7" />
      </g>

      <line x1="30" y1="202" x2="470" y2="202" stroke="#cbd5e1" strokeWidth="1" />

      {/* Hero stat — anchored with cyan vertical rule */}
      <line x1="108" y1="254" x2="108" y2="308" stroke="#0e7490" strokeWidth="1" strokeOpacity="0.45" />
      <text x="52" y="298" fill="#0e7490" fontSize="62" fontWeight="300" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">7</text>
      <text x="120" y="268" fill="#0e7490" fontSize="10" fontWeight="600" letterSpacing="0.16em">ELICITATION TECHNIQUES</text>
      <text x="120" y="284" fill="#64748b" fontSize="10.5">{"Your experts talk \u2014 AIOS ships workflows."}</text>
      <text x="120" y="299" fill="#64748b" fontSize="10" fillOpacity="0.75">No prompt engineering. No AI team required.</text>
    </DiagramFrame>
  );
}

/* 3. Self-evolving \u2014 horizontal linear flow + persistent memory + cycle-back improvement arrow */
function DiagramSelfEvolving() {
  // Left-to-right: Generator -> Reflector -> Curator -> Memory (persisted), then cycles back to Generator
  const nodes = [
    { x: 80, label: "GENERATOR", desc: "Proposes next step" },
    { x: 210, label: "REFLECTOR", desc: "Evaluates outcome" },
    { x: 340, label: "CURATOR", desc: "Validates insight" },
  ];
  const nodeY = 100;
  const nodeR = 22;
  const memoryX = 440;
  return (
    <DiagramFrame id="evolve">
      <text x="250" y="28" textAnchor="middle" fill="#475569" fontSize="9" fontWeight="600" letterSpacing="0.16em">MEMORY ENGINE</text>

      {/* Linear flow arrows between the three nodes */}
      {nodes.slice(0, -1).map((n, i) => {
        const from = n.x + nodeR;
        const to = nodes[i + 1].x - nodeR - 8;
        return (
          <g key={`arr-${i}`}>
            <line x1={from} y1={nodeY} x2={to} y2={nodeY} stroke="#0e7490" strokeWidth="1.6" strokeOpacity="0.8" />
            <path d={`M ${to} ${nodeY - 5} L ${to + 8} ${nodeY} L ${to} ${nodeY + 5} Z`} fill="#0e7490" />
          </g>
        );
      })}

      {/* Curator -> Memory arrow */}
      <g>
        <line x1={nodes[2].x + nodeR} y1={nodeY} x2={memoryX - 30} y2={nodeY} stroke="#0e7490" strokeWidth="1.6" strokeOpacity="0.8" />
        <path d={`M ${memoryX - 30} ${nodeY - 5} L ${memoryX - 22} ${nodeY} L ${memoryX - 30} ${nodeY + 5} Z`} fill="#0e7490" />
      </g>

      {/* Nodes */}
      {nodes.map((n) => (
        <g key={n.label}>
          <text x={n.x} y={nodeY - 38} textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="600" letterSpacing="0.1em">{n.label}</text>
          <text x={n.x} y={nodeY - 26} textAnchor="middle" fill="#64748b" fontSize="8">{n.desc}</text>
          <circle cx={n.x} cy={nodeY} r={nodeR} stroke="#475569" strokeWidth="1.2" fill="#ffffff" />
          <circle cx={n.x} cy={nodeY} r="4" fill="#0e7490" fillOpacity="0.7" />
        </g>
      ))}

      {/* Persisted Memory block \u2014 stacked as a cylinder */}
      <g>
        <text x={memoryX} y={nodeY - 38} textAnchor="middle" fill="#0e7490" fontSize="9" fontWeight="600" letterSpacing="0.12em">MEMORY</text>
        <text x={memoryX} y={nodeY - 26} textAnchor="middle" fill="#64748b" fontSize="8">Persisted</text>
        {/* Cylinder body */}
        <path
          d={`M ${memoryX - 18} ${nodeY - 14} L ${memoryX - 18} ${nodeY + 14} A 18 6 0 0 0 ${memoryX + 18} ${nodeY + 14} L ${memoryX + 18} ${nodeY - 14}`}
          stroke="#0e7490"
          strokeWidth="1.2"
          fill="#ecfeff"
          fillOpacity="0.55"
        />
        {/* Top ellipse */}
        <ellipse cx={memoryX} cy={nodeY - 14} rx="18" ry="6" stroke="#0e7490" strokeWidth="1.2" fill="#ecfeff" fillOpacity="0.9" />
        {/* Faint layer rings inside cylinder */}
        <ellipse cx={memoryX} cy={nodeY - 6} rx="18" ry="6" stroke="#0e7490" strokeWidth="0.5" strokeOpacity="0.35" fill="none" />
        <ellipse cx={memoryX} cy={nodeY + 2} rx="18" ry="6" stroke="#0e7490" strokeWidth="0.5" strokeOpacity="0.35" fill="none" />
      </g>

      {/* Cycle-back improvement arrow \u2014 big curve from Memory back up and around to Generator */}
      <g>
        <path
          d={`M ${memoryX} ${nodeY + 22} C ${memoryX} ${nodeY + 90}, ${nodes[0].x} ${nodeY + 90}, ${nodes[0].x} ${nodeY + 24}`}
          stroke="#0e7490"
          strokeWidth="1.4"
          strokeOpacity="0.6"
          fill="none"
          strokeDasharray="4 4"
        />
        {/* Arrowhead at Generator bottom */}
        <path d={`M ${nodes[0].x - 5} ${nodeY + 28} L ${nodes[0].x} ${nodeY + 22} L ${nodes[0].x + 5} ${nodeY + 28} Z`} fill="#0e7490" fillOpacity="0.8" />
        {/* Loop label — centered in the diagram */}
        <rect x={180} y={nodeY + 76} width="140" height="22" rx="4" fill="#ffffff" stroke="#0e7490" strokeWidth="0.8" strokeOpacity="0.45" />
        <text x={250} y={nodeY + 91} textAnchor="middle" fill="#0e7490" fontSize="9" fontWeight="600" letterSpacing="0.16em">EVERY RUN LEARNS</text>
      </g>

      <line x1="30" y1="245" x2="470" y2="245" stroke="#cbd5e1" strokeWidth="1" />

      {/* Hero stat \u2014 elongated infinity via scaleX transform */}
      <g transform="translate(60, 298) scale(1.35, 1)">
        <text x="0" y="0" fill="#0e7490" fontSize="58" fontWeight="300" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">&#8734;</text>
      </g>
      <text x="140" y="276" fill="#0e7490" fontSize="10" fontWeight="600" letterSpacing="0.16em">CONTINUOUS IMPROVEMENT</text>
      <text x="140" y="292" fill="#64748b" fontSize="10.5">No retraining. No prompt tuning.</text>
      <text x="140" y="307" fill="#64748b" fontSize="10" fillOpacity="0.75">Validated insights persist as reusable knowledge.</text>
    </DiagramFrame>
  );
}

/* 4. Security-first posture \u2014 concentric defense layers + audit stream */
function DiagramSecurity() {
  const cx = 170;
  const cy = 130;
  const rings = [
    { r: 100, label: "POLICY ENGINE", desc: "Deterministic allow / deny", strokeW: 0.8, op: 0.22, labelY: 62 },
    { r: 82, label: "PLAN INSPECTION", desc: "Pre-execution policy check", strokeW: 1, op: 0.32, labelY: 94 },
    { r: 62, label: "HUMAN-IN-THE-LOOP", desc: "Approval gates at risk thresholds", strokeW: 1.2, op: 0.5, labelY: 126 },
    { r: 40, label: "KILL SWITCH", desc: "Global + per-execution halt", strokeW: 1.6, op: 0.7, labelY: 158 },
  ];
  const auditEntries = [
    { ts: "14:22:01", tag: "ALLOW", tagColor: "#0e7490", detailWidth: 70 },
    { ts: "14:22:08", tag: "DENY", tagColor: "#0f172a", detailWidth: 58 },
    { ts: "14:22:14", tag: "GATE", tagColor: "#64748b", detailWidth: 80 },
    { ts: "14:22:19", tag: "ALLOW", tagColor: "#0e7490", detailWidth: 64 },
  ];
  return (
    <DiagramFrame id="security">
      <text x="250" y="28" textAnchor="middle" fill="#475569" fontSize="9" fontWeight="600" letterSpacing="0.16em">DEFENSE IN DEPTH</text>
      {rings.map((ring, i) => (
        <circle
          key={ring.r}
          cx={cx}
          cy={cy}
          r={ring.r}
          stroke="#0e7490"
          strokeWidth={ring.strokeW}
          strokeOpacity={ring.op}
          fill="none"
          strokeDasharray={i === 0 ? "3 4" : undefined}
        />
      ))}
      <circle cx={cx} cy={cy} r="22" stroke="#0e7490" strokeWidth="1.8" fill="#ecfeff" fillOpacity="0.6" />
      <text x={cx} y={cy + 2.5} textAnchor="middle" fill="#0e7490" fontSize="7.5" fontWeight="600" letterSpacing="0.16em">ACTION</text>
      {/* Ring-to-label connectors \u2014 STRAIGHT HORIZONTAL lines from each ring's right-side intersection at the label's Y */}
      {rings.map((ring) => {
        const targetY = ring.labelY - 3;
        const dy = targetY - cy;
        const dxSquared = ring.r * ring.r - dy * dy;
        if (dxSquared <= 0) return null;
        const dotX = cx + Math.sqrt(dxSquared);
        return (
          <g key={`conn-${ring.r}`}>
            <circle cx={dotX} cy={targetY} r="2.6" fill="#0e7490" fillOpacity={ring.op + 0.35} />
            <line
              x1={dotX + 3}
              y1={targetY}
              x2="296"
              y2={targetY}
              stroke="#0e7490"
              strokeWidth="1"
              strokeOpacity={ring.op + 0.25}
            />
          </g>
        );
      })}
      {rings.map((ring) => (
        <g key={`label-${ring.r}`}>
          <text x="300" y={ring.labelY} fill="#0f172a" fontSize="9" fontWeight="600" letterSpacing="0.1em">{ring.label}</text>
          <text x="300" y={ring.labelY + 11} fill="#64748b" fontSize="8.5">{ring.desc}</text>
        </g>
      ))}
      <g>
        <text x="300" y="188" fill="#0e7490" fontSize="8.5" fontWeight="600" letterSpacing="0.14em">AUDIT STREAM</text>
        {auditEntries.map((e, j) => (
          <g key={j} opacity={1 - j * 0.12}>
            <rect x="300" y={196 + j * 12} width="168" height="10" rx="1.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" />
            <text x="305" y={203 + j * 12} fill="#64748b" fontSize="7" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">{e.ts}</text>
            <rect x="343" y={198 + j * 12} width="30" height="6.5" rx="1" fill={e.tagColor} fillOpacity="0.18" />
            <text x="358" y={203 + j * 12} textAnchor="middle" fill={e.tagColor} fontSize="6" fontWeight="700" letterSpacing="0.1em">{e.tag}</text>
            <rect x="378" y={201 + j * 12} width={e.detailWidth} height="3" rx="0.5" fill="#334155" />
            <circle cx="463" cy={202 + j * 12} r="1.6" fill={e.tagColor} fillOpacity="0.6" />
          </g>
        ))}
      </g>
      <line x1="30" y1="248" x2="470" y2="248" stroke="#cbd5e1" strokeWidth="1" />
      <text x="58" y="300" fill="#0e7490" fontSize="58" fontWeight="300" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">0</text>
      <text x="116" y="274" fill="#0e7490" fontSize="10" fontWeight="600" letterSpacing="0.16em">ACTIONS BY DEFAULT</text>
      <text x="116" y="290" fill="#64748b" fontSize="10.5">Every action requires explicit policy.</text>
      <text x="116" y="305" fill="#64748b" fontSize="10" fillOpacity="0.7">Evidence-grade audit on every decision.</text>
    </DiagramFrame>
  );
}

/* 5. Universal connector fabric \u2014 hub + named spokes */
function DiagramConnectors() {
  const cx = 250;
  const cy = 140;
  const r = 86;
  const hubR = 40;
  const nodeR = 14;
  // Rotated 22.5° so no spoke sits directly under the eyebrow label
  const spokes = [
    { a: -67.5, label: "REST", proto: "HTTPS" },
    { a: -22.5, label: "Slack", proto: "OAuth" },
    { a: 22.5, label: "Databases", proto: "SQL" },
    { a: 67.5, label: "Google", proto: "OAuth" },
    { a: 112.5, label: "Jira", proto: "REST" },
    { a: 157.5, label: "Terminal", proto: "SSH" },
    { a: 202.5, label: "HTTP", proto: "JSON" },
    { a: 247.5, label: "+ more", proto: "", plus: true },
  ];
  return (
    <DiagramFrame id="connectors">
      <text x="250" y="28" textAnchor="middle" fill="#475569" fontSize="9" fontWeight="600" letterSpacing="0.16em">CONNECTOR FABRIC</text>

      {/* Hub — stronger: outer glow + halo + core */}
      <circle cx={cx} cy={cy} r={hubR + 20} stroke="#0e7490" strokeWidth="0.6" strokeOpacity="0.1" fill="none" />
      <circle cx={cx} cy={cy} r={hubR + 8} stroke="#0e7490" strokeWidth="0.8" strokeOpacity="0.22" fill="none" />
      <circle cx={cx} cy={cy} r={hubR} stroke="#0e7490" strokeWidth="2" fill="#ecfeff" fillOpacity="0.7" />
      <circle cx={cx} cy={cy} r={hubR - 6} stroke="#0e7490" strokeWidth="1" strokeOpacity="0.6" fill="none" />
      <text x={cx} y={cy - 2} textAnchor="middle" fill="#0e7490" fontSize="9.5" fontWeight="600" letterSpacing="0.14em">EXECUTION</text>
      <text x={cx} y={cy + 11} textAnchor="middle" fill="#0e7490" fontSize="9.5" fontWeight="600" letterSpacing="0.14em">CONTRACT</text>

      {/* Spokes — terminate at node circle edge; opacity tapered from hub outward */}
      {spokes.map((s) => {
        const rad = (s.a * Math.PI) / 180;
        const nodeX = cx + Math.cos(rad) * r;
        const nodeY = cy + Math.sin(rad) * r;
        const startX = cx + Math.cos(rad) * (hubR + 2);
        const startY = cy + Math.sin(rad) * (hubR + 2);
        const lineEndX = cx + Math.cos(rad) * (r - nodeR);
        const lineEndY = cy + Math.sin(rad) * (r - nodeR);
        return (
          <g key={s.label}>
            {/* Line: bright near hub, fading outward */}
            <line
              x1={startX}
              y1={startY}
              x2={lineEndX}
              y2={lineEndY}
              stroke="#0e7490"
              strokeWidth={s.plus ? 0.8 : 1}
              strokeOpacity={s.plus ? 0.35 : 0.55}
              strokeDasharray={s.plus ? "2 3" : undefined}
            />
            {/* Node */}
            {s.plus ? (
              <g>
                {/* Marketplace \u2014 solid node with dashed halo */}
                <circle cx={nodeX} cy={nodeY} r={nodeR + 4} stroke="#0e7490" strokeWidth="1" strokeOpacity="0.35" fill="none" strokeDasharray="3 3" />
                <circle cx={nodeX} cy={nodeY} r={nodeR} stroke="#0e7490" strokeWidth="1" strokeOpacity="0.7" fill="#ffffff" />
                <text x={nodeX} y={nodeY + 4} textAnchor="middle" fill="#0e7490" fontSize="14" fontWeight="300">+</text>
              </g>
            ) : (
              <g>
                <circle cx={nodeX} cy={nodeY} r={nodeR} stroke="#0e7490" strokeWidth="1" fill="#ecfeff" />
                <g transform={`translate(${nodeX} ${nodeY})`} stroke="#0e7490" strokeLinecap="round" strokeLinejoin="round" fill="none">
                  {s.label === "REST" && (
                    <g strokeWidth="1.3">
                      <path d="M-4,-3 L-7,0 L-4,3" />
                      <path d="M4,-3 L7,0 L4,3" />
                      <line x1="-1.5" y1="-4" x2="1.5" y2="4" />
                    </g>
                  )}
                  {s.label === "Slack" && (
                    <g strokeWidth="1.3">
                      <line x1="-3" y1="-5.5" x2="-3" y2="5.5" />
                      <line x1="3" y1="-5.5" x2="3" y2="5.5" />
                      <line x1="-6" y1="-2.5" x2="6" y2="-2.5" />
                      <line x1="-6" y1="2.5" x2="6" y2="2.5" />
                    </g>
                  )}
                  {s.label === "Databases" && (
                    <g strokeWidth="1.1">
                      <ellipse cx="0" cy="-4" rx="5.5" ry="1.8" />
                      <ellipse cx="0" cy="0" rx="5.5" ry="1.8" strokeOpacity="0.65" />
                      <path d="M-5.5,-4 L-5.5,4" />
                      <path d="M5.5,-4 L5.5,4" />
                      <path d="M-5.5,4 A 5.5 1.8 0 0 0 5.5,4" />
                    </g>
                  )}
                  {s.label === "Google" && (
                    <g strokeWidth="1.2">
                      <path d="M 4.5,-2 A 5 5 0 1 0 5,3 L 0,3" />
                      <line x1="5" y1="3" x2="5" y2="0" />
                    </g>
                  )}
                  {s.label === "Jira" && (
                    <g strokeWidth="1.15">
                      <path d="M-5,-5 L5,-5 L5,5 L-5,5 Z" />
                      <path d="M-2.5,0 L-0.5,2 L2.5,-1.5" strokeWidth="1.4" />
                    </g>
                  )}
                  {s.label === "Terminal" && (
                    <g strokeWidth="1.3">
                      <path d="M-5,-3 L-1,0 L-5,3" />
                      <line x1="1" y1="3" x2="5" y2="3" />
                    </g>
                  )}
                  {s.label === "HTTP" && (
                    <g strokeWidth="1">
                      <circle cx="0" cy="0" r="6" />
                      <line x1="-6" y1="0" x2="6" y2="0" />
                      <path d="M0,-6 Q-3.2,0 0,6" />
                      <path d="M0,-6 Q3.2,0 0,6" />
                    </g>
                  )}
                </g>
              </g>
            )}
          </g>
        );
      })}
      <line x1="30" y1="245" x2="470" y2="245" stroke="#cbd5e1" strokeWidth="1" />
      <text x="52" y="300" fill="#0e7490" fontSize="62" fontWeight="200" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">1</text>
      <text x="108" y="276" fill="#0e7490" fontSize="10" fontWeight="600" letterSpacing="0.16em">EXECUTION CONTRACT</text>
      <text x="108" y="292" fill="#64748b" fontSize="10.5">Hundreds of connectors, unified.</text>
      <text x="108" y="307" fill="#64748b" fontSize="10">{"Add a connector \u2014 every workflow can use it."}</text>
    </DiagramFrame>
  );
}

/* ── Page ── */

export default function Home() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [formStatus, setFormStatus] = useState<DemoStatus>("idle");
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);
  const [formMessage, setFormMessage] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [headerTone, setHeaderTone] = useState<"dark" | "light">("dark");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const featureObserverRef = useRef<IntersectionObserver | null>(null);

  /* Reveal animations are handled globally by <ScrollReveal /> in
     app/layout.tsx — every page on the site inherits the same behavior. */

  /* Navbar scroll shadow + dynamic tone — flip header palette as the section
     under it transitions between cream and dark surfaces. Sections opt in via
     `data-tone="light" | "dark"`. */
  useEffect(() => {
    const HEADER_PROBE_Y = 100; // header height + a small offset
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      const sections = document.querySelectorAll<HTMLElement>("[data-tone]");
      let activeTone: "dark" | "light" = "dark";
      let activeId: string | null = null;
      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= HEADER_PROBE_Y && rect.bottom > HEADER_PROBE_Y) {
          activeTone = (sec.dataset.tone as "dark" | "light") ?? "dark";
          activeId = sec.id || null;
          break;
        }
      }
      setHeaderTone(activeTone);
      setActiveSection(activeId);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
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
    <div className="relative min-h-screen overflow-x-clip bg-[var(--bg-deep)] text-slate-300">
      {/* Hero ambient glow — cyan only, sits behind the dark hero */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[800px] w-[1200px] -translate-x-1/2 rounded-full bg-cyan-500/[0.06] blur-[140px]" />


      {/* ── HEADER — fixed at top. At scroll=0 the brand mark sits naked over
          the hero (no nav, no background); once scrolling starts, the brand
          mark fades out and the full menu (nav + CTA + tinted bg) fades in. */}
      <header className="fixed left-0 right-0 top-0 z-30 px-0 pt-0">
        <nav className={`flex items-center justify-between px-6 py-4.5 backdrop-blur-xl transition-colors duration-300 sm:px-20 lg:px-[112px] ${
          scrolled
            ? headerTone === "dark"
              ? "border-b border-white/10 bg-[#050a14]/50"
              : "border-b border-slate-950/10 bg-[var(--bg-page)]/50"
            : "border-b border-transparent bg-transparent"
        }`}>
          <a href="#top" className="flex items-center gap-3">
            <img src="/logo-mark-256.svg" alt="" aria-hidden="true" className="h-7 w-7" />
            <span className={`text-sm font-medium tracking-tight transition-colors ${headerTone === "dark" ? "text-white" : "text-slate-950"}`}>
              AIOS <span className="font-normal text-slate-500">by cvlSoft</span>
            </span>
          </a>
          <div
            className={`flex items-center gap-8 transition-opacity duration-300 ${
              scrolled ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {[
              ["/#problem", "The Industry Problem"],
              ["/#why-aios", "Why AIOS"],
              ["/#pricing", "Pricing"],
              ["/rollout", "Rollout"],
              ["/case-studies", "Case Studies"],
              ["/platform", "Platform"],
              ["/team", "Team"],
            ].map(([href, label]) => {
              // Active when href points to the in-view section. Hash links
              // (e.g. "/#problem") map to that section's id; non-hash routes
              // (e.g. "/team") match the section sharing that id on the home
              // page, so highlighting tracks the scroll position.
              const targetId = href.includes("#")
                ? href.split("#").pop() ?? null
                : href.replace(/^\//, "");
              const isActive = activeSection === targetId;
              const inactiveColor = headerTone === "dark"
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-950";
              const activeColor = headerTone === "dark" ? "text-cyan-400" : "text-cyan-700";
              return (
                <a
                  key={href}
                  href={href}
                  className={`hidden text-sm transition-colors md:block ${
                    isActive
                      ? `${activeColor} font-medium underline decoration-2 underline-offset-[6px]`
                      : inactiveColor
                  }`}
                >
                  {label}
                </a>
              );
            })}
            <a
              href="#demo"
              onClick={() => handleCtaClick("header")}
              className={`rounded-md px-5 py-2 text-[13px] font-semibold tracking-[0.08em] transition-colors ${
                headerTone === "dark"
                  ? "border border-white/[0.10] bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                  : "border border-cyan-700 bg-cyan-700 text-white hover:bg-cyan-800"
              }`}
            >
              REQUEST DEMO
            </a>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* ── HERO ── */}
        <section data-tone="dark" className="relative flex h-screen min-h-[640px] flex-col overflow-hidden">

          {/* Spiral background */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {/* Subtle glow behind spiral */}
            <div className="absolute right-[5%] top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-cyan-500/[0.06] blur-[120px]" />
            {/* Spiral with left fade */}
            <div
              className="hero-spiral-frame absolute right-0 top-1/2 h-[153.3%] w-[93.7%]"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, black 35%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 35%)",
              }}
            >
              <HeroSpiral />
            </div>
          </div>

          {/* Content — vertically centered, takes the available space above
              the BUILT ON row. Each block animates in with `hero-fade-up` and
              its own animation-delay, producing a staggered cascade. */}
          <div className="relative z-10 flex w-full flex-1 items-center px-6 sm:px-10 lg:px-[120px]">
            <div className="max-w-4xl">
              <h1 className="hero-fade-up text-[clamp(2.8rem,6vw,5rem)] font-light leading-[1.08] tracking-[-0.03em] text-white">
                Agentic Operations<br />
                Delivering Measurable<br />
                Outcomes in{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent [filter:drop-shadow(0_0_22px_rgba(34,211,238,0.45))]">
                  Weeks.
                </span>
              </h1>

              <p className="hero-fade-up mt-6 max-w-[720px] text-xl font-normal text-slate-400 [animation-delay:280ms]">
                The industry&rsquo;s AI failure rate is 96%.{" "}
                <span className="text-cyan-400">Ours is zero — we get paid when you save.</span>
                {" "}Our forward deployed teams embed with operators across enterprises of every size and turn their processes into autonomous systems.
              </p>

              <div className="hero-fade-up mt-10 flex flex-wrap gap-3 [animation-delay:520ms]">
                <a
                  href="#demo"
                  onClick={() => handleCtaClick("hero_primary")}
                  className="rounded-md bg-cyan-400 px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20"
                >
                  Request Demo
                </a>
                <a
                  href="#why-aios"
                  onClick={() => handleCtaClick("hero_secondary")}
                  className="rounded-md border border-slate-600 px-7 py-3.5 text-sm font-medium text-slate-300 transition hover:border-slate-400 hover:text-white"
                >
                  Why We&rsquo;re Different
                </a>
              </div>
            </div>
          </div>

          {/* ── PARTNERED WITH / BUILT ON ──
              Mobile: a single auto-scrolling marquee (continuous loop) so the
              logos always read inline without forcing the user to scroll.
              Desktop (md+): the original static 4fr/3fr two-group grid with
              vertical column rules. */}
          {(() => {
            const partnered = [
              { name: "OpenAI", file: "openai.svg" },
              { name: "Anthropic", file: "anthropic.svg" },
              { name: "Google", file: "google.svg" },
              { name: "Microsoft", file: "microsoft.svg" },
            ];
            const builtOn = [
              { name: "AWS", file: "amazonwebservices.svg" },
              { name: "MongoDB", file: "mongodb.svg" },
              { name: "Next.js", file: "nextjs.svg" },
            ];
            const marqueeItems = [...partnered, ...builtOn];
            const Logo = ({ b }: { b: { name: string; file: string } }) => (
              <span className="flex shrink-0 items-center gap-2.5">
                <img
                  src={`/partners/${b.file}`}
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 opacity-90 [filter:brightness(0)_invert(1)]"
                />
                <span className="whitespace-nowrap text-[15px] font-medium tracking-tight text-white">
                  {b.name}
                </span>
              </span>
            );
            // Logos cascade left-to-right after the CTAs settle.
            // Desktop logos use a global index across both groups so the
            // cascade doesn't restart at "BUILT ON".
            const LOGO_BASE_DELAY = 720;
            const LOGO_STEP = 80;
            return (
              <>
                {/* Mobile — continuous-loop marquee with per-cell column rules.
                    The whole row fades up as one (the marquee animates its own
                    transform internally, so a per-logo cascade would fight it). */}
                <div
                  className="hero-fade-up relative z-10 overflow-hidden border-t border-white/[0.10] pt-5 pb-6 md:hidden"
                  style={{ animationDelay: `${LOGO_BASE_DELAY}ms` }}
                >
                  <p className="mb-4 text-center font-mono text-[11px] tracking-[0.22em] text-slate-500">
                    PARTNERED WITH · BUILT ON
                  </p>
                  <div className="marquee-track">
                    {/* Set 1 */}
                    <ul className="flex shrink-0 items-center">
                      {marqueeItems.map((b) => (
                        <li key={`a-${b.name}`} className="flex shrink-0 items-center border-l border-white/[0.08] px-7 first:border-l-0">
                          <Logo b={b} />
                        </li>
                      ))}
                    </ul>
                    {/* Set 2 — duplicate for seamless wrap */}
                    <ul className="flex shrink-0 items-center" aria-hidden="true">
                      {marqueeItems.map((b) => (
                        <li key={`b-${b.name}`} className="flex shrink-0 items-center border-l border-white/[0.08] px-7">
                          <Logo b={b} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Desktop — static two-group grid */}
                <div className="relative z-10 hidden border-t border-white/[0.10] md:grid md:grid-cols-[4fr_3fr]">
                  {[
                    { eyebrow: "PARTNERED WITH", items: partnered },
                    { eyebrow: "BUILT ON", items: builtOn },
                  ].map((group, gi) => (
                    <div
                      key={group.eyebrow}
                      className={`px-6 pt-5 pb-9 sm:px-10 lg:pt-6 lg:pb-12 ${
                        gi === 0 ? "lg:pl-[120px]" : "border-l border-white/[0.10] lg:pr-[120px]"
                      }`}
                    >
                      <p
                        className="hero-stagger font-mono text-[11px] tracking-[0.22em] text-slate-500"
                        style={{ animationDelay: `${LOGO_BASE_DELAY - 80}ms` }}
                      >
                        {group.eyebrow}
                      </p>
                      <ul
                        className="mt-3 grid items-center gap-y-3"
                        style={{ gridTemplateColumns: `repeat(${group.items.length}, minmax(0, 1fr))` }}
                      >
                        {group.items.map((b, i) => {
                          const globalIndex = gi === 0 ? i : partnered.length + i;
                          return (
                            <li
                              key={b.name}
                              className={`hero-stagger flex items-center justify-center gap-2.5 px-4 ${
                                i > 0 ? "border-l border-white/[0.08]" : ""
                              }`}
                              style={{ animationDelay: `${LOGO_BASE_DELAY + globalIndex * LOGO_STEP}ms` }}
                            >
                              <Logo b={b} />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </section>

        {/* ── INDUSTRY PROBLEM ── */}
        <section id="problem" data-tone="light" className="relative bg-[var(--bg-page)] py-24 text-[var(--ink-primary)] md:py-32">
          <SectionScrollLine />

          <div className=" px-6 sm:px-10 lg:pl-[205px] lg:pr-[112px]">
            <p className="reveal-up inline-block rounded-full border border-slate-300 bg-white px-4 py-1.5 font-mono text-[13px] tracking-[0.18em] text-slate-600">
              THE INDUSTRY PROBLEM
            </p>

            <h2 className="reveal-up mt-6 text-[clamp(2rem,5vw,3.5rem)] font-light leading-snug text-slate-950 [animation-delay:60ms]">
              <span className="font-mono font-medium">96%</span> of enterprises <span className="text-cyan-700">aren&rsquo;t</span> creating real value from AI.
            </h2>

            <p className="reveal-up mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl [animation-delay:120ms]">
              Everyone&rsquo;s experimenting. Almost no one&rsquo;s shipping. The data is brutal, but tells a consistent story.
            </p>

            {/* Scaling Gap + Total Cost of Ownership — side by side */}
            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {/* Scaling Gap Funnel */}
              <div className="observe-viz reveal-up rounded-lg border border-slate-200 bg-white p-6 md:p-8 [animation-delay:160ms]">
                <p className="font-mono text-[13px] tracking-[0.18em] text-slate-500">
                  THE SCALING GAP
                </p>
                <p className="mt-3 text-base font-medium text-slate-900 md:text-lg">
                  88% of organizations use AI. Only 4% are creating substantial value.
                </p>
                <div className="mt-5 space-y-3">
                  {FUNNEL_STAGES.map((stage, i) => {
                    /* Slate gradient lightest→darkest as the funnel narrows; final stage is cyan-700 to mark "the gap". */
                    const isFinal = i === FUNNEL_STAGES.length - 1;
                    const barColor = isFinal ? "bg-cyan-700" : ["bg-slate-300", "bg-slate-400", "bg-slate-500"][i];
                    const numColor = isFinal ? "text-cyan-700" : "text-slate-900";
                    return (
                      <div key={stage.label}>
                        <div className="mb-1 flex items-baseline gap-2">
                          <span className={`font-mono text-sm font-medium ${numColor}`}>
                            {stage.pct}%
                          </span>
                          <span className="text-[13px] text-slate-500">
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
                <p className="mt-4 text-[13px] text-slate-500">
                  Source: McKinsey State of AI, Nov 2025 &middot; BCG &ldquo;Widening AI Value Gap,&rdquo; Sept 2025
                </p>
              </div>

              {/* Cost Over Time */}
              <div className="observe-viz reveal-up rounded-lg border border-slate-200 bg-white p-6 md:p-8 [animation-delay:220ms]">
                <p className="font-mono text-[13px] tracking-[0.18em] text-slate-500">
                  TOTAL COST OF OWNERSHIP
                </p>
                <p className="mt-3 text-base font-medium text-slate-900">
                  Custom workflows compound cost. Reusable skills flatten it.
                </p>

                <svg
                  viewBox="0 0 300 160"
                  className="mt-5 w-full"
                  role="img"
                  aria-label="Cost comparison: custom workflows and RPA rise over 5 years while AIOS stays flat"
                >
                  {[35, 70, 105].map((y) => (
                    <line key={y} x1="10" y1={y} x2="290" y2={y} stroke="#e2e8f0" strokeWidth="0.5" />
                  ))}

                  {/* Filled areas under each line — slate for legacy approaches, cyan for AIOS */}
                  <path className="chart-area" d="M10,115 C50,108 90,95 130,78 S210,35 250,20 L290,8 L290,140 L10,140 Z" fill="#0f172a" fillOpacity="0.04" />
                  <path className="chart-area" d="M10,110 C80,114 155,120 220,122 S280,124 290,125 L290,140 L10,140 Z" fill="#0e7490" fillOpacity="0.06" style={{ transitionDelay: "1.4s" }} />

                  {/* Lines: legacy approaches in slate tones, AIOS in brand cyan */}
                  <path className="chart-line" d="M10,115 C50,108 90,95 130,78 S210,35 250,20 L290,8" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" style={{ transitionDelay: "0.6s" }} />
                  <polyline className="chart-line" points="10,108 80,100 150,72 220,68 290,42" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transitionDelay: "0.9s" }} />
                  <path className="chart-line" d="M10,110 C80,114 155,120 220,122 S280,124 290,125" fill="none" stroke="#0e7490" strokeWidth="3" strokeLinecap="round" style={{ transitionDelay: "1.2s" }} />

                  {["Yr 1", "Yr 2", "Yr 3", "Yr 4", "Yr 5"].map((yr, i) => (
                    <text key={yr} x={10 + i * 70} y={155} style={{ fontSize: "13px", fill: "#64748b", fontFamily: "var(--font-code), monospace" }}>
                      {yr}
                    </text>
                  ))}
                  <text x="4" y="18" style={{ fontSize: "13px", fill: "#64748b", fontFamily: "var(--font-code), monospace" }}>
                    Cost &uarr;
                  </text>
                </svg>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-5 rounded bg-slate-900" />
                    <span className="text-[13px] text-slate-500">Custom workflows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-5 rounded bg-slate-500" />
                    <span className="text-[13px] text-slate-500">RPA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-5 rounded bg-cyan-700" />
                    <span className="text-[13px] font-medium text-cyan-700">AIOS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kill Shot Stat */}
            <div className="reveal-up mt-5 rounded-lg border border-slate-200 bg-white p-6 md:p-8 [animation-delay:220ms]">
              <p className="text-center text-3xl font-light text-slate-950 md:text-4xl">
                <span className="font-mono font-medium">40%+</span> of agentic AI projects will be canceled by 2027.
              </p>
              <p className="mt-3 text-center text-[13px] text-slate-500">
                Due to escalating costs, unclear business value, or inadequate risk controls. &mdash; Gartner, June 2025
              </p>
            </div>

            {/* AIOS: The Antithesis — hidden for now, may bring back later */}
            <div className="reveal-up mt-5 hidden rounded-lg border border-cyan-500/15 bg-cyan-500/[0.04] p-6 md:p-8 [animation-delay:400ms]">
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
                    <p className="mt-0.5 text-[13px] leading-relaxed text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Automation Spectrum Infographic — hidden for now, may bring back later */}
              <div className="mt-10 hidden border-t border-white/[0.08] pt-10">
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
                  <text x="600" y="456" textAnchor="middle" fill="#94a3b8" fontSize="14">belong here*</text>
                  <line x1="530" y1="462" x2="670" y2="462" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.4" />

                  {/* Bottom tag */}
                  <text x="600" y="486" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="500" letterSpacing="0.08em">WHERE COMPLIANCE MEETS INTELLIGENCE</text>
                  <text x="600" y="502" textAnchor="middle" fill="#475569" fontSize="9">*Based on internal analysis of enterprise deployment patterns.</text>


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
        <section id="why-aios" data-tone="light" className="relative bg-[var(--bg-page)] py-24 text-[var(--ink-primary)] md:py-32">
          <SectionScrollLine />

          <div className=" px-6 sm:px-10 lg:pl-[205px] lg:pr-[112px]">
            <p className="reveal-up inline-block rounded-full border border-slate-300 bg-white px-4 py-1.5 font-mono text-[13px] tracking-[0.18em] text-slate-600">
              WHY AIOS
            </p>
            <h2 className="reveal-up mt-5 text-[clamp(2rem,5vw,3.5rem)] font-light tracking-[-0.03em] text-slate-950 [animation-delay:60ms]">
              Why we&rsquo;re different.
            </h2>
            <p className="reveal-up mt-5 mb-12 md:mb-16 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl [animation-delay:120ms]">
              The industry builds an agent for every task.{" "}
              <span className="font-medium text-cyan-700">AIOS builds cognition</span>
              {" "}— adaptive intelligence that reasons about any workflow,
              selects any tool, and scales without maintenance debt. &nbsp;
              <span className="font-medium text-cyan-700">Stop building brittle AI agents. Start building intelligence.</span>
            </p>

            {/* Feature rows — distyl-style compact stack with click-to-expand
                diagrams. Rows render on the same white surface as the diagram
                cards; the `+` indicator sits in its own grid column at the far
                right; expanded diagrams are constrained to max-w-[500px]. */}
            <div className="reveal-up overflow-hidden rounded-lg border border-slate-200 border-t-[3px] border-t-cyan-700 bg-white [animation-delay:160ms]">
              {(() => {
                const illustrations = [
                  <DiagramOneBrain key="d0" />,
                  <DiagramInterview key="d1" />,
                  <DiagramSelfEvolving key="d2" />,
                  <DiagramSecurity key="d3" />,
                  <DiagramConnectors key="d4" />,
                ];
                return DIFFERENTIATORS.map((item, i) => {
                  const isExpanded = expandedFeature === i;
                  return (
                    <div
                      key={item.title}
                      className={i > 0 ? "border-t border-slate-200" : ""}
                    >
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        onClick={() => setExpandedFeature(isExpanded ? null : i)}
                        className="grid w-full cursor-pointer items-start gap-8 px-6 py-7 text-left transition-colors hover:bg-slate-50 lg:grid-cols-[5fr_7fr_auto] lg:items-center lg:gap-14 lg:px-10 lg:py-10"
                      >
                        <h3 className="text-2xl font-light tracking-[-0.02em] text-slate-950 md:text-[34px] md:leading-[1.1]">
                          {item.title}
                        </h3>
                        <p className="max-w-xl text-[15px] leading-relaxed text-slate-600 md:text-base">
                          {item.description}
                        </p>
                        <span
                          aria-hidden="true"
                          className={`shrink-0 justify-self-end font-mono text-2xl leading-none text-cyan-700 transition-transform duration-300 ${
                            isExpanded ? "rotate-45" : ""
                          }`}
                        >
                          +
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="feature-fade-enter px-6 pt-2.5 pb-8 lg:px-10 lg:pb-12">
                          <div className="mx-auto w-4/5 overflow-hidden rounded-[20px] border border-slate-200 bg-white">
                            <div className="flex aspect-[16/10] items-center justify-center p-6 md:p-10">
                              {illustrations[i]}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}

              {/* Closing summary row — non-clickable, no +/expand affordance.
                  Locks the section's pitch with the headline outcome. */}
              <div className="border-t border-slate-200">
                <div className="grid w-full items-start gap-8 px-6 py-7 lg:grid-cols-[5fr_7fr_auto] lg:items-center lg:gap-14 lg:px-10 lg:py-10">
                  <h3 className="text-2xl font-light tracking-[-0.02em] text-slate-950 md:text-[34px] md:leading-[1.1]">
                    Time to Earnings
                  </h3>
                  <p className="max-w-xl text-[15px] leading-relaxed text-slate-600 md:text-base">
                    We generate measurable earnings impact in weeks, not years — with our pricing tied to a <span className="text-cyan-700">100% production success bar.</span>
                  </p>
                  <span aria-hidden="true" className="hidden lg:block lg:w-[1ch]" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Section divider ── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

        {/* ── PRICING — single outcome-based callout, no calculator, no tier table ── */}
        <section id="pricing" data-tone="light" className="relative bg-[var(--bg-page)] py-24 text-[var(--ink-primary)] md:py-32">
          <SectionScrollLine />

          <div className="px-6 sm:px-10 lg:pl-[205px] lg:pr-[112px]">
            <p className="reveal-up inline-block rounded-full border border-slate-300 bg-white px-4 py-1.5 font-mono text-[13px] tracking-[0.18em] text-slate-600">
              PRICING
            </p>
            <h2 className="reveal-up mt-6 text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.1] tracking-[-0.03em] text-slate-950 [animation-delay:60ms]">
              We make money when <span className="text-cyan-700">you make money.</span>
            </h2>
            <p className="reveal-up mt-6 max-w-3xl text-lg leading-relaxed text-slate-700 md:text-xl [animation-delay:120ms]">
              You pay for successful outcomes. Failed tasks are free. Always. No per-seat licenses. No per-connector fees. Just the floor cost of running your tenant.
            </p>

            <div className="reveal-up mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 [animation-delay:180ms]">
              {[
                {
                  title: "Floor Cost Only",
                  body: "Your platform fee covers the bare cost of running your tenant. Infrastructure, connectors, tokens, security, unlimited users. No margin added.",
                },
                {
                  title: "Per-Task Outcomes",
                  body: "Each workflow has a per-task price anchored to 20-40% of what you'd pay a human. You save 60-80% on every successful task. Token costs baked in.",
                },
                {
                  title: "Failed = Free",
                  body: "If a task fails, escalates, or gets killed, you pay nothing. AIOS only earns when it delivers. Our incentives are your incentives.",
                },
                {
                  title: "Defined in writing",
                  body: "Success criteria locked per workflow before go-live. Quarterly not-to-exceed cap. Dispute window with full trace evidence. Annual true-up.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-md border border-slate-300 bg-white p-6"
                >
                  <h3 className="text-base font-semibold text-cyan-700">{card.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-700">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section divider ── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

        {/* ── DEMO CTA ── */}
        <section id="demo" data-tone="dark" className="relative bg-[#0a0f1a] py-24 md:py-32">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#050a14] to-transparent" />
          <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="relative overflow-hidden rounded-lg border border-white/[0.06] bg-[#0d1322] p-10 md:p-16">
            {/* Decorative orbs */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[60px]" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-cyan-500/10 blur-[60px]" />

            <h2 className="reveal-up relative text-center text-[clamp(2rem,5vw,3.5rem)] font-light tracking-[-0.03em] text-white">
              Not hype. <span className="text-cyan-400">Real enterprise agentic AI.</span>
            </h2>
            <p className="reveal-up relative mt-4 text-center text-2xl leading-relaxed text-slate-300 md:text-4xl [animation-delay:120ms]">
              See it now.
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
                  {formStatus === "loading" ? "Submitting..." : "Start the conversation"}
                </button>
                <a
                  href="#why-aios"
                  className="rounded-md border border-slate-600 px-6 py-3.5 text-sm font-medium text-slate-300 transition hover:border-slate-400 hover:text-white"
                >
                  Learn More
                </a>
              </div>
              {formMessage ? (
                <p className={`text-center text-sm ${formStatus === "error" ? "text-slate-300" : "text-cyan-400"}`}>
                  {formMessage}
                </p>
              ) : null}
            </form>
          </div>
          </div>
        </section>
      </main>

    </div>
  );
}
