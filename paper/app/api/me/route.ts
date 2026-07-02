import { json, requireCustomer, route } from "@/lib/api";

export const dynamic = "force-dynamic";

/** GET /api/me — the authenticated customer. */
export const GET = route(async (req) => {
  const c = await requireCustomer(req);
  return json({
    customer: { id: c.id, name: c.name, email: c.email },
  });
});
