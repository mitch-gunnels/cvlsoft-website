import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { requireStripe } from "@/lib/stripe";
import { finalizeOrder } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/webhooks/stripe — unauthenticated; integrity comes from the
 * HMAC signature verified against STRIPE_WEBHOOK_SECRET over the RAW body.
 *
 * Local dev:  stripe listen --forward-to localhost:3002/api/webhooks/stripe
 * Prod:       add an endpoint for https://shop.cvlsoft.net/api/webhooks/stripe
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET not configured" },
      { status: 501 },
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const raw = await req.text();
  const stripe = requireStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "invalid signature";
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.client_reference_id ?? session.metadata?.orderId;
    if (orderId && session.payment_status === "paid") {
      await finalizeOrder(orderId, {
        paymentIntent:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : undefined,
      });
    }
  }

  return NextResponse.json({ received: true });
}
