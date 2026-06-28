import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { claims, policies } from "./db/schema";
import { ApiError } from "./api";
import { isUuid } from "./serializers";

/** Resolve one of the customer's policies by UUID or policy number. */
export async function resolvePolicy(customerId: string, ref: string) {
  const policy = await db.query.policies.findFirst({
    where: and(
      eq(policies.customerId, customerId),
      isUuid(ref) ? eq(policies.id, ref) : eq(policies.policyNumber, ref),
    ),
    with: { coverages: true },
  });
  if (!policy) throw new ApiError(404, `Policy '${ref}' not found on this account`);
  return policy;
}

/** Resolve one of the customer's claims by UUID or claim number. */
export async function resolveClaim(customerId: string, ref: string) {
  const claim = await db.query.claims.findFirst({
    where: and(
      eq(claims.customerId, customerId),
      isUuid(ref) ? eq(claims.id, ref) : eq(claims.claimNumber, ref),
    ),
  });
  if (!claim) throw new ApiError(404, `Claim '${ref}' not found`);
  return claim;
}
