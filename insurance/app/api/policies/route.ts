import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { policies } from "@/lib/db/schema";
import { json, requireCustomer, route } from "@/lib/api";
import { serializePolicy } from "@/lib/serializers";

export const dynamic = "force-dynamic";

/** GET /api/policies — the customer's policies with coverages. */
export const GET = route(async (req) => {
  const c = await requireCustomer(req);
  const rows = await db.query.policies.findMany({
    where: eq(policies.customerId, c.id),
    with: { coverages: true },
    orderBy: asc(policies.createdAt),
  });
  return json({ policies: rows.map(serializePolicy) });
});
