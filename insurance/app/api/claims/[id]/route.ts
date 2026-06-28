import { json, requireCustomer, route } from "@/lib/api";
import { serializeClaim } from "@/lib/serializers";
import { resolveClaim } from "@/lib/account";

export const dynamic = "force-dynamic";

/** GET /api/claims/:id — by UUID or claim number. */
export const GET = route(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const c = await requireCustomer(req);
  const { id } = await ctx.params;
  const claim = await resolveClaim(c.id, id);
  return json({ claim: serializeClaim(claim) });
});
