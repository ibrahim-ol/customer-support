import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { dbId } from "../utils/index.ts";
import { timestamp } from "drizzle-orm/mysql-core";
import { MOOD_ENUM } from "../types/mood.ts";

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
};
export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey().$defaultFn(dbId),
  customerName: text("customer_name").notNull(),
  channel: text("channel").notNull(),
  status: text("status", { enum: ["active", "killed"] })
    .notNull()
    .default("active"),
  mood: text("mood", { enum: MOOD_ENUM }).notNull().default("neutral"),
  ...timestamps,
});
export const chat = sqliteTable("chat", {
  id: text("id").primaryKey().$defaultFn(dbId),
  message: text("message").notNull(),
  role: text("role", { enum: ["user", "assistant"] }).notNull(),
  userId: integer("user_id"),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const product = sqliteTable("product", {
  id: text("id").primaryKey().$defaultFn(dbId),
  name: text("name").notNull(),
  price: real("price").notNull(),
  description: text("description").notNull(),
  ...timestamps,
});

export const aiSummary = sqliteTable("ai_summary", {
  id: text("id").primaryKey().$defaultFn(dbId),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  summary: text("summary").notNull(),
  ...timestamps,
});

export const moodTracking = sqliteTable("mood_tracking", {
  id: text("id").primaryKey().$defaultFn(dbId),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  mood: text("mood", { enum: MOOD_ENUM }).notNull(),
  messageId: text("message_id").references(() => chat.id, {
    onDelete: "cascade",
  }),
  ...timestamps,
});
