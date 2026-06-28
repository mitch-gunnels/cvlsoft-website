"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { formatPrice } from "@/lib/config";

export type PickerTier = {
  key: string;
  name: string;
  priceCents: number;
  limit: string;
  blurb: string;
  coverages: string[];
};

export function TierPicker({ tiers, quoteType }: { tiers: PickerTier[]; quoteType: string | null }) {
  const defaultIdx = Math.max(0, tiers.findIndex((t) => t.key === "standard"));
  const [idx, setIdx] = useState(defaultIdx === -1 ? 0 : defaultIdx);
  const tier = tiers[idx] ?? tiers[0];

  return (
    <div>
      {/* Tier selector */}
      <p className="label text-muted">Coverage level</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {tiers.map((t, i) => {
          const active = i === idx;
          return (
            <button
              key={t.key}
              onClick={() => setIdx(i)}
              aria-pressed={active}
              className={`rounded-xl border px-3 py-2.5 text-left transition ${
                active ? "border-accent bg-accent/5 ring-1 ring-accent/30" : "border-border hover:border-accent/40"
              }`}
            >
              <span className="block text-sm font-medium">{t.name}</span>
              <span className="block text-xs text-muted">{formatPrice(t.priceCents)}/mo</span>
            </button>
          );
        })}
      </div>

      {/* Selected tier */}
      <div className="mt-5 rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-3xl font-semibold">{formatPrice(tier.priceCents)}<span className="text-base font-normal text-muted">/mo</span></p>
          <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">{tier.limit}</span>
        </div>
        <p className="mt-2 text-sm text-muted">{tier.blurb}</p>
        <ul className="mt-4 space-y-2 text-sm">
          {tier.coverages.map((c) => (
            <li key={c} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-ok" /> {c}</li>
          ))}
        </ul>
        {quoteType && (
          <Link
            href={`/quote?type=${quoteType}&level=${tier.key}`}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            Get this quote <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
