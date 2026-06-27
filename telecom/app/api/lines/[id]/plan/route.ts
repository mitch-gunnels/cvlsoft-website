import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { lines, plans } from "@/lib/db/schema";
import { ApiError, json, parseBody, requireCustomer, route } from "@/lib/api";
import { isUuid, serializeLine } from "@/lib/serializers";
import { lineWithRelations, resolveLine } from "@/lib/account";

export const dynamic = "force-dynamic";

const schema = z.object({ planId: z.string().min(1).describe("Plan UUID or slug") });

/** POST /api/lines/:id/plan — change the line's plan. */
export const POST = route(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const c = await requireCustomer(req);
  const { id } = await ctx.params;
  const line = await resolveLine(c.id, id);
  const { planId } = await parseBody(req, schema);

  const plan = await db.query.plans.findFirst({
    where: isUuid(planId) ? eq(plans.id, planId) : eq(plans.slug, planId),
  });
  if (!plan) throw new ApiError(404, `Plan '${planId}' not found`);
  if (plan.id === line.planId) {
    throw new ApiError(409, `Line is already on the ${plan.name} plan`);
  }

  await db.update(lines).set({ planId: plan.id }).where(eq(lines.id, line.id));

  return json({
    line: serializeLine(await lineWithRelations(line.id)),
    message: `${line.nickname || line.phoneNumber} switched from ${line.plan.name} to ${plan.name}. Takes effect at the start of the next bill cycle.`,
  });
});
