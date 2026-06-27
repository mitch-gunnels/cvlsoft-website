import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { customerFromCookie } from "@/lib/auth";
import { formatPrice } from "@/lib/config";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders" };

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  fulfilled: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-stone-200 text-stone-600",
};

export default async function OrdersPage() {
  const customer = await customerFromCookie();

  if (!customer) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-serif text-3xl">Orders</h1>
        <p className="mt-4 text-muted">Choose a demo shopper to see their orders.</p>
        <Link
          href="/account"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm text-accent-foreground hover:opacity-90"
        >
          Choose shopper
        </Link>
      </div>
    );
  }

  const rows = await db.query.orders.findMany({
    where: eq(orders.customerId, customer.id),
    with: { items: true },
    orderBy: desc(orders.createdAt),
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-serif text-3xl">Your orders</h1>

      {rows.length === 0 ? (
        <p className="mt-8 text-muted">No orders yet.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {rows.map((o) => (
            <li key={o.id}>
              <Link
                href={`/orders/${o.orderNumber}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-5 py-4 hover:border-foreground/30"
              >
                <div>
                  <p className="font-mono text-sm">{o.orderNumber}</p>
                  <p className="text-sm text-muted">
                    {o.items.length} item{o.items.length === 1 ? "" : "s"} ·{" "}
                    {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      STATUS_STYLES[o.status] ?? "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {o.status}
                  </span>
                  <span className="text-sm">{formatPrice(o.totalCents)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
