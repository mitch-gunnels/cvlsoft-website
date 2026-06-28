import { json, route } from "@/lib/api";
import { PRODUCTS, serializeProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";

/** GET /api/products — coverage catalog with tiers (public). */
export const GET = route(async () => {
  return json({ products: PRODUCTS.map(serializeProduct) });
});
