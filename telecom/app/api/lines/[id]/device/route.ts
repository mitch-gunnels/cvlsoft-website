import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { devices, lines } from "@/lib/db/schema";
import { ApiError, json, parseBody, requireCustomer, route } from "@/lib/api";
import { formatPrice } from "@/lib/config";
import { isUuid, serializeLine } from "@/lib/serializers";
import { lineWithRelations, resolveLine } from "@/lib/account";

export const dynamic = "force-dynamic";

const schema = z.object({ deviceId: z.string().min(1).describe("Device UUID or slug") });

/** POST /api/lines/:id/device — upgrade the line to a new device (24-mo installment). */
export const POST = route(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const c = await requireCustomer(req);
  const { id } = await ctx.params;
  const line = await resolveLine(c.id, id);
  if (!line.upgradeEligible) {
    throw new ApiError(409, "This line is not upgrade-eligible yet.");
  }

  const { deviceId } = await parseBody(req, schema);
  const device = await db.query.devices.findFirst({
    where: isUuid(deviceId) ? eq(devices.id, deviceId) : eq(devices.slug, deviceId),
  });
  if (!device) throw new ApiError(404, `Device '${deviceId}' not found`);

  await db
    .update(lines)
    .set({ deviceId: device.id, upgradeEligible: false })
    .where(eq(lines.id, line.id));

  return json({
    line: serializeLine(await lineWithRelations(line.id)),
    message: `${device.name} ordered for ${line.nickname || line.phoneNumber}. ${formatPrice(device.monthlyCents)}/mo for 24 months will appear on your next bill.`,
  });
});
