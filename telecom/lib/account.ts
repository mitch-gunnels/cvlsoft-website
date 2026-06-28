import { and, eq, ilike } from "drizzle-orm";
import { db } from "./db";
import { addOns, lines } from "./db/schema";
import { ApiError } from "./api";
import { isUuid } from "./serializers";

/**
 * Resolve one of the customer's lines by UUID, nickname, or phone number —
 * so an agent can say "Ava's line" or "(555) 123-4567" instead of a UUID.
 */
export async function resolveLine(customerId: string, ref: string) {
  const byId = isUuid(ref) ? eq(lines.id, ref) : ilike(lines.nickname, ref);
  let line = await db.query.lines.findFirst({
    where: and(eq(lines.customerId, customerId), byId),
    with: { plan: true, device: true },
  });
  if (!line && !isUuid(ref)) {
    line = await db.query.lines.findFirst({
      where: and(eq(lines.customerId, customerId), ilike(lines.phoneNumber, `%${ref}%`)),
      with: { plan: true, device: true },
    });
  }
  if (!line) throw new ApiError(404, `Line '${ref}' not found on this account`);
  return line;
}

/** Re-fetch a line with its relations (after a mutation) for serialization. */
export async function lineWithRelations(id: string) {
  const line = await db.query.lines.findFirst({
    where: eq(lines.id, id),
    with: { plan: true, device: true },
  });
  if (!line) throw new ApiError(404, "Line not found");
  return line;
}

/** Resolve an add-on by UUID or slug, or throw 404. */
export async function resolveAddOn(ref: string) {
  const addOn = await db.query.addOns.findFirst({
    where: isUuid(ref) ? eq(addOns.id, ref) : eq(addOns.slug, ref),
  });
  if (!addOn) throw new ApiError(404, `Add-on '${ref}' not found`);
  return addOn;
}
