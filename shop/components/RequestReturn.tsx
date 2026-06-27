"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function RequestReturn({ orderNumber }: { orderNumber: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/returns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: orderNumber, reason: "Requested from order page" }),
    });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) {
      setMsg(`Return ${body.return.rmaNumber} opened.`);
      router.refresh();
    } else {
      setMsg(body.error ?? "Could not open a return");
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={submit}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm hover:border-foreground/40 disabled:opacity-50"
      >
        {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Request a return
      </button>
      {msg && <p className="text-sm text-muted">{msg}</p>}
    </div>
  );
}
