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
/*  Customers                                                                   */
/* -------------------------------------------------------------------------- */

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  accountNumber: text("account_number").notNull().unique(),
  apiToken: text("api_token").notNull().unique(),
  addressLine1: text("address_line1").notNull().default(""),
  city: text("city").notNull().default(""),
  state: text("state").notNull().default(""),
  zip: text("zip").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*  Policies                                                                    */
/* -------------------------------------------------------------------------- */

export const policies = pgTable("policies", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  policyNumber: text("policy_number").notNull().unique(),
  /** auto | home | renters */
  type: text("type").notNull(),
  /** active | lapsed | cancelled */
  status: text("status").notNull().default("active"),
  /** Monthly premium in cents. */
  premiumCents: integer("premium_cents").notNull(),
  deductibleCents: integer("deductible_cents").notNull().default(0),
  /** The insured thing: vehicle {year,make,model,vin,trim} or property {...}. */
  insured: jsonb("insured").$type<Record<string, string | number>>().notNull().default({}),
  imageUrl: text("image_url").notNull().default(""),
  effectiveDate: timestamp("effective_date", { withTimezone: true }).notNull(),
  renewalDate: timestamp("renewal_date", { withTimezone: true }).notNull(),
  /** Current amount due (0 if paid through the cycle). */
  amountDueCents: integer("amount_due_cents").notNull().default(0),
  dueDate: timestamp("due_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const coverages = pgTable("coverages", {
  id: uuid("id").defaultRandom().primaryKey(),
  policyId: uuid("policy_id")
    .notNull()
    .references(() => policies.id, { onDelete: "cascade" }),
  /** machine key, e.g. liability | collision | comprehensive | uninsured_motorist | dwelling | personal_property | loss_of_use */
  key: text("key").notNull(),
  label: text("label").notNull(),
  /** Coverage limit in cents (0 = N/A). */
  limitCents: integer("limit_cents").notNull().default(0),
  deductibleCents: integer("deductible_cents").notNull().default(0),
  included: boolean("included").notNull().default(true),
});

/* -------------------------------------------------------------------------- */
/*  Claims                                                                      */
/* -------------------------------------------------------------------------- */

export const claims = pgTable("claims", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  policyId: uuid("policy_id")
    .notNull()
    .references(() => policies.id),
  claimNumber: text("claim_number").notNull().unique(),
  /** collision | theft | glass | water | fire | liability | weather | other */
  type: text("type").notNull(),
  /** submitted | in_review | approved | paid | denied */
  status: text("status").notNull().default("submitted"),
  dateOfLoss: timestamp("date_of_loss", { withTimezone: true }).notNull(),
  description: text("description").notNull().default(""),
  estimateCents: integer("estimate_cents").notNull().default(0),
  payoutCents: integer("payout_cents").notNull().default(0),
  photos: jsonb("photos").$type<string[]>().notNull().default([]),
  adjuster: text("adjuster").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*  Quotes                                                                      */
/* -------------------------------------------------------------------------- */

export const quotes = pgTable("quotes", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id),
  quoteNumber: text("quote_number").notNull().unique(),
  type: text("type").notNull(),
  inputs: jsonb("inputs").$type<Record<string, string | number>>().notNull().default({}),
  monthlyCents: integer("monthly_cents").notNull(),
  coverageSummary: jsonb("coverage_summary").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*  Relations                                                                   */
/* -------------------------------------------------------------------------- */

export const customersRelations = relations(customers, ({ many }) => ({
  policies: many(policies),
  claims: many(claims),
}));

export const policiesRelations = relations(policies, ({ one, many }) => ({
  customer: one(customers, { fields: [policies.customerId], references: [customers.id] }),
  coverages: many(coverages),
  claims: many(claims),
}));

export const coveragesRelations = relations(coverages, ({ one }) => ({
  policy: one(policies, { fields: [coverages.policyId], references: [policies.id] }),
}));

export const claimsRelations = relations(claims, ({ one }) => ({
  customer: one(customers, { fields: [claims.customerId], references: [customers.id] }),
  policy: one(policies, { fields: [claims.policyId], references: [policies.id] }),
}));

/* -------------------------------------------------------------------------- */
/*  Inferred types                                                            */
/* -------------------------------------------------------------------------- */

export type Customer = typeof customers.$inferSelect;
export type Policy = typeof policies.$inferSelect;
export type Coverage = typeof coverages.$inferSelect;
export type Claim = typeof claims.$inferSelect;
export type Quote = typeof quotes.$inferSelect;
