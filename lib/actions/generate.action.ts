// lib/actions/generate.action.ts
"use server";

import { prisma } from "../db";
import { PlannerSubmission } from "@/types/global";
import {
  updatePreferencesFromPlannerResponse,
  updateTripFromPlannerResponse,
} from "../ai/planner";
import { auth } from "@clerk/nextjs/server";

export const startItineraryWithFullSnapshotAction = async (
  tripId: string,
  finalSnapshot: PlannerSubmission,
) => {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    // 1. Group the final synchronization into a single atomic transaction
    await prisma.$transaction(async (tx) => {
      // Step A: Force update the main Trip row fields with the absolute final snapshot data
      await updateTripFromPlannerResponse(tx, tripId, finalSnapshot.tripData);

      // Step B: Force sync the final travel preferences JSON data to the User profile row
      if (finalSnapshot.travelPreferences) {
        await updatePreferencesFromPlannerResponse(
          tx,
          clerkUserId,
          finalSnapshot.travelPreferences,
        );
      }
    });

    // 2. KICK OFF PHASE 4B / PHASE 7 BACKGROUND ORCHESTRATION PIPELINE
    // This is where you will asynchronously spin off your Amadeus/Viator background worker!
    // triggerTripEnrichmentPipeline(tripId);

    return { success: true };
  } catch (err) {
    console.error("Failed to transition trip to generation phase:", err);
    return {
      success: false,
      error: "Failed to initialize itinerary builder engine.",
    };
  }
};
