import { formatDollars, formatPrice } from "./config";
import type { Claim, Coverage, Policy, Quote } from "./db/schema";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (s: string) => UUID_RE.test(s);

export function insuredLabel(p: Pick<Policy, "type" | "insured">): string {
  const i = p.insured || {};
  if (p.type === "auto") return [i.year, i.make, i.model].filter(Boolean).join(" ") || "Vehicle";
  return (i.address as string) || "Property";
}

export function serializeCoverage(c: Coverage) {
  return {
    key: c.key,
    label: c.label,
    limitCents: c.limitCents,
    limit: c.limitCents > 0 ? formatDollars(c.limitCents) : "—",
    deductibleCents: c.deductibleCents,
    deductible: c.deductibleCents > 0 ? formatDollars(c.deductibleCents) : "—",
    included: c.included,
  };
}

export function serializePolicy(p: Policy & { coverages?: Coverage[] }) {
  return {
    id: p.id,
    policyNumber: p.policyNumber,
    type: p.type,
    status: p.status,
    insured: p.insured,
    insuredLabel: insuredLabel(p),
    image: p.imageUrl,
    premiumCents: p.premiumCents,
    premium: `${formatPrice(p.premiumCents)}/mo`,
    deductibleCents: p.deductibleCents,
    deductible: p.deductibleCents > 0 ? formatDollars(p.deductibleCents) : "—",
    effectiveDate: p.effectiveDate,
    renewalDate: p.renewalDate,
    amountDueCents: p.amountDueCents,
    amountDue: formatPrice(p.amountDueCents),
    dueDate: p.dueDate,
    coverages: p.coverages ? p.coverages.map(serializeCoverage) : undefined,
  };
}

export function serializeClaim(c: Claim) {
  return {
    id: c.id,
    claimNumber: c.claimNumber,
    policyId: c.policyId,
    type: c.type,
    status: c.status,
    dateOfLoss: c.dateOfLoss,
    description: c.description,
    estimateCents: c.estimateCents,
    estimate: c.estimateCents > 0 ? formatPrice(c.estimateCents) : "—",
    payoutCents: c.payoutCents,
    payout: c.payoutCents > 0 ? formatPrice(c.payoutCents) : "—",
    photos: c.photos,
    adjuster: c.adjuster,
    createdAt: c.createdAt,
  };
}

export function serializeQuote(q: Quote) {
  return {
    id: q.id,
    quoteNumber: q.quoteNumber,
    type: q.type,
    inputs: q.inputs,
    monthlyCents: q.monthlyCents,
    monthly: `${formatPrice(q.monthlyCents)}/mo`,
    coverageSummary: q.coverageSummary,
    createdAt: q.createdAt,
  };
}
