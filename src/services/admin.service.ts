import { db } from "../db/index.ts";
import { conversations, chat, aiSummary, product } from "../db/schema.ts";
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
        status: conversations.status,
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

  /**
   * Kill a conversation - prevents further user messages
   */
  async killConversation(id: string): Promise<boolean> {
    try {
      const result = await db
        .update(conversations)
        .set({
          status: "killed",
          updatedAt: new Date(),
        })
        .where(eq(conversations.id, id));

      return true;
    } catch (error) {
      console.error("Error killing conversation:", error);
      return false;
    }
  },

  /**
   * Reactivate a killed conversation
   */
  async reactivateConversation(id: string): Promise<boolean> {
    try {
      const result = await db
        .update(conversations)
        .set({
          status: "active",
          updatedAt: new Date(),
        })
        .where(eq(conversations.id, id));

      return true;
    } catch (error) {
      console.error("Error reactivating conversation:", error);
      return false;
    }
  },

  /**
   * Get all products
   */
  async getProducts() {
    return await db.select().from(product).orderBy(desc(product.createdAt));
  },

  /**
   * Get a single product by ID
   */
  async getProductById(id: string) {
    const result = await db
      .select()
      .from(product)
      .where(eq(product.id, id))
      .limit(1);

    return result[0] || null;
  },

  /**
   * Create a new product
   */
  async createProduct(data: {
    name: string;
    price: number;
    description: string;
  }) {
    try {
      const [newProduct] = await db
        .insert(product)
        .values({
          name: data.name,
          price: data.price,
          description: data.description,
        })
        .returning();

      return newProduct;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  /**
   * Update an existing product
   */
  async updateProduct(
    id: string,
    data: {
      name: string;
      price: number;
      description: string;
    },
  ) {
    try {
      const [updatedProduct] = await db
        .update(product)
        .set({
          name: data.name,
          price: data.price,
          description: data.description,
          updatedAt: new Date(),
        })
        .where(eq(product.id, id))
        .returning();

      return updatedProduct;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<boolean> {
    try {
      await db.delete(product).where(eq(product.id, id));

      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  },
};
