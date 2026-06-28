/**
 * Shop catalog for Harbor Insurance — products (with coverage tiers) and riders
 * (endorsements). This is marketing/catalog content, so it lives in code rather
 * than the database. Per-customer state (which riders are on a policy) is stored
 * in the `policy_riders` table; everything here is the menu they're chosen from.
 *
 * Tier prices for auto/home/renters mirror the quote engine (BASE × LEVEL) so
 * the shop and the quote tool agree.
 */

import { formatPrice } from "./config";

export type TierKey = "basic" | "standard" | "premium";

export type Tier = {
  key: TierKey;
  name: string;
  /** Monthly price in cents. */
  priceCents: number;
  blurb: string;
  /** Headline limit shown in the compare matrix. */
  limit: string;
  /** What's included at this tier. */
  coverages: string[];
};

export type ProductCategory = "Vehicles" | "Property" | "Life & Family";

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  tagline: string;
  description: string;
  image: string;
  /** Lucide icon name. */
  icon: string;
  bestFor: string;
  highlights: string[];
  /** `type` passed to /quote, or null if quotes aren't offered. */
  quoteType: string | null;
  tiers: Tier[];
};

export type RiderCategory = "Auto" | "Home & Property" | "Everyday";

export type Rider = {
  slug: string;
  name: string;
  category: RiderCategory;
  /** Monthly price in cents. */
  priceCents: number;
  description: string;
  /** Lucide icon name. */
  icon: string;
  /** Product slugs this rider can be added to. */
  appliesTo: string[];
  perks: string[];
};

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1000&q=80&auto=format&fit=crop`;

export const PRODUCTS: Product[] = [
  {
    slug: "auto",
    name: "Auto Insurance",
    category: "Vehicles",
    tagline: "Coverage that moves with you",
    description:
      "Liability, collision, and comprehensive coverage for your car — plus optional roadside, rental, and accident forgiveness. Bundle with home and save.",
    image: img("1503376780353-7e6692767b70"),
    icon: "Car",
    bestFor: "Drivers who want flexible coverage and add-ons.",
    highlights: ["Roadside & rental options", "Accident forgiveness available", "Bundle & save with home"],
    quoteType: "auto",
    tiers: [
      { key: "basic", name: "Basic", priceCents: 8800, limit: "State minimum", blurb: "The essentials to stay legal on the road.", coverages: ["State-minimum liability", "Uninsured motorist"] },
      { key: "standard", name: "Standard", priceCents: 11000, limit: "$100k liability", blurb: "Well-rounded protection for most drivers.", coverages: ["$100k liability", "Collision ($500 ded)", "Comprehensive ($500 ded)", "Uninsured motorist"] },
      { key: "premium", name: "Premium", priceCents: 14850, limit: "$250k liability", blurb: "Top limits, low deductibles, extras included.", coverages: ["$250k liability", "Collision ($250 ded)", "Comprehensive ($250 ded)", "Roadside", "Rental reimbursement"] },
    ],
  },
  {
    slug: "home",
    name: "Home Insurance",
    category: "Property",
    tagline: "Protect your biggest investment",
    description:
      "Dwelling, personal property, and liability coverage for homeowners, with replacement-cost and water-backup options to fill the gaps.",
    image: img("1570129477492-45c003edd2be"),
    icon: "Home",
    bestFor: "Homeowners protecting their biggest investment.",
    highlights: ["Replacement-cost dwelling", "Water backup options", "24/7 claims support"],
    quoteType: "home",
    tiers: [
      { key: "basic", name: "Basic", priceCents: 7200, limit: "$200k dwelling", blurb: "Core protection for the structure and you.", coverages: ["Dwelling $200k", "Liability $100k"] },
      { key: "standard", name: "Standard", priceCents: 9000, limit: "$350k dwelling", blurb: "Adds belongings and loss-of-use coverage.", coverages: ["Dwelling $350k", "Personal property $175k", "Liability $300k", "Loss of use"] },
      { key: "premium", name: "Premium", priceCents: 12150, limit: "$500k dwelling", blurb: "High limits with replacement cost & water backup.", coverages: ["Dwelling $500k", "Personal property $300k", "Liability $500k", "Water backup", "Replacement cost"] },
    ],
  },
  {
    slug: "renters",
    name: "Renters Insurance",
    category: "Property",
    tagline: "Your stuff, covered — for less than you think",
    description:
      "Protect your belongings against theft, fire, and water damage, with personal liability included. Coverage starts at about $20/month.",
    image: img("1522708323590-d24dbb6b0267"),
    icon: "Building2",
    bestFor: "Renters protecting their belongings and themselves.",
    highlights: ["Covers theft & damage", "Personal liability included", "Starts around $20/mo"],
    quoteType: "renters",
    tiers: [
      { key: "basic", name: "Basic", priceCents: 2000, limit: "$15k contents", blurb: "Covers the essentials in your place.", coverages: ["Personal property $15k", "Liability $100k"] },
      { key: "standard", name: "Standard", priceCents: 2500, limit: "$30k contents", blurb: "More coverage and a place to stay if needed.", coverages: ["Personal property $30k", "Liability $300k", "Loss of use"] },
      { key: "premium", name: "Premium", priceCents: 3375, limit: "$50k contents", blurb: "Top limits with replacement-cost on belongings.", coverages: ["Personal property $50k", "Liability $500k", "Loss of use", "Replacement cost"] },
    ],
  },
  {
    slug: "life",
    name: "Term Life Insurance",
    category: "Life & Family",
    tagline: "Peace of mind for the people you love",
    description:
      "Affordable term life coverage that replaces your income and protects your family. No-exam options available, with rates locked for the full term.",
    image: img("1476703993599-0035a21b17a9"),
    icon: "HeartHandshake",
    bestFor: "Anyone with people who depend on them.",
    highlights: ["No-exam options", "Lock in your rate", "Coverage for your family"],
    quoteType: "life",
    tiers: [
      { key: "basic", name: "Basic", priceCents: 1800, limit: "$250k benefit", blurb: "Essential income protection.", coverages: ["$250k term life", "20-year term", "Accidental death"] },
      { key: "standard", name: "Standard", priceCents: 3200, limit: "$500k benefit", blurb: "More coverage for growing families.", coverages: ["$500k term life", "30-year term", "Accidental death", "Terminal illness rider"] },
      { key: "premium", name: "Premium", priceCents: 5500, limit: "$1M benefit", blurb: "Maximum protection with extras.", coverages: ["$1M term life", "30-year term", "Accidental death", "Terminal illness rider", "Child coverage included"] },
    ],
  },
  {
    slug: "pet",
    name: "Pet Insurance",
    category: "Life & Family",
    tagline: "Healthy pets, smaller vet bills",
    description:
      "Reimburses vet bills for accidents and illness at any licensed vet. Choose your reimbursement level and annual limit — wellness add-ons available.",
    image: img("1543466835-00a7907e9de1"),
    icon: "PawPrint",
    bestFor: "Cat & dog parents who want vet bills covered.",
    highlights: ["Any licensed vet", "Fast reimbursement", "No payout caps on Premium"],
    quoteType: "pet",
    tiers: [
      { key: "basic", name: "Basic", priceCents: 2500, limit: "$5k / year", blurb: "Accident-only protection.", coverages: ["Accidents only", "70% reimbursement", "$5k annual limit"] },
      { key: "standard", name: "Standard", priceCents: 4000, limit: "$10k / year", blurb: "Accidents and illness covered.", coverages: ["Accidents & illness", "80% reimbursement", "$10k annual limit", "$250 deductible"] },
      { key: "premium", name: "Premium", priceCents: 6500, limit: "Unlimited", blurb: "Everything, including wellness.", coverages: ["Accidents & illness", "90% reimbursement", "Unlimited annual payout", "Wellness & dental", "$100 deductible"] },
    ],
  },
  {
    slug: "umbrella",
    name: "Umbrella Insurance",
    category: "Life & Family",
    tagline: "Extra protection when it pours",
    description:
      "Liability coverage that sits on top of your auto and home policies — protecting your savings if a claim exceeds your other limits.",
    image: img("1515694346937-94d85e41e6f0"),
    icon: "Umbrella",
    bestFor: "Households wanting extra liability beyond their policies.",
    highlights: ["Extra liability protection", "Sits on top of your policies", "Surprisingly affordable"],
    quoteType: "umbrella",
    tiers: [
      { key: "basic", name: "Basic", priceCents: 1500, limit: "$1M extra", blurb: "An extra million in protection.", coverages: ["$1M extra liability", "Above auto & home", "Worldwide coverage"] },
      { key: "standard", name: "Standard", priceCents: 2500, limit: "$2M extra", blurb: "Double the cushion, plus legal costs.", coverages: ["$2M extra liability", "Above auto & home", "Worldwide coverage", "Legal defense costs"] },
      { key: "premium", name: "Premium", priceCents: 4000, limit: "$5M extra", blurb: "Maximum protection for your assets.", coverages: ["$5M extra liability", "Above auto & home", "Worldwide coverage", "Legal defense costs", "Identity theft restoration"] },
    ],
  },
];

export const RIDERS: Rider[] = [
  { slug: "roadside", name: "Roadside Assistance", category: "Auto", priceCents: 700, icon: "LifeBuoy", appliesTo: ["auto"], description: "24/7 towing, jump-starts, lockout service, and flat-tire help.", perks: ["24/7 dispatch", "Towing to nearest shop", "Lockout & fuel delivery"] },
  { slug: "rental-reimbursement", name: "Rental Reimbursement", category: "Auto", priceCents: 500, icon: "Car", appliesTo: ["auto"], description: "Covers a rental car while yours is in the shop after a covered claim.", perks: ["Up to $50/day", "30 days max", "Direct billing"] },
  { slug: "accident-forgiveness", name: "Accident Forgiveness", category: "Auto", priceCents: 900, icon: "ShieldCheck", appliesTo: ["auto"], description: "Your rate won't go up after your first at-fault accident.", perks: ["First accident waived", "Stays with you", "No surcharge"] },
  { slug: "new-car-replacement", name: "New-Car Replacement", category: "Auto", priceCents: 1200, icon: "Sparkles", appliesTo: ["auto"], description: "Total your new car and we pay for a brand-new one — not its depreciated value.", perks: ["First 3 model years", "Same make & model", "No depreciation"] },
  { slug: "gap-coverage", name: "Loan / Lease Gap", category: "Auto", priceCents: 600, icon: "Wallet", appliesTo: ["auto"], description: "Pays the difference between your car's value and what you still owe.", perks: ["Covers the 'gap'", "Loans & leases", "Peace of mind"] },
  { slug: "water-backup", name: "Water Backup", category: "Home & Property", priceCents: 800, icon: "Droplets", appliesTo: ["home", "renters"], description: "Covers damage from sump-pump failure and sewer or drain backups.", perks: ["Sump-pump failure", "Sewer backup", "Cleanup included"] },
  { slug: "scheduled-jewelry", name: "Jewelry & Valuables", category: "Home & Property", priceCents: 700, icon: "Gem", appliesTo: ["home", "renters"], description: "Full coverage for rings, watches, and collectibles beyond standard limits.", perks: ["No deductible", "Worldwide", "Covers loss & theft"] },
  { slug: "home-systems", name: "Equipment Breakdown", category: "Home & Property", priceCents: 600, icon: "Settings", appliesTo: ["home"], description: "Repairs HVAC, water heaters, and major appliances when they fail.", perks: ["HVAC & appliances", "Parts & labor", "Multiple claims"] },
  { slug: "service-line", name: "Service Line", category: "Home & Property", priceCents: 400, icon: "PlugZap", appliesTo: ["home"], description: "Covers buried utility lines from your home to the street.", perks: ["Water & power lines", "Excavation costs", "$10k limit"] },
  { slug: "identity-theft", name: "Identity Theft Protection", category: "Everyday", priceCents: 700, icon: "Lock", appliesTo: ["auto", "home", "renters", "life", "umbrella"], description: "Credit monitoring plus full restoration help if your identity is stolen.", perks: ["Credit monitoring", "$25k expense coverage", "Restoration specialists"] },
  { slug: "pet-injury", name: "Pet Injury (Auto)", category: "Everyday", priceCents: 300, icon: "PawPrint", appliesTo: ["auto"], description: "Vet bills if your pet is injured in a covered car accident.", perks: ["Up to $1k", "No deductible", "Any pet in the car"] },
];

export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const riderBySlug = (slug: string) => RIDERS.find((r) => r.slug === slug);
export const productCategories: ProductCategory[] = ["Vehicles", "Property", "Life & Family"];
export const riderCategories: RiderCategory[] = ["Auto", "Home & Property", "Everyday"];

/** Lowest tier price for a product, used for "from $X/mo". */
export const fromPriceCents = (p: Product) => Math.min(...p.tiers.map((t) => t.priceCents));

export function serializeProduct(p: Product) {
  return {
    slug: p.slug,
    name: p.name,
    category: p.category,
    tagline: p.tagline,
    description: p.description,
    image: p.image,
    bestFor: p.bestFor,
    highlights: p.highlights,
    quoteType: p.quoteType,
    fromCents: fromPriceCents(p),
    from: `${formatPrice(fromPriceCents(p))}/mo`,
    tiers: p.tiers.map((t) => ({
      key: t.key,
      name: t.name,
      priceCents: t.priceCents,
      price: `${formatPrice(t.priceCents)}/mo`,
      limit: t.limit,
      blurb: t.blurb,
      coverages: t.coverages,
    })),
  };
}

export function serializeRider(r: Rider) {
  return {
    slug: r.slug,
    name: r.name,
    category: r.category,
    priceCents: r.priceCents,
    price: `${formatPrice(r.priceCents)}/mo`,
    description: r.description,
    icon: r.icon,
    appliesTo: r.appliesTo,
    perks: r.perks,
  };
}
