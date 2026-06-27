/**
 * Brand + demo configuration for the Beacon Mobile telecom demo.
 * Change BRAND to re-skin the whole portal.
 */
export const BRAND = {
  name: "Beacon Mobile",
  tagline: "Wireless that just works",
  currency: "usd",
  currencySymbol: "$",
  supportEmail: "care@beacon-demo.net",
  supportPhone: "1-800-BEACON-1",
};

export function formatPrice(cents: number): string {
  return `${BRAND.currencySymbol}${(cents / 100).toFixed(2)}`;
}

/** Human data size from megabytes. */
export function formatData(mb: number): string {
  if (mb >= 1024) {
    const gb = mb / 1024;
    return `${gb.toFixed(Number.isInteger(gb) ? 0 : 1)} GB`;
  }
  return `${mb} MB`;
}

/** Site origin, used for absolute links. */
export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3003")
  );
}
