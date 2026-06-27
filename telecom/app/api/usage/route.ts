import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { lines } from "@/lib/db/schema";
import { json, requireCustomer, route } from "@/lib/api";
import { serializeLine } from "@/lib/serializers";
import { resolveLine } from "@/lib/account";

export const dynamic = "force-dynamic";

/** GET /api/usage[?lineId=] — data usage this cycle for one or all lines. */
export const GET = route(async (req) => {
  const c = await requireCustomer(req);
  const ref = new URL(req.url).searchParams.get("lineId");

  if (ref) {
    const line = await resolveLine(c.id, ref);
    const s = serializeLine(line);
    return json({
      line: { id: line.id, nickname: line.nickname, phoneNumber: line.phoneNumber, plan: line.plan.name },
      usage: s.usage,
    });
  }

  const rows = await db.query.lines.findMany({
    where: eq(lines.customerId, c.id),
    with: { plan: true, device: true },
  });
  return json({
    usage: rows.map((l) => {
      const s = serializeLine(l);
      return { lineId: l.id, nickname: l.nickname, phoneNumber: l.phoneNumber, plan: l.plan.name, ...s.usage };
    }),
  });
});
