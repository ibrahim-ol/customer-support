import { generateText, CoreMessage, tool } from "ai";
import { z } from "zod";
import { like, or } from "drizzle-orm";
import { replyModel } from "../utils/models.ts";
import { Config } from "../utils/config.ts";
import { MoodCategory, MOOD_ENUM } from "../types/mood.ts";
import { db } from "../db/index.ts";
import { product } from "../db/schema.ts";

// Re-export for backward compatibility
export type { MoodCategory };

const instructions = [
  "You are an helpful customer support assistant.",
  "You are an expert customer support assistant for my company.",
  "We don't offer products physical.",
  "We offer specialized web services like building landing pages, campaign website, web front stores.",
  "If you need more context about the available services, there is a tool available for you to call to get the full list of services",
  "Do not tell the user that you are a computer program",
  "If asked tell them that you are an helpful customer service assistant.",
  `
    Your role is to:
    - Answer only questions related to the company and its services and a customer support assistant.
    - Politely refuse or redirect if a user asks about something outside your domain.

    Rules:
    1. Stay strictly within the acting as a customer support assistant.
    2. If a request is unrelated, respond with:
       "I’m focused on supporting customers and can’t help with that. Please ask me something related to the company and its services."
    3. Never try to answer off-topic requests.
    4. Maintain a friendly and professional tone at all times.`,
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
    messages,
    tools: {
      getProducts: tool({
        description:
          "Get the list of available services and products offered by the company. Use this when customers ask about services, pricing, or what the company offers.",
        parameters: z.object({
          query: z
            .string()
            .optional()
            .describe(
              "Optional search query to filter products by name or description",
            ),
        }),
        execute: async ({ query }) => {
          try {
            let products;
            if (query) {
              // Search products by name or description containing the query
              products = await db
                .select()
                .from(product)
                .where(
                  or(
                    like(product.name, `%${query}%`),
                    like(product.description, `%${query}%`),
                  ),
                );
            } else {
              // Get all products
              products = await db.select().from(product);
            }

            return {
              success: true,
              products: products.map((p) => ({
                name: p.name,
                price: p.price,
                description: p.description,
              })),
            };
          } catch (error) {
            return {
              success: false,
              error: "Failed to fetch products",
              products: [],
            };
          }
        },
      }),
    },
    maxSteps: 2,
  });

  return result;
}

export function cleanReply(aiReply: string) {
  // TODO remove the thinking part from deepseek r1
  return aiReply;
}

export async function generateSummary(args: {
  chatHistory: { role: "assistant" | "user"; message: string }[];
  previousSummary?: string;
}) {
  const summaryInstructions = [
    "You are a conversation summarizer.",
    "Create a concise summary of this customer support conversation.",
    "Focus on the customer's main issues, questions, and any solutions provided.",
    "Keep the summary under 200 words.",
    "If there's a previous summary provided, update it with new information from the chat history.",
    "Include key details about services discussed, problems raised, and resolutions offered.",
  ];

  const messages: CoreMessage[] = [
    {
      role: "system",
      content: summaryInstructions.join("\n"),
    },
  ];

  if (args.previousSummary) {
    messages.push({
      role: "user",
      content: `Previous summary: ${args.previousSummary}\n\nNew conversation to incorporate:`,
    });
  }

  messages.push({
    role: "user",
    content: args.chatHistory.map((h) => `${h.role}: ${h.message}`).join("\n"),
  });

  const result = await generateText({
    model: replyModel(),
    messages,
  });

  return result.text;
}

export async function classifyMood(args: {
  chatHistory: { role: "assistant" | "user"; message: string }[];
}): Promise<MoodCategory> {
  const moodInstructions = [
    "You are a mood classifier for customer support conversations.",
    "Analyze the customer's messages to determine their overall mood.",
    "You must respond with ONLY one of these 8 categories:",
    "- happy: Customer is pleased, grateful, or expressing satisfaction",
    "- frustrated: Customer is annoyed but not extremely angry",
    "- confused: Customer doesn't understand something or needs clarification",
    "- angry: Customer is very upset, using strong language, or demanding escalation",
    "- satisfied: Customer's issue has been resolved and they seem content",
    "- neutral: Customer is polite and matter-of-fact, no strong emotions",
    "- excited: Customer is enthusiastic about services or solutions",
    "- disappointed: Customer expected more or something didn't meet expectations",
    "",
    "Focus primarily on the customer's (user) messages, not the assistant's responses.",
    "Consider the most recent messages more heavily than older ones.",
    "Respond with ONLY the category name, nothing else.",
  ];

  // Only include user messages for mood analysis
  const userMessages = args.chatHistory.filter((h) => h.role === "user");

  const messages: CoreMessage[] = [
    {
      role: "system",
      content: moodInstructions.join("\n"),
    },
    {
      role: "user",
      content: userMessages.map((h) => h.message).join("\n"),
    },
  ];

  const result = await generateText({
    model: replyModel(),
    messages,
  });

  const mood = result.text.trim().toLowerCase() as MoodCategory;

  // Validate the response is one of our expected categories
  if (MOOD_ENUM.includes(mood as any)) {
    return mood;
  }

  // Default to neutral if classification fails
  return "neutral";
}
