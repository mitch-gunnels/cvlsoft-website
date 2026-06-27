import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { devices } from "@/lib/db/schema";
import { json, route } from "@/lib/api";
import { serializeDevice } from "@/lib/serializers";

export const dynamic = "force-dynamic";

/** GET /api/devices — phones available for upgrade (public). */
export const GET = route(async () => {
  const rows = await db.query.devices.findMany({
    where: eq(devices.active, true),
    orderBy: asc(devices.priceCents),
  });
  return json({ devices: rows.map(serializeDevice) });
});
