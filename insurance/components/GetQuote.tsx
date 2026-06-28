"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

type Quote = { quoteNumber: string; monthly: string; coverageSummary: string[]; type: string } | null;

const TYPES = ["auto", "home", "renters", "life", "pet", "umbrella"];
const LABEL: Record<string, string> = { auto: "Auto", home: "Home", renters: "Renters", life: "Life", pet: "Pet", umbrella: "Umbrella" };

export function GetQuote({ initialType = "auto", initialLevel = "standard" }: { initialType?: string; initialLevel?: string }) {
  const [type, setType] = useState(TYPES.includes(initialType) ? initialType : "auto");
  const [level, setLevel] = useState(["basic", "standard", "premium"].includes(initialLevel) ? initialLevel : "standard");
  const [busy, setBusy] = useState(false);
  const [quote, setQuote] = useState<Quote>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    setQuote(null);
    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, coverageLevel: level }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) setQuote(data.quote);
    else setError(data.error ?? "Could not generate a quote");
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="label text-muted">What to insure</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button key={t} onClick={() => setType(t)} className={`rounded-full px-4 py-2 text-sm ${type === t ? "bg-accent text-accent-foreground" : "border border-border"}`}>{LABEL[t]}</button>
          ))}
        </div>
        <p className="label mt-5 text-muted">Coverage level</p>
        <div className="mt-3 flex gap-2">
          {["basic", "standard", "premium"].map((l) => (
            <button key={l} onClick={() => setLevel(l)} className={`rounded-full px-4 py-2 text-sm capitalize ${level === l ? "bg-accent text-accent-foreground" : "border border-border"}`}>{l}</button>
          ))}
        </div>
        <button onClick={run} disabled={busy} className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Get quote
        </button>
        {error && <p className="mt-3 text-sm text-bad">{error}</p>}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        {quote ? (
          <>
            <p className="label text-muted">Your estimate · {quote.quoteNumber}</p>
            <p className="mt-1 text-4xl font-semibold">{quote.monthly}</p>
            <p className="text-sm text-muted capitalize">{quote.type} · {level}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {quote.coverageSummary.map((cv) => (
                <li key={cv} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-ok" /> {cv}</li>
              ))}
            </ul>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted">
            Choose options and get an instant estimate.
          </div>
        )}
      </div>
    </div>
  );
}
