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
        updatedAt: true,
        conversation: {
          select: {
            id: true,
          },
        },
        // 🔥 Performance Optimization: We explicitly set this to false/omitted during SQL loading
        // to prevent Postgres from extracting megabytes of text data on index dashboard pages.
      },
    });

    return trips.map((trip) => {
      return toTripDTO({
        ...trip,
        itineraryJson: null,
      } as any);
    });
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
      include: {
        conversation: true,
      },
    });

    return trip ? toTripDTO(trip) : null;
  } catch (err) {
    console.error(`Critical: Failed to fetch trip ID ${tripId}:`, err);
    throw new Error("Failed to find user trip");
  }
};
