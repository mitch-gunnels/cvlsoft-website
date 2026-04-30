"use client";

import { useMemo, useState } from "react";

const TIER_RATE = { simple: 0.5, complex: 6, strategic: 45 } as const;
const HUMAN_PER_TASK = { simple: 2, complex: 24, strategic: 180 } as const;

function formatUSD(n: number) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  minLabel,
  maxLabel,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  minLabel: string;
  maxLabel: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const fillStyle = {
    background: `linear-gradient(to right, #0891b2 0%, #22d3ee ${pct}%, rgba(255,255,255,0.06) ${pct}%, rgba(255,255,255,0.06) 100%)`,
  };
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">
          {label}
        </label>
        <span className="font-mono text-[15px] font-medium text-white tabular-nums">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        className="ui-slider mt-3 h-1.5 w-full appearance-none rounded-full"
        style={fillStyle}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-slate-500">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

function OutputRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "rose" | "white";
}) {
  const valueColor = tone === "rose" ? "text-rose-400" : "text-white";
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
        {label}
      </div>
      <div
        className={`mt-1 font-mono text-[22px] font-medium tabular-nums ${valueColor}`}
      >
        {value}
      </div>
    </div>
  );
}

export default function PricingCalculator() {
  const [volume, setVolume] = useState(14_000);
  const [complexPct, setComplexPct] = useState(30);
  const [strategicPct, setStrategicPct] = useState(10);

  const setComplex = (v: number) => {
    const maxComplex = 90 - strategicPct;
    setComplexPct(Math.min(v, maxComplex));
  };
  const setStrategic = (v: number) => {
    const maxStrategic = 90 - complexPct;
    setStrategicPct(Math.min(v, maxStrategic));
  };

  const result = useMemo(() => {
    const simplePct = 100 - complexPct - strategicPct;
    const split = {
      simple: (volume * simplePct) / 100,
      complex: (volume * complexPct) / 100,
      strategic: (volume * strategicPct) / 100,
    };
    const aios =
      12 *
      (split.simple * TIER_RATE.simple +
        split.complex * TIER_RATE.complex +
        split.strategic * TIER_RATE.strategic);
    const human =
      12 *
      (split.simple * HUMAN_PER_TASK.simple +
        split.complex * HUMAN_PER_TASK.complex +
        split.strategic * HUMAN_PER_TASK.strategic);
    const savings = human - aios;
    const savingsPct = human > 0 ? Math.round((savings / human) * 100) : 0;
    return { simplePct, aios, human, savings, savingsPct };
  }, [volume, complexPct, strategicPct]);

  return (
    <div className="reveal-up mt-12 rounded-xl border border-white/[0.06] bg-white/[0.015] p-6 md:p-10 [animation-delay:60ms]">
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-400">
            Your numbers
          </p>
          <div className="mt-6 space-y-8">
            <Slider
              label="Monthly task volume"
              value={volume}
              min={1000}
              max={100000}
              step={500}
              displayValue={volume.toLocaleString("en-US")}
              minLabel="1,000"
              maxLabel="100,000"
              onChange={setVolume}
            />
            <Slider
              label="Complex tier"
              value={complexPct}
              min={0}
              max={60}
              step={5}
              displayValue={`${complexPct}%`}
              minLabel="0%"
              maxLabel="60%"
              onChange={setComplex}
            />
            <Slider
              label="Strategic tier"
              value={strategicPct}
              min={0}
              max={30}
              step={5}
              displayValue={`${strategicPct}%`}
              minLabel="0%"
              maxLabel="30%"
              onChange={setStrategic}
            />
          </div>
          <div className="mt-8 border-t border-white/[0.06] pt-4 font-mono text-[11px] text-slate-400">
            Simple tier (remainder):{" "}
            <span className="tabular-nums text-white">{result.simplePct}%</span>
          </div>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-400">
            What it costs you
          </p>
          <div className="mt-6 space-y-5">
            <OutputRow
              label="Human-equivalent (annual)"
              value={formatUSD(result.human)}
              tone="rose"
            />
            <OutputRow
              label="AIOS (annual)"
              value={formatUSD(result.aios)}
              tone="white"
            />
          </div>
          <div className="mt-6 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.04] p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-400">
              You keep
            </div>
            <div className="mt-2 font-mono text-[28px] font-medium tabular-nums text-emerald-400">
              {formatUSD(result.savings)}
            </div>
            <div className="mt-1 font-mono text-[11px] tabular-nums text-slate-400">
              {result.savingsPct}% annualized · based on your mix
            </div>
          </div>
          <p className="mt-6 font-mono text-[10px] leading-relaxed text-slate-500">
            Estimate only. Per-task rates are illustrative — final pricing is set
            during onboarding.
          </p>
        </div>
      </div>
    </div>
  );
}
