import z from "zod";

export const chatSchema = z.object({
    conversation_id: z.string().uuid().optional(),
    message: z.string().min(1, "message is required"),
  });
  