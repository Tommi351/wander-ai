import OpenAI from "openai";

// Configures OpenAI to automatically try up to 3 times on connection drops or rate limits
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Missing OPENAI_API_KEY");
}

export const openAIClient = new OpenAI({
  apiKey,
  maxRetries: 3,
});
