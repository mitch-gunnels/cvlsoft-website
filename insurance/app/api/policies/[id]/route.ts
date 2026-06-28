import { json, requireCustomer, route } from "@/lib/api";
import { serializePolicy } from "@/lib/serializers";
import { resolvePolicy } from "@/lib/account";

export const dynamic = "force-dynamic";

/** GET /api/policies/:id — by UUID or policy number, with coverages. */
export const GET = route(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const c = await requireCustomer(req);
  const { id } = await ctx.params;
  const policy = await resolvePolicy(c.id, id);
  return json({ policy: serializePolicy(policy) });
});
