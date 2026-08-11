"use server";

import { prisma } from "../db";
import { requireUser } from "@/auth";
import { toTripDTO } from "../utils";
import { TripDTO } from "@/types/global";

export async function getTrips(): Promise<TripDTO[]> {
  const user = await requireUser();

  try {
    const trips = await prisma.trip.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        destination: true,
        origin: true,
        startDate: true,
        endDate: true,
        budget: true,
        status: true,
        updatedAt: true,
        travelers: true,
        budgetTier: true,
        interests: true,
        conversation: {
          select: {
            id: true,
          },
        },
      },
    });

    return trips.map(toTripDTO);
  } catch (err) {
    console.error("Failed to get user trips", err);
    throw new Error("Failed to fetch trips");
  }
}

export async function getTripById(tripId: string) {
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
        origin: true,
        startDate: true,
        endDate: true,
        budget: true,
        status: true,
        updatedAt: true,
        travelers: true,
        budgetTier: true,
        interests: true,
        conversation: {
          select: {
            id: true,
          },
        },
      },
    });

    return trip;
  } catch (err) {
    console.error(`Critical: Failed to fetch trip ID ${tripId}:`, err);
    return [];
  }
}
