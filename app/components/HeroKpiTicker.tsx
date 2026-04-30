"use client";

import { useEffect, useState } from "react";

type Values = {
  tasks: number;
  saved: number;
  compliant: number;
  approvals: number;
};

const SEED: Values = {
  tasks: 14_286_019,
  saved: 2_134_500,
  compliant: 99.94,
  approvals: 2_014,
};

function formatTasks(n: number) {
  return n.toLocaleString("en-US");
}

function formatSaved(n: number) {
  return `$${(n / 1_000_000).toFixed(2)}M`;
}

function formatCompliance(n: number) {
  return `${n.toFixed(2)}%`;
}

function formatApprovals(n: number) {
  return n.toLocaleString("en-US");
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Chip({
  value,
  label,
  showDivider,
}: {
  value: string;
  label: string;
  showDivider?: boolean;
}) {
  return (
    <div
      className={`flex shrink-0 items-baseline ${
        showDivider ? "border-l border-white/[0.06] pl-6" : ""
      }`}
    >
      <span className="font-mono text-[13px] font-medium text-white tabular-nums">
        {value}
      </span>
      <span className="ml-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-slate-400">
        {label}
      </span>
    </div>
  );
}

export default function HeroKpiTicker({
  heroTypingDone,
}: {
  heroTypingDone: boolean;
}) {
  const [values, setValues] = useState<Values>(SEED);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const tasksId = window.setInterval(() => {
      setValues((v) => ({ ...v, tasks: v.tasks + randInt(1, 6) }));
    }, 2000);

    const savedId = window.setInterval(() => {
      setValues((v) => ({ ...v, saved: v.saved + randInt(50, 400) }));
    }, 3500);

    const compliantId = window.setInterval(() => {
      setValues((v) => {
        const delta = (Math.random() - 0.5) * 0.03;
        const next = Math.min(99.98, Math.max(99.91, v.compliant + delta));
        return { ...v, compliant: next };
      });
    }, 4500);

    const approvalsId = window.setInterval(() => {
      setValues((v) => ({ ...v, approvals: v.approvals + randInt(1, 2) }));
    }, 4000);

    return () => {
      window.clearInterval(tasksId);
      window.clearInterval(savedId);
      window.clearInterval(compliantId);
      window.clearInterval(approvalsId);
    };
  }, []);

  const items = [
    { key: "tasks", value: formatTasks(values.tasks), label: "tasks executed" },
    { key: "saved", value: formatSaved(values.saved), label: "saved this week" },
    {
      key: "compliant",
      value: formatCompliance(values.compliant),
      label: "policy-compliant",
    },
    {
      key: "approvals",
      value: formatApprovals(values.approvals),
      label: "approvals logged",
    },
  ];

  return (
    <div
      className={`mt-8 flex items-center gap-6 border-t border-white/[0.05] pt-5 transition-all delay-300 duration-700 ease-out ${
        heroTypingDone ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <span className="flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-400">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] motion-safe:animate-pulse" />
        LIVE
      </span>

      <div className="hidden items-center gap-6 overflow-hidden md:flex">
        {items.map((item, i) => (
          <Chip
            key={item.key}
            value={item.value}
            label={item.label}
            showDivider={i > 0}
          />
        ))}
      </div>

      <div className="flex-1 overflow-hidden md:hidden">
        <div className="ticker-marquee flex w-max gap-6">
          {[...items, ...items].map((item, i) => (
            <Chip key={`${item.key}-${i}`} value={item.value} label={item.label} />
          ))}
        </div>
      </div>
    </div>
  );
}
