import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { networkAreas } from "@/lib/db/schema";
import { ApiError, json, route } from "@/lib/api";
import { customerFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/network[?zip=] — coverage/outage status for a ZIP.
 * Falls back to the authenticated customer's billing ZIP.
 */
export const GET = route(async (req) => {
  let zip = new URL(req.url).searchParams.get("zip")?.trim();
  if (!zip) {
    const c = await customerFromRequest(req);
    zip = c?.zip || undefined;
  }
  if (!zip) throw new ApiError(400, "Provide ?zip= or authenticate to use your billing ZIP.");

  const area = await db.query.networkAreas.findFirst({
    where: eq(networkAreas.zip, zip),
  });
  if (!area) {
    return json({ zip, status: "unknown", note: "No coverage data for this ZIP." });
  }
  return json({
    area: { zip: area.zip, city: area.city, state: area.state, status: area.status, note: area.note },
  });
});
