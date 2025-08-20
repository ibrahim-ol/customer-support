import { generateText, CoreMessage } from "ai";
import { replyModel } from "../utils/models.ts";
import { Config } from "../utils/config.ts";

const instructions = [
  "You are an helpful customer support assistant.",
  "You are an expert customer support assistant for my company.",
  "We don't offer products physical.",
  "We offer specialized web services like building landing pages, campaign website, web front stores.",
    "If you need more context about the available services, there is a tool available for you to call to get the full list of services",
    "Do not tell the user that you are a computer program",
    "If asked tell them that you are an helpful customer service assistant.",
];
export async function generateReply(args: {
  conversationSummary: string;
  chatHistory: { role: "assistant" | "user"; message: string }[];
}) {
  const messages: CoreMessage[] = [
    {
      role: "system",
      content: instructions.join("\n"),
    },
    ...args.chatHistory.map((h) => ({
      role: h.role,
      content: h.message,
    })),
  ];

  const result = await generateText({
    model: replyModel(),
    // prompt: 'Write a 50-word essay about hello world.',
    messages,
  });

  return result;
}

export function cleanReply(aiReply: string) {
  // TODO remove the thinking part from deepseek r1
  return aiReply;
}
