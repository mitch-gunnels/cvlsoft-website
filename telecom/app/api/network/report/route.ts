import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { networkAreas, tickets } from "@/lib/db/schema";
import { json, parseBody, requireCustomer, route } from "@/lib/api";
import { serializeTicket } from "@/lib/serializers";
import { ticketNumber } from "@/lib/ids";

export const dynamic = "force-dynamic";

const schema = z.object({
  zip: z.string().min(3).max(10).optional(),
  note: z.string().max(500).optional().default(""),
});

/** POST /api/network/report — report a network problem; opens a ticket. */
export const POST = route(async (req) => {
  const c = await requireCustomer(req);
  const b = await parseBody(req, schema);
  const zip = b.zip || c.zip;

  const area = await db.query.networkAreas.findFirst({
    where: eq(networkAreas.zip, zip),
  });

  const [ticket] = await db
    .insert(tickets)
    .values({
      customerId: c.id,
      ticketNumber: ticketNumber(),
      category: "network",
      subject: `Reported network issue${zip ? ` — ${zip}` : ""}`,
      body: b.note,
      status: "open",
    })
    .returning();

  return json(
    {
      ticket: serializeTicket(ticket),
      area: area
        ? { zip: area.zip, city: area.city, state: area.state, status: area.status, note: area.note }
        : { zip, status: "unknown" },
      message:
        area && area.status !== "operational"
          ? `Thanks — we're already tracking a ${area.status} in ${area.city}. ${area.note}`
          : "Thanks for the report. We've logged it and our team will investigate.",
    },
    { status: 201 },
  );
});
