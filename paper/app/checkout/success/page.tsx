import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { customerFromCookie } from "@/lib/auth";
import { formatPrice } from "@/lib/config";

export const dynamic = "force-dynamic";
export const metadata = { title: "Order confirmed" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const customer = await customerFromCookie();
  const order =
    customer && orderNumber
      ? await db.query.orders.findFirst({
          where: and(
            eq(orders.orderNumber, orderNumber),
            eq(orders.customerId, customer.id),
          ),
        })
      : null;

  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
      <h1 className="mt-5 font-serif text-3xl">Thank you for your order</h1>
      {order ? (
        <p className="mt-3 text-muted">
          {order.orderNumber} · {formatPrice(order.totalCents)}
        </p>
      ) : (
        <p className="mt-3 text-muted">Your order has been placed.</p>
      )}
      <div className="mt-8 flex justify-center gap-3">
        {order && (
          <Link
            href={`/orders/${order.orderNumber}`}
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
    </div>
  );
}
