import { eq } from "drizzle-orm";
import { db } from "./db";
import { carts, orderItems, orders, products } from "./db/schema";
import { getCartView } from "./cart";
import { ApiError } from "./api";
import { orderNumber } from "./ids";
import type { Customer } from "./db/schema";

/**
 * Create a `pending` order (plus snapshotted line items) from the customer's
 * open cart. Does NOT touch inventory or the cart — that happens on payment
 * confirmation in {@link finalizeOrder}.
 */
export async function createPendingOrderFromCart(customer: Customer) {
  const cart = await getCartView(customer.id);
  if (cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber: orderNumber(),
      customerId: customer.id,
      status: "pending",
      subtotalCents: cart.subtotalCents,
      shippingCents: cart.shippingCents,
      totalCents: cart.totalCents,
      currency: cart.currency,
    })
    .returning();

  await db.insert(orderItems).values(
    cart.items.map((l) => ({
      orderId: order.id,
      productId: l.productId,
      nameSnapshot: l.product.name,
      size: l.size,
      priceCents: l.product.priceCents,
      quantity: l.quantity,
    })),
  );

  return { order, cart };
}

/**
 * Mark an order paid exactly once. Idempotent: safe to call from both the
 * Stripe webhook and the success-page reconcile. On first transition it
 * decrements inventory and converts the cart.
 */
export async function finalizeOrder(
  orderId: string,
  opts: { paymentIntent?: string } = {},
) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: { items: true },
  });
  if (!order) throw new ApiError(404, "Order not found");
  if (order.status === "paid" || order.status === "fulfilled") return order;

  // Decrement per-size and total inventory for each line (floored at 0).
  for (const item of order.items) {
    const product = await db.query.products.findFirst({
      where: eq(products.id, item.productId),
    });
    if (!product) continue;
    const sizeStock = { ...product.sizeStock };
    if (item.size && sizeStock[item.size] != null) {
      sizeStock[item.size] = Math.max(0, sizeStock[item.size] - item.quantity);
    }
    await db
      .update(products)
      .set({
        sizeStock,
        inventory: Math.max(0, product.inventory - item.quantity),
      })
      .where(eq(products.id, item.productId));
  }

  // Convert the customer's open cart so a fresh one is created next visit.
  await db
    .update(carts)
    .set({ status: "converted", updatedAt: new Date() })
    .where(eq(carts.customerId, order.customerId));

  const [updated] = await db
    .update(orders)
    .set({
      status: "paid",
      stripePaymentIntent: opts.paymentIntent ?? order.stripePaymentIntent,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning();

  return updated;
}
