import { formatData, formatPrice } from "./config";
import type {
  AddOn,
  Bill,
  BillItem,
  Device,
  Line,
  Plan,
  Ticket,
} from "./db/schema";

/** 24-month installment price for a full retail price, in cents. */
export const monthlyForPrice = (priceCents: number) => Math.round(priceCents / 24);

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (s: string) => UUID_RE.test(s);

export function planData(p: Pick<Plan, "dataGb">): string {
  return p.dataGb === -1 ? "Unlimited" : `${p.dataGb} GB`;
}

export function serializePlan(p: Plan) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    priceCents: p.priceCents,
    price: formatPrice(p.priceCents),
    data: planData(p),
    dataGb: p.dataGb,
    unlimited: p.dataGb === -1,
    hotspotGb: p.hotspotGb,
    perks: p.perks,
    description: p.description,
  };
}

export function serializeDevice(d: Device) {
  return {
    id: d.id,
    slug: d.slug,
    name: d.name,
    brand: d.brand,
    image: d.imageUrl,
    priceCents: d.priceCents,
    price: formatPrice(d.priceCents),
    monthlyCents: d.monthlyCents,
    monthly: `${formatPrice(d.monthlyCents)}/mo`,
    storage: d.storage,
    storageOptions: d.storageOptions.map((o) => ({
      size: o.size,
      priceCents: o.priceCents,
      price: formatPrice(o.priceCents),
      monthlyCents: monthlyForPrice(o.priceCents),
      monthly: `${formatPrice(monthlyForPrice(o.priceCents))}/mo`,
    })),
    colors: d.colors,
    colorOptions: d.colorOptions,
    specs: d.specs ?? null,
    description: d.description,
  };
}

export function serializeAddOn(a: AddOn) {
  return {
    id: a.id,
    slug: a.slug,
    name: a.name,
    category: a.category,
    priceCents: a.priceCents,
    price: formatPrice(a.priceCents),
    monthly: `${formatPrice(a.priceCents)}/mo`,
    description: a.description,
    icon: a.icon,
    perks: a.perks,
  };
}

export function serializeLine(
  l: Line & { plan: Plan; device: Device | null },
) {
  const limitMb = l.plan.dataGb === -1 ? null : l.plan.dataGb * 1024;
  const overageMb = limitMb !== null && l.dataUsedMb > limitMb ? l.dataUsedMb - limitMb : 0;
  return {
    id: l.id,
    phoneNumber: l.phoneNumber,
    nickname: l.nickname,
    status: l.status,
    plan: serializePlan(l.plan),
    device: l.device ? serializeDevice(l.device) : null,
    usage: {
      usedMb: l.dataUsedMb,
      used: formatData(l.dataUsedMb),
      limitMb,
      limit: limitMb === null ? "Unlimited" : formatData(limitMb),
      percentUsed: limitMb === null ? null : Math.min(100, Math.round((l.dataUsedMb / limitMb) * 100)),
      overageMb,
      overage: overageMb > 0,
    },
    upgradeEligible: l.upgradeEligible,
  };
}

export function serializeBill(b: Bill & { items: (BillItem & { line?: Line | null })[] }) {
  return {
    id: b.id,
    invoiceNumber: b.invoiceNumber,
    status: b.status,
    periodStart: b.periodStart,
    periodEnd: b.periodEnd,
    dueDate: b.dueDate,
    paidAt: b.paidAt,
    subtotalCents: b.subtotalCents,
    taxesCents: b.taxesCents,
    totalCents: b.totalCents,
    subtotal: formatPrice(b.subtotalCents),
    taxes: formatPrice(b.taxesCents),
    total: formatPrice(b.totalCents),
    items: b.items.map((i) => ({
      id: i.id,
      category: i.category,
      description: i.description,
      lineId: i.lineId,
      amountCents: i.amountCents,
      amount: formatPrice(i.amountCents),
    })),
  };
}

export function serializeTicket(t: Ticket) {
  return {
    id: t.id,
    ticketNumber: t.ticketNumber,
    category: t.category,
    subject: t.subject,
    body: t.body,
    status: t.status,
    createdAt: t.createdAt,
  };
}
