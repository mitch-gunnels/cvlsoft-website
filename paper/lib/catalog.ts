/**
 * Single source of truth for the Dunder Mifflin demo catalog.
 *
 * Consumed by `lib/db/seed.ts` (loads into Postgres) AND
 * `scripts/gen-product-images.ts` (renders the ream SVGs in /public/products),
 * so the on-screen product art always matches the seeded data.
 *
 * Note on field re-use: the underlying schema is a generic storefront (it was
 * footwear-shaped). We repurpose the columns for paper:
 *   • sizes / sizeStock → paper sizes & formats (Letter, Legal, A4, #10 …)
 *   • material           → paper stock / weight
 *   • colorway           → paper color
 *   • useCase            → category slug
 *   • fit                → printer / usage guidance
 *   • brand              → product line (Dunder Mifflin, Astrobright, Schrute Farms…)
 */

export type CatalogProduct = {
  slug: string;
  name: string;
  /** Product line — stored in the `brand` column. */
  line: string;
  /** Category slug → also stored as useCase. */
  category: string;
  /** Paper stock / weight — stored in `material`. */
  material: string;
  /** Paper color name — stored in `colorway`. */
  colorway: string;
  /** Hex used to tint the generated ream art (not stored in the DB). */
  colorHex: string;
  /** Printer / usage guidance — stored in `fit`. */
  fit: string;
  priceCents: number;
  /** Paper sizes / formats — stored in `sizes`. */
  sizes: string[];
  specs: Record<string, string>;
  description: string;
};

export const CATEGORIES = [
  { slug: "copy", name: "Copy & Printer", description: "Everyday multipurpose paper for the whole office." },
  { slug: "cardstock", name: "Cardstock & Cover", description: "Heavyweight stock for covers, invitations, and presentations." },
  { slug: "photo", name: "Photo Paper", description: "Glossy and matte paper for photo-quality prints." },
  { slug: "specialty", name: "Specialty & Colored", description: "Résumé, parchment, and bright colored paper that stands out." },
  { slug: "envelopes", name: "Envelopes", description: "Business and mailing envelopes in every size." },
  { slug: "supplies", name: "Notebooks & Pads", description: "Legal pads, notebooks, and sticky notes for the desk." },
];

export const PRODUCTS: CatalogProduct[] = [
  // ── Copy & Printer ──
  { slug: "premium-multipurpose", name: "Premium Multipurpose", line: "Dunder Mifflin", category: "copy", material: "20 lb bond", colorway: "Bright White", colorHex: "#f7f6f1", fit: "Jam-free in laser, inkjet & copiers", priceCents: 1099, sizes: ["Letter", "Legal", "A4"], specs: { Weight: "20 lb", Brightness: "96", Sheets: "500 / ream", Finish: "Uncoated" }, description: "Our flagship ream — a bright, dependable 20 lb sheet engineered to run jam-free through laser printers, inkjets, and copiers alike. The paper that built the Scranton branch." },
  { slug: "everyday-copy", name: "Everyday Copy", line: "Dunder Mifflin", category: "copy", material: "20 lb", colorway: "White", colorHex: "#f4f3ee", fit: "Reliable everyday printing", priceCents: 799, sizes: ["Letter", "Legal", "A4"], specs: { Weight: "20 lb", Brightness: "92", Sheets: "500 / ream", Finish: "Uncoated" }, description: "The value workhorse for high-volume printing. Smooth, consistent, and priced for the supply closet you actually refill." },
  { slug: "enviro-recycled", name: "EnviroCopy 30% Recycled", line: "Dunder Mifflin", category: "copy", material: "20 lb · 30% PCW", colorway: "White", colorHex: "#f4f3ee", fit: "Jam-free, eco-friendly", priceCents: 999, sizes: ["Letter", "Legal"], specs: { Weight: "20 lb", Recycled: "30% PCW", Brightness: "92", Sheets: "500 / ream" }, description: "Recycled content without the recycled feel — 30% post-consumer fiber, processed chlorine-free, and just as kind to your printer as to the planet." },
  { slug: "heavyweight-laser-32", name: "Heavyweight Laser", line: "Dunder Mifflin", category: "copy", material: "32 lb", colorway: "Ultra White", colorHex: "#fbfbf8", fit: "Premium feel for proposals", priceCents: 1599, sizes: ["Letter", "Tabloid"], specs: { Weight: "32 lb", Brightness: "100", Sheets: "500 / ream", Finish: "Smooth" }, description: "A substantial 32 lb sheet that says you mean it. Crisp double-sided printing for proposals, reports, and the occasional declaration of independence from corporate." },
  { slug: "quabity-bond-24", name: "Quabity First Bond", line: "Warehouse Select", category: "copy", material: "24 lb", colorway: "Bright White", colorHex: "#f7f6f1", fit: "Quabity you can feel", priceCents: 1199, sizes: ["Letter", "Legal"], specs: { Weight: "24 lb", Brightness: "98", Sheets: "500 / ream", Finish: "Bond" }, description: "Straight from the warehouse, where Quabity comes First. A heavier 24 lb bond with a premium hand-feel — inspected, stacked, and signed off by the loading dock." },

  // ── Cardstock & Cover ──
  { slug: "cardstock-65", name: "Cardstock Cover", line: "Dunder Mifflin", category: "cardstock", material: "65 lb cover", colorway: "White", colorHex: "#f4f3ee", fit: "Covers, flyers & invitations", priceCents: 1399, sizes: ["Letter", "Tabloid"], specs: { Weight: "65 lb", Sheets: "250 / pack", Finish: "Smooth" }, description: "A smooth 65 lb cover stock that folds clean and feeds reliably — perfect for report covers, flyers, and Dwight's homemade recall-the-CEO pamphlets." },
  { slug: "heavy-cardstock-110", name: "Heavy Cardstock", line: "Dunder Mifflin", category: "cardstock", material: "110 lb index", colorway: "Bright White", colorHex: "#f7f6f1", fit: "Rigid stock for menus & tags", priceCents: 1899, sizes: ["Letter", "Tabloid"], specs: { Weight: "110 lb", Sheets: "150 / pack", Finish: "Smooth" }, description: "Rigid 110 lb index stock for tent cards, menus, hang tags, and anything that needs to stand up on its own — unlike the quarterly numbers." },
  { slug: "astro-cardstock", name: "Astro Cardstock", line: "Astrobright", category: "cardstock", material: "65 lb cover", colorway: "Solar Yellow", colorHex: "#ffe14d", fit: "Bright cover stock that pops", priceCents: 1499, sizes: ["Letter"], specs: { Weight: "65 lb", Sheets: "100 / pack", Finish: "Smooth" }, description: "Saturated, can't-ignore-it color in a 65 lb cover. For signage, party invites, and announcing that someone left a fish in the ceiling." },

  // ── Photo ──
  { slug: "glossy-photo", name: "Glossy Photo Paper", line: "Dunder Mifflin", category: "photo", material: "Glossy · 48 lb", colorway: "Bright White", colorHex: "#f7f6f1", fit: "Photo-lab gloss for inkjet", priceCents: 1699, sizes: ["4×6", "5×7", "8.5×11"], specs: { Finish: "High gloss", Weight: "48 lb", Sheets: "100 / pack" }, description: "Instant-dry high-gloss photo paper that makes inkjet prints look lab-developed. Ideal for the office wall of branch-picnic memories." },
  { slug: "matte-photo", name: "Matte Photo Paper", line: "Dunder Mifflin", category: "photo", material: "Matte · 45 lb", colorway: "Ultra White", colorHex: "#fbfbf8", fit: "Fingerprint-free matte", priceCents: 1499, sizes: ["4×6", "5×7", "8.5×11"], specs: { Finish: "Matte", Weight: "45 lb", Sheets: "100 / pack" }, description: "A glare-free, fingerprint-resistant matte sheet for portraits and presentations you'll actually pass around the conference room." },

  // ── Specialty & Colored ──
  { slug: "resume-linen", name: "Résumé Linen", line: "Dunder Mifflin", category: "specialty", material: "24 lb linen · 25% cotton", colorway: "Natural White", colorHex: "#f3efe3", fit: "Watermark-free, interview-ready", priceCents: 1299, sizes: ["Letter"], specs: { Weight: "24 lb", Finish: "Linen", Cotton: "25%", Sheets: "100 / pack" }, description: "A textured 25%-cotton linen sheet with a quiet, professional finish. The paper you print the résumé on when you're finally leaving for Athlead." },
  { slug: "parchment-specialty", name: "Parchment Specialty", line: "Dunder Mifflin", category: "specialty", material: "24 lb parchment", colorway: "Aged Gold", colorHex: "#e8d6a8", fit: "Certificates & menus", priceCents: 1099, sizes: ["Letter", "Legal"], specs: { Weight: "24 lb", Finish: "Parchment", Sheets: "100 / pack" }, description: "Mottled aged-gold parchment for certificates, awards, and the official Dundies ballot. Looks important; feels important." },
  { slug: "astro-solar", name: "Astro Color Paper — Solar Yellow", line: "Astrobright", category: "specialty", material: "24 lb", colorway: "Solar Yellow", colorHex: "#ffe14d", fit: "Eye-catching colored copy paper", priceCents: 999, sizes: ["Letter"], specs: { Weight: "24 lb", Sheets: "500 / ream", Color: "Solar Yellow" }, description: "A full ream of unmissable solar-yellow copy paper. Runs in any printer; impossible to lose on a messy desk." },
  { slug: "astro-cosmic", name: "Astro Color Paper — Cosmic Orange", line: "Astrobright", category: "specialty", material: "24 lb", colorway: "Cosmic Orange", colorHex: "#ff7a3c", fit: "Loud color for flyers & signs", priceCents: 999, sizes: ["Letter"], specs: { Weight: "24 lb", Sheets: "500 / ream", Color: "Cosmic Orange" }, description: "Cosmic-orange copy paper for flyers, signs, and color-coded chaos. Bold enough for a fun-run promo, calm enough to survive HR." },
  { slug: "pastel-assorted", name: "Pastel Assorted", line: "Dunder Mifflin", category: "specialty", material: "20 lb", colorway: "Assorted Pastels", colorHex: "#d9e7f5", fit: "Five soft pastels per pack", priceCents: 899, sizes: ["Letter"], specs: { Weight: "20 lb", Sheets: "500 / ream", Colors: "5 assorted" }, description: "Five gentle pastels in one ream — blue, green, pink, ivory, and lilac — for sorting, scheduling, and softer office paperwork." },
  { slug: "schrute-kraft", name: "Schrute Farms Pressed Specialty", line: "Schrute Farms", category: "specialty", material: "28 lb beet-pressed kraft", colorway: "Beet Kraft", colorHex: "#9c5b4a", fit: "Agritourism-grade recycled kraft", priceCents: 1399, sizes: ["Letter", "Legal"], specs: { Weight: "28 lb", Finish: "Kraft", Recycled: "100%", Sheets: "100 / pack" }, description: "100% recycled kraft, pressed at Schrute Farms between beet harvests. Rustic, sturdy, and faintly earthy. Bed, breakfast, and bond paper." },

  // ── Envelopes ──
  { slug: "envelope-10", name: "Business Envelopes #10", line: "Dunder Mifflin", category: "envelopes", material: "Security tint", colorway: "White", colorHex: "#f4f3ee", fit: "Standard #10 with security tint", priceCents: 1099, sizes: ["#10", "#9"], specs: { Count: "500 / box", Seal: "Gummed", Security: "Tinted" }, description: "The standard business #10 with an inside security tint so nobody reads the check through the envelope. Boxed by the 500." },
  { slug: "window-envelope-10", name: "Window Envelopes #10", line: "Dunder Mifflin", category: "envelopes", material: "Single window", colorway: "White", colorHex: "#f4f3ee", fit: "For invoices & statements", priceCents: 1199, sizes: ["#10"], specs: { Count: "500 / box", Window: "Single left", Seal: "Gummed" }, description: "Single-window #10 envelopes that line up with standard invoice templates — address shows through, no label printing required." },
  { slug: "manila-clasp", name: "Manila Clasp Envelopes", line: "Dunder Mifflin", category: "envelopes", material: "Kraft manila", colorway: "Manila", colorHex: "#e6cf9a", fit: "Clasp & gummed mailers", priceCents: 1299, sizes: ["9×12", "10×13", "6×9"], specs: { Count: "100 / box", Closure: "Clasp + gummed", Stock: "28 lb" }, description: "Heavyweight manila mailers with a metal clasp and gummed flap — for contracts, files, and the occasional dramatic resignation letter." },

  // ── Notebooks & Pads ──
  { slug: "legal-pads", name: "Perforated Legal Pads", line: "Dunder Mifflin", category: "supplies", material: "Wide-ruled", colorway: "Canary", colorHex: "#f7e98e", fit: "Classic canary legal pads", priceCents: 899, sizes: ["Letter", "Junior"], specs: { Sheets: "50 / pad", Ruling: "Wide", Pack: "12 pads" }, description: "Classic canary-yellow legal pads with a clean micro-perforated tear and a sturdy chipboard back. A dozen to a pack — one for every meeting that could've been an email." },
  { slug: "steno-notebooks", name: "Steno Notebooks", line: "Dunder Mifflin", category: "supplies", material: "Gregg-ruled", colorway: "White", colorHex: "#f4f3ee", fit: "Spiral steno pads", priceCents: 799, sizes: ["6×9"], specs: { Sheets: "80 / book", Ruling: "Gregg", Pack: "6 books" }, description: "Top-spiral steno pads with a center rule for quick notes and call logs. Six to a pack for the front desk." },
  { slug: "sticky-notes", name: "Sticky Notes", line: "Dunder Mifflin", category: "supplies", material: "Self-stick", colorway: "Assorted", colorHex: "#ffd34d", fit: "Re-stickable, won't fall off", priceCents: 699, sizes: ["3×3", "4×6"], specs: { Sheets: "100 / pad", Pack: "12 pads", Adhesion: "Strong" }, description: "Bright, strong-stick notes that hold to monitors, doors, and entire staplers encased in Jell-O. Twelve pads per pack." },
  { slug: "spiral-notebook", name: "1-Subject Notebooks", line: "Dunder Mifflin", category: "supplies", material: "College-ruled", colorway: "Assorted Covers", colorHex: "#5a86c0", fit: "Durable spiral notebooks", priceCents: 599, sizes: ["A5", "Letter"], specs: { Pages: "70 / book", Ruling: "College", Pack: "5 books" }, description: "Durable wire-bound notebooks with a poly cover that survives the bottom of any bag. Five assorted covers per pack." },
];
