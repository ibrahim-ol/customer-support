export const initializeConfig = () => {
  // in dev
  // TODO check if exists
  if (process && process.loadEnvFile) {
    process.loadEnvFile(".env");
  }
};
initializeConfig();
export const Config = {
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID ?? "",
  CLOUDFLARE_WORKER_AI_KEY: process.env.CLOUDFLARE_WORKER_AI_TOKEN ?? "",
};
