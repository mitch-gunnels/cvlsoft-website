import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { devices } from "@/lib/db/schema";
import { ApiError, json, route } from "@/lib/api";
import { isUuid, serializeDevice } from "@/lib/serializers";

export const dynamic = "force-dynamic";

/** GET /api/devices/:id — by UUID or slug. */
export const GET = route(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;
  const device = await db.query.devices.findFirst({
    where: isUuid(id) ? eq(devices.id, id) : eq(devices.slug, id),
  });
  if (!device) throw new ApiError(404, `Device '${id}' not found`);
  return json({ device: serializeDevice(device) });
});
