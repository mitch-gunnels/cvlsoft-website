/**
 * Brand + demo configuration for the Harbor Insurance demo.
 * Change BRAND to re-skin the whole site.
 */
export const BRAND = {
  name: "Harbor Insurance",
  tagline: "Safe harbor for what matters",
  currency: "usd",
  currencySymbol: "$",
  supportEmail: "care@harbor-demo.net",
  supportPhone: "1-800-HARBOR-1",
};

export function formatPrice(cents: number): string {
  return `${BRAND.currencySymbol}${(cents / 100).toFixed(2)}`;
}

/** Whole-dollar money (premiums, limits) without cents. */
export function formatDollars(cents: number): string {
  return `${BRAND.currencySymbol}${Math.round(cents / 100).toLocaleString()}`;
}

/** Site origin, used for absolute links. */
export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3004")
  );
}
