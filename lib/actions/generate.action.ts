// lib/actions/generate.action.ts
"use server";

import { prisma } from "../db";
import { GeneratorSubmission } from "@/types/global";
import {
  updatePreferencesFromPlannerResponse,
  updateTripFromPlannerResponse,
} from "../ai/planner";
import { generateService } from "../ai/generator";
import { Prisma } from "../generated/prisma";
import { requireUser } from "@/auth";

export const startItineraryWithFullSnapshotAction = async (
  tripId: string,
  finalSnapshot: GeneratorSubmission,
) => {
  try {
    const user = await requireUser();

    // 1. Group the final synchronization into a single atomic transaction
    const synchronizedData = await prisma.$transaction(async (tx) => {
      // Step A: Force update the main Trip row fields with the absolute final snapshot data and return the entry
      const finalTrip = await updateTripFromPlannerResponse(
        tx,
        tripId,
        finalSnapshot.tripData,
      );

      // Step B: Force sync the final travel preferences JSON data to the User profile row
      let finalPreferences = null;
      if (finalSnapshot.travelPreferences) {
        finalPreferences = await updatePreferencesFromPlannerResponse(
          tx,
          finalSnapshot.travelPreferences,
        );
      }

      // Return the final user's trip and preferences records committed to your Neon DB
      return {
        finalTrip,
        finalPreferences,
      };
    });

    const dateAnchorString = synchronizedData.finalTrip.startDate
      ? new Date(synchronizedData.finalTrip.startDate)
          .toISOString()
          .split("T")[0]
      : null;

    // 2. KICK OFF PHASE 4B ITINERARY GENERATION PIPELINE
    const validatedItinerary = await generateService({
      tripId,
      finalSnapShot: {
        tripData: {
          origin: synchronizedData.finalTrip.origin,
          destination: synchronizedData.finalTrip.destination,
          travelers: synchronizedData.finalTrip.travelers,
          budgetTier: finalSnapshot.tripData.budgetTier, // Enums aligned securely
          duration: finalSnapshot.tripData.duration,
          interests: finalSnapshot.tripData.interests,
        },
        travelPreferences: finalSnapshot.travelPreferences,
      },
      startDate: dateAnchorString,
    });

    // 3. PERSIST THE BLUEPRINT ARTIFACT TO COLD STORAGE
    // We update the single Json column and advance the status flag securely
    await prisma.trip.update({
      where: {
        id: tripId,
        userId: user.id, // Defensive ownership query boundary check preserved
      },
      data: {
        status: "COMPLETED", // Advance our state machine!
        itineraryJson: validatedItinerary as Prisma.InputJsonValue, // 🛡️ Airtight database-level cast!
      },
    });

    // 4. RETURN CLEAN DOMAIN ARTIFACT DTO
    // Returning the clean data array blocks internal raw DB leaks from the chatbox view
    return {
      success: true,
      data: validatedItinerary,
    };
  } catch (err) {
    console.error("Failed to transition trip to generation phase:", err);
    return {
      success: false,
      error: "Failed to initialize itinerary builder engine.",
    };
  }
};
