"use server";

import { prisma } from "../db";
import { toTripDTO } from "../utils";
import {
  CreateTripSchema,
  UpdateTripSchema,
  CreateTripFormInput, // The raw input type (with strings)
  UpdateTripFormInput, // The raw partial input type
} from "../validations";
import { requireUser } from "@/auth";

export const getTrips = async () => {
  const user = await requireUser();

  try {
    const trips = await prisma.trip.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
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

    return {
      success: true,
      data: trips.map(toTripDTO),
    };
  } catch (err) {
    console.error("Critical: Failed to fetch user trip index:", err);
    return { success: false, error: "Failed to fetch user trips" };
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
        origin: true,
        startDate: true,
        endDate: true,
        budget: true,
        status: true,
        itineraryJson: true, // Crucial: Includes data payload for your frontend planner view
        updatedAt: true,
      },
    });

    return { success: true, data: trip ? toTripDTO(trip) : null };
  } catch (err) {
    console.error(`Critical: Failed to fetch trip ID ${tripId}:`, err);
    return { success: false, error: "Failed to find user trip" };
  }
};

export const createTrip = async (input: CreateTripFormInput) => {
  const user = await requireUser();

  const data = CreateTripSchema.parse(input);

  const title = data.title?.trim() || `${data.destination} Trip`;

  try {
    const trip = await prisma.trip.create({
      data: {
        title,
        destination: data.destination,
        origin: data.origin,
        startDate: data.startDate,
        endDate: data.endDate,
        budget: data.budget,
        userId: user.id,
        itineraryJson: {},
      },
    });

    return {
      success: true,
      data: toTripDTO(trip),
    };
  } catch (err) {
    console.error("Can't create trip", err);
    return { success: false, error: "Failed to create user trip" };
  }
};

export const updateTrip = async (
  tripId: string,
  input: UpdateTripFormInput,
) => {
  const user = await requireUser();

  // Validates incoming keys. Missing keys are safely marked 'undefined'
  const data = UpdateTripSchema.parse(input);

  try {
    // If a new title or destination is supplied, prepare the title overwrite cleanly
    let updatedTitle = data.title?.trim();
    if (!updatedTitle && data.destination) {
      // Only auto-generate a title if they specifically changed the destination without giving a title
      updatedTitle = `${data.destination} Trip`;
    }

    const trip = await prisma.trip.update({
      where: {
        id: tripId,
        userId: user.id, // Enforces security: Users can only edit their own rows
      },
      data: {
        ...data, // Spreads properties safely. 'undefined' values are skipped by Prisma!
        ...(updatedTitle ? { title: updatedTitle } : {}),
      },
    });

    return { success: true, data: toTripDTO(trip) };
  } catch (err) {
    console.error(`Critical: Failed to update trip ID ${tripId}:`, err);
    return { success: false, error: "Failed to update user trip" };
  }
};

export const deleteTrip = async (tripId: string) => {
  const user = await requireUser();

  try {
    await prisma.$transaction(async (tx) => {
      // STEP 2a: Delete the child data first (TripVersion)
      // We use deleteMany because a trip can have multiple versions
      await tx.tripVersion.deleteMany({
        where: {
          tripId: tripId,
        },
      });

      // STEP 2b: Now that the history is wiped, delete the parent (Trip)
      await tx.trip.delete({
        where: {
          id: tripId,
          userId: user.id,
        },
      });
    });

    // 🌟 ADD THIS: Tell the frontend the deletion succeeded!
    return { success: true, message: "Trip successfully deleted" };
  } catch (err) {
    console.error(
      `Critical: Failed to delete trip with trip ID ${tripId}:`,
      err,
    );
    return { success: false, error: "Failed to delete user trip" };
  }
};
