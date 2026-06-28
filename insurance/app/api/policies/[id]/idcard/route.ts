import { ApiError, json, requireCustomer, route } from "@/lib/api";
import { BRAND } from "@/lib/config";
import { insuredLabel } from "@/lib/serializers";
import { resolvePolicy } from "@/lib/account";

export const dynamic = "force-dynamic";

/** GET /api/policies/:id/idcard — auto insurance ID card data. */
export const GET = route(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const c = await requireCustomer(req);
  const { id } = await ctx.params;
  const policy = await resolvePolicy(c.id, id);
  if (policy.type !== "auto") throw new ApiError(400, "ID cards are issued for auto policies only");

  return json({
    idCard: {
      insurer: BRAND.name,
      policyNumber: policy.policyNumber,
      insured: c.name,
      vehicle: insuredLabel(policy),
      vin: policy.insured?.vin ?? null,
      effective: policy.effectiveDate,
      expires: policy.renewalDate,
      naic: "HB-DEMO-0001",
    },
  });
});
