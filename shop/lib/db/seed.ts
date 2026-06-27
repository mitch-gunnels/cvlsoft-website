import "../load-env";
import { db } from "./index";
import {
  cartItems,
  carts,
  categories,
  customers,
  orderItems,
  orders,
  products,
  returnItems,
  returns,
} from "./schema";
import { orderNumber } from "../ids";

/** Verified Unsplash shoe photos (id → real footwear image). */
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=900&q=80&auto=format&fit=crop`;

const CATEGORIES = [
  { slug: "running", name: "Road Running", description: "Cushioned shoes built for the pavement." },
  { slug: "trail", name: "Trail", description: "Grippy, protective shoes for off-road miles." },
  { slug: "lifestyle", name: "Lifestyle", description: "Everyday sneakers, lows and highs." },
  { slug: "court", name: "Court", description: "Basketball and court silhouettes." },
  { slug: "training", name: "Training", description: "Stable shoes for the gym floor." },
];

const MENS = ["8", "8.5", "9", "9.5", "10", "10.5", "11", "12"];
const WOMENS = ["6", "6.5", "7", "7.5", "8", "8.5", "9", "10"];

type Seed = {
  slug: string;
  name: string;
  category: string; // also used as useCase
  gender: "men" | "women" | "unisex";
  material: string;
  colorway: string;
  fit: string;
  priceCents: number;
  imgId: string;
  specs: Record<string, string>;
  description: string;
};

const PRODUCTS: Seed[] = [
  // ── Running ──
  { slug: "veld-tempo", name: "Tempo Knit", category: "running", gender: "unisex", material: "Engineered knit", colorway: "Crimson", fit: "Runs true to size", priceCents: 13000, imgId: "1542291026-7eec264c27ff", specs: { weight: "8.1 oz", drop: "8 mm", width: "Standard" }, description: "A lightweight daily trainer with a breathable knit upper and a springy foam midsole that holds up mile after mile." },
  { slug: "strato-airone", name: "Aero Road", category: "running", gender: "unisex", material: "Mesh + TPU", colorway: "Sunset White", fit: "Runs true to size", priceCents: 15000, imgId: "1600185365926-3a2ce3cdb9eb", specs: { weight: "9.0 oz", drop: "10 mm", width: "Standard" }, description: "Visible-air cushioning under the heel makes long days easy; a structured cage keeps the midfoot locked in." },
  { slug: "marlow-pace", name: "Pace Lite", category: "running", gender: "women", material: "Recycled mesh", colorway: "Rosewater", fit: "Runs true to size", priceCents: 12500, imgId: "1551107696-a4b0c5a0d9a2", specs: { weight: "7.4 oz", drop: "6 mm", width: "Standard" }, description: "A responsive tempo shoe in a women's-specific fit, made with a recycled mesh upper and a plush heel collar." },
  { slug: "cascade-glide", name: "Glide Slip-On", category: "running", gender: "unisex", material: "Sock-knit", colorway: "Ash", fit: "Runs small — size up half", priceCents: 11000, imgId: "1562183241-b937e95585b6", specs: { weight: "7.0 oz", drop: "8 mm", width: "Narrow" }, description: "A slip-on sock-knit runner for easy recovery days. The snug knit runs small — order a half size up." },

  // ── Trail ──
  { slug: "nomad-trail-gtx", name: "Summit Trail GTX", category: "trail", gender: "unisex", material: "Waterproof mesh", colorway: "Black", fit: "Runs true to size", priceCents: 16500, imgId: "1491553895911-0055eca6402d", specs: { weight: "11.2 oz", drop: "8 mm", width: "Standard", traction: "5 mm lugs" }, description: "A waterproof trail shoe with aggressive lugs and a rock plate, built for technical, muddy terrain." },
  { slug: "veld-ridge", name: "Ridge Trail", category: "trail", gender: "unisex", material: "Ripstop mesh", colorway: "Olive", fit: "Runs true to size", priceCents: 14500, imgId: "1539185441755-769473a23570", specs: { weight: "10.1 oz", drop: "6 mm", width: "Wide-friendly", traction: "4 mm lugs" }, description: "A do-everything trail runner with a roomy toebox and sticky rubber outsole for confident footing." },

  // ── Lifestyle (lows) ──
  { slug: "cascade-court-low", name: "Court Low Canvas", category: "lifestyle", gender: "unisex", material: "Canvas", colorway: "Burgundy", fit: "Runs true to size", priceCents: 7500, imgId: "1525966222134-fcfa99b8ae77", specs: { sole: "Vulcanized rubber" }, description: "A clean low-top canvas sneaker with a vulcanized sole — an everyday classic." },
  { slug: "strato-shadow", name: "Shadow Low", category: "lifestyle", gender: "women", material: "Leather", colorway: "Pastel", fit: "Runs true to size", priceCents: 11500, imgId: "1595950653106-6c9ebd614d3a", specs: { sole: "Foam cupsole" }, description: "A layered pastel leather sneaker with a chunky cupsole and tonal overlays." },
  { slug: "atlas-wheat", name: "Nubuck Low", category: "lifestyle", gender: "unisex", material: "Nubuck leather", colorway: "Wheat", fit: "Runs true to size", priceCents: 12000, imgId: "1549298916-b41d501d3772", specs: { sole: "Rubber cupsole" }, description: "A wheat-nubuck low with a weatherproofed upper that only looks better with wear." },
  { slug: "halden-skate", name: "Suede Skate", category: "lifestyle", gender: "unisex", material: "Suede", colorway: "Concrete", fit: "Runs true to size", priceCents: 8500, imgId: "1460353581641-37baddab0fa2", specs: { sole: "Grippy vulcanized" }, description: "A padded suede skate shoe with a reinforced ollie area and a board-feel sole." },
  { slug: "marlow-mono", name: "Mono Low", category: "lifestyle", gender: "unisex", material: "Leather", colorway: "Triple Black", fit: "Runs true to size", priceCents: 10500, imgId: "1543508282-6319a3e2621f", specs: { sole: "Foam cupsole" }, description: "An all-black leather low that goes with everything — minimal detailing, maximum versatility." },
  { slug: "halden-heritage", name: "Heritage Court", category: "lifestyle", gender: "unisex", material: "Leather", colorway: "White", fit: "Runs true to size", priceCents: 9000, imgId: "1608231387042-66d1773070a5", specs: { sole: "Rubber cupsole" }, description: "A crisp white leather court sneaker with perforated toe detailing — a wardrobe staple." },
  { slug: "atlas-sb-low", name: "Street Low", category: "lifestyle", gender: "unisex", material: "Suede + leather", colorway: "Bred", fit: "Runs true to size", priceCents: 11000, imgId: "1552346154-21d32810aba3", specs: { sole: "Cushioned skate" }, description: "A black-and-red skate-inspired low with a cushioned insole for all-day wear." },
  { slug: "nomad-drift", name: "Drift Runner", category: "lifestyle", gender: "unisex", material: "Mesh + synthetic", colorway: "Teal Multi", fit: "Runs true to size", priceCents: 13500, imgId: "1595341888016-a392ef81b7de", specs: { sole: "Chunky EVA" }, description: "A chunky multi-panel dad sneaker with layered textures and a cushioned EVA platform." },
  { slug: "cascade-classic", name: "Classic Low", category: "lifestyle", gender: "unisex", material: "Leather", colorway: "White", fit: "Runs true to size", priceCents: 9500, imgId: "1600269452121-4f2416e55c28", specs: { sole: "Rubber cupsole" }, description: "The original all-white leather low — timeless, durable, easy to clean." },
  { slug: "strato-flux", name: "Flux Air", category: "lifestyle", gender: "unisex", material: "Mesh", colorway: "Citrus", fit: "Runs true to size", priceCents: 12500, imgId: "1514989940723-e8e51635b782", specs: { sole: "Air cushioned" }, description: "A bold orange-and-blue running-inspired sneaker with visible-air cushioning for street wear." },

  // ── Lifestyle (highs) ──
  { slug: "cinder-heritage-hi", name: "Heritage Hi", category: "lifestyle", gender: "unisex", material: "Leather", colorway: "Chicago", fit: "Runs large — size down half", priceCents: 14000, imgId: "1597045566677-8cf032ed6634", specs: { sole: "Encapsulated foam" }, description: "An iconic black/white/red high-top in premium leather. Roomy fit — size down half." },
  { slug: "cinder-sol-hi", name: "Sol Hi", category: "lifestyle", gender: "unisex", material: "Leather", colorway: "Pollen", fit: "Runs large — size down half", priceCents: 14000, imgId: "1597248881519-db089d3744a5", specs: { sole: "Encapsulated foam" }, description: "A yellow-and-black leather high-top with a padded ankle and durable cupsole." },
  { slug: "marlow-loft-hi", name: "Loft Hi", category: "lifestyle", gender: "unisex", material: "Suede + canvas", colorway: "Cream", fit: "Runs true to size", priceCents: 12000, imgId: "1584735175315-9d5df23860e6", specs: { sole: "Foam midsole" }, description: "A cream high-top blending suede and canvas with soft-blue accents." },
  { slug: "atlas-royal-hi", name: "Royal Hi", category: "lifestyle", gender: "unisex", material: "Leather", colorway: "Royal", fit: "Runs large — size down half", priceCents: 13500, imgId: "1578116922645-3976907a7671", specs: { sole: "Encapsulated foam" }, description: "A royal-blue leather high-top with a clean white midsole and bold paneling." },

  // ── Court ──
  { slug: "atlas-court-12", name: "Court Pro 12", category: "court", gender: "unisex", material: "Nubuck + mesh", colorway: "Red", fit: "Runs true to size", priceCents: 15500, imgId: "1575537302964-96cd47c06b1b", specs: { sole: "Zoom-style cushioning", support: "High" }, description: "A performance basketball shoe with responsive cushioning and lockdown midfoot support." },
  { slug: "strato-hoops", name: "Hoops Mid", category: "court", gender: "unisex", material: "Mesh", colorway: "Ice", fit: "Runs true to size", priceCents: 12000, imgId: "1521774971864-62e842046145", specs: { sole: "Foam cushioning", support: "Mid" }, description: "A breathable light-blue court shoe with a grippy herringbone outsole." },

  // ── Training ──
  { slug: "veld-volt-trainer", name: "Volt Trainer", category: "training", gender: "unisex", material: "Mesh + TPU", colorway: "Volt", fit: "Runs true to size", priceCents: 11000, imgId: "1606107557195-0e29a4b5b4aa", specs: { weight: "9.6 oz", drop: "4 mm", stability: "High" }, description: "A flat, stable trainer for lifting and HIIT, with a wide base and a high-vis volt upper." },
  { slug: "nomad-gym-trainer", name: "Gym Trainer", category: "training", gender: "unisex", material: "Knit + synthetic", colorway: "Black", fit: "Runs true to size", priceCents: 10500, imgId: "1605408499391-6368c628ef42", specs: { weight: "9.2 oz", drop: "6 mm", stability: "Medium" }, description: "A versatile gym trainer that handles short runs, classes and the weight room." },
];

/** Fixed customers so AI-agent demos always have a known token to use. */
const CUSTOMERS = [
  { name: "Ava Chen", email: "ava@example.com", apiToken: "shop_tok_ava" },
  { name: "Marcus Lee", email: "marcus@example.com", apiToken: "shop_tok_marcus" },
  { name: "Priya Patel", email: "priya@example.com", apiToken: "shop_tok_priya" },
];

/** Build a per-size stock map; ~18% of sizes are out of stock for realism. */
function genStock(sizes: string[]): Record<string, number> {
  const stock: Record<string, number> = {};
  sizes.forEach((s) => {
    stock[s] = Math.random() < 0.18 ? 0 : 1 + Math.floor(Math.random() * 8);
  });
  // Guarantee at least two purchasable sizes.
  if (Object.values(stock).filter((n) => n > 0).length < 2) {
    stock[sizes[2]] = 5;
    stock[sizes[3]] = 3;
  }
  return stock;
}

async function main() {
  console.log("⏳ Seeding Sole & Stride demo store…");

  await db.delete(returnItems);
  await db.delete(returns);
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(cartItems);
  await db.delete(carts);
  await db.delete(customers);
  await db.delete(products);
  await db.delete(categories);

  const insertedCategories = await db.insert(categories).values(CATEGORIES).returning();
  const catBySlug = new Map(insertedCategories.map((c) => [c.slug, c.id]));

  const insertedProducts = await db
    .insert(products)
    .values(
      PRODUCTS.map((p) => {
        const sizes = p.gender === "women" ? WOMENS : MENS;
        const sizeStock = genStock(sizes);
        const inventory = Object.values(sizeStock).reduce((a, b) => a + b, 0);
        return {
          slug: p.slug,
          name: p.name,
          description: p.description,
          priceCents: p.priceCents,
          categoryId: catBySlug.get(p.category)!,
          imageUrl: img(p.imgId),
          images: [img(p.imgId)],
          gender: p.gender,
          material: p.material,
          colorway: p.colorway,
          useCase: p.category,
          fit: p.fit,
          sizes,
          sizeStock,
          specs: p.specs,
          inventory,
          sku: `SS-${p.slug.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8)}`,
          rating: Number((4 + Math.random()).toFixed(1)),
        };
      }),
    )
    .returning();
  const productBySlug = new Map(insertedProducts.map((p) => [p.slug, p]));

  const insertedCustomers = await db.insert(customers).values(CUSTOMERS).returning();
  const ava = insertedCustomers[0];

  // Sample fulfilled order for Ava (with sizes) → enables size-exchange demos.
  const lineFor = (slug: string, size: string, qty: number) => {
    const p = productBySlug.get(slug)!;
    return {
      productId: p.id,
      nameSnapshot: p.name,
      size,
      priceCents: p.priceCents,
      quantity: qty,
    };
  };

  const sampleLines = [lineFor("veld-tempo", "9", 1), lineFor("cascade-classic", "10", 1)];
  const subtotal = sampleLines.reduce((s, l) => s + l.priceCents * l.quantity, 0);

  const [historicOrder] = await db
    .insert(orders)
    .values({
      orderNumber: orderNumber(),
      customerId: ava.id,
      status: "fulfilled",
      subtotalCents: subtotal,
      shippingCents: 0,
      totalCents: subtotal,
      currency: "usd",
      stripePaymentIntent: "pi_demo_seeded",
      shippingAddress: {
        line1: "742 Evergreen Terrace",
        city: "Portland",
        state: "OR",
        postalCode: "97201",
        country: "US",
      },
    })
    .returning();

  await db
    .insert(orderItems)
    .values(sampleLines.map((l) => ({ ...l, orderId: historicOrder.id })));

  console.log("✅ Seed complete.\n");
  console.log(`   Categories: ${insertedCategories.length}`);
  console.log(`   Products:   ${insertedProducts.length}`);
  console.log(`   Customers:  ${insertedCustomers.length}`);
  console.log(`   Sample order: ${historicOrder.orderNumber} (Ava: Tempo Knit 9, Classic Low 10)\n`);
  console.log("   AI-agent bearer tokens (Authorization: Bearer <token>):");
  for (const c of insertedCustomers) {
    console.log(`     • ${c.name.padEnd(14)} ${c.apiToken}`);
  }
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
