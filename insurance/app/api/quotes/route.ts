import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { quotes } from "@/lib/db/schema";
import { json, parseBody, requireCustomer, route } from "@/lib/api";
import { serializeQuote } from "@/lib/serializers";
import { quoteNumber } from "@/lib/ids";

export const dynamic = "force-dynamic";

/** GET /api/quotes — the customer's saved quotes. */
export const GET = route(async (req) => {
  const c = await requireCustomer(req);
  const rows = await db.query.quotes.findMany({
    where: eq(quotes.customerId, c.id),
    orderBy: desc(quotes.createdAt),
  });
  return json({ quotes: rows.map(serializeQuote) });
});

const BASE: Record<string, number> = { auto: 11000, home: 9000, renters: 2500 };
const LEVEL: Record<string, number> = { basic: 0.8, standard: 1.0, premium: 1.35 };
const COVERAGE: Record<string, Record<string, string[]>> = {
  auto: {
    basic: ["State-minimum liability", "Uninsured motorist"],
    standard: ["$100k liability", "Collision ($500 ded)", "Comprehensive ($500 ded)", "Uninsured motorist"],
    premium: ["$250k liability", "Collision ($250 ded)", "Comprehensive ($250 ded)", "Roadside", "Rental reimbursement"],
  },
  home: {
    basic: ["Dwelling $200k", "Liability $100k"],
    standard: ["Dwelling $350k", "Personal property $175k", "Liability $300k", "Loss of use"],
    premium: ["Dwelling $500k", "Personal property $300k", "Liability $500k", "Water backup", "Replacement cost"],
  },
  renters: {
    basic: ["Personal property $15k", "Liability $100k"],
    standard: ["Personal property $30k", "Liability $300k", "Loss of use"],
    premium: ["Personal property $50k", "Liability $500k", "Loss of use", "Replacement cost"],
  },
};

const schema = z.object({
  type: z.enum(["auto", "home", "renters"]),
  coverageLevel: z.enum(["basic", "standard", "premium"]).optional().default("standard"),
  details: z.record(z.string(), z.union([z.string(), z.number()])).optional().default({}),
});

/** POST /api/quotes — generate an insurance quote. */
export const POST = route(async (req) => {
  const c = await requireCustomer(req);
  const { type, coverageLevel, details } = await parseBody(req, schema);

  const monthlyCents = Math.round(BASE[type] * LEVEL[coverageLevel]);
  const coverageSummary = COVERAGE[type][coverageLevel];

  const [q] = await db
    .insert(quotes)
    .values({
      customerId: c.id,
      quoteNumber: quoteNumber(),
      type,
      inputs: { coverageLevel, ...details },
      monthlyCents,
      coverageSummary,
    })
    .returning();

  return json({ quote: serializeQuote(q) }, { status: 201 });
});
