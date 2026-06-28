import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { policyRiders } from "@/lib/db/schema";
import { ApiError, json, parseBody, requireCustomer, route } from "@/lib/api";
import { formatPrice } from "@/lib/config";
import { riderBySlug, serializeRider } from "@/lib/catalog";
import { resolvePolicy } from "@/lib/account";

export const dynamic = "force-dynamic";

const schema = z.object({ riderId: z.string().min(1).describe("Rider slug, e.g. 'roadside'") });

/** GET /api/policies/:id/riders — riders on this policy. */
export const GET = route(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const c = await requireCustomer(req);
  const { id } = await ctx.params;
  const policy = await resolvePolicy(c.id, id);
  const rows = await db.query.policyRiders.findMany({ where: eq(policyRiders.policyId, policy.id) });
  return json({
    policyId: policy.id,
    riders: rows.map((r) => ({
      slug: r.riderSlug,
      name: r.label,
      priceCents: r.priceCents,
      price: `${formatPrice(r.priceCents)}/mo`,
      ...(riderBySlug(r.riderSlug) ? { catalog: serializeRider(riderBySlug(r.riderSlug)!) } : {}),
    })),
  });
});

/** POST /api/policies/:id/riders — add a rider to this policy. */
export const POST = route(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const c = await requireCustomer(req);
  const { id } = await ctx.params;
  const policy = await resolvePolicy(c.id, id);
  const { riderId } = await parseBody(req, schema);

  const rider = riderBySlug(riderId);
  if (!rider) throw new ApiError(404, `Rider '${riderId}' not found`);
  if (!rider.appliesTo.includes(policy.type)) {
    throw new ApiError(409, `${rider.name} isn't available for a ${policy.type} policy.`);
  }

  const existing = await db.query.policyRiders.findFirst({
    where: and(eq(policyRiders.policyId, policy.id), eq(policyRiders.riderSlug, rider.slug)),
  });
  if (existing) {
    return json({ already: true, rider: serializeRider(rider), message: `${rider.name} is already on ${policy.policyNumber}.` });
  }

  await db.insert(policyRiders).values({ policyId: policy.id, riderSlug: rider.slug, label: rider.name, priceCents: rider.priceCents });
  return json({
    rider: serializeRider(rider),
    message: `${rider.name} added to ${policy.policyNumber} — ${formatPrice(rider.priceCents)}/mo on your next bill.`,
  });
});
