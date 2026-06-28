import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "./db";
import { customers, type Customer } from "./db/schema";

export const CUSTOMER_COOKIE = "insurance_customer";

/**
 * Resolve the acting customer.
 *
 * Two auth paths, both supported on every API route:
 *  - AI agent:  `Authorization: Bearer <apiToken>`  (machine-to-machine)
 *  - Browser:   `insurance_customer` cookie holding the customer id (set via /account)
 */
export async function customerFromRequest(req: Request): Promise<Customer | null> {
  const header = req.headers.get("authorization");
  if (header?.toLowerCase().startsWith("bearer ")) {
    const token = header.slice(7).trim();
    if (token) {
      const found = await db.query.customers.findFirst({
        where: eq(customers.apiToken, token),
      });
      if (found) return found;
    }
  }
  return customerFromCookie();
}

/** Cookie-based resolution for Server Components and browser API calls. */
export async function customerFromCookie(): Promise<Customer | null> {
  const store = await cookies();
  const id = store.get(CUSTOMER_COOKIE)?.value;
  if (!id) return null;
  const found = await db.query.customers.findFirst({
    where: eq(customers.id, id),
  });
  return found ?? null;
}
