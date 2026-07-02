import { eq } from "drizzle-orm";
import { db } from "./db";
import { carts, orderItems, orders, products } from "./db/schema";
import { getCartView } from "./cart";
import { ApiError } from "./api";
import { orderNumber } from "./ids";
import type { Customer } from "./db/schema";

/**
 * Create a PAID order from the customer's open cart in a single step — this
 * demo store has no real payment processor. Snapshots the line items,
 * decrements per-format and total inventory, and converts the cart so a fresh
 * one starts on the next visit.
 */
export async function createPaidOrderFromCart(customer: Customer) {
  const cart = await getCartView(customer.id);
  if (cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber: orderNumber(),
      customerId: customer.id,
      status: "paid",
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

  // Decrement per-format and total inventory for each line (floored at 0).
  for (const l of cart.items) {
    const product = await db.query.products.findFirst({
      where: eq(products.id, l.productId),
    });
    if (!product) continue;
    const sizeStock = { ...product.sizeStock };
    if (l.size && sizeStock[l.size] != null) {
      sizeStock[l.size] = Math.max(0, sizeStock[l.size] - l.quantity);
    }
    await db
      .update(products)
      .set({
        sizeStock,
        inventory: Math.max(0, product.inventory - l.quantity),
      })
      .where(eq(products.id, l.productId));
  }

  // Convert the customer's open cart so a fresh one is created next visit.
  await db
    .update(carts)
    .set({ status: "converted", updatedAt: new Date() })
    .where(eq(carts.customerId, customer.id));

  return { order, cart };
}
