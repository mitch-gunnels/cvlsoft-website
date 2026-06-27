"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/config";

type Line = {
  id: string;
  size: string;
  quantity: number;
  product: {
    slug: string;
    name: string;
    brand: string;
    priceCents: number;
    imageUrl: string;
  };
  lineTotalCents: number;
};
type Cart = {
  items: Line[];
  itemCount: number;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
};

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [canceled, setCanceled] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/cart");
    if (res.status === 401) {
      setAuthRequired(true);
      setLoading(false);
      return;
    }
    const body = await res.json();
    setCart(body.cart);
    setLoading(false);
  }, []);

  useEffect(() => {
    setCanceled(new URLSearchParams(window.location.search).get("canceled") === "1");
    load();
  }, [load]);

  async function setQty(id: string, quantity: number) {
    const res = await fetch(`/api/cart/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) {
      setCart((await res.json()).cart);
      router.refresh();
    }
  }

  async function checkout() {
    setCheckingOut(true);
    const res = await fetch("/api/checkout", { method: "POST" });
    const body = await res.json().catch(() => ({}));
    if (res.ok && body.checkoutUrl) {
      window.location.href = body.checkoutUrl;
    } else {
      alert(body.error ?? "Checkout failed");
      setCheckingOut(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center text-muted">
        <Loader2 className="mx-auto h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (authRequired) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-serif text-3xl">Your cart</h1>
        <p className="mt-4 text-muted">Pick a demo shopper to start a cart.</p>
        <Link
          href="/account"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm text-accent-foreground hover:opacity-90"
        >
          Choose shopper
        </Link>
      </div>
    );
  }

  const empty = !cart || cart.items.length === 0;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-serif text-3xl">Your cart</h1>
      {canceled && (
        <p className="mt-4 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted">
          Checkout canceled — your cart is still here.
        </p>
      )}

      {empty ? (
        <div className="mt-10 text-muted">
          Your cart is empty.{" "}
          <Link href="/products" className="text-foreground underline">
            Browse the shop
          </Link>
          .
        </div>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-border">
            {cart!.items.map((l) => (
              <li key={l.id} className="flex gap-4 py-5">
                <Link
                  href={`/products/${l.product.slug}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-surface"
                >
                  <Image
                    src={l.product.imageUrl}
                    alt={l.product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <span className="font-medium">{l.product.name}</span>
                    <span>{formatPrice(l.lineTotalCents)}</span>
                  </div>
                  <span className="text-sm text-muted">
                    US {l.size} · {formatPrice(l.product.priceCents)} each
                  </span>
                  <div className="mt-auto flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-border">
                      <button
                        aria-label="Decrease"
                        onClick={() => setQty(l.id, l.quantity - 1)}
                        className="px-2 py-1.5 text-muted hover:text-foreground"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm">{l.quantity}</span>
                      <button
                        aria-label="Increase"
                        onClick={() => setQty(l.id, l.quantity + 1)}
                        className="px-2 py-1.5 text-muted hover:text-foreground"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => setQty(l.id, 0)}
                      className="flex items-center gap-1 text-sm text-muted hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-border pt-6">
            <dl className="ml-auto max-w-xs space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd>{formatPrice(cart!.subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd>
                  {cart!.shippingCents === 0 ? "Free" : formatPrice(cart!.shippingCents)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-medium">
                <dt>Total</dt>
                <dd>{formatPrice(cart!.totalCents)}</dd>
              </div>
            </dl>
            <button
              onClick={checkout}
              disabled={checkingOut}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50 sm:ml-auto sm:w-auto sm:px-10"
            >
              {checkingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Checkout with Stripe"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
