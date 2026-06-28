"use client";

import { useState } from "react";
import { CircleCheck, CircleHelp, CircleX, Loader2 } from "lucide-react";

type Result = { covered: boolean; explanation: string; coverage: { label: string } | null } | null;

export function CoverageCheck({ policyNumber }: { policyNumber: string }) {
  const [scenario, setScenario] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result>(null);

  async function check() {
    if (!scenario.trim()) return;
    setBusy(true);
    setResult(null);
    const res = await fetch("/api/coverage/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ policyId: policyNumber, scenario }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    setResult(res.ok ? data : { covered: false, explanation: data.error ?? "Error", coverage: null });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="label text-muted">Is it covered?</p>
      <p className="mt-1 text-sm text-muted">Describe what happened and we&apos;ll check your coverage.</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="e.g. A rock cracked my windshield"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <button onClick={check} disabled={busy || !scenario.trim()} className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Check
        </button>
      </div>
      {result && (
        <div className={`mt-4 flex items-start gap-3 rounded-lg p-3 text-sm ${result.covered ? "bg-ok/10" : result.coverage === null ? "bg-border/60" : "bg-warn/10"}`}>
          {result.covered ? <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-ok" /> : result.coverage === null ? <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-muted" /> : <CircleX className="mt-0.5 h-5 w-5 shrink-0 text-warn" />}
          <span>{result.explanation}</span>
        </div>
      )}
    </div>
  );
}
