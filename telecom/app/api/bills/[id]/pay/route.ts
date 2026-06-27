import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { bills } from "@/lib/db/schema";
import { ApiError, json, requireCustomer, route } from "@/lib/api";
import { formatPrice } from "@/lib/config";
import { isUuid, serializeBill } from "@/lib/serializers";

export const dynamic = "force-dynamic";

/** POST /api/bills/:id/pay — pay a due bill (demo: marks it paid). */
export const POST = route(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const c = await requireCustomer(req);
  const { id } = await ctx.params;

  const bill = await db.query.bills.findFirst({
    where: and(
      eq(bills.customerId, c.id),
      isUuid(id) ? eq(bills.id, id) : eq(bills.invoiceNumber, id),
    ),
  });
  if (!bill) throw new ApiError(404, `Bill '${id}' not found`);
  if (bill.status === "paid") throw new ApiError(409, `Bill ${bill.invoiceNumber} is already paid`);

  await db
    .update(bills)
    .set({ status: "paid", paidAt: new Date() })
    .where(eq(bills.id, bill.id));

  const updated = await db.query.bills.findFirst({
    where: eq(bills.id, bill.id),
    with: { items: true },
  });

  return json({
    bill: serializeBill(updated!),
    message: `Payment of ${formatPrice(bill.totalCents)} received. Thanks! Confirmation for ${bill.invoiceNumber}.`,
  });
});
