import { db } from "../db/index.ts";
import {
  conversations,
  chat,
  aiSummary,
  product,
  moodTracking,
} from "../db/schema.ts";
import { eq, desc, sql, count } from "drizzle-orm";
import {
  MoodCategory,
  negativeMoods,
  neutralMoods,
  positiveMoods,
} from "../types/mood.ts";
import {
  ConversationStatsData,
  MoodAnalyticsData,
} from "../types/responses.ts";
import { getMoodScore } from "../frontend/components/utils.tsx";
import { ChatRepository } from "../routes/chat/repository.ts";

export const AdminService = {
  /**
   * Get list of conversations with metadata
   */
  async getConversations() {
    // Get conversations with stats and summary preview
    const results = await ChatRepository.getConversationsWithStats();

    // Get summary previews for each conversation
    const conversationsWithSummary = await Promise.all(
      results.map(async (conversation) => {
        const summaryResult = await ChatRepository.getLatestSummary(
          conversation.id,
        );

        const summaryPreview = summaryResult?.summary
          ? summaryResult.summary.substring(0, 100) +
            (summaryResult.summary.length > 100 ? "..." : "")
          : "";

        return {
          ...conversation,
          summaryPreview,
        };
      }),
    );

    return conversationsWithSummary;
  },

  /**
   * Get detailed conversation with all messages
   */
  async getConversationDetails(id: string) {
    const conversation = await ChatRepository.findConversationById(id);

    if (!conversation) return null;

    const messages = await ChatRepository.getMessagesWithMood(id);

    // Get the latest summary for this conversation
    const summaryResult = await ChatRepository.getLatestSummary(id);

    const summary = summaryResult?.summary || "";

    return {
      ...conversation,
      messages,
      summary,
    };
  },

  /**
   * Get conversation statistics
   */
  async getConversationStats(): Promise<ConversationStatsData> {
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

    // Mood statistics
    const allMoodEntries = await db.select().from(moodTracking);

    const positiveMoods: MoodCategory[] = ["happy", "satisfied", "excited"];
    const negativeMoods: MoodCategory[] = [
      "angry",
      "frustrated",
      "disappointed",
    ];
    const neutralMoods: MoodCategory[] = ["neutral", "confused"];

    const positiveCount = allMoodEntries.filter((entry) =>
      positiveMoods.includes(entry.mood),
    ).length;

    const negativeCount = allMoodEntries.filter((entry) =>
      negativeMoods.includes(entry.mood),
    ).length;

    const neutralCount = allMoodEntries.filter((entry) =>
      neutralMoods.includes(entry.mood),
    ).length;

    return {
      totalConversations,
      totalMessages,
      averageMessagesPerConversation,
      moodStats: {
        positiveCount,
        negativeCount,
        neutralCount,
        totalMoodEntries: allMoodEntries.length,
      },
    };
  },

  /**
   * Get mood analytics for all conversations
   */
  async getMoodAnalytics(): Promise<MoodAnalyticsData> {
    // Get all mood tracking entries
    const allMoodEntries = await db
      .select()
      .from(moodTracking)
      .orderBy(desc(moodTracking.createdAt));

    // Get current mood distribution from conversations
    const currentMoods = await db
      .select({ mood: conversations.mood })
      .from(conversations);

    // Calculate overall mood distribution
    const overallMoodDistribution: Record<MoodCategory, number> = {
      happy: 0,
      frustrated: 0,
      confused: 0,
      angry: 0,
      satisfied: 0,
      neutral: 0,
      excited: 0,
      disappointed: 0,
      curious: 0,
    };

    allMoodEntries.forEach((entry) => {
      overallMoodDistribution[entry.mood]++;
    });

    // Calculate current mood distribution
    const currentMoodDistribution: Record<MoodCategory, number> = {
      happy: 0,
      frustrated: 0,
      confused: 0,
      angry: 0,
      satisfied: 0,
      neutral: 0,
      excited: 0,
      disappointed: 0,
      curious: 0,
    };

    currentMoods.forEach((mood) => {
      currentMoodDistribution[mood.mood]++;
    });

    const sentimentBreakdown = {
      positive: positiveMoods.reduce(
        (sum, mood) => sum + overallMoodDistribution[mood],
        0,
      ),
      negative: negativeMoods.reduce(
        (sum, mood) => sum + overallMoodDistribution[mood],
        0,
      ),
      neutral: neutralMoods.reduce(
        (sum, mood) => sum + overallMoodDistribution[mood],
        0,
      ),
    };

    // Mood trends analysis (simple implementation)
    const conversationMoodChanges = await db
      .select({
        conversationId: moodTracking.conversationId,
        mood: moodTracking.mood,
        createdAt: moodTracking.createdAt,
      })
      .from(moodTracking)
      .orderBy(moodTracking.conversationId, moodTracking.createdAt);

    let improving = 0;
    let declining = 0;
    let stable = 0;

    // Group by conversation and analyze trends
    const conversationGroups: Record<
      string,
      Array<{ mood: MoodCategory; createdAt: Date }>
    > = {};
    conversationMoodChanges.forEach((entry) => {
      if (!conversationGroups[entry.conversationId]) {
        conversationGroups[entry.conversationId] = [];
      }
      conversationGroups[entry.conversationId].push({
        mood: entry.mood,
        createdAt: entry.createdAt,
      });
    });

    Object.values(conversationGroups).forEach((moodHistory) => {
      if (moodHistory.length < 2) {
        stable++;
        return;
      }

      const firstMood = moodHistory[0].mood;
      const lastMood = moodHistory[moodHistory.length - 1].mood;

      const scoreDiff = getMoodScore(lastMood) - getMoodScore(firstMood);
      if (scoreDiff > 0) improving++;
      else if (scoreDiff < 0) declining++;
      else stable++;
    });

    return {
      overallMoodDistribution,
      totalMoodEntries: allMoodEntries.length,
      sentimentBreakdown,
      currentMoodDistribution,
      moodTrends: {
        improving,
        declining,
        stable,
      },
    };
  },

  /**
   * Get mood analytics for a specific conversation
   */
  async getConversationMoodAnalytics(conversationId: string) {
    const moodHistory = await db
      .select()
      .from(moodTracking)
      .where(eq(moodTracking.conversationId, conversationId))
      .orderBy(desc(moodTracking.createdAt));

    const conversation = await db
      .select({ mood: conversations.mood })
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    return {
      conversationId,
      currentMood: conversation[0]?.mood || null,
      moodHistory,
      totalEntries: moodHistory.length,
      moodChanged:
        moodHistory.length > 1 && moodHistory[0]?.mood !== moodHistory[1]?.mood,
    };
  },

  /**
   * Kill a conversation - prevents further user messages
   */
  async killConversation(id: string): Promise<boolean> {
    try {
      await db
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
      await db
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

  /**
   * Get recent conversation summaries for dashboard
   */
  async getRecentConversationSummaries(limit: number = 5) {
    try {
      const results = await db
        .select({
          id: conversations.id,
          customerName: conversations.customerName,
          channel: conversations.channel,
          mood: conversations.mood,
          status: conversations.status,
          createdAt: conversations.createdAt,
          updatedAt: conversations.updatedAt,
          summary: aiSummary.summary,
          summaryUpdatedAt: aiSummary.updatedAt,
        })
        .from(conversations)
        .innerJoin(aiSummary, eq(conversations.id, aiSummary.conversationId))
        .orderBy(desc(aiSummary.updatedAt))
        .limit(limit);

      return results;
    } catch (error) {
      console.error("Error fetching recent summaries:", error);
      return [];
    }
  },
};
