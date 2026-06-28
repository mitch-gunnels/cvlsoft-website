import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { lineAddOns } from "@/lib/db/schema";
import { ApiError, json, requireCustomer, route } from "@/lib/api";
import { resolveAddOn, resolveLine } from "@/lib/account";

export const dynamic = "force-dynamic";

/** DELETE /api/lines/:id/addons/:addonId — remove an add-on from this line. */
export const DELETE = route(async (req, ctx: { params: Promise<{ id: string; addonId: string }> }) => {
  const c = await requireCustomer(req);
  const { id, addonId } = await ctx.params;
  const line = await resolveLine(c.id, id);
  const addOn = await resolveAddOn(addonId);

  const existing = await db.query.lineAddOns.findFirst({
    where: and(eq(lineAddOns.lineId, line.id), eq(lineAddOns.addOnId, addOn.id)),
  });
  if (!existing) throw new ApiError(404, `${addOn.name} is not on ${line.nickname || line.phoneNumber}.`);

  await db.delete(lineAddOns).where(eq(lineAddOns.id, existing.id));
  return json({ message: `${addOn.name} removed from ${line.nickname || line.phoneNumber}.` });
});
