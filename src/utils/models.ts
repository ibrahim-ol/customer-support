import { Config } from "./config.ts";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { extractReasoningMiddleware, wrapLanguageModel } from "ai";

const client = createOpenAICompatible({
  apiKey: Config.LOCAL_LLM_API_KEY,
  name: "JAN",
  baseURL: Config.LOCAL_LLM_BASE_URL, // Jan local server
});

const janLocal = wrapLanguageModel({
  model: client("Jan-v1-4B-Q4_K_M"),
  middleware: extractReasoningMiddleware({ tagName: "think" }),
});

const googleGemini = createGoogleGenerativeAI({
  apiKey: Config.GOOGLE_AI_API_KEY,
})("gemini-2.5-flash-lite");

export const replyModel = () => googleGemini;

export const summaryModel = () => googleGemini;
