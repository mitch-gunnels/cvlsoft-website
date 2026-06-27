import { and, asc, desc, eq, ilike, type SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { json, route } from "@/lib/api";
import { serializeProduct } from "@/lib/serializers";

export const dynamic = "force-dynamic";

/**
 * GET /api/products
 * Query: q, category (slug), sort (price_asc|price_desc|newest|rating),
 *        limit (1-100, default 50), offset (default 0), inStock (true)
 */
export const GET = route(async (req) => {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim();
  const categorySlug = url.searchParams.get("category")?.trim();
  const sort = url.searchParams.get("sort") ?? "newest";
  const inStockOnly = url.searchParams.get("inStock") === "true";
  const limit = Math.min(
    Math.max(parseInt(url.searchParams.get("limit") ?? "50", 10) || 50, 1),
    100,
  );
  const offset = Math.max(parseInt(url.searchParams.get("offset") ?? "0", 10) || 0, 0);

  const filters: SQL[] = [eq(products.active, true)];
  if (q) filters.push(ilike(products.name, `%${q}%`));
  if (categorySlug) {
    const cat = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug),
    });
    if (!cat) return json({ products: [], total: 0, limit, offset });
    filters.push(eq(products.categoryId, cat.id));
  }

  const orderBy =
    sort === "price_asc"
      ? asc(products.priceCents)
      : sort === "price_desc"
        ? desc(products.priceCents)
        : sort === "rating"
          ? desc(products.rating)
          : desc(products.createdAt);

  const rows = await db.query.products.findMany({
    where: and(...filters),
    with: { category: true },
    orderBy,
    limit,
    offset,
  });

  const items = rows
    .filter((p) => (inStockOnly ? p.inventory > 0 : true))
    .map((p) => serializeProduct(p, p.category));

  return json({ products: items, count: items.length, limit, offset });
});
