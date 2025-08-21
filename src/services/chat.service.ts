import { ChatRepository } from "../routes/chat/repository.ts";
import { classifyMood, generateSummary } from "./ai.service.ts";

export const ChatService = {
  async updateConversationMood(conversationId: string, messageId: string) {
    const chatHistory = await ChatRepository.getConversationChats(
      conversationId
    );

    const userMood = await classifyMood({
      chatHistory,
    });

    await Promise.all([
      ChatRepository.updateConversationMood({
        conversationId: conversationId,
        mood: userMood,
      }),
      ChatRepository.saveMoodTracking({
        conversationId: conversationId,
        mood: userMood,
        messageId: messageId,
      }),
    ]);
  },

  async updateSummary(conversationId: string) {
    // load chat chatHistory
    const chatHistory = await ChatRepository.getConversationChats(
      conversationId
    );
    const existingSummary = await ChatRepository.getLatestSummary(
      conversationId
    );
    // Generate summary after assistant reply
    const summary = await generateSummary({
      chatHistory,
      previousSummary: existingSummary?.summary,
    });

    ChatRepository.saveSummary({
      conversationId: conversationId,
      summary,
    });
  },
};
