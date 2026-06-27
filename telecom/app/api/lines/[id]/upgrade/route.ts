import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { devices } from "@/lib/db/schema";
import { json, requireCustomer, route } from "@/lib/api";
import { serializeDevice } from "@/lib/serializers";
import { resolveLine } from "@/lib/account";

export const dynamic = "force-dynamic";

/** GET /api/lines/:id/upgrade — device-upgrade eligibility + options. */
export const GET = route(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const c = await requireCustomer(req);
  const { id } = await ctx.params;
  const line = await resolveLine(c.id, id);

  if (!line.upgradeEligible) {
    return json({
      eligible: false,
      reason:
        "This line isn't upgrade-eligible yet (needs ~50% of the current device paid off). Pay off the device or wait until eligible.",
      currentDevice: line.device ? serializeDevice(line.device) : null,
    });
  }

  const options = await db.query.devices.findMany({
    where: eq(devices.active, true),
    orderBy: asc(devices.priceCents),
  });

  return json({
    eligible: true,
    currentDevice: line.device ? serializeDevice(line.device) : null,
    devices: options.map(serializeDevice),
  });
});
