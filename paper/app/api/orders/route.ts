import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { json, requireCustomer, route } from "@/lib/api";
import { serializeOrder } from "@/lib/serializers";

export const dynamic = "force-dynamic";

/** GET /api/orders — the customer's order history (newest first). */
export const GET = route(async (req) => {
  const customer = await requireCustomer(req);
  const rows = await db.query.orders.findMany({
    where: eq(orders.customerId, customer.id),
    with: { items: true },
    orderBy: desc(orders.createdAt),
  });
  return json({ orders: rows.map(serializeOrder) });
});
