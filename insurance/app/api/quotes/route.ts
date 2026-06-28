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

import { PRODUCTS } from "@/lib/catalog";

// Tier prices come straight from the shop catalog so /shop and /quote always agree.
const TIER_PRICE: Record<string, Record<string, number>> = Object.fromEntries(
  PRODUCTS.filter((p) => p.quoteType).map((p) => [
    p.quoteType as string,
    Object.fromEntries(p.tiers.map((t) => [t.key, t.priceCents])),
  ]),
);
const COVERAGE: Record<string, Record<string, string[]>> = Object.fromEntries(
  PRODUCTS.filter((p) => p.quoteType).map((p) => [
    p.quoteType as string,
    Object.fromEntries(p.tiers.map((t) => [t.key, t.coverages])),
  ]),
);

const schema = z.object({
  type: z.enum(["auto", "home", "renters", "life", "pet", "umbrella"]),
  coverageLevel: z.enum(["basic", "standard", "premium"]).optional().default("standard"),
  details: z.record(z.string(), z.union([z.string(), z.number()])).optional().default({}),
});

/** POST /api/quotes — generate an insurance quote. */
export const POST = route(async (req) => {
  const c = await requireCustomer(req);
  const { type, coverageLevel, details } = await parseBody(req, schema);

  const monthlyCents = TIER_PRICE[type][coverageLevel];
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
