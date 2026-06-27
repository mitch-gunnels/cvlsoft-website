"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type LineOpt = { id: string; label: string; eligible: boolean; current: string | null };

export function OrderPhone({
  deviceSlug,
  signedIn,
  lines,
}: {
  deviceSlug: string;
  signedIn: boolean;
  lines: LineOpt[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  if (!signedIn) {
    return (
      <Link href="/account" className="inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90">
        Sign in to order
      </Link>
    );
  }

  async function order(lineId: string) {
    setBusy(lineId);
    setMsg(null);
    const res = await fetch(`/api/lines/${lineId}/device`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId: deviceSlug }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (res.ok) {
      setMsg(data.message ?? "Ordered.");
      router.refresh();
    } else {
      setMsg(data.error ?? "Could not order.");
    }
  }

  return (
    <div>
      <p className="label text-muted">Add to a line</p>
      <ul className="mt-3 space-y-2">
        {lines.map((l) => (
          <li key={l.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
            <div>
              <p className="text-sm font-medium">{l.label}</p>
              <p className="text-xs text-muted">{l.current ? `Currently: ${l.current}` : "No device"}</p>
            </div>
            <button
              onClick={() => order(l.id)}
              disabled={!l.eligible || busy === l.id}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40"
              title={l.eligible ? "" : "Not upgrade-eligible yet"}
            >
              {busy === l.id && <Loader2 className="h-4 w-4 animate-spin" />}
              {l.eligible ? "Add to line" : "Not eligible"}
            </button>
          </li>
        ))}
      </ul>
      {msg && <p className="mt-3 text-sm text-foreground">{msg}</p>}
    </div>
  );
}
