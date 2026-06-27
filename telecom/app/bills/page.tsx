import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { bills } from "@/lib/db/schema";
import { customerFromCookie } from "@/lib/auth";
import { formatPrice } from "@/lib/config";

export const dynamic = "force-dynamic";
export const metadata = { title: "Billing" };

export default async function BillsPage() {
  const customer = await customerFromCookie();
  if (!customer) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="mt-3 text-muted">Choose a demo account to see its bills.</p>
        <Link href="/account" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm text-accent-foreground hover:opacity-90">Choose account</Link>
      </div>
    );
  }

  const rows = await db.query.bills.findMany({
    where: eq(bills.customerId, customer.id),
    orderBy: desc(bills.createdAt),
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Billing</h1>
      <ul className="mt-6 space-y-3">
        {rows.map((b) => (
          <li key={b.id}>
            <Link href={`/bills/${b.invoiceNumber}`} className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4 hover:border-accent/40">
              <div>
                <p className="font-mono text-sm">{b.invoiceNumber}</p>
                <p className="text-sm text-muted">
                  {new Date(b.periodStart).toLocaleDateString()} – {new Date(b.periodEnd).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${b.status === "due" ? "bg-warn/10 text-warn" : "bg-ok/10 text-ok"}`}>
                  {b.status === "due" ? `Due ${new Date(b.dueDate).toLocaleDateString()}` : "Paid"}
                </span>
                <span className="font-medium">{formatPrice(b.totalCents)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
