import "../load-env";
import { db } from "./index";
import {
  addOns,
  billItems,
  bills,
  customers,
  devices,
  lineAddOns,
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

type SeedStorage = { size: string; priceCents: number };
type SeedColor = { name: string; hex: string };
type SeedSpecs = { display: string; chip: string; camera: string; battery: string; charging: string; water: string; os: string };
type SeedDevice = {
  slug: string; name: string; brand: string; imgId: string; description: string;
  storageOptions: SeedStorage[]; colorOptions: SeedColor[]; specs: SeedSpecs;
};

const DEVICES: SeedDevice[] = [
  {
    slug: "aurora-x", name: "Aurora X", brand: "Aurora", imgId: "1592750475338-74b7b21085ab",
    description: "Our flagship: a brilliant 6.7\" OLED, a pro triple camera, and all-day battery.",
    storageOptions: [{ size: "256 GB", priceCents: 99900 }, { size: "512 GB", priceCents: 109900 }, { size: "1 TB", priceCents: 129900 }],
    colorOptions: [{ name: "Midnight", hex: "#1c1c2e" }, { name: "Silver", hex: "#d8dadf" }, { name: "Sky", hex: "#8fb7d9" }],
    specs: { display: "6.7\" OLED · 120 Hz", chip: "Aurora A18", camera: "Triple 50 MP", battery: "4,600 mAh", charging: "45 W wired · wireless", water: "IP68", os: "AuroraOS 18" },
  },
  {
    slug: "aurora-x-pro", name: "Aurora X Pro", brand: "Aurora", imgId: "1574944985070-8f3ebc6b79d2",
    description: "Pro-grade cameras with a 5× telephoto and the fastest Aurora chip yet.",
    storageOptions: [{ size: "512 GB", priceCents: 119900 }, { size: "1 TB", priceCents: 139900 }],
    colorOptions: [{ name: "Graphite", hex: "#3a3a3c" }, { name: "Gold", hex: "#e3c98f" }],
    specs: { display: "6.9\" OLED · 120 Hz", chip: "Aurora A18 Pro", camera: "Quad 50 MP · 5× tele", battery: "5,000 mAh", charging: "65 W wired · wireless", water: "IP68", os: "AuroraOS 18" },
  },
  {
    slug: "aurora-air", name: "Aurora Air", brand: "Aurora", imgId: "1592899677977-9c10ca588bbd",
    description: "Our thinnest, lightest flagship — premium materials in an impossibly slim frame.",
    storageOptions: [{ size: "256 GB", priceCents: 89900 }, { size: "512 GB", priceCents: 99900 }],
    colorOptions: [{ name: "Cloud", hex: "#eef1f4" }, { name: "Titanium", hex: "#8e8e93" }],
    specs: { display: "6.5\" OLED · 120 Hz", chip: "Aurora A17", camera: "Dual 48 MP", battery: "4,200 mAh", charging: "45 W wired · wireless", water: "IP68", os: "AuroraOS 18" },
  },
  {
    slug: "aurora-x-mini", name: "Aurora X Mini", brand: "Aurora", imgId: "1511707171634-5f897ff02aa9",
    description: "Flagship power in a one-hand size — the full Aurora experience, compact.",
    storageOptions: [{ size: "128 GB", priceCents: 74900 }, { size: "256 GB", priceCents: 84900 }],
    colorOptions: [{ name: "Midnight", hex: "#1c1c2e" }, { name: "Coral", hex: "#ff6f61" }, { name: "Sky", hex: "#8fb7d9" }],
    specs: { display: "6.1\" OLED · 120 Hz", chip: "Aurora A18", camera: "Dual 48 MP", battery: "3,800 mAh", charging: "30 W wired · wireless", water: "IP68", os: "AuroraOS 18" },
  },
  {
    slug: "nova-7-pro", name: "Nova 7 Pro", brand: "Nova", imgId: "1533228100845-08145b01de14",
    description: "Mid-premium done right: a big AMOLED, fast charging, and a versatile triple camera.",
    storageOptions: [{ size: "256 GB", priceCents: 79900 }, { size: "512 GB", priceCents: 89900 }],
    colorOptions: [{ name: "Onyx", hex: "#23272a" }, { name: "Forest", hex: "#2f5d50" }, { name: "Lilac", hex: "#b6a6e0" }],
    specs: { display: "6.6\" AMOLED · 120 Hz", chip: "Nova Tensor 7", camera: "Triple 50 MP", battery: "5,000 mAh", charging: "67 W wired", water: "IP67", os: "NovaOS 7" },
  },
  {
    slug: "nova-5", name: "Nova 5", brand: "Nova", imgId: "1580910051074-3eb694886505",
    description: "A balanced everyday phone with a bright 120 Hz display and dependable cameras.",
    storageOptions: [{ size: "128 GB", priceCents: 69900 }, { size: "256 GB", priceCents: 77900 }],
    colorOptions: [{ name: "Black", hex: "#1a1a1a" }, { name: "Mint", hex: "#b8e0d2" }, { name: "Coral", hex: "#ff8a7a" }],
    specs: { display: "6.4\" AMOLED · 120 Hz", chip: "Nova Tensor 5", camera: "Triple 48 MP", battery: "4,800 mAh", charging: "33 W wired", water: "IP67", os: "NovaOS 7" },
  },
  {
    slug: "nova-5-lite", name: "Nova 5 Lite", brand: "Nova", imgId: "1605236453806-6ff36851218e",
    description: "A great-value everyday phone with a big battery that lasts.",
    storageOptions: [{ size: "128 GB", priceCents: 49900 }, { size: "256 GB", priceCents: 55900 }],
    colorOptions: [{ name: "Black", hex: "#1a1a1a" }, { name: "Blue", hex: "#3b6fb0" }],
    specs: { display: "6.5\" LCD · 90 Hz", chip: "Nova Tensor 5 Lite", camera: "Dual 48 MP", battery: "5,000 mAh", charging: "25 W wired", water: "IP54", os: "NovaOS 7" },
  },
  {
    slug: "pulse-x", name: "Pulse X", brand: "Pulse", imgId: "1512054502232-10a0a035d672",
    description: "More phone than its price suggests — vivid AMOLED and a 50 MP main camera.",
    storageOptions: [{ size: "128 GB", priceCents: 54900 }, { size: "256 GB", priceCents: 60900 }],
    colorOptions: [{ name: "Slate", hex: "#4a4f57" }, { name: "Violet", hex: "#7c6fb0" }],
    specs: { display: "6.5\" AMOLED · 90 Hz", chip: "Pulse P9", camera: "Dual 50 MP", battery: "5,000 mAh", charging: "33 W wired", water: "IP54", os: "PulseOS 4" },
  },
  {
    slug: "pulse-a", name: "Pulse A", brand: "Pulse", imgId: "1567581935884-3349723552ca",
    description: "Reliable budget 5G for the essentials — calls, texts, and everyday apps.",
    storageOptions: [{ size: "64 GB", priceCents: 39900 }, { size: "128 GB", priceCents: 44900 }],
    colorOptions: [{ name: "Slate", hex: "#4a4f57" }, { name: "White", hex: "#f2f3f5" }],
    specs: { display: "6.3\" LCD · 90 Hz", chip: "Pulse P7", camera: "Dual 48 MP", battery: "5,000 mAh", charging: "18 W wired", water: "IP54", os: "PulseOS 4" },
  },
  {
    slug: "pulse-go", name: "Pulse Go", brand: "Pulse", imgId: "1530319067432-f2a729c03db5",
    description: "Simple, dependable, and easy on the wallet — a great first 5G phone.",
    storageOptions: [{ size: "64 GB", priceCents: 29900 }, { size: "128 GB", priceCents: 33900 }],
    colorOptions: [{ name: "Charcoal", hex: "#2e2e2e" }, { name: "Sand", hex: "#d9c7a3" }],
    specs: { display: "6.1\" LCD · 60 Hz", chip: "Pulse P5", camera: "Single 13 MP", battery: "4,500 mAh", charging: "15 W wired", water: "Splash resistant", os: "PulseOS 4" },
  },
  {
    slug: "zenith-fold", name: "Zenith Fold", brand: "Zenith", imgId: "1610945265064-0e34e5519bbf",
    description: "A foldable flagship that opens into a tablet-sized inner screen.",
    storageOptions: [{ size: "512 GB", priceCents: 159900 }, { size: "1 TB", priceCents: 179900 }],
    colorOptions: [{ name: "Obsidian", hex: "#15151a" }, { name: "Pearl", hex: "#ecebe7" }],
    specs: { display: "7.6\" inner OLED + 6.2\" cover", chip: "Zenith Z3", camera: "Triple 50 MP", battery: "4,700 mAh", charging: "50 W wired · wireless", water: "IPX8", os: "ZenithOS 3" },
  },
  {
    slug: "zenith-flip", name: "Zenith Flip", brand: "Zenith", imgId: "1601784551446-20c9e07cdbdb",
    description: "A pocketable clamshell foldable with a handy cover display.",
    storageOptions: [{ size: "256 GB", priceCents: 99900 }, { size: "512 GB", priceCents: 109900 }],
    colorOptions: [{ name: "Rose", hex: "#e8b4c0" }, { name: "Graphite", hex: "#3a3a3c" }, { name: "Mint", hex: "#b8e0d2" }],
    specs: { display: "6.7\" inner OLED + 3.4\" cover", chip: "Zenith Z3", camera: "Dual 50 MP", battery: "3,800 mAh", charging: "30 W wired · wireless", water: "IPX8", os: "ZenithOS 3" },
  },
];

const ADDONS = [
  { slug: "device-protection", name: "Device Protection", category: "protection", priceCents: 900, icon: "ShieldCheck", description: "Cracked screens, spills, and theft covered with next-day replacement.", perks: ["Up to 2 claims / year", "Next-day replacement", "$29 screen repair"] },
  { slug: "premium-protection", name: "Premium Protection", category: "protection", priceCents: 1500, icon: "Shield", description: "Everything in Device Protection plus unlimited battery service and 24/7 expert support.", perks: ["Unlimited claims", "Battery service included", "24/7 priority support"] },
  { slug: "id-protect", name: "ID & Scam Protect", category: "protection", priceCents: 700, icon: "Lock", description: "Identity monitoring, dark-web alerts, and automatic scam-call blocking.", perks: ["Identity monitoring", "Dark-web alerts", "Spam-call blocking"] },
  { slug: "intl-pass", name: "International Pass", category: "international", priceCents: 1000, icon: "Globe", description: "Talk, text, and 5 GB of high-speed data in 200+ countries.", perks: ["200+ countries", "5 GB high-speed data", "Unlimited talk & text"] },
  { slug: "global-unlimited", name: "Global Unlimited", category: "international", priceCents: 1500, icon: "PlaneTakeoff", description: "Unlimited high-speed data abroad — no daily caps, no surprises.", perks: ["Unlimited intl. data", "210+ countries", "In-flight Wi-Fi credits"] },
  { slug: "extra-hotspot", name: "Hotspot Boost", category: "data", priceCents: 1000, icon: "Wifi", description: "Add 30 GB of high-speed mobile hotspot to any line.", perks: ["+30 GB hotspot", "Tether laptops & tablets", "5G speeds"] },
  { slug: "data-boost", name: "Data Boost", category: "data", priceCents: 500, icon: "Gauge", description: "Skip the slowdown with 10 GB of extra high-speed data each month.", perks: ["+10 GB high-speed", "No throttling", "Rolls into your cycle"] },
  { slug: "streaming-bundle", name: "Streaming Bundle", category: "streaming", priceCents: 1200, icon: "Tv", description: "Movies, music, and live TV from top services, billed in one place.", perks: ["Video + music + live TV", "Save vs. paying separately", "One bill"] },
  { slug: "music-unlimited", name: "Music Unlimited", category: "streaming", priceCents: 600, icon: "Music", description: "Ad-free music streaming for everyone on the account.", perks: ["Ad-free music", "Offline downloads", "Hi-fi audio"] },
  { slug: "cloud-backup", name: "Cloud Backup", category: "connectivity", priceCents: 400, icon: "Cloud", description: "200 GB of secure cloud backup for photos, videos, and contacts.", perks: ["200 GB storage", "Auto photo backup", "Cross-device sync"] },
  { slug: "smartwatch-line", name: "Smartwatch Line", category: "connectivity", priceCents: 1000, icon: "Watch", description: "Connect a smartwatch with its own number that shares your plan's data.", perks: ["Own phone number", "Shares plan data", "Calls without your phone"] },
  { slug: "kids-safe", name: "Family & Kids Safe", category: "connectivity", priceCents: 500, icon: "ShieldHalf", description: "Parental controls, location sharing, and content filters for family lines.", perks: ["Content filters", "Location sharing", "Screen-time limits"] },
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
  await db.delete(lineAddOns);
  await db.delete(lines);
  await db.delete(networkAreas);
  await db.delete(addOns);
  await db.delete(devices);
  await db.delete(plans);
  await db.delete(customers);

  const now = Date.now();

  const insPlans = await db.insert(plans).values(PLANS).returning();
  const planBy = new Map(insPlans.map((p) => [p.slug, p]));

  const insDevices = await db
    .insert(devices)
    .values(
      DEVICES.map(({ imgId, storageOptions, colorOptions, ...d }) => {
        const base = storageOptions[0];
        return {
          ...d,
          imageUrl: img(imgId),
          priceCents: base.priceCents,
          monthlyCents: monthly(base.priceCents),
          storage: base.size,
          storageOptions,
          colorOptions,
          colors: colorOptions.map((c) => c.name),
        };
      }),
    )
    .returning();
  const devBy = new Map(insDevices.map((d) => [d.slug, d]));

  const insAddOns = await db.insert(addOns).values(ADDONS).returning();
  const addOnBy = new Map(insAddOns.map((a) => [a.slug, a]));

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

  // Ava has device protection on her line; Jordan's line has the streaming bundle.
  await db.insert(lineAddOns).values([
    { lineId: avaLines[0].id, addOnId: addOnBy.get("device-protection")!.id },
    { lineId: avaLines[1].id, addOnId: addOnBy.get("streaming-bundle")!.id },
  ]);

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
      { category: "addon", description: "Device Protection — Ava", amountCents: 900, lineId: avaLines[0].id },
      { category: "addon", description: "Streaming Bundle — Jordan", amountCents: 1200, lineId: avaLines[1].id },
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
  await db.insert(lineAddOns).values([
    { lineId: mLines[0].id, addOnId: addOnBy.get("intl-pass")!.id },
    { lineId: mLines[0].id, addOnId: addOnBy.get("device-protection")!.id },
  ]);
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
      { category: "addon", description: "International Pass — Marcus", amountCents: 1000, lineId: mLines[0].id },
      { category: "addon", description: "Device Protection — Marcus", amountCents: 900, lineId: mLines[0].id },
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
  await db.insert(lineAddOns).values([
    { lineId: pLines[0].id, addOnId: addOnBy.get("premium-protection")!.id },
    { lineId: pLines[0].id, addOnId: addOnBy.get("music-unlimited")!.id },
    { lineId: pLines[1].id, addOnId: addOnBy.get("kids-safe")!.id },
  ]);
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
      { category: "addon", description: "Premium Protection — Priya", amountCents: 1500, lineId: pLines[0].id },
      { category: "addon", description: "Music Unlimited — Priya", amountCents: 600, lineId: pLines[0].id },
      { category: "addon", description: "Family & Kids Safe — Dev", amountCents: 500, lineId: pLines[1].id },
      { category: "fee", description: "Regulatory & admin fees", amountCents: 500, lineId: null },
    ],
  });

  console.log("✅ Seed complete.\n");
  console.log(`   Plans: ${insPlans.length}  Devices: ${insDevices.length}  Add-ons: ${insAddOns.length}  Customers: ${insCustomers.length}`);
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
