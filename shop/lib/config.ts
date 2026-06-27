/**
 * Storefront brand + demo configuration.
 * Change BRAND to re-skin the entire demo store.
 */
export const BRAND = {
  name: "Sole & Stride",
  tagline: "Footwear for every mile",
  /** Currency is fixed to USD for the demo; all prices are stored in integer cents. */
  currency: "usd",
  currencySymbol: "$",
  supportEmail: "support@soleandstride-demo.shop",
};

export function formatPrice(cents: number): string {
  return `${BRAND.currencySymbol}${(cents / 100).toFixed(2)}`;
}

/** Site origin, used for Stripe redirect URLs and absolute links. */
export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}
