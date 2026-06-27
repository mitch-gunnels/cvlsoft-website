import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { bills } from "@/lib/db/schema";
import { ApiError, json, requireCustomer, route } from "@/lib/api";
import { isUuid, serializeBill } from "@/lib/serializers";

export const dynamic = "force-dynamic";

/** GET /api/bills/:id — by UUID or invoice number (INV-…), with line items. */
export const GET = route(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const c = await requireCustomer(req);
  const { id } = await ctx.params;
  const bill = await db.query.bills.findFirst({
    where: and(
      eq(bills.customerId, c.id),
      isUuid(id) ? eq(bills.id, id) : eq(bills.invoiceNumber, id),
    ),
    with: { items: true },
  });
  if (!bill) throw new ApiError(404, `Bill '${id}' not found`);
  return json({ bill: serializeBill(bill) });
});
