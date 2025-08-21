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
  llama3: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  gemma3: "@cf/google/gemma-3-12b-it",
  deepSeekR1: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
  mistral: "@cf/mistralai/mistral-small-3.1-24b-instruct",
  bartLarge: "@cf/facebook/bart-large-cnn", // good with summarization
};

export const replyModel = () =>
  workersAi()(modelList.llama3, { safePrompt: true });

export const summaryModel = () => workersAi()(modelList.gemma3);

export const openai = new OpenAI({
  apiKey: Config.CLOUDFLARE_WORKER_AI_KEY,
  baseURL: `https://api.cloudflare.com/client/v4/accounts/${Config.CLOUDFLARE_ACCOUNT_ID}/ai/v1`,
});
