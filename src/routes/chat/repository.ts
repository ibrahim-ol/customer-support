import { eq } from "drizzle-orm";
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
};
