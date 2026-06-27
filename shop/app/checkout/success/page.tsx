"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

type Result = {
  paid: boolean;
  order: { orderNumber: string; total: string } | null;
};

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [state, setState] = useState<"loading" | "done" | "error">("loading");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) {
      setState("error");
      return;
    }
    (async () => {
      const res = await fetch("/api/checkout/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) {
        setState("error");
        return;
      }
      setResult(await res.json());
      setState("done");
      router.refresh(); // update header cart count
    })();
  }, [router]);

  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      {state === "loading" && (
        <>
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted" />
          <p className="mt-4 text-muted">Confirming your payment…</p>
        </>
      )}

      {state === "done" && result && (
        <>
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
          <h1 className="mt-5 font-serif text-3xl">
            {result.paid ? "Thank you for your order" : "Order received"}
          </h1>
          {result.order && (
            <p className="mt-3 text-muted">
              {result.order.orderNumber} · {result.order.total}
            </p>
          )}
          <div className="mt-8 flex justify-center gap-3">
            {result.order && (
              <Link
                href={`/orders/${result.order.orderNumber}`}
                className="rounded-full bg-accent px-6 py-3 text-sm text-accent-foreground hover:opacity-90"
              >
                View order
              </Link>
            )}
            <Link
              href="/products"
              className="rounded-full border border-border px-6 py-3 text-sm hover:border-foreground/40"
            >
              Keep shopping
            </Link>
          </div>
        </>
      )}

      {state === "error" && (
        <>
          <h1 className="font-serif text-3xl">Hmm, something’s off</h1>
          <p className="mt-3 text-muted">
            We couldn’t confirm this checkout session.
          </p>
          <Link
            href="/cart"
            className="mt-8 inline-block rounded-full border border-border px-6 py-3 text-sm hover:border-foreground/40"
          >
            Back to cart
          </Link>
        </>
      )}
    </div>
  );
}
