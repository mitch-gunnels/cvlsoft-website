import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { policyRiders } from "@/lib/db/schema";
import { ApiError, json, requireCustomer, route } from "@/lib/api";
import { resolvePolicy } from "@/lib/account";

export const dynamic = "force-dynamic";

/** DELETE /api/policies/:id/riders/:riderSlug — remove a rider from this policy. */
export const DELETE = route(async (req, ctx: { params: Promise<{ id: string; riderSlug: string }> }) => {
  const c = await requireCustomer(req);
  const { id, riderSlug } = await ctx.params;
  const policy = await resolvePolicy(c.id, id);

  const existing = await db.query.policyRiders.findFirst({
    where: and(eq(policyRiders.policyId, policy.id), eq(policyRiders.riderSlug, riderSlug)),
  });
  if (!existing) throw new ApiError(404, `Rider '${riderSlug}' is not on ${policy.policyNumber}.`);

  await db.delete(policyRiders).where(eq(policyRiders.id, existing.id));
  return json({ message: `${existing.label} removed from ${policy.policyNumber}.` });
});
