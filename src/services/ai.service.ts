import { generateText, stepCountIs, ModelMessage } from "ai";
import { replyModel, summaryModel } from "../utils/models.ts";
import { MoodCategory, MOOD_ENUM } from "../types/mood.ts";

import { getProducts } from "./tools.service.ts";
import { Constants } from "../utils/constants.ts";

const instructions = [
  "You are a helpful customer support assistant.",
  `You are an expert customer support assistant for ${Constants.APP_NAME} Software Solutions.`,
  "We don't offer physical products - only web services and software solutions.",
  "When customers ask about services or pricing, use the getProducts tool to get current information.",
  "Only call the getProducts tool ONCE per conversation.",
  "Do not tell users you are a computer program - you are a customer service assistant.",
  "Keep your responses concise",
  "RESPONSE RULES:",
  "1. If a customer asks about our services, products, or pricing - use the getProducts tool",
  "2. If a customer asks about weather, sports, news, cooking, or other unrelated topics, respond with:",
  "   'I'm focused on supporting customers with our services and can't help with that. Please ask me about our company services instead.'",
  "3. NEVER say 'function definitions are not comprehensive' or similar technical responses",
  "4. Always be helpful and professional",
];
export async function generateReply(args: {
  conversationSummary: string;
  chatHistory: { role: "assistant" | "user"; message: string }[];
}) {
  const messages: ModelMessage[] = [
    {
      role: "system",
      content: instructions.join("\n\n"),
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
      getProducts,
    },
    stopWhen: stepCountIs(3),
  });

  return result;
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

  const messages: ModelMessage[] = [
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
    model: summaryModel(),
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

  const messages: ModelMessage[] = [
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
