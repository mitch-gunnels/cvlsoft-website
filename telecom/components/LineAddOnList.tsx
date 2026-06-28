"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";
import { AddOnIcon } from "@/components/AddOnIcon";

export type LineAddOnItem = { slug: string; name: string; price: string; icon: string };

/** Add-ons on a single line, with inline remove. */
export function LineAddOnList({ lineId, items }: { lineId: string; items: LineAddOnItem[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function remove(slug: string) {
    setBusy(slug);
    const res = await fetch(`/api/lines/${lineId}/addons/${slug}`, { method: "DELETE" });
    setBusy(null);
    if (res.ok) router.refresh();
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="label text-muted">Add-ons</p>
        <Link href="/add-ons" className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
          <Plus className="h-3.5 w-3.5" /> Add
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No add-ons on this line yet.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((a) => (
            <li key={a.slug} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2.5 text-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <AddOnIcon name={a.icon} className="h-4 w-4" />
                </span>
                {a.name}
                <span className="text-muted">{a.price}/mo</span>
              </span>
              <button
                onClick={() => remove(a.slug)}
                disabled={busy === a.slug}
                aria-label={`Remove ${a.name}`}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-bad/10 hover:text-bad disabled:opacity-50"
              >
                {busy === a.slug ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
