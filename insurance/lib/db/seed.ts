import "../load-env";
import { db } from "./index";
import { claims, coverages, customers, policies, policyRiders, quotes } from "./schema";
import { claimNumber, policyNumber } from "../ids";
import { riderBySlug } from "../catalog";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1000&q=80&auto=format&fit=crop`;

const CAR = {
  camaro: img("1552519507-da3b142c6e3d"),
  audi: img("1606664515524-ed2f786a0bd6"),
  fiat: img("1549317661-bd32c8ce0db2"),
  sedan: img("1503376780353-7e6692767b70"),
};
const HOME = {
  craftsman: img("1570129477492-45c003edd2be"),
};

const CUSTOMERS = [
  { name: "Ava Chen", email: "ava@example.com", apiToken: "hb_tok_ava", addressLine1: "742 Evergreen Terrace", city: "Portland", state: "OR", zip: "97201" },
  { name: "Marcus Lee", email: "marcus@example.com", apiToken: "hb_tok_marcus", addressLine1: "88 Harbor View Rd", city: "Austin", state: "TX", zip: "73301" },
  { name: "Priya Patel", email: "priya@example.com", apiToken: "hb_tok_priya", addressLine1: "120 Market St #4B", city: "San Francisco", state: "CA", zip: "94016" },
];

const day = 86400000;

async function main() {
  console.log("⏳ Seeding Harbor Insurance demo…");
  await db.delete(claims);
  await db.delete(coverages);
  await db.delete(policyRiders);
  await db.delete(quotes);
  await db.delete(policies);
  await db.delete(customers);

  const now = Date.now();
  const insCustomers = await db
    .insert(customers)
    .values(CUSTOMERS.map((c, i) => ({ ...c, accountNumber: `HB-${10010001 + i}` })))
    .returning();
  const [ava, marcus, priya] = insCustomers;

  async function createPolicy(
    p: {
      customerId: string;
      type: string;
      premiumCents: number;
      deductibleCents: number;
      insured: Record<string, string | number>;
      imageUrl: string;
      amountDueCents?: number;
      dueInDays?: number;
    },
    covs: { key: string; label: string; limitCents: number; deductibleCents?: number }[],
  ) {
    const [policy] = await db
      .insert(policies)
      .values({
        customerId: p.customerId,
        policyNumber: policyNumber(),
        type: p.type,
        status: "active",
        premiumCents: p.premiumCents,
        deductibleCents: p.deductibleCents,
        insured: p.insured,
        imageUrl: p.imageUrl,
        effectiveDate: new Date(now - 150 * day),
        renewalDate: new Date(now + 210 * day),
        amountDueCents: p.amountDueCents ?? 0,
        dueDate: p.dueInDays ? new Date(now + p.dueInDays * day) : null,
      })
      .returning();
    await db.insert(coverages).values(
      covs.map((c) => ({
        policyId: policy.id,
        key: c.key,
        label: c.label,
        limitCents: c.limitCents,
        deductibleCents: c.deductibleCents ?? 0,
      })),
    );
    return policy;
  }

  // ── Ava: auto (with an in-review collision claim) + home ──
  const avaAuto = await createPolicy(
    { customerId: ava.id, type: "auto", premiumCents: 14200, deductibleCents: 50000, imageUrl: CAR.camaro, amountDueCents: 14200, dueInDays: 12, insured: { year: 2021, make: "Chevrolet", model: "Camaro", trim: "LT", vin: "1G1FB1RS3M0123456" } },
    [
      { key: "liability", label: "Bodily injury & property damage", limitCents: 10000000 },
      { key: "collision", label: "Collision", limitCents: 0, deductibleCents: 50000 },
      { key: "comprehensive", label: "Comprehensive", limitCents: 0, deductibleCents: 50000 },
      { key: "uninsured_motorist", label: "Uninsured motorist", limitCents: 5000000 },
      { key: "roadside", label: "Roadside assistance", limitCents: 0 },
    ],
  );
  const avaHome = await createPolicy(
    { customerId: ava.id, type: "home", premiumCents: 9800, deductibleCents: 100000, imageUrl: HOME.craftsman, insured: { address: "742 Evergreen Terrace, Portland, OR 97201", yearBuilt: 1998, sqft: 2150 } },
    [
      { key: "dwelling", label: "Dwelling", limitCents: 35000000 },
      { key: "personal_property", label: "Personal property", limitCents: 17500000 },
      { key: "liability_home", label: "Personal liability", limitCents: 30000000 },
      { key: "loss_of_use", label: "Loss of use", limitCents: 7000000 },
    ],
  );
  await db.insert(claims).values({
    customerId: ava.id,
    policyId: avaAuto.id,
    claimNumber: claimNumber(),
    type: "collision",
    status: "in_review",
    dateOfLoss: new Date(now - 9 * day),
    description: "Rear-ended at a stoplight on SW 5th Ave. Bumper and trunk damage; car is drivable.",
    estimateCents: 420000,
    photos: [CAR.camaro, CAR.sedan],
    adjuster: "J. Rivera",
  });

  // ── Marcus: auto with a paid glass claim ──
  const marcusAuto = await createPolicy(
    { customerId: marcus.id, type: "auto", premiumCents: 16800, deductibleCents: 50000, imageUrl: CAR.audi, amountDueCents: 16800, dueInDays: 6, insured: { year: 2022, make: "Audi", model: "A6", trim: "Premium", vin: "WAUL2AF24NN045678" } },
    [
      { key: "liability", label: "Bodily injury & property damage", limitCents: 25000000 },
      { key: "collision", label: "Collision", limitCents: 0, deductibleCents: 50000 },
      { key: "comprehensive", label: "Comprehensive", limitCents: 0, deductibleCents: 25000 },
      { key: "uninsured_motorist", label: "Uninsured motorist", limitCents: 10000000 },
    ],
  );
  await db.insert(claims).values({
    customerId: marcus.id,
    policyId: marcusAuto.id,
    claimNumber: claimNumber(),
    type: "glass",
    status: "paid",
    dateOfLoss: new Date(now - 65 * day),
    description: "Windshield cracked by road debris on I-35.",
    estimateCents: 45000,
    payoutCents: 38000,
    photos: [CAR.audi],
    adjuster: "M. Okafor",
  });

  // ── Priya: auto, no claims ──
  await createPolicy(
    { customerId: priya.id, type: "auto", premiumCents: 8900, deductibleCents: 100000, imageUrl: CAR.fiat, insured: { year: 2019, make: "Fiat", model: "500", trim: "Pop", vin: "3C3CFFAR9KT012345" } },
    [
      { key: "liability", label: "Bodily injury & property damage", limitCents: 5000000 },
      { key: "comprehensive", label: "Comprehensive", limitCents: 0, deductibleCents: 100000 },
      { key: "uninsured_motorist", label: "Uninsured motorist", limitCents: 5000000 },
    ],
  );

  // ── Riders / endorsements on existing policies ──
  const addRiders = async (policyId: string, slugs: string[]) => {
    await db.insert(policyRiders).values(
      slugs.map((slug) => {
        const r = riderBySlug(slug)!;
        return { policyId, riderSlug: r.slug, label: r.name, priceCents: r.priceCents };
      }),
    );
  };
  await addRiders(avaAuto.id, ["roadside", "accident-forgiveness"]);
  await addRiders(avaHome.id, ["water-backup", "scheduled-jewelry"]);
  await addRiders(marcusAuto.id, ["rental-reimbursement"]);

  console.log("✅ Seed complete.\n");
  console.log(`   Customers: ${insCustomers.length}  (Ava: auto+home w/ open claim + riders; Marcus: auto w/ paid claim; Priya: auto)`);
  console.log("   AI-agent bearer tokens (Authorization: Bearer <token>):");
  for (const c of insCustomers) console.log(`     • ${c.name.padEnd(12)} ${c.apiToken}  (acct ${c.accountNumber})`);
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
