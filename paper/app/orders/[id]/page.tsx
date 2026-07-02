import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { customerFromCookie } from "@/lib/auth";
import { formatPrice } from "@/lib/config";
import { RequestReturn } from "@/components/RequestReturn";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await customerFromCookie();
  if (!customer) notFound();

  const order = await db.query.orders.findFirst({
    where: and(eq(orders.customerId, customer.id), eq(orders.orderNumber, id)),
    with: { items: true, returns: { with: { items: true } } },
  });
  if (!order) notFound();

  const eligible = ["paid", "fulfilled"].includes(order.status);
  const addr = order.shippingAddress;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/orders" className="text-sm text-muted hover:text-foreground">
        ← All orders
      </Link>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h1 className="font-serif text-3xl">{order.orderNumber}</h1>
        <span className="rounded-full bg-surface border border-border px-3 py-1 text-xs font-medium">
          {order.status}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">
        Placed {new Date(order.createdAt).toLocaleString()}
      </p>

      <ul className="mt-8 divide-y divide-border border-y border-border">
        {order.items.map((i) => (
          <li key={i.id} className="flex justify-between py-4">
            <span>
              {i.nameSnapshot}{" "}
              <span className="text-muted">× {i.quantity}</span>
            </span>
            <span>{formatPrice(i.priceCents * i.quantity)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-6 ml-auto max-w-xs space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd>{formatPrice(order.subtotalCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd>{order.shippingCents === 0 ? "Free" : formatPrice(order.shippingCents)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-2 font-medium">
          <dt>Total</dt>
          <dd>{formatPrice(order.totalCents)}</dd>
        </div>
      </dl>

      {addr && (
        <div className="mt-8 text-sm text-muted">
          <p className="tracking-label text-xs">Shipping to</p>
          <p className="mt-1">
            {addr.line1}, {addr.city}, {addr.state} {addr.postalCode}
          </p>
        </div>
      )}

      <div className="mt-10 border-t border-border pt-6">
        {order.returns.length > 0 ? (
          <div className="text-sm">
            <p className="tracking-label text-xs text-muted">Returns</p>
            <ul className="mt-2 space-y-1">
              {order.returns.map((r) => (
                <li key={r.id} className="flex justify-between">
                  <span className="font-mono">{r.rmaNumber}</span>
                  <span className="text-muted">{r.status}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : eligible ? (
          <RequestReturn orderNumber={order.orderNumber} />
        ) : (
          <p className="text-sm text-muted">
            Returns open once an order is paid.
          </p>
        )}
      </div>
    </div>
  );
}
