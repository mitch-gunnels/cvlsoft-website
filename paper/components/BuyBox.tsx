"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

export function BuyBox({
  productId,
  sizes,
  sizeStock,
}: {
  productId: string;
  sizes: string[];
  sizeStock: Record<string, number>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const anyInStock = sizes.some((s) => (sizeStock[s] ?? 0) > 0);

  async function add() {
    if (!selected) {
      setError("Select a size first");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, size: selected, quantity: 1 }),
      });
      if (res.status === 401) {
        router.push("/account");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not add to cart");
      }
      setDone(true);
      startTransition(() => router.refresh());
      setTimeout(() => setDone(false), 1800);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="tracking-label text-xs text-muted">Select size</span>
          {selected && <span className="text-sm">{selected}</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const oos = (sizeStock[s] ?? 0) <= 0;
            const active = selected === s;
            return (
              <button
                key={s}
                disabled={oos}
                onClick={() => {
                  setSelected(s);
                  setError(null);
                }}
                className={`h-11 min-w-[68px] rounded-lg border px-3 text-sm transition-colors ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : oos
                      ? "cursor-not-allowed border-border text-muted/40 line-through"
                      : "border-border hover:border-foreground/50"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={add}
        disabled={!anyInStock || busy || pending}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-8 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : done ? (
          <>
            <Check className="h-4 w-4" /> Added to cart
          </>
        ) : !anyInStock ? (
          "Sold out"
        ) : (
          "Add to cart"
        )}
      </button>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
