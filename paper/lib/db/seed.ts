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
import { CATEGORIES, PRODUCTS } from "../catalog";

/** Locally-generated ream art (see scripts/gen-product-images.ts). */
const img = (slug: string) => `/products/${slug}.svg`;

/** Fixed customers so AI-agent demos always have a known token to use. */
const CUSTOMERS = [
  { name: "Michael Scott", email: "michael.scott@dundermifflin.com", apiToken: "dm_tok_michael" },
  { name: "Pam Beesly", email: "pam.beesly@dundermifflin.com", apiToken: "dm_tok_pam" },
  { name: "Jim Halpert", email: "jim.halpert@dundermifflin.com", apiToken: "dm_tok_jim" },
  { name: "Dwight Schrute", email: "dwight.schrute@dundermifflin.com", apiToken: "dm_tok_dwight" },
];

/** Build a per-format stock map; ~15% of formats are out of stock for realism. */
function genStock(sizes: string[]): Record<string, number> {
  const stock: Record<string, number> = {};
  sizes.forEach((s) => {
    stock[s] = Math.random() < 0.15 ? 0 : 8 + Math.floor(Math.random() * 80);
  });
  // Guarantee at least one purchasable format.
  if (!Object.values(stock).some((n) => n > 0)) stock[sizes[0]] = 40;
  return stock;
}

async function main() {
  console.log("⏳ Seeding Dunder Mifflin demo store…");

  await db.delete(returnItems);
  await db.delete(returns);
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(cartItems);
  await db.delete(carts);
  await db.delete(customers);
  await db.delete(products);
  await db.delete(categories);

  const insertedCategories = await db
    .insert(categories)
    .values(CATEGORIES.map((c) => ({ slug: c.slug, name: c.name, description: c.description })))
    .returning();
  const catBySlug = new Map(insertedCategories.map((c) => [c.slug, c.id]));

  const insertedProducts = await db
    .insert(products)
    .values(
      PRODUCTS.map((p) => {
        const sizeStock = genStock(p.sizes);
        const inventory = Object.values(sizeStock).reduce((a, b) => a + b, 0);
        return {
          slug: p.slug,
          name: p.name,
          description: p.description,
          priceCents: p.priceCents,
          categoryId: catBySlug.get(p.category)!,
          imageUrl: img(p.slug),
          images: [img(p.slug)],
          brand: p.line,
          gender: "", // unused for paper
          material: p.material,
          colorway: p.colorway,
          useCase: p.category,
          fit: p.fit,
          sizes: p.sizes,
          sizeStock,
          specs: p.specs,
          inventory,
          sku: `DM-${p.slug.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8)}`,
          rating: Number((4 + Math.random()).toFixed(1)),
        };
      }),
    )
    .returning();
  const productBySlug = new Map(insertedProducts.map((p) => [p.slug, p]));

  const insertedCustomers = await db.insert(customers).values(CUSTOMERS).returning();
  const michael = insertedCustomers[0];

  // Sample fulfilled order for Michael (with formats) → enables exchange demos.
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

  const sampleLines = [
    lineFor("premium-multipurpose", "Letter", 5),
    lineFor("cardstock-65", "Letter", 1),
  ];
  const subtotal = sampleLines.reduce((s, l) => s + l.priceCents * l.quantity, 0);

  const [historicOrder] = await db
    .insert(orders)
    .values({
      orderNumber: orderNumber(),
      customerId: michael.id,
      status: "fulfilled",
      subtotalCents: subtotal,
      shippingCents: 0,
      totalCents: subtotal,
      currency: "usd",
      shippingAddress: {
        line1: "Dunder Mifflin, Scranton Branch",
        line2: "1725 Slough Avenue, Suite 200",
        city: "Scranton",
        state: "PA",
        postalCode: "18505",
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
  console.log(`   Sample order: ${historicOrder.orderNumber} (Michael: Premium Multipurpose ×5, Cardstock Cover ×1)\n`);
  console.log("   AI-agent bearer tokens (Authorization: Bearer <token>):");
  for (const c of insertedCustomers) {
    console.log(`     • ${c.name.padEnd(16)} ${c.apiToken}`);
  }
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
