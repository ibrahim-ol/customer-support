import { eq, desc, sql, count } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { chat, conversations } from "../../db/schema.ts";

export const ChatRepository = {
  getConversationChats(conversationId: string) {
    return db
      .select()
      .from(chat)
      .where(eq(chat.conversationId, conversationId));
  },

  async addChat(args: typeof chat.$inferInsert) {
    const result = await db.insert(chat).values(args).returning();
    return result[0];
  },

  async createConversation() {
    const res = await db
      .insert(conversations)
      .values({ customerName: "anonymous", channel: "unknown" })
      .returning({ id: conversations.id });
    return res[0];
  },

  async findConversationById(id: string) {
    const conversation = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id))
      .limit(1);
    return conversation[0];
  },

  async getConversationsWithStats() {
    return db
      .select({
        id: conversations.id,
        customerName: conversations.customerName,
        channel: conversations.channel,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
        messageCount: sql<number>`count(${chat.id})`.as("messageCount"),
        lastMessage: sql<string>`max(${chat.message})`.as("lastMessage"),
        lastMessageAt: sql<Date>`max(${chat.createdAt})`.as("lastMessageAt"),
      })
      .from(conversations)
      .leftJoin(chat, eq(conversations.id, chat.conversationId))
      .groupBy(conversations.id)
      .orderBy(desc(conversations.updatedAt));
  },

  async getConversationDetails(id: string) {
    const conversation = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id))
      .limit(1);

    if (!conversation[0]) return null;

    const messages = await db
      .select()
      .from(chat)
      .where(eq(chat.conversationId, id))
      .orderBy(chat.createdAt);

    return {
      ...conversation[0],
      messages,
    };
  },
};
