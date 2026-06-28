import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { lineAddOns } from "@/lib/db/schema";
import { json, parseBody, requireCustomer, route } from "@/lib/api";
import { serializeAddOn } from "@/lib/serializers";
import { resolveAddOn, resolveLine } from "@/lib/account";

export const dynamic = "force-dynamic";

const schema = z.object({ addOnId: z.string().min(1).describe("Add-on UUID or slug") });

/** GET /api/lines/:id/addons — add-ons currently on this line. */
export const GET = route(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const c = await requireCustomer(req);
  const { id } = await ctx.params;
  const line = await resolveLine(c.id, id);
  const rows = await db.query.lineAddOns.findMany({
    where: eq(lineAddOns.lineId, line.id),
    with: { addOn: true },
  });
  return json({ lineId: line.id, addOns: rows.map((r) => serializeAddOn(r.addOn)) });
});

/** POST /api/lines/:id/addons — add an add-on to this line. */
export const POST = route(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const c = await requireCustomer(req);
  const { id } = await ctx.params;
  const line = await resolveLine(c.id, id);
  const { addOnId } = await parseBody(req, schema);
  const addOn = await resolveAddOn(addOnId);

  const existing = await db.query.lineAddOns.findFirst({
    where: and(eq(lineAddOns.lineId, line.id), eq(lineAddOns.addOnId, addOn.id)),
  });
  if (existing) {
    return json({
      already: true,
      addOn: serializeAddOn(addOn),
      message: `${addOn.name} is already on ${line.nickname || line.phoneNumber}.`,
    });
  }

  await db.insert(lineAddOns).values({ lineId: line.id, addOnId: addOn.id });
  return json({
    addOn: serializeAddOn(addOn),
    message: `${addOn.name} added to ${line.nickname || line.phoneNumber} — ${addOn.priceCents > 0 ? "$" + (addOn.priceCents / 100).toFixed(2) + "/mo" : "free"} on your next bill.`,
  });
});
