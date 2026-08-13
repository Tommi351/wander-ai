"use server";

import type OpenAI from "openai";
import { getOpenAIClient } from "./openai";
import { prisma } from "../db";

import { PlannerServiceInput } from "@/types/global";
import {
  AITripPlanningResponseSchema,
  type UserPreferences,
} from "../validations";
import { PLANNER_SYSTEM_PROMPT } from "./prompts";
import { AITripPlanningResponse } from "../validations";
import { BudgetTier, Prisma } from "../generated/prisma";

import { z } from "zod";
import { addDays } from "../utils";

const plannerJsonSchema = z.toJSONSchema(AITripPlanningResponseSchema);

// Dictionary to map lower-case Zod strings to upper-case Prisma enums
const BUDGET_TIER_MAP: Record<"budget" | "mid-range" | "luxury", BudgetTier> = {
  budget: BudgetTier.BUDGET,
  "mid-range": BudgetTier.MID_RANGE,
  luxury: BudgetTier.LUXURY,
};

export const plannerService = async ({
  conversationHistory,
  currentTripState,
  userPreferences,
}: PlannerServiceInput): Promise<AITripPlanningResponse> => {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: PLANNER_SYSTEM_PROMPT,
    },

    {
      role: "developer",
      content: `Current Trip State:

${JSON.stringify(currentTripState)}

Use this information to determine
which question should be asked next.

Do not ask again
for fields already collected.

The current state is authoritative.

Never remove existing information.

Only add or modify fields when explicitly provided.
`,
    },
    {
      role: "developer",
      content: `User Travel Preferences:

${JSON.stringify(userPreferences)}

Use these preferences from the user when asking questions.

Do not overwrite trip-specific information.`,
    },

    ...conversationHistory,
  ];

  const response = await getOpenAIClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages,
    temperature: 0.2,
    max_completion_tokens: 1000,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "planner_response",
        strict: true,
        schema: plannerJsonSchema,
      },
    },
  });

  const choice = response.choices[0];

  if (!choice?.message?.content) {
    throw new Error("Planner returned no content.");
  }

  const parsed = AITripPlanningResponseSchema.parse(
    JSON.parse(choice.message.content),
  );

  return parsed;
};

export async function updateTripFromPlannerResponse(
  db: Prisma.TransactionClient | typeof prisma,
  tripId: string,
  data: Partial<AITripPlanningResponse["updatedTripData"]>,
) {
  const existingTrip = await db.trip.findUnique({
    where: { id: tripId },
    select: {
      startDate: true,
    },
  });

  const updateData: Prisma.TripUpdateInput = {
    origin: data.origin ?? undefined,
    destination: data.destination ?? undefined,
    travelers: data.travelers ?? undefined,
    budgetTier: data.budgetTier ? BUDGET_TIER_MAP[data.budgetTier] : undefined,
    interests:
      data.interests && data.interests.length > 0 ? data.interests : undefined,
  };

  if (data.duration !== undefined && existingTrip?.startDate) {
    updateData.endDate = addDays(
      existingTrip.startDate,
      data.duration as number,
    );
  }

  return db.trip.update({
    where: {
      id: tripId,
    },
    data: updateData,
  });
}

export async function updatePreferencesFromPlannerResponse(
  db: Prisma.TransactionClient | typeof prisma,
  clerkUserId: string, // Match your Clerk session ID key naming convention
  preferencesData: NonNullable<AITripPlanningResponse["travelPreferences"]>,
) {
  if (!preferencesData) return null;

  // 1. Fetch the user's existing JSON preferences block to prevent wiping out unmentioned keys
  const user = await db.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { preferences: true },
  });

  const existingPreferences = (user?.preferences as UserPreferences) || {};

  // 2. Compute a clean, shallow-merged delta object
  const updatedPreferencesBlock = {
    ...existingPreferences,
    pace: preferencesData.pace ?? existingPreferences.pace,
    travelStyle: preferencesData.travelStyle ?? existingPreferences.travelStyle,
    priority: preferencesData.priority ?? existingPreferences.priority,
    dietaryRestrictions:
      preferencesData.dietaryRestrictions ??
      existingPreferences.dietaryRestrictions,
    spendingFlexibility:
      preferencesData.spendingFlexibility ??
      existingPreferences.spendingFlexibility,
    planningStyle:
      preferencesData.planningStyle ?? existingPreferences.planningStyle,
    weatherPreference:
      preferencesData.weatherPreference ??
      existingPreferences.weatherPreference,
    avoidCategories:
      preferencesData.avoidCategories ?? existingPreferences.avoidCategories,
  };

  // 3. Write the fully synchronized JSON object back to your User model
  return db.user.update({
    where: {
      clerkId: clerkUserId,
    },
    data: {
      // Prisma cleanly serializes this JavaScript object directly into Postgres JSONB format
      preferences: updatedPreferencesBlock as Prisma.InputJsonValue,
    },
  });
}
