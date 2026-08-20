// lib/actions/sync.action.ts
"use server";

import { prisma } from "../db";
import {
  updatePreferencesFromPlannerResponse,
  updateTripFromPlannerResponse,
} from "../ai/planner";
import { AITripPlanningResponse } from "../validations";
import { requireUser } from "@/auth";

export const syncUIPreference = async (
  tripId: string,
  uiDeltaData: Partial<AITripPlanningResponse["updatedTripData"]>,
) => {
  try {
    // Pass standard prisma client straight to your single mapping function
    await updateTripFromPlannerResponse(prisma, tripId, uiDeltaData);
    return { success: true };
  } catch (err) {
    console.error("Direct UI sync action failed:", err);
    return { success: false };
  }
};

export const syncTravelPreferencesAction = async (
  uiPreferencesData: AITripPlanningResponse["travelPreferences"],
) => {
  try {
    // 1. Get the authenticated user ID from Clerk safely on the server side
    const user = await requireUser();
    if (!user.id) throw new Error("Unauthorized");

    // 2. Pass standard prisma client straight to your new dedicated helper
    await updatePreferencesFromPlannerResponse(prisma, uiPreferencesData);
    // If user.clerkID doesn't work, change to user.id

    return { success: true };
  } catch (err) {
    console.error("Direct UI preferences sync action failed:", err);
    return { success: false };
  }
};
