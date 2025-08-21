import { Context, Hono } from "hono";
import { z } from "zod";
import { db } from "../../db/index.ts";
import { conversations } from "../../db/schema.ts";
import { chatSchema } from "./schema.ts";
import { validateReqBody } from "../../utils/index.ts";
import {
  cleanReply,
  generateReply,
  generateSummary,
  classifyMood,
} from "../../services/ai.service.ts";
import { ChatRepository } from "./repository.ts";
import { RenderClientView } from "../../utils/view.tsx";
import {
  chatRateLimit,
  conversationRateLimit,
  apiRateLimit,
  strictRateLimit,
} from "../../middleware/rateLimit.ts";

const router = new Hono();

/// # Chat view
router.get("/new", async (c) => {
  return c.html(<RenderClientView name="new-chat" />);
});
router.get("/view/:conversationId", async (c) => {
  return c.html(<RenderClientView name="ongoing-chat" />);
});

router.post("/new", conversationRateLimit, async (c) => {
  const formData = await c.req.formData();
  let message = formData.get("message");
  if (!message || typeof message !== "string")
    return c.redirect("/chat/view?error=missing_message");

  message = message.trim();

  const conversation = await ChatRepository.createConversation("web_chat");

  const messageRes = await ChatRepository.addChat({
    message,
    role: "user",
    conversationId: conversation.id,
  });

  // Classify user mood before generating reply
  const userMood = await classifyMood({
    chatHistory: [{ message, role: "user" }],
  });

  const reply = await generateReply({
    chatHistory: [{ message, role: "user" }],
    conversationSummary: "",
  });
  const assistantReply = cleanReply(reply.text);

  await ChatRepository.addChat({
    conversationId: conversation.id,
    message: assistantReply,
    role: "assistant",
  });

  // Generate summary after assistant reply
  const summary = await generateSummary({
    chatHistory: [
      { message, role: "user" },
      { message: assistantReply, role: "assistant" },
    ],
  });

  // Save mood to both conversation table and mood tracking table
  await Promise.all([
    ChatRepository.updateConversationMood({
      conversationId: conversation.id,
      mood: userMood,
    }),
    ChatRepository.saveMoodTracking({
      conversationId: conversation.id,
      mood: userMood,
      messageId: messageRes.id,
    }),
  ]);

  await ChatRepository.saveSummary({
    conversationId: conversation.id,
    summary,
  });
  return c.redirect(`/chat/view/${conversation.id}`);
});

/// # Start/Continue conversation
router.post(
  "/",
  strictRateLimit,
  validateReqBody(chatSchema, async (c, data) => {
    const { conversation_id, message } = data;
    let conversationId = conversation_id;

    if (!conversationId) {
      const res = await ChatRepository.createConversation("web_chat");
      conversationId = res.id;
    } else {
      const exists = await ChatRepository.findConversationById(conversationId);
      if (!exists) {
        return c.json({ error: "conversation not found" }, 404);
      }

      // Check if conversation is killed
      if (exists.status === "killed") {
        return c.json(
          {
            error:
              "This conversation has been closed and cannot accept new messages",
          },
          403,
        );
      }
    }

    const messageRes = await ChatRepository.addChat({
      message,
      role: "user",
      conversationId,
    });

    const chatHistory =
      await ChatRepository.getConversationChats(conversationId);

    // Classify user mood before generating reply
    const userMood = await classifyMood({
      chatHistory: [...chatHistory, { message, role: "user" }],
    });

    // generate ai response here
    const reply = await generateReply({
      chatHistory: chatHistory,
      conversationSummary: "",
    });
    const assistantReply = cleanReply(reply.text);

    const assistantMessage = await ChatRepository.addChat({
      conversationId,
      message: assistantReply,
      role: "assistant",
    });

    // Generate summary after assistant reply
    const updatedChatHistory = [
      ...chatHistory,
      { message, role: "user" as const },
      { message: assistantReply, role: "assistant" as const },
    ];

    // Get existing summary to update it
    const existingSummary =
      await ChatRepository.getLatestSummary(conversationId);
    const summary = await generateSummary({
      chatHistory: updatedChatHistory,
      previousSummary: existingSummary?.summary,
    });

    // Save mood to both conversation table and mood tracking table
    await Promise.all([
      ChatRepository.updateConversationMood({
        conversationId,
        mood: userMood,
      }),
      ChatRepository.saveMoodTracking({
        conversationId,
        mood: userMood,
        messageId: messageRes.id,
      }),
    ]);

    await ChatRepository.updateSummary({
      conversationId,
      summary,
    });

    return c.json({
      message: "Sent",
      data: {
        request: messageRes,
        reply: assistantMessage,
      },
    });
  }),
);

router.get("/", apiRateLimit, async (c) => {
  const result = await db.select().from(conversations);
  return c.json({ data: result });
});
/// # GET conversations
router.get("/:conversationId", apiRateLimit, async (c) => {
  const conversationId = c.req.param("conversationId");
  const parsedId = z.string().uuid().safeParse(conversationId);
  if (!parsedId.success) {
    return c.json({ error: "Invalid conversation id" }, 400);
  }

  const result = await ChatRepository.getConversationChats(conversationId);

  return c.json({ data: result });
});

/// # GET conversation analytics (mood and summary)
router.get("/:conversationId/analytics", apiRateLimit, async (c) => {
  const conversationId = c.req.param("conversationId");
  const parsedId = z.string().uuid().safeParse(conversationId);
  if (!parsedId.success) {
    return c.json({ error: "Invalid conversation id" }, 400);
  }

  const [conversation, summary, moodAnalytics] = await Promise.all([
    ChatRepository.findConversationById(conversationId),
    ChatRepository.getLatestSummary(conversationId),
    ChatRepository.getMoodAnalytics(conversationId),
  ]);

  if (!conversation) {
    return c.json({ error: "Conversation not found" }, 404);
  }

  return c.json({
    data: {
      conversationId,
      summary: summary?.summary || null,
      currentMood: conversation.mood,
      analytics: moodAnalytics,
    },
  });
});

/// # GET detailed mood history
router.get("/:conversationId/mood-history", apiRateLimit, async (c) => {
  const conversationId = c.req.param("conversationId");
  const parsedId = z.string().uuid().safeParse(conversationId);
  if (!parsedId.success) {
    return c.json({ error: "Invalid conversation id" }, 400);
  }

  const moodHistory = await ChatRepository.getMoodHistory(conversationId);

  if (moodHistory.length === 0) {
    return c.json({
      data: {
        conversationId,
        moodHistory: [],
        totalEntries: 0,
      },
    });
  }

  return c.json({
    data: {
      conversationId,
      moodHistory,
      totalEntries: moodHistory.length,
    },
  });
});

export default router;
