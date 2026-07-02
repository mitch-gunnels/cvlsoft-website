import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { ApiError, json, route } from "@/lib/api";
import { isUuid, serializeProduct } from "@/lib/serializers";

export const dynamic = "force-dynamic";

/** GET /api/products/:id  — id may be a product UUID or its slug. */
export const GET = route(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;

  const product = await db.query.products.findFirst({
    where: isUuid(id) ? eq(products.id, id) : eq(products.slug, id),
    with: { category: true },
  });

  if (!product) throw new ApiError(404, `Product '${id}' not found`);

  return json({ product: serializeProduct(product, product.category) });
});
