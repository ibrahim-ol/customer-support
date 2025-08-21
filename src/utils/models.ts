import { createWorkersAI } from "workers-ai-provider";
import { Config } from "./config.ts";
import OpenAI from "openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { extractReasoningMiddleware, wrapLanguageModel } from "ai";

const workersAi = () =>
  createWorkersAI({
    accountId: Config.CLOUDFLARE_ACCOUNT_ID,
    apiKey: Config.CLOUDFLARE_WORKER_AI_KEY,
  });

const openRouter = createOpenRouter({
  apiKey: Config.OPENROUTER_API_KEY,
});

export const modelList = {
  gptOss20b: "@cf/openai/gpt-oss-20b",
  llama4scout: "@cf/meta/llama-4-scout-17b-16e-instruct",
  llama3: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  gemma3: "@cf/google/gemma-3-12b-it",
  deepSeekR1: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
  mistral: "@cf/mistralai/mistral-small-3.1-24b-instruct",
  bartLarge: "@cf/facebook/bart-large-cnn", // good with summarization
};

const client = createOpenAICompatible({
  apiKey: Config.LOCAL_LLM_API_KEY,
  name: "JAN",
  baseURL: Config.LOCAL_LLM_BASE_URL, // Jan local server
});

export const replyModel = () =>
  wrapLanguageModel({
    model: client("Jan-v1-4B-Q4_K_M"),
    middleware: extractReasoningMiddleware({ tagName: "think" }),
  });

// export const replyModel = () =>
//   openRouter.completion("deepseek/deepseek-r1-0528-qwen3-8b:free");
//   workersAi()(modelList.deepSeekR1, { safePrompt: true });

export const summaryModel = () => replyModel();
// export const summaryModel = () => workersAi()(modelList.gemma3);
// export const summaryModel = () =>
// openRouter.completion("deepseek/deepseek-r1-0528-qwen3-8b:free");

export const openai = new OpenAI({
  apiKey: Config.CLOUDFLARE_WORKER_AI_KEY,
  baseURL: `https://api.cloudflare.com/client/v4/accounts/${Config.CLOUDFLARE_ACCOUNT_ID}/ai/v1`,
});
