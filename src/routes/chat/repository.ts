import { eq, desc, sql, count } from "drizzle-orm";
import { db } from "../../db/index.ts";
import {
  chat,
  conversations,
  aiSummary,
  moodTracking,
} from "../../db/schema.ts";
import { MoodCategory } from "../../types/mood.ts";

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

  async createConversation(channel: string, customerName?: string) {
    const res = await db
      .insert(conversations)
      .values({ customerName: customerName ?? "anonymous", channel })
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
        status: conversations.status,
        mood: conversations.mood,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
        messageCount: sql<number>`count(${chat.id})`.as("messageCount"),
        lastMessage: sql<string>`max(${chat.message})`.as("lastMessage"),
        lastMessageAt: sql<Date>`max(${chat.createdAt})`
          .mapWith((v) => new Date(v * 1000))
          .as("lastMessageAt"),
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

  async saveSummary(args: { conversationId: string; summary: string }) {
    const result = await db
      .insert(aiSummary)
      .values({
        conversationId: args.conversationId,
        summary: args.summary,
      })
      .returning();
    return result[0];
  },

  async updateSummary(args: { conversationId: string; summary: string }) {
    // First try to update existing summary
    const existingSummary = await db
      .select()
      .from(aiSummary)
      .where(eq(aiSummary.conversationId, args.conversationId))
      .limit(1);

    if (existingSummary.length > 0) {
      const result = await db
        .update(aiSummary)
        .set({
          summary: args.summary,
          updatedAt: new Date(),
        })
        .where(eq(aiSummary.conversationId, args.conversationId))
        .returning();
      return result[0];
    } else {
      // If no existing summary, create a new one
      return this.saveSummary(args);
    }
  },

  async updateConversationMood(args: {
    conversationId: string;
    mood: MoodCategory;
  }) {
    const result = await db
      .update(conversations)
      .set({
        mood: args.mood,
        updatedAt: new Date(),
      })
      .where(eq(conversations.id, args.conversationId))
      .returning();
    return result[0];
  },

  async getLatestSummary(conversationId: string) {
    const summary = await db
      .select({ summary: aiSummary.summary })
      .from(aiSummary)
      .where(eq(aiSummary.conversationId, conversationId))
      .orderBy(desc(aiSummary.updatedAt))
      .limit(1);
    return summary[0];
  },

  async saveMoodTracking(args: {
    conversationId: string;
    mood: MoodCategory;
    messageId?: string;
  }) {
    const result = await db
      .insert(moodTracking)
      .values({
        conversationId: args.conversationId,
        mood: args.mood,
        messageId: args.messageId,
      })
      .returning();
    return result[0];
  },

  async getMoodHistory(conversationId: string) {
    return db
      .select()
      .from(moodTracking)
      .where(eq(moodTracking.conversationId, conversationId))
      .orderBy(desc(moodTracking.createdAt));
  },

  async getLatestMoodFromHistory(conversationId: string) {
    const mood = await db
      .select()
      .from(moodTracking)
      .where(eq(moodTracking.conversationId, conversationId))
      .orderBy(desc(moodTracking.createdAt))
      .limit(1);
    return mood[0];
  },

  async getMoodAnalytics(conversationId: string) {
    const moodHistory = await this.getMoodHistory(conversationId);

    if (moodHistory.length === 0) {
      return {
        totalEntries: 0,
        currentMood: null,
        previousMood: null,
        moodChanged: false,
        moodDistribution: {},
        sentiment: "neutral",
      };
    }

    // Calculate mood distribution
    const moodCounts: Record<string, number> = {};
    moodHistory.forEach((entry) => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    // Determine overall sentiment trend
    const positiveMoods = ["happy", "satisfied", "excited"];
    const negativeMoods = ["angry", "frustrated", "disappointed"];
    const neutralMoods = ["neutral", "confused"];

    const positiveCount = positiveMoods.reduce(
      (sum, mood) => sum + (moodCounts[mood] || 0),
      0,
    );
    const negativeCount = negativeMoods.reduce(
      (sum, mood) => sum + (moodCounts[mood] || 0),
      0,
    );
    const neutralCount = neutralMoods.reduce(
      (sum, mood) => sum + (moodCounts[mood] || 0),
      0,
    );

    let overallSentiment: "positive" | "negative" | "neutral";
    if (positiveCount > negativeCount && positiveCount > neutralCount) {
      overallSentiment = "positive";
    } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
      overallSentiment = "negative";
    } else {
      overallSentiment = "neutral";
    }

    return {
      totalEntries: moodHistory.length,
      currentMood: moodHistory[0]?.mood || null,
      previousMood: moodHistory[1]?.mood || null,
      moodChanged:
        moodHistory.length > 1 && moodHistory[0]?.mood !== moodHistory[1]?.mood,
      moodDistribution: moodCounts,
      sentiment: overallSentiment,
      positiveCount,
      negativeCount,
      neutralCount,
    };
  },

  async getMessagesWithMood(conversationId: string) {
    return db
      .select({
        id: chat.id,
        message: chat.message,
        role: chat.role,
        userId: chat.userId,
        conversationId: chat.conversationId,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        mood: moodTracking.mood,
        moodCreatedAt: moodTracking.createdAt,
      })
      .from(chat)
      .leftJoin(moodTracking, eq(chat.id, moodTracking.messageId))
      .where(eq(chat.conversationId, conversationId))
      .orderBy(chat.createdAt);
  },
};
