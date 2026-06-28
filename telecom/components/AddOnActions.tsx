"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Loader2, Plus } from "lucide-react";

export type AddOnLine = { id: string; label: string; has: boolean };

/** Per-add-on control to add/remove it across the customer's lines. */
export function AddOnActions({
  addOnSlug,
  signedIn,
  lines,
}: {
  addOnSlug: string;
  signedIn: boolean;
  lines: AddOnLine[];
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

  const onCount = lines.filter((l) => l.has).length;

  async function toggle(line: AddOnLine) {
    setBusy(line.id);
    const res = line.has
      ? await fetch(`/api/lines/${line.id}/addons/${addOnSlug}`, { method: "DELETE" })
      : await fetch(`/api/lines/${line.id}/addons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ addOnId: addOnSlug }),
        });
    setBusy(null);
    if (res.ok) router.refresh();
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        {onCount > 0 ? `On ${onCount} line${onCount > 1 ? "s" : ""}` : "Add to a line"}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul className="mt-3 space-y-1.5">
          {lines.length === 0 && <li className="text-xs text-muted">No lines on this account.</li>}
          {lines.map((l) => (
            <li key={l.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
              <span className="text-sm">{l.label}</span>
              <button
                onClick={() => toggle(l)}
                disabled={busy === l.id}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${
                  l.has ? "bg-ok/10 text-ok hover:bg-bad/10 hover:text-bad" : "bg-accent text-accent-foreground hover:opacity-90"
                }`}
              >
                {busy === l.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : l.has ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                {l.has ? "Added" : "Add"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
