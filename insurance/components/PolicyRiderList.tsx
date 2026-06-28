"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";
import { ShopIcon } from "@/components/ShopIcon";

export type PolicyRiderItem = { slug: string; name: string; price: string; icon: string };

/** Riders on a single policy, with inline remove. */
export function PolicyRiderList({ policyId, items }: { policyId: string; items: PolicyRiderItem[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function remove(slug: string) {
    setBusy(slug);
    const res = await fetch(`/api/policies/${policyId}/riders/${slug}`, { method: "DELETE" });
    setBusy(null);
    if (res.ok) router.refresh();
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="label text-muted">Riders & add-ons</p>
        <Link href="/riders" className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
          <Plus className="h-3.5 w-3.5" /> Add
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No riders on this policy yet.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((r) => (
            <li key={r.slug} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2.5 text-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <ShopIcon name={r.icon} className="h-4 w-4" />
                </span>
                {r.name}
                <span className="text-muted">{r.price}/mo</span>
              </span>
              <button
                onClick={() => remove(r.slug)}
                disabled={busy === r.slug}
                aria-label={`Remove ${r.name}`}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-bad/10 hover:text-bad disabled:opacity-50"
              >
                {busy === r.slug ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
