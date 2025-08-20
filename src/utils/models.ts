import { createWorkersAI } from "workers-ai-provider";
import { Config } from "./config.ts";
import OpenAI from "openai";

const workersAi = () =>
  createWorkersAI({
    accountId: Config.CLOUDFLARE_ACCOUNT_ID,
    apiKey: Config.CLOUDFLARE_WORKER_AI_KEY,
  });

export const modelList = {
  gptOss20b: "@cf/openai/gpt-oss-20b",
  llama4scout: "@cf/meta/llama-4-scout-17b-16e-instruct",
  gemma3: "@cf/google/gemma-3-12b-it",
  deepSeekR1: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
  bartLarge: "@cf/facebook/bart-large-cnn", // good with summarization
};

export const replyModel = () =>
  workersAi()(modelList.llama4scout, { safePrompt: true });

export const summaryModel = () => workersAi()(modelList.gemma3);

export const openai = new OpenAI({
  apiKey: Config.CLOUDFLARE_WORKER_AI_KEY,
  baseURL: `https://api.cloudflare.com/client/v4/accounts/${Config.CLOUDFLARE_ACCOUNT_ID}/ai/v1`,
});
