"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function NewTicket() {
  const router = useRouter();
  const [category, setCategory] = useState("account");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    if (!subject.trim()) return;
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, subject, body }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) {
      setMsg(`Opened ${data.ticket.ticketNumber}.`);
      setSubject("");
      setBody("");
      router.refresh();
    } else {
      setMsg(data.error ?? "Could not open ticket.");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="label text-muted">Open a ticket</p>
      <div className="mt-3 space-y-2">
        <div className="flex gap-2">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            <option value="account">Account</option>
            <option value="billing">Billing</option>
            <option value="network">Network</option>
            <option value="device">Device</option>
          </select>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        </div>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Describe the issue (optional)" rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <button onClick={submit} disabled={busy || !subject.trim()} className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Submit
        </button>
        {msg && <p className="text-sm text-foreground">{msg}</p>}
      </div>
    </div>
  );
}
