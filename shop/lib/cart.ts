import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { carts, cartItems } from "./db/schema";

export const SHIPPING_FLAT_CENTS = 800;
export const FREE_SHIPPING_THRESHOLD_CENTS = 7500;

/** The customer's current open cart, creating one if none exists. */
export async function getOrCreateOpenCart(customerId: string) {
  const existing = await db.query.carts.findFirst({
    where: and(eq(carts.customerId, customerId), eq(carts.status, "open")),
  });
  if (existing) return existing;

  const [created] = await db
    .insert(carts)
    .values({ customerId, status: "open" })
    .returning();
  return created;
}

export type CartView = Awaited<ReturnType<typeof getCartView>>;

/** Full cart with line items, product snapshots, and computed totals. */
export async function getCartView(customerId: string) {
  const cart = await getOrCreateOpenCart(customerId);

  const items = await db.query.cartItems.findMany({
    where: eq(cartItems.cartId, cart.id),
    with: { product: true },
  });

  const lines = items.map((it) => ({
    id: it.id,
    productId: it.productId,
    size: it.size,
    quantity: it.quantity,
    product: {
      id: it.product.id,
      slug: it.product.slug,
      name: it.product.name,
      brand: it.product.brand,
      priceCents: it.product.priceCents,
      imageUrl: it.product.imageUrl,
    },
    lineTotalCents: it.product.priceCents * it.quantity,
  }));

  const subtotalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
  const shippingCents =
    subtotalCents === 0 || subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS
      ? 0
      : SHIPPING_FLAT_CENTS;
  const totalCents = subtotalCents + shippingCents;

  return {
    id: cart.id,
    customerId,
    status: cart.status,
    items: lines,
    itemCount: lines.reduce((n, l) => n + l.quantity, 0),
    subtotalCents,
    shippingCents,
    totalCents,
    currency: "usd",
  };
}
