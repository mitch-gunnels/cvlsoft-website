import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { bills, lines } from "@/lib/db/schema";
import { json, requireCustomer, route } from "@/lib/api";
import { serializeLine } from "@/lib/serializers";
import { formatPrice } from "@/lib/config";

export const dynamic = "force-dynamic";

/** GET /api/me — account overview: profile, lines, and current balance. */
export const GET = route(async (req) => {
  const c = await requireCustomer(req);

  const [custLines, dueBills] = await Promise.all([
    db.query.lines.findMany({
      where: eq(lines.customerId, c.id),
      with: { plan: true, device: true },
    }),
    db.query.bills.findMany({
      where: and(eq(bills.customerId, c.id), eq(bills.status, "due")),
    }),
  ]);

  const balanceDueCents = dueBills.reduce((s, b) => s + b.totalCents, 0);

  return json({
    customer: { id: c.id, name: c.name, email: c.email, accountNumber: c.accountNumber, zip: c.zip },
    lines: custLines.map(serializeLine),
    balanceDueCents,
    balanceDue: formatPrice(balanceDueCents),
    dueBillCount: dueBills.length,
  });
});
