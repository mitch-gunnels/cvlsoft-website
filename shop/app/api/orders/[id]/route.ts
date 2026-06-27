import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { ApiError, json, requireCustomer, route } from "@/lib/api";
import { isUuid, serializeOrder } from "@/lib/serializers";

export const dynamic = "force-dynamic";

/** GET /api/orders/:id — id may be the order UUID or order number (LMN-…). */
export const GET = route(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const customer = await requireCustomer(req);
  const { id } = await ctx.params;

  const order = await db.query.orders.findFirst({
    where: and(
      eq(orders.customerId, customer.id),
      isUuid(id) ? eq(orders.id, id) : eq(orders.orderNumber, id),
    ),
    with: { items: true },
  });

  if (!order) throw new ApiError(404, `Order '${id}' not found`);
  return json({ order: serializeOrder(order) });
});
