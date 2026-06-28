import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { policies } from "@/lib/db/schema";
import { ApiError, json, requireCustomer, route } from "@/lib/api";
import { formatPrice } from "@/lib/config";
import { serializePolicy } from "@/lib/serializers";
import { resolvePolicy } from "@/lib/account";

export const dynamic = "force-dynamic";

/** POST /api/policies/:id/pay — pay the premium due (demo: marks paid). */
export const POST = route(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const c = await requireCustomer(req);
  const { id } = await ctx.params;
  const policy = await resolvePolicy(c.id, id);
  if (policy.amountDueCents <= 0) throw new ApiError(409, "No payment due on this policy");

  const paid = policy.amountDueCents;
  const nextDue = new Date(Date.now() + 30 * 86400000);
  await db.update(policies).set({ amountDueCents: 0, dueDate: nextDue }).where(eq(policies.id, policy.id));

  const updated = await resolvePolicy(c.id, policy.id);
  return json({
    policy: serializePolicy(updated),
    message: `Payment of ${formatPrice(paid)} received for ${policy.policyNumber}. Next payment due ${nextDue.toLocaleDateString()}.`,
  });
});
