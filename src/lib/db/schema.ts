import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  uuid,
  decimal,
  jsonb,
  index,
  unique,
} from "drizzle-orm/pg-core";

// ============================================
// Better Auth tables
// ============================================
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// ============================================
// Application tables
// ============================================

export const scanStatusEnum = pgEnum("scan_status", [
  "pending",
  "scanning",
  "completed",
  "failed",
]);

export const linkStatusEnum = pgEnum("link_status", [
  "healthy",
  "broken",
  "redirect",
  "timeout",
  "unchecked",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "broken_link",
  "scan_complete",
  "scan_failed",
  "weekly_report",
  "system",
]);

export const scanFrequencyEnum = pgEnum("scan_frequency", [
  "daily",
  "weekly",
  "biweekly",
  "monthly",
  "manual",
]);

export const urls = pgTable("urls", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  title: text("title"),
  platform: text("platform"),
  tags: jsonb("tags").$type<string[]>().default([]),
  totalLinks: integer("total_links").default(0),
  brokenLinks: integer("broken_links").default(0),
  scanFrequency: scanFrequencyEnum("scan_frequency").default("daily").notNull(),
  lastScannedAt: timestamp("last_scanned_at"),
  scanningLockedAt: timestamp("scanning_locked_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("urls_user_id_idx").on(table.userId),
  unique("urls_user_url_unique").on(table.userId, table.url),
]);

export const affiliateNetworks = pgTable("affiliate_networks", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  domain: text("domain"),
  patterns: jsonb("patterns").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const links = pgTable("links", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  urlId: uuid("url_id")
    .notNull()
    .references(() => urls.id, { onDelete: "cascade" }),
  networkId: uuid("network_id").references(() => affiliateNetworks.id),
  originalUrl: text("original_url").notNull(),
  resolvedUrl: text("resolved_url"),
  anchorText: text("anchor_text"),
  status: linkStatusEnum("status").default("unchecked").notNull(),
  httpStatusCode: integer("http_status_code"),
  isAffiliate: boolean("is_affiliate").default(false).notNull(),
  networkName: text("network_name"),
  suggestedReplacement: text("suggested_replacement"),
  lastCheckedAt: timestamp("last_checked_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("links_url_id_idx").on(table.urlId),
  index("links_user_id_idx").on(table.userId),
  index("links_affiliate_idx").on(table.urlId, table.isAffiliate),
]);

export const scans = pgTable("scans", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  urlId: uuid("url_id")
    .notNull()
    .references(() => urls.id, { onDelete: "cascade" }),
  status: scanStatusEnum("status").default("pending").notNull(),
  totalLinksFound: integer("total_links_found").default(0),
  affiliateLinksFound: integer("affiliate_links_found").default(0),
  brokenLinksFound: integer("broken_links_found").default(0),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("scans_url_id_idx").on(table.urlId),
  index("scans_user_id_idx").on(table.userId),
]);

export const earnings = pgTable("earnings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  networkId: uuid("network_id").references(() => affiliateNetworks.id),
  urlId: uuid("url_id").references(() => urls.id, { onDelete: "set null" }),
  networkName: text("network_name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD").notNull(),
  period: text("period").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("earnings_user_id_idx").on(table.userId),
  index("earnings_url_id_idx").on(table.urlId),
]);

export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  onboardingCompletedAt: timestamp("onboarding_completed_at"),
  onboardingState: jsonb("onboarding_state").$type<{
    currentStep: number;
    completedSteps: string[];
    urlAdded?: string;
  }>(),
  weeklyReportEnabled: boolean("weekly_report_enabled").default(true).notNull(),
  weeklyReportDay: integer("weekly_report_day").default(1).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const linkStatusHistory = pgTable("link_status_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  urlId: uuid("url_id")
    .notNull()
    .references(() => urls.id, { onDelete: "cascade" }),
  linkOriginalUrl: text("link_original_url").notNull(),
  networkName: text("network_name"),
  status: linkStatusEnum("status").notNull(),
  httpStatusCode: integer("http_status_code"),
  checkedAt: timestamp("checked_at").notNull().defaultNow(),
}, (table) => [
  index("lsh_url_id_idx").on(table.urlId),
  index("lsh_user_id_idx").on(table.userId),
]);

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  actionUrl: text("action_url"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("notif_user_read_idx").on(table.userId, table.isRead),
]);

export const activityLog = pgTable("activity_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("activity_user_created_idx").on(table.userId, table.createdAt),
]);

export const opportunities = pgTable("opportunities", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  urlId: uuid("url_id")
    .notNull()
    .references(() => urls.id, { onDelete: "cascade" }),
  linkOriginalUrl: text("link_original_url").notNull(),
  anchorText: text("anchor_text"),
  suggestedNetwork: text("suggested_network").notNull(),
  reason: text("reason").notNull(),
  isDismissed: boolean("is_dismissed").default(false).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contentSnapshots = pgTable("content_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  urlId: uuid("url_id")
    .notNull()
    .references(() => urls.id, { onDelete: "cascade" }),
  linkOriginalUrl: text("link_original_url").notNull(),
  contextHash: text("context_hash").notNull(),
  contextSnippet: text("context_snippet").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contentDrifts = pgTable("content_drifts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  urlId: uuid("url_id")
    .notNull()
    .references(() => urls.id, { onDelete: "cascade" }),
  linkOriginalUrl: text("link_original_url").notNull(),
  previousSnippet: text("previous_snippet").notNull(),
  currentSnippet: text("current_snippet").notNull(),
  previousHash: text("previous_hash").notNull(),
  currentHash: text("current_hash").notNull(),
  isReviewed: boolean("is_reviewed").default(false).notNull(),
  detectedAt: timestamp("detected_at").notNull().defaultNow(),
});

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  keyPrefix: text("key_prefix").notNull(),
  keyHash: text("key_hash").notNull().unique(),
  lastUsedAt: timestamp("last_used_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Type exports
export type ApiKey = typeof apiKeys.$inferSelect;
export type ContentSnapshot = typeof contentSnapshots.$inferSelect;
export type ContentDrift = typeof contentDrifts.$inferSelect;
export type Opportunity = typeof opportunities.$inferSelect;
export type ActivityLogEntry = typeof activityLog.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type LinkStatusHistoryRecord = typeof linkStatusHistory.$inferSelect;
export type UserPreference = typeof userPreferences.$inferSelect;
export type User = typeof user.$inferSelect;
export type Url = typeof urls.$inferSelect;
export type InsertUrl = typeof urls.$inferInsert;
export type Link = typeof links.$inferSelect;
export type InsertLink = typeof links.$inferInsert;
export type AffiliateNetwork = typeof affiliateNetworks.$inferSelect;
export type Scan = typeof scans.$inferSelect;
export type InsertScan = typeof scans.$inferInsert;
export type Earning = typeof earnings.$inferSelect;
export type InsertEarning = typeof earnings.$inferInsert;
