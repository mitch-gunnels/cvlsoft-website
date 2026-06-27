import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { lines, plans } from "@/lib/db/schema";
import { ApiError, json, parseBody, requireCustomer, route } from "@/lib/api";
import { isUuid, serializeLine } from "@/lib/serializers";
import { lineWithRelations } from "@/lib/account";
import { phoneNumber } from "@/lib/ids";

export const dynamic = "force-dynamic";

/** GET /api/lines — the customer's lines. */
export const GET = route(async (req) => {
  const c = await requireCustomer(req);
  const rows = await db.query.lines.findMany({
    where: eq(lines.customerId, c.id),
    with: { plan: true, device: true },
    orderBy: asc(lines.createdAt),
  });
  return json({ lines: rows.map(serializeLine) });
});

const addSchema = z.object({
  planId: z.string().min(1).describe("Plan UUID or slug"),
  nickname: z.string().max(40).optional().default(""),
});

/** POST /api/lines — add a new line on a chosen plan. */
export const POST = route(async (req) => {
  const c = await requireCustomer(req);
  const { planId, nickname } = await parseBody(req, addSchema);

  const plan = await db.query.plans.findFirst({
    where: isUuid(planId) ? eq(plans.id, planId) : eq(plans.slug, planId),
  });
  if (!plan) throw new ApiError(404, `Plan '${planId}' not found`);

  const [created] = await db
    .insert(lines)
    .values({
      customerId: c.id,
      phoneNumber: phoneNumber(),
      nickname,
      planId: plan.id,
      status: "active",
      dataUsedMb: 0,
      upgradeEligible: false,
    })
    .returning();

  const full = await lineWithRelations(created.id);
  return json(
    { line: serializeLine(full), message: `New line ${full.phoneNumber} added on the ${plan.name} plan.` },
    { status: 201 },
  );
});
