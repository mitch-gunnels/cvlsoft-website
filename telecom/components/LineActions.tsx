"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Opt = { slug: string; label: string };

export function LineActions({
  lineId,
  currentPlanSlug,
  plans,
  upgradeEligible,
  devices,
}: {
  lineId: string;
  currentPlanSlug: string;
  plans: Opt[];
  upgradeEligible: boolean;
  devices: Opt[];
}) {
  const router = useRouter();
  const [plan, setPlan] = useState(currentPlanSlug);
  const [device, setDevice] = useState(devices[0]?.slug ?? "");
  const [busy, setBusy] = useState<"plan" | "device" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function post(url: string, body: object, kind: "plan" | "device") {
    setBusy(kind);
    setMsg(null);
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (res.ok) {
      setMsg(data.message ?? "Done.");
      router.refresh();
    } else {
      setMsg(data.error ?? "Something went wrong.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Change plan */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="label text-muted">Change plan</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select value={plan} onChange={(e) => setPlan(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            {plans.map((p) => <option key={p.slug} value={p.slug}>{p.label}</option>)}
          </select>
          <button
            onClick={() => post(`/api/lines/${lineId}/plan`, { planId: plan }, "plan")}
            disabled={busy === "plan" || plan === currentPlanSlug}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40"
          >
            {busy === "plan" && <Loader2 className="h-4 w-4 animate-spin" />} Switch
          </button>
        </div>
      </div>

      {/* Upgrade device */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="label text-muted">Upgrade device</p>
        {upgradeEligible ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <select value={device} onChange={(e) => setDevice(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
              {devices.map((d) => <option key={d.slug} value={d.slug}>{d.label}</option>)}
            </select>
            <button
              onClick={() => post(`/api/lines/${lineId}/device`, { deviceId: device }, "device")}
              disabled={busy === "device"}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40"
            >
              {busy === "device" && <Loader2 className="h-4 w-4 animate-spin" />} Upgrade
            </button>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">This line isn&apos;t upgrade-eligible yet.</p>
        )}
      </div>

      {msg && <p className="text-sm text-foreground">{msg}</p>}
    </div>
  );
}
