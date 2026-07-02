import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { cartItems } from "@/lib/db/schema";
import { json, requireCustomer, route } from "@/lib/api";
import { getCartView, getOrCreateOpenCart } from "@/lib/cart";

export const dynamic = "force-dynamic";

/** GET /api/cart — the customer's open cart with totals. */
export const GET = route(async (req) => {
  const customer = await requireCustomer(req);
  const cart = await getCartView(customer.id);
  return json({ cart });
});

/** DELETE /api/cart — empty the cart. */
export const DELETE = route(async (req) => {
  const customer = await requireCustomer(req);
  const cart = await getOrCreateOpenCart(customer.id);
  await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
  return json({ cart: await getCartView(customer.id) });
});
