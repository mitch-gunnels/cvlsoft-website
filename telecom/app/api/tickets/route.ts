import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { tickets } from "@/lib/db/schema";
import { json, parseBody, requireCustomer, route } from "@/lib/api";
import { serializeTicket } from "@/lib/serializers";
import { ticketNumber } from "@/lib/ids";

export const dynamic = "force-dynamic";

/** GET /api/tickets — the customer's support tickets. */
export const GET = route(async (req) => {
  const c = await requireCustomer(req);
  const rows = await db.query.tickets.findMany({
    where: eq(tickets.customerId, c.id),
    orderBy: desc(tickets.createdAt),
  });
  return json({ tickets: rows.map(serializeTicket) });
});

const createSchema = z.object({
  category: z.enum(["billing", "network", "device", "account"]).optional().default("account"),
  subject: z.string().min(1).max(140),
  body: z.string().max(2000).optional().default(""),
});

/** POST /api/tickets — open a support ticket. */
export const POST = route(async (req) => {
  const c = await requireCustomer(req);
  const b = await parseBody(req, createSchema);
  const [created] = await db
    .insert(tickets)
    .values({
      customerId: c.id,
      ticketNumber: ticketNumber(),
      category: b.category,
      subject: b.subject,
      body: b.body,
      status: "open",
    })
    .returning();
  return json({ ticket: serializeTicket(created) }, { status: 201 });
});
