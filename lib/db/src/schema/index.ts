import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const listingStatus = pgEnum("listing_status", ["draft", "pending_review", "published", "paused", "removed"]);
export const rightsModel = pgEnum("rights_model", ["file_sale", "usage_license", "copyright_transfer"]);
export const purchaseStatus = pgEnum("purchase_status", ["pending", "paid", "delivered", "refunded", "disputed"]);

// One identity can buy and sell. Creator capability is a profile, not a separate account type.
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  displayName: varchar("display_name", { length: 120 }).notNull(),
  passwordHash: text("password_hash"),
  authProvider: varchar("auth_provider", { length: 40 }).notNull().default("local"),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("users_email_unique").on(t.email)]);

export const creatorProfiles = pgTable("creator_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  handle: varchar("handle", { length: 40 }).notNull(),
  bio: text("bio"),
  avatarObjectKey: text("avatar_object_key"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("creator_profiles_user_unique").on(t.userId), uniqueIndex("creator_profiles_handle_unique").on(t.handle)]);

export const listings = pgTable("listings", {
  id: uuid("id").defaultRandom().primaryKey(),
  creatorId: uuid("creator_id").notNull().references(() => creatorProfiles.id, { onDelete: "restrict" }),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  workType: varchar("work_type", { length: 60 }).notNull(),
  status: listingStatus("status").notNull().default("draft"),
  currency: varchar("currency", { length: 3 }).notNull().default("THB"),
  priceMinor: integer("price_minor").notNull(),
  rightsModel: rightsModel("rights_model").notNull(),
  exclusiveTransfer: boolean("exclusive_transfer").notNull().default(false),
  previewObjectKey: text("preview_object_key"),
  sourceObjectKey: text("source_object_key"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("listings_status_category_idx").on(t.status, t.category), index("listings_creator_idx").on(t.creatorId)]);

export const purchases = pgTable("purchases", {
  id: uuid("id").defaultRandom().primaryKey(),
  listingId: uuid("listing_id").notNull().references(() => listings.id, { onDelete: "restrict" }),
  buyerId: uuid("buyer_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  sellerId: uuid("seller_id").notNull().references(() => creatorProfiles.id, { onDelete: "restrict" }),
  status: purchaseStatus("status").notNull().default("pending"),
  currency: varchar("currency", { length: 3 }).notNull(),
  amountMinor: integer("amount_minor").notNull(),
  paymentProvider: varchar("payment_provider", { length: 50 }),
  providerReference: text("provider_reference"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("purchases_buyer_idx").on(t.buyerId), index("purchases_seller_idx").on(t.sellerId)]);

// Snapshot the exact agreed terms at purchase time; do not silently mutate old agreements.
export const rightsAgreements = pgTable("rights_agreements", {
  id: uuid("id").defaultRandom().primaryKey(),
  purchaseId: uuid("purchase_id").notNull().references(() => purchases.id, { onDelete: "restrict" }),
  version: integer("version").notNull(),
  agreementType: rightsModel("agreement_type").notNull(),
  termsText: text("terms_text").notNull(),
  termsSha256: varchar("terms_sha256", { length: 64 }).notNull(),
  sellerSignedAt: timestamp("seller_signed_at", { withTimezone: true }),
  buyerSignedAt: timestamp("buyer_signed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("rights_agreements_purchase_version_unique").on(t.purchaseId, t.version)]);

export const rightsComplaints = pgTable("rights_complaints", {
  id: uuid("id").defaultRandom().primaryKey(),
  listingId: uuid("listing_id").references(() => listings.id, { onDelete: "set null" }),
  reporterId: uuid("reporter_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  description: text("description").notNull(),
  evidenceObjectKey: text("evidence_object_key"),
  status: varchar("status", { length: 30 }).notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
