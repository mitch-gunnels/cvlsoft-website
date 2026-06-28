import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { claims, policies } from "@/lib/db/schema";
import { json, requireCustomer, route } from "@/lib/api";
import { formatPrice } from "@/lib/config";
import { serializePolicy } from "@/lib/serializers";

export const dynamic = "force-dynamic";

const OPEN = ["submitted", "in_review", "approved"];

/** GET /api/me — account overview: policies, premium, amount due, open claims. */
export const GET = route(async (req) => {
  const c = await requireCustomer(req);
  const [pols, custClaims] = await Promise.all([
    db.query.policies.findMany({ where: eq(policies.customerId, c.id), with: { coverages: true } }),
    db.query.claims.findMany({ where: eq(claims.customerId, c.id), orderBy: desc(claims.createdAt) }),
  ]);
  const amountDueCents = pols.reduce((s, p) => s + p.amountDueCents, 0);
  const monthlyCents = pols.reduce((s, p) => s + p.premiumCents, 0);

  return json({
    customer: {
      id: c.id, name: c.name, email: c.email, accountNumber: c.accountNumber,
      address: `${c.addressLine1}, ${c.city}, ${c.state} ${c.zip}`,
    },
    policies: pols.map(serializePolicy),
    monthlyPremiumCents: monthlyCents,
    monthlyPremium: formatPrice(monthlyCents),
    amountDueCents,
    amountDue: formatPrice(amountDueCents),
    openClaims: custClaims.filter((x) => OPEN.includes(x.status)).length,
    claimCount: custClaims.length,
  });
});
