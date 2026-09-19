import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const articleStats = sqliteTable("article_stats", {
  slug: text("slug").primaryKey(),
  impressions: integer("impressions").notNull().default(0),
});

export const articleLikes = sqliteTable("article_likes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(),
  visitorId: text("visitor_id").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("article_likes_slug_visitor").on(table.slug, table.visitorId),
]);

export const articleComments = sqliteTable("article_comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  body: text("body").notNull(),
  approved: integer("approved", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
