import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { bills } from "@/lib/db/schema";
import { customerFromCookie } from "@/lib/auth";
import { formatPrice } from "@/lib/config";
import { isUuid } from "@/lib/serializers";
import { PayButton } from "@/components/PayButton";

export const dynamic = "force-dynamic";

export default async function BillDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await customerFromCookie();
  if (!customer) notFound();

  const bill = await db.query.bills.findFirst({
    where: and(eq(bills.customerId, customer.id), isUuid(id) ? eq(bills.id, id) : eq(bills.invoiceNumber, id)),
    with: { items: true },
  });
  if (!bill) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/bills" className="text-sm text-muted hover:text-foreground">← All bills</Link>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold font-mono">{bill.invoiceNumber}</h1>
          <p className="mt-1 text-sm text-muted">
            {new Date(bill.periodStart).toLocaleDateString()} – {new Date(bill.periodEnd).toLocaleDateString()}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${bill.status === "due" ? "bg-warn/10 text-warn" : "bg-ok/10 text-ok"}`}>
          {bill.status === "due" ? `Due ${new Date(bill.dueDate).toLocaleDateString()}` : "Paid"}
        </span>
      </div>

      <ul className="mt-8 divide-y divide-border border-y border-border">
        {bill.items.map((i) => (
          <li key={i.id} className="flex items-center justify-between py-3 text-sm">
            <span className="flex items-center gap-2">
              {i.description}
              {i.category === "overage" && <span className="label rounded-full bg-bad/10 px-2 py-0.5 text-bad">overage</span>}
            </span>
            <span className={i.category === "overage" ? "text-bad font-medium" : ""}>{formatPrice(i.amountCents)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 ml-auto max-w-xs space-y-1.5 text-sm">
        <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(bill.subtotalCents)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">Taxes & fees</dt><dd>{formatPrice(bill.taxesCents)}</dd></div>
        <div className="flex justify-between border-t border-border pt-1.5 text-base font-semibold"><dt>Total</dt><dd>{formatPrice(bill.totalCents)}</dd></div>
      </dl>

      {bill.status === "due" && (
        <div className="mt-6 flex justify-end">
          <PayButton invoiceNumber={bill.invoiceNumber} />
        </div>
      )}
    </div>
  );
}
