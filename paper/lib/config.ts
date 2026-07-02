/**
 * Storefront brand + demo configuration.
 * Change BRAND to re-skin the entire demo store.
 */
export const BRAND = {
  name: "Dunder Mifflin",
  legalName: "Dunder Mifflin Paper Company, Inc.",
  tagline: "Limitless Paper in a Paperless World",
  /** The Scranton branch — the one that matters. */
  location: "Scranton, PA",
  established: "1949",
  /** Currency is fixed to USD for the demo; all prices are stored in integer cents. */
  currency: "usd",
  currencySymbol: "$",
  supportEmail: "sales@dundermifflin-demo.shop",
};

export function formatPrice(cents: number): string {
  return `${BRAND.currencySymbol}${(cents / 100).toFixed(2)}`;
}

/** Site origin, used for checkout redirect URLs and absolute links. */
export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3005")
  );
}
