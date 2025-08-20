import { Context, Hono } from "hono";
import { z } from "zod";
import { db } from "../../db/index.ts";
import { chat, conversations } from "../../db/schema.ts";
import { eq } from "drizzle-orm";
import { chatSchema } from "./schema.ts";
import { validateReqBody } from "../../utils/index.ts";
import { cleanReply, generateReply } from "../../services/ai.service.ts";
import { ChatRepository } from "./repository.ts";
import { StartChatView } from "./views/index.tsx";
import { OngoingChatView } from "./views/ongoing.tsx";

const router = new Hono();

/// # Chat view
router.get("/view", async (c) => {
  return c.html(<StartChatView error={c.req.query("error")} />);
});
router.get("/view/:conversationId", async (c) => {
  const conversationId = c.req.param("conversationId");

  const messages = await ChatRepository.getConversationChats(conversationId);
  if (!messages || messages.length === 0) return c.notFound();
  return c.html(<OngoingChatView messages={messages} />);
});

router.post("/new", async (c) => {
  const formData = await c.req.formData();
  let message = formData.get("message");
  if (!message || typeof message !== "string")
    return c.redirect("/chat/view?error=missing_message");

  message = message.trim();

  const conversation = await ChatRepository.createConversation();

  await ChatRepository.addChat({
    message,
    role: "user",
    conversationId: conversation.id,
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
  // TODO fire and forget summarize and mood evaluator
  return c.redirect(`/chat/view/${conversation.id}`);
});

/// # Start/Continue conversation
router.post(
  "/",
  validateReqBody(chatSchema, async (c, data) => {
    const { conversation_id, message } = data;
    let conversationId = conversation_id;

    if (!conversationId) {
      const res = await ChatRepository.createConversation();
      conversationId = res.id;
    } else {
      const exists = await ChatRepository.findConversationById(conversationId);
      if (!exists) {
        return c.json({ error: "conversation not found" }, 404);
      }
    }

    const messageRes = await ChatRepository.addChat({
      message,
      role: "user",
      conversationId,
    });

    const chatHistory =
      await ChatRepository.getConversationChats(conversationId);

    // generate ai response here
    const reply = await generateReply({
      chatHistory: chatHistory,
      conversationSummary: "",
    });
    const assistantReply = cleanReply(reply.text);

    await ChatRepository.addChat({
      conversationId,
      message: assistantReply,
      role: "assistant",
    });

    // TODO generate current summary if needed

    return c.json({
      message: "Sent",
      data: {
        id: messageRes[0]?.id,
        conversation_id: conversationId,
        reply: assistantReply,
      },
    });
  }),
);

router.get("/", async (c) => {
  const result = await db.select().from(conversations);
  return c.json({ data: result });
});
/// # GET conversations
router.get("/:conversationId", async (c) => {
  const conversationId = c.req.param("conversationId");
  const parsedId = z.string().uuid().safeParse(conversationId);
  if (!parsedId.success) {
    return c.json({ error: "Invalid conversation id" }, 400);
  }

  const result = await ChatRepository.getConversationChats(conversationId);

  return c.json({ data: result });
});

export default router;
