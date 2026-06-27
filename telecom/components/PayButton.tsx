"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

export function PayButton({ invoiceNumber }: { invoiceNumber: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/bills/${invoiceNumber}/pay`, { method: "POST" });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) {
      setDone(true);
      router.refresh();
    } else {
      setError(body.error ?? "Payment failed");
    }
  }

  if (done) return <span className="inline-flex items-center gap-2 text-sm text-ok"><Check className="h-4 w-4" /> Paid</span>;

  return (
    <div className="flex flex-col items-end gap-1">
      <button onClick={pay} disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Pay now
      </button>
      {error && <span className="text-xs text-bad">{error}</span>}
    </div>
  );
}
