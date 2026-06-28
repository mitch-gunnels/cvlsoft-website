"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Opt = { value: string; label: string };
const TYPES = ["collision", "theft", "glass", "water", "fire", "liability", "weather", "other"];

export function FileClaim({ policies }: { policies: Opt[] }) {
  const router = useRouter();
  const [policyId, setPolicyId] = useState(policies[0]?.value ?? "");
  const [type, setType] = useState("collision");
  const [dateOfLoss, setDateOfLoss] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    if (!policyId || !dateOfLoss || !description.trim()) {
      setMsg("Pick a policy, date, and description.");
      return;
    }
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/claims", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ policyId, type, dateOfLoss, description }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) {
      setMsg(`✓ ${data.claim.claimNumber} filed. ${data.message}`);
      setDescription("");
      router.refresh();
    } else {
      setMsg(data.error ?? "Could not file the claim.");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="label text-muted">File a claim</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <select value={policyId} onChange={(e) => setPolicyId(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
          {policies.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm capitalize">
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-muted">
          Date of loss
          <input type="date" value={dateOfLoss} onChange={(e) => setDateOfLoss(e.target.value)} className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        </label>
      </div>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What happened?" rows={3} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
      <button onClick={submit} disabled={busy} className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Submit claim
      </button>
      {msg && <p className="mt-3 text-sm text-foreground">{msg}</p>}
    </div>
  );
}
