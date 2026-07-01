"use server";

import { prisma } from "../db";
import { requireUser } from "@/auth";

export async function getTrips() {
  const user = await requireUser();

  try {
    return prisma.trip.findMany({
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
      },
    });
  } catch (err) {
    console.error("Failed to get user trips", err);
    return [];
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
        itineraryJson: true, // Crucial: Includes data payload for your frontend planner view
        updatedAt: true,
      },
    });

    return trip;
  } catch (err) {
    console.error(`Critical: Failed to fetch trip ID ${tripId}:`, err);
    return [];
  }
}
