import { db } from "../db/index.ts";
import { conversations, chat, aiSummary } from "../db/schema.ts";
import { eq, desc, sql, count } from "drizzle-orm";

export const AdminService = {
  /**
   * Get list of conversations with metadata
   */
  async getConversations() {
    // Get conversations with stats
    const results = await db
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

    return results;
  },

  /**
   * Get detailed conversation with all messages
   */
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
      summary: "",
    };
  },

  /**
   * Get conversation statistics
   */
  async getConversationStats(): Promise<{
    totalConversations: number;
    totalMessages: number;
    averageMessagesPerConversation: number;
  }> {
    // Total conversations
    const [{ totalConversations }] = await db
      .select({ totalConversations: count() })
      .from(conversations);

    // Total messages
    const [{ totalMessages }] = await db
      .select({ totalMessages: count() })
      .from(chat);

    // Average messages per conversation
    const averageMessagesPerConversation =
      totalConversations > 0
        ? Math.round((totalMessages / totalConversations) * 100) / 100
        : 0;

    return {
      totalConversations,
      totalMessages,
      averageMessagesPerConversation,
    };
  },
};
