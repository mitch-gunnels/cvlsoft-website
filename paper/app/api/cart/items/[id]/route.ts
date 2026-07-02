import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { cartItems, products } from "@/lib/db/schema";
import { ApiError, json, parseBody, requireCustomer, route } from "@/lib/api";
import { getCartView, getOrCreateOpenCart } from "@/lib/cart";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  quantity: z.number().int().min(0).max(99).describe("0 removes the line"),
});

/** Find a cart line that belongs to this customer's open cart, or 404. */
async function ownedItem(customerId: string, itemId: string) {
  const cart = await getOrCreateOpenCart(customerId);
  const item = await db.query.cartItems.findFirst({
    where: and(eq(cartItems.id, itemId), eq(cartItems.cartId, cart.id)),
  });
  if (!item) throw new ApiError(404, "Cart item not found");
  return item;
}

/** PATCH /api/cart/items/:id — set quantity (0 removes). */
export const PATCH = route(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const customer = await requireCustomer(req);
  const { id } = await ctx.params;
  const { quantity } = await parseBody(req, patchSchema);
  const item = await ownedItem(customer.id, id);

  if (quantity === 0) {
    await db.delete(cartItems).where(eq(cartItems.id, item.id));
  } else {
    const product = await db.query.products.findFirst({
      where: eq(products.id, item.productId),
    });
    const available = product
      ? product.sizes.length
        ? (product.sizeStock[item.size] ?? 0)
        : product.inventory
      : quantity;
    const capped = Math.min(quantity, available);
    await db.update(cartItems).set({ quantity: capped }).where(eq(cartItems.id, item.id));
  }

  return json({ cart: await getCartView(customer.id) });
});

/** DELETE /api/cart/items/:id — remove the line. */
export const DELETE = route(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const customer = await requireCustomer(req);
  const { id } = await ctx.params;
  const item = await ownedItem(customer.id, id);
  await db.delete(cartItems).where(eq(cartItems.id, item.id));
  return json({ cart: await getCartView(customer.id) });
});
