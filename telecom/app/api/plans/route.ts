import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { plans } from "@/lib/db/schema";
import { json, route } from "@/lib/api";
import { serializePlan } from "@/lib/serializers";

export const dynamic = "force-dynamic";

/** GET /api/plans — available plans (public). */
export const GET = route(async () => {
  const rows = await db.query.plans.findMany({
    where: eq(plans.active, true),
    orderBy: asc(plans.priceCents),
  });
  return json({ plans: rows.map(serializePlan) });
});
