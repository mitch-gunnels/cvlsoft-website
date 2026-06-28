import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { addOns } from "@/lib/db/schema";
import { json, route } from "@/lib/api";
import { serializeAddOn } from "@/lib/serializers";

export const dynamic = "force-dynamic";

/** GET /api/addons — plan add-ons / extras catalog (public). */
export const GET = route(async () => {
  const rows = await db.query.addOns.findMany({
    where: eq(addOns.active, true),
    orderBy: asc(addOns.priceCents),
  });
  return json({ addOns: rows.map(serializeAddOn) });
});
