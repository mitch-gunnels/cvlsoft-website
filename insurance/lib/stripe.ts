import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

/**
 * Stripe is optional in local/dev: if no key is configured the checkout route
 * returns a clear 501 instead of crashing the whole app at import time.
 */
export const stripe = key ? new Stripe(key) : null;

export function requireStripe(): Stripe {
  if (!stripe) {
    throw new Error(
      "Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local (use your new test-account key, sk_test_...).",
    );
  }
  return stripe;
}

export const stripeConfigured = Boolean(key);
