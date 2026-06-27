import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { plans } from "@/lib/db/schema";
import { ApiError, json, route } from "@/lib/api";
import { isUuid, serializePlan } from "@/lib/serializers";

export const dynamic = "force-dynamic";

/** GET /api/plans/:id — by UUID or slug. */
export const GET = route(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;
  const plan = await db.query.plans.findFirst({
    where: isUuid(id) ? eq(plans.id, id) : eq(plans.slug, id),
  });
  if (!plan) throw new ApiError(404, `Plan '${id}' not found`);
  return json({ plan: serializePlan(plan) });
});
