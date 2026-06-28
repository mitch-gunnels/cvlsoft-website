import { ApiError, json, route } from "@/lib/api";
import { productBySlug, serializeProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";

/** GET /api/products/:slug — one coverage product with tiers (public). */
export const GET = route(async (_req, ctx: { params: Promise<{ slug: string }> }) => {
  const { slug } = await ctx.params;
  const product = productBySlug(slug);
  if (!product) throw new ApiError(404, `Product '${slug}' not found`);
  return json({ product: serializeProduct(product) });
});
