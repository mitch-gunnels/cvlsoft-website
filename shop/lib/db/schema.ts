import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

/* -------------------------------------------------------------------------- */
/*  Catalog                                                                    */
/* -------------------------------------------------------------------------- */

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  /** Price in integer cents. */
  priceCents: integer("price_cents").notNull(),
  currency: text("currency").notNull().default("usd"),
  categoryId: uuid("category_id").references(() => categories.id),
  imageUrl: text("image_url").notNull().default(""),
  /** Additional gallery image URLs. */
  images: jsonb("images").$type<string[]>().notNull().default([]),

  /* ── Footwear attributes (what the agent reasons over) ── */
  brand: text("brand").notNull().default(""),
  gender: text("gender").notNull().default("unisex"), // men | women | unisex
  material: text("material").notNull().default(""),
  colorway: text("colorway").notNull().default(""),
  useCase: text("use_case").notNull().default(""), // running | trail | lifestyle | court | training
  /** Fit guidance, e.g. "Runs true to size" / "Runs small — size up half". */
  fit: text("fit").notNull().default("Runs true to size"),
  /** Available sizes in display order, e.g. ["8","8.5","9",…]. */
  sizes: jsonb("sizes").$type<string[]>().notNull().default([]),
  /** Per-size on-hand inventory, e.g. {"9": 4, "10": 0}. */
  sizeStock: jsonb("size_stock").$type<Record<string, number>>().notNull().default({}),
  /** Misc spec sheet (weight, drop, etc.). */
  specs: jsonb("specs").$type<Record<string, string>>().notNull().default({}),

  /** Denormalized total stock across sizes (for sorting / in-stock badges). */
  inventory: integer("inventory").notNull().default(0),
  sku: text("sku").notNull(),
  rating: real("rating").notNull().default(4.5),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*  Customers + carts                                                          */
/* -------------------------------------------------------------------------- */

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  /** Bearer token an AI agent uses to act on behalf of this customer. */
  apiToken: text("api_token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const carts = pgTable("carts", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  /** "open" while shopping, "converted" once checked out. */
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    /** Chosen size — part of the line identity (a 9 and a 10 are separate lines). */
    size: text("size").notNull().default(""),
    quantity: integer("quantity").notNull().default(1),
  },
  (t) => [
    unique("cart_items_cart_product_size_unique").on(
      t.cartId,
      t.productId,
      t.size,
    ),
  ],
);

/* -------------------------------------------------------------------------- */
/*  Orders                                                                     */
/* -------------------------------------------------------------------------- */

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  /** pending → paid → fulfilled | cancelled */
  status: text("status").notNull().default("pending"),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull(),
  currency: text("currency").notNull().default("usd"),
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntent: text("stripe_payment_intent"),
  shippingAddress: jsonb("shipping_address").$type<Record<string, string>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  /** Snapshot of name/price/size at purchase time. */
  nameSnapshot: text("name_snapshot").notNull(),
  size: text("size").notNull().default(""),
  priceCents: integer("price_cents").notNull(),
  quantity: integer("quantity").notNull(),
});

/* -------------------------------------------------------------------------- */
/*  Returns (RMA)                                                              */
/* -------------------------------------------------------------------------- */

export const returns = pgTable("returns", {
  id: uuid("id").defaultRandom().primaryKey(),
  rmaNumber: text("rma_number").notNull().unique(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  /** refund (money back) | exchange (different size) */
  type: text("type").notNull().default("refund"),
  /** requested → approved → received → refunded | rejected */
  status: text("status").notNull().default("requested"),
  reason: text("reason").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const returnItems = pgTable("return_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  returnId: uuid("return_id")
    .notNull()
    .references(() => returns.id, { onDelete: "cascade" }),
  orderItemId: uuid("order_item_id")
    .notNull()
    .references(() => orderItems.id),
  quantity: integer("quantity").notNull(),
  /** For exchanges: the size the customer wants instead (null for refunds). */
  exchangeForSize: text("exchange_for_size"),
});

/* -------------------------------------------------------------------------- */
/*  Relations                                                                  */
/* -------------------------------------------------------------------------- */

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const customersRelations = relations(customers, ({ many, one }) => ({
  orders: many(orders),
  cart: one(carts),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  customer: one(customers, {
    fields: [carts.customerId],
    references: [customers.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
  returns: many(returns),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const returnsRelations = relations(returns, ({ one, many }) => ({
  order: one(orders, { fields: [returns.orderId], references: [orders.id] }),
  customer: one(customers, {
    fields: [returns.customerId],
    references: [customers.id],
  }),
  items: many(returnItems),
}));

export const returnItemsRelations = relations(returnItems, ({ one }) => ({
  return: one(returns, {
    fields: [returnItems.returnId],
    references: [returns.id],
  }),
  orderItem: one(orderItems, {
    fields: [returnItems.orderItemId],
    references: [orderItems.id],
  }),
}));

/* -------------------------------------------------------------------------- */
/*  Inferred types                                                             */
/* -------------------------------------------------------------------------- */

export type Product = typeof products.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Cart = typeof carts.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Return = typeof returns.$inferSelect;
export type ReturnItem = typeof returnItems.$inferSelect;
