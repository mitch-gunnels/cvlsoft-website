import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { ApiError, json, parseBody, requireCustomer, route } from "@/lib/api";
import { finalizeOrder } from "@/lib/orders";
import { requireStripe, stripeConfigured } from "@/lib/stripe";
import { serializeOrder } from "@/lib/serializers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ sessionId: z.string().min(1) });

/**
 * POST /api/checkout/confirm
 * Reconciles a Checkout Session straight from Stripe and finalizes the order
 * if paid. Idempotent — used by the success page so the demo works even when
 * no webhook is wired up locally.
 */
export const POST = route(async (req) => {
  const customer = await requireCustomer(req);
  if (!stripeConfigured) throw new ApiError(501, "Stripe is not configured.");

  const { sessionId } = await parseBody(req, schema);
  const stripe = requireStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const orderId = session.client_reference_id ?? session.metadata?.orderId;
  if (!orderId) throw new ApiError(404, "No order linked to that session");

  const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
  if (!order) throw new ApiError(404, "Order not found");
  if (order.customerId !== customer.id) throw new ApiError(403, "Not your order");

  if (session.payment_status === "paid") {
    await finalizeOrder(orderId, {
      paymentIntent:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : undefined,
    });
  }

  const finalized = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: { items: true },
  });

  return json({
    paid: session.payment_status === "paid",
    order: finalized ? serializeOrder(finalized) : null,
  });
});
