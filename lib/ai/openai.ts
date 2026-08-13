import "server-only";
import OpenAI from "openai";

// Configures OpenAI to automatically try up to 3 times on connection drops or rate limits
let client: OpenAI | null = null;

export const getOpenAIClient = (): OpenAI => {
  if (client) return client;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  client = new OpenAI({ apiKey, maxRetries: 3, timeout: 30_000 });
  return client;
};
