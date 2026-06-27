import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { cartItems, products } from "@/lib/db/schema";
import { ApiError, json, parseBody, requireCustomer, route } from "@/lib/api";
import { getCartView, getOrCreateOpenCart } from "@/lib/cart";
import { isUuid } from "@/lib/serializers";

export const dynamic = "force-dynamic";

const addSchema = z.object({
  productId: z.string().min(1).describe("Product UUID or slug"),
  size: z.string().min(1).optional().describe("Required when the product has sizes"),
  quantity: z.number().int().positive().max(99).optional().default(1),
});

/** POST /api/cart/items — add a product+size (merges with an existing line). */
export const POST = route(async (req) => {
  const customer = await requireCustomer(req);
  const { productId, size, quantity } = await parseBody(req, addSchema);

  const product = await db.query.products.findFirst({
    where: isUuid(productId)
      ? eq(products.id, productId)
      : eq(products.slug, productId),
  });
  if (!product) throw new ApiError(404, `Product '${productId}' not found`);

  // Size handling.
  const hasSizes = product.sizes.length > 0;
  if (hasSizes && !size) {
    throw new ApiError(400, `Size is required. Available: ${product.sizes.join(", ")}`);
  }
  if (size && hasSizes && !product.sizes.includes(size)) {
    throw new ApiError(400, `Size '${size}' not available. Available: ${product.sizes.join(", ")}`);
  }
  const chosen = hasSizes ? size! : "";
  const available = hasSizes ? (product.sizeStock[chosen] ?? 0) : product.inventory;
  if (available <= 0) {
    throw new ApiError(409, `${product.name}${chosen ? ` (size ${chosen})` : ""} is out of stock`);
  }

  const cart = await getOrCreateOpenCart(customer.id);

  const existing = await db.query.cartItems.findFirst({
    where: and(
      eq(cartItems.cartId, cart.id),
      eq(cartItems.productId, product.id),
      eq(cartItems.size, chosen),
    ),
  });

  const capped = Math.min((existing?.quantity ?? 0) + quantity, available);

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: capped })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db
      .insert(cartItems)
      .values({ cartId: cart.id, productId: product.id, size: chosen, quantity: capped });
  }

  return json({ cart: await getCartView(customer.id) }, { status: 201 });
});
