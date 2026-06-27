import "../load-env";
import { db } from "./index";
import {
  billItems,
  bills,
  customers,
  devices,
  lines,
  networkAreas,
  plans,
  tickets,
} from "./schema";
import { invoiceNumber, phoneNumber, ticketNumber } from "../ids";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`;

const PLANS = [
  { slug: "essentials", name: "Essentials", priceCents: 3500, dataGb: 5, hotspotGb: 0, perks: ["5G access", "Unlimited talk & text"], description: "A simple plan for light data users." },
  { slug: "standard", name: "Standard", priceCents: 5000, dataGb: 20, hotspotGb: 5, perks: ["5G access", "20 GB high-speed data", "5 GB hotspot"], description: "Plenty of data for everyday use." },
  { slug: "unlimited", name: "Unlimited", priceCents: 6500, dataGb: -1, hotspotGb: 15, perks: ["Unlimited 5G data", "15 GB hotspot", "HD streaming"], description: "Unlimited data with no overage charges." },
  { slug: "unlimited-plus", name: "Unlimited+", priceCents: 8500, dataGb: -1, hotspotGb: 50, perks: ["Unlimited premium 5G", "50 GB hotspot", "4K streaming", "Intl. roaming", "Streaming bundle included"], description: "Our top plan with the most hotspot and perks." },
];

const DEVICES = [
  { slug: "aurora-x", name: "Aurora X", brand: "Aurora", imgId: "1592750475338-74b7b21085ab", priceCents: 99900, storage: "256 GB", colors: ["Midnight", "Silver", "Sky"], description: "Flagship 6.7\" OLED, triple camera, all-day battery." },
  { slug: "aurora-x-pro", name: "Aurora X Pro", brand: "Aurora", imgId: "1574944985070-8f3ebc6b79d2", priceCents: 119900, storage: "512 GB", colors: ["Graphite", "Gold"], description: "Pro-grade cameras and the fastest Aurora chip yet." },
  { slug: "nova-5", name: "Nova 5", brand: "Nova", imgId: "1580910051074-3eb694886505", priceCents: 69900, storage: "128 GB", colors: ["Black", "Mint", "Coral"], description: "Balanced mid-range with a bright 120 Hz display." },
  { slug: "nova-5-lite", name: "Nova 5 Lite", brand: "Nova", imgId: "1605236453806-6ff36851218e", priceCents: 49900, storage: "128 GB", colors: ["Black", "Blue"], description: "Great everyday phone at a friendly price." },
  { slug: "pulse-a", name: "Pulse A", brand: "Pulse", imgId: "1567581935884-3349723552ca", priceCents: 39900, storage: "64 GB", colors: ["Slate", "White"], description: "Reliable budget 5G for the essentials." },
  { slug: "zenith-fold", name: "Zenith Fold", brand: "Zenith", imgId: "1610945265064-0e34e5519bbf", priceCents: 159900, storage: "512 GB", colors: ["Obsidian"], description: "Foldable flagship with a tablet-sized inner screen." },
];

const CUSTOMERS = [
  { name: "Ava Chen", email: "ava@example.com", apiToken: "bm_tok_ava", zip: "97201" },
  { name: "Marcus Lee", email: "marcus@example.com", apiToken: "bm_tok_marcus", zip: "73301" },
  { name: "Priya Patel", email: "priya@example.com", apiToken: "bm_tok_priya", zip: "94016" },
];

const NETWORK = [
  { zip: "97201", city: "Portland", state: "OR", status: "operational", note: "" },
  { zip: "10001", city: "New York", state: "NY", status: "operational", note: "" },
  { zip: "94016", city: "San Francisco", state: "CA", status: "degraded", note: "Elevated latency in your area; crews are investigating." },
  { zip: "73301", city: "Austin", state: "TX", status: "outage", note: "Service interruption affecting voice & data. Estimated restoration: ~3 hours." },
];

const monthly = (full: number) => Math.round(full / 24);
const daysAgo = (now: number, d: number) => new Date(now - d * 86400000);
const daysFromNow = (now: number, d: number) => new Date(now + d * 86400000);

async function main() {
  console.log("⏳ Seeding Beacon Mobile demo…");

  await db.delete(billItems);
  await db.delete(bills);
  await db.delete(tickets);
  await db.delete(lines);
  await db.delete(networkAreas);
  await db.delete(devices);
  await db.delete(plans);
  await db.delete(customers);

  const now = Date.now();

  const insPlans = await db.insert(plans).values(PLANS).returning();
  const planBy = new Map(insPlans.map((p) => [p.slug, p]));

  const insDevices = await db
    .insert(devices)
    .values(DEVICES.map(({ imgId, ...d }) => ({ ...d, imageUrl: img(imgId), monthlyCents: monthly(d.priceCents) })))
    .returning();
  const devBy = new Map(insDevices.map((d) => [d.slug, d]));

  const insCustomers = await db
    .insert(customers)
    .values(CUSTOMERS.map((c) => ({ ...c, accountNumber: `BM-${String(10010001 + insIndex(c))}` })))
    .returning();
  const custBy = new Map(insCustomers.map((c) => [c.email, c]));

  await db.insert(networkAreas).values(NETWORK);

  /* ---- Ava: 3 lines, one with a data overage, upgrade-eligible main line ---- */
  const ava = custBy.get("ava@example.com")!;
  const avaLines = await db
    .insert(lines)
    .values([
      { customerId: ava.id, phoneNumber: phoneNumber(), nickname: "Ava", planId: planBy.get("standard")!.id, deviceId: devBy.get("aurora-x")!.id, dataUsedMb: 23552, upgradeEligible: true },
      { customerId: ava.id, phoneNumber: phoneNumber(), nickname: "Jordan", planId: planBy.get("standard")!.id, deviceId: devBy.get("nova-5")!.id, dataUsedMb: 14336, upgradeEligible: false },
      { customerId: ava.id, phoneNumber: phoneNumber(), nickname: "Sam", planId: planBy.get("essentials")!.id, deviceId: devBy.get("pulse-a")!.id, dataUsedMb: 4608, upgradeEligible: false },
    ])
    .returning();

  // Current (due) bill — higher than usual because of a 3 GB overage on Ava's line.
  await createBill(ava.id, {
    invoice: invoiceNumber(),
    periodStart: daysAgo(now, 5),
    periodEnd: daysFromNow(now, 25),
    dueDate: daysFromNow(now, 20),
    status: "due",
    taxesCents: 1300,
    items: [
      { category: "plan", description: "Standard plan — Ava", amountCents: 5000, lineId: avaLines[0].id },
      { category: "plan", description: "Standard plan — Jordan", amountCents: 5000, lineId: avaLines[1].id },
      { category: "plan", description: "Essentials plan — Sam", amountCents: 3500, lineId: avaLines[2].id },
      { category: "device", description: "Aurora X installment (1 of 24) — Ava", amountCents: monthly(99900), lineId: avaLines[0].id },
      { category: "device", description: "Nova 5 installment (8 of 24) — Jordan", amountCents: monthly(69900), lineId: avaLines[1].id },
      { category: "overage", description: "Data overage: 3 GB @ $10/GB — Ava", amountCents: 3000, lineId: avaLines[0].id },
      { category: "fee", description: "Regulatory & admin fees", amountCents: 500, lineId: null },
    ],
  });

  // Prior (paid) bill — no overage, for comparison.
  await createBill(ava.id, {
    invoice: invoiceNumber(),
    periodStart: daysAgo(now, 35),
    periodEnd: daysAgo(now, 5),
    dueDate: daysAgo(now, 10),
    status: "paid",
    paidAt: daysAgo(now, 12),
    taxesCents: 1300,
    items: [
      { category: "plan", description: "Standard plan — Ava", amountCents: 5000, lineId: avaLines[0].id },
      { category: "plan", description: "Standard plan — Jordan", amountCents: 5000, lineId: avaLines[1].id },
      { category: "plan", description: "Essentials plan — Sam", amountCents: 3500, lineId: avaLines[2].id },
      { category: "device", description: "Nova 5 installment (7 of 24) — Jordan", amountCents: monthly(69900), lineId: avaLines[1].id },
      { category: "fee", description: "Regulatory & admin fees", amountCents: 500, lineId: null },
    ],
  });

  await db.insert(tickets).values({
    customerId: ava.id,
    ticketNumber: ticketNumber(),
    category: "network",
    subject: "Dropped calls downtown",
    body: "Calls drop near the office around lunchtime.",
    status: "open",
  });

  /* ---- Marcus: 1 line, unlimited, due bill (in an outage area) ---- */
  const marcus = custBy.get("marcus@example.com")!;
  const mLines = await db
    .insert(lines)
    .values([
      { customerId: marcus.id, phoneNumber: phoneNumber(), nickname: "Marcus", planId: planBy.get("unlimited")!.id, deviceId: devBy.get("aurora-x-pro")!.id, dataUsedMb: 61440, upgradeEligible: false },
    ])
    .returning();
  await createBill(marcus.id, {
    invoice: invoiceNumber(),
    periodStart: daysAgo(now, 3),
    periodEnd: daysFromNow(now, 27),
    dueDate: daysFromNow(now, 22),
    status: "due",
    taxesCents: 900,
    items: [
      { category: "plan", description: "Unlimited plan — Marcus", amountCents: 6500, lineId: mLines[0].id },
      { category: "device", description: "Aurora X Pro installment (3 of 24)", amountCents: monthly(119900), lineId: mLines[0].id },
      { category: "fee", description: "Regulatory & admin fees", amountCents: 500, lineId: null },
    ],
  });

  /* ---- Priya: 2 lines, paid bill ---- */
  const priya = custBy.get("priya@example.com")!;
  const pLines = await db
    .insert(lines)
    .values([
      { customerId: priya.id, phoneNumber: phoneNumber(), nickname: "Priya", planId: planBy.get("unlimited-plus")!.id, deviceId: devBy.get("zenith-fold")!.id, dataUsedMb: 88064, upgradeEligible: true },
      { customerId: priya.id, phoneNumber: phoneNumber(), nickname: "Dev", planId: planBy.get("essentials")!.id, deviceId: devBy.get("nova-5-lite")!.id, dataUsedMb: 3072, upgradeEligible: false },
    ])
    .returning();
  await createBill(priya.id, {
    invoice: invoiceNumber(),
    periodStart: daysAgo(now, 2),
    periodEnd: daysFromNow(now, 28),
    dueDate: daysFromNow(now, 23),
    status: "due",
    taxesCents: 1100,
    items: [
      { category: "plan", description: "Unlimited+ plan — Priya", amountCents: 8500, lineId: pLines[0].id },
      { category: "plan", description: "Essentials plan — Dev", amountCents: 3500, lineId: pLines[1].id },
      { category: "device", description: "Zenith Fold installment (5 of 24)", amountCents: monthly(159900), lineId: pLines[0].id },
      { category: "fee", description: "Regulatory & admin fees", amountCents: 500, lineId: null },
    ],
  });

  console.log("✅ Seed complete.\n");
  console.log(`   Plans: ${insPlans.length}  Devices: ${insDevices.length}  Customers: ${insCustomers.length}`);
  console.log(`   Network areas: ${NETWORK.length} (Austin 73301 = outage)\n`);
  console.log("   AI-agent bearer tokens (Authorization: Bearer <token>):");
  for (const c of insCustomers) console.log(`     • ${c.name.padEnd(12)} ${c.apiToken}  (acct ${c.accountNumber}, zip ${c.zip})`);
  console.log("");
}

/** Stable account-number index from the seed list order. */
function insIndex(c: { email: string }) {
  return CUSTOMERS.findIndex((x) => x.email === c.email);
}

async function createBill(
  customerId: string,
  opts: {
    invoice: string;
    periodStart: Date;
    periodEnd: Date;
    dueDate: Date;
    status: string;
    paidAt?: Date;
    taxesCents: number;
    items: { category: string; description: string; amountCents: number; lineId: string | null }[];
  },
) {
  const subtotal = opts.items.reduce((s, i) => s + i.amountCents, 0);
  const total = subtotal + opts.taxesCents;
  const [bill] = await db
    .insert(bills)
    .values({
      customerId,
      invoiceNumber: opts.invoice,
      periodStart: opts.periodStart,
      periodEnd: opts.periodEnd,
      dueDate: opts.dueDate,
      status: opts.status,
      paidAt: opts.paidAt ?? null,
      subtotalCents: subtotal,
      taxesCents: opts.taxesCents,
      totalCents: total,
    })
    .returning();
  await db.insert(billItems).values(opts.items.map((i) => ({ ...i, billId: bill.id })));
  return bill;
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
