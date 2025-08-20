import { db } from "./index.ts";
import { conversations, chat, moodTracking, aiSummary } from "./schema.ts";
import conversationData from "../data/conversations.json" with { type: "json" };
import { MoodCategory } from "../types/mood.ts";

async function seedConversations() {
  try {
    console.log("🌱 Seeding conversations...");

    // Clear existing data in reverse dependency order
    await db.delete(moodTracking);
    await db.delete(aiSummary);
    await db.delete(chat);
    await db.delete(conversations);
    console.log("  ✓ Cleared existing conversation data");

    let totalMessages = 0;
    let totalMoodTracking = 0;

    for (const conversationItem of conversationData) {
      // Insert conversation record
      const [insertedConversation] = await db
        .insert(conversations)
        .values({
          channel: conversationItem.channel,
          customerName: conversationItem.customerName,
          // Set mood to the last user message's mood or default to neutral
          mood: getLastUserMood(conversationItem.messages) || "neutral",
        })
        .returning();

      console.log(`  → Created conversation: ${conversationItem.customerName}`);

      // Insert messages and track moods
      for (const message of conversationItem.messages) {
        const [insertedMessage] = await db
          .insert(chat)
          .values({
            message: message.message,
            role: message.role as "user" | "assistant",
            userId: null, // Customer support context
            conversationId: insertedConversation.id,
          })
          .returning();

        totalMessages++;

        // Create mood tracking entry for user messages
        if (message.role === "user" && message.mood) {
          await db.insert(moodTracking).values({
            conversationId: insertedConversation.id,
            mood: message.mood as MoodCategory,
            messageId: insertedMessage.id,
          });
          totalMoodTracking++;
        }
      }

      // Insert AI summary
      await db.insert(aiSummary).values({
        conversationId: insertedConversation.id,
        summary: conversationItem.summary,
      });
    }

    console.log(`  ✓ Inserted ${conversationData.length} conversations`);
    console.log(`  ✓ Inserted ${totalMessages} messages`);
    console.log(`  ✓ Inserted ${totalMoodTracking} mood tracking entries`);
    console.log(`  ✓ Inserted ${conversationData.length} AI summaries`);
    console.log("🎉 Conversation seeding completed successfully!");

    // Log summary of conversations
    conversationData.forEach((conv, index) => {
      const userMessages = conv.messages.filter(
        (m) => m.role === "user",
      ).length;
      const assistantMessages = conv.messages.filter(
        (m) => m.role === "assistant",
      ).length;
      console.log(
        `    ${index + 1}. ${conv.customerName} (${conv.channel}) - ${userMessages}U/${assistantMessages}A messages`,
      );
    });
  } catch (error) {
    console.error("❌ Error seeding conversations:", error);
    throw error;
  }
}

// Helper function to get the last user's mood from messages
function getLastUserMood(
  messages: Array<{ role: string; mood?: string }>,
): MoodCategory | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user" && messages[i].mood) {
      return messages[i].mood! as MoodCategory;
    }
  }
  return null;
}

// Run the seed function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedConversations()
    .then(() => {
      console.log("Conversation seeding process completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Conversation seeding process failed:", error);
      process.exit(1);
    });
}

export { seedConversations };
