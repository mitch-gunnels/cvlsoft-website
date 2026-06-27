"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";

type Result = { status: string; city?: string; state?: string; note?: string; zip: string } | null;

const STYLE: Record<string, string> = {
  operational: "bg-ok/10 text-ok",
  degraded: "bg-warn/10 text-warn",
  outage: "bg-bad/10 text-bad",
  unknown: "bg-border text-muted",
};

export function NetworkCheck({ defaultZip }: { defaultZip: string }) {
  const [zip, setZip] = useState(defaultZip);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result>(null);

  async function check() {
    setBusy(true);
    const res = await fetch(`/api/network?zip=${encodeURIComponent(zip)}`);
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    setResult(data.area ?? { status: data.status ?? "unknown", zip });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="label text-muted">Check network status</p>
      <div className="mt-3 flex gap-2">
        <input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="ZIP code" className="w-32 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <button onClick={check} disabled={busy || !zip} className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Check
        </button>
      </div>
      {result && (
        <div className="mt-4 flex items-start gap-3">
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STYLE[result.status] ?? STYLE.unknown}`}>{result.status}</span>
          <p className="text-sm text-muted">
            {result.city ? `${result.city}, ${result.state} (${result.zip}). ` : `ZIP ${result.zip}. `}
            {result.note || (result.status === "operational" ? "All systems normal." : "")}
          </p>
        </div>
      )}
    </div>
  );
}
