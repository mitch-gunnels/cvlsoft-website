import { json, route } from "@/lib/api";
import { RIDERS, serializeRider } from "@/lib/catalog";

export const dynamic = "force-dynamic";

/** GET /api/riders — add-on / endorsement catalog (public). */
export const GET = route(async () => {
  return json({ riders: RIDERS.map(serializeRider) });
});
