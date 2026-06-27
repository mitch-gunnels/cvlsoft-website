import { and, asc, desc, eq, ilike, type SQL } from "drizzle-orm";
import { db } from "./db";
import { categories, products } from "./db/schema";

export function listCategories() {
  return db.query.categories.findMany({ orderBy: asc(categories.name) });
}

export async function listProducts(opts: {
  q?: string;
  categorySlug?: string;
  sort?: string;
  limit?: number;
} = {}) {
  const filters: SQL[] = [eq(products.active, true)];
  if (opts.q) filters.push(ilike(products.name, `%${opts.q}%`));
  if (opts.categorySlug) {
    const cat = await db.query.categories.findFirst({
      where: eq(categories.slug, opts.categorySlug),
    });
    if (!cat) return [];
    filters.push(eq(products.categoryId, cat.id));
  }

  const orderBy =
    opts.sort === "price_asc"
      ? asc(products.priceCents)
      : opts.sort === "price_desc"
        ? desc(products.priceCents)
        : opts.sort === "rating"
          ? desc(products.rating)
          : desc(products.createdAt);

  return db.query.products.findMany({
    where: and(...filters),
    with: { category: true },
    orderBy,
    limit: opts.limit ?? 100,
  });
}

export function getProductBySlug(slug: string) {
  return db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: { category: true },
  });
}

export function featuredProducts(n = 8) {
  return db.query.products.findMany({
    where: eq(products.active, true),
    with: { category: true },
    orderBy: desc(products.rating),
    limit: n,
  });
}
