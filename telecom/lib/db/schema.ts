import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/* -------------------------------------------------------------------------- */
/*  Customers (account holders)                                                */
/* -------------------------------------------------------------------------- */

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  accountNumber: text("account_number").notNull().unique(),
  /** Bearer token an AI agent uses to act on behalf of this customer. */
  apiToken: text("api_token").notNull().unique(),
  /** Default billing ZIP — used for network status lookups. */
  zip: text("zip").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*  Catalog: plans + devices                                                   */
/* -------------------------------------------------------------------------- */

export const plans = pgTable("plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  /** Monthly price per line, in cents. */
  priceCents: integer("price_cents").notNull(),
  /** Monthly high-speed data in GB; -1 means unlimited. */
  dataGb: integer("data_gb").notNull(),
  /** Included mobile hotspot in GB. */
  hotspotGb: integer("hotspot_gb").notNull().default(0),
  perks: jsonb("perks").$type<string[]>().notNull().default([]),
  description: text("description").notNull().default(""),
  active: boolean("active").notNull().default(true),
});

/** One selectable storage tier on a device (full retail price for that size). */
export type StorageOption = { size: string; priceCents: number };
/** One selectable color, with a swatch hex. */
export type ColorOption = { name: string; hex: string };
/** Comparable spec sheet shown on the detail + compare pages. */
export type DeviceSpecs = {
  display: string;
  chip: string;
  camera: string;
  battery: string;
  charging: string;
  water: string;
  os: string;
};

export const devices = pgTable("devices", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  brand: text("brand").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  /** Full retail price (base storage tier) in cents. */
  priceCents: integer("price_cents").notNull(),
  /** 24-month installment price per month (base tier), in cents. */
  monthlyCents: integer("monthly_cents").notNull(),
  /** Base storage size label (mirrors storageOptions[0].size). */
  storage: text("storage").notNull().default(""),
  /** Selectable storage tiers, cheapest first. */
  storageOptions: jsonb("storage_options").$type<StorageOption[]>().notNull().default([]),
  /** Color names (mirrors colorOptions[].name) — kept for back-compat. */
  colors: jsonb("colors").$type<string[]>().notNull().default([]),
  /** Selectable colors with swatch hexes. */
  colorOptions: jsonb("color_options").$type<ColorOption[]>().notNull().default([]),
  /** Comparable spec sheet. */
  specs: jsonb("specs").$type<DeviceSpecs | null>(),
  description: text("description").notNull().default(""),
  active: boolean("active").notNull().default(true),
});

/* -------------------------------------------------------------------------- */
/*  Add-ons (plan extras you can attach to a line)                             */
/* -------------------------------------------------------------------------- */

export const addOns = pgTable("add_ons", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  /** protection | data | international | streaming | connectivity */
  category: text("category").notNull().default("connectivity"),
  /** Monthly price per line, in cents. */
  priceCents: integer("price_cents").notNull(),
  description: text("description").notNull().default(""),
  /** Lucide icon name used to render the add-on. */
  icon: text("icon").notNull().default("Star"),
  perks: jsonb("perks").$type<string[]>().notNull().default([]),
  active: boolean("active").notNull().default(true),
});

/** Join: an add-on subscribed on a specific line. */
export const lineAddOns = pgTable("line_add_ons", {
  id: uuid("id").defaultRandom().primaryKey(),
  lineId: uuid("line_id")
    .notNull()
    .references(() => lines.id, { onDelete: "cascade" }),
  addOnId: uuid("add_on_id")
    .notNull()
    .references(() => addOns.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*  Lines (a phone number on the account)                                      */
/* -------------------------------------------------------------------------- */

export const lines = pgTable("lines", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  phoneNumber: text("phone_number").notNull(),
  nickname: text("nickname").notNull().default(""),
  planId: uuid("plan_id")
    .notNull()
    .references(() => plans.id),
  deviceId: uuid("device_id").references(() => devices.id),
  /** active | suspended */
  status: text("status").notNull().default("active"),
  /** High-speed data used this cycle, in MB. */
  dataUsedMb: integer("data_used_mb").notNull().default(0),
  /** Whether the line is eligible for a device upgrade. */
  upgradeEligible: boolean("upgrade_eligible").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*  Bills + line items                                                          */
/* -------------------------------------------------------------------------- */

export const bills = pgTable("bills", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  invoiceNumber: text("invoice_number").notNull().unique(),
  periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
  periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
  /** due | paid */
  status: text("status").notNull().default("due"),
  subtotalCents: integer("subtotal_cents").notNull(),
  taxesCents: integer("taxes_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull(),
  dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const billItems = pgTable("bill_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  billId: uuid("bill_id")
    .notNull()
    .references(() => bills.id, { onDelete: "cascade" }),
  lineId: uuid("line_id").references(() => lines.id),
  /** plan | device | overage | fee | tax | credit */
  category: text("category").notNull(),
  description: text("description").notNull(),
  amountCents: integer("amount_cents").notNull(),
});

/* -------------------------------------------------------------------------- */
/*  Support tickets                                                             */
/* -------------------------------------------------------------------------- */

export const tickets = pgTable("tickets", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  ticketNumber: text("ticket_number").notNull().unique(),
  /** billing | network | device | account */
  category: text("category").notNull().default("account"),
  subject: text("subject").notNull(),
  body: text("body").notNull().default(""),
  /** open | resolved */
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*  Network coverage (for status checks / outage reports)                      */
/* -------------------------------------------------------------------------- */

export const networkAreas = pgTable("network_areas", {
  id: uuid("id").defaultRandom().primaryKey(),
  zip: text("zip").notNull().unique(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  /** operational | degraded | outage */
  status: text("status").notNull().default("operational"),
  note: text("note").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*  Relations                                                                   */
/* -------------------------------------------------------------------------- */

export const customersRelations = relations(customers, ({ many }) => ({
  lines: many(lines),
  bills: many(bills),
  tickets: many(tickets),
}));

export const plansRelations = relations(plans, ({ many }) => ({
  lines: many(lines),
}));

export const devicesRelations = relations(devices, ({ many }) => ({
  lines: many(lines),
}));

export const linesRelations = relations(lines, ({ one, many }) => ({
  customer: one(customers, { fields: [lines.customerId], references: [customers.id] }),
  plan: one(plans, { fields: [lines.planId], references: [plans.id] }),
  device: one(devices, { fields: [lines.deviceId], references: [devices.id] }),
  addOns: many(lineAddOns),
}));

export const addOnsRelations = relations(addOns, ({ many }) => ({
  lines: many(lineAddOns),
}));

export const lineAddOnsRelations = relations(lineAddOns, ({ one }) => ({
  line: one(lines, { fields: [lineAddOns.lineId], references: [lines.id] }),
  addOn: one(addOns, { fields: [lineAddOns.addOnId], references: [addOns.id] }),
}));

export const billsRelations = relations(bills, ({ one, many }) => ({
  customer: one(customers, { fields: [bills.customerId], references: [customers.id] }),
  items: many(billItems),
}));

export const billItemsRelations = relations(billItems, ({ one }) => ({
  bill: one(bills, { fields: [billItems.billId], references: [bills.id] }),
  line: one(lines, { fields: [billItems.lineId], references: [lines.id] }),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  customer: one(customers, { fields: [tickets.customerId], references: [customers.id] }),
}));

/* -------------------------------------------------------------------------- */
/*  Inferred types                                                             */
/* -------------------------------------------------------------------------- */

export type Customer = typeof customers.$inferSelect;
export type Plan = typeof plans.$inferSelect;
export type Device = typeof devices.$inferSelect;
export type Line = typeof lines.$inferSelect;
export type Bill = typeof bills.$inferSelect;
export type BillItem = typeof billItems.$inferSelect;
export type Ticket = typeof tickets.$inferSelect;
export type NetworkArea = typeof networkAreas.$inferSelect;
export type AddOn = typeof addOns.$inferSelect;
export type LineAddOn = typeof lineAddOns.$inferSelect;
