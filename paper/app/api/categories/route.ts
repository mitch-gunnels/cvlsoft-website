import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { json, route } from "@/lib/api";

export const dynamic = "force-dynamic";

/** GET /api/categories */
export const GET = route(async () => {
  const rows = await db.query.categories.findMany({
    orderBy: asc(categories.name),
  });
  return json({
    categories: rows.map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
    })),
  });
});
