import { json, requireCustomer, route } from "@/lib/api";
import { createPaidOrderFromCart } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/checkout
 * Places the customer's cart as a PAID order (demo store — no payment
 * processor), decrements inventory, and empties the cart.
 * Returns { orderId, orderNumber, redirectUrl }.
 */
export const POST = route(async (req) => {
  const customer = await requireCustomer(req);
  const { order } = await createPaidOrderFromCart(customer);
  return json(
    {
      orderId: order.id,
      orderNumber: order.orderNumber,
      redirectUrl: `/checkout/success?order=${order.orderNumber}`,
    },
    { status: 201 },
  );
});
