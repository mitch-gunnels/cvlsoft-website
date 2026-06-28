"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Loader2, Plus } from "lucide-react";

export type RiderPolicy = { id: string; label: string; has: boolean };

/** Per-rider control to add/remove it across the customer's eligible policies. */
export function RiderActions({
  riderSlug,
  signedIn,
  policies,
}: {
  riderSlug: string;
  signedIn: boolean;
  policies: RiderPolicy[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  if (!signedIn) {
    return (
      <Link href="/account" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
        Sign in to add →
      </Link>
    );
  }

  if (policies.length === 0) {
    return <p className="mt-4 text-xs text-muted">No eligible policies on your account.</p>;
  }

  const onCount = policies.filter((p) => p.has).length;

  async function toggle(p: RiderPolicy) {
    setBusy(p.id);
    const res = p.has
      ? await fetch(`/api/policies/${p.id}/riders/${riderSlug}`, { method: "DELETE" })
      : await fetch(`/api/policies/${p.id}/riders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ riderId: riderSlug }),
        });
    setBusy(null);
    if (res.ok) router.refresh();
  }

  return (
    <div className="mt-4">
      <button onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
        {onCount > 0 ? `On ${onCount} polic${onCount > 1 ? "ies" : "y"}` : "Add to a policy"}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul className="mt-3 space-y-1.5">
          {policies.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
              <span className="text-sm">{p.label}</span>
              <button
                onClick={() => toggle(p)}
                disabled={busy === p.id}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${
                  p.has ? "bg-ok/10 text-ok hover:bg-bad/10 hover:text-bad" : "bg-accent text-accent-foreground hover:opacity-90"
                }`}
              >
                {busy === p.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : p.has ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                {p.has ? "Added" : "Add"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
