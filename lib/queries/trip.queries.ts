"use server";

import { prisma } from "../db";
import { requireUser } from "@/auth";
import { toTripDTO } from "../utils";
import { TripDTO } from "@/types/global";

export const getTrips = async (): Promise<TripDTO[]> => {
  const user = await requireUser();

  try {
    const trips = await prisma.trip.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        destination: true,
        travelers: true,
        budgetTier: true,
        interests: true,
        origin: true,
        startDate: true,
        endDate: true,
        budget: true,
        status: true,
        conversation: {
          select: {
            id: true,
          },
        },
        updatedAt: true,
      },
    });

    return trips.map(toTripDTO);
  } catch (err) {
    console.error("Critical: Failed to fetch user trip index:", err);
    throw new Error("Failed to fetch user trips");
  }
};

export const getTripById = async (tripId: string) => {
  const user = await requireUser();

  try {
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId: user.id,
      },
      select: {
        id: true,
        title: true,
        destination: true,
        travelers: true,
        budgetTier: true,
        interests: true,
        origin: true,
        startDate: true,
        endDate: true,
        budget: true,
        status: true,
        itineraryJson: true, // Crucial: Includes data payload for your frontend planner view
        updatedAt: true,
      },
    });

    return trip ? toTripDTO(trip) : null;
  } catch (err) {
    console.error(`Critical: Failed to fetch trip ID ${tripId}:`, err);
    throw new Error("Failed to find user trip");
  }
};
