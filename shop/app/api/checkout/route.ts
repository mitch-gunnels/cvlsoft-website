import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { ApiError, json, requireCustomer, route } from "@/lib/api";
import { getCartView } from "@/lib/cart";
import { createPendingOrderFromCart } from "@/lib/orders";
import { requireStripe, stripeConfigured } from "@/lib/stripe";
import { siteUrl } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/checkout
 * Creates a pending order from the cart and a Stripe Checkout Session.
 * Returns { checkoutUrl, orderId, orderNumber } — redirect the buyer there.
 */
export const POST = route(async (req) => {
  const customer = await requireCustomer(req);

  if (!stripeConfigured) {
    throw new ApiError(
      501,
      "Stripe is not configured. Set STRIPE_SECRET_KEY (sk_test_...) from your test account in .env.local.",
    );
  }

  const cart = await getCartView(customer.id);
  if (cart.items.length === 0) throw new ApiError(400, "Cart is empty");

  const { order } = await createPendingOrderFromCart(customer);
  const stripe = requireStripe();
  const base = siteUrl();

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    cart.items.map((l) => ({
      quantity: l.quantity,
      price_data: {
        currency: cart.currency,
        unit_amount: l.product.priceCents,
        product_data: {
          name: l.product.name,
          images: l.product.imageUrl ? [l.product.imageUrl] : undefined,
        },
      },
    }));

  if (cart.shippingCents > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: cart.currency,
        unit_amount: cart.shippingCents,
        product_data: { name: "Shipping", images: undefined },
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    customer_email: customer.email,
    client_reference_id: order.id,
    metadata: { orderId: order.id, orderNumber: order.orderNumber },
    success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/cart?canceled=1`,
  });

  await db
    .update(orders)
    .set({ stripeSessionId: session.id })
    .where(eq(orders.id, order.id));

  return json({
    checkoutUrl: session.url,
    orderId: order.id,
    orderNumber: order.orderNumber,
  });
});
