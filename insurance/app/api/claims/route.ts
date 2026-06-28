import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { claims } from "@/lib/db/schema";
import { ApiError, json, parseBody, requireCustomer, route } from "@/lib/api";
import { serializeClaim } from "@/lib/serializers";
import { resolvePolicy } from "@/lib/account";
import { claimNumber } from "@/lib/ids";

export const dynamic = "force-dynamic";

/** GET /api/claims — the customer's claims, newest first. */
export const GET = route(async (req) => {
  const c = await requireCustomer(req);
  const rows = await db.query.claims.findMany({
    where: eq(claims.customerId, c.id),
    orderBy: desc(claims.createdAt),
  });
  return json({ claims: rows.map(serializeClaim) });
});

const fileSchema = z.object({
  policyId: z.string().min(1).describe("Policy UUID or number"),
  type: z.enum(["collision", "theft", "glass", "water", "fire", "liability", "weather", "other"]),
  dateOfLoss: z.string().min(1).describe("ISO date of the incident"),
  description: z.string().min(1).max(2000),
  photos: z.array(z.string().url()).optional().default([]),
});

/** POST /api/claims — file a new claim (first notice of loss). */
export const POST = route(async (req) => {
  const c = await requireCustomer(req);
  const body = await parseBody(req, fileSchema);
  const policy = await resolvePolicy(c.id, body.policyId);

  const dol = new Date(body.dateOfLoss);
  if (Number.isNaN(+dol)) throw new ApiError(400, "dateOfLoss is not a valid date");

  const [claim] = await db
    .insert(claims)
    .values({
      customerId: c.id,
      policyId: policy.id,
      claimNumber: claimNumber(),
      type: body.type,
      status: "submitted",
      dateOfLoss: dol,
      description: body.description,
      photos: body.photos,
      adjuster: "Pending assignment",
    })
    .returning();

  return json(
    {
      claim: serializeClaim(claim),
      message: `Claim ${claim.claimNumber} filed against ${policy.policyNumber}. An adjuster will be assigned within 1 business day.`,
    },
    { status: 201 },
  );
});
