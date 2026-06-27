import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { bills } from "@/lib/db/schema";
import { json, requireCustomer, route } from "@/lib/api";
import { serializeBill } from "@/lib/serializers";

export const dynamic = "force-dynamic";

/** GET /api/bills — the customer's bills, newest first. */
export const GET = route(async (req) => {
  const c = await requireCustomer(req);
  const rows = await db.query.bills.findMany({
    where: eq(bills.customerId, c.id),
    with: { items: true },
    orderBy: desc(bills.createdAt),
  });
  return json({ bills: rows.map(serializeBill) });
});
